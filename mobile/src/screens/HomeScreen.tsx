import React from 'react';
import { useApp } from '../context/AppContext';

// Icons
const UserAddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const HomeScreen: React.FC = () => {
  const { t, setActiveScreen, setActiveTab, setCurrentPatient, patients } = useApp();
  const urgentPatient = patients.find(p => p.lastTriage === 'EMERGENCY');

  const goTo = (screen: string, tab?: string) => {
    setActiveScreen(screen);
    if (tab) setActiveTab(tab);
  };

  return (
    <div className="screen-body">
      {/* Today's summary card */}
      <div style={{ marginBottom: 16 }}>
        <p className="section-title">{t.todayWork}</p>
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SummaryRow icon="📋" text={t.followupsCount} color="#616161" />
            <div style={{ height: 1, background: '#F5F5F5' }} />
            <SummaryRow icon="🔄" text={t.syncPending} color="#F57C00" />
            <div style={{ height: 1, background: '#F5F5F5' }} />
            <SummaryRow icon="⚠️" text={t.urgentCase} color="#D32F2F" />
          </div>
        </div>
      </div>

      {/* Primary actions */}
      <div style={{ marginBottom: 16 }}>
        <p className="section-title" style={{ marginBottom: 10 }}>कामे</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActionCard
            icon={<UserAddIcon />}
            label={t.newPatient}
            sublabel="नवीन रुग्ण नोंदणी करा"
            onClick={() => goTo('register')}
          />
          <ActionCard
            icon={<PeopleIcon />}
            label={t.myPatients}
            sublabel={`${patients.length} नोंदणीकृत रुग्ण`}
            onClick={() => goTo('patients', 'patients')}
          />
          <ActionCard
            icon={<VideoIcon />}
            label={t.startConsultation}
            sublabel="PHC डॉक्टरांशी व्हिडिओ सल्लामसलत"
            onClick={() => goTo('consultation')}
            emphasized
          />
        </div>
      </div>

      {/* Urgent tasks */}
      {urgentPatient && (
        <div>
          <p className="section-title">{t.urgentTasks}</p>
          <div className="card-emergency">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <AlertCircleIcon />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>
                  {urgentPatient.name} — श्वास घेण्यास त्रास
                </div>
                <div style={{ fontSize: 14, color: '#616161', marginTop: 2 }}>
                  {t.urgentNeedsAttention}
                </div>
              </div>
            </div>
            <button
              className="btn-danger"
              onClick={() => {
                setCurrentPatient(urgentPatient);
                goTo('triage');
              }}
            >
              {t.openPatient}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryRow = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span style={{ fontSize: 15, fontWeight: 500, color }}>{text}</span>
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
    <div style={{
      width: 44, height: 44,
      background: emphasized ? '#1565C0' : '#F5F5F5',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: emphasized ? '#fff' : '#1565C0',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, textAlign: 'left' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#212121' }}>{label}</div>
      <div style={{ fontSize: 13, color: '#616161', marginTop: 1 }}>{sublabel}</div>
    </div>
    <ChevronRightIcon />
  </button>
);
