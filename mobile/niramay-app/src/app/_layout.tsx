import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { useEffect } from 'react';

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
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
