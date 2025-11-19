-- Fix RLS policies for hetero questionnaires
-- The policies were incorrectly checking auth.users for role instead of user_profiles

-- ============================================================================
-- Drop existing incorrect policies
-- ============================================================================

-- MADRS policies
DROP POLICY IF EXISTS "Healthcare professionals can view MADRS responses" ON responses_madrs;
DROP POLICY IF EXISTS "Healthcare professionals can insert MADRS responses" ON responses_madrs;
DROP POLICY IF EXISTS "Healthcare professionals can update MADRS responses" ON responses_madrs;

-- YMRS policies
DROP POLICY IF EXISTS "Healthcare professionals can view YMRS responses" ON responses_ymrs;
DROP POLICY IF EXISTS "Healthcare professionals can insert YMRS responses" ON responses_ymrs;
DROP POLICY IF EXISTS "Healthcare professionals can update YMRS responses" ON responses_ymrs;

-- CGI policies
DROP POLICY IF EXISTS "Healthcare professionals can view CGI responses" ON responses_cgi;
DROP POLICY IF EXISTS "Healthcare professionals can insert CGI responses" ON responses_cgi;
DROP POLICY IF EXISTS "Healthcare professionals can update CGI responses" ON responses_cgi;

-- EGF policies
DROP POLICY IF EXISTS "Healthcare professionals can view EGF responses" ON responses_egf;
DROP POLICY IF EXISTS "Healthcare professionals can insert EGF responses" ON responses_egf;
DROP POLICY IF EXISTS "Healthcare professionals can update EGF responses" ON responses_egf;

-- ALDA policies
DROP POLICY IF EXISTS "Healthcare professionals can view ALDA responses" ON responses_alda;
DROP POLICY IF EXISTS "Healthcare professionals can insert ALDA responses" ON responses_alda;
DROP POLICY IF EXISTS "Healthcare professionals can update ALDA responses" ON responses_alda;

-- Etat patient policies
DROP POLICY IF EXISTS "Healthcare professionals can view Etat patient responses" ON responses_etat_patient;
DROP POLICY IF EXISTS "Healthcare professionals can insert Etat patient responses" ON responses_etat_patient;
DROP POLICY IF EXISTS "Healthcare professionals can update Etat patient responses" ON responses_etat_patient;

-- FAST policies
DROP POLICY IF EXISTS "Healthcare professionals can view FAST responses" ON responses_fast;
DROP POLICY IF EXISTS "Healthcare professionals can insert FAST responses" ON responses_fast;
DROP POLICY IF EXISTS "Healthcare professionals can update FAST responses" ON responses_fast;

-- ============================================================================
-- Create correct policies using user_profiles table
-- ============================================================================

-- MADRS policies
CREATE POLICY "Healthcare professionals can view MADRS responses"
    ON responses_madrs FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert MADRS responses"
    ON responses_madrs FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update MADRS responses"
    ON responses_madrs FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- YMRS policies
CREATE POLICY "Healthcare professionals can view YMRS responses"
    ON responses_ymrs FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert YMRS responses"
    ON responses_ymrs FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update YMRS responses"
    ON responses_ymrs FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- CGI policies
CREATE POLICY "Healthcare professionals can view CGI responses"
    ON responses_cgi FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert CGI responses"
    ON responses_cgi FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update CGI responses"
    ON responses_cgi FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- EGF policies
CREATE POLICY "Healthcare professionals can view EGF responses"
    ON responses_egf FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert EGF responses"
    ON responses_egf FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update EGF responses"
    ON responses_egf FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- ALDA policies
CREATE POLICY "Healthcare professionals can view ALDA responses"
    ON responses_alda FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert ALDA responses"
    ON responses_alda FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update ALDA responses"
    ON responses_alda FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Etat patient policies
CREATE POLICY "Healthcare professionals can view Etat patient responses"
    ON responses_etat_patient FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert Etat patient responses"
    ON responses_etat_patient FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update Etat patient responses"
    ON responses_etat_patient FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- FAST policies
CREATE POLICY "Healthcare professionals can view FAST responses"
    ON responses_fast FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert FAST responses"
    ON responses_fast FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update FAST responses"
    ON responses_fast FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );
