-- Migration: Add subscale score columns to bipolar_als18 table
-- Date: 2026-02-25
-- Description: Adds anxiety_depression_score, depression_elation_score, anger_score, and total_score columns

-- Add subscale score columns
ALTER TABLE public.bipolar_als18
ADD COLUMN IF NOT EXISTS anxiety_depression_score integer;

ALTER TABLE public.bipolar_als18
ADD COLUMN IF NOT EXISTS depression_elation_score integer;

ALTER TABLE public.bipolar_als18
ADD COLUMN IF NOT EXISTS anger_score integer;

ALTER TABLE public.bipolar_als18
ADD COLUMN IF NOT EXISTS total_score integer;

-- Add comments
COMMENT ON COLUMN public.bipolar_als18.anxiety_depression_score IS 'Anxiety-Depression subscale score (sum of items 1, 3, 5, 6, 7) - range 0-15';
COMMENT ON COLUMN public.bipolar_als18.depression_elation_score IS 'Depression-Elation subscale score (sum of items 2, 10, 12, 13, 15, 16, 17, 18) - range 0-24';
COMMENT ON COLUMN public.bipolar_als18.anger_score IS 'Anger subscale score (sum of items 4, 8, 9, 11, 14) - range 0-15';
COMMENT ON COLUMN public.bipolar_als18.total_score IS 'Total score (sum of all 18 items) - range 0-54';
