import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { TriageScreen } from './screens/TriageScreen';
import { ConsultationScreen } from './screens/ConsultationScreen';
import { ReferralScreen } from './screens/ReferralScreen';
import { PatientsScreen } from './screens/PatientsScreen';
import { FollowupsScreen } from './screens/FollowupsScreen';
import { OfflineGuideScreen } from './screens/OfflineGuideScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const AppRouter: React.FC = () => {
  const { isLoggedIn, activeScreen, setActiveScreen, t, currentPatient } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="app-shell">
        <LoginScreen />
      </div>
    );
  }

  const goBack = () => {
    const backMap: Record<string, string> = {
      register: 'home',
      triage: 'register',
      consultation: 'triage',
      referral: 'consultation',
      patients: 'home',
      followups: 'home',
      guide: 'home',
      profile: 'home',
    };
    setActiveScreen(backMap[activeScreen] ?? 'home');
  };

  const screenConfig: Record<string, {
    title: string;
    subtitle?: string;
    showBack: boolean;
  }> = {
    home: {
      title: t.greeting,
      subtitle: t.subCentre,
      showBack: false,
    },
    register: {
      title: t.regTitle,
      showBack: true,
    },
    triage: {
      title: t.triageTitle,
      subtitle: currentPatient?.name,
      showBack: true,
    },
    consultation: {
      title: t.consultTitle,
      showBack: true,
    },
    referral: {
      title: t.referralTitle,
      showBack: true,
    },
    patients: {
      title: t.patientsTitle,
      showBack: true,
    },
    followups: {
      title: t.followupTitle,
      showBack: true,
    },
    guide: {
      title: t.guideTitle,
      showBack: true,
    },
    profile: {
      title: t.profile ?? 'Profile',
      subtitle: t.ashaWorkerName,
      showBack: true,
    },
  };

  const config = screenConfig[activeScreen] ?? screenConfig.home;

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':         return <HomeScreen />;
      case 'register':     return <RegistrationScreen />;
      case 'triage':       return <TriageScreen />;
      case 'consultation': return <ConsultationScreen />;
      case 'referral':     return <ReferralScreen />;
      case 'patients':     return <PatientsScreen />;
      case 'followups':    return <FollowupsScreen />;
      case 'guide':        return <OfflineGuideScreen />;
      case 'profile':      return <ProfileScreen />;
      default:             return <HomeScreen />;
    }
  };

  return (
    <MobileShell
      title={config.title}
      subtitle={config.subtitle}
      showBack={config.showBack}
      onBack={goBack}
      showNav={!['register', 'triage', 'consultation', 'referral'].includes(activeScreen)}
    >
      {renderScreen()}
    </MobileShell>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
