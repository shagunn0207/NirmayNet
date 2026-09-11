function getStorageKey(): string {
  try {
    const rawSess = localStorage.getItem('niramaynet_session');
    if (rawSess) {
      const sess = JSON.parse(rawSess);
      const userKey = sess.username || sess.id || sess.name;
      if (userKey && typeof userKey === 'string' && userKey.trim()) {
        const cleanUserKey = userKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        return `niramaynet_local_${cleanUserKey}`;
      }
    }
  } catch (_e) {
    // Ignore storage parse errors
  }
  return 'niramaynet_local_anonymous';
}

interface DBState {
  settings: Record<string, string>;
  tasks: Array<{
    id: string;
    title: string;
    category: string;
    urgency: string;
    visited: number;
    created_at: string;
  }>;
  drafts: Array<{
    draft_id: string;
    field_name: string;
    field_value: string;
  }>;
  followups: Array<{
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    patientSex: string;
    category: string;
    urgency: string;
    visited: number;
    phone?: string;
  }>;
  patients: Array<{
    id: string;
    name: string;
    age: number;
    sex: string;
    abhaId: string;
    village: string;
    phone: string;
    registrationDate: string;
    lastVisit: string;
    lastTriage: string;
    symptoms: string;
    allergies: string;
    consultations: string;
    referrals: string;
    notes: string;
  }>;
}

function loadState(): DBState {
  try {
    const storageKey = getStorageKey();
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        settings: parsed.settings || {},
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        drafts: Array.isArray(parsed.drafts) ? parsed.drafts : [],
        followups: Array.isArray(parsed.followups) ? parsed.followups : [],
        patients: Array.isArray(parsed.patients) ? parsed.patients : [],
      };
    }
  } catch (_e) {
    // Ignore storage parse errors
  }
  return { settings: {}, tasks: [], drafts: [], followups: [], patients: [] };
}

