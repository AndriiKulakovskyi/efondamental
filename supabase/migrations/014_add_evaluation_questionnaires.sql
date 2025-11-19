-- Migration: Add tables for Initial Evaluation questionnaires
-- This migration creates tables for 16 new questionnaires used in the bipolar disorder initial evaluation visit

-- ============================================
-- ETAT Section Questionnaires (7 new)
-- ============================================

-- 1. EQ-5D-5L (Health status questionnaire)
CREATE TABLE responses_eq5d5l (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 5 dimensions (1-5 scale each)
    mobility INTEGER NOT NULL CHECK (mobility BETWEEN 1 AND 5),
    self_care INTEGER NOT NULL CHECK (self_care BETWEEN 1 AND 5),
    usual_activities INTEGER NOT NULL CHECK (usual_activities BETWEEN 1 AND 5),
    pain_discomfort INTEGER NOT NULL CHECK (pain_discomfort BETWEEN 1 AND 5),
    anxiety_depression INTEGER NOT NULL CHECK (anxiety_depression BETWEEN 1 AND 5),
    
    -- Visual Analogue Scale (0-100)
    vas_score INTEGER NOT NULL CHECK (vas_score BETWEEN 0 AND 100),
    
    -- Computed scores
    profile_string VARCHAR(5) GENERATED ALWAYS AS (
        mobility::text || self_care::text || usual_activities::text || 
        pain_discomfort::text || anxiety_depression::text
    ) STORED,
    index_value DECIMAL(4,3), -- Calculated from crosswalk table (0-1 scale)
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRISE-M (Medication side effects - gender-specific)
CREATE TABLE responses_prise_m (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Gender for scoring logic
    gender VARCHAR(1) CHECK (gender IN ('M', 'F')),
    
    -- 32 items (0-2 scale)
    q1 INTEGER CHECK (q1 BETWEEN 0 AND 2), -- Diarrhée
    q2 INTEGER CHECK (q2 BETWEEN 0 AND 2), -- Constipation
    q3 INTEGER CHECK (q3 BETWEEN 0 AND 2), -- Bouche sèche
    q4 INTEGER CHECK (q4 BETWEEN 0 AND 2), -- Nausée, vomissement
    q5 INTEGER CHECK (q5 BETWEEN 0 AND 2), -- Palpitations
    q6 INTEGER CHECK (q6 BETWEEN 0 AND 2), -- Vertiges
    q7 INTEGER CHECK (q7 BETWEEN 0 AND 2), -- Douleurs dans la poitrine
    q8 INTEGER CHECK (q8 BETWEEN 0 AND 2), -- Augmentation de la transpiration
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 2), -- Démangeaisons
    q10 INTEGER CHECK (q10 BETWEEN 0 AND 2), -- Sécheresse de la peau
    q11 INTEGER CHECK (q11 BETWEEN 0 AND 2), -- Mal à la tête
    q12 INTEGER CHECK (q12 BETWEEN 0 AND 2), -- Tremblements
    q13 INTEGER CHECK (q13 BETWEEN 0 AND 2), -- Mauvais contrôle moteur
    q14 INTEGER CHECK (q14 BETWEEN 0 AND 2), -- Étourdissements
    q15 INTEGER CHECK (q15 BETWEEN 0 AND 2), -- Vision floue
    q16 INTEGER CHECK (q16 BETWEEN 0 AND 2), -- Acouphènes
    q17 INTEGER CHECK (q17 BETWEEN 0 AND 2), -- Difficultés pour uriner
    q18 INTEGER CHECK (q18 BETWEEN 0 AND 2), -- Mictions douloureuses
    q19 INTEGER CHECK (q19 BETWEEN 0 AND 2), -- Mictions fréquentes
    q20 INTEGER CHECK (q20 BETWEEN 0 AND 2), -- Règles irrégulières (femmes)
    q21 INTEGER CHECK (q21 BETWEEN 0 AND 2), -- Difficultés d'endormissement
    q22 INTEGER CHECK (q22 BETWEEN 0 AND 2), -- Augmentation du temps de sommeil
    q23 INTEGER CHECK (q23 BETWEEN 0 AND 2), -- Perte du désir sexuel
    q24 INTEGER CHECK (q24 BETWEEN 0 AND 2), -- Difficultés à atteindre un orgasme
    q25 INTEGER CHECK (q25 BETWEEN 0 AND 2), -- Troubles de l'érection (hommes)
    q26 INTEGER CHECK (q26 BETWEEN 0 AND 2), -- Anxiété
    q27 INTEGER CHECK (q27 BETWEEN 0 AND 2), -- Difficultés de concentration
    q28 INTEGER CHECK (q28 BETWEEN 0 AND 2), -- Malaise général
    q29 INTEGER CHECK (q29 BETWEEN 0 AND 2), -- Agitation
    q30 INTEGER CHECK (q30 BETWEEN 0 AND 2), -- Fatigue
    q31 INTEGER CHECK (q31 BETWEEN 0 AND 2), -- Diminution de l'énergie
    q32 INTEGER CHECK (q32 BETWEEN 0 AND 2), -- Prise de poids
    
    -- Section scores
    gastro_score INTEGER, -- q1-q4
    cardiac_score INTEGER, -- q5-q7
    skin_score INTEGER, -- q8-q10
    neuro_score INTEGER, -- q11-q14
    vision_hearing_score INTEGER, -- q15-q16
    urogenital_score INTEGER, -- q17-q20 (gender-aware)
    sleep_score INTEGER, -- q21-q22
    sexual_score INTEGER, -- q23-q25 (gender-aware)
    other_score INTEGER, -- q26-q32
    
    -- Total score (excludes gender-specific item)
    total_score INTEGER,
    items_scored INTEGER, -- 31 or 32 depending on gender
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STAI-YA (State anxiety)
CREATE TABLE responses_stai_ya (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 20 items (1-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 4),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 4),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 4),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 4),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 4),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 4),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 4),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 4),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 4),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 4),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 4),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 4),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 1 AND 4),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 1 AND 4),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 1 AND 4),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 1 AND 4),
    q17 INTEGER NOT NULL CHECK (q17 BETWEEN 1 AND 4),
    q18 INTEGER NOT NULL CHECK (q18 BETWEEN 1 AND 4),
    q19 INTEGER NOT NULL CHECK (q19 BETWEEN 1 AND 4),
    q20 INTEGER NOT NULL CHECK (q20 BETWEEN 1 AND 4),
    
    -- Scoring (with reverse scoring applied)
    total_score INTEGER,
    anxiety_level VARCHAR(20), -- 'low', 'moderate', 'high', 'very_high'
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MARS (Medication adherence)
CREATE TABLE responses_mars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 10 items (0=No, 1=Yes)
    q1 INTEGER NOT NULL CHECK (q1 IN (0, 1)),
    q2 INTEGER NOT NULL CHECK (q2 IN (0, 1)),
    q3 INTEGER NOT NULL CHECK (q3 IN (0, 1)),
    q4 INTEGER NOT NULL CHECK (q4 IN (0, 1)),
    q5 INTEGER NOT NULL CHECK (q5 IN (0, 1)),
    q6 INTEGER NOT NULL CHECK (q6 IN (0, 1)),
    q7 INTEGER NOT NULL CHECK (q7 IN (0, 1)),
    q8 INTEGER NOT NULL CHECK (q8 IN (0, 1)),
    q9 INTEGER NOT NULL CHECK (q9 IN (0, 1)),
    q10 INTEGER NOT NULL CHECK (q10 IN (0, 1)),
    
    -- Scoring (with item-specific recoding)
    total_score INTEGER CHECK (total_score BETWEEN 0 AND 10),
    adherence_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((total_score::DECIMAL / 10) * 100) STORED,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MAThyS (Multidimensional thymic states)
