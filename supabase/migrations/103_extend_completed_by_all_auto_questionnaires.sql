-- ============================================================================
-- eFondaMental Platform - Extend completed_by to All Auto-Questionnaires
-- ============================================================================
-- This migration adds the completed_by column to all auto-questionnaire tables
-- that are used in the dual-authoring model (patient + professional).
-- It also adds unique constraints on visit_id and professional RLS policies.
-- ============================================================================

-- ============================================================================
-- 1. ADD completed_by COLUMN TO REMAINING AUTO-QUESTIONNAIRE TABLES
-- ============================================================================

-- EQ-5D-5L
ALTER TABLE responses_eq5d5l 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- PRISE-M
ALTER TABLE responses_prise_m 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- STAI-YA
ALTER TABLE responses_stai_ya 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- MARS
ALTER TABLE responses_mars 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- MAThyS
ALTER TABLE responses_mathys 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- PSQI
ALTER TABLE responses_psqi 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- Epworth
ALTER TABLE responses_epworth 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- ASRS
ALTER TABLE responses_asrs 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- CTQ
ALTER TABLE responses_ctq 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- BIS-10
ALTER TABLE responses_bis10 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- ALS-18
ALTER TABLE responses_als18 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- AIM
ALTER TABLE responses_aim 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- WURS-25
ALTER TABLE responses_wurs25 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- AQ-12
ALTER TABLE responses_aq12 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- CSM
ALTER TABLE responses_csm 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- CTI
ALTER TABLE responses_cti 
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id);

-- ============================================================================
-- 2. ADD UNIQUE CONSTRAINTS ON visit_id FOR UPSERT SUPPORT
-- ============================================================================

-- EQ-5D-5L
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_eq5d5l_visit_id_key' 
        AND conrelid = 'responses_eq5d5l'::regclass
    ) THEN
        ALTER TABLE responses_eq5d5l ADD CONSTRAINT responses_eq5d5l_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- PRISE-M
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_prise_m_visit_id_key' 
        AND conrelid = 'responses_prise_m'::regclass
    ) THEN
        ALTER TABLE responses_prise_m ADD CONSTRAINT responses_prise_m_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- STAI-YA
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_stai_ya_visit_id_key' 
        AND conrelid = 'responses_stai_ya'::regclass
    ) THEN
        ALTER TABLE responses_stai_ya ADD CONSTRAINT responses_stai_ya_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- MARS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_mars_visit_id_key' 
        AND conrelid = 'responses_mars'::regclass
    ) THEN
        ALTER TABLE responses_mars ADD CONSTRAINT responses_mars_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- MAThyS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_mathys_visit_id_key' 
        AND conrelid = 'responses_mathys'::regclass
    ) THEN
        ALTER TABLE responses_mathys ADD CONSTRAINT responses_mathys_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- PSQI
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_psqi_visit_id_key' 
        AND conrelid = 'responses_psqi'::regclass
    ) THEN
        ALTER TABLE responses_psqi ADD CONSTRAINT responses_psqi_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- Epworth
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_epworth_visit_id_key' 
        AND conrelid = 'responses_epworth'::regclass
    ) THEN
        ALTER TABLE responses_epworth ADD CONSTRAINT responses_epworth_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- ASRS
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_asrs_visit_id_key' 
        AND conrelid = 'responses_asrs'::regclass
    ) THEN
        ALTER TABLE responses_asrs ADD CONSTRAINT responses_asrs_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- CTQ
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_ctq_visit_id_key' 
        AND conrelid = 'responses_ctq'::regclass
    ) THEN
        ALTER TABLE responses_ctq ADD CONSTRAINT responses_ctq_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- BIS-10
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_bis10_visit_id_key' 
        AND conrelid = 'responses_bis10'::regclass
    ) THEN
        ALTER TABLE responses_bis10 ADD CONSTRAINT responses_bis10_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- ALS-18
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_als18_visit_id_key' 
        AND conrelid = 'responses_als18'::regclass
    ) THEN
        ALTER TABLE responses_als18 ADD CONSTRAINT responses_als18_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- AIM
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_aim_visit_id_key' 
        AND conrelid = 'responses_aim'::regclass
    ) THEN
        ALTER TABLE responses_aim ADD CONSTRAINT responses_aim_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- WURS-25
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_wurs25_visit_id_key' 
        AND conrelid = 'responses_wurs25'::regclass
    ) THEN
        ALTER TABLE responses_wurs25 ADD CONSTRAINT responses_wurs25_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- AQ-12
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_aq12_visit_id_key' 
        AND conrelid = 'responses_aq12'::regclass
    ) THEN
        ALTER TABLE responses_aq12 ADD CONSTRAINT responses_aq12_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- CSM
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_csm_visit_id_key' 
        AND conrelid = 'responses_csm'::regclass
    ) THEN
        ALTER TABLE responses_csm ADD CONSTRAINT responses_csm_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- CTI
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'responses_cti_visit_id_key' 
        AND conrelid = 'responses_cti'::regclass
    ) THEN
        ALTER TABLE responses_cti ADD CONSTRAINT responses_cti_visit_id_key UNIQUE (visit_id);
    END IF;
