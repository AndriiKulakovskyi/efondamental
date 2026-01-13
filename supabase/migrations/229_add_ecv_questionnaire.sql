-- Create responses_ecv table for the Evaluation des comportements violents questionnaire
-- This questionnaire assesses lifetime history of violent behaviors in schizophrenia patients

CREATE TABLE responses_ecv (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Violence verbale (Verbal violence)
    rad_ecv_vv1 TEXT, -- Primary question: Has the subject exhibited verbal violence?
    chk_ecv_vv2 TEXT[], -- Type: Intrafamiliale, Extrafamiliale (array for multiple selection)
    rad_ecv_vv3 TEXT, -- Police intervention
    rad_ecv_vv4 TEXT, -- Conviction
    chk_ecv_vv5 TEXT[], -- Conviction type: Amende, Sursis, Prison

    -- Violence physique (Physical violence)
    rad_ecv_vp1 TEXT, -- Primary question: Physical violence
    rad_ecv_vp2 TEXT, -- Assault and battery
    chk_ecv_vp3 TEXT[], -- Weapon used: Sans arme, Arme blanche, Arme à feu
    rad_ecv_vp4 TEXT, -- Resulting in medical care for victim
    rad_ecv_vp5 TEXT, -- Homicide
    chk_ecv_vp6 TEXT[], -- Type: Intrafamiliale, Extrafamiliale
    rad_ecv_vp7 TEXT, -- Police intervention
    rad_ecv_vp8 TEXT, -- Conviction
    chk_ecv_vp9 TEXT[], -- Conviction type: Amende, Sursis, Prison

    -- Violence sexuelle (Sexual violence)
    rad_ecv_vs1 TEXT, -- Primary question: Sexual violence
    chk_ecv_vs2 TEXT[], -- Type: Viol, Attouchements
    chk_ecv_vs3 TEXT[], -- Type: Intrafamiliale, Extrafamiliale
    rad_ecv_vs4 TEXT, -- Police intervention
    rad_ecv_vs5 TEXT, -- Conviction
    chk_ecv_vs6 TEXT[], -- Conviction type: Amende, Sursis, Prison

    -- Bris d'objet (Property damage)
    rad_ecv_vo1 TEXT, -- Primary question: Property damage
    chk_ecv_vo2 TEXT[], -- Type: Intrafamiliale, Extrafamiliale
    rad_ecv_vo3 TEXT, -- Police intervention
    rad_ecv_vo4 TEXT, -- Conviction
    chk_ecv_vo5 TEXT[], -- Conviction type: Amende, Sursis, Prison

    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.responses_ecv ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own ECV" ON responses_ecv FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own ECV" ON responses_ecv FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own ECV" ON responses_ecv FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all ECV" ON responses_ecv FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert ECV" ON responses_ecv FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update ECV" ON responses_ecv FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_ecv_visit ON responses_ecv(visit_id);
CREATE INDEX idx_ecv_patient ON responses_ecv(patient_id);
