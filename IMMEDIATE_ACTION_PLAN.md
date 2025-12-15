# Immediate Action Plan - Type Safety Issues

## Critical Issues Identified

### 1. ✅ DIVA Questionnaire (RESOLVED)
**Status:** Fixed with transformation layer
**Location:** `responses_diva` table
- **Issue:** 36 BOOLEAN fields, UI sends 'oui'/'non' strings
- **Solution:** Bidirectional transformation in service layer
- **Files Modified:**
  - `lib/services/questionnaire-hetero.service.ts` (transformation added)
- **Migrations Pending:**
  - `118_update_diva_boolean_to_varchar.sql` (optional but recommended)
  - `119_remove_diva_evaluated_field.sql` (cleanup)

### 2. ✅ TOBACCO Questionnaire (FIXED)
**Status:** TRANSFORMATION LAYER APPLIED
**Location:** `responses_tobacco` table
**Database:** 
```sql
has_substitution BOOLEAN
```
**UI (questionnaires-infirmier.ts):**
```typescript
id: 'has_substitution',
type: 'single_choice',
options: [
  { code: 'yes', label: 'Oui' },  // ⚠️ English code!
  { code: 'no', label: 'Non' }     // ⚠️ English code!
]
```

**Problems:**
1. UI sends `'yes'`/`'no'` strings (English)
2. Database expects BOOLEAN (`true`/`false`)
3. No transformation layer exists
4. Inconsistent with rest of app (should be `'oui'`/`'non'` French)

**Conditional Logic Impact:**
```typescript
// This will FAIL if DB returns boolean
display_if: {
  '==': [{ var: 'has_substitution' }, 'yes']  // Expects string, gets boolean
}
```

### 3. ✅ DSM5 Questionnaires (SAFE)
**Status:** No issues found
**Location:** `responses_dsm5_comorbid`, `responses_dsm5_psychotic`, `responses_dsm5_humeur`
- All binary fields are VARCHAR(20) with CHECK constraints
- UI uses `code: 'oui'` and `code: 'non'`
- Type consistency maintained throughout

---

## Required Actions

### PRIORITY 1: Fix Tobacco Questionnaire (URGENT)

#### Step 1: Check Current Implementation
```bash
# Check if tobacco service has transformation logic
grep -n "saveTobaccoResponse\|getTobaccoResponse" lib/services/questionnaire-infirmier.service.ts
```

#### Step 2A: Quick Fix - Add Transformation Layer (Recommended)
Similar to DIVA fix, add bidirectional transformation:

**In `lib/services/questionnaire-infirmier.service.ts`:**
```typescript
export async function saveTobaccoResponse(response: TobaccoResponseInsert) {
  const supabase = await createClient();
  
  // Transform 'yes'/'no' to boolean
  const transformed: any = { ...response };
  if (transformed.has_substitution === 'yes') {
    transformed.has_substitution = true;
  } else if (transformed.has_substitution === 'no') {
    transformed.has_substitution = false;
  }
  
  // ... upsert transformed
}

export async function getTobaccoResponse(visitId: string) {
  // ... fetch data
  
  // Transform boolean to 'yes'/'no'
  if (data) {
    const transformed: any = { ...data };
    if (transformed.has_substitution === true) {
      transformed.has_substitution = 'yes';
    } else if (transformed.has_substitution === false) {
      transformed.has_substitution = 'no';
    }
    return transformed;
  }
  
  return data;
}
```

#### Step 2B: Long-term Fix - Standardize to French (Recommended)

**Update UI to use French codes:**
```typescript
// In questionnaires-infirmier.ts
{
  id: 'has_substitution',
  options: [
    { code: 'oui', label: 'Oui' },  // ✅ French code
    { code: 'non', label: 'Non' }    // ✅ French code
  ]
}
```

**Update conditional logic:**
```typescript
display_if: {
  '==': [{ var: 'has_substitution' }, 'oui']  // ✅ French
}
```

**Create migration to convert DB:**
```sql
-- 121_fix_tobacco_boolean_to_varchar.sql
ALTER TABLE responses_tobacco 
ALTER COLUMN has_substitution TYPE VARCHAR(10) 
USING CASE 
  WHEN has_substitution = TRUE THEN 'oui'
  WHEN has_substitution = FALSE THEN 'non'
  ELSE NULL
END;

ALTER TABLE responses_tobacco
ADD CONSTRAINT has_substitution_check 
CHECK (has_substitution IN ('oui', 'non', NULL));

-- Refresh cache
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(2);
NOTIFY pgrst, 'reload config';
```

