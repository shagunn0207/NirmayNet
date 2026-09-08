-- ========================================================
-- NirmayNet Rural Healthcare Care-Continuity Platform
-- Supabase PostgreSQL Database Schema (Phase 2 & Phase 6 updates)
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================================
-- ENUMS
-- ========================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ASHA', 'HOSPITAL', 'DHO', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE triage_category AS ENUM ('EMERGENCY', 'URGENT', 'ROUTINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE referral_status AS ENUM ('PENDING', 'DISPATCHED', 'CONFIRMED_ARRIVAL', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dispatch_status AS ENUM ('REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE followup_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teleconsult_status AS ENUM ('SCHEDULED', 'CONNECTING', 'CONNECTED', 'COMPLETED', 'SIGNAL_LOST', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ========================================================
-- TRIGGER FUNCTION FOR UPDATED_AT
-- ========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================================
-- 1. USERS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    hashed_password TEXT,
    role user_role NOT NULL DEFAULT 'ASHA',
    village TEXT,
    facility_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 2. PATIENTS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(20),
    village TEXT NOT NULL,
    abha_id VARCHAR(50),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- 3. TRIAGE RECORDS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS triage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    triage_score INT NOT NULL DEFAULT 0,
    triage_category triage_category NOT NULL DEFAULT 'ROUTINE',
    reason TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- 4. REFERRALS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_code VARCHAR(50) UNIQUE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    triage_record_id UUID REFERENCES triage_records(id) ON DELETE SET NULL,
    referring_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    destination_hospital TEXT NOT NULL,
    reason TEXT,
    status referral_status NOT NULL DEFAULT 'PENDING',
    arrived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON referrals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- 5. DISPATCH LOGS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS dispatch_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    eta_minutes INT,
    status dispatch_status NOT NULL DEFAULT 'DISPATCHED',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_dispatch_logs_updated_at
BEFORE UPDATE ON dispatch_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- 6. FOLLOWUPS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
    assigned_asha_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    urgency triage_category NOT NULL DEFAULT 'ROUTINE',
    followup_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status followup_status NOT NULL DEFAULT 'PENDING',
    visited BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_followups_updated_at
BEFORE UPDATE ON followups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- 7. TELECONSULTATIONS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS teleconsultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    room_id VARCHAR(100) NOT NULL,
    status teleconsult_status NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_teleconsultations_updated_at
BEFORE UPDATE ON teleconsultations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- INDEXES
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_patients_village ON patients(village);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_abha ON patients(abha_id);

CREATE INDEX IF NOT EXISTS idx_triage_patient_id ON triage_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_triage_category ON triage_records(triage_category);

CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_triage_id ON referrals(triage_record_id);
CREATE INDEX IF NOT EXISTS idx_referrals_arrived_at ON referrals(arrived_at);

CREATE INDEX IF NOT EXISTS idx_dispatch_referral_id ON dispatch_logs(referral_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_status ON dispatch_logs(status);

CREATE INDEX IF NOT EXISTS idx_followups_patient_id ON followups(patient_id);
CREATE INDEX IF NOT EXISTS idx_followups_status ON followups(status);
CREATE INDEX IF NOT EXISTS idx_followups_date ON followups(followup_date);

CREATE INDEX IF NOT EXISTS idx_teleconsult_patient_id ON teleconsultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_teleconsult_referral_id ON teleconsultations(referral_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ========================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE teleconsultations ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access policies for prototype development
CREATE POLICY "Allow read/write on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on triage_records" ON triage_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on dispatch_logs" ON dispatch_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on followups" ON followups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read/write on teleconsultations" ON teleconsultations FOR ALL USING (true) WITH CHECK (true);
