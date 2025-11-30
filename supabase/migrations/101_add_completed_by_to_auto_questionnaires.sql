-- ============================================================================
-- eFondaMental Platform - Add completed_by to Auto-Questionnaire Tables
-- ============================================================================
-- This migration adds the completed_by column to the original auto-questionnaire
-- tables (ASRM, QIDS-SR16, MDQ) to track who completed each response.
-- This enables the hierarchy where doctor inputs take precedence over patient inputs.
-- ============================================================================

-- 1. Add completed_by column to responses_asrm
ALTER TABLE responses_asrm 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- 2. Add completed_by column to responses_qids_sr16
ALTER TABLE responses_qids_sr16 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- 3. Add completed_by column to responses_mdq
ALTER TABLE responses_mdq 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- 4. Add RLS policies for professionals to insert/update auto-questionnaires
-- (They can already SELECT, but need INSERT/UPDATE for override functionality)

-- ASRM Professional INSERT Policy
DROP POLICY IF EXISTS "Professionals can insert ASRM" ON responses_asrm;
CREATE POLICY "Professionals can insert ASRM" ON responses_asrm
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- ASRM Professional UPDATE Policy
DROP POLICY IF EXISTS "Professionals can update ASRM" ON responses_asrm;
CREATE POLICY "Professionals can update ASRM" ON responses_asrm
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- QIDS Professional INSERT Policy
DROP POLICY IF EXISTS "Professionals can insert QIDS" ON responses_qids_sr16;
CREATE POLICY "Professionals can insert QIDS" ON responses_qids_sr16
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- QIDS Professional UPDATE Policy
DROP POLICY IF EXISTS "Professionals can update QIDS" ON responses_qids_sr16;
CREATE POLICY "Professionals can update QIDS" ON responses_qids_sr16
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MDQ Professional INSERT Policy
DROP POLICY IF EXISTS "Professionals can insert MDQ" ON responses_mdq;
CREATE POLICY "Professionals can insert MDQ" ON responses_mdq
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MDQ Professional UPDATE Policy
DROP POLICY IF EXISTS "Professionals can update MDQ" ON responses_mdq;
CREATE POLICY "Professionals can update MDQ" ON responses_mdq
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- 5. Add unique constraint on visit_id for upsert support (if not exists)
-- These ensure we can use ON CONFLICT for upserts

-- Check and add unique constraint for responses_asrm
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_asrm_visit_id_key' 
        AND conrelid = 'responses_asrm'::regclass
    ) THEN
        ALTER TABLE responses_asrm ADD CONSTRAINT responses_asrm_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- Check and add unique constraint for responses_qids_sr16
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_qids_sr16_visit_id_key' 
        AND conrelid = 'responses_qids_sr16'::regclass
    ) THEN
        ALTER TABLE responses_qids_sr16 ADD CONSTRAINT responses_qids_sr16_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- Check and add unique constraint for responses_mdq
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_mdq_visit_id_key' 
        AND conrelid = 'responses_mdq'::regclass
    ) THEN
        ALTER TABLE responses_mdq ADD CONSTRAINT responses_mdq_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- 6. Create index on completed_by for faster lookups
CREATE INDEX IF NOT EXISTS idx_responses_asrm_completed_by ON responses_asrm(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_qids_sr16_completed_by ON responses_qids_sr16(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_mdq_completed_by ON responses_mdq(completed_by);

