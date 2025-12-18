-- Migration: Add new fields to responses_social table
-- Description: Adds conditional professional fields, income source, debt level, and work leave tracking

-- Add new professional status conditional fields
ALTER TABLE responses_social
  ADD COLUMN IF NOT EXISTS active_work_duration VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_full_time VARCHAR(10),
  ADD COLUMN IF NOT EXISTS professional_class_active VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_job_end_date DATE,
  ADD COLUMN IF NOT EXISTS professional_class_unemployed VARCHAR(100),
  ADD COLUMN IF NOT EXISTS main_income_source VARCHAR(50);

-- Add debt level field
ALTER TABLE responses_social
  ADD COLUMN IF NOT EXISTS debt_level VARCHAR(50);

-- Add work leave tracking fields
ALTER TABLE responses_social
  ADD COLUMN IF NOT EXISTS long_term_leave VARCHAR(10),
  ADD COLUMN IF NOT EXISTS cumulative_leave_weeks INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN responses_social.active_work_duration IS 'Duration of consecutive work (for active workers): < 1 an, 1 an, 2 ans, ..., Entre 10 et 20 ans, Entre 20 et 30 ans, > 30 ans';
COMMENT ON COLUMN responses_social.is_full_time IS 'Is it a full-time job: oui/non';
COMMENT ON COLUMN responses_social.professional_class_active IS 'Professional class for active workers';
COMMENT ON COLUMN responses_social.last_job_end_date IS 'End date of last job (for unemployed)';
COMMENT ON COLUMN responses_social.professional_class_unemployed IS 'Professional class for unemployed';
COMMENT ON COLUMN responses_social.main_income_source IS 'Main source of income: salaire, rmi_rsa, aah, pension_invalidite, allocations_chomage, apl, autres';
COMMENT ON COLUMN responses_social.debt_level IS 'Debt level: aucun, facile_a_gerer, difficile_a_gerer, tres_difficile_a_gerer, non_renseigne';
COMMENT ON COLUMN responses_social.long_term_leave IS 'Is current work leave long-term: oui/non';
COMMENT ON COLUMN responses_social.cumulative_leave_weeks IS 'Cumulative weeks of work leave in the past year (0-52)';