CREATE TABLE responses_mathys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 20 items (0-10 visual analog scale)
    q1 DECIMAL(3,1) NOT NULL CHECK (q1 BETWEEN 0 AND 10),
    q2 DECIMAL(3,1) NOT NULL CHECK (q2 BETWEEN 0 AND 10),
    q3 DECIMAL(3,1) NOT NULL CHECK (q3 BETWEEN 0 AND 10),
    q4 DECIMAL(3,1) NOT NULL CHECK (q4 BETWEEN 0 AND 10),
    q5 DECIMAL(3,1) NOT NULL CHECK (q5 BETWEEN 0 AND 10),
    q6 DECIMAL(3,1) NOT NULL CHECK (q6 BETWEEN 0 AND 10),
    q7 DECIMAL(3,1) NOT NULL CHECK (q7 BETWEEN 0 AND 10),
    q8 DECIMAL(3,1) NOT NULL CHECK (q8 BETWEEN 0 AND 10),
    q9 DECIMAL(3,1) NOT NULL CHECK (q9 BETWEEN 0 AND 10),
    q10 DECIMAL(3,1) NOT NULL CHECK (q10 BETWEEN 0 AND 10),
    q11 DECIMAL(3,1) NOT NULL CHECK (q11 BETWEEN 0 AND 10),
    q12 DECIMAL(3,1) NOT NULL CHECK (q12 BETWEEN 0 AND 10),
    q13 DECIMAL(3,1) NOT NULL CHECK (q13 BETWEEN 0 AND 10),
    q14 DECIMAL(3,1) NOT NULL CHECK (q14 BETWEEN 0 AND 10),
    q15 DECIMAL(3,1) NOT NULL CHECK (q15 BETWEEN 0 AND 10),
    q16 DECIMAL(3,1) NOT NULL CHECK (q16 BETWEEN 0 AND 10),
    q17 DECIMAL(3,1) NOT NULL CHECK (q17 BETWEEN 0 AND 10),
    q18 DECIMAL(3,1) NOT NULL CHECK (q18 BETWEEN 0 AND 10),
    q19 DECIMAL(3,1) NOT NULL CHECK (q19 BETWEEN 0 AND 10),
    q20 DECIMAL(3,1) NOT NULL CHECK (q20 BETWEEN 0 AND 10),
    
    -- Subscale scores
    emotional_hyperreactivity DECIMAL(4,2), -- Items with reverse scoring applied
    emotional_hyporeactivity DECIMAL(4,2),
    cognitive_speed DECIMAL(4,2),
    motor_activity DECIMAL(4,2),
    motivation DECIMAL(4,2),
    
    -- Total score
    total_score DECIMAL(5,2),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PSQI (Pittsburgh Sleep Quality Index)
