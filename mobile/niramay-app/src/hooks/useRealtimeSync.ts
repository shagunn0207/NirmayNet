import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../store/AuthContext';

/**
 * A custom hook to listen for real-time changes in Supabase tables.
 * This ensures the PHC Dashboard stays perfectly in sync when an ASHA worker creates a new referral/consultation.
 */
export function useRealtimeSync(onUpdate: () => void) {
  const { user, role } = useAuth();

  useEffect(() => {
    // Only set up listeners if we are logged in and acting as a PHC doctor
    if (!user || role !== 'phc_doctor') return;

    // Listen to INSERTs and UPDATEs on the consultations table
    const consultationsChannel = supabase
      .channel('public:consultations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultations' },
        (payload) => {
          console.log('Realtime Consultation Update!', payload);
          // Trigger a callback to refetch data or update state
          onUpdate();
        }
      )
      .subscribe();

    // Listen to INSERTs and UPDATEs on the referrals table
    const referralsChannel = supabase
      .channel('public:referrals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referrals' },
        (payload) => {
          console.log('Realtime Referral Update!', payload);
          // Trigger a callback to refetch data or update state
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(consultationsChannel);
      supabase.removeChannel(referralsChannel);
    };
  }, [user, role, onUpdate]);
}
