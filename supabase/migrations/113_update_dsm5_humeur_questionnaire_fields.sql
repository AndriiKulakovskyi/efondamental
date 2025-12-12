-- eFondaMental Platform - Update DSM5 Mood Disorders Questionnaire
-- Add missing fields to match the complete "trouble de l'humeur" questionnaire structure

-- ============================================================================
-- Update DSM5 Mood Disorders Table - Add new fields
-- ============================================================================

-- Update disorder_type CHECK constraint to include new option
ALTER TABLE responses_dsm5_humeur DROP CONSTRAINT IF EXISTS responses_dsm5_humeur_disorder_type_check;
ALTER TABLE responses_dsm5_humeur
ADD CONSTRAINT responses_dsm5_humeur_disorder_type_check CHECK (disorder_type IN (
    'bipolaire_type_1',
    'bipolaire_type_2',
    'bipolaire_non_specifie',
    'trouble_depressif_majeur',
    'trouble_depressif_majeur_isole',
    'trouble_depressif_majeur_recurrent',
    'trouble_dysthymique',
    'trouble_dysthymique_precoce',
    'trouble_dysthymique_tardif',
    'trouble_cyclothymique',
    'trouble_depressif_non_specifie',
    'trouble_humeur_affection_medicale',
    'trouble_humeur_induit_substance',
    'autre'
));

-- Add Major Depression Type field (Isolé/Récurrent)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS major_depression_type VARCHAR(20) CHECK (major_depression_type IN ('isole', 'recurrent'));

-- Add Dysthymic Type field (Précoce/Tardif)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS dysthymic_type VARCHAR(20) CHECK (dysthymic_type IN ('precoce', 'tardif'));

-- Add Medical Condition Trouble Type field (if not exists)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS medical_condition_trouble_type VARCHAR(50) CHECK (medical_condition_trouble_type IN (
    'episode_allure_depression_majeure',
    'episode_caracteristiques_depressives',
    'episode_caracteristiques_maniaques',
    'episode_caracteristiques_mixtes',
    'ne_sais_pas'
));

-- Add Substance Type as single_choice (replace multiple_choice)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS substance_type VARCHAR(50) CHECK (substance_type IN (
    'alcool',
    'cannabis',
    'opiaces',
    'cocaine',
    'hallucinogene',
    'drogues_multiples',
    'sedatif_hypnotique',
    'stimulants',
    'anxiolytique',
    'antidepresseurs',
    'corticoides',
    'interferon',
    'antipaludeen',
    'autre'
));

-- Add Substance Autre text field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS substance_autre TEXT;

-- Add Substance Trouble Type field (if not exists)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS substance_trouble_type VARCHAR(50) CHECK (substance_trouble_type IN (
    'episode_allure_depression_majeure',
    'episode_caracteristiques_depressives',
    'episode_caracteristiques_maniaques',
    'episode_caracteristiques_mixtes',
    'ne_sais_pas'
));

-- Add Unspecified Depression Type field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS unspecified_depression_type VARCHAR(50) CHECK (unspecified_depression_type IN (
    'post_psychotique_schizophrenie',
    'majeur_surajout_psychotique',
    'dysphorique_premenstruel',
    'mineur',
    'bref_recurrent',
    'autre',
    'ne_sais_pas'
));

-- Add Thymoregulator Age field (if not exists)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS age_first_thymoregulator INTEGER CHECK (age_first_thymoregulator > 0);

-- Add Seasonal Depression fields
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS seasonal_depression VARCHAR(20) CHECK (seasonal_depression IN ('oui', 'non', 'ne_sais_pas'));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS seasonal_depression_season VARCHAR(20) CHECK (seasonal_depression_season IN ('printemps', 'ete', 'automne', 'hiver'));

-- Add Seasonal Hypomania fields
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS seasonal_hypomania VARCHAR(20) CHECK (seasonal_hypomania IN ('oui', 'non', 'ne_sais_pas'));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS seasonal_hypomania_season VARCHAR(20) CHECK (seasonal_hypomania_season IN ('printemps', 'ete', 'automne', 'hiver'));

-- Add Number of Work Leaves field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS past_year_num_work_leaves INTEGER CHECK (past_year_num_work_leaves >= 0);

-- Add unified Recent Episode fields
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_episode_catatonic VARCHAR(20) CHECK (recent_episode_catatonic IN ('oui', 'non', 'ne_sais_pas'));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_episode_severity VARCHAR(50) CHECK (recent_episode_severity IN (
    'leger',
    'modere',
    'severe_sans_psychotiques',
    'severe_psychotiques_non_congruentes',
    'severe_psychotiques_congruentes'
));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_episode_postpartum VARCHAR(20) CHECK (recent_episode_postpartum IN ('oui', 'non', 'ne_sais_pas'));