CREATE TABLE responses_psqi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Time questions
    q1_bedtime TIME, -- Usual bedtime
    q2_minutes_to_sleep INTEGER CHECK (q2_minutes_to_sleep >= 0), -- Sleep latency
    q3_waketime TIME, -- Usual wake time
    q4_hours_sleep DECIMAL(3,1) CHECK (q4_hours_sleep >= 0 AND q4_hours_sleep <= 24),
    
    -- Sleep disturbances (0-3 scale)
    q5a INTEGER CHECK (q5a BETWEEN 0 AND 3), -- Can't get to sleep within 30 min
    q5b INTEGER CHECK (q5b BETWEEN 0 AND 3), -- Wake up in middle of night
    q5c INTEGER CHECK (q5c BETWEEN 0 AND 3), -- Have to get up to use bathroom
    q5d INTEGER CHECK (q5d BETWEEN 0 AND 3), -- Cannot breathe comfortably
    q5e INTEGER CHECK (q5e BETWEEN 0 AND 3), -- Cough or snore loudly
    q5f INTEGER CHECK (q5f BETWEEN 0 AND 3), -- Feel too cold
    q5g INTEGER CHECK (q5g BETWEEN 0 AND 3), -- Feel too hot
    q5h INTEGER CHECK (q5h BETWEEN 0 AND 3), -- Have bad dreams
    q5i INTEGER CHECK (q5i BETWEEN 0 AND 3), -- Have pain
    q5j INTEGER CHECK (q5j BETWEEN 0 AND 3), -- Other reasons
    q5j_text TEXT, -- Description of other reasons
    
    -- Global items
    q6 INTEGER CHECK (q6 BETWEEN 0 AND 3), -- Overall sleep quality
    q7 INTEGER CHECK (q7 BETWEEN 0 AND 3), -- Sleep medication use
    q8 INTEGER CHECK (q8 BETWEEN 0 AND 3), -- Trouble staying awake
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 3), -- Enthusiasm problem
    
    -- 7 Component scores (0-3 each)
    c1_subjective_quality INTEGER,
    c2_latency INTEGER,
    c3_duration INTEGER,
    c4_efficiency INTEGER,
    c5_disturbances INTEGER,
    c6_medication INTEGER,
    c7_daytime_dysfunction INTEGER,
    
    -- Computed values
    time_in_bed_hours DECIMAL(3,1),
    sleep_efficiency_pct DECIMAL(5,2),
    
    -- Total score
    total_score INTEGER CHECK (total_score BETWEEN 0 AND 21),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Epworth (Sleepiness Scale)
