import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, User, Calendar, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { t, LangCode } from '../i18n/translations';
import api from '../api/client';
import toast from 'react-hot-toast';

interface Approval {
  id: string;
  post_id: string;
  requested_by: string;
  status: string;
  comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  content_global: string;
  scheduled_at: string | null;
  post_status: string;
  requester_name: string;
  requester_email: string;
  reviewer_name?: string;
}

export default function AdminApprovals() {
  const { user } = useAuthStore();
  const lang = (user?.language || 'en') as LangCode;
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [commentModal, setCommentModal] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState('');

  useEffect(() => {
    loadApprovals();
  }, [tab]);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'pending' ? '/approvals/pending' : '/approvals';
      const { data } = await api.get(endpoint);
      setApprovals(data);
    } catch {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessing(id);
    try {
      await api.post(`/approvals/${id}/${action}`, { comment: comment || undefined });
      toast.success(action === 'approve' ? 'Post approved!' : 'Post rejected');
      setCommentModal(null);
      setComment('');
      loadApprovals();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setProcessing('');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
        </div>
        <button onClick={loadApprovals} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Approvals
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : approvals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {tab === 'pending' ? 'No pending approvals' : 'No approval requests yet'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {tab === 'pending' ? 'All posts have been reviewed!' : 'When editors submit posts, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status + Requester */}
                  <div className="flex items-center gap-3 mb-3">
                    {statusBadge(a.status)}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium text-gray-700">{a.requester_name}</span>
                      <span className="text-gray-400">({a.requester_email})</span>
                    </div>
                  </div>

                  {/* Post content preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {a.content_global.length > 300 ? a.content_global.substring(0, 300) + '...' : a.content_global}
                    </p>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Submitted {new Date(a.created_at).toLocaleString()}
                    </span>
                    {a.scheduled_at && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Scheduled for {new Date(a.scheduled_at).toLocaleString()}
                      </span>
                    )}
                    {a.reviewer_name && (
                      <span>Reviewed by {a.reviewer_name} on {new Date(a.reviewed_at!).toLocaleString()}</span>
                    )}
                  </div>

                  {/* Comment if exists */}
                  {a.comment && (
                    <div className="mt-3 flex items-start gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 italic">"{a.comment}"</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {a.status === 'pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setCommentModal({ id: a.id, action: 'approve' })}
                      disabled={processing === a.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setCommentModal({ id: a.id, action: 'reject' })}
                      disabled={processing === a.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {commentModal.action === 'approve' ? 'Approve Post' : 'Reject Post'}
            </h3>
            <p className="text-sm text-gray-500">
              {commentModal.action === 'approve'
                ? 'The post will be scheduled for publishing. Add an optional comment for the editor.'
                : 'The post will be sent back to draft. Add a comment to explain why.'}
            </p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={commentModal.action === 'approve' ? 'Optional comment...' : 'Reason for rejection (recommended)...'}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => { setCommentModal(null); setComment(''); }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(commentModal.id, commentModal.action)}
                disabled={!!processing}
                className={`px-5 py-2 text-white text-sm font-medium rounded-lg disabled:opacity-50 ${
                  commentModal.action === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : commentModal.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
