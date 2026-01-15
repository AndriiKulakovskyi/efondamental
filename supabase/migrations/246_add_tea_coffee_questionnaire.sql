-- ============================================================================
-- eFondaMental Platform - Tea and Coffee Consumption Questionnaire
-- ============================================================================
-- This migration creates the response table for the Tea and Coffee Consumption
-- questionnaire used in schizophrenia initial evaluation visits (Addictologie section).
--
-- The questionnaire tracks:
--   - Tea consumption: quantity and frequency (lifetime max and last 12 months)
--   - Coffee consumption: quantity and frequency (lifetime max and last 12 months)
--
-- Branching logic:
--   - 5b1 fields appear only when 5b = '1_to_7'
--   - 6b1 fields appear only when 6b = '1_to_7'
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tea Coffee Response Table
-- ----------------------------------------------------------------------------
CREATE TABLE responses_tea_coffee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- TEA Section
    -- ========================================================================
    
    -- 5a. Quantity consumed (cups/day) during MAX LIFETIME consumption periods
    tea_5a INTEGER CHECK (tea_5a IS NULL OR tea_5a >= 0),
    
    -- 5b. Frequency during MAX LIFETIME consumption periods
    -- Options: '1_to_7' (1 to 7 times per week), 'less_than_once' (Less than once per week)
    tea_5b VARCHAR(20) CHECK (tea_5b IS NULL OR tea_5b IN ('1_to_7', 'less_than_once')),
    
    -- 5b1. Specify number of times (appears if 5b = '1_to_7')
    -- Values: 1-7
    tea_5b1 INTEGER CHECK (tea_5b1 IS NULL OR (tea_5b1 >= 1 AND tea_5b1 <= 7)),
    
    -- 6a. Quantity consumed (cups/day) during LAST 12 MONTHS
    tea_6a INTEGER CHECK (tea_6a IS NULL OR tea_6a >= 0),
    
    -- 6b. Weekly frequency during LAST 12 MONTHS
    -- Options: '1_to_7' (1 to 7 times per week), 'less_than_once' (Less than once per week)
    tea_6b VARCHAR(20) CHECK (tea_6b IS NULL OR tea_6b IN ('1_to_7', 'less_than_once')),
    
    -- 6b1. Specify number of times (appears if 6b = '1_to_7')
    -- Values: 1-7
    tea_6b1 INTEGER CHECK (tea_6b1 IS NULL OR (tea_6b1 >= 1 AND tea_6b1 <= 7)),
    
    -- ========================================================================
    -- COFFEE Section
    -- ========================================================================
    
    -- 5a. Quantity consumed (cups/day) during MAX LIFETIME consumption periods
    coffee_5a INTEGER CHECK (coffee_5a IS NULL OR coffee_5a >= 0),
    
    -- 5b. Frequency during MAX LIFETIME consumption periods
    -- Options: '1_to_7' (1 to 7 times per week), 'less_than_once' (Less than once per week)
    coffee_5b VARCHAR(20) CHECK (coffee_5b IS NULL OR coffee_5b IN ('1_to_7', 'less_than_once')),
    
    -- 5b1. Specify number of times (appears if 5b = '1_to_7')
    -- Values: 1-7
    coffee_5b1 INTEGER CHECK (coffee_5b1 IS NULL OR (coffee_5b1 >= 1 AND coffee_5b1 <= 7)),
    
    -- 6a. Quantity consumed (cups/day) during LAST 12 MONTHS
    coffee_6a INTEGER CHECK (coffee_6a IS NULL OR coffee_6a >= 0),
    
    -- 6b. Weekly frequency during LAST 12 MONTHS
    -- Options: '1_to_7' (1 to 7 times per week), 'less_than_once' (Less than once per week)
    coffee_6b VARCHAR(20) CHECK (coffee_6b IS NULL OR coffee_6b IN ('1_to_7', 'less_than_once')),
    
    -- 6b1. Specify number of times (appears if 6b = '1_to_7')
    -- Values: 1-7
    coffee_6b1 INTEGER CHECK (coffee_6b1 IS NULL OR (coffee_6b1 >= 1 AND coffee_6b1 <= 7)),
    
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

ALTER TABLE responses_tea_coffee ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own tea coffee" 
    ON responses_tea_coffee FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own tea coffee" 
    ON responses_tea_coffee FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own tea coffee" 
    ON responses_tea_coffee FOR UPDATE 
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all tea coffee" 
    ON responses_tea_coffee FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert tea coffee" 
    ON responses_tea_coffee FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update tea coffee" 
    ON responses_tea_coffee FOR UPDATE 
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
CREATE INDEX idx_tea_coffee_visit ON responses_tea_coffee(visit_id);
CREATE INDEX idx_tea_coffee_patient ON responses_tea_coffee(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Tea and Coffee Consumption questionnaire table created successfully';
END $$;
