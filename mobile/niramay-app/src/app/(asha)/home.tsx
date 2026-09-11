import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl, TextInput, Modal, Alert
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

interface TaskItem {
  id: string;
  title: string;
  category: string;
  urgency: 'URGENT' | 'ROUTINE' | 'EMERGENCY';
  visited: boolean;
  time?: string;
}

export default function AshaHomeScreen() {
  const { user, session, t } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [urgentCount, setUrgentCount] = useState(2);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Form States (Add/Edit)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskUrgency, setTaskUrgency] = useState<'URGENT' | 'ROUTINE'>('ROUTINE');
  const [taskTime, setTaskTime] = useState('Today • 2:00 PM');
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch Reminders from Backend ───────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/v1/tasks/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const apiTasks: TaskItem[] = data.map((t: any) => ({
            id: String(t.id),
            title: t.title || 'Reminder',
            category: t.category || 'Today',
            urgency: (t.urgency === 'URGENT' ? 'URGENT' : 'ROUTINE') as 'URGENT' | 'ROUTINE',
            visited: Boolean(t.visited),
            time: t.category || 'Today',
          }));

          setTasks(apiTasks);
          const count = apiTasks.filter(t => t.urgency === 'URGENT' && !t.visited).length;
          if (count > 0) {
            setUrgentCount(count);
          }
        }
      }
    } catch {
      // Keep state on network issue
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [session?.access_token])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // ── Mark Complete / Incomplete ─────────────────────────────────────────────
  const toggleTask = async (id: string, currentVisited: boolean) => {
    const nextVisited = !currentVisited;

    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, visited: nextVisited } : t))
    );

    const token = session?.access_token;
    if (token) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ visited: nextVisited }),
        });
        if (!res.ok) {
          // Revert on failure
          setTasks(prev =>
            prev.map(t => (t.id === id ? { ...t, visited: currentVisited } : t))
          );
        }
      } catch {
        // Revert on failure
        setTasks(prev =>
          prev.map(t => (t.id === id ? { ...t, visited: currentVisited } : t))
        );
      }
    }
  };

  // ── Create Reminder (POST /api/v1/tasks/) ──────────────────────────────────
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Required', 'Please enter a reminder title.');
      return;
    }

    const token = session?.access_token;
    if (!token) {
      Alert.alert('Error', 'Authentication required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle.trim(),
          category: taskTime.trim() || 'Today',
          urgency: taskUrgency,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        const newTask: TaskItem = {
          id: String(created.id),
          title: created.title,
          category: created.category,
          urgency: created.urgency === 'URGENT' ? 'URGENT' : 'ROUTINE',
          visited: Boolean(created.visited),
          time: created.category || 'Today',
        };
        setTasks(prev => [newTask, ...prev]);
        setShowAddModal(false);
        setTaskTitle('');
        setTaskUrgency('ROUTINE');
        setTaskTime('Today • 2:00 PM');
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.detail || 'Failed to create reminder.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Edit Reminder (PATCH /api/v1/tasks/{id}) ───────────────────────────────
  const handleUpdateTask = async () => {
    if (!selectedTask || !taskTitle.trim()) return;

    const token = session?.access_token;
    if (!token) {
      Alert.alert('Error', 'Authentication required.');
      return;
    }

    setActionLoading(true);
    try {
      const dueDateTime = taskTime.trim() || 'Today';

      const res = await fetch(`${BACKEND_URL}/api/v1/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle.trim(),
          category: dueDateTime,
          urgency: taskUrgency,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev =>
          prev.map(t =>
            t.id === selectedTask.id
              ? {
                  ...t,
                  title: updated.title,
                  category: updated.category,
                  urgency: updated.urgency === 'URGENT' ? 'URGENT' : 'ROUTINE',
                  time: updated.category,
                }
              : t
          )
        );
        setShowEditModal(false);
        setSelectedTask(null);
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.detail || 'Failed to update reminder.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete Reminder (DELETE /api/v1/tasks/{id}) ────────────────────────────
  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    const token = session?.access_token;
    if (!token) {
      Alert.alert('Error', 'Authentication required.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/tasks/${selectedTask.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204 || res.ok) {
        setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
        setShowEditModal(false);
        setSelectedTask(null);
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.detail || 'Failed to delete reminder.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Open Edit Modal for a Task ─────────────────────────────────────────────
  const openEditModal = (task: TaskItem) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskUrgency(task.urgency === 'URGENT' ? 'URGENT' : 'ROUTINE');
    setTaskTime(task.time || task.category || 'Today');
    setShowEditModal(true);
  };

  const displayName = user?.name?.split(' ')[0] || 'ASHA';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Header Bar ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarMini}>
            <FontAwesome5 name="user-nurse" size={18} color="#059669" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greetingSub}>{t('goodMorning')}</Text>
            <Text style={styles.greetingName}>{displayName}!</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push('/(asha)/profile')}
        >
          <FontAwesome5 name="user-circle" size={28} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* ── Urgent Referrals Card ── */}
      <TouchableOpacity
        style={styles.urgentBanner}
        activeOpacity={0.85}
        onPress={() => router.push('/(asha)/referral')}
      >
        <View style={styles.urgentIconCircle}>
          <FontAwesome5 name="exclamation-triangle" size={18} color="#DC2626" />
        </View>
        <View style={styles.urgentTextGroup}>
          <Text style={styles.urgentTitle}>{urgentCount} {t('urgentReferrals')}</Text>
          <Text style={styles.urgentSub}>{t('requireAttention')}</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={14} color="#DC2626" />
      </TouchableOpacity>

      {/* ── 2x2 Quick Action Cards ── */}
      <View style={styles.actionGrid}>
        {/* Card 1: New Patient */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardGreen]}
          activeOpacity={0.85}
          onPress={() => router.push('/(asha)/register')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#D1FAE5' }]}>
            <FontAwesome5 name="user-plus" size={20} color="#059669" />
          </View>
          <Text style={styles.actionCardTitle}>{t('newPatient')}</Text>
        </TouchableOpacity>

        {/* Card 2: My Patients */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardBlue]}
          activeOpacity={0.85}
          onPress={() => router.push('/(asha)/patients')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#DBEAFE' }]}>
            <FontAwesome5 name="users" size={20} color="#2563EB" />
          </View>
          <Text style={styles.actionCardTitle}>{t('myPatients')}</Text>
        </TouchableOpacity>

        {/* Card 3: Follow-ups */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardOrange]}
          activeOpacity={0.85}
          onPress={() => router.push('/(asha)/followup')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#FFEDD5' }]}>
            <FontAwesome5 name="calendar-check" size={20} color="#EA580C" />
          </View>
          <Text style={styles.actionCardTitle}>{t('followupTitle')}</Text>
        </TouchableOpacity>

        {/* Card 4: Referrals */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardPurple]}
          activeOpacity={0.85}
          onPress={() => router.push('/(asha)/referral')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#F3E8FF' }]}>
            <FontAwesome5 name="file-medical-alt" size={20} color="#9333EA" />
          </View>
          <Text style={styles.actionCardTitle}>{t('phc.referrals')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Today's Tasks Section ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('todaysTasks')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.taskCounter}>{tasks.filter(t => !t.visited).length} {t('remaining')}</Text>
            <TouchableOpacity
              style={styles.addTaskBtn}
              onPress={() => {
                setTaskTitle('');
                setTaskUrgency('ROUTINE');
                setTaskTime('Today • 2:00 PM');
                setShowAddModal(true);
              }}
            >
              <FontAwesome5 name="plus" size={11} color="#059669" />
              <Text style={styles.addTaskBtnText}>{t('add')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.taskList}>
          {tasks.length === 0 ? (
            <View style={styles.emptyTasksCard}>
              <View style={styles.emptyTasksIconCircle}>
                <FontAwesome5 name="clipboard-check" size={18} color="#059669" />
              </View>
              <Text style={styles.emptyTasksTitle}>{t('noReminders')}</Text>
              <Text style={styles.emptyTasksSubtitle}>{t('noPendingTasks')}</Text>
            </View>
          ) : (
            tasks.map((task) => (
              <View
                key={task.id}
                style={[styles.taskCard, task.visited && styles.taskCardCompleted]}
              >
                {/* Tapping task body opens Edit Modal */}
                <TouchableOpacity
                  style={styles.taskLeftGroup}
                  activeOpacity={0.7}
                  onPress={() => openEditModal(task)}
                >
                  <View
                    style={[
                      styles.taskIconBadge,
                      task.urgency === 'URGENT' ? styles.badgeRed : styles.badgeBlue,
                      task.visited && styles.badgeGrey,
                    ]}
                  >
                    <FontAwesome5
                      name={
                        task.urgency === 'URGENT'
                          ? 'exclamation-circle'
                          : 'calendar-alt'
                      }
                      size={14}
                      color={
                        task.visited
                          ? '#94A3B8'
                          : task.urgency === 'URGENT'
                          ? '#DC2626'
                          : '#2563EB'
                      }
                    />
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text
                      style={[styles.taskTitle, task.visited && styles.taskTitleCompleted]}
                      numberOfLines={1}
                    >
                      {task.title}
                    </Text>
                    {task.time && (
                      <Text style={styles.taskTime}>{task.time}</Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Tapping Circle toggles Complete / Incomplete */}
                <TouchableOpacity
                  accessibilityLabel="Toggle Complete"
                  style={[styles.checkCircle, task.visited && styles.checkCircleActive]}
                  activeOpacity={0.8}
                  onPress={() => toggleTask(task.id, task.visited)}
                >
                  {task.visited && <FontAwesome5 name="check" size={10} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* ───────────────────────────────────────────────────────────────────────
          ADD REMINDER MODAL
      ──────────────────────────────────────────────────────────────────────── */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('newReminder')}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <FontAwesome5 name="times" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.modalLabel}>{t('reminderTitle')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Visit Meena Bai for BP check"
              placeholderTextColor="#94A3B8"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            {/* Priority */}
            <Text style={styles.modalLabel}>{t('priority')}</Text>
            <View style={styles.prioritySelector}>
              <TouchableOpacity
                accessibilityLabel="Priority Normal"
                style={[styles.priorityOpt, taskUrgency === 'ROUTINE' && styles.priorityOptActiveNormal]}
                onPress={() => setTaskUrgency('ROUTINE')}
              >
                <Text style={[styles.priorityOptText, taskUrgency === 'ROUTINE' && styles.priorityOptTextActive]}>
                  {t('priorityNormal')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Priority Urgent"
                style={[styles.priorityOpt, taskUrgency === 'URGENT' && styles.priorityOptActiveUrgent]}
                onPress={() => setTaskUrgency('URGENT')}
              >
                <Text style={[styles.priorityOptText, taskUrgency === 'URGENT' && styles.priorityOptTextActive]}>
                  {t('priorityUrgent')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Due Date/Time */}
            <Text style={styles.modalLabel}>{t('dueDateTime')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Today • 2:00 PM"
              placeholderTextColor="#94A3B8"
              value={taskTime}
              onChangeText={setTaskTime}
            />

            {/* Submit Button */}
            <TouchableOpacity
              accessibilityLabel="Create Reminder Button"
              style={styles.modalPrimaryBtn}
              activeOpacity={0.85}
              onPress={handleCreateTask}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>{t('createReminder')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ───────────────────────────────────────────────────────────────────────
          EDIT / DELETE REMINDER MODAL
      ──────────────────────────────────────────────────────────────────────── */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('editReminder')}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <FontAwesome5 name="times" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={styles.modalLabel}>{t('reminderTitle')}</Text>
            <TextInput
              style={styles.modalInput}
              value={taskTitle}
              onChangeText={setTaskTitle}
            />

            {/* Priority */}
            <Text style={styles.modalLabel}>{t('priority')}</Text>
            <View style={styles.prioritySelector}>
              <TouchableOpacity
                accessibilityLabel="Edit Priority Normal"
                style={[styles.priorityOpt, taskUrgency === 'ROUTINE' && styles.priorityOptActiveNormal]}
                onPress={() => setTaskUrgency('ROUTINE')}
              >
                <Text style={[styles.priorityOptText, taskUrgency === 'ROUTINE' && styles.priorityOptTextActive]}>
                  {t('priorityNormal')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Edit Priority Urgent"
                style={[styles.priorityOpt, taskUrgency === 'URGENT' && styles.priorityOptActiveUrgent]}
                onPress={() => setTaskUrgency('URGENT')}
              >
                <Text style={[styles.priorityOptText, taskUrgency === 'URGENT' && styles.priorityOptTextActive]}>
                  {t('priorityUrgent')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Due Date/Time */}
            <Text style={styles.modalLabel}>{t('dueDateTime')}</Text>
            <TextInput
              style={styles.modalInput}
              value={taskTime}
              onChangeText={setTaskTime}
            />

            {/* Status Toggle in Modal */}
            {selectedTask && (
              <TouchableOpacity
                style={styles.statusToggleBtn}
                onPress={() => {
                  toggleTask(selectedTask.id, selectedTask.visited);
                  setSelectedTask(prev => prev ? { ...prev, visited: !prev.visited } : null);
                }}
              >
                <FontAwesome5
                  name={selectedTask.visited ? 'undo' : 'check'}
                  size={13}
                  color={selectedTask.visited ? '#D97706' : '#059669'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.statusToggleText, { color: selectedTask.visited ? '#D97706' : '#059669' }]}>
                  {selectedTask.visited ? t('markIncomplete') : t('markCompleted')}
                </Text>
              </TouchableOpacity>
            )}

            {/* Save Button */}
            <TouchableOpacity
              accessibilityLabel="Save Changes Button"
              style={styles.modalPrimaryBtn}
              activeOpacity={0.85}
              onPress={handleUpdateTask}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>{t('saveChanges')}</Text>
              )}
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              accessibilityLabel="Delete Reminder Button"
              style={styles.deleteBtn}
              activeOpacity={0.85}
              onPress={handleDeleteTask}
              disabled={actionLoading}
            >
              <FontAwesome5 name="trash-alt" size={13} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.deleteBtnText}>{t('deleteReminder')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  greetingSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  greetingName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  profileBtn: {
    padding: 4,
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  urgentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  urgentTextGroup: {
    flex: 1,
  },
  urgentTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#991B1B',
  },
  urgentSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#DC2626',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  actionCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  actionCardOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  actionCardPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  actionIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  sectionContainer: {
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  taskCounter: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
    marginRight: 8,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  addTaskBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
    marginLeft: 4,
  },
  taskList: {
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.75,
  },
  taskLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeRed: {
    backgroundColor: '#FEE2E2',
  },
  badgeBlue: {
    backgroundColor: '#EFF6FF',
  },
  badgeGrey: {
    backgroundColor: '#F1F5F9',
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskTime: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkCircleActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  emptyTasksCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyTasksIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTasksTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyTasksSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
  },

  // Modal Styles
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  modalLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
    marginBottom: 12,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityOpt: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityOptActiveNormal: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  priorityOptActiveUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  priorityOptText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  priorityOptTextActive: {
    color: '#0F172A',
    fontFamily: 'Inter_700Bold',
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  statusToggleText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  modalPrimaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  modalPrimaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginTop: 8,
  },
  deleteBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#DC2626',
  },
});
