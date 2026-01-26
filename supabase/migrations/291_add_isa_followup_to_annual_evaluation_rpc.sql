-- Fix ISA_FOLLOWUP tracking in annual_evaluation visit type
-- Previously the RPC was tracking 'ISA' (initial visit questionnaire) instead of 'ISA_FOLLOWUP' (followup questionnaire)
-- This caused completion status to not update when ISA_FOLLOWUP was submitted during annual visits

-- The fix changes:
-- 'ISA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_isa WHERE visit_id = p_visit_id), ...)
-- to:
-- 'ISA_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_isa WHERE visit_id = p_visit_id), ...)

-- Note: Full RPC function is updated via apply_migration MCP tool
-- This file documents the change for version control

-- Key changes in annual_evaluation section:
-- 1. Changed key from 'ISA' to 'ISA_FOLLOWUP'
-- 2. Changed table from bipolar_isa to bipolar_followup_isa
