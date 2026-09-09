export type Language = 'mr' | 'hi' | 'en' | 'kn';

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
  allergies?: string;
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

export interface MasterSymptom {
  id: string;
  key: string;
  categoryKey: string;
  icon: string;
  labels: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  aliases?: string[];
  urgency?: UrgencyLevel;
  triageHelp?: {
    guidance: {
      en: string;
      mr: string;
      hi: string;
      kn?: string;
    };
    firstAid: {
      en: string[];
      mr: string[];
      hi: string[];
      kn?: string[];
    };
  };
}

export interface SymptomCategory {
  key: string;
  title: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  icon: string;
}