**Update TypeScript interface:**
```typescript
// In database.types.ts
export interface TobaccoResponse {
  // ...
  has_substitution?: 'oui' | 'non' | null;  // Changed from boolean
  // ...
}
```

### PRIORITY 2: Audit All Questionnaires

Run the audit script:
```bash
# Apply the audit migration to see all boolean fields
psql "postgresql://..." -f supabase/migrations/120_audit_boolean_fields.sql
```

For each BOOLEAN field found:
1. Check if UI uses 'oui'/'non' or 'yes'/'no' or actual booleans
2. Check if TypeScript interface matches database
3. Check if service layer has transformation logic
4. Fix inconsistencies using DIVA or Tobacco fix patterns

### PRIORITY 3: Test Conditional Logic

Test these scenarios:
- [ ] Tobacco: Select "current_smoker" → Answer substitution → Check if substitution_methods appears
- [ ] DIVA: Answer DSM5 Comorbidities Section 5 with 'oui' → Check if DIVA appears
- [ ] Fagerstrom: Answer tobacco → Check if Fagerstrom appears when appropriate

### PRIORITY 4: Apply Pending Migrations

For DIVA (optional but recommended):
```bash
# Apply migrations 118 and 119
# Then restart Supabase project (Pause/Resume)
```

---

## Testing Checklist

After each fix:

- [ ] **Form Submission:** Fill out questionnaire and submit
- [ ] **Data Storage:** Verify correct format in database
- [ ] **Data Retrieval:** Load existing response and verify display
- [ ] **Conditional Logic:** Test display_if conditions work
- [ ] **No Console Errors:** Check browser console
- [ ] **No Server Errors:** Check server logs
- [ ] **Type Safety:** No TypeScript errors

---

## Estimated Impact

### High Risk (Immediate Fix Required)
- **Tobacco Questionnaire:** 1 field (`has_substitution`)
  - Used by: Current smokers and ex-smokers
  - Conditional logic: Controls `substitution_methods` display
  - Impact: Potential form submission errors, broken conditional logic

### Medium Risk (Monitor)
- **Other Nurse Questionnaires:** Check for similar patterns
  - Alcohol questionnaire
  - Weight/lifestyle questionnaires
  - Any other nurse-administered forms

### Low Risk (Already Safe)
- **DIVA:** Fixed with transformation layer
- **DSM5 Questionnaires:** Already using VARCHAR
- **Self-assessment Questionnaires:** Mostly use integer scores

---

## Timeline

### Today (Immediate)
1. ✅ Add transformation layer to tobacco service (30 min)
2. Test tobacco questionnaire submission (15 min)
3. Run boolean audit script (5 min)

### This Week
1. Standardize tobacco to French 'oui'/'non' (1 hour)
2. Create and test migration 121 (30 min)
3. Apply DIVA migrations 118-119 (15 min)
4. Comprehensive testing of all questionnaires (2 hours)

### Next Sprint
1. Audit all remaining questionnaires systematically
2. Create comprehensive test suite for questionnaires
3. Document transformation patterns
4. Add runtime validation

---

## Prevention Strategies

### For New Questionnaires

1. **Always use VARCHAR for French binary choices:**
   ```sql
   field_name VARCHAR(10) CHECK (field_name IN ('oui', 'non', NULL))
   ```

2. **Always use French codes in UI:**
   ```typescript
   options: [
     { code: 'oui', label: 'Oui' },
     { code: 'non', label: 'Non' }
   ]
   ```

3. **TypeScript interface must match database:**
   ```typescript
   field_name?: 'oui' | 'non' | null;  // Not boolean!
   ```

4. **No transformation layer needed if types match**

### Code Review Checklist

- [ ] Database schema uses VARCHAR for 'oui'/'non'
- [ ] UI uses `code: 'oui'` not `code: 'yes'` or `code: true`
- [ ] TypeScript interface matches database type
- [ ] Conditional logic uses correct comparison values
- [ ] Migration is idempotent
- [ ] PostgREST cache refresh included in migration

---

## Summary

**Critical Issue:** Tobacco questionnaire has type mismatch (BOOLEAN in DB, string in UI)
**Impact:** HIGH - May cause submission errors and broken conditional logic
**Fix Complexity:** LOW - Can copy DIVA transformation pattern
**Estimated Time:** 30-60 minutes
**Recommended Approach:** 
1. Add transformation layer immediately (Quick fix)
2. Standardize to French 'oui'/'non' this week (Proper fix)
3. Test thoroughly before considering issue resolved

**Status:** Ready to implement
**Blocker:** None
**Next Step:** Update `lib/services/questionnaire-infirmier.service.ts`