-- Add recent_edm_subtype column (single_choice format)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_edm_subtype VARCHAR(50) CHECK (recent_edm_subtype IN (
    'sans_caracteristique',
    'melancolique',
    'atypique',
    'catatonique',
    'mixte'
));

-- Add unified Current Episode fields
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_episode_catatonic VARCHAR(20) CHECK (current_episode_catatonic IN ('oui', 'non', 'ne_sais_pas'));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_episode_severity VARCHAR(50) CHECK (current_episode_severity IN (
    'leger',
    'modere',
    'severe_sans_psychotique',
    'severe_psychotiques_non_congruentes',
    'severe_psychotiques_congruentes'
));

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_episode_postpartum VARCHAR(20) CHECK (current_episode_postpartum IN ('oui', 'non', 'ne_sais_pas'));

-- Add current_edm_subtype column (single_choice format)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_edm_subtype VARCHAR(50) CHECK (current_edm_subtype IN (
    'sans_caracteristique',
    'melancolique',
    'atypique',
    'catatonique',
    'mixte'
));

-- Update current_episode_type constraint to allow both old and new values
-- IMPORTANT: Must DROP constraint FIRST, then add new permissive constraint
-- We keep both old values (hypomanie/manie) and new values (hypomaniaque/maniaque) for backward compatibility
ALTER TABLE responses_dsm5_humeur DROP CONSTRAINT IF EXISTS responses_dsm5_humeur_current_episode_type_check;

-- Add permissive constraint that allows all possible values
ALTER TABLE responses_dsm5_humeur
ADD CONSTRAINT responses_dsm5_humeur_current_episode_type_check CHECK (current_episode_type IN (
    'edm',
    'hypomanie',
    'manie',
    'hypomaniaque',
    'maniaque',
    'non_specifie',
    'ne_sais_pas'
));

-- Update total_hospitalization_duration_months to text type for flexible input
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS total_hospitalization_duration_text TEXT;

-- Update past_year_hospitalization_weeks to text type
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS past_year_hospitalization_weeks_text TEXT;

-- Update past_year_work_leave_weeks to text type
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS past_year_work_leave_weeks_text TEXT;

-- Update age_first_hypomanic to text type (for flexible age input)
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS age_first_hypomanic_text TEXT;

-- Update age_first_manic to text type
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS age_first_manic_text TEXT;

-- Update recent_episode_start_date and end_date to text type
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_episode_start_date_text TEXT;

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS recent_episode_end_date_text TEXT;

-- Add current_manie_mixed as text field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS current_manie_mixed_text TEXT;

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON COLUMN responses_dsm5_humeur.major_depression_type IS 'Type of Major Depressive Disorder: Isolé (isolated) or Récurrent (recurrent)';
COMMENT ON COLUMN responses_dsm5_humeur.dysthymic_type IS 'Type of Dysthymic Disorder: Précoce (early onset) or Tardif (late onset)';
COMMENT ON COLUMN responses_dsm5_humeur.medical_condition_trouble_type IS 'Type of mood disorder due to medical condition';
COMMENT ON COLUMN responses_dsm5_humeur.substance_type IS 'Type of substance for substance-induced mood disorder';
COMMENT ON COLUMN responses_dsm5_humeur.substance_autre IS 'Specify other substance if substance_type is autre';
COMMENT ON COLUMN responses_dsm5_humeur.substance_trouble_type IS 'Type of substance-induced mood disorder';
COMMENT ON COLUMN responses_dsm5_humeur.unspecified_depression_type IS 'Subtype of unspecified depressive disorder';
COMMENT ON COLUMN responses_dsm5_humeur.seasonal_depression IS 'Whether patient has seasonal depression';
COMMENT ON COLUMN responses_dsm5_humeur.seasonal_depression_season IS 'Season of seasonal depression';
COMMENT ON COLUMN responses_dsm5_humeur.seasonal_hypomania IS 'Whether patient has seasonal (hypo)mania';
COMMENT ON COLUMN responses_dsm5_humeur.seasonal_hypomania_season IS 'Season of seasonal (hypo)mania';
COMMENT ON COLUMN responses_dsm5_humeur.past_year_num_work_leaves IS 'Number of work leaves in the past year';
COMMENT ON COLUMN responses_dsm5_humeur.recent_episode_catatonic IS 'Catatonic type for recent episode (Manie or Episode non spécifié)';
COMMENT ON COLUMN responses_dsm5_humeur.recent_episode_severity IS 'Severity of most recent episode';
COMMENT ON COLUMN responses_dsm5_humeur.recent_episode_postpartum IS 'Postpartum occurrence for recent episode';
COMMENT ON COLUMN responses_dsm5_humeur.current_episode_catatonic IS 'Catatonic type for current episode (Maniaque or Episode non spécifié)';
COMMENT ON COLUMN responses_dsm5_humeur.current_episode_severity IS 'Severity of current episode';
COMMENT ON COLUMN responses_dsm5_humeur.current_episode_postpartum IS 'Postpartum occurrence for current episode';
