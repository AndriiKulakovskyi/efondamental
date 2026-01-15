-- ============================================================================
-- eFondaMental Platform - Evaluation Addictologique Questionnaire (Schizophrenia)
-- ============================================================================
-- This migration creates the response table for the Addictological Evaluation
-- questionnaire used in schizophrenia initial evaluation visits (Addictologie section).
--
-- The questionnaire includes:
--   - Main screening questions (Q1-Q4, Q20-Q21) for alcohol, tobacco, cannabis, 
--     other drugs, and gambling
--   - Conditional Alcohol section (appears when Q1 = 'Oui') with:
--     - Consumption patterns (lifetime and 12 months)
--     - DSM5 criteria for alcohol use disorder (12 criteria, lifetime and 12 months)
--     - History, family history, craving, treatment, and hospitalization data
--   - DSM5 severity scoring (computed from positive criteria count)
--
-- Branching logic:
--   - rad_add_alc1 = 'Non' shows only rad_add_alc1a (abstinent primaire)
--   - rad_add_alc1 = 'Oui' shows full Alcohol section
--   - rad_add_alc5b/6b = '1_to_7' shows rad_add_alc5c/6c
--   - rad_add_alc13 = 'Oui' shows add_alc13b
--   - rad_add_alc14a = 'Oui' shows add_alc14b, add_alc14c
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Evaluation Addictologique Response Table
-- ----------------------------------------------------------------------------
CREATE TABLE responses_eval_addictologique_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- SCREENING SECTION (Main Questions)
    -- ========================================================================
    
    -- Q1: Alcohol consumption > 10 times lifetime
    rad_add_alc1 VARCHAR(10) CHECK (rad_add_alc1 IS NULL OR rad_add_alc1 IN ('Oui', 'Non')),
    
    -- Q1.2: Primary abstinent (shows if Q1 = 'Non')
    rad_add_alc1a VARCHAR(10) CHECK (rad_add_alc1a IS NULL OR rad_add_alc1a IN ('Oui', 'Non')),
    
    -- Q2: Tobacco status
    rad_add_tab VARCHAR(50) CHECK (rad_add_tab IS NULL OR rad_add_tab IN (
        'Non fumeur', 'Fumeur actuel', 'Ex-fumeur', 'Statut inconnu'
    )),
    
    -- Q3: Cannabis consumption > 10 times lifetime
    rad_add_cannabis VARCHAR(10) CHECK (rad_add_cannabis IS NULL OR rad_add_cannabis IN ('Oui', 'Non')),
    
    -- Q4: Other illicit drugs consumption > 10 times lifetime
    rad_add_drogues VARCHAR(10) CHECK (rad_add_drogues IS NULL OR rad_add_drogues IN ('Oui', 'Non')),
    
    -- Q20: Gambling - lying about behavior
    rad_add_jeux1 VARCHAR(10) CHECK (rad_add_jeux1 IS NULL OR rad_add_jeux1 IN ('Oui', 'Non')),
    
    -- Q21: Gambling - need to bet more money
    rad_add_jeux2 VARCHAR(10) CHECK (rad_add_jeux2 IS NULL OR rad_add_jeux2 IN ('Oui', 'Non')),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Lifetime Consumption (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 5a. Quantity (glasses/day) during maximum lifetime consumption periods
    add_alc5a VARCHAR(100),
    
    -- 5b. Frequency during maximum lifetime consumption periods
    rad_add_alc5b VARCHAR(50) CHECK (rad_add_alc5b IS NULL OR rad_add_alc5b IN (
        '1_to_7', 'less_than_once'
    )),
    
    -- 5c. Specify times per week (shows if 5b = '1_to_7')
    rad_add_alc5c INTEGER CHECK (rad_add_alc5c IS NULL OR (rad_add_alc5c >= 1 AND rad_add_alc5c <= 7)),
    
    -- ========================================================================
    -- ALCOHOL SECTION - 12 Month Consumption (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 6a. Quantity (glasses/day) during last 12 months
    add_alc6a VARCHAR(100),
    
    -- 6b. Frequency during last 12 months
    rad_add_alc6b VARCHAR(50) CHECK (rad_add_alc6b IS NULL OR rad_add_alc6b IN (
        '1_to_7', 'less_than_once'
    )),
    
    -- 6c. Specify times per week (shows if 6b = '1_to_7')
    rad_add_alc6c INTEGER CHECK (rad_add_alc6c IS NULL OR (rad_add_alc6c >= 1 AND rad_add_alc6c <= 7)),
    
    -- ========================================================================
    -- ALCOHOL SECTION - DSM5 Screening (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 8a. Has patient shown any alcohol use disorder symptom lifetime?
    rad_add_alc8a VARCHAR(10) CHECK (rad_add_alc8a IS NULL OR rad_add_alc8a IN ('Oui', 'Non')),
    
    -- ========================================================================
    -- ALCOHOL SECTION - DSM5 Criteria Lifetime (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- a. Taken in larger amounts than intended (lifetime)
    rad_add_alc8a1 VARCHAR(20) CHECK (rad_add_alc8a1 IS NULL OR rad_add_alc8a1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- a. Taken in larger amounts than intended (12 months)
    rad_add_alc8a2 VARCHAR(20) CHECK (rad_add_alc8a2 IS NULL OR rad_add_alc8a2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- b. Tried to cut down or stop (lifetime)
    rad_add_alc8b1 VARCHAR(20) CHECK (rad_add_alc8b1 IS NULL OR rad_add_alc8b1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- b. Tried to cut down or stop (12 months)
    rad_add_alc8b2 VARCHAR(20) CHECK (rad_add_alc8b2 IS NULL OR rad_add_alc8b2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- c. Time spent obtaining, using, recovering (lifetime)
    rad_add_alc8c1 VARCHAR(20) CHECK (rad_add_alc8c1 IS NULL OR rad_add_alc8c1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- c. Time spent obtaining, using, recovering (12 months)
    rad_add_alc8c2 VARCHAR(20) CHECK (rad_add_alc8c2 IS NULL OR rad_add_alc8c2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- d. Cravings or urges to use (lifetime)
    rad_add_alc8d1 VARCHAR(20) CHECK (rad_add_alc8d1 IS NULL OR rad_add_alc8d1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- d. Cravings or urges to use (12 months)
    rad_add_alc8d2 VARCHAR(20) CHECK (rad_add_alc8d2 IS NULL OR rad_add_alc8d2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- e. Failure to fulfill major role obligations (lifetime)
    rad_add_alc8e1 VARCHAR(20) CHECK (rad_add_alc8e1 IS NULL OR rad_add_alc8e1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- e. Failure to fulfill major role obligations (12 months)
    rad_add_alc8e2 VARCHAR(20) CHECK (rad_add_alc8e2 IS NULL OR rad_add_alc8e2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- f. Continued use despite social/interpersonal problems (lifetime)
    rad_add_alc8f1 VARCHAR(20) CHECK (rad_add_alc8f1 IS NULL OR rad_add_alc8f1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- f. Continued use despite social/interpersonal problems (12 months)
    rad_add_alc8f2 VARCHAR(20) CHECK (rad_add_alc8f2 IS NULL OR rad_add_alc8f2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- g. Important activities given up or reduced (lifetime)
    rad_add_alc8g1 VARCHAR(20) CHECK (rad_add_alc8g1 IS NULL OR rad_add_alc8g1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- g. Important activities given up or reduced (12 months)
    rad_add_alc8g2 VARCHAR(20) CHECK (rad_add_alc8g2 IS NULL OR rad_add_alc8g2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- h. Recurrent use in hazardous situations (lifetime)
    rad_add_alc8h1 VARCHAR(20) CHECK (rad_add_alc8h1 IS NULL OR rad_add_alc8h1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- h. Recurrent use in hazardous situations (12 months)
    rad_add_alc8h2 VARCHAR(20) CHECK (rad_add_alc8h2 IS NULL OR rad_add_alc8h2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- i. Continued use despite physical/psychological problems (lifetime)
    rad_add_alc8i1 VARCHAR(20) CHECK (rad_add_alc8i1 IS NULL OR rad_add_alc8i1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- i. Continued use despite physical/psychological problems (12 months)
    rad_add_alc8i2 VARCHAR(20) CHECK (rad_add_alc8i2 IS NULL OR rad_add_alc8i2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- j. Tolerance (lifetime)
    rad_add_alc8j1 VARCHAR(20) CHECK (rad_add_alc8j1 IS NULL OR rad_add_alc8j1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- j. Tolerance (12 months)
    rad_add_alc8j2 VARCHAR(20) CHECK (rad_add_alc8j2 IS NULL OR rad_add_alc8j2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- k. Withdrawal symptoms or use to avoid withdrawal (lifetime)
    rad_add_alc8k1 VARCHAR(20) CHECK (rad_add_alc8k1 IS NULL OR rad_add_alc8k1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- k. Withdrawal symptoms or use to avoid withdrawal (12 months)
    rad_add_alc8k2 VARCHAR(20) CHECK (rad_add_alc8k2 IS NULL OR rad_add_alc8k2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- l. Legal problems related to use (lifetime) - not in DSM-5 but included
    rad_add_alc8l1 VARCHAR(20) CHECK (rad_add_alc8l1 IS NULL OR rad_add_alc8l1 IN ('Oui', 'Non', 'Ne sais pas')),
    -- l. Legal problems related to use (12 months)
    rad_add_alc8l2 VARCHAR(20) CHECK (rad_add_alc8l2 IS NULL OR rad_add_alc8l2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Computed DSM5 Severity Scores
    -- ========================================================================
    
    -- Count of positive criteria (Oui) for lifetime
    dsm5_lifetime_count INTEGER CHECK (dsm5_lifetime_count IS NULL OR (dsm5_lifetime_count >= 0 AND dsm5_lifetime_count <= 12)),
    
    -- Count of positive criteria (Oui) for 12 months
    dsm5_12month_count INTEGER CHECK (dsm5_12month_count IS NULL OR (dsm5_12month_count >= 0 AND dsm5_12month_count <= 12)),
    
    -- Severity interpretation for lifetime (0-1: none, 2-3: mild, 4-5: moderate, 6+: severe)
    dsm5_lifetime_severity VARCHAR(20) CHECK (dsm5_lifetime_severity IS NULL OR dsm5_lifetime_severity IN (
        'none', 'mild', 'moderate', 'severe'
    )),
    
    -- Severity interpretation for 12 months
    dsm5_12month_severity VARCHAR(20) CHECK (dsm5_12month_severity IS NULL OR dsm5_12month_severity IN (
        'none', 'mild', 'moderate', 'severe'
    )),
    
    -- ========================================================================
    -- ALCOHOL SECTION - History (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 10a. Age of first alcohol consumption (years)
    add_alc_10a INTEGER CHECK (add_alc_10a IS NULL OR (add_alc_10a >= 0 AND add_alc_10a <= 120)),
    
    -- 10b. Age of alcohol use disorder onset (years)
    add_alc_10b INTEGER CHECK (add_alc_10b IS NULL OR (add_alc_10b >= 0 AND add_alc_10b <= 120)),
    
    -- 10c. Maximum abstinence duration (months)
    add_alc_10c INTEGER CHECK (add_alc_10c IS NULL OR add_alc_10c >= 0),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Family History (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 11. First-degree family history of alcohol use disorder
    rad_add_alc11 VARCHAR(20) CHECK (rad_add_alc11 IS NULL OR rad_add_alc11 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Craving (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 12. Craving score (0-10) - maximum urge to consume in the last week
    rad_add_alc12 VARCHAR(20) CHECK (rad_add_alc12 IS NULL OR rad_add_alc12 IN (
        '', '0 Jamais', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 Tout le temps'
    )),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Treatment (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 13. Lifetime medication treatment for alcohol use disorder
    rad_add_alc13 VARCHAR(20) CHECK (rad_add_alc13 IS NULL OR rad_add_alc13 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- 13b. Which medication (shows if rad_add_alc13 = 'Oui')
    add_alc13b VARCHAR(255),
    
    -- ========================================================================
    -- ALCOHOL SECTION - Hospitalization (shows if rad_add_alc1 = 'Oui')
    -- ========================================================================
    
    -- 14a. Lifetime hospitalization for alcohol withdrawal
    rad_add_alc14a VARCHAR(20) CHECK (rad_add_alc14a IS NULL OR rad_add_alc14a IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- 14b. Number of hospitalizations for withdrawal (shows if rad_add_alc14a = 'Oui')
    add_alc14b INTEGER CHECK (add_alc14b IS NULL OR add_alc14b >= 0),
    
    -- 14c. Age of first hospitalization for withdrawal (shows if rad_add_alc14a = 'Oui')
    add_alc14c INTEGER CHECK (add_alc14c IS NULL OR (add_alc14c >= 0 AND add_alc14c <= 120)),
    
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

ALTER TABLE responses_eval_addictologique_sz ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR UPDATE 
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update eval addictologique sz" 
    ON responses_eval_addictologique_sz FOR UPDATE 
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
CREATE INDEX idx_eval_addictologique_sz_visit ON responses_eval_addictologique_sz(visit_id);
CREATE INDEX idx_eval_addictologique_sz_patient ON responses_eval_addictologique_sz(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Evaluation Addictologique (Schizophrenia) questionnaire table created successfully';
END $$;
