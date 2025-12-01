-- ============================================================================
-- eFondaMental Platform - Enforce Doctor-First Authority Model via RLS
-- ============================================================================
-- This migration modifies patient UPDATE policies to prevent patients from
-- modifying questionnaire responses that have been completed by a professional.
-- If a professional (healthcare_professional, manager, administrator) has
-- completed the questionnaire, the patient can only view but not modify it.
-- ============================================================================

-- ============================================================================
-- ASRM - Altman Self-Rating Mania Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own ASRM" ON responses_asrm;
CREATE POLICY "Patients can update their own ASRM" ON responses_asrm
    FOR UPDATE USING (
        -- Must be the patient's own response
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_asrm.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            -- Allow update only if not completed by a professional
            responses_asrm.completed_by IS NULL 
            OR responses_asrm.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_asrm.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- QIDS-SR16 - Quick Inventory of Depressive Symptomatology
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own QIDS" ON responses_qids_sr16;
CREATE POLICY "Patients can update their own QIDS" ON responses_qids_sr16
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_qids_sr16.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_qids_sr16.completed_by IS NULL 
            OR responses_qids_sr16.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_qids_sr16.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- MDQ - Mood Disorder Questionnaire
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own MDQ" ON responses_mdq;
CREATE POLICY "Patients can update their own MDQ" ON responses_mdq
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_mdq.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_mdq.completed_by IS NULL 
            OR responses_mdq.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_mdq.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- EQ-5D-5L - Quality of Life Questionnaire
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own EQ5D5L" ON responses_eq5d5l;
CREATE POLICY "Patients can update their own EQ5D5L" ON responses_eq5d5l
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_eq5d5l.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_eq5d5l.completed_by IS NULL 
            OR responses_eq5d5l.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_eq5d5l.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- PRISE-M - Side Effects Questionnaire
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own PRISE_M" ON responses_prise_m;
CREATE POLICY "Patients can update their own PRISE_M" ON responses_prise_m
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_prise_m.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_prise_m.completed_by IS NULL 
            OR responses_prise_m.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_prise_m.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- STAI-YA - State-Trait Anxiety Inventory
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own STAI_YA" ON responses_stai_ya;
CREATE POLICY "Patients can update their own STAI_YA" ON responses_stai_ya
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_stai_ya.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_stai_ya.completed_by IS NULL 
            OR responses_stai_ya.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_stai_ya.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- MARS - Medication Adherence Rating Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own MARS" ON responses_mars;
CREATE POLICY "Patients can update their own MARS" ON responses_mars
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_mars.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_mars.completed_by IS NULL 
            OR responses_mars.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_mars.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- MAThyS - Multidimensional Assessment of Thymic States
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own MATHYS" ON responses_mathys;
CREATE POLICY "Patients can update their own MATHYS" ON responses_mathys
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_mathys.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_mathys.completed_by IS NULL 
            OR responses_mathys.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_mathys.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- PSQI - Pittsburgh Sleep Quality Index
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own PSQI" ON responses_psqi;
CREATE POLICY "Patients can update their own PSQI" ON responses_psqi
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_psqi.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_psqi.completed_by IS NULL 
            OR responses_psqi.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_psqi.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- Epworth - Epworth Sleepiness Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own EPWORTH" ON responses_epworth;
CREATE POLICY "Patients can update their own EPWORTH" ON responses_epworth
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_epworth.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_epworth.completed_by IS NULL 
            OR responses_epworth.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_epworth.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- ASRS - Adult ADHD Self-Report Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own ASRS" ON responses_asrs;
CREATE POLICY "Patients can update their own ASRS" ON responses_asrs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_asrs.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_asrs.completed_by IS NULL 
            OR responses_asrs.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_asrs.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- CTQ - Childhood Trauma Questionnaire
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own CTQ" ON responses_ctq;
CREATE POLICY "Patients can update their own CTQ" ON responses_ctq
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_ctq.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_ctq.completed_by IS NULL 
            OR responses_ctq.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_ctq.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- BIS-10 - Barratt Impulsiveness Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own BIS10" ON responses_bis10;
CREATE POLICY "Patients can update their own BIS10" ON responses_bis10
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_bis10.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_bis10.completed_by IS NULL 
            OR responses_bis10.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_bis10.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- ALS-18 - Affective Lability Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own ALS18" ON responses_als18;
CREATE POLICY "Patients can update their own ALS18" ON responses_als18
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_als18.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_als18.completed_by IS NULL 
            OR responses_als18.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_als18.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- AIM - Affect Intensity Measure
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own AIM" ON responses_aim;
CREATE POLICY "Patients can update their own AIM" ON responses_aim
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_aim.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_aim.completed_by IS NULL 
            OR responses_aim.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_aim.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- WURS-25 - Wender Utah Rating Scale
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own WURS25" ON responses_wurs25;
CREATE POLICY "Patients can update their own WURS25" ON responses_wurs25
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_wurs25.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_wurs25.completed_by IS NULL 
            OR responses_wurs25.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_wurs25.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- AQ-12 - Aggression Questionnaire
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own AQ12" ON responses_aq12;
CREATE POLICY "Patients can update their own AQ12" ON responses_aq12
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_aq12.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_aq12.completed_by IS NULL 
            OR responses_aq12.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_aq12.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- CSM - Composite Scale of Morningness
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own CSM" ON responses_csm;
CREATE POLICY "Patients can update their own CSM" ON responses_csm
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_csm.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_csm.completed_by IS NULL 
            OR responses_csm.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_csm.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );

-- ============================================================================
-- CTI - Circadian Type Inventory
-- ============================================================================
DROP POLICY IF EXISTS "Patients can update their own CTI" ON responses_cti;
CREATE POLICY "Patients can update their own CTI" ON responses_cti
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM patients 
            WHERE patients.id = responses_cti.patient_id 
            AND patients.user_id = auth.uid()
        )
        AND (
            responses_cti.completed_by IS NULL 
            OR responses_cti.completed_by = auth.uid()
            OR NOT EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = responses_cti.completed_by 
                AND role IN ('healthcare_professional', 'administrator', 'manager')
            )
        )
    );


