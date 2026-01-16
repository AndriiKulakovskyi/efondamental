-- ============================================================================
-- eFondaMental Platform - PANSS (Positive and Negative Syndrome Scale)
-- ============================================================================
-- This migration creates the response table for the PANSS questionnaire
-- used in schizophrenia initial evaluation visits (Hetero-questionnaires module).
--
-- PANSS is a 30-item clinician-rated scale for measuring symptom severity
-- of schizophrenia, organized into three subscales:
--   - Positive symptoms (P1-P7): 7 items, range 7-49
--   - Negative symptoms (N1-N7): 7 items, range 7-49
--   - General psychopathology (G1-G16): 16 items, range 16-112
--   - Total score: range 30-210
--
-- All items are rated on a 1-7 scale:
--   1 = Absent, 2 = Minimal, 3 = Mild, 4 = Moderate,
--   5 = Moderate-Severe, 6 = Severe, 7 = Extreme
--
-- Original authors: Kay SR, Fiszbein A, Opler LA (1986)
-- French translation: Lepine JP (1989)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PANSS Response Table
-- ----------------------------------------------------------------------------
CREATE TABLE responses_panss (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- Positive Subscale (P1-P7)
    -- ========================================================================
    
    -- P1. Delusions
    p1 INTEGER CHECK (p1 IS NULL OR (p1 >= 1 AND p1 <= 7)),
    
    -- P2. Conceptual disorganization
    p2 INTEGER CHECK (p2 IS NULL OR (p2 >= 1 AND p2 <= 7)),
    
    -- P3. Hallucinatory behavior
    p3 INTEGER CHECK (p3 IS NULL OR (p3 >= 1 AND p3 <= 7)),
    
    -- P4. Excitement
    p4 INTEGER CHECK (p4 IS NULL OR (p4 >= 1 AND p4 <= 7)),
    
    -- P5. Grandiosity
    p5 INTEGER CHECK (p5 IS NULL OR (p5 >= 1 AND p5 <= 7)),
    
    -- P6. Suspiciousness/persecution
    p6 INTEGER CHECK (p6 IS NULL OR (p6 >= 1 AND p6 <= 7)),
    
    -- P7. Hostility
    p7 INTEGER CHECK (p7 IS NULL OR (p7 >= 1 AND p7 <= 7)),
    
    -- ========================================================================
    -- Negative Subscale (N1-N7)
    -- ========================================================================
    
    -- N1. Blunted affect
    n1 INTEGER CHECK (n1 IS NULL OR (n1 >= 1 AND n1 <= 7)),
    
    -- N2. Emotional withdrawal
    n2 INTEGER CHECK (n2 IS NULL OR (n2 >= 1 AND n2 <= 7)),
    
    -- N3. Poor rapport
    n3 INTEGER CHECK (n3 IS NULL OR (n3 >= 1 AND n3 <= 7)),
    
    -- N4. Passive/apathetic social withdrawal
    n4 INTEGER CHECK (n4 IS NULL OR (n4 >= 1 AND n4 <= 7)),
    
    -- N5. Difficulty in abstract thinking
    n5 INTEGER CHECK (n5 IS NULL OR (n5 >= 1 AND n5 <= 7)),
    
    -- N6. Lack of spontaneity and flow of conversation
    n6 INTEGER CHECK (n6 IS NULL OR (n6 >= 1 AND n6 <= 7)),
    
    -- N7. Stereotyped thinking
    n7 INTEGER CHECK (n7 IS NULL OR (n7 >= 1 AND n7 <= 7)),
    
    -- ========================================================================
    -- General Psychopathology Subscale (G1-G16)
    -- ========================================================================
    
    -- G1. Somatic concern
    g1 INTEGER CHECK (g1 IS NULL OR (g1 >= 1 AND g1 <= 7)),
    
    -- G2. Anxiety
    g2 INTEGER CHECK (g2 IS NULL OR (g2 >= 1 AND g2 <= 7)),
    
    -- G3. Guilt feelings
    g3 INTEGER CHECK (g3 IS NULL OR (g3 >= 1 AND g3 <= 7)),
    
    -- G4. Tension
    g4 INTEGER CHECK (g4 IS NULL OR (g4 >= 1 AND g4 <= 7)),
    
    -- G5. Mannerisms and posturing
    g5 INTEGER CHECK (g5 IS NULL OR (g5 >= 1 AND g5 <= 7)),
    
    -- G6. Depression
    g6 INTEGER CHECK (g6 IS NULL OR (g6 >= 1 AND g6 <= 7)),
    
    -- G7. Motor retardation
    g7 INTEGER CHECK (g7 IS NULL OR (g7 >= 1 AND g7 <= 7)),
    
    -- G8. Uncooperativeness
    g8 INTEGER CHECK (g8 IS NULL OR (g8 >= 1 AND g8 <= 7)),
    
    -- G9. Unusual thought content
    g9 INTEGER CHECK (g9 IS NULL OR (g9 >= 1 AND g9 <= 7)),
    
    -- G10. Disorientation
    g10 INTEGER CHECK (g10 IS NULL OR (g10 >= 1 AND g10 <= 7)),
    
    -- G11. Poor attention
    g11 INTEGER CHECK (g11 IS NULL OR (g11 >= 1 AND g11 <= 7)),
    
    -- G12. Lack of judgment and insight
    g12 INTEGER CHECK (g12 IS NULL OR (g12 >= 1 AND g12 <= 7)),
    
    -- G13. Disturbance of volition
    g13 INTEGER CHECK (g13 IS NULL OR (g13 >= 1 AND g13 <= 7)),
    
    -- G14. Poor impulse control
    g14 INTEGER CHECK (g14 IS NULL OR (g14 >= 1 AND g14 <= 7)),
    
    -- G15. Preoccupation
    g15 INTEGER CHECK (g15 IS NULL OR (g15 >= 1 AND g15 <= 7)),
    
    -- G16. Active social avoidance
    g16 INTEGER CHECK (g16 IS NULL OR (g16 >= 1 AND g16 <= 7)),
    
    -- ========================================================================
    -- Traditional Subscale Scores (computed in application)
    -- ========================================================================
    
    -- Positive subscale score (P1-P7, range 7-49)
    positive_score INTEGER CHECK (positive_score IS NULL OR (positive_score >= 7 AND positive_score <= 49)),
    
    -- Negative subscale score (N1-N7, range 7-49)
    negative_score INTEGER CHECK (negative_score IS NULL OR (negative_score >= 7 AND negative_score <= 49)),
    
    -- General psychopathology score (G1-G16, range 16-112)
    general_score INTEGER CHECK (general_score IS NULL OR (general_score >= 16 AND general_score <= 112)),
    
    -- Total PANSS score (range 30-210)
    total_score INTEGER CHECK (total_score IS NULL OR (total_score >= 30 AND total_score <= 210)),
    
    -- ========================================================================
    -- Wallwork 2012 Five-Factor Model Scores
    -- Reference: Wallwork RS et al. (2012). Schizophr Res. 137(1-3):246-50
    -- ========================================================================
    
    -- Positive factor: P1 + P3 + P5 + G9 (range 4-28)
    wallwork_positive INTEGER CHECK (wallwork_positive IS NULL OR (wallwork_positive >= 4 AND wallwork_positive <= 28)),
    
    -- Negative factor: N1 + N2 + N3 + N4 + N6 + G7 (range 6-42)
    wallwork_negative INTEGER CHECK (wallwork_negative IS NULL OR (wallwork_negative >= 6 AND wallwork_negative <= 42)),
    
    -- Disorganized/cognitive factor: P2 + N5 + G11 (range 3-21)
    wallwork_disorganized INTEGER CHECK (wallwork_disorganized IS NULL OR (wallwork_disorganized >= 3 AND wallwork_disorganized <= 21)),
    
    -- Excited factor: P4 + P7 + G8 + G14 (range 4-28)
    wallwork_excited INTEGER CHECK (wallwork_excited IS NULL OR (wallwork_excited >= 4 AND wallwork_excited <= 28)),
    
    -- Depressed/emotional distress factor: G2 + G3 + G6 (range 3-21)
    wallwork_depressed INTEGER CHECK (wallwork_depressed IS NULL OR (wallwork_depressed >= 3 AND wallwork_depressed <= 21)),
    
    -- ========================================================================
    -- Lancon 1998 Five-Factor Model Scores
    -- Reference: Lancon C et al. (1998). Schizophr Res. 42(3):231-9
    -- ========================================================================
    
    -- Positive factor: P1 + P3 + G9 + P5 + P6 (range 5-35)
    lancon_positive INTEGER CHECK (lancon_positive IS NULL OR (lancon_positive >= 5 AND lancon_positive <= 35)),
    
    -- Negative factor: N1 + N2 + N3 + N4 + N6 + G7 + G16 (range 7-49)
    lancon_negative INTEGER CHECK (lancon_negative IS NULL OR (lancon_negative >= 7 AND lancon_negative <= 49)),
    
    -- Disorganized/cognitive factor: G10 + N5 + P2 (range 3-21)
    lancon_disorganized INTEGER CHECK (lancon_disorganized IS NULL OR (lancon_disorganized >= 3 AND lancon_disorganized <= 21)),
    
    -- Excited factor: G4 + P4 + G14 + P7 + G8 (range 5-35)
    lancon_excited INTEGER CHECK (lancon_excited IS NULL OR (lancon_excited >= 5 AND lancon_excited <= 35)),
    
    -- Depressed/emotional distress factor: G1 + G3 + G6 + G2 (range 4-28)
    lancon_depressed INTEGER CHECK (lancon_depressed IS NULL OR (lancon_depressed >= 4 AND lancon_depressed <= 28)),
    
    -- ========================================================================
    -- Van der Gaag 2006 Five-Factor Model Scores
    -- Reference: Van der Gaag M et al. (2006). Schizophr Res. 85(1-3):280-7
    -- ========================================================================
    
    -- Positive factor: P1 + P3 + G9 + P6 + P5 (range 5-35)
    vandergaag_positive INTEGER CHECK (vandergaag_positive IS NULL OR (vandergaag_positive >= 5 AND vandergaag_positive <= 35)),
    
    -- Negative factor: N6 + N1 + N2 + N4 + G7 + N3 + G16 + G8 (range 8-56)
    vandergaag_negative INTEGER CHECK (vandergaag_negative IS NULL OR (vandergaag_negative >= 8 AND vandergaag_negative <= 56)),
    
    -- Disorganized/cognitive factor: N7 + G11 + G10 + P2 + N5 + G5 + G12 + G13 (range 8-56)
    vandergaag_disorganized INTEGER CHECK (vandergaag_disorganized IS NULL OR (vandergaag_disorganized >= 8 AND vandergaag_disorganized <= 56)),
    
    -- Excited factor: G14 + P4 + P7 + G8 (range 4-28)
    vandergaag_excited INTEGER CHECK (vandergaag_excited IS NULL OR (vandergaag_excited >= 4 AND vandergaag_excited <= 28)),
    
    -- Depressed/emotional distress factor: G2 + G6 + G3 + G4 (range 4-28)
    vandergaag_depressed INTEGER CHECK (vandergaag_depressed IS NULL OR (vandergaag_depressed >= 4 AND vandergaag_depressed <= 28)),
    
    -- ========================================================================
    -- Metadata
    -- ========================================================================
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Row Level Security Policies
-- ----------------------------------------------------------------------------

ALTER TABLE responses_panss ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own PANSS" 
    ON responses_panss FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own PANSS" 
    ON responses_panss FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own PANSS" 
    ON responses_panss FOR UPDATE 
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all PANSS" 
    ON responses_panss FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert PANSS" 
    ON responses_panss FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update PANSS" 
    ON responses_panss FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ----------------------------------------------------------------------------
-- Indexes for performance
-- ----------------------------------------------------------------------------
CREATE INDEX idx_panss_visit ON responses_panss(visit_id);
CREATE INDEX idx_panss_patient ON responses_panss(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'PANSS questionnaire table created successfully';
END $$;
