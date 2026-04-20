export interface InboxMessage {
  id: string;
  platformAccountId: string;
  platformMessageId: string;
  conversationId: string | null;
  messageType: 'comment' | 'dm' | 'mention' | 'reply';
  senderName: string | null;
  senderUsername: string | null;
  senderAvatarUrl: string | null;
  content: string | null;
  mediaUrl: string | null;
  parentPostId: string | null;
  isRead: boolean;
  isArchived: boolean;
  assignedTo: string | null;
  platformCreatedAt: string | null;
  createdAt: string;
}

export interface InboxReply {
  id: string;
  inboxMessageId: string;
  userId: string;
  content: string;
  status: 'sent' | 'failed';
  createdAt: string;
}

export interface Conversation {
  id: string;
  platform: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: InboxMessage[];
}
