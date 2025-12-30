export type UserRole = 'caller' | 'host' | 'admin';

export type Gender = 'male' | 'female';

export type HostCategory = 'Star' | 'Relationship' | 'Marriage' | 'Confidence';

export type HostStatus = 'available' | 'busy' | 'offline';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  country: string;
  role: UserRole;
  avatar?: string;
}

export interface Host extends User {
  rating: number;
  pricePerMinute: number;
  status: HostStatus;
  totalCalls: number;
  totalMinutes: number;
  verificationStatus: VerificationStatus;
  earnings: number;
  languages?: string[];
  category?: HostCategory;
}

export interface Caller extends User {
  balance: number;
  totalSpent: number;
}

export interface CallSession {
  id: string;
  hostId: string;
  callerId: string;
  type: 'audio' | 'video';
  duration: number;
  cost: number;
  startTime: Date;
  endTime?: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}
