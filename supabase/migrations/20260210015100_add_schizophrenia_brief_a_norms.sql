ALTER TABLE schizophrenia_brief_a
  ADD COLUMN IF NOT EXISTS brief_a_age_band TEXT;

ALTER TABLE schizophrenia_brief_a
  ADD COLUMN IF NOT EXISTS brief_a_inhibit_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_inhibit_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_shift_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_shift_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_emotional_control_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_emotional_control_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_self_monitor_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_self_monitor_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_initiate_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_initiate_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_working_memory_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_working_memory_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_plan_organize_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_plan_organize_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_task_monitor_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_task_monitor_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_organization_materials_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_organization_materials_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_bri_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_bri_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_mi_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_mi_p TEXT,
  ADD COLUMN IF NOT EXISTS brief_a_gec_t INTEGER,
  ADD COLUMN IF NOT EXISTS brief_a_gec_p TEXT;
