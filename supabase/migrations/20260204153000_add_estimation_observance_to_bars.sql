-- Migration: Add estimation_observance column to schizophrenia_bars
-- Date: 2026-02-04

ALTER TABLE "public"."schizophrenia_bars" ADD COLUMN IF NOT EXISTS "estimation_observance" INTEGER;
COMMENT ON COLUMN "public"."schizophrenia_bars"."estimation_observance" IS 'Manual estimation of adherence by the patient (0-100)';