CREATE TABLE responses_epworth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 8 situation items (0-3 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3), -- Sitting and reading
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 3), -- Watching TV
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 3), -- Sitting inactive in public
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 3), -- Passenger in car
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 3), -- Lying down afternoon
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 3), -- Talking to someone
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 0 AND 3), -- Sitting after lunch
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 0 AND 3), -- In car stopped in traffic
    
    -- Optional clinical context
    q9 INTEGER CHECK (q9 BETWEEN 0 AND 3), -- When sleepiness occurs
    
    -- Scoring
    total_score INTEGER GENERATED ALWAYS AS (q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8) STORED,
    severity VARCHAR(50),
    clinical_context TEXT,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRAITS Section Questionnaires (9 new)
-- ============================================

-- 8. ASRS (Adult ADHD Self-Report Scale)
CREATE TABLE responses_asrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Part A: 6 screening items (0-4 scale)
    a1 INTEGER NOT NULL CHECK (a1 BETWEEN 0 AND 4),
    a2 INTEGER NOT NULL CHECK (a2 BETWEEN 0 AND 4),
    a3 INTEGER NOT NULL CHECK (a3 BETWEEN 0 AND 4),
    a4 INTEGER NOT NULL CHECK (a4 BETWEEN 0 AND 4),
    a5 INTEGER NOT NULL CHECK (a5 BETWEEN 0 AND 4),
    a6 INTEGER NOT NULL CHECK (a6 BETWEEN 0 AND 4),
    
    -- Part B: 12 additional items (0-4 scale)
    b7 INTEGER NOT NULL CHECK (b7 BETWEEN 0 AND 4),
    b8 INTEGER NOT NULL CHECK (b8 BETWEEN 0 AND 4),
    b9 INTEGER NOT NULL CHECK (b9 BETWEEN 0 AND 4),
    b10 INTEGER NOT NULL CHECK (b10 BETWEEN 0 AND 4),
    b11 INTEGER NOT NULL CHECK (b11 BETWEEN 0 AND 4),
    b12 INTEGER NOT NULL CHECK (b12 BETWEEN 0 AND 4),
    b13 INTEGER NOT NULL CHECK (b13 BETWEEN 0 AND 4),
    b14 INTEGER NOT NULL CHECK (b14 BETWEEN 0 AND 4),
    b15 INTEGER NOT NULL CHECK (b15 BETWEEN 0 AND 4),
    b16 INTEGER NOT NULL CHECK (b16 BETWEEN 0 AND 4),
    b17 INTEGER NOT NULL CHECK (b17 BETWEEN 0 AND 4),
    b18 INTEGER NOT NULL CHECK (b18 BETWEEN 0 AND 4),
    
    -- Scoring
    part_a_positive_items INTEGER, -- Count of items meeting threshold
    screening_positive BOOLEAN,
    total_score INTEGER,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CTQ (Childhood Trauma Questionnaire)
