import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { useEffect } from 'react';
import { initSyncQueueListeners } from '../lib/syncQueue';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { OpenSans_400Regular, OpenSans_500Medium, OpenSans_600SemiBold, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const { session, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initSyncQueueListeners();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (session && role) {
      // If we are logged in and have a role, enforce correct group routing
      const inAshaGroup = segments[0] === '(asha)';
      const inPhcGroup = segments[0] === '(phc)';
      const inDistrictGroup = segments[0] === '(district)';

      if (role === 'asha' && !inAshaGroup) {
        router.replace('/(asha)/home');
      } else if (role === 'phc_doctor' && !inPhcGroup) {
        router.replace('/(phc)/home');
      } else if (role === 'district' && !inDistrictGroup) {
        router.replace('/(district)/home');
      } else if (inAuthGroup) {
        // Logged in but still on login screen
        if (role === 'asha') router.replace('/(asha)/home');
        if (role === 'phc_doctor') router.replace('/(phc)/home');
        if (role === 'district') router.replace('/(district)/home');
      }
    } else if (session && !role && !inAuthGroup) {
      // Session exists but no role yet (first time login, still in login screen setting it up)
      router.replace('/(auth)/login');
    }
  }, [session, role, isLoading, segments]);

  return <Slot />;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
