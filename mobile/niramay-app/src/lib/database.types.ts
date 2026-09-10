export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          created_at: string
          name: string
          age: number
          gender: 'M' | 'F' | 'Other'
          abha_id: string | null
          village: string
          phone: string | null
          asha_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          age: number
          gender: 'M' | 'F' | 'Other'
          abha_id?: string | null
          village: string
          phone?: string | null
          asha_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['patients']['Insert']>
      }
      consultations: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          asha_id: string
          phc_id: string | null
          symptoms: string
          triage_level: 'EMERGENCY' | 'URGENT' | 'ROUTINE'
          status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          asha_id: string
          phc_id?: string | null
          symptoms: string
          triage_level: 'EMERGENCY' | 'URGENT' | 'ROUTINE'
          status?: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['consultations']['Insert']>
      }
      referrals: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          from_phc_id: string
          to_district_id: string
          reason: string
          status: 'IN_TRANSIT' | 'ADMITTED' | 'DISCHARGED'
          vehicle_no: string | null
          driver_name: string | null
          estimated_time: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          from_phc_id: string
          to_district_id: string
          reason: string
          status?: 'IN_TRANSIT' | 'ADMITTED' | 'DISCHARGED'
          vehicle_no?: string | null
          driver_name?: string | null
          estimated_time?: string | null
        }
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>
      }
    }
  }
}