CREATE TABLE responses_ctq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 28 items (1-5 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 5),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 5),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 5),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 5),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 5),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 5),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 5),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 5),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 5),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 5),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 5),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 5),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 1 AND 5),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 1 AND 5),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 1 AND 5),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 1 AND 5),
    q17 INTEGER NOT NULL CHECK (q17 BETWEEN 1 AND 5),
    q18 INTEGER NOT NULL CHECK (q18 BETWEEN 1 AND 5),
    q19 INTEGER NOT NULL CHECK (q19 BETWEEN 1 AND 5),
    q20 INTEGER NOT NULL CHECK (q20 BETWEEN 1 AND 5),
    q21 INTEGER NOT NULL CHECK (q21 BETWEEN 1 AND 5),
    q22 INTEGER NOT NULL CHECK (q22 BETWEEN 1 AND 5),
    q23 INTEGER NOT NULL CHECK (q23 BETWEEN 1 AND 5),
    q24 INTEGER NOT NULL CHECK (q24 BETWEEN 1 AND 5),
    q25 INTEGER NOT NULL CHECK (q25 BETWEEN 1 AND 5),
    q26 INTEGER NOT NULL CHECK (q26 BETWEEN 1 AND 5),
    q27 INTEGER NOT NULL CHECK (q27 BETWEEN 1 AND 5),
    q28 INTEGER NOT NULL CHECK (q28 BETWEEN 1 AND 5),
    
    -- 5 Subscale scores (with reverse scoring applied)
    emotional_abuse_score INTEGER,
    emotional_abuse_severity VARCHAR(20),
    physical_abuse_score INTEGER,
    physical_abuse_severity VARCHAR(20),
    sexual_abuse_score INTEGER,
    sexual_abuse_severity VARCHAR(20),
    emotional_neglect_score INTEGER,
    emotional_neglect_severity VARCHAR(20),
    physical_neglect_score INTEGER,
    physical_neglect_severity VARCHAR(20),
    
    -- Denial/Minimization scale
    denial_score INTEGER,
    
    -- Total score
    total_score INTEGER,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BIS-10 (Barratt Impulsiveness Scale - short)
CREATE TABLE responses_bis10 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 12 items (1-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 4),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 4),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 4),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 4),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 4),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 4),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 4),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 4),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 4),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 4),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 4),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 4),
    
    -- Subscale means (not sums, due to unequal item counts)
    cognitive_impulsivity_mean DECIMAL(3,2),
    behavioral_impulsivity_mean DECIMAL(3,2),
    
    -- Overall score
    overall_impulsivity DECIMAL(3,2),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ALS-18 (Affective Lability Scale - short)
CREATE TABLE responses_als18 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 18 items (0-3 scale: D=0, C=1, B=2, A=3)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 3),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 3),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 3),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 3),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 3),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 0 AND 3),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 0 AND 3),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 0 AND 3),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 0 AND 3),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 0 AND 3),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 0 AND 3),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 0 AND 3),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 0 AND 3),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 0 AND 3),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 0 AND 3),
    q17 INTEGER NOT NULL CHECK (q17 BETWEEN 0 AND 3),
    q18 INTEGER NOT NULL CHECK (q18 BETWEEN 0 AND 3),
    
    -- 3 Subscale means
    anxiety_depression_mean DECIMAL(3,2),
    depression_elation_mean DECIMAL(3,2),
    anger_mean DECIMAL(3,2),
    
    -- Total score (mean)
    total_mean DECIMAL(3,2),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AIM (Affect Intensity Measure - short)
CREATE TABLE responses_aim (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 20 items (1-6 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 6),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 6),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 6),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 6),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 6),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 6),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 6),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 6),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 6),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 6),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 6),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 6),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 1 AND 6),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 1 AND 6),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 1 AND 6),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 1 AND 6),
    q17 INTEGER NOT NULL CHECK (q17 BETWEEN 1 AND 6),
    q18 INTEGER NOT NULL CHECK (q18 BETWEEN 1 AND 6),
    q19 INTEGER NOT NULL CHECK (q19 BETWEEN 1 AND 6),
    q20 INTEGER NOT NULL CHECK (q20 BETWEEN 1 AND 6),
    
    -- 3 Subscale scores
    positive_affectivity_mean DECIMAL(3,2),
    negative_intensity_mean DECIMAL(3,2),
    reactivity_mean DECIMAL(3,2),
    
    -- Total score
    total_mean DECIMAL(3,2),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WURS-25 (Wender Utah Rating Scale)
