-- Add English values to yes_no_fr enum to support both French and English questionnaires
-- This allows the enum to accept both 'yes'/'no' and 'oui'/'non'

ALTER TYPE "public"."yes_no_fr" ADD VALUE IF NOT EXISTS 'yes';
ALTER TYPE "public"."yes_no_fr" ADD VALUE IF NOT EXISTS 'no';
