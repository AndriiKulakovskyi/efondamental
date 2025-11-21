-- eFondaMental Platform - Update DSM5 Mood Disorders Questionnaire
-- Update fields to match corrected questionnaire structure

-- ============================================================================
-- Update DSM5 Mood Disorders Table
-- ============================================================================

-- Drop old constraints and update disorder_type CHECK constraint
ALTER TABLE responses_dsm5_humeur DROP CONSTRAINT IF EXISTS responses_dsm5_humeur_disorder_type_check;
ALTER TABLE responses_dsm5_humeur
ADD CONSTRAINT responses_dsm5_humeur_disorder_type_check CHECK (disorder_type IN (
    'bipolaire_type_1',
    'bipolaire_type_2',
    'bipolaire_non_specifie',
    'trouble_depressif_majeur_isole',
    'trouble_depressif_majeur_recurrent',
    'trouble_dysthymique',
    'trouble_cyclothymique',
    'trouble_depressif_non_specifie',
    'trouble_humeur_affection_medicale',
    'trouble_humeur_induit_substance'
));

-- Update substance fields: substance_type -> substance_types (now stores array/JSON)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS substance_types JSONB;

-- Update seasonal fields: remove individual season fields, add season_types for multiple selection
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS seasonal_types JSONB;

-- Drop old seasonal fields if they exist
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS seasonal_depression;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS seasonal_hypomania;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS seasonal_seasons;

-- Update postpartum_first to BOOLEAN
ALTER TABLE responses_dsm5_humeur
ALTER COLUMN postpartum_first TYPE BOOLEAN USING (postpartum_first = 'oui');

-- Drop old unspecified depression columns
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_post_schizophrenie;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_majeur_surajout;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_dysphorique_premenstruel;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_mineur;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_bref_recurrent;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_autre;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS unspecified_depression_ne_sais_pas;

-- Drop old cyclothymic and other_specify fields (now integrated into disorder_type)
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS cyclothymic;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS other_specify;

-- Drop old age_first_thymoregulator column
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS age_first_thymoregulator;

-- Drop old num_hospitalizations and total_hospitalization_months columns
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS num_hospitalizations;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS total_hospitalization_months;

-- Drop old past_year_num_work_leaves and past_year_work_leave_weeks columns
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS past_year_num_work_leaves;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS past_year_work_leave_weeks;

-- Update recent_edm_subtype and current_edm_subtype to JSONB for multiple selection
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_edm_subtypes JSONB;

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_edm_subtypes JSONB;

-- Drop old subtype fields
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS recent_edm_subtype;
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS current_edm_subtype;

-- Drop old medical_condition_trouble_type column
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS medical_condition_trouble_type;

-- Drop old substance_trouble_type column
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS substance_trouble_type;

-- Update substance_type column name
ALTER TABLE responses_dsm5_humeur DROP COLUMN IF EXISTS substance_type;

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON COLUMN responses_dsm5_humeur.disorder_type IS 'Type of mood disorder. EXCLUSION CRITERIA: trouble_dysthymique, trouble_cyclothymique, trouble_depressif_non_specifie exclude patient from cohort';
COMMENT ON COLUMN responses_dsm5_humeur.substance_types IS 'JSON array of substance types if disorder is substance-induced';
COMMENT ON COLUMN responses_dsm5_humeur.seasonal_types IS 'JSON array of seasonal patterns (e.g., ["Dépression saisonnière - Hiver", "(Hypo)manie saisonnière - Été"])';
COMMENT ON COLUMN responses_dsm5_humeur.recent_edm_subtypes IS 'JSON array of EDM subtypes for recent episode';
COMMENT ON COLUMN responses_dsm5_humeur.current_edm_subtypes IS 'JSON array of EDM subtypes for current episode';


