import React, { createContext, useContext, useState } from 'react';
import type { Language, NetworkStatus, Patient, FollowUpItem, UrgencyLevel } from '../types';
import { translations, type TranslationDict } from '../constants/translations';

interface TriageResult {
  urgency: UrgencyLevel;
  reason: string;
  symptoms: string[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  networkStatus: NetworkStatus;
  setNetworkStatus: (s: NetworkStatus) => void;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeScreen: string;
  setActiveScreen: (s: string) => void;
  patients: Patient[];
  addPatient: (p: Omit<Patient, 'id' | 'registrationDate'>) => Patient;
  currentPatient: Patient | null;
  setCurrentPatient: (p: Patient | null) => void;
  triageResult: TriageResult | null;
  setTriageResult: (r: TriageResult | null) => void;
  followups: FollowUpItem[];
  toggleVisited: (id: string) => void;
  snackbar: string | null;
  showSnackbar: (msg: string, duration?: number) => void;
}

const DEMO_ACCOUNT = {
  username: 'ASHA_NAND_023',
  password: 'asha2024',
};

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P001',
    name: 'Rekha Patil',
    age: 28,
    sex: 'Female',
    abhaId: '91-8823-4410-12',
    village: 'Chinchpada',
    phone: '9823011234',
    registrationDate: '15 ऑगस्ट 2024',
    lastVisit: 'आज',
    lastTriage: 'EMERGENCY',
    symptoms: ['श्वास घेण्यास त्रास', 'गर्भावस्था', 'पायांना सूज'],
    consultations: ['7 सप्टेंबर 2024 — Dr. Mehta (Dhadgaon PHC)'],
    referrals: ['7 सप्टेंबर 2024 — District Hospital Nandurbar'],
    notes: 'ANC तिसऱ्या तिमाहीत. उच्च-जोखीम गर्भावस्था.',
  },
  {
    id: 'P002',
    name: 'Sunita Kamble',
    age: 34,
    sex: 'Female',
    abhaId: '91-3341-9920-55',
    village: 'Chinchpada',
    phone: '9421056789',
    registrationDate: '3 जुलै 2024',
    lastVisit: '3 दिवसांपूर्वी',
    lastTriage: 'ROUTINE',
    symptoms: ['खोकला'],
    consultations: ['10 जुलै 2024 — Dr. Mehta'],
    referrals: [],
    notes: 'TB उपचार — Day 14.',
  },
  {
    id: 'P003',
    name: 'Meera Jadhav',
    age: 45,
    sex: 'Female',
    abhaId: '91-7722-1104-88',
    village: 'Dhadgaon',
    phone: '9765432109',
    registrationDate: '20 जून 2024',
    lastVisit: '1 आठवड्यापूर्वी',
    lastTriage: 'URGENT',
    symptoms: ['अशक्तपणा', 'ताप'],
    consultations: ['25 जून 2024 — Dr. Mehta'],
    referrals: [],
    notes: 'तीव्र रक्तक्षय. लोह गोळ्या सुरू.',
  },
];

const INITIAL_FOLLOWUPS: FollowUpItem[] = [
  {
    id: 'F1',
    patientId: 'P001',
    patientName: 'Rekha Patil',
    patientAge: 28,
    patientSex: 'Female',
    category: 'ANC Post-discharge',
    urgency: 'EMERGENCY',
    visited: false,
    phone: '9823011234',
  },
  {
    id: 'F2',
    patientId: 'P002',
    patientName: 'Sunita Kamble',
    patientAge: 34,
    patientSex: 'Female',
    category: 'TB Day 14',
    urgency: 'URGENT',
    visited: false,
    phone: '9421056789',
  },
  {
    id: 'F3',
    patientId: 'P003',
    patientName: 'Baby Arjun',
    patientAge: 1,
    patientSex: 'Male',
    category: 'Recurring Fever',
    urgency: 'URGENT',
    visited: false,
    phone: '9123456780',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('mr');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('synced');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState('login');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(INITIAL_PATIENTS[0]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [followups, setFollowups] = useState<FollowUpItem[]>(INITIAL_FOLLOWUPS);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const t = translations[language];

  const login = (username: string, password: string): boolean => {
    if (username === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password) {
      setIsLoggedIn(true);
      setActiveScreen('home');
      setActiveTab('home');
      return true;
    }
    // Offline login simulation
    if (networkStatus === 'offline' && username === DEMO_ACCOUNT.username) {
      setIsLoggedIn(true);
      setActiveScreen('home');
      setActiveTab('home');
      showSnackbar('इंटरनेट कनेक्शन उपलब्ध नाही. ऑफलाइन मोड सुरू आहे.');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveScreen('login');
    setActiveTab('home');
  };

  const addPatient = (pData: Omit<Patient, 'id' | 'registrationDate'>): Patient => {
    const newP: Patient = {
      ...pData,
      id: `P${Date.now()}`,
      registrationDate: new Date().toLocaleDateString('mr-IN'),
      lastTriage: undefined,
    };
    setPatients(prev => [newP, ...prev]);
    setCurrentPatient(newP);
    return newP;
  };

  const toggleVisited = (id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, visited: !f.visited } : f));
  };

  const showSnackbar = (msg: string, duration = 3000) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(null), duration);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      networkStatus, setNetworkStatus,
      isLoggedIn, login, logout,
      activeTab, setActiveTab,
      activeScreen, setActiveScreen,
      patients, addPatient, currentPatient, setCurrentPatient,
      triageResult, setTriageResult,
      followups, toggleVisited,
      snackbar, showSnackbar,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
