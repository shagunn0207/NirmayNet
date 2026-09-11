import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { OpenSans_400Regular, OpenSans_500Medium, OpenSans_600SemiBold, OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
  const { session, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (session && role) {
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
        if (role === 'asha') router.replace('/(asha)/home');
        if (role === 'phc_doctor') router.replace('/(phc)/home');
        if (role === 'district') router.replace('/(district)/home');
      }
    } else if (session && !role && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [session, role, isLoading, segments]);

  return (
    <div className="web-phone-background">
      <div className="phone-viewport">
        <div className="phone-device">
          <div className="phone-frame">
            <div className="phone-screen">
              <div className="status-bar" aria-hidden />
              <div className="app-screen">
                <Slot />
              </div>
              <div className="home-indicator" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
