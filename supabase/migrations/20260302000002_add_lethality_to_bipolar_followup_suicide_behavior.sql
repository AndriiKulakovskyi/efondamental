-- Migration: Add létalité/lésions médicales columns to bipolar_followup_suicide_behavior
-- New questions: severity of most recent attempt, date, most lethal attempt, date, potential lethality

ALTER TABLE public.bipolar_followup_suicide_behavior
    ADD COLUMN IF NOT EXISTS q5_recent_severity INTEGER,
    ADD COLUMN IF NOT EXISTS q5_recent_date DATE,
    ADD COLUMN IF NOT EXISTS q6_lethal_severity INTEGER,
    ADD COLUMN IF NOT EXISTS q6_lethal_date DATE,
    ADD COLUMN IF NOT EXISTS q7_potential_lethality INTEGER;