function saveState(state: DBState): void {
  try {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (_e) {
    // Ignore storage write errors
  }
}

export class BrowserSQLiteDatabase {
  private dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  async getFirstAsync<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const all = await this.getAllAsync<T>(sql, params);
    return all.length > 0 ? all[0] : null;
  }

  async getAllAsync<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const state = loadState();
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    // SELECT value FROM settings WHERE key = ?
    if (/SELECT\s+value\s+FROM\s+settings\s+WHERE\s+key\s*=\s*\?/i.test(cleanSql)) {
      const key = params[0];
      const val = state.settings[key];
      if (val !== undefined) {
        return [{ value: val } as any];
      }
      return [];
    }

    // SELECT * FROM tasks ORDER BY created_at DESC
    if (/SELECT\s+\*\s+FROM\s+tasks/i.test(cleanSql)) {
      const sorted = [...state.tasks].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
      return sorted as any[];
    }

    // SELECT * FROM followups
    if (/SELECT\s+\*\s+FROM\s+followups/i.test(cleanSql)) {
      return [...state.followups] as any[];
    }

    // SELECT * FROM drafts...
    if (/SELECT\s+field_name,\s*field_value\s+FROM\s+drafts\s+WHERE\s+draft_id\s*=\s*\?/i.test(cleanSql)) {
      const draftId = params[0];
      const matches = state.drafts.filter(d => d.draft_id === draftId);
      return matches.map(d => ({ field_name: d.field_name, field_value: d.field_value })) as any[];
    }

    // SELECT * FROM patients
    if (/SELECT\s+\*\s+FROM\s+patients/i.test(cleanSql)) {
      const sorted = [...state.patients].sort((a, b) => (b.registrationDate || '').localeCompare(a.registrationDate || ''));
      return sorted as any[];
    }

    return [];
  }

  async runAsync(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowId: number }> {
    const state = loadState();
    const cleanSql = sql.trim().replace(/\s+/g, ' ');
    let changes = 0;

    // INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
    if (/INSERT\s+(OR\s+REPLACE\s+)?INTO\s+settings/i.test(cleanSql)) {
      const [key, value] = params;
      state.settings[key] = String(value);
      changes = 1;
    }
    // INSERT INTO tasks (id, title, category, urgency, visited, created_at) VALUES (?, ?, ?, ?, ?, ?)
    else if (/INSERT\s+INTO\s+tasks/i.test(cleanSql)) {
      const [id, title, category, urgency, visited, created_at] = params;
      const existingIdx = state.tasks.findIndex(t => t.id === id);
      const newTask = {
        id: String(id),
        title: String(title),
        category: String(category || ''),
        urgency: String(urgency || 'ROUTINE'),
        visited: Number(visited) ? 1 : 0,
        created_at: String(created_at || new Date().toISOString()),
      };
      if (existingIdx >= 0) {
        state.tasks[existingIdx] = newTask;
      } else {
        state.tasks.push(newTask);
      }
      changes = 1;
    }
    // UPDATE tasks SET title = ?, visited = ?, urgency = ? WHERE id = ?
    else if (/UPDATE\s+tasks\s+SET/i.test(cleanSql)) {
      const [title, visited, urgency, id] = params;
      const idx = state.tasks.findIndex(t => t.id === id);
      if (idx >= 0) {
        state.tasks[idx] = {
          ...state.tasks[idx],
          title: String(title),
          visited: Number(visited) ? 1 : 0,
          urgency: String(urgency),
        };
        changes = 1;
      }
    }
    // DELETE FROM tasks WHERE id = ?
    else if (/DELETE\s+FROM\s+tasks\s+WHERE\s+id\s*=\s*\?/i.test(cleanSql)) {
      const [id] = params;
      const prevLen = state.tasks.length;
      state.tasks = state.tasks.filter(t => t.id !== id);
      changes = prevLen - state.tasks.length;
    }
    // INSERT INTO followups ...
    else if (/INSERT\s+(OR\s+REPLACE\s+)?INTO\s+followups/i.test(cleanSql)) {
      const [id, patientId, patientName, patientAge, patientSex, category, urgency, visited, phone] = params;
      const existingIdx = state.followups.findIndex(f => f.id === id);
      const newFollowup = {
        id: String(id),
        patientId: String(patientId),
        patientName: String(patientName),
        patientAge: Number(patientAge),
        patientSex: String(patientSex),
        category: String(category),
        urgency: String(urgency),
        visited: Number(visited) ? 1 : 0,
        phone: String(phone || ''),
      };
      if (existingIdx >= 0) {
        state.followups[existingIdx] = newFollowup;
      } else {
        state.followups.push(newFollowup);
      }
      changes = 1;
    }
    // UPDATE followups SET visited = ? WHERE id = ?
    else if (/UPDATE\s+followups\s+SET\s+visited\s*=\s*\?\s+WHERE\s+id\s*=\s*\?/i.test(cleanSql)) {
      const [visited, id] = params;
      const idx = state.followups.findIndex(f => f.id === id);
      if (idx >= 0) {
        state.followups[idx].visited = Number(visited) ? 1 : 0;
        changes = 1;
      }
    }
    // DELETE FROM followups WHERE id = ?
    else if (/DELETE\s+FROM\s+followups\s+WHERE\s+id\s*=\s*\?/i.test(cleanSql)) {
      const [id] = params;
      const prevLen = state.followups.length;
      state.followups = state.followups.filter(f => f.id !== id);
      changes = prevLen - state.followups.length;
    }
    // INSERT OR REPLACE INTO drafts (draft_id, field_name, field_value) VALUES (?, ?, ?)
    else if (/INSERT\s+(OR\s+REPLACE\s+)?INTO\s+drafts/i.test(cleanSql)) {
      const [draft_id, field_name, field_value] = params;
      const idx = state.drafts.findIndex(d => d.draft_id === draft_id && d.field_name === field_name);
      const newItem = {
        draft_id: String(draft_id),
        field_name: String(field_name),
        field_value: String(field_value),
      };
      if (idx >= 0) {
        state.drafts[idx] = newItem;
      } else {
        state.drafts.push(newItem);
      }
      changes = 1;
    }
    // DELETE FROM drafts WHERE draft_id = ?
    else if (/DELETE\s+FROM\s+drafts\s+WHERE\s+draft_id\s*=\s*\?/i.test(cleanSql)) {
      const [draft_id] = params;
      const prevLen = state.drafts.length;
      state.drafts = state.drafts.filter(d => d.draft_id !== draft_id);
      changes = prevLen - state.drafts.length;
    }
    // INSERT OR REPLACE INTO patients
    else if (/INSERT\s+(OR\s+REPLACE\s+)?INTO\s+patients/i.test(cleanSql)) {
      const [id, name, age, sex, abhaId, village, phone, registrationDate, lastVisit, lastTriage, symptoms, allergies, consultations, referrals, notes] = params;
      const existingIdx = state.patients.findIndex(p => p.id === id);
      const newPatient = {
        id: String(id),
        name: String(name),
        age: Number(age),
        sex: String(sex),
        abhaId: String(abhaId || ''),
        village: String(village || ''),
        phone: String(phone || ''),
        registrationDate: String(registrationDate || ''),
        lastVisit: String(lastVisit || ''),
        lastTriage: String(lastTriage || ''),
        symptoms: String(symptoms || ''),
        allergies: String(allergies || ''),
        consultations: String(consultations || ''),
        referrals: String(referrals || ''),
        notes: String(notes || '')
      };
      if (existingIdx >= 0) {
        state.patients[existingIdx] = newPatient;
      } else {
        state.patients.push(newPatient);
      }
      changes = 1;
    }
    // UPDATE patients SET ...
    else if (/UPDATE\s+patients\s+SET/i.test(cleanSql)) {
      const [name, age, phone, village, lastTriage, id] = params;
      const idx = state.patients.findIndex(p => p.id === id);
      if (idx >= 0) {
        state.patients[idx] = {
          ...state.patients[idx],
          name: String(name),
          age: Number(age),
          phone: String(phone),
          village: String(village),
          lastTriage: String(lastTriage),
        };
        changes = 1;
      }
    }

    saveState(state);
    return { changes, lastInsertRowId: 1 };
  }
}

const dbInstances: Record<string, BrowserSQLiteDatabase> = {};

export async function openDatabaseAsync(name: string): Promise<BrowserSQLiteDatabase> {
  if (!dbInstances[name]) {
    dbInstances[name] = new BrowserSQLiteDatabase(name);
  }
  return dbInstances[name];
}
