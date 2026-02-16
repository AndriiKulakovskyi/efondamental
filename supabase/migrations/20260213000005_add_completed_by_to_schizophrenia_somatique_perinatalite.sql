-- Migration: Add completed_by column to schizophrenia_perinatalite table
-- Date: 2026-02-13
-- Description: Adds the completed_by column to track which user completed the questionnaire

-- Add completed_by column
ALTER TABLE public.schizophrenia_perinatalite
ADD COLUMN IF NOT EXISTS completed_by uuid REFERENCES auth.users(id);

-- Add comment
COMMENT ON COLUMN public.schizophrenia_perinatalite.completed_by IS 'User who completed the questionnaire';
