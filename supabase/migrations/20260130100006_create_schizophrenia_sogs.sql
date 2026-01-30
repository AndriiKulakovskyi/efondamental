-- ============================================================================
-- Migration: Create SOGS (South Oaks Gambling Screen) table for Schizophrenia
-- ============================================================================
-- Questionnaire: SOGS - Jeu Pathologique
-- Reference: Lesieur HR, Blume SB. Am J Psychiatry. 1987
-- French adaptation: Lejoyeux M. 1999
-- 
-- Structure: 35 database fields, 20 scored items, 3 scoring functions
-- Score range: 0-20 (11 base + 9 conditional from Q16)
-- Clinical thresholds: 0-2 (no problem), 3-4 (at risk), 5+ (pathological)
-- ============================================================================

CREATE TABLE IF NOT EXISTS schizophrenia_sogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Administration status
  questionnaire_done TEXT CHECK (questionnaire_done IN ('Fait', 'Non fait')),
  
  -- ========================================
  -- Q1a-g: Types of gambling (7 items, NOT scored)
  -- Options: Jamais, Moins d'une fois par semaine, Au moins une fois par semaine
  -- ========================================
  rad_sogs1a TEXT,  -- Paris sur des chevaux
  rad_sogs1b TEXT,  -- Paris sportifs
  rad_sogs1c TEXT,  -- Jeux de casino
  rad_sogs1d TEXT,  -- Loto ou loterie
  rad_sogs1e TEXT,  -- Bingo pour de l'argent
  rad_sogs1f TEXT,  -- Jeux sur machines
  rad_sogs1g TEXT,  -- Autres jeux (grattage)
  
  -- ========================================
  -- Q2: Maximum amount wagered (text, NOT scored)
  -- ========================================
  sogs2 TEXT,
  
  -- ========================================
  -- Q3: Family history (NOT scored)
  -- ========================================
  rad_sogs3 TEXT,       -- Oui/Non
  chk_sogs3a TEXT,      -- Multiple choice (comma-separated)
  
  -- ========================================
  -- Q4-Q15: Main scoring items
  -- ========================================
  -- Q4: Chasing (any non-Jamais = 1 pt)
  rad_sogs4 TEXT,
  -- Q5, Q6: First option = 0, others = 1
  rad_sogs5 TEXT,
  rad_sogs6 TEXT,
  -- Q7-Q11: Yes/No (Oui = 1)
  rad_sogs7 TEXT,
  rad_sogs8 TEXT,
  rad_sogs9 TEXT,
  rad_sogs10 TEXT,
  rad_sogs11 TEXT,
  -- Q12: Filter question (NOT scored)
  rad_sogs12 TEXT,
  -- Q13-Q15: Yes/No (Oui = 1)
  rad_sogs13 TEXT,
  rad_sogs14 TEXT,
  rad_sogs15 TEXT,
  
  -- ========================================
  -- Q16: Main gate question + sub-items (conditional)
  -- Q16a-i: Scored if Q16 = "Oui"
  -- Q16j, Q16k: NOT scored
  -- ========================================
  rad_sogs16 TEXT,      -- Gate question (Oui/Non)
  rad_sogs16a TEXT,     -- Scored
  rad_sogs16b TEXT,     -- Scored
  rad_sogs16c TEXT,     -- Scored
  rad_sogs16d TEXT,     -- Scored
  rad_sogs16e TEXT,     -- Scored
  rad_sogs16f TEXT,     -- Scored
  rad_sogs16g TEXT,     -- Scored
  rad_sogs16h TEXT,     -- Scored
  rad_sogs16i TEXT,     -- Scored
  rad_sogs16j TEXT,     -- NOT scored
  rad_sogs16k TEXT,     -- NOT scored
  
  -- ========================================
  -- Computed fields
  -- ========================================
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 20),
  gambling_severity TEXT CHECK (gambling_severity IN ('no_problem', 'at_risk', 'pathological')),
  interpretation TEXT,
  
  -- ========================================
  -- Metadata
  -- ========================================
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sogs_visit_id ON schizophrenia_sogs(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sogs_patient_id ON schizophrenia_sogs(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sogs_total_score ON schizophrenia_sogs(total_score);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sogs_gambling_severity ON schizophrenia_sogs(gambling_severity);

-- ============================================================================
-- Row Level Security
-- ============================================================================
ALTER TABLE schizophrenia_sogs ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients can view own SOGS responses" 
  ON schizophrenia_sogs FOR SELECT 
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own SOGS responses" 
  ON schizophrenia_sogs FOR INSERT 
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own SOGS responses" 
  ON schizophrenia_sogs FOR UPDATE 
  USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals can view all SOGS responses" 
  ON schizophrenia_sogs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals can insert SOGS responses" 
  ON schizophrenia_sogs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals can update SOGS responses" 
  ON schizophrenia_sogs FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================
CREATE TRIGGER update_schizophrenia_sogs_updated_at
  BEFORE UPDATE ON schizophrenia_sogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comment
-- ============================================================================
COMMENT ON TABLE schizophrenia_sogs IS 'SOGS (South Oaks Gambling Screen) responses for schizophrenia pathology. 35 items, 20 scored with 3 different scoring functions. Clinical cutoffs: 0-2 no problem, 3-4 at risk, 5+ pathological.';
