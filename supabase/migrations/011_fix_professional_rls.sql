-- ============================================================================
-- Fix RLS Policies for Professionals
-- ============================================================================
-- The previous policies for professionals only allowed SELECT but missed INSERT/UPDATE policies
-- for the auto-questionnaires (ASRM, QIDS, MDQ) which professionals might fill on behalf of patients
-- or need to update in some workflows. More importantly, the error "42501" on POST indicates
-- missing INSERT permissions or policy violation.
--
-- We need to explicitly allow professionals to INSERT/UPDATE these tables if that is the intended workflow.
-- Based on the error log, a professional is trying to submit (POST) an ASRM questionnaire.
-- ============================================================================

-- ASRM
CREATE POLICY "Professionals can insert ASRM" ON responses_asrm
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can update ASRM" ON responses_asrm
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- QIDS
CREATE POLICY "Professionals can insert QIDS" ON responses_qids_sr16
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can update QIDS" ON responses_qids_sr16
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MDQ
CREATE POLICY "Professionals can insert MDQ" ON responses_mdq
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can update MDQ" ON responses_mdq
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

