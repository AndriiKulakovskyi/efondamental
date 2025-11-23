-- Update DSM5 Humeur questionnaire table structure
-- Add new fields and update postpartum field type

-- 1. Update postpartum_first from boolean to varchar (for 'oui'/'non')
ALTER TABLE responses_dsm5_humeur
ALTER COLUMN postpartum_first TYPE VARCHAR(10);

-- 2. Update disorder_type to include 'autre' option and add disorder_type_autre field
-- First, update the column type to allow 'autre' value
ALTER TABLE responses_dsm5_humeur
ALTER COLUMN disorder_type TYPE VARCHAR(50);

-- Add disorder_type_autre text field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS disorder_type_autre TEXT;

-- Remove substance_autre column (replaced by disorder_type_autre)
ALTER TABLE responses_dsm5_humeur
DROP COLUMN IF EXISTS substance_autre;

-- 3. Add new hospitalization fields after age_first_hospitalization
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS number_of_hospitalizations INTEGER CHECK (number_of_hospitalizations >= 0);

ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS total_hospitalization_duration_months INTEGER CHECK (total_hospitalization_duration_months >= 0);

-- 4. Add work stoppage duration field
ALTER TABLE responses_dsm5_humeur
ADD COLUMN IF NOT EXISTS past_year_work_leave_weeks INTEGER CHECK (past_year_work_leave_weeks >= 0);

-- Add comments
COMMENT ON COLUMN responses_dsm5_humeur.postpartum_first IS 'Post-partum occurrence (first 6 months): oui/non';
COMMENT ON COLUMN responses_dsm5_humeur.disorder_type_autre IS 'Other disorder type specification';
COMMENT ON COLUMN responses_dsm5_humeur.number_of_hospitalizations IS 'Total number of hospitalizations';
COMMENT ON COLUMN responses_dsm5_humeur.total_hospitalization_duration_months IS 'Total duration of hospitalizations in months';
COMMENT ON COLUMN responses_dsm5_humeur.past_year_work_leave_weeks IS 'Total work stoppage duration in the past year (in weeks)';

