import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Icons
const UserAddIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const VideoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const PencilIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const HomeScreen: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    setActiveScreen,
    setActiveTab,
    setCurrentPatient,
    patients,
    tasks,
    addNewTask,
    updateTaskItem,
    deleteTaskItem,
    networkStatus,
    setNetworkStatus,
    isFirstLogin,
  } = useApp();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isNewTaskUrgent, setIsNewTaskUrgent] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [reminderFilter, setReminderFilter] = useState<'today' | 'scheduled' | 'all' | 'completed'>('today');

  const urgentPatient = patients.find(p => p.lastTriage === 'EMERGENCY');

  const goTo = (screen: string, tab?: string) => {
    setActiveScreen(screen);
    if (tab) setActiveTab(tab);
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addNewTask(newTaskTitle, 'General', isNewTaskUrgent ? 'URGENT' : 'ROUTINE');
    setNewTaskTitle('');
    setIsNewTaskUrgent(false);
    setIsAddingTask(false);
  };

  const startEdit = (id: string, currentTitle: string) => {
    setEditingTaskId(id);
    setEditingTitle(currentTitle);
  };

  const saveEdit = async (id: string) => {
    if (editingTitle.trim()) {
      await updateTaskItem(id, editingTitle.trim());
    }
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const filteredReminders = tasks.filter(task => {
    if (reminderFilter === 'completed') return task.visited;
    if (reminderFilter === 'today') return !task.visited && (task.urgency === 'EMERGENCY' || task.id === 'T1' || task.title.toLowerCase().includes('anc') || !task.category);
    if (reminderFilter === 'scheduled') return !task.visited && (task.urgency === 'URGENT' || task.id !== 'T1');
    return true; // 'all'
  });

  const getGreetingPrefix = () => {
    switch (language) {
      case 'mr': return 'नमस्कार';
      case 'hi': return 'नमस्ते';
      case 'kn': return 'ನಮಸ್ಕಾರ';
      default: return isFirstLogin ? 'Welcome,' : 'Welcome back,';
    }
  };

  return (
    <div className="screen-body">
      {/* Logged-in User Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        borderRadius: 18,
        padding: '16px 20px',
        color: '#ffffff',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.2)',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#CCFBF1', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {getGreetingPrefix()}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
            {currentUser?.fullName || t.ashaWorkerName}
          </div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1.5px solid rgba(255, 255, 255, 0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 800,
        }}>
          👩‍⚕️
        </div>
      </div>

      {/* Reminders Layout Section (Replaces Today's Work & Tasks) */}
      <div style={{ marginBottom: 20 }}>
        {/* Header Title & SQLite Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="section-title" style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
              🔔 {t.reminders}
            </p>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0F766E', background: '#F0FDFA', padding: '2px 8px', borderRadius: 12, border: '1px solid #CCFBF1' }}>
              {filteredReminders.length}
            </span>
          </div>
          {/* Network-aware sync indicator */}
          {networkStatus === 'offline' ? (
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#B45309',
              background: '#FEF3C7', padding: '4px 10px', borderRadius: 12,
              border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              📶 {t.syncWhenOnline}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNetworkStatus('syncing');
                setTimeout(() => setNetworkStatus('synced'), 1500);
              }}
              style={{
                fontSize: 11, fontWeight: 800, color: networkStatus === 'syncing' ? '#0F766E' : '#0369A1',
                background: networkStatus === 'syncing' ? '#F0FDFA' : '#EFF6FF',
                padding: '4px 12px', borderRadius: 12,
                border: `1px solid ${networkStatus === 'syncing' ? '#CCFBF1' : '#BAE6FD'}`,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              {networkStatus === 'syncing' ? '🔄 Syncing…' : `☁️ ${t.syncNow}`}
            </button>
          )}

        </div>

        {/* Filter Badges Row: today, scheduled, all, completed */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 14,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}>
          {[
            { key: 'today', icon: '📅', label: t.filterToday, count: tasks.filter(t => !t.visited && (t.urgency === 'EMERGENCY' || t.id === 'T1' || t.title.toLowerCase().includes('anc') || !t.category)).length },
            { key: 'scheduled', icon: '🗓️', label: t.filterScheduled, count: tasks.filter(t => !t.visited && t.id !== 'T1').length },
            { key: 'all', icon: '📋', label: t.filterAll, count: tasks.length },
            { key: 'completed', icon: '✅', label: t.filterCompleted, count: tasks.filter(t => t.visited).length },
          ].map(b => {
            const isActive = reminderFilter === b.key;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => setReminderFilter(b.key as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 9999,
                  border: isActive ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                  background: isActive ? '#0F766E' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 3px 10px rgba(15, 118, 110, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
                <span style={{
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontWeight: 800,
                }}>
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reminders List Card */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredReminders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: '#94A3B8' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🔔</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {reminderFilter === 'completed' ? 'No completed reminders yet' : 'No reminders in this list'}
              </div>
            </div>
          ) : (
            filteredReminders.map(task => {
              const isUrgent = task.urgency === 'URGENT' || task.urgency === 'EMERGENCY';
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: task.visited ? '#F8FAFC' : isUrgent ? '#FEF2F2' : '#FFFFFF',
                    border: task.visited ? '1px solid #E2E8F0' : isUrgent ? '1.5px solid #FCA5A5' : '1px solid #CBD5E1',
                    borderLeft: !task.visited && isUrgent ? '5px solid #DC2626' : undefined,
                    boxShadow: task.visited ? 'none' : '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  {editingTaskId === task.id ? (
                    <div style={{ display: 'flex', gap: 8, flex: 1, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        style={{ minHeight: 38, fontSize: 14, padding: '4px 10px' }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => saveEdit(task.id)}
                        style={{ minHeight: 38, padding: '0 12px', fontSize: 13 }}
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={cancelEdit}
                        style={{ minHeight: 38, padding: '0 10px', fontSize: 13 }}
                      >
                        {t.cancel}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                        <input
                          type="checkbox"
                          checked={task.visited}
                          onChange={e => updateTaskItem(task.id, task.title, e.target.checked, task.urgency)}
                          style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#0F766E', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: task.visited ? '#94A3B8' : isUrgent ? '#991B1B' : '#0F172A',
                            textDecoration: task.visited ? 'line-through' : 'none',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {task.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            {task.category && (
                              <span style={{
                                display: 'inline-block',
                                fontSize: 11,
                                fontWeight: 700,
                                color: isUrgent ? '#DC2626' : '#0F766E',
                                background: isUrgent ? '#FFE4E6' : '#F0FDFA',
                                padding: '1px 7px',
                                borderRadius: 6,
                              }}>
                                {task.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        {/* Toggle Urgent / Important Badge */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextUrgency = isUrgent ? 'ROUTINE' : 'URGENT';
                            updateTaskItem(task.id, task.title, task.visited, nextUrgency);
                          }}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '4px 9px', borderRadius: 20,
                            border: isUrgent ? '1.5px solid #FCA5A5' : '1px solid #CBD5E1',
                            background: isUrgent ? '#FEF2F2' : '#FFFFFF',
                            color: isUrgent ? '#DC2626' : '#64748B',
                            fontSize: 11, fontWeight: 800, cursor: 'pointer',
                          }}
                          title="Click to mark urgent/important"
                        >
                          {isUrgent ? '🔴 Urgent' : '⚪ Normal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(task.id, task.title)}
                          style={{ background: 'none', border: 'none', color: '#0F766E', padding: 6, cursor: 'pointer' }}
                          title={t.edit}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTaskItem(task.id)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', padding: 6, cursor: 'pointer' }}
                          title={t.delete}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}

          {/* Add Reminder Inline Form */}
          {isAddingTask ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4, padding: 14, borderRadius: 14, background: '#F0FDFA', border: '1.5px solid #CCFBF1' }}>
              <input
                type="text"
                className="form-input"
                placeholder={t.typeReminderPlaceholder}
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsNewTaskUrgent(u => !u)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 20,
                    border: isNewTaskUrgent ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                    background: isNewTaskUrgent ? '#FEF2F2' : '#FFFFFF',
                    color: isNewTaskUrgent ? '#991B1B' : '#64748B',
                    fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  <span>{isNewTaskUrgent ? '🔴 Urgent / Important' : '⚪ Mark Urgent'}</span>
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => { setIsAddingTask(false); setIsNewTaskUrgent(false); }}
                    style={{ minHeight: 38, padding: '0 14px', fontSize: 13 }}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCreateTask}
                    style={{ minHeight: 38, padding: '0 18px', fontSize: 13 }}
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsAddingTask(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                minHeight: 46,
                borderColor: '#0F766E',
                color: '#0F766E',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 14,
                marginTop: 4,
              }}
            >
              <PlusIcon />
              <span>{t.addReminder}</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary actions */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-title">{t.tasks}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ActionCard
            icon={<UserAddIcon />}
            label={t.newPatient}
            sublabel={t.newPatientSub}
            onClick={() => goTo('register')}
          />
          <ActionCard
            icon={<PeopleIcon />}
            label={t.myPatients}
            sublabel={`${patients.length} ${t.registeredPatients}`}
            onClick={() => goTo('patients', 'patients')}
          />
          <ActionCard
            icon={<VideoIcon />}
            label={t.startConsultation}
            sublabel={t.startConsultationSub}
            onClick={() => goTo('consultation')}
            emphasized
          />
        </div>
      </div>

      {/* Urgent Tasks Section on Dashboard */}
      {(() => {
        const urgentReminders = tasks.filter(t => !t.visited && (t.urgency === 'URGENT' || t.urgency === 'EMERGENCY'));
        const hasUrgentItems = urgentReminders.length > 0 || Boolean(urgentPatient);

        if (!hasUrgentItems) return null;

        return (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p className="section-title" style={{ margin: 0, color: '#DC2626' }}>
                ⚡ {t.urgentTasks} ({urgentReminders.length + (urgentPatient ? 1 : 0)})
              </p>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '2px 8px', borderRadius: 10, border: '1px solid #FCA5A5' }}>
                High Priority
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Emergency Triage Patient Card */}
              {urgentPatient && (
                <div className="card-emergency">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                    <AlertCircleIcon />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>
                        {urgentPatient.name} — {t.symptomBreathing}
                      </div>
                      <div style={{ fontSize: 13, color: '#475569', marginTop: 3, fontWeight: 500 }}>
                        {t.urgentNeedsAttention}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => {
                      setCurrentPatient(urgentPatient);
                      goTo('triage');
                    }}
                  >
                    {t.openPatient}
                  </button>
                </div>
              )}

              {/* Marked Urgent Reminders Cards */}
              {urgentReminders.map(uTask => (
                <div
                  key={uTask.id}
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    borderLeft: '5px solid #DC2626',
                    borderRadius: 16,
                    padding: '14px 16px',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', background: '#FFE4E6', padding: '2px 8px', borderRadius: 6 }}>
                          🔴 URGENT REMINDER
                        </span>
                        {uTask.category && (
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F766E', background: '#F0FDFA', padding: '2px 6px', borderRadius: 6 }}>
                            {uTask.category}
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#991B1B' }}>
                        {uTask.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => updateTaskItem(uTask.id, uTask.title, true, uTask.urgency)}
                      style={{
                        flex: 1, minHeight: 38,
                        background: '#DC2626', color: '#FFFFFF',
                        border: 'none', borderRadius: 10,
                        fontSize: 13, fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      ✓ Mark Done
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTaskItem(uTask.id, uTask.title, uTask.visited, 'ROUTINE')}
                      style={{
                        minHeight: 38, padding: '0 12px',
                        background: '#FFFFFF', color: '#64748B',
                        border: '1px solid #CBD5E1', borderRadius: 10,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                      title="Remove from Urgent tasks"
                    >
                      Unmark Urgent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const SummaryRow = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color }}>{text}</span>
  </div>
);

const ActionCard = ({
  icon, label, sublabel, onClick, emphasized,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  emphasized?: boolean;
}) => (
  <button
    type="button"
    className={`action-card${emphasized ? ' emphasized' : ''}`}
    onClick={onClick}
  >
    <div className="action-card-icon" style={{
      background: emphasized ? '#0F766E' : '#F0FDFA',
      color: emphasized ? '#ffffff' : '#0F766E',
      borderColor: emphasized ? '#0D9488' : '#CCFBF1',
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, textAlign: 'left' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{label}</div>
      <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{sublabel}</div>
    </div>
    <ChevronRightIcon />
  </button>
);
