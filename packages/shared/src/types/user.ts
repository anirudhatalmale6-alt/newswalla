export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  timezone: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'member';
  canPublish: boolean;
  user?: User;
}

export interface ApprovalRequest {
  id: string;
  postId: string;
  teamId: string;
  requestedBy: string;
  reviewedBy: string | null;
  status: 'pending' | 'approved' | 'rejected';
  comment: string | null;
  createdAt: string;
  reviewedAt: string | null;
}
