export type Language = 'mr' | 'hi' | 'en';

export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE';

export type NetworkStatus = 'synced' | 'pending' | 'offline' | 'syncing';

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  abhaId?: string;
  village: string;
  phone: string;
  registrationDate: string;
  lastVisit?: string;
  lastTriage?: UrgencyLevel;
  symptoms?: string[];
  referrals?: string[];
  consultations?: string[];
  notes?: string;
}

export interface FollowUpItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  category: string;
  urgency: UrgencyLevel;
  visited: boolean;
  phone: string;
}
