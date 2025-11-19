-- ============================================================================
-- eFondaMental Platform - Refactor Questionnaire System
-- ============================================================================
-- This migration drops the generic questionnaire system tables and replaces them
-- with specific tables for each questionnaire to ensure type safety and better
-- data integrity.
-- ============================================================================

-- 1. Drop existing generic tables and their dependencies
-- We use CASCADE to remove dependent views, foreign keys, etc.
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS questionnaires CASCADE;
DROP TABLE IF EXISTS modules CASCADE;

-- 2. Create specific tables for Auto-questionnaires

-- ----------------------------------------------------------------------------
-- ASRM (Altman Self-Rating Mania Scale)
-- ----------------------------------------------------------------------------
CREATE TABLE responses_asrm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Questions (0-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 4), -- Humeur
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 4), -- Confiance en soi
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 4), -- Sommeil
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 4), -- Discours
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 4), -- Activité
    
    -- Score
    total_score INTEGER GENERATED ALWAYS AS (q1 + q2 + q3 + q4 + q5) STORED,
    interpretation TEXT, -- 'Manie' if >= 6
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- QIDS-SR16 (Quick Inventory of Depressive Symptomatology)
-- ----------------------------------------------------------------------------
CREATE TABLE responses_qids_sr16 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Questions (0-3 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3), -- Endormissement
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 3), -- Sommeil nuit
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 3), -- Réveil précoce
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 3), -- Trop de sommeil
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 3), -- Tristesse
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 3), -- Baisse appétit
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 0 AND 3), -- Hausse appétit
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 0 AND 3), -- Perte poids
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 0 AND 3), -- Prise poids
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 0 AND 3), -- Concentration
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 0 AND 3), -- Opinion de soi
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 0 AND 3), -- Idées mort/suicide
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 0 AND 3), -- Intérêt général
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 0 AND 3), -- Énergie
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 0 AND 3), -- Ralentissement
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 0 AND 3), -- Agitation
    
    -- Computed Domain Scores (stored for easier querying, calculated by app or trigger, 
    -- but simpler to just store them as nullable or calculated columns if logic is simple. 
    -- QIDS scoring is complex (max of subsets), so we'll store the final score calculated by the app)
    total_score INTEGER,
    interpretation TEXT,
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- MDQ (Mood Disorder Questionnaire)
-- ----------------------------------------------------------------------------
CREATE TABLE responses_mdq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Section 1 (Yes/No -> Boolean)
    q1_1 BOOLEAN NOT NULL, -- Sensation "trop bien"
    q1_2 BOOLEAN NOT NULL, -- Irritable
    q1_3 BOOLEAN NOT NULL, -- Confiance excessive
    q1_4 BOOLEAN NOT NULL, -- Moins de sommeil
    q1_5 BOOLEAN NOT NULL, -- Plus bavard
    q1_6 BOOLEAN NOT NULL, -- Pensées défilent
    q1_7 BOOLEAN NOT NULL, -- Distrait
    q1_8 BOOLEAN NOT NULL, -- Plus d'énergie
    q1_9 BOOLEAN NOT NULL, -- Plus actif
    q1_10 BOOLEAN NOT NULL, -- Plus sociable
    q1_11 BOOLEAN NOT NULL, -- Intérêt sexe
    q1_12 BOOLEAN NOT NULL, -- Comportement risqué
    q1_13 BOOLEAN NOT NULL, -- Dépenses excessives
    
    -- Section 2 & 3 (Conditional)
    q2 BOOLEAN, -- Apparition simultanée (Oui/Non)
    q3 INTEGER CHECK (q3 BETWEEN 0 AND 3), -- Impact (0=Aucun, 1=Mineur, 2=Moyen, 3=Sérieux)
    
    -- Score
    positive_screen BOOLEAN, -- Result of the algorithm
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create specific tables for Medical Questionnaires

-- ----------------------------------------------------------------------------
-- Diagnostic (Bipolar Screening Diagnostic)
-- ----------------------------------------------------------------------------
CREATE TABLE responses_bipolar_diagnostic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    diagnostic_principal TEXT NOT NULL CHECK (diagnostic_principal IN (
        'bipolar_1', 'bipolar_2', 'cyclothymia', 'other_bipolar', 'no_bipolar'
    )),
    
    episode_actuel TEXT CHECK (episode_actuel IN (
        'manic', 'hypomanic', 'depressive', 'mixed', 'euthymic'
    )),
    
    -- Stored as array of strings for multiple choice
    comorbidites TEXT[], 
    
    antecedents_psychiatriques TEXT,
    notes_cliniques TEXT,
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Orientation (Expert Center Referral)
-- ----------------------------------------------------------------------------
CREATE TABLE responses_orientation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    eligible_centre_expert BOOLEAN NOT NULL,
    criteres_eligibilite TEXT[], -- Array of fulfilled criteria
    
    urgence_orientation TEXT CHECK (urgence_orientation IN (
        'immediate', 'rapid', 'standard'
    )),
    
    centre_expert_propose TEXT,
    commentaires TEXT,
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)

ALTER TABLE responses_asrm ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_qids_sr16 ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_mdq ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_bipolar_diagnostic ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_orientation ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Helper function for policies
-- (We assume existing policies logic: patients can see their own, pros can see assigned/all)

-- ASRM Policies
CREATE POLICY "Patients can view their own ASRM" ON responses_asrm
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own ASRM" ON responses_asrm
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own ASRM" ON responses_asrm
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view all ASRM" ON responses_asrm
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- QIDS Policies
CREATE POLICY "Patients can view their own QIDS" ON responses_qids_sr16
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own QIDS" ON responses_qids_sr16
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own QIDS" ON responses_qids_sr16
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view all QIDS" ON responses_qids_sr16
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- MDQ Policies
CREATE POLICY "Patients can view their own MDQ" ON responses_mdq
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert their own MDQ" ON responses_mdq
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own MDQ" ON responses_mdq
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals can view all MDQ" ON responses_mdq
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Diagnostic Policies (Professional Only Write, Patient Read?)
-- Usually patients can read their medical info, but maybe read-only.
CREATE POLICY "Professionals can view all Diagnostic" ON responses_bipolar_diagnostic
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can insert Diagnostic" ON responses_bipolar_diagnostic
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can update Diagnostic" ON responses_bipolar_diagnostic
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );
    
CREATE POLICY "Patients can view their own Diagnostic" ON responses_bipolar_diagnostic
    FOR SELECT USING (auth.uid() = patient_id);

-- Orientation Policies
CREATE POLICY "Professionals can view all Orientation" ON responses_orientation
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can insert Orientation" ON responses_orientation
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Professionals can update Orientation" ON responses_orientation
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );
    
CREATE POLICY "Patients can view their own Orientation" ON responses_orientation
    FOR SELECT USING (auth.uid() = patient_id);

-- 6. Add updated_at triggers
CREATE TRIGGER update_responses_asrm_modtime BEFORE UPDATE ON responses_asrm FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responses_qids_sr16_modtime BEFORE UPDATE ON responses_qids_sr16 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responses_mdq_modtime BEFORE UPDATE ON responses_mdq FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responses_bipolar_diagnostic_modtime BEFORE UPDATE ON responses_bipolar_diagnostic FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_responses_orientation_modtime BEFORE UPDATE ON responses_orientation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
