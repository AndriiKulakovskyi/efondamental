-- ============================================================================
-- eFondaMental Platform - Fix Bipolar Social Table Schema
-- ============================================================================
-- Updates bipolar_social from JSONB to individual columns matching responses_social
-- ============================================================================

-- Drop existing table with JSONB schema
DROP TABLE IF EXISTS public.bipolar_social CASCADE;

-- ============================================================================
-- Create bipolar_social with individual columns
-- ============================================================================

CREATE TABLE public.bipolar_social (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  
  -- 1. Statut marital
  marital_status VARCHAR(50) CHECK (marital_status IN (
    'celibataire', 
    'marie_concubin_pacse', 
    'separe', 
    'divorce', 
    'veuf'
  )),
  
  -- 2. Education
  education VARCHAR(20) CHECK (education IN (
    'CP', 'CE1', 'CE2', 'CM1', 'CM2', 'certificat_etudes',
    '6eme', '5eme', '4eme', '3eme', '2nde', '1ere',
    'BEP', 'CAP', 'BAC', 'BAC+1', 'BAC+2', 'BAC+3', 
    'BAC+4', 'BAC+5', 'doctorat'
  )),
  
  -- 3. Statut professionnel actuel
  professional_status VARCHAR(30) CHECK (professional_status IN (
    'sans_emploi', 'actif', 'au_foyer', 'retraite', 
    'etudiant', 'pension', 'autres'
  )),
  
  -- 4. Parcours professionnel
  first_job_age VARCHAR(10) CHECK (first_job_age IN (
    'ne_sais_pas', '<15', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '>60'
  )),
  longest_work_period INTEGER CHECK (longest_work_period BETWEEN 0 AND 99),
  total_work_duration INTEGER CHECK (total_work_duration BETWEEN 0 AND 99),
  
  -- 5. Logement
  housing_type VARCHAR(50) CHECK (housing_type IN (
    'locataire_auto_finance', 'locataire_tiers_paye', 'proprietaire',
    'institution', 'vit_avec_parents', 'foyer_hotel', 'foyer_educateur',
    'residence_post_cure', 'appartement_therapeutique', 'logement_associatif', 'autre'
  )),
  living_mode VARCHAR(30) CHECK (living_mode IN (
    'seul', 'chez_parents', 'propre_foyer_familial', 'chez_enfants',
    'chez_famille', 'colocation', 'collectivite', 'autres'
  )),
  household_size INTEGER CHECK (household_size >= 0),
  
  -- 6. Personne avec laquelle vous passez le plus de temps
  main_companion VARCHAR(30) CHECK (main_companion IN (
    'conjoint', 'mere', 'pere', 'colocataire', 'ami',
    'concubin', 'frere_soeur', 'grand_parent', 'autres_apparentes',
    'enfant', 'autre'
  )),
  
  -- 7. Mesures de protection
  protection_measures VARCHAR(30) CHECK (protection_measures IN (
    'aucune', 'curatelle', 'curatelle_renforcee', 
    'tutelle', 'sauvegarde_justice'
  )),
  
  -- 8. Arret de travail actuel
  current_work_leave VARCHAR(20) CHECK (current_work_leave IN (
    'oui', 'non', 'non_applicable'
  )),
  
  -- 9. Arret de travail au cours de l'annee passee
  past_year_work_leave VARCHAR(20) CHECK (past_year_work_leave IN (
    'oui', 'non', 'non_applicable'
  )),
  
  -- Additional fields from migration 1051
  active_work_duration VARCHAR(50),
  is_full_time VARCHAR(10),
  professional_class_active VARCHAR(100),
  last_job_end_date DATE,
  professional_class_unemployed VARCHAR(100),
  main_income_source VARCHAR(50),
  debt_level VARCHAR(50),
  long_term_leave VARCHAR(10),
  cumulative_leave_weeks INTEGER,
  
  -- Metadata
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE public.bipolar_social ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view social responses
CREATE POLICY "Professionals can view bipolar_social"
  ON public.bipolar_social FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
  );

-- Healthcare professionals can insert social responses
CREATE POLICY "Professionals can insert bipolar_social"
  ON public.bipolar_social FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
  );

-- Healthcare professionals can update social responses
CREATE POLICY "Professionals can update bipolar_social"
  ON public.bipolar_social FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
  );

-- Patients can view their own social responses
CREATE POLICY "Patients can view own bipolar_social"
  ON public.bipolar_social FOR SELECT
  USING (auth.uid() = patient_id);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_bipolar_social_visit_id ON public.bipolar_social(visit_id);
CREATE INDEX idx_bipolar_social_patient_id ON public.bipolar_social(patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_bipolar_social_updated_at 
  BEFORE UPDATE ON public.bipolar_social
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.bipolar_social IS 'Bipolar-specific social questionnaire responses for initial evaluation';
