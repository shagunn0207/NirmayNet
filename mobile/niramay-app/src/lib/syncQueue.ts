import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from './apiClient';

export type QueueOperationType =
  | 'PATIENT_REGISTRATION'
  | 'TRIAGE_PERSISTENCE'
  | 'REFERRAL_CREATION'
  | 'FOLLOWUP_CREATION';

export interface QueuedOperation {
  id: string;
  type: QueueOperationType;
  payload: any;
  tempId?: string;
  createdAt: string;
  retryCount: number;
  lastError?: string;
  status: 'pending' | 'syncing' | 'failed';
}

export interface OfflinePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  village?: string;
  abha_id?: string;
  allergies?: string;
  isOffline?: boolean;
}

const STORAGE_KEY_QUEUE = '@niramay_sync_queue';
const STORAGE_KEY_OFFLINE_PATIENTS = '@niramay_offline_patients';

// In-memory fallback if AsyncStorage is unavailable or during SSR
let memoryQueue: QueuedOperation[] = [];
let memoryOfflinePatients: OfflinePatient[] = [];
let isSyncing = false;
let listenersInitialized = false;

// ── Storage Helpers ─────────────────────────────────────────────────────────

async function getStorageItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    }
  }
}

// ── Queue Management ────────────────────────────────────────────────────────

