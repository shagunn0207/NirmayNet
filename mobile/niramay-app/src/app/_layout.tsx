import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../store/AuthContext';
import { useEffect } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

const RootLayoutNav = () => {
  const { session, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

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

  if (Platform.OS === 'web') {
    const isSmallScreen = width <= 480;
    return (
      <View style={styles.webPageBackground}>
        <View
          style={[
            styles.phoneContainer,
            isSmallScreen
              ? styles.phoneSmallScreen
              : {
                  maxHeight: Math.min(height - 32, 900),
                },
          ]}
        >
          <Slot />
        </View>
      </View>
    );
  }

  return <Slot />;
};

const styles = StyleSheet.create({
  webPageBackground: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 36,
    borderWidth: 8,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 12,
  },
  phoneSmallScreen: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