CREATE TABLE responses_wurs25 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 25 items (0-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 4),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 4),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 4),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 4),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 4),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 4),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 0 AND 4),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 0 AND 4),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 0 AND 4),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 0 AND 4),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 0 AND 4),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 0 AND 4),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 0 AND 4),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 0 AND 4),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 0 AND 4),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 0 AND 4),
    q17 INTEGER NOT NULL CHECK (q17 BETWEEN 0 AND 4),
    q18 INTEGER NOT NULL CHECK (q18 BETWEEN 0 AND 4),
    q19 INTEGER NOT NULL CHECK (q19 BETWEEN 0 AND 4),
    q20 INTEGER NOT NULL CHECK (q20 BETWEEN 0 AND 4),
    q21 INTEGER NOT NULL CHECK (q21 BETWEEN 0 AND 4),
    q22 INTEGER NOT NULL CHECK (q22 BETWEEN 0 AND 4),
    q23 INTEGER NOT NULL CHECK (q23 BETWEEN 0 AND 4),
    q24 INTEGER NOT NULL CHECK (q24 BETWEEN 0 AND 4),
    q25 INTEGER NOT NULL CHECK (q25 BETWEEN 0 AND 4),
    
    -- Scoring
    total_score INTEGER GENERATED ALWAYS AS (
        q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10 + 
        q11 + q12 + q13 + q14 + q15 + q16 + q17 + q18 + q19 + q20 + 
        q21 + q22 + q23 + q24 + q25
    ) STORED,
    adhd_likely BOOLEAN,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AQ-12 (Autism Quotient - short)
CREATE TABLE responses_aq12 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 12 items (1-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 4),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 4),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 4),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 4),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 4),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 4),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 4),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 4),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 4),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 4),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 4),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 4),
    
    -- Scoring (with item-specific scoring logic)
    total_score INTEGER,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CSM (Cognitive Style in Mania)
CREATE TABLE responses_csm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 12 items (1-4 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 4),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 4),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 4),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 4),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 4),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 4),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 4),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 4),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 4),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 4),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 4),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 1 AND 4),
    
    -- Scoring
    total_score INTEGER GENERATED ALWAYS AS (
        q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10 + q11 + q12
    ) STORED,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. CTI (Circadian Type Inventory)
CREATE TABLE responses_cti (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 11 items (1-5 scale)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 1 AND 5),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 1 AND 5),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 1 AND 5),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 1 AND 5),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 1 AND 5),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 1 AND 5),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 1 AND 5),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 1 AND 5),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 1 AND 5),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 1 AND 5),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 1 AND 5),
    
    -- Scoring (with reverse scoring for some items)
    total_score INTEGER,
    circadian_type VARCHAR(20), -- 'evening', 'intermediate', 'morning'
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE responses_eq5d5l ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_prise_m ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_stai_ya ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_mars ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_mathys ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_psqi ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_epworth ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_asrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_ctq ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_bis10 ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_als18 ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_aim ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_wurs25 ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_aq12 ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_csm ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_cti ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table (using a function to reduce repetition)
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'responses_eq5d5l', 'responses_prise_m', 'responses_stai_ya', 
        'responses_mars', 'responses_mathys', 'responses_psqi', 
        'responses_epworth', 'responses_asrs', 'responses_ctq', 
        'responses_bis10', 'responses_als18', 'responses_aim', 
        'responses_wurs25', 'responses_aq12', 'responses_csm', 'responses_cti'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        -- Patient policies
        EXECUTE format('CREATE POLICY "Patients view own %I" ON %I FOR SELECT USING (auth.uid() = patient_id)', table_name, table_name);
        EXECUTE format('CREATE POLICY "Patients insert own %I" ON %I FOR INSERT WITH CHECK (auth.uid() = patient_id)', table_name, table_name);
        EXECUTE format('CREATE POLICY "Patients update own %I" ON %I FOR UPDATE USING (auth.uid() = patient_id)', table_name, table_name);
        
        -- Professional policies
        EXECUTE format('CREATE POLICY "Pros view all %I" ON %I FOR SELECT USING (
            EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator''))
        )', table_name, table_name);
        EXECUTE format('CREATE POLICY "Pros insert %I" ON %I FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator''))
        )', table_name, table_name);
        EXECUTE format('CREATE POLICY "Pros update %I" ON %I FOR UPDATE USING (
            EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator''))
        )', table_name, table_name);
    END LOOP;
END $$;

-- ============================================
-- Triggers for updated_at timestamp
-- ============================================

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
DO $$
DECLARE
    table_name text;
    tables text[] := ARRAY[
        'responses_eq5d5l', 'responses_prise_m', 'responses_stai_ya', 
        'responses_mars', 'responses_mathys', 'responses_psqi', 
        'responses_epworth', 'responses_asrs', 'responses_ctq', 
        'responses_bis10', 'responses_als18', 'responses_aim', 
        'responses_wurs25', 'responses_aq12', 'responses_csm', 'responses_cti'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', table_name, table_name);
    END LOOP;
END $$;
