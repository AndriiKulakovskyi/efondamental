-- eFondaMental Platform - Hetero Questionnaires Migration
-- Adds tables for 7 clinician-rated questionnaires for initial evaluation

-- ============================================================================
-- MADRS (Montgomery-Åsberg Depression Rating Scale)
-- ============================================================================
CREATE TABLE responses_madrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 10 items (0-6 scale)
    q1 INTEGER CHECK (q1 BETWEEN 0 AND 6), -- Tristesse apparente
    q2 INTEGER CHECK (q2 BETWEEN 0 AND 6), -- Tristesse exprimée
    q3 INTEGER CHECK (q3 BETWEEN 0 AND 6), -- Tension intérieure
    q4 INTEGER CHECK (q4 BETWEEN 0 AND 6), -- Réduction du sommeil
    q5 INTEGER CHECK (q5 BETWEEN 0 AND 6), -- Réduction de l'appétit
    q6 INTEGER CHECK (q6 BETWEEN 0 AND 6), -- Difficultés de concentration
    q7 INTEGER CHECK (q7 BETWEEN 0 AND 6), -- Lassitude
    q8 INTEGER CHECK (q8 BETWEEN 0 AND 6), -- Incapacité à ressentir
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 6), -- Pensées pessimistes
    q10 INTEGER CHECK (q10 BETWEEN 0 AND 6), -- Idées de suicide
    
    -- Scores
    total_score INTEGER,
    interpretation VARCHAR(50),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- YMRS (Young Mania Rating Scale)
-- ============================================================================
CREATE TABLE responses_ymrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 11 items with heterogeneous scoring
    q1 INTEGER CHECK (q1 BETWEEN 0 AND 4), -- Élévation de l'humeur
    q2 INTEGER CHECK (q2 BETWEEN 0 AND 4), -- Augmentation de l'activité motrice
    q3 INTEGER CHECK (q3 BETWEEN 0 AND 4), -- Intérêt sexuel
    q4 INTEGER CHECK (q4 BETWEEN 0 AND 4), -- Sommeil
    q5 INTEGER CHECK (q5 BETWEEN 0 AND 8), -- Irritabilité (double weighted)
    q6 INTEGER CHECK (q6 BETWEEN 0 AND 8), -- Débit verbal (double weighted)
    q7 INTEGER CHECK (q7 BETWEEN 0 AND 4), -- Troubles du cours de la pensée
    q8 INTEGER CHECK (q8 BETWEEN 0 AND 8), -- Contenu de la pensée (double weighted)
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 8), -- Comportement agressif (double weighted)
    q10 INTEGER CHECK (q10 BETWEEN 0 AND 4), -- Apparence
    q11 INTEGER CHECK (q11 BETWEEN 0 AND 4), -- Insight
    
    -- Scores
    total_score INTEGER,
    interpretation VARCHAR(50),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CGI (Clinical Global Impressions)
-- ============================================================================
CREATE TABLE responses_cgi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Visit type to handle baseline vs follow-up logic
    visit_type VARCHAR(20) CHECK (visit_type IN ('baseline', 'followup')),
    
    -- CGI-S: Severity (0-7, 0=not assessed)
    cgi_s INTEGER CHECK (cgi_s BETWEEN 0 AND 7),
    
    -- CGI-I: Improvement (0-7, 0=not assessed, only for follow-up)
    cgi_i INTEGER CHECK (cgi_i BETWEEN 0 AND 7),
    
    -- Therapeutic Index components (only for follow-up)
    therapeutic_effect INTEGER CHECK (therapeutic_effect BETWEEN 0 AND 4), -- 0=not assessed
    side_effects INTEGER CHECK (side_effects BETWEEN 0 AND 4), -- 0=not assessed
    
    -- Calculated therapeutic index
    therapeutic_index INTEGER,
    therapeutic_index_label VARCHAR(100),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EGF (Échelle de Fonctionnement Global)