END $$;

-- ============================================================================
-- 3. CREATE INDEXES ON completed_by FOR FASTER LOOKUPS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_responses_eq5d5l_completed_by ON responses_eq5d5l(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_prise_m_completed_by ON responses_prise_m(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_stai_ya_completed_by ON responses_stai_ya(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_mars_completed_by ON responses_mars(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_mathys_completed_by ON responses_mathys(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_psqi_completed_by ON responses_psqi(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_epworth_completed_by ON responses_epworth(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_asrs_completed_by ON responses_asrs(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_ctq_completed_by ON responses_ctq(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_bis10_completed_by ON responses_bis10(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_als18_completed_by ON responses_als18(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_aim_completed_by ON responses_aim(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_wurs25_completed_by ON responses_wurs25(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_aq12_completed_by ON responses_aq12(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_csm_completed_by ON responses_csm(completed_by);
CREATE INDEX IF NOT EXISTS idx_responses_cti_completed_by ON responses_cti(completed_by);

-- ============================================================================
-- 4. PROFESSIONAL INSERT/UPDATE RLS POLICIES
-- ============================================================================
-- Professionals (healthcare_professional, manager, administrator) can insert
-- and update any auto-questionnaire response, enabling them to override
-- patient responses as per the Doctor-First Authority Model.
-- ============================================================================

-- EQ-5D-5L Professional Policies
DROP POLICY IF EXISTS "Professionals can insert EQ5D5L" ON responses_eq5d5l;
CREATE POLICY "Professionals can insert EQ5D5L" ON responses_eq5d5l
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update EQ5D5L" ON responses_eq5d5l;
CREATE POLICY "Professionals can update EQ5D5L" ON responses_eq5d5l
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- PRISE-M Professional Policies
DROP POLICY IF EXISTS "Professionals can insert PRISE_M" ON responses_prise_m;
CREATE POLICY "Professionals can insert PRISE_M" ON responses_prise_m
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update PRISE_M" ON responses_prise_m;
CREATE POLICY "Professionals can update PRISE_M" ON responses_prise_m
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- STAI-YA Professional Policies
DROP POLICY IF EXISTS "Professionals can insert STAI_YA" ON responses_stai_ya;
CREATE POLICY "Professionals can insert STAI_YA" ON responses_stai_ya
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update STAI_YA" ON responses_stai_ya;
CREATE POLICY "Professionals can update STAI_YA" ON responses_stai_ya
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MARS Professional Policies
DROP POLICY IF EXISTS "Professionals can insert MARS" ON responses_mars;
CREATE POLICY "Professionals can insert MARS" ON responses_mars
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update MARS" ON responses_mars;
CREATE POLICY "Professionals can update MARS" ON responses_mars
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MAThyS Professional Policies
DROP POLICY IF EXISTS "Professionals can insert MATHYS" ON responses_mathys;
CREATE POLICY "Professionals can insert MATHYS" ON responses_mathys
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update MATHYS" ON responses_mathys;
CREATE POLICY "Professionals can update MATHYS" ON responses_mathys
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- PSQI Professional Policies
DROP POLICY IF EXISTS "Professionals can insert PSQI" ON responses_psqi;
CREATE POLICY "Professionals can insert PSQI" ON responses_psqi
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update PSQI" ON responses_psqi;
CREATE POLICY "Professionals can update PSQI" ON responses_psqi
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Epworth Professional Policies
DROP POLICY IF EXISTS "Professionals can insert EPWORTH" ON responses_epworth;
CREATE POLICY "Professionals can insert EPWORTH" ON responses_epworth
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update EPWORTH" ON responses_epworth;
CREATE POLICY "Professionals can update EPWORTH" ON responses_epworth
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- ASRS Professional Policies
DROP POLICY IF EXISTS "Professionals can insert ASRS" ON responses_asrs;
CREATE POLICY "Professionals can insert ASRS" ON responses_asrs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update ASRS" ON responses_asrs;
CREATE POLICY "Professionals can update ASRS" ON responses_asrs
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- CTQ Professional Policies
DROP POLICY IF EXISTS "Professionals can insert CTQ" ON responses_ctq;
CREATE POLICY "Professionals can insert CTQ" ON responses_ctq
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update CTQ" ON responses_ctq;
CREATE POLICY "Professionals can update CTQ" ON responses_ctq
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- BIS-10 Professional Policies
DROP POLICY IF EXISTS "Professionals can insert BIS10" ON responses_bis10;
CREATE POLICY "Professionals can insert BIS10" ON responses_bis10
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update BIS10" ON responses_bis10;
CREATE POLICY "Professionals can update BIS10" ON responses_bis10
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- ALS-18 Professional Policies
DROP POLICY IF EXISTS "Professionals can insert ALS18" ON responses_als18;
CREATE POLICY "Professionals can insert ALS18" ON responses_als18
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update ALS18" ON responses_als18;
CREATE POLICY "Professionals can update ALS18" ON responses_als18
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- AIM Professional Policies
DROP POLICY IF EXISTS "Professionals can insert AIM" ON responses_aim;
CREATE POLICY "Professionals can insert AIM" ON responses_aim
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update AIM" ON responses_aim;
CREATE POLICY "Professionals can update AIM" ON responses_aim
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- WURS-25 Professional Policies
DROP POLICY IF EXISTS "Professionals can insert WURS25" ON responses_wurs25;
CREATE POLICY "Professionals can insert WURS25" ON responses_wurs25
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update WURS25" ON responses_wurs25;
CREATE POLICY "Professionals can update WURS25" ON responses_wurs25
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- AQ-12 Professional Policies
DROP POLICY IF EXISTS "Professionals can insert AQ12" ON responses_aq12;
CREATE POLICY "Professionals can insert AQ12" ON responses_aq12
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update AQ12" ON responses_aq12;
CREATE POLICY "Professionals can update AQ12" ON responses_aq12
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- CSM Professional Policies
DROP POLICY IF EXISTS "Professionals can insert CSM" ON responses_csm;
CREATE POLICY "Professionals can insert CSM" ON responses_csm
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update CSM" ON responses_csm;
CREATE POLICY "Professionals can update CSM" ON responses_csm
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- CTI Professional Policies
DROP POLICY IF EXISTS "Professionals can insert CTI" ON responses_cti;
CREATE POLICY "Professionals can insert CTI" ON responses_cti
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

DROP POLICY IF EXISTS "Professionals can update CTI" ON responses_cti;
CREATE POLICY "Professionals can update CTI" ON responses_cti
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );


