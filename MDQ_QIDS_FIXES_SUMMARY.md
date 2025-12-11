# MDQ and QIDS-SR16 Questionnaire Fixes

## ⚠️ IMPORTANT: Migration Required

**The MDQ questionnaire will NOT work until you apply the database migration!**

The code changes have been made, but the database schema must be updated for the MDQ fix to take effect. See [Section 3: How to Apply the Migration](#3-how-to-apply-the-migration) below.

The QIDS-SR16 fix is already effective (no migration needed).

---

## Summary

This document describes the fixes applied to resolve scoring issues in the MDQ and QIDS-SR16 questionnaires.

---

## 1. QIDS-SR16 Scoring Fix

### Issue
The QIDS-SR16 scoring algorithm was incorrect. Q4 (Sommeil excessif) was being added individually to the total score instead of being included in the sleep domain maximum calculation.

### Correct Scoring Formula
**Maximum of (Q1, Q2, Q3, Q4) + Q5 + Maximum of (Q6, Q7, Q8, Q9) + Q10 + Q11 + Q12 + Q13 + Q14 + Maximum of (Q15, Q16)**

### Changes Made

**File: `lib/services/questionnaire.service.ts`**
- Updated `saveQidsResponse()` function (lines 115-123)
- Changed sleep score from `max(Q1, Q2, Q3)` to `max(Q1, Q2, Q3, Q4)`
- Combined appetite and weight into one maximum group: `max(Q6, Q7, Q8, Q9)`
- Total score calculation now correctly reflects the QIDS-SR16 methodology

```typescript
// Before (INCORRECT):
const sleepScore = Math.max(response.q1, response.q2, response.q3);
const appetiteScore = Math.max(response.q6, response.q7);
const weightScore = Math.max(response.q8, response.q9);
const totalScore = sleepScore + response.q4 + response.q5 + appetiteScore + weightScore + ...

// After (CORRECT):
const sleepScore = Math.max(response.q1, response.q2, response.q3, response.q4);
const appetiteWeightScore = Math.max(response.q6, response.q7, response.q8, response.q9);
const totalScore = sleepScore + response.q5 + appetiteWeightScore + ...
```

**Total Score Range:** 0-27 (unchanged)

---

## 2. MDQ Questionnaire Fix

### Issues
1. **Database Schema Mismatch:** Questions q1_1 through q1_13 and q2 were defined as BOOLEAN in the database but were being sent as INTEGER (0/1) from the frontend
2. **Missing Columns:** The `q1_score` and `interpretation` columns were missing from the database
3. **Obsolete Column:** The `positive_screen` column existed but was not being used

### Correct Scoring Algorithm

**Cotation:**
- Questions 1.1 to 1.13: Oui=1, Non=0
- Questions 2 and 3: Not included in scoring algorithm

**Q1 Score:** Sum of 13 items (0-13)

**MDQ Result:**
- **POSITIVE** if: Q1 Score ≥ 7 AND Q2 = "Oui" (1) AND Q3 ≥ 2 ("Problème moyen" or "Problème sérieux")
- **NEGATIVE** otherwise

### Changes Made

#### Database Migration: `112_fix_mdq_scoring_columns.sql`

1. **Convert BOOLEAN to INTEGER:** All q1_1 through q1_13 and q2 columns
   - BOOLEAN TRUE → INTEGER 1
   - BOOLEAN FALSE → INTEGER 0
   - Added CHECK constraints to ensure values are 0 or 1

2. **Add Missing Columns:**
   - `q1_score INTEGER` - stores the sum of Q1 items (0-13)
   - `interpretation TEXT` - stores the result text

3. **Remove Obsolete Column:**
   - Dropped `positive_screen` column

4. **Ensure Constraints:**
   - Unique constraint on `visit_id` for upsert operations
   - Check constraint on `q1_score` (0-13 range)

#### Service Layer: `lib/services/questionnaire.service.ts`

**Updated `saveMdqResponse()` function (lines 166-195):**
- Removed `|| 0` fallbacks (values are now guaranteed to be 0 or 1)
- Fixed interpretation text to be more explicit: "MDQ Positif/Négatif"
- Corrected scoring logic to match requirements

```typescript
// Calculate Q1 Score (sum of 13 items)
const q1Score = response.q1_1 + response.q1_2 + ... + response.q1_13;

// MDQ POSITIVE if: Q1 >= 7 AND Q2 = 1 AND Q3 >= 2
const isPositive = q1Score >= 7 && response.q2 === 1 && (response.q3 !== null && response.q3 >= 2);
const interpretation = isPositive ? 
  'MDQ Positif - Dépistage positif pour trouble bipolaire' : 
  'MDQ Négatif - Dépistage négatif pour trouble bipolaire';
```

#### Frontend: `score-display.tsx`

Updated to use new `interpretation` and `q1_score` fields instead of `positive_screen`:

1. **Severity Calculation (line 47):**
   - Now checks `interpretation` field or calculates from `q1_score`

2. **Interpretation Display (line 102):**
   - Uses `data.interpretation` field directly

3. **Score Display (line 175):**
   - Checks `interpretation.includes('Positif')` instead of `positive_screen`

4. **MDQ Details (line 132):**
   - Uses `q1_score` if available, otherwise calculates from individual items
   - Fixed to handle INTEGER values (0/1) instead of BOOLEAN

5. **Q2 Display (line 225):**
   - Changed from `data.q2 ? 'Oui' : 'Non'` to `data.q2 === 1 ? 'Oui' : 'Non'`

#### TypeScript Types: `lib/types/database.types.ts`

**Already Correct:** The types were already defined with INTEGER (number) types for all MDQ fields, which is why the mismatch occurred with the BOOLEAN database schema.

---

## 3. How to Apply the Migration

The migration file has been created but **NOT YET APPLIED** to the database. You need to run the migration to fix the MDQ questionnaire.

### Option A: Using Supabase CLI (Recommended)

If you have a local Supabase instance running:

```bash
npx supabase migration up
```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/112_fix_mdq_scoring_columns.sql`
4. Execute the SQL

### Option C: Using Database URL

If you have a DATABASE_URL environment variable set:

```bash
npx supabase db push --db-url "$DATABASE_URL"
```

---

## 4. Testing

After applying the migration, test the following:

### QIDS-SR16 Test
1. Fill out a QIDS-SR16 questionnaire
2. Verify the total score calculation is correct (max 27)
3. Check that sleep domain uses max(Q1-Q4) not max(Q1-Q3) + Q4

### MDQ Test
1. Fill out an MDQ questionnaire with:
   - At least 7 "Oui" answers in Q1 (e.g., all 13)
   - Q2 = "Oui"
   - Q3 = "Problème sérieux"
2. Verify it shows as "MDQ Positif" / "POSITIF"
3. Verify Q1 score shows correctly (e.g., 13/13)
4. Test a negative case: fewer than 7 "Oui" in Q1
5. Verify it shows as "MDQ Négatif" / "NÉGATIF"

---

## 5. Files Modified

### Database
- `supabase/migrations/112_fix_mdq_scoring_columns.sql` (NEW)

### Backend Services
- `lib/services/questionnaire.service.ts` (saveQidsResponse, saveMdqResponse)

### Frontend Components
- `app/professional/[pathology]/patients/[id]/visits/[visitId]/components/score-display.tsx`

### Constants (No Changes Needed)
- `lib/constants/questionnaires.ts` - Already correctly defined with INTEGER scoring

### Types (No Changes Needed)
- `lib/types/database.types.ts` - Already correctly defined with number types

---

## 6. Error Resolution

The errors you're seeing in the terminal:

```
Failed to submit questionnaire: {
  code: 'PGRST204',
  message: "Could not find the 'interpretation' column of 'responses_mdq' in the schema cache"
}
```

or

```
Failed to submit questionnaire: {
  code: 'PGRST204',
  message: "Could not find the 'total_score' column of 'responses_mdq' in the schema cache"
}
```

**These errors occur because:**
1. The migration has not been applied yet
2. The code is trying to use new columns (`q1_score`, `interpretation`) that don't exist in the current database schema
3. PostgREST (Supabase's API layer) has cached the old schema

**Resolution:**
Apply the migration `112_fix_mdq_scoring_columns.sql` to your database. Once applied:
- The MDQ questionnaire will work correctly
- The schema cache will be updated
- All errors will be resolved

---

## Notes

- The QIDS-SR16 fix is **immediately effective** (no migration needed)
- The MDQ fix **requires running the migration** before it will work
- All existing MDQ responses will have their BOOLEAN values converted to INTEGER (1/0) automatically during migration
- The `q1_score` and `interpretation` fields will be NULL for existing records until they are recalculated
- Consider running a script to recalculate scores for existing MDQ responses after migration