-- ============================================================================
CREATE TABLE responses_egf (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Single score with 3 time periods
    current_functioning INTEGER CHECK (current_functioning BETWEEN 1 AND 100),
    worst_past_year INTEGER CHECK (worst_past_year BETWEEN 1 AND 100),
    best_past_year INTEGER CHECK (best_past_year BETWEEN 1 AND 100),
    
    -- Interpretations
    current_interpretation VARCHAR(100),
    worst_interpretation VARCHAR(100),
    best_interpretation VARCHAR(100),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ALDA (Lithium Response Scale)
-- ============================================================================
CREATE TABLE responses_alda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Part A: Response score (0-10)
    a_score INTEGER CHECK (a_score BETWEEN 0 AND 10),
    
    -- Part B: 5 criteria (0-2 each)
    b1 INTEGER CHECK (b1 BETWEEN 0 AND 2), -- Nombre d'épisodes avant traitement
    b2 INTEGER CHECK (b2 BETWEEN 0 AND 2), -- Fréquence des épisodes avant traitement
    b3 INTEGER CHECK (b3 BETWEEN 0 AND 2), -- Durée du traitement
    b4 INTEGER CHECK (b4 BETWEEN 0 AND 2), -- Observance
    b5 INTEGER CHECK (b5 BETWEEN 0 AND 2), -- Utilisation de traitements additionnels
    
    -- Scores
    b_total_score INTEGER,
    alda_score INTEGER, -- A - B
    interpretation VARCHAR(100),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Etat du patient (Patient State)
-- ============================================================================
CREATE TABLE responses_etat_patient (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 4 domains with severity and duration
    euthymia_severity INTEGER CHECK (euthymia_severity BETWEEN 0 AND 3),
    euthymia_duration INTEGER,
    
    mania_severity INTEGER CHECK (mania_severity BETWEEN 0 AND 3),
    mania_duration INTEGER,
    
    depression_severity INTEGER CHECK (depression_severity BETWEEN 0 AND 3),
    depression_duration INTEGER,
    
    mixed_severity INTEGER CHECK (mixed_severity BETWEEN 0 AND 3),
    mixed_duration INTEGER,
    
    -- Current state determination
    current_state VARCHAR(50),
    state_details TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FAST (Functioning Assessment Short Test)
-- ============================================================================
CREATE TABLE responses_fast (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 24 items (0-3 scale)
    q1 INTEGER CHECK (q1 BETWEEN 0 AND 3),
    q2 INTEGER CHECK (q2 BETWEEN 0 AND 3),
    q3 INTEGER CHECK (q3 BETWEEN 0 AND 3),
    q4 INTEGER CHECK (q4 BETWEEN 0 AND 3),
    q5 INTEGER CHECK (q5 BETWEEN 0 AND 3),
    q6 INTEGER CHECK (q6 BETWEEN 0 AND 3),
    q7 INTEGER CHECK (q7 BETWEEN 0 AND 3),
    q8 INTEGER CHECK (q8 BETWEEN 0 AND 3),
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 3),
    q10 INTEGER CHECK (q10 BETWEEN 0 AND 3),
    q11 INTEGER CHECK (q11 BETWEEN 0 AND 3),
    q12 INTEGER CHECK (q12 BETWEEN 0 AND 3),
    q13 INTEGER CHECK (q13 BETWEEN 0 AND 3),
    q14 INTEGER CHECK (q14 BETWEEN 0 AND 3),
    q15 INTEGER CHECK (q15 BETWEEN 0 AND 3),
    q16 INTEGER CHECK (q16 BETWEEN 0 AND 3),
    q17 INTEGER CHECK (q17 BETWEEN 0 AND 3),
    q18 INTEGER CHECK (q18 BETWEEN 0 AND 3),
    q19 INTEGER CHECK (q19 BETWEEN 0 AND 3),
    q20 INTEGER CHECK (q20 BETWEEN 0 AND 3),
    q21 INTEGER CHECK (q21 BETWEEN 0 AND 3),
    q22 INTEGER CHECK (q22 BETWEEN 0 AND 3),
    q23 INTEGER CHECK (q23 BETWEEN 0 AND 3),
    q24 INTEGER CHECK (q24 BETWEEN 0 AND 3),
    
    -- Domain scores
    autonomy_score INTEGER, -- q1-q4
    occupational_score INTEGER, -- q5-q9
    cognitive_score INTEGER, -- q10-q14
    financial_score INTEGER, -- q15-q16
    interpersonal_score INTEGER, -- q17-q22
    leisure_score INTEGER, -- q23-q24
    
    -- Total score and interpretation
    total_score INTEGER,
    interpretation VARCHAR(100),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- MADRS policies
ALTER TABLE responses_madrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view MADRS responses"
    ON responses_madrs FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert MADRS responses"
    ON responses_madrs FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update MADRS responses"
    ON responses_madrs FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- YMRS policies
ALTER TABLE responses_ymrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view YMRS responses"
    ON responses_ymrs FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert YMRS responses"
    ON responses_ymrs FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update YMRS responses"
    ON responses_ymrs FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- CGI policies
ALTER TABLE responses_cgi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view CGI responses"
    ON responses_cgi FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert CGI responses"
    ON responses_cgi FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update CGI responses"
    ON responses_cgi FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- EGF policies
ALTER TABLE responses_egf ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view EGF responses"
    ON responses_egf FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert EGF responses"
    ON responses_egf FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update EGF responses"
    ON responses_egf FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- ALDA policies
ALTER TABLE responses_alda ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view ALDA responses"
    ON responses_alda FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert ALDA responses"
    ON responses_alda FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update ALDA responses"
    ON responses_alda FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- Etat patient policies
ALTER TABLE responses_etat_patient ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view Etat patient responses"
    ON responses_etat_patient FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert Etat patient responses"
    ON responses_etat_patient FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update Etat patient responses"
    ON responses_etat_patient FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- FAST policies
ALTER TABLE responses_fast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare professionals can view FAST responses"
    ON responses_fast FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator', 'manager')
    ));

CREATE POLICY "Healthcare professionals can insert FAST responses"
    ON responses_fast FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

CREATE POLICY "Healthcare professionals can update FAST responses"
    ON responses_fast FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE role IN ('healthcare_professional', 'administrator')
    ));

-- ============================================================================
-- Update triggers
-- ============================================================================

CREATE TRIGGER update_responses_madrs_updated_at BEFORE UPDATE ON responses_madrs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_ymrs_updated_at BEFORE UPDATE ON responses_ymrs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_cgi_updated_at BEFORE UPDATE ON responses_cgi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_egf_updated_at BEFORE UPDATE ON responses_egf
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_alda_updated_at BEFORE UPDATE ON responses_alda
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_etat_patient_updated_at BEFORE UPDATE ON responses_etat_patient
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_fast_updated_at BEFORE UPDATE ON responses_fast
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
