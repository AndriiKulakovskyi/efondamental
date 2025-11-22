-- eFondaMental Platform - ECG (Electrocardiogramme) Questionnaire
-- Assessment of electrocardiographic parameters with QTc calculation and severity criteria

-- ============================================================================
-- Create ECG Response Table
-- ============================================================================

CREATE TABLE responses_ecg (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- ECG performed
    ecg_performed TEXT NOT NULL CHECK (ecg_performed IN ('yes', 'no')), -- ECG_01

    -- Measurements
    heart_rate INTEGER CHECK (heart_rate > 0), -- ECG_02_HR (bpm)
    qt_measured DECIMAL(5,3) CHECK (qt_measured > 0), -- ECG_03_QT (in seconds, e.g., 0.400)
    rr_measured DECIMAL(5,3) CHECK (rr_measured > 0), -- ECG_04_RR (in seconds, e.g., 0.850)
    qtc_calculated DECIMAL(5,3) CHECK (qtc_calculated > 0), -- ECG_05_QTC (calculated QTc)

    -- Follow-up
    ecg_sent_to_cardiologist TEXT CHECK (ecg_sent_to_cardiologist IN ('yes', 'no')), -- ECG_06_SEND
    cardiologist_consultation_requested TEXT CHECK (cardiologist_consultation_requested IN ('yes', 'no')), -- ECG_07_CONSULT

    -- Cardiologist details (optional)
    cardiologist_name TEXT, -- ECG_08_NAME
    cardiologist_city TEXT, -- ECG_09_CITY

    -- Interpretation and alerts
    interpretation TEXT,
    alert_message TEXT, -- For QTc warnings

    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_ecg_visit_id ON responses_ecg(visit_id);
CREATE INDEX idx_responses_ecg_patient_id ON responses_ecg(patient_id);

-- ============================================================================
-- Enable RLS
-- ============================================================================

ALTER TABLE responses_ecg ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for Healthcare Professionals
-- ============================================================================

CREATE POLICY "Healthcare professionals can view ECG responses"
    ON responses_ecg FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert ECG responses"
    ON responses_ecg FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update ECG responses"
    ON responses_ecg FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE TRIGGER update_responses_ecg_updated_at
    BEFORE UPDATE ON responses_ecg
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

