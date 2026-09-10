import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://duptgkylijtgakaujqdb.supabase.co';
const supabaseAnonKey = 'sb_publishable_T0H8xjc_P0KOZDM6CCVw1Q_kyBxMbuO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