export async function getQueuedOperations(): Promise<QueuedOperation[]> {
  try {
    const raw = await getStorageItem(STORAGE_KEY_QUEUE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryQueue = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load sync queue from storage:', e);
  }
  return memoryQueue;
}

async function saveQueuedOperations(queue: QueuedOperation[]): Promise<void> {
  memoryQueue = queue;
  try {
    await setStorageItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to save sync queue:', e);
  }
}

export async function enqueueOperation(
  type: QueueOperationType,
  payload: any,
  tempId?: string
): Promise<QueuedOperation> {
  const queue = await getQueuedOperations();
  const newItem: QueuedOperation = {
    id: `op-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    payload,
    tempId,
    createdAt: new Date().toISOString(),
    retryCount: 0,
    status: 'pending',
  };

  queue.push(newItem);
  await saveQueuedOperations(queue);
  return newItem;
}

// Convenience enqueue wrappers
export async function enqueuePatientRegistration(payload: any, tempId: string): Promise<QueuedOperation> {
  await saveOfflinePatient({
    id: tempId,
    name: payload.name,
    age: payload.age,
    gender: payload.gender,
    phone: payload.phone,
    village: payload.village,
    abha_id: payload.abha_id,
    allergies: payload.allergies,
    isOffline: true,
  });
  return enqueueOperation('PATIENT_REGISTRATION', payload, tempId);
}

export async function enqueueTriagePersistence(payload: any): Promise<QueuedOperation> {
  return enqueueOperation('TRIAGE_PERSISTENCE', payload);
}

export async function enqueueReferralCreation(payload: any, tempId?: string): Promise<QueuedOperation> {
  return enqueueOperation('REFERRAL_CREATION', payload, tempId);
}

export async function enqueueFollowupCreation(payload: any, tempId?: string): Promise<QueuedOperation> {
  return enqueueOperation('FOLLOWUP_CREATION', payload, tempId);
}

// ── Offline Patient Store ───────────────────────────────────────────────────

export async function getOfflinePatients(): Promise<OfflinePatient[]> {
  try {
    const raw = await getStorageItem(STORAGE_KEY_OFFLINE_PATIENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memoryOfflinePatients = parsed;
        return parsed;
      }
    }
  } catch {}
  return memoryOfflinePatients;
}

export async function saveOfflinePatient(patient: OfflinePatient): Promise<void> {
  const current = await getOfflinePatients();
  const existingIdx = current.findIndex((p) => p.id === patient.id);
  if (existingIdx >= 0) {
    current[existingIdx] = patient;
  } else {
    current.unshift(patient);
  }
  memoryOfflinePatients = current;
  await setStorageItem(STORAGE_KEY_OFFLINE_PATIENTS, JSON.stringify(current));
}

export async function removeOfflinePatient(tempId: string): Promise<void> {
  const current = await getOfflinePatients();
  const filtered = current.filter((p) => p.id !== tempId);
  memoryOfflinePatients = filtered;
  await setStorageItem(STORAGE_KEY_OFFLINE_PATIENTS, JSON.stringify(filtered));
}

// ── Auth Token Helper ───────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
  try {
    const token = await getStorageItem('auth_token');
    if (token) return token;
  } catch {}

  try {
    const sessRaw = await getStorageItem('niramaynet_session');
    if (sessRaw) {
      const sess = JSON.parse(sessRaw);
      return sess.access_token || null;
    }
  } catch {}

  return null;
}

// ── Duplicate Prevention Helpers ────────────────────────────────────────────

/**
 * Checks if a patient matching the given payload already exists on the backend.
 * Returns existing patient ID if found, otherwise null.
 */
async function findExistingPatient(payload: any, headers: Record<string, string>): Promise<string | null> {
  try {
    const queryName = encodeURIComponent(payload.name || '');
    const res = await fetch(`${BACKEND_URL}/api/v1/patients/?q=${queryName}`, { headers });
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;

    const match = list.find((p: any) => {
      const nameMatch = p.name?.trim().toLowerCase() === payload.name?.trim().toLowerCase();
      if (!nameMatch) return false;
      if (payload.phone && p.phone && p.phone === payload.phone) return true;
      if (payload.abha_id && p.abha_id && p.abha_id === payload.abha_id) return true;
      if (p.village?.toLowerCase() === payload.village?.toLowerCase() && p.age === payload.age) return true;
      return false;
    });

    return match ? String(match.id) : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a referral matching patient_id and destination_hospital already exists.
 */
async function findExistingReferral(payload: any, headers: Record<string, string>): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/referrals/`, { headers });
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;

    const match = list.find((r: any) => {
      return (
        String(r.patient_id) === String(payload.patient_id) &&
        r.destination_hospital?.toLowerCase() === payload.destination_hospital?.toLowerCase() &&
        (r.reason === payload.reason || (!r.reason && !payload.reason))
      );
    });

    return match ? String(match.id) : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a follow-up for patient_id with the same date and category exists.
 */
async function findExistingFollowup(payload: any, headers: Record<string, string>): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/followups/?patient_id=${payload.patient_id}`, { headers });
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;

    const match = list.find((f: any) => {
      return (
        String(f.patient_id) === String(payload.patient_id) &&
        f.followup_date === payload.followup_date &&
        f.category?.toLowerCase() === payload.category?.toLowerCase()
      );
    });

    return match ? String(match.id) : null;
  } catch {
    return null;
  }
}

// ── Temp ID Replacement ─────────────────────────────────────────────────────

function replaceTempIdInQueue(queue: QueuedOperation[], tempId: string, realId: string) {
  for (const item of queue) {
    if (item.payload) {
      if (item.payload.patient_id === tempId) {
        item.payload.patient_id = realId;
      }
      if (item.payload.triage_record_id === tempId) {
        item.payload.triage_record_id = realId;
      }
    }
  }
}

// ── Main Sync Processing ────────────────────────────────────────────────────

export async function processSyncQueue(tokenOverride?: string): Promise<{ synced: number; remaining: number }> {
  if (isSyncing) {
    return { synced: 0, remaining: memoryQueue.length };
  }

  const token = tokenOverride || (await getAuthToken());
  if (!token) {
    return { synced: 0, remaining: memoryQueue.length };
  }

  isSyncing = true;
  let syncedCount = 0;

  try {
    const queue = await getQueuedOperations();
    if (queue.length === 0) {
      isSyncing = false;
      return { synced: 0, remaining: 0 };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Test connectivity first with quick /health ping
    try {
      const healthRes = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!healthRes.ok) {
        isSyncing = false;
        return { synced: 0, remaining: queue.length };
      }
    } catch {
      // Backend not reachable yet
      isSyncing = false;
      return { synced: 0, remaining: queue.length };
    }

    const remainingQueue: QueuedOperation[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      item.status = 'syncing';

      try {
        let success = false;

        switch (item.type) {
          case 'PATIENT_REGISTRATION': {
            // Duplicate prevention: check if patient already exists on backend
            let realPatientId = await findExistingPatient(item.payload, headers);

            if (!realPatientId) {
              const res = await fetch(`${BACKEND_URL}/api/v1/patients/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(item.payload),
              });

              if (res.ok) {
                const data = await res.json();
                realPatientId = String(data.id);
                success = true;
              } else {
                item.lastError = `Status ${res.status}: ${await res.text().catch(() => '')}`;
              }
            } else {
              // Existing patient detected — reuse ID without duplicating
              success = true;
            }

            if (success && realPatientId && item.tempId) {
              // Update all remaining queued items referencing this temp patient ID
              replaceTempIdInQueue(queue, item.tempId, realPatientId);
              replaceTempIdInQueue(remainingQueue, item.tempId, realPatientId);
              await removeOfflinePatient(item.tempId);
            }
            break;
          }

          case 'TRIAGE_PERSISTENCE': {
            // Ensure patient_id is not an unresolved temp ID
            if (item.payload.patient_id && String(item.payload.patient_id).startsWith('temp-')) {
              // Wait for patient registration to resolve in a subsequent pass
              remainingQueue.push(item);
              continue;
            }

            const res = await fetch(`${BACKEND_URL}/api/v1/triage/assess`, {
              method: 'POST',
              headers,
              body: JSON.stringify(item.payload),
            });

            if (res.ok) {
              const data = await res.json();
              if (item.tempId && data.id) {
                replaceTempIdInQueue(queue, item.tempId, String(data.id));
                replaceTempIdInQueue(remainingQueue, item.tempId, String(data.id));
              }
              success = true;
            } else {
              item.lastError = `Status ${res.status}`;
            }
            break;
          }

          case 'REFERRAL_CREATION': {
            // Ensure patient_id is not an unresolved temp ID
            if (item.payload.patient_id && String(item.payload.patient_id).startsWith('temp-')) {
              remainingQueue.push(item);
              continue;
            }

            // Duplicate prevention
            const existingRefId = await findExistingReferral(item.payload, headers);
            if (existingRefId) {
              success = true;
            } else {
              const res = await fetch(`${BACKEND_URL}/api/v1/referrals/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(item.payload),
              });

              if (res.ok) {
                success = true;
              } else {
                item.lastError = `Status ${res.status}`;
              }
            }
            break;
          }

          case 'FOLLOWUP_CREATION': {
            // Ensure patient_id is not an unresolved temp ID
            if (item.payload.patient_id && String(item.payload.patient_id).startsWith('temp-')) {
              remainingQueue.push(item);
              continue;
            }

            // Duplicate prevention
            const existingFollowupId = await findExistingFollowup(item.payload, headers);
            if (existingFollowupId) {
              success = true;
            } else {
              const res = await fetch(`${BACKEND_URL}/api/v1/followups/`, {
                method: 'POST',
                headers,
                body: JSON.stringify(item.payload),
              });

              if (res.ok) {
                success = true;
              } else {
                item.lastError = `Status ${res.status}`;
              }
            }
            break;
          }
        }

        if (success) {
          syncedCount++;
          // Item succeeded -> do not add to remainingQueue (removes from queue)
        } else {
          // Failed item -> retain for next retry
          item.status = 'failed';
          item.retryCount = (item.retryCount || 0) + 1;
          remainingQueue.push(item);
        }
      } catch (err: any) {
        // Network failure during individual item sync -> retain for next retry
        item.status = 'failed';
        item.retryCount = (item.retryCount || 0) + 1;
        item.lastError = err?.message || 'Network error during sync';
        remainingQueue.push(item);
      }
    }

    await saveQueuedOperations(remainingQueue);
    return { synced: syncedCount, remaining: remainingQueue.length };
  } finally {
    isSyncing = false;
  }
}

// ── Event Listeners (Online / Focus / Heartbeat) ────────────────────────────

export function initSyncQueueListeners(): void {
  if (listenersInitialized) return;
  listenersInitialized = true;

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      processSyncQueue();
    });

    window.addEventListener('focus', () => {
      processSyncQueue();
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          processSyncQueue();
        }
      });
    }

    // Periodic heartbeat to retry failed items when online
    setInterval(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      processSyncQueue();
    }, 12000);
  }

  // Initial trigger on startup
  processSyncQueue();
}
