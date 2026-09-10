import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../store/AuthContext';
import { TouchableOpacity } from 'react-native';

export default function AshaLayout() {
  const { t, signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#00796B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#00796B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home') || 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: t('patientsTitle') || 'Patients',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="followup"
        options={{
          title: t('followupTitle') || 'Follow Ups',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t('guideTitle') || 'Guide',
          tabBarIcon: ({ color }) => <FontAwesome5 name="book-medical" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile') || 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-nurse" size={24} color={color} />,
        }}
      />
      {/* Hidden Stack Screens */}
      <Tabs.Screen
        name="triage"
        options={{
          href: null,
          title: t('triageTitle') || 'Triage',
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
          title: t('regTitle') || 'Register',
        }}
      />
      <Tabs.Screen
        name="consultation"
        options={{
          href: null,
          title: t('consultTitle') || 'Consultation',
        }}
      />
      <Tabs.Screen
        name="referral"
        options={{
          href: null,
          title: t('referralTitle') || 'Referral',
        }}
      />
    </Tabs>
  );
}
