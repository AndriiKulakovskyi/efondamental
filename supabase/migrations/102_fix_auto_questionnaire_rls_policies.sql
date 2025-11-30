-- ============================================================================
-- eFondaMental Platform - Fix Auto-Questionnaire RLS Policies
-- ============================================================================
-- This migration fixes the RLS policies for auto-questionnaire tables.
-- The original policies incorrectly compared auth.uid() with patient_id,
-- but patient_id is the patients table ID, not the auth.users ID.
-- 
-- The correct check is: patients.user_id = auth.uid()
-- ============================================================================

-- Drop existing patient SELECT policies
DROP POLICY IF EXISTS "Patients can view their own ASRM" ON responses_asrm;
DROP POLICY IF EXISTS "Patients can view their own QIDS" ON responses_qids_sr16;
DROP POLICY IF EXISTS "Patients can view their own MDQ" ON responses_mdq;

-- Drop existing patient INSERT policies
DROP POLICY IF EXISTS "Patients can insert their own ASRM" ON responses_asrm;
DROP POLICY IF EXISTS "Patients can insert their own QIDS" ON responses_qids_sr16;
DROP POLICY IF EXISTS "Patients can insert their own MDQ" ON responses_mdq;

-- Drop existing patient UPDATE policies
DROP POLICY IF EXISTS "Patients can update their own ASRM" ON responses_asrm;
DROP POLICY IF EXISTS "Patients can update their own QIDS" ON responses_qids_sr16;
DROP POLICY IF EXISTS "Patients can update their own MDQ" ON responses_mdq;

-- ============================================================================
-- ASRM Policies (Fixed)
-- ============================================================================

CREATE POLICY "Patients can view their own ASRM" ON responses_asrm
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_asrm.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert their own ASRM" ON responses_asrm
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own ASRM" ON responses_asrm
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_asrm.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

-- ============================================================================
-- QIDS-SR16 Policies (Fixed)
-- ============================================================================

CREATE POLICY "Patients can view their own QIDS" ON responses_qids_sr16
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_qids_sr16.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert their own QIDS" ON responses_qids_sr16
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own QIDS" ON responses_qids_sr16
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_qids_sr16.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

-- ============================================================================
-- MDQ Policies (Fixed)
-- ============================================================================

CREATE POLICY "Patients can view their own MDQ" ON responses_mdq
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_mdq.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert their own MDQ" ON responses_mdq
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = patient_id 
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own MDQ" ON responses_mdq
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_mdq.patient_id 
            AND patients.user_id = auth.uid()
        )
    );

