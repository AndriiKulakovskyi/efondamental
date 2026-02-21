-- Schizophrenia must not have biannual_followup or off_schedule visit types.
-- Deactivate these templates for any deployed database.
UPDATE public.visit_templates
SET active = false, updated_at = now()
WHERE pathology_id IN (SELECT id FROM public.pathologies WHERE type = 'schizophrenia')
  AND visit_type IN ('biannual_followup', 'off_schedule');
