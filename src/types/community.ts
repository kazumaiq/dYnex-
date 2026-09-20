export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';

export interface PrivacySettings {
  publicProfile: boolean;
  showTraces: boolean;
  showSignals: boolean;
}

export interface UserIdentity {
  id: string;
  username: string; // e.g. 'neonvoid' (displayed as @neonvoid)
  email: string;
  avatarUrl?: string;
  nodeNumber: string; // e.g. 'NODE_02841'
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  privacySettings: PrivacySettings;
}

export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SignalComment {
  id: string;
  releaseId: string;
  userId: string;
  username: string;
  content: string; // max 280 chars
  status: ModerationStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TraceItem {
  id: string; // e.g. 'TRACE_000001'
  traceId?: string; // DB trace_id
  userId?: string;
  username: string;
  content: string; // max 140 chars (mapped to message in DB)
  status: ModerationStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  deletedAt?: string;
  reviewedAt?: string;
}

export interface SignatureItem {
  id: string;
  userId: string;
  username: string;
  phrase?: string;
  status: ModerationStatus;
  createdAt: string;
  seed: number; // deterministic layout seed
}

export type TransmissionStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface TransmissionItem {
  id: string; // 'TRN-XXXXX'
  userId?: string;
  username: string;
  contact: string; // Email or Telegram
  subject: string;
  message: string;
  status: TransmissionStatus;
  createdAt: string;
}

export type CollabType = 'FIT' | 'COLLAB';
export type CollabStatus = 'NEW' | 'LISTENED' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED';

export interface CollabRequestItem {
  id: string; // 'COL-XXXXX'
  userId?: string;
  username: string;
  contact: string;
  type: CollabType;
  message: string;
  audioFileName: string;
  audioFileSize: number; // in bytes
  audioFileUrl: string; // Blob or remote URL
  status: CollabStatus;
  createdAt: string;
}

export interface ModerationActionLog {
  id: string;
  moderatorUsername: string;
  targetType: 'SIGNAL' | 'TRACE' | 'SIGNATURE' | 'TRANSMISSION' | 'COLLAB' | 'USER';
  targetId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface SignalBoardStats {
  activeSignals: number;
  archivedTraces: number;
  approvedSignatures: number;
  totalMembers: number;
  transmissionsCount: number;
}

export interface UnreleasedTrack {
  id: string;
  title: string;
  artists: string;
  year: number;
  genre: string;
  coverUrl: string;
  audioUrl?: string;
  description: string;
  status: 'LOCKED' | 'PREVIEW' | 'UNLOCKED';
  accessCode?: string;
  createdAt: string;
}
