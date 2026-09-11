import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

// Dummy data for UX porting
const DUMMY_TASKS = [
  { id: '1', title: 'Check on Radha', visited: false, urgency: 'URGENT', category: 'General' },
  { id: '2', title: 'ANC Follow-up', visited: false, urgency: 'ROUTINE', category: 'ANC' },
  { id: '3', title: 'Vaccination Camp', visited: true, urgency: 'ROUTINE', category: 'General' },
];

export default function HomeScreen() {
  const { t, user, session } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [reminderFilter, setReminderFilter] = useState<'today' | 'scheduled' | 'all' | 'completed'>('today');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isNewTaskUrgent, setIsNewTaskUrgent] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('offline');

  // On native platforms use the router's focus effect; on web fallback to useEffect
  if (Platform.OS === 'web') {
    useEffect(() => {
      fetchTasks();
      // No realtime channels for backend; poll/refresh on focus
    }, [user, session]);
  } else {
    useFocusEffect(
      useCallback(() => {
        fetchTasks();
        // No realtime channels for backend; poll/refresh on focus
      }, [user, session])
    );
  }

  const fetchTasks = async () => {
    if (!user) return;
    setNetworkStatus('syncing');
    try {
      // Fetch tasks from backend API
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/tasks/`, { headers });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      // Map backend TaskOut to local shape
      const backendTasks = Array.isArray(data) ? data.map((t: any) => ({
        id: t.id,
        title: t.title,
        visited: Boolean(t.visited),
        urgency: t.urgency || 'ROUTINE',
        category: t.category || 'General',
      })) : [];

      setTasks([...DUMMY_TASKS, ...backendTasks]);
      setNetworkStatus('synced');
    } catch (e) {
      console.warn('fetchTasks error', e);
      setNetworkStatus('offline');
    }
  };

  const filteredReminders = tasks.filter(task => {
    if (reminderFilter === 'completed') return task.visited;
    if (reminderFilter === 'today') return !task.visited && (task.urgency === 'EMERGENCY' || task.title.toLowerCase().includes('anc') || !task.category);
    if (reminderFilter === 'scheduled') return !task.visited && task.urgency === 'URGENT';
    return true; // 'all'
  });

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    (async () => {
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/tasks/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ title: newTaskTitle.trim(), category: 'General', urgency: isNewTaskUrgent ? 'URGENT' : 'ROUTINE' }),
        });
        if (res.ok) {
          const created = await res.json();
          setTasks(prev => [{
            id: created.id,
            title: created.title,
            visited: Boolean(created.visited),
            urgency: created.urgency || 'ROUTINE',
            category: created.category || 'General',
          }, ...prev]);
        } else {
          // fallback to local-only
          setTasks(prev => [{ id: Date.now().toString(), title: newTaskTitle, visited: false, urgency: isNewTaskUrgent ? 'URGENT' : 'ROUTINE', category: 'General' }, ...prev]);
        }
      } catch (err) {
        setTasks(prev => [{ id: Date.now().toString(), title: newTaskTitle, visited: false, urgency: isNewTaskUrgent ? 'URGENT' : 'ROUTINE', category: 'General' }, ...prev]);
      } finally {
        setNewTaskTitle('');
        setIsNewTaskUrgent(false);
        setIsAddingTask(false);
      }
    })();
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, visited: !t.visited } : t));
    (async () => {
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Only patch backend if this looks like a backend task id
      if (typeof id === 'string' && id.length > 8) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/tasks/${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ visited: true }),
          });
        } catch (err) {
          console.warn('toggleTask patch failed', err);
        }
      }
    })();
  };

  const toggleTaskUrgent = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, urgency: t.urgency === 'URGENT' ? 'ROUTINE' : 'URGENT' } : t));
    (async () => {
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (typeof id === 'string' && id.length > 8) {
        try {
          // toggle urgency server-side
          const task = tasks.find(t => t.id === id);
          const next = task?.urgency === 'URGENT' ? 'ROUTINE' : 'URGENT';
          await fetch(`${BACKEND_URL}/api/v1/tasks/${id}`, {
            method: 'PATCH', headers, body: JSON.stringify({ urgency: next }),
          });
        } catch (err) {
          console.warn('toggleTaskUrgent patch failed', err);
        }
      }
    })();
  };

  const deleteTaskItem = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    (async () => {
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (typeof id === 'string' && id.length > 8) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/tasks/${id}`, { method: 'DELETE', headers });
        } catch (err) {
          console.warn('deleteTaskItem failed', err);
        }
      }
    })();
  };

  const urgentReminders = tasks.filter(t => !t.visited && (t.urgency === 'URGENT' || t.urgency === 'EMERGENCY'));

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        {/* Welcome Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.greetingPrefix}>{t('greeting') || 'Welcome,'}</Text>
          <Text style={styles.greetingName}>{user?.email?.split('@')[0] || t('ashaWorkerName') || 'Asha Worker'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩‍⚕️</Text>
        </View>
      </View>

      {/* Primary actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('tasks') || 'Tasks'}</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(asha)/register' as any)}>
          <View style={styles.actionIconBg}>
            <FontAwesome5 name="user-plus" size={20} color="#0F766E" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionLabel}>{t('newPatient') || 'New Patient'}</Text>
            <Text style={styles.actionSubLabel}>{t('newPatientSub') || 'Register a new patient'}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(asha)/patients')}>
          <View style={styles.actionIconBg}>
            <FontAwesome5 name="users" size={20} color="#0F766E" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionLabel}>{t('myPatients') || 'My Patients'}</Text>
            <Text style={styles.actionSubLabel}>{t('registeredPatients') || 'Registered patients'}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.emphasizedCard]} onPress={() => router.push('/(asha)/consultation' as any)}>
          <View style={styles.emphasizedIconBg}>
            <FontAwesome5 name="video" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionLabel}>{t('startConsultation') || 'Start Consultation'}</Text>
            <Text style={styles.actionSubLabel}>{t('startConsultationSub') || 'Video consultation with PHC'}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Reminders Layout Section */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.sectionTitle}>🔔 {t('reminders') || 'Reminders'}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredReminders.length}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.syncBtn, networkStatus === 'offline' && styles.offlineBtn]}
            onPress={() => {
              setNetworkStatus('syncing');
              setTimeout(() => setNetworkStatus('synced'), 1500);
            }}
          >
            <Text style={[styles.syncBtnText, networkStatus === 'offline' && styles.offlineBtnText]}>
              {networkStatus === 'offline' ? '📶 ' + (t('syncWhenOnline') || 'Sync when online') : networkStatus === 'syncing' ? '🔄 Syncing…' : '☁️ ' + (t('syncNow') || 'Sync Now')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Filter */}
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {reminderFilter === 'today' ? '📅 ' + (t('filterToday') || 'Today') :
             reminderFilter === 'scheduled' ? '🗓️ ' + (t('filterScheduled') || 'Scheduled') :
             reminderFilter === 'completed' ? '✅ ' + (t('filterCompleted') || 'Completed') :
             '📋 ' + (t('filterAll') || 'All')}
          </Text>
          <FontAwesome5 name="chevron-down" size={12} color="#0F766E" />
        </TouchableOpacity>

        <Modal visible={showFilterModal} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
            <View style={styles.modalContent}>
              {[
                { key: 'today', icon: '📅', label: t('filterToday') || 'Today', count: tasks.filter(t => !t.visited && (t.urgency === 'EMERGENCY' || t.title.toLowerCase().includes('anc') || !t.category)).length },
                { key: 'scheduled', icon: '🗓️', label: t('filterScheduled') || 'Scheduled', count: tasks.filter(t => !t.visited && t.id !== 'T1').length },
                { key: 'all', icon: '📋', label: t('filterAll') || 'All', count: tasks.length },
                { key: 'completed', icon: '✅', label: t('filterCompleted') || 'Completed', count: tasks.filter(t => t.visited).length },
              ].map(b => (
                <TouchableOpacity
                  key={b.key}
                  style={[styles.dropdownItem, reminderFilter === b.key && styles.dropdownItemActive]}
                  onPress={() => { setReminderFilter(b.key as any); setShowFilterModal(false); }}
                >
                  <Text style={[styles.dropdownItemText, reminderFilter === b.key && styles.dropdownItemTextActive]}>
                    {b.icon} {b.label}
                  </Text>
                  <View style={styles.dropdownBadge}>
                    <Text style={styles.dropdownBadgeText}>{b.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Reminders List Card */}
        <View style={styles.card}>
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>
                {reminderFilter === 'completed' ? 'No completed reminders yet' : 'No reminders in this list'}
              </Text>
            </View>
          ) : (
            filteredReminders.map(task => {
              const isUrgent = task.urgency === 'URGENT' || task.urgency === 'EMERGENCY';
              return (
                <View
                  key={task.id}
                  style={[
                    styles.taskItem,
                    task.visited ? styles.taskItemCompleted : isUrgent ? styles.taskItemUrgent : null
                  ]}
                >
                  <View style={styles.taskLeft}>
                    <TouchableOpacity onPress={() => toggleTask(task.id)}>
                      <Ionicons 
                        name={task.visited ? "checkbox" : "square-outline"} 
                        size={24} 
                        color={task.visited ? "#94A3B8" : "#0F766E"} 
                      />
                    </TouchableOpacity>
                    <View style={styles.taskTextContainer}>
                      <Text style={[
                        styles.taskTitle,
                        task.visited ? styles.taskTitleCompleted : isUrgent ? styles.taskTitleUrgent : null
                      ]} numberOfLines={1}>
                        {task.title}
                      </Text>
                      {task.category && (
                        <View style={[styles.taskCategory, isUrgent && styles.taskCategoryUrgent]}>
                          <Text style={[styles.taskCategoryText, isUrgent && styles.taskCategoryTextUrgent]}>
                            {task.category}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.taskRight}>
                    <TouchableOpacity 
                      style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
                      onPress={() => toggleTaskUrgent(task.id)}
                    >
                      <Text style={[styles.urgentToggleText, isUrgent && styles.urgentToggleTextActive]}>
                        {isUrgent ? '🔴 Urgent' : '⚪ Normal'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTaskItem(task.id)}>
                      <FontAwesome5 name="trash" size={14} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          {/* Add Reminder Form */}
          {isAddingTask ? (
            <View style={styles.addTaskForm}>
              <TextInput
                style={styles.taskInput}
                placeholder={t('typeReminderPlaceholder') || 'Type new reminder...'}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />
              <View style={styles.addTaskActions}>
                <TouchableOpacity
                  style={[styles.urgentToggle, isNewTaskUrgent && styles.urgentToggleActive]}
                  onPress={() => setIsNewTaskUrgent(u => !u)}
                >
                  <Text style={[styles.urgentToggleText, isNewTaskUrgent && styles.urgentToggleTextActive]}>
                    {isNewTaskUrgent ? '🔴 Urgent / Important' : '⚪ Mark Urgent'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => { setIsAddingTask(false); setIsNewTaskUrgent(false); }}>
                    <Text style={styles.btnOutlineText}>{t('cancel') || 'Cancel'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnPrimary} onPress={handleCreateTask}>
                    <Text style={styles.btnPrimaryText}>{t('save') || 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addReminderBtn} onPress={() => setIsAddingTask(true)}>
              <FontAwesome5 name="plus" size={14} color="#0F766E" />
              <Text style={styles.addReminderText}>{t('addReminder') || 'Add Reminder'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  banner: {
    backgroundColor: '#0F766E',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  greetingPrefix: {
    color: '#CCFBF1',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'OpenSans_400Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F766E',
  },
  syncBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  syncBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0369A1',
  },
  offlineBtn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  offlineBtnText: {
    color: '#B45309',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#F0FDFA',
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#0F766E',
    fontFamily: 'Inter_700Bold',
  },
  dropdownBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dropdownBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyIcon: {
    fontSize: 32,
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 10,
  },
  taskItemCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  taskItemUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  taskTitleCompleted: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  taskTitleUrgent: {
    color: '#991B1B',
  },
  taskCategory: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  taskCategoryUrgent: {
    backgroundColor: '#FFE4E6',
  },
  taskCategoryText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#0F766E',
  },
  taskCategoryTextUrgent: {
    color: '#DC2626',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentToggle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  urgentToggleActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  urgentToggleText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    color: '#64748B',
  },
  urgentToggleTextActive: {
    color: '#DC2626',
  },
  addTaskForm: {
    backgroundColor: '#F0FDFA',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    marginTop: 4,
  },
  taskInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 12,
  },
  addTaskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  btnOutlineText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  btnPrimary: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  addReminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: 12,
    marginTop: 4,
  },
  addReminderText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F766E',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emphasizedCard: {
    borderColor: '#0F766E',
    borderWidth: 1.5,
  },
  emphasizedIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  actionSubLabel: {
    fontSize: 13,
    fontFamily: 'OpenSans_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
});
