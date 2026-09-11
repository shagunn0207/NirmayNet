import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, NetworkStatus, Patient, FollowUpItem, UrgencyLevel } from '../types';
import { translations, type TranslationDict } from '../constants/translations';
import { openDatabaseAsync } from '../lib/sqlite';
import { evaluateTriage } from '../utils/triageEngine';
import { api } from '../services/api';

export interface TaskItem {
  id: string;
  title: string;
  category?: string;
  urgency?: UrgencyLevel;
  visited: boolean;
  createdAt?: string;
}

interface TriageResult {
  urgency: UrgencyLevel;
  reason: string;
  symptoms: string[];
  instructions: string[];
  selectedSymptomKeys: string[];
  dominantIcon: string;
}

export type UserAccount = {
  username: string;
  fullName: string;
  role?: string;
  subCentre?: string;
  phc?: string;
  mobile?: string;
  coveredPopulation?: string;
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
  networkStatus: NetworkStatus;
  setNetworkStatus: (s: NetworkStatus) => void;
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
  updateUserAccount: (updatedUser: Partial<UserAccount>) => void;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  isFirstLogin: boolean;
  setIsFirstLogin: (val: boolean) => void;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeScreen: string;
  setActiveScreen: (s: string) => void;

  // Patient data
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  addPatient: (p: Omit<Patient, 'id' | 'registrationDate'>) => Promise<Patient | null>;
  updatePatient: (p: Patient) => void;
  currentPatient: Patient | null;
  setCurrentPatient: (p: Patient | null) => void;

  // Triage & Assessment
  triageResult: TriageResult | null;
  setTriageResult: (r: TriageResult | null) => void;
  lastTriageRecordId: string | null;
  setLastTriageRecordId: (id: string | null) => void;

  // Followup items
  followups: FollowUpItem[];
  toggleVisited: (id: string) => void;
  addFollowup: (patient: Patient, category?: string) => void;
  isFollowup: (patientId: string) => boolean;

  // Editable Tasks (CHANGE 1)
  tasks: TaskItem[];
  addNewTask: (title: string, category?: string, urgency?: UrgencyLevel) => Promise<void>;
  updateTaskItem: (id: string, newTitle: string, visited?: boolean, urgency?: UrgencyLevel) => Promise<void>;
  deleteTaskItem: (id: string) => Promise<void>;

  // Form Draft Persistence (CHANGE 2)
  saveDraftField: (draftId: string, fieldName: string, fieldValue: string) => Promise<void>;
  getDraft: (draftId: string) => Promise<Record<string, string>>;
  clearDraft: (draftId: string) => Promise<void>;

  // Unsaved Changes Navigation Guard (CHANGE 5)
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  showBackConfirmation: boolean;
  setShowBackConfirmation: (val: boolean) => void;
  pendingNavScreen: string | null;
  setPendingNavScreen: (s: string | null) => void;
  confirmBackNavigation: () => void;
  cancelBackNavigation: () => void;

  // Notifications
  snackbar: string | null;
  showSnackbar: (msg: string, duration?: number) => void;
}

const DEMO_ACCOUNT = {
  username: 'shagun',
  password: '123456',
};

// localStorage key for persisted user accounts
const ACCOUNTS_KEY = 'niramaynet_accounts';

type StoredAccount = { username: string; password: string; fullName?: string; role?: string };

