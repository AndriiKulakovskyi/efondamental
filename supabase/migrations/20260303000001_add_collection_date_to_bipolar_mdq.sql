-- Migration: Add collection_date column to bipolar_mdq table
-- Date: 2026-03-03
-- Description: Adds a date field to capture the information collection date for MDQ questionnaire

ALTER TABLE public.bipolar_mdq
ADD COLUMN collection_date date;

COMMENT ON COLUMN public.bipolar_mdq.collection_date IS 'Date de recueil des informations';
