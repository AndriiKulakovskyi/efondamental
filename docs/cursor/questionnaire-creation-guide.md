# eFondaMental Questionnaire Creation Guide

This guide details the step-by-step process for adding a new questionnaire to the eFondaMental platform, ensuring full integration across the database, backend, and frontend.

---

## 1. Database Layer (Supabase)

Each questionnaire requires its own dedicated table to ensure type safety and data integrity.

### 1.1 Create Migration File
Create a new migration file in `supabase/migrations/`, e.g., `012_add_new_questionnaire.sql`.

### 1.2 Define the Table
Create a table named `responses_<questionnaire_code>` (lowercase).

```sql
-- Example: GAD-7 (Generalized Anxiety Disorder-7)
CREATE TABLE responses_gad7 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE, -- UNIQUE is critical for upsert!
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Questions (Strict Types & Constraints)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 3),
    -- ... add all questions ...

    -- Scores & Metadata
    total_score INTEGER GENERATED ALWAYS AS (q1 + q2 + ...) STORED, -- Use computed columns if logic is simple
    interpretation TEXT,
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 Enable RLS & Policies
**Crucial:** Define policies for both Patients (if applicable) and Professionals.

```sql
ALTER TABLE responses_gad7 ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own GAD7" ON responses_gad7 FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own GAD7" ON responses_gad7 FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own GAD7" ON responses_gad7 FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies (Don't forget INSERT/UPDATE!)
CREATE POLICY "Pros view all GAD7" ON responses_gad7 FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Pros insert GAD7" ON responses_gad7 FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Pros update GAD7" ON responses_gad7 FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
```

---

## 2. TypeScript Definitions

Define the structure of the questionnaire content (questions, options, labels) in code.

### 2.1 Add Questions Constant
Edit `lib/constants/questionnaires.ts`:

```typescript
export const GAD7_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Feeling nervous, anxious, or on edge',
    type: 'single_choice', // Use 'single_choice' for radio buttons
    required: true,
    options: [
      { code: 0, label: "Not at all", score: 0 },
      { code: 1, label: "Several days", score: 1 },
      { code: 2, label: "More than half the days", score: 2 },
      { code: 3, label: "Nearly every day", score: 3 }
    ]
  },
  // ...
];

export const GAD7_DEFINITION: QuestionnaireDefinition = {
  id: 'gad7',
  code: 'GAD7_FR', // Must match string used in DB/Service logic
  title: 'Generalized Anxiety Disorder (GAD-7)',
  description: 'Screening for anxiety...',
  questions: GAD7_QUESTIONS
};
```

### 2.2 Update Types
Update `lib/types/database.types.ts` to include the new response interface matching your DB table.

```typescript
export interface Gad7Response {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  // ...
  total_score?: number;
  interpretation?: string | null;
  completed_at: string;
}

export type Gad7ResponseInsert = Omit<Gad7Response, 'id' | 'created_at' | ... >;
```

---

## 3. Service Layer

Implement the logic to fetch and save responses.

### 3.1 Update `lib/services/questionnaire.service.ts`

1.  **Add Fetch Function:**
    ```typescript
    export async function getGad7Response(visitId: string): Promise<Gad7Response | null> {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('responses_gad7') // Your new table
        .select('*')
        .eq('visit_id', visitId)
        .single();
      // ... handle error ...
      return data;
    }
    ```

2.  **Add Save Function (with Scoring Logic):**
    ```typescript
    export async function saveGad7Response(response: Gad7ResponseInsert): Promise<Gad7Response> {
      const supabase = await createClient();
      
      // Calculate complex scores here if not done by DB
      const score = response.q1 + response.q2 + ...;
      let interpretation = score >= 10 ? "Moderate Anxiety" : "Low Anxiety";

      const { data, error } = await supabase
        .from('responses_gad7')
        .upsert({
          ...response,
          interpretation
        }, { onConflict: 'visit_id' }) // Ensure UNIQUE constraint exists on visit_id!
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
    ```

### 3.2 Register in `getVisitModules` (Visit Service)
Update `lib/services/visit.service.ts` -> `getVisitModules` to include the new questionnaire in the appropriate visit type (e.g., 'screening' or 'followup').

```typescript
if (visit.visit_type === 'screening') {
  return [
    {
      id: 'mod_auto',
      // ...
      questionnaires: [ASRM_DEFINITION, GAD7_DEFINITION, ...] // Add definition here
    }
  ];
}
```

---

## 4. Server Actions

Connect the frontend submission to the backend service.

### 4.1 Update `app/professional/questionnaires/actions.ts` (and patient equivalent)

Add a case for the new questionnaire code in `submitProfessionalQuestionnaireAction`.

```typescript
switch (questionnaireCode) {
  case 'GAD7_FR':
    result = await saveGad7Response({
      visit_id: visitId,
      patient_id: patientId,
      ...responses as any
    } as Gad7ResponseInsert);
    break;
  // ...
}
```

---

## 5. Frontend (Score Display)

If the questionnaire produces a score, update the display component.

### 5.1 Update `components/score-display.tsx` (or path-specific version)

```typescript
export function ScoreDisplay({ code, data }: ScoreDisplayProps) {
  const getSeverity = () => {
    // ... existing cases
    if (code === 'GAD7_FR') {
      if (data.total_score >= 15) return 'error';
      if (data.total_score >= 10) return 'warning';
      return 'success';
    }
    return 'info';
  };
  // ...
}
```

---

## Checklist for New Questionnaire

- [ ] **Migration:** Table created with constraints & `visit_id` UNIQUE.
- [ ] **Policies:** RLS enabled, policies for Patient (Select/Insert/Update) AND Professional (Select/Insert/Update).
- [ ] **Constants:** Questions defined in `lib/constants/questionnaires.ts`.
- [ ] **Types:** Interface added to `lib/types/database.types.ts`.
- [ ] **Service:** Get/Save functions in `questionnaire.service.ts`.
- [ ] **Visit Logic:** Added to `getVisitModules` in `visit.service.ts`.
- [ ] **Action:** Added case to `submit...Action`.
- [ ] **Page:** Added definition mapping in `app/.../page.tsx` (usually dynamic, just ensure `DEFINITION` is imported).
- [ ] **Score:** Logic added to `ScoreDisplay` (if applicable).

