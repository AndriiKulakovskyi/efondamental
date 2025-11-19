-- eFondaMental Platform - Social Questionnaire Migration
-- Social evaluation questionnaire for bipolar disorder initial evaluation

-- ============================================================================
-- Create Social Questionnaire Table
-- ============================================================================

CREATE TABLE responses_social (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
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
    
    -- 8. Arrêt de travail actuel
    current_work_leave VARCHAR(20) CHECK (current_work_leave IN (
        'oui', 'non', 'non_applicable'
    )),
    
    -- 9. Arrêt de travail au cours de l'année passée
    past_year_work_leave VARCHAR(20) CHECK (past_year_work_leave IN (
        'oui', 'non', 'non_applicable'
    )),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_social ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view social responses
CREATE POLICY "Healthcare professionals can view social responses"
    ON responses_social FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert social responses
CREATE POLICY "Healthcare professionals can insert social responses"
    ON responses_social FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update social responses
CREATE POLICY "Healthcare professionals can update social responses"
    ON responses_social FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own social responses
CREATE POLICY "Patients can view own social responses"
    ON responses_social FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_social_updated_at BEFORE UPDATE ON responses_social
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
