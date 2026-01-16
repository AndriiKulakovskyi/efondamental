-- Migration: Add missing tables for schizophrenia evaluation
-- Description: Creates responses_suicide_history_sz table which is missing in previous migrations.

CREATE TABLE IF NOT EXISTS responses_suicide_history_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and add basic policies
ALTER TABLE responses_suicide_history_sz ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can do everything" ON responses_suicide_history_sz;
CREATE POLICY "Authenticated users can do everything" ON responses_suicide_history_sz FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grant access
GRANT ALL ON responses_suicide_history_sz TO authenticated;
GRANT ALL ON responses_suicide_history_sz TO service_role;
