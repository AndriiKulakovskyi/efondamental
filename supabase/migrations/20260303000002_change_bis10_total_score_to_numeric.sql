-- Migration: Change total_score type from integer to numeric in bipolar_bis10
-- Date: 2026-03-03
-- Description: BIS-10 total score is now calculated as sum of three subscale means (cognitive + behavioral + general)
--              which results in decimal values (e.g., 2.4 + 3.1 + 2.8 = 8.3)

ALTER TABLE public.bipolar_bis10
ALTER COLUMN total_score TYPE numeric(4,1);

COMMENT ON COLUMN public.bipolar_bis10.total_score IS 'BIS-10 Total Score: sum of cognitive_impulsivity_mean + behavioral_impulsivity_mean + overall_impulsivity (range: 3.0-12.0)';
