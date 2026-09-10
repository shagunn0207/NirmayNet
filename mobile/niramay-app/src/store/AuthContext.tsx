import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { TRANSLATIONS, Language } from '../lib/translations';
import { BackendUser, mapBackendRole } from '../lib/apiClient';

type Role = 'asha' | 'phc_doctor' | 'district' | null;

export interface AuthUser {
  id: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  role?: Role;
  village?: string | null;
  facility_name?: string | null;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | any | null;
  role: Role;
  language: string;
  isLoading: boolean;
  t: (key: string) => string;
  setLanguage: (lang: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRoleOverride: (role: Role) => void;
  bypassLogin: (role: Role) => void;
  setBackendAuth: (token: string, user: BackendUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  language: 'english',
  isLoading: true,
  t: (key) => key,
  setLanguage: async () => {},
  signOut: async () => {},
  setRoleOverride: () => {},
  bypassLogin: () => {},
  setBackendAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | any | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [language, setLanguageState] = useState<string>('english');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadLanguage = async () => {
    try {
      const storedLang = await AsyncStorage.getItem('app_language');
      if (storedLang) {
        setLanguageState(storedLang);
      }
    } catch (e) {
      console.error('Failed to load language', e);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  };

  const setBackendAuth = async (token: string, backendUser: BackendUser) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('backend_user', JSON.stringify(backendUser));
    } catch (e) {
      console.error('Failed to save auth token', e);
    }
    const mappedRole = mapBackendRole(backendUser.role);
    setSession({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: backendUser.id,
        email: backendUser.email,
        phone: backendUser.phone,
      },
    } as any);
    setUser({
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      phone: backendUser.phone,
      role: mappedRole,
      village: backendUser.village,
      facility_name: backendUser.facility_name,
    });
    setRole(mappedRole);
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      await loadLanguage();

      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('backend_user');
        if (storedToken && storedUser) {
          const parsedUser: BackendUser = JSON.parse(storedUser);
          const mappedRole = mapBackendRole(parsedUser.role);
          if (mounted) {
            setSession({
              access_token: storedToken,
              token_type: 'bearer',
              user: {
                id: parsedUser.id,
                email: parsedUser.email,
                phone: parsedUser.phone,
              },
            } as any);
            setUser({
              id: parsedUser.id,
              name: parsedUser.name,
              email: parsedUser.email,
              phone: parsedUser.phone,
              role: mappedRole,
              village: parsedUser.village,
              facility_name: parsedUser.facility_name,
            });
            setRole(mappedRole);
            setIsLoading(false);
          }
          return;
        }
      } catch (err) {
        console.error('Failed to restore auth session', err);
      }

      if (mounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('backend_user');
    } catch (e) {
      console.error('Failed to remove auth session', e);
    }
    setSession(null);
    setUser(null);
    setRole(null);
    router.replace('/(auth)/login');
  };

  const bypassLogin = (selectedRole: Role) => {
    setSession({
      access_token: 'dummy',
      refresh_token: 'dummy',
      expires_in: 3600,
      token_type: 'bearer',
      user: { id: 'dummy_user_id' }
    } as any);
    setUser({
      id: 'dummy_user_id',
      name: 'Demo User',
      phone: '0000000000',
      role: selectedRole,
    });
    setRole(selectedRole);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language as Language] || TRANSLATIONS['english'];
    return dict[key] || TRANSLATIONS['english'][key] || key;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        language,
        isLoading,
        t,
        setLanguage,
        signOut,
        setRoleOverride: setRole,
        bypassLogin,
        setBackendAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