const getStoredAccounts = (): StoredAccount[] => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveAccount = (acc: StoredAccount) => {
  const existing = getStoredAccounts();
  const updated = [...existing.filter(a => a.username !== acc.username), acc];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));
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

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'T1',
    title: 'Rekha Patil - ANC Post-Discharge Visit',
    category: 'ANC Care',
    urgency: 'EMERGENCY',
    visited: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'T2',
    title: 'Sunita Kamble - TB Medication Day 14 Followup',
    category: 'TB Dots',
    urgency: 'URGENT',
    visited: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'T3',
    title: 'Baby Arjun - Immunization & Fever Check',
    category: 'Pediatric Care',
    urgency: 'URGENT',
    visited: false,
    createdAt: new Date().toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('niramaynet_language');
      if (saved && ['mr', 'hi', 'en', 'kn'].includes(saved)) return saved as Language;
    } catch {}
    return 'mr';
  });

  // Maps app language to the correct date locale
  const getLangLocale = (lang: Language): string => {
    switch (lang) {
      case 'mr': return 'mr-IN';
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'en': return 'en-IN';
      default: return 'en-IN';
    }
  };
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('synced');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState('login');

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [lastTriageRecordId, setLastTriageRecordId] = useState<string | null>(null);

  const [followups, setFollowups] = useState<FollowUpItem[]>([]);

  // Tasks from SQLite
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Unsaved dialog navigation guard
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [pendingNavScreen, setPendingNavScreen] = useState<string | null>(null);

  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const [snackbar, setSnackbar] = useState<string | null>(null);
  const snackbarTimerRef = React.useRef<any>(null);

  const t = translations[language] ?? translations.mr;

  // Clear snackbar when active screen or tab changes
  useEffect(() => {
    setSnackbar(null);
  }, [activeScreen, activeTab]);

  // Initialize SQLite on mount and load language + tasks
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = await openDatabaseAsync('niramaynet.db');

        // Load language setting
        const langSetting = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['language']);
        if (langSetting && ['mr', 'hi', 'en', 'kn'].includes(langSetting.value)) {
          if (mounted) {
            setLanguageState(langSetting.value as Language);
            try { localStorage.setItem('niramaynet_language', langSetting.value); } catch {}
          }
        }

        // Load tasks from SQLite FIRST
        const dbTasks = await db.getAllAsync<any>('SELECT * FROM tasks ORDER BY created_at DESC');
        if (dbTasks && dbTasks.length > 0) {
          const loaded: TaskItem[] = dbTasks.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category || 'General',
            urgency: (t.urgency as UrgencyLevel) || 'ROUTINE',
            visited: Boolean(t.visited),
            createdAt: t.created_at,
          }));
          if (mounted) setTasks(loaded);
        } else {
          if (mounted) setTasks([]);
        }

        // Fetch backend tasks and merge (online only)
        try {
          const sessStr = localStorage.getItem('niramaynet_session');
          const hasToken = sessStr && JSON.parse(sessStr).access_token;
          if (hasToken) {
            const res = await api.get<any[]>('/tasks/');
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              const backendItems: TaskItem[] = res.data.map(t => ({
                id: t.id,
                title: t.title,
                category: t.category || 'General',
                urgency: (t.urgency as UrgencyLevel) || 'ROUTINE',
                visited: Boolean(t.visited),
                createdAt: t.created_at,
              }));
              if (mounted) {
                setTasks(prev => {
                  const localOnly = prev.filter(t => t.id.startsWith('T'));
                  const backendIds = new Set(backendItems.map(b => b.id));
                  const trueLocalOnly = localOnly.filter(t => !backendIds.has(t.id));
                  return [...backendItems, ...trueLocalOnly];
                });
              }
            }
          }
        } catch {
          // Backend unreachable — local SQLite tasks already loaded above
        }

        // Load followups from SQLite for current user
        const dbFollowups = await db.getAllAsync<any>('SELECT * FROM followups');
        const localItems: FollowUpItem[] = dbFollowups && dbFollowups.length > 0
          ? dbFollowups.map(f => ({
              id: f.id,
              patientId: f.patientId,
              patientName: f.patientName,
              patientAge: Number(f.patientAge),
              patientSex: f.patientSex,
              category: f.category,
              urgency: f.urgency as UrgencyLevel,
              visited: Boolean(f.visited),
              phone: f.phone,
            }))
          : [];
        if (mounted) setFollowups(localItems);

        // Fetch backend follow-ups and merge (online only)
        try {
          const sessStr = localStorage.getItem('niramaynet_session');
          const hasToken = sessStr && JSON.parse(sessStr).access_token;
          if (hasToken) {
            const [res, patientsRes] = await Promise.all([
              api.get<any[]>('/followups/'),
              api.get<any[]>('/patients/'),
            ]);
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              // We need patient metadata for enrichment; build lookup from static and backend patients
              const patientsSnapshot: Record<string, { name: string; age: number; sex: string; phone: string }> = {};
              for (const p of INITIAL_PATIENTS) {
                patientsSnapshot[p.id] = { name: p.name, age: p.age, sex: p.sex, phone: p.phone };
              }
              if (patientsRes.data && Array.isArray(patientsRes.data)) {
                for (const p of patientsRes.data) {
                  patientsSnapshot[p.id] = { name: p.name, age: p.age, sex: p.gender || 'Other', phone: p.phone || '' };
                }
              }
              const backendItems: FollowUpItem[] = res.data.map(f => {
                const meta = patientsSnapshot[f.patient_id];
                // Map backend urgency to local UrgencyLevel
                const urgency: UrgencyLevel =
                  f.urgency === 'EMERGENCY' ? 'EMERGENCY'
                  : f.urgency === 'URGENT' ? 'URGENT'
                  : 'ROUTINE';
                return {
                  id: f.id,
                  patientId: f.patient_id,
                  patientName: meta?.name || `Patient ${f.patient_id.slice(0, 6)}`,
                  patientAge: meta?.age || 0,
                  patientSex: meta?.sex || 'Other',
                  category: f.category,
                  urgency,
                  // Backend `visited` is a boolean, status COMPLETED also counts as visited
                  visited: Boolean(f.visited) || f.status === 'COMPLETED',
                  phone: meta?.phone || '',
                };
              });
              if (mounted) {
                setFollowups(prev => {
                  // Keep local-only records (IDs starting with 'F', i.e. offline-created)
                  const localOnly = prev.filter(f => f.id.startsWith('F'));
                  // Merge: backend records first, then local-only offline additions
                  const backendIds = new Set(backendItems.map(b => b.id));
                  const trueLocalOnly = localOnly.filter(f => !backendIds.has(f.id));
                  return [...backendItems, ...trueLocalOnly];
                });
              }
            }
          }
        } catch {
          // Backend unreachable — local SQLite records already loaded above
        }

        // Load patients from SQLite
        const dbPatients = await db.getAllAsync<any>('SELECT * FROM patients ORDER BY registrationDate DESC');
        if (dbPatients && dbPatients.length > 0) {
          const loadedPatients: Patient[] = dbPatients.map(p => ({
            id: p.id,
            name: p.name,
            age: Number(p.age),
            sex: p.sex as any,
            abhaId: p.abhaId,
            village: p.village,
            phone: p.phone,
            registrationDate: p.registrationDate,
            lastVisit: p.lastVisit,
            lastTriage: p.lastTriage as any,
            symptoms: p.symptoms ? JSON.parse(p.symptoms) : [],
            allergies: p.allergies,
            consultations: p.consultations ? JSON.parse(p.consultations) : [],
            referrals: p.referrals ? JSON.parse(p.referrals) : [],
            notes: p.notes,
          }));
          if (mounted) {
            setPatients(prev => {
              const existingIds = new Set(INITIAL_PATIENTS.map(ip => ip.id));
              const newLocal = loadedPatients.filter(lp => !existingIds.has(lp.id));
              return [...INITIAL_PATIENTS, ...newLocal];
            });
          }
        } else {
          if (mounted) setPatients(INITIAL_PATIENTS);
        }
      } catch (err) {
        console.error('Error initializing SQLite database:', err);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser?.username]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem('niramaynet_language', lang); } catch {}
    openDatabaseAsync('niramaynet.db').then(db => {
      db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['language', lang]);
    });
  };

  const addNewTask = async (title: string, category: string = 'General', urgency: UrgencyLevel = 'ROUTINE') => {
    const trimmedTitle = title.trim();
    let itemId = `T_${Date.now()}`;
    let createdAt = new Date().toISOString();

    // POST to backend when online
    if (networkStatus !== 'offline') {
      try {
        const res = await api.post<any>('/tasks/', {
          title: trimmedTitle,
          category,
          urgency,
        });
        if (res.data && res.data.id) {
          itemId = res.data.id;
          if (res.data.created_at) createdAt = res.data.created_at;
        }
      } catch {
        // Fallback to local creation if backend fails
      }
    }

    const newTask: TaskItem = {
      id: itemId,
      title: trimmedTitle,
      category,
      urgency,
      visited: false,
      createdAt,
    };
    setTasks(prev => [newTask, ...prev]);

    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync(
      'INSERT INTO tasks (id, title, category, urgency, visited, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [newTask.id, newTask.title, newTask.category || '', newTask.urgency || 'ROUTINE', 0, newTask.createdAt]
    );
  };

  const updateTaskItem = async (id: string, newTitle: string, visited?: boolean, urgency?: UrgencyLevel) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          title: newTitle !== undefined ? newTitle.trim() : t.title,
          visited: visited !== undefined ? visited : t.visited,
          urgency: urgency !== undefined ? urgency : t.urgency,
        };
      }
      return t;
    }));

    const db = await openDatabaseAsync('niramaynet.db');
    const existing = tasks.find(t => t.id === id);
    const updatedTitle = newTitle !== undefined ? newTitle.trim() : existing?.title || '';
    const updatedVisited = visited !== undefined ? (visited ? 1 : 0) : (existing?.visited ? 1 : 0);
    const updatedUrgency = urgency !== undefined ? urgency : (existing?.urgency || 'ROUTINE');

    await db.runAsync('UPDATE tasks SET title = ?, visited = ?, urgency = ? WHERE id = ?', [updatedTitle, updatedVisited, updatedUrgency, id]);

    // PATCH to backend when online and this is a backend record (not starting with 'T')
    if (networkStatus !== 'offline' && !id.startsWith('T')) {
      const payload: any = {};
      if (newTitle !== undefined) payload.title = newTitle.trim();
      if (visited !== undefined) payload.visited = visited;
      if (urgency !== undefined) payload.urgency = urgency;

      api.patch(`/tasks/${id}`, payload).catch(() => {
        // Ignore backend sync error — local state already updated
      });
    }
  };

  const deleteTaskItem = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);

    // DELETE on backend when online and this is a backend record (not starting with 'T')
    if (networkStatus !== 'offline' && !id.startsWith('T')) {
      api.delete(`/tasks/${id}`).catch(() => {
        // Ignore backend sync error — local state already updated
      });
    }
  };

  // Draft persistence (CHANGE 2)
  const saveDraftField = async (draftId: string, fieldName: string, fieldValue: string) => {
    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync(
      'INSERT OR REPLACE INTO drafts (draft_id, field_name, field_value) VALUES (?, ?, ?)',
      [draftId, fieldName, fieldValue]
    );
  };

  const getDraft = async (draftId: string): Promise<Record<string, string>> => {
    const db = await openDatabaseAsync('niramaynet.db');
    const rows = await db.getAllAsync<{ field_name: string; field_value: string }>(
      'SELECT field_name, field_value FROM drafts WHERE draft_id = ?',
      [draftId]
    );
    const result: Record<string, string> = {};
    rows.forEach(r => {
      result[r.field_name] = r.field_value;
    });
    return result;
  };

  const clearDraft = async (draftId: string) => {
    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync('DELETE FROM drafts WHERE draft_id = ?', [draftId]);
  };

  const DEFAULT_PROFILE_FIELDS = {
    subCentre: 'Chinchpada',
    phc: 'Dhadgaon PHC',
    mobile: '9823011234',
    coveredPopulation: '1,250 citizens (240 families)',
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    let userObj: UserAccount | null = null;
    
    if (networkStatus !== 'offline') {
      const response = await api.post<any>('/auth/login', { username, password });
      
      if (response.data && response.data.access_token) {
        const { access_token, user } = response.data;
        userObj = {
          username: username,
          fullName: user.name || username,
          role: user.role || 'ASHA Worker',
          subCentre: user.village || DEFAULT_PROFILE_FIELDS.subCentre,
          phc: user.facility_name || DEFAULT_PROFILE_FIELDS.phc,
          mobile: user.phone || DEFAULT_PROFILE_FIELDS.mobile,
          coveredPopulation: DEFAULT_PROFILE_FIELDS.coveredPopulation,
          access_token: access_token
        } as UserAccount & { access_token: string };
      } else if (username === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password) {
        userObj = { username: DEMO_ACCOUNT.username, fullName: 'Shagun', role: 'ASHA Worker', ...DEFAULT_PROFILE_FIELDS };
      }
    } else {
      if (username === DEMO_ACCOUNT.username) {
        userObj = { username: DEMO_ACCOUNT.username, fullName: 'Shagun', role: 'ASHA Worker', ...DEFAULT_PROFILE_FIELDS };
        showSnackbar('इंटरनेट कनेक्शन उपलब्ध नाही. ऑफलाइन मोड सुरू आहे.');
      } else {
        const accounts = getStoredAccounts();
        const found = accounts.find(a => a.username === username && a.password === password);
        if (found) {
          userObj = { ...DEFAULT_PROFILE_FIELDS, ...found, fullName: found.fullName || found.username, role: found.role || 'ASHA Worker' };
        }
      }
    }

    if (userObj) {
      setCurrentUser(userObj);
      try { localStorage.setItem('niramaynet_session', JSON.stringify(userObj)); } catch {}
      setIsLoggedIn(true);
      setActiveScreen('home');
      setActiveTab('home');
      return true;
    }
    return false;
  };

  const signup = async (username: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post<any>('/auth/register', {
        username: username.trim(),
        password: password,
        fullName: fullName?.trim() || username.trim(),
      });

      if (response.data && (response.status === 200 || response.status === 201)) {
        const nameToUse = fullName && fullName.trim() ? fullName.trim() : username;
        const newAccount: StoredAccount & Partial<UserAccount> = {
          username: username.trim(),
          password,
          fullName: nameToUse,
          role: 'ASHA Worker',
          ...DEFAULT_PROFILE_FIELDS,
        };
        saveAccount(newAccount);

        setIsFirstLogin(true);
        return { success: true };
      } else {
        const errorMsg = response.error || 'Registration failed. Username may already exist.';
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const updateUserAccount = (updatedUser: Partial<UserAccount>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const newUser = { ...prev, ...updatedUser };
      try { localStorage.setItem('niramaynet_session', JSON.stringify(newUser)); } catch {}
      const accounts = getStoredAccounts();
      const existing = accounts.find(a => a.username === prev.username);
      if (existing) {
        saveAccount({ ...existing, ...newUser });
      }
      return newUser;
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPatients([]);
    setCurrentPatient(null);
    setFollowups([]);
    setTasks([]);
    try { localStorage.removeItem('niramaynet_session'); } catch {}
    setActiveScreen('login');
    setActiveTab('home');
    setHasUnsavedChanges(false);
  };

  const addPatient = async (pData: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient | null> => {
    const computedTriage = pData.lastTriage || (pData.symptoms && pData.symptoms.length > 0 ? evaluateTriage(pData.symptoms).urgency : 'ROUTINE');
    
    let patientId = `P${Date.now()}`;
    let registrationDate = new Date().toISOString().split('T')[0];

    if (networkStatus !== 'offline') {
      const response = await api.post<any>('/patients/', {
        name: pData.name,
        age: pData.age,
        gender: pData.sex,
        phone: pData.phone || undefined,
        village: pData.village,
        abha_id: pData.abhaId || undefined,
        allergies: pData.allergies || undefined,
      });

      if (response.error || !response.data) {
        // Fallback to local saving if API fails
        showSnackbar('Saved locally. Will sync when online.');
      } else {
        patientId = response.data.id;
        registrationDate = response.data.created_at ? response.data.created_at.split('T')[0] : registrationDate;
      }
    }

    const newP: Patient = {
      ...pData,
      id: patientId,
      registrationDate,
      lastTriage: computedTriage,
      symptoms: pData.symptoms || [],
      allergies: pData.allergies || undefined,
    };
    setPatients(prev => [newP, ...prev]);
    setCurrentPatient(newP);

    // Save to SQLite
    openDatabaseAsync('niramaynet.db').then(db => {
      db.runAsync(
        'INSERT INTO patients (id, name, age, sex, abhaId, village, phone, registrationDate, lastVisit, lastTriage, symptoms, allergies, consultations, referrals, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newP.id, newP.name, newP.age, newP.sex, newP.abhaId, newP.village, newP.phone, newP.registrationDate, newP.lastVisit || '', newP.lastTriage || '', JSON.stringify(newP.symptoms || []), newP.allergies || '', JSON.stringify(newP.consultations || []), JSON.stringify(newP.referrals || []), newP.notes || '']
      );
    });

    return newP;
  };

  const updatePatient = (updatedP: Patient) => {
    const computedTriage = updatedP.lastTriage || (updatedP.symptoms && updatedP.symptoms.length > 0 ? evaluateTriage(updatedP.symptoms).urgency : 'ROUTINE');
    const finalPatient: Patient = {
      ...updatedP,
      lastTriage: computedTriage,
    };
    
    // Find old patient to match name changes in tasks
    const oldP = patients.find(p => p.id === finalPatient.id);

    // 1. Update main patients list
    setPatients(prev => prev.map(p => p.id === finalPatient.id ? finalPatient : p));
    
    // 2. Update current selected patient if open
    if (currentPatient && currentPatient.id === finalPatient.id) {
      setCurrentPatient(finalPatient);
    }

    // 3. Update matching follow-up records (reflect name, age, sex, phone, urgency)
    setFollowups(prev => prev.map(f => {
      if (f.patientId === finalPatient.id) {
        return {
          ...f,
          patientName: finalPatient.name,
          patientAge: finalPatient.age,
          patientSex: finalPatient.sex,
          phone: finalPatient.phone,
          urgency: finalPatient.lastTriage || f.urgency,
        };
      }
      return f;
    }));

    // 4. Update matching task (reminder) titles and urgencies
    if (oldP && oldP.name !== finalPatient.name) {
      setTasks(prev => prev.map(t => {
        if (t.title.includes(oldP.name)) {
          const updatedTitle = t.title.replace(oldP.name, finalPatient.name);
          const updatedUrgency = finalPatient.lastTriage || t.urgency;
          openDatabaseAsync('niramaynet.db').then(db => {
            db.runAsync('UPDATE tasks SET title = ?, urgency = ? WHERE id = ?', [updatedTitle, updatedUrgency, t.id]);
          });
          return { ...t, title: updatedTitle, urgency: updatedUrgency };
        }
        return t;
      }));
    }
  };

  const toggleVisited = (id: string) => {
    setFollowups(prev => {
      const next = prev.map(f => f.id === id ? { ...f, visited: !f.visited } : f);
      const target = next.find(f => f.id === id);
      if (target) {
        // Persist to local SQLite (always, for offline support)
        openDatabaseAsync('niramaynet.db').then(db => {
          db.runAsync('UPDATE followups SET visited = ? WHERE id = ?', [target.visited ? 1 : 0, id]);
        });
        // Sync to backend when online and this is a backend record (UUID, not local 'F...' ID)
        if (networkStatus !== 'offline' && !id.startsWith('F')) {
          const newStatus = target.visited ? 'COMPLETED' : 'PENDING';
          api.patch(`/followups/${id}`, {
            status: newStatus,
            visited: target.visited,
          }).catch(() => {
            // Ignore backend errors — local state already updated
          });
        }
      }
      return next;
    });
  };

  const addFollowup = async (patient: Patient, category = 'Follow-up Check') => {
    const alreadyExists = followups.some(f => f.patientId === patient.id && !f.visited);
    if (alreadyExists) {
      showSnackbar('Patient already has a pending follow-up');
      return;
    }

    const urgency: UrgencyLevel = patient.lastTriage || 'ROUTINE';
    // Default scheduled date = today
    const today = new Date().toISOString().split('T')[0];

    let itemId = `F${Date.now()}`; // local fallback ID

    // POST to backend when online and patient has a real backend UUID
    if (networkStatus !== 'offline' && !patient.id.startsWith('P')) {
      try {
        const res = await api.post<any>('/followups/', {
          patient_id: patient.id,
          category,
          urgency,
          followup_date: today,
        });
        if (res.data && res.data.id) {
          itemId = res.data.id; // use backend UUID as the canonical ID
        }
      } catch {
        // Fall through to local-only creation
      }
    }

    const newItem: FollowUpItem = {
      id: itemId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientSex: patient.sex,
      category,
      urgency,
      visited: false,
      phone: patient.phone,
    };
    setFollowups(prev => [newItem, ...prev]);

    // Always persist to local SQLite for offline display
    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync(
      'INSERT INTO followups (id, patientId, patientName, patientAge, patientSex, category, urgency, visited, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [newItem.id, newItem.patientId, newItem.patientName, newItem.patientAge, newItem.patientSex, newItem.category, newItem.urgency, 0, newItem.phone || '']
    );

    showSnackbar(`${patient.name} added to follow-ups`);
  };

  const isFollowup = (patientId: string): boolean => {
    return followups.some(f => f.patientId === patientId && !f.visited);
  };

  const showSnackbar = (msg: string, duration = 2500) => {
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    setSnackbar(msg);
    snackbarTimerRef.current = setTimeout(() => setSnackbar(null), duration);
  };

  const confirmBackNavigation = () => {
    setShowBackConfirmation(false);
    setHasUnsavedChanges(false);
    if (pendingNavScreen) {
      setActiveScreen(pendingNavScreen);
      setPendingNavScreen(null);
    }
  };

  const cancelBackNavigation = () => {
    setShowBackConfirmation(false);
    setPendingNavScreen(null);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      networkStatus, setNetworkStatus,
      isLoggedIn, currentUser, updateUserAccount, login, logout,
      activeTab, setActiveTab,
      activeScreen, setActiveScreen,
      patients, setPatients, addPatient, updatePatient, currentPatient, setCurrentPatient,
      triageResult, setTriageResult, lastTriageRecordId, setLastTriageRecordId,
      followups, toggleVisited, addFollowup, isFollowup,
      tasks, addNewTask, updateTaskItem, deleteTaskItem,
      saveDraftField, getDraft, clearDraft,
      hasUnsavedChanges, setHasUnsavedChanges,
      showBackConfirmation, setShowBackConfirmation,
      pendingNavScreen, setPendingNavScreen,
      confirmBackNavigation, cancelBackNavigation,
      snackbar, showSnackbar,
      signup,
      isFirstLogin, setIsFirstLogin,
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
