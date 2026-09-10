import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { TRANSLATIONS, Language } from '../lib/translations';

type Role = 'asha' | 'phc_doctor' | 'district' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: Role;
  language: string;
  isLoading: boolean;
  t: (key: string) => string;
  setLanguage: (lang: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRoleOverride: (role: Role) => void;
  bypassLogin: (role: Role) => void;
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
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, language')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        setRole(data.role as Role);
        if (data.language) {
          setLanguageState(data.language);
          await AsyncStorage.setItem('app_language', data.language);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      await loadLanguage();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (mounted) {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setIsLoading(false);
      }
    };
    
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
