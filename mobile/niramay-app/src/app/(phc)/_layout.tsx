import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useAuth } from '../../store/AuthContext';

export default function PhcLayout() {
  const { t } = useAuth();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarPosition: 'bottom',
        tabBarStyle: {
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 8 : 6,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 11,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('phc.home') || 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          title: t('patientsTitle') || 'Patients',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="consultations"
        options={{
          title: t('phc.consultations') || 'Consultations',
          tabBarIcon: ({ color }) => <FontAwesome5 name="stethoscope" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('phc.profile') || 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-md" size={20} color={color} />,
        }}
      />

      {/* Hidden Screens */}
      <Tabs.Screen name="referrals" options={{ href: null }} />
      <Tabs.Screen name="patient-record" options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
    </Tabs>
  );
}
