
-- Migration: Add extra score columns to schizophrenia_saps
-- subscores_sum: sum of the four main subscores (items 1-6, 8-19, 21-24, 26-33)
-- global_evaluations_score: sum of global evaluation items (7, 20, 25, 34)

ALTER TABLE public.schizophrenia_saps
ADD COLUMN IF NOT EXISTS subscores_sum INTEGER,
ADD COLUMN IF NOT EXISTS global_evaluations_score INTEGER;

-- Update existing records if any (though likely none yet)
UPDATE public.schizophrenia_saps
SET 
    subscores_sum = COALESCE(hallucinations_subscore, 0) + COALESCE(delusions_subscore, 0) + COALESCE(bizarre_behavior_subscore, 0) + COALESCE(thought_disorder_subscore, 0),
    global_evaluations_score = COALESCE(q7, 0) + COALESCE(q20, 0) + COALESCE(q25, 0) + COALESCE(q34, 0),
    total_score = COALESCE(q1, 0) + COALESCE(q2, 0) + COALESCE(q3, 0) + COALESCE(q4, 0) + COALESCE(q5, 0) + COALESCE(q6, 0) + COALESCE(q7, 0) +
                  COALESCE(q8, 0) + COALESCE(q9, 0) + COALESCE(q10, 0) + COALESCE(q11, 0) + COALESCE(q12, 0) + COALESCE(q13, 0) + COALESCE(q14, 0) + COALESCE(q15, 0) + COALESCE(q16, 0) + COALESCE(q17, 0) + COALESCE(q18, 0) + COALESCE(q19, 0) + COALESCE(q20, 0) +
                  COALESCE(q21, 0) + COALESCE(q22, 0) + COALESCE(q23, 0) + COALESCE(q24, 0) + COALESCE(q25, 0) +
                  COALESCE(q26, 0) + COALESCE(q27, 0) + COALESCE(q28, 0) + COALESCE(q29, 0) + COALESCE(q30, 0) + COALESCE(q31, 0) + COALESCE(q32, 0) + COALESCE(q33, 0) + COALESCE(q34, 0)
WHERE test_done = true;

COMMENT ON COLUMN public.schizophrenia_saps.subscores_sum IS 'Sum of the four main subscores (items 1-6, 8-19, 21-24, 26-33)';
COMMENT ON COLUMN public.schizophrenia_saps.global_evaluations_score IS 'Sum of global evaluation items (7, 20, 25, 34)';
