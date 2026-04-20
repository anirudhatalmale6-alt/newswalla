import crypto from 'crypto';
import { query, queryOne, run } from '../config/database';

export function createApprovalRequest(postId: string, requestedBy: string) {
  const id = crypto.randomUUID();

  run(
    `INSERT INTO approval_requests (id, post_id, team_id, requested_by, status)
     VALUES (?, ?, 'global', ?, 'pending')`,
    [id, postId, requestedBy]
  );

  // Get requester info for notification
  const requester = queryOne<any>('SELECT full_name, email FROM users WHERE id = ?', [requestedBy]);
  const post = queryOne<any>('SELECT content_global FROM posts WHERE id = ?', [postId]);

  // Notify all admins
  const admins = query<any>("SELECT id FROM users WHERE role = 'admin'", []);
  for (const admin of admins) {
    run(
      `INSERT INTO notifications (id, user_id, type, title, message, data)
       VALUES (?, ?, 'approval_request', ?, ?, ?)`,
      [
        crypto.randomUUID(),
        admin.id,
        'New Post Awaiting Approval',
        `${requester?.full_name || 'An editor'} submitted a post for approval: "${(post?.content_global || '').substring(0, 100)}"`,
        JSON.stringify({ approvalId: id, postId, requestedBy }),
      ]
    );
  }

  return { id, postId, requestedBy, status: 'pending' };
}

export function getPendingApprovals() {
  return query<any>(
    `SELECT ar.*,
            p.content_global, p.scheduled_at, p.status as post_status,
            u.full_name as requester_name, u.email as requester_email
     FROM approval_requests ar
     JOIN posts p ON p.id = ar.post_id
     JOIN users u ON u.id = ar.requested_by
     WHERE ar.status = 'pending'
     ORDER BY ar.created_at DESC`,
    []
  );
}

export function getAllApprovals() {
  return query<any>(
    `SELECT ar.*,
            p.content_global, p.scheduled_at, p.status as post_status,
            u.full_name as requester_name, u.email as requester_email,
            r.full_name as reviewer_name
     FROM approval_requests ar
     JOIN posts p ON p.id = ar.post_id
     JOIN users u ON u.id = ar.requested_by
     LEFT JOIN users r ON r.id = ar.reviewed_by
     ORDER BY ar.created_at DESC`,
    []
  );
}

export function approvePost(approvalId: string, reviewerId: string, comment?: string) {
  const approval = queryOne<any>('SELECT * FROM approval_requests WHERE id = ?', [approvalId]);
  if (!approval) throw Object.assign(new Error('Approval not found'), { status: 404 });
  if (approval.status !== 'pending') throw Object.assign(new Error('Already reviewed'), { status: 400 });

  run(
    `UPDATE approval_requests SET status = 'approved', reviewed_by = ?, comment = ?, reviewed_at = datetime('now') WHERE id = ?`,
    [reviewerId, comment || null, approvalId]
  );

  // Update post status to scheduled or publishing
  const post = queryOne<any>('SELECT scheduled_at FROM posts WHERE id = ?', [approval.post_id]);
  const newStatus = post?.scheduled_at ? 'scheduled' : 'draft';
  run('UPDATE posts SET status = ? WHERE id = ?', [newStatus, approval.post_id]);

  // Notify the editor
  const reviewer = queryOne<any>('SELECT full_name FROM users WHERE id = ?', [reviewerId]);
  run(
    `INSERT INTO notifications (id, user_id, type, title, message, data)
     VALUES (?, ?, 'approval_approved', ?, ?, ?)`,
    [
      crypto.randomUUID(),
      approval.requested_by,
      'Post Approved',
      `${reviewer?.full_name || 'Admin'} approved your post${comment ? ': ' + comment : ''}`,
      JSON.stringify({ approvalId, postId: approval.post_id }),
    ]
  );

  return { success: true, status: 'approved' };
}

export function rejectPost(approvalId: string, reviewerId: string, comment?: string) {
  const approval = queryOne<any>('SELECT * FROM approval_requests WHERE id = ?', [approvalId]);
  if (!approval) throw Object.assign(new Error('Approval not found'), { status: 404 });
  if (approval.status !== 'pending') throw Object.assign(new Error('Already reviewed'), { status: 400 });

  run(
    `UPDATE approval_requests SET status = 'rejected', reviewed_by = ?, comment = ?, reviewed_at = datetime('now') WHERE id = ?`,
    [reviewerId, comment || null, approvalId]
  );

  // Set post back to draft
  run("UPDATE posts SET status = 'draft' WHERE id = ?", [approval.post_id]);

  // Notify the editor
  const reviewer = queryOne<any>('SELECT full_name FROM users WHERE id = ?', [reviewerId]);
  run(
    `INSERT INTO notifications (id, user_id, type, title, message, data)
     VALUES (?, ?, 'approval_rejected', ?, ?, ?)`,
    [
      crypto.randomUUID(),
      approval.requested_by,
      'Post Rejected',
      `${reviewer?.full_name || 'Admin'} rejected your post${comment ? ': ' + comment : ''}`,
      JSON.stringify({ approvalId, postId: approval.post_id }),
    ]
  );

  return { success: true, status: 'rejected' };
}

// Notifications
export function getNotifications(userId: string) {
  return query<any>(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [userId]
  );
}

export function getUnreadCount(userId: string): number {
  const row = queryOne<any>('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]);
  return row?.count || 0;
}

export function markNotificationRead(notificationId: string, userId: string) {
  run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
}

export function markAllRead(userId: string) {
  run('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [userId]);
}
