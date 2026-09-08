import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, NetworkStatus, Patient, FollowUpItem, UrgencyLevel } from '../types';
import { translations, type TranslationDict } from '../constants/translations';
import { openDatabaseAsync } from '../lib/sqlite';
import { evaluateTriage } from '../utils/triageEngine';

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

  // Patient data
  patients: Patient[];
  addPatient: (p: Omit<Patient, 'id' | 'registrationDate'>) => Patient;
  updatePatient: (p: Patient) => void;
  currentPatient: Patient | null;
  setCurrentPatient: (p: Patient | null) => void;

  // Triage & Assessment
  triageResult: TriageResult | null;
  setTriageResult: (r: TriageResult | null) => void;

  // Followup items
  followups: FollowUpItem[];
  toggleVisited: (id: string) => void;

  // Editable Tasks (CHANGE 1)
  tasks: TaskItem[];
  addNewTask: (title: string, category?: string, urgency?: UrgencyLevel) => Promise<void>;
  updateTaskItem: (id: string, newTitle: string, visited?: boolean) => Promise<void>;
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
  const [language, setLanguageState] = useState<Language>('mr');

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
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState('login');

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(INITIAL_PATIENTS[0]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const [followups, setFollowups] = useState<FollowUpItem[]>([
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
  ]);

  // Tasks from SQLite
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Unsaved dialog navigation guard
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [pendingNavScreen, setPendingNavScreen] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const t = translations[language] ?? translations.mr;

  // Initialize SQLite on mount and load language + tasks
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = await openDatabaseAsync('niramaynet.db');

        // Load language setting
        const langSetting = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', ['language']);
        if (langSetting && ['mr', 'hi', 'en', 'kn'].includes(langSetting.value)) {
          if (mounted) setLanguageState(langSetting.value as Language);
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
          // Populate initial demo tasks into SQLite so SQLite has tasks
          for (const item of INITIAL_TASKS) {
            await db.runAsync(
              'INSERT INTO tasks (id, title, category, urgency, visited, created_at) VALUES (?, ?, ?, ?, ?, ?)',
              [item.id, item.title, item.category || '', item.urgency || 'ROUTINE', item.visited ? 1 : 0, item.createdAt || new Date().toISOString()]
            );
          }
          if (mounted) setTasks(INITIAL_TASKS);
        }
      } catch (err) {
        console.error('Error initializing SQLite database:', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    openDatabaseAsync('niramaynet.db').then(db => {
      db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['language', lang]);
    });
  };

  const addNewTask = async (title: string, category: string = 'General', urgency: UrgencyLevel = 'ROUTINE') => {
    const newTask: TaskItem = {
      id: `T_${Date.now()}`,
      title: title.trim(),
      category,
      urgency,
      visited: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);

    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync(
      'INSERT INTO tasks (id, title, category, urgency, visited, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [newTask.id, newTask.title, newTask.category || '', newTask.urgency || 'ROUTINE', 0, newTask.createdAt]
    );
  };

  const updateTaskItem = async (id: string, newTitle: string, visited?: boolean) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          title: newTitle !== undefined ? newTitle.trim() : t.title,
          visited: visited !== undefined ? visited : t.visited,
        };
      }
      return t;
    }));

    const db = await openDatabaseAsync('niramaynet.db');
    const existing = tasks.find(t => t.id === id);
    const updatedTitle = newTitle !== undefined ? newTitle.trim() : existing?.title || '';
    const updatedVisited = visited !== undefined ? (visited ? 1 : 0) : (existing?.visited ? 1 : 0);

    await db.runAsync('UPDATE tasks SET title = ?, visited = ? WHERE id = ?', [updatedTitle, updatedVisited, id]);
  };

  const deleteTaskItem = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    const db = await openDatabaseAsync('niramaynet.db');
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
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

  const login = (username: string, password: string): boolean => {
    if (username === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password) {
      setIsLoggedIn(true);
      setActiveScreen('home');
      setActiveTab('home');
      return true;
    }
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
    setHasUnsavedChanges(false);
  };

  const addPatient = (pData: Omit<Patient, 'id' | 'registrationDate'>): Patient => {
    const computedTriage = pData.lastTriage || (pData.symptoms && pData.symptoms.length > 0 ? evaluateTriage(pData.symptoms).urgency : 'ROUTINE');
    const newP: Patient = {
      ...pData,
      id: `P${Date.now()}`,
      // Store as ISO so we can re-format it in the active language at display time
      registrationDate: new Date().toISOString().split('T')[0],
      lastTriage: computedTriage,
      symptoms: pData.symptoms || [],
    };
    setPatients(prev => [newP, ...prev]);
    setCurrentPatient(newP);
    return newP;
  };

  const updatePatient = (updatedP: Patient) => {
    const computedTriage = updatedP.lastTriage || (updatedP.symptoms && updatedP.symptoms.length > 0 ? evaluateTriage(updatedP.symptoms).urgency : 'ROUTINE');
    const finalPatient: Patient = {
      ...updatedP,
      lastTriage: computedTriage,
    };
    setPatients(prev => prev.map(p => p.id === finalPatient.id ? finalPatient : p));
    if (currentPatient && currentPatient.id === finalPatient.id) {
      setCurrentPatient(finalPatient);
    }
  };

  const toggleVisited = (id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, visited: !f.visited } : f));
  };

  const showSnackbar = (msg: string, duration = 3000) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(null), duration);
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
      isLoggedIn, login, logout,
      activeTab, setActiveTab,
      activeScreen, setActiveScreen,
      patients, addPatient, updatePatient, currentPatient, setCurrentPatient,
      triageResult, setTriageResult,
      followups, toggleVisited,
      tasks, addNewTask, updateTaskItem, deleteTaskItem,
      saveDraftField, getDraft, clearDraft,
      hasUnsavedChanges, setHasUnsavedChanges,
      showBackConfirmation, setShowBackConfirmation,
      pendingNavScreen, setPendingNavScreen,
      confirmBackNavigation, cancelBackNavigation,
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
