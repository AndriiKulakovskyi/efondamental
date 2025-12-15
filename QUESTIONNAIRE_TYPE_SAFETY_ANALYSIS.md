# Questionnaire Type Safety Analysis & Bug Prevention Guide

## Issue Summary

The DIVA questionnaire experienced a **type mismatch error** where:
- **UI Layer** was sending string values (`'oui'`, `'non'`)
- **Database Layer** expected boolean values (`true`, `false`)
- **Result**: PostgreSQL error `invalid input syntax for type boolean: "oui"`

This analysis identifies similar risks across the codebase and provides actionable recommendations.

---

## Root Cause Analysis

### 1. **Type Definition Mismatch**
```typescript
// TypeScript Interface (database.types.ts)
a1a_adult?: 'oui' | 'non' | null;  // String type

// Database Schema (029_add_diva_questionnaire.sql)
a1a_adult BOOLEAN,  // Boolean type
```

### 2. **Missing Transformation Layer**
The service layer did not handle conversion between:
- Frontend format: `'oui'` / `'non'` (strings)
- Database format: `true` / `false` (boolean)

### 3. **Migration Timing Issue**
Code changes were deployed before database migration was applied, causing immediate production errors.

---

## Identified Risks Across Codebase

### High Risk: Other Boolean Fields

#### 1. **DSM5 Comorbidities Questionnaire**
Location: `lib/constants/questionnaires-dsm5.ts`

**Issues Found:**
- 174 instances of `'oui'/'non'` options
- Multiple questions use `single_choice` with `code: 'oui'` and `code: 'non'`
- Database columns likely still BOOLEAN in some cases

**Example:**
```typescript
{
  id: 'has_anxiety_disorder',
  type: 'single_choice',
  options: [
    { code: 'oui', label: 'Oui' },
    { code: 'non', label: 'Non' }
  ]
}
```

**Fields to Check:**
- All `has_*_disorder` fields
- All `*_present` fields (e.g., `panic_disorder_present`, `agoraphobia_no_panic_present`)
- All `*_symptoms_past_month` fields
- All `*_amenorrhea` fields (recently converted from BOOLEAN to VARCHAR)

#### 2. **Nurse Questionnaires**
Location: `lib/constants/questionnaires-infirmier.ts`

**Issues Found:**
- 54 instances of `'Oui'/'Non'` labels
- Tobacco, alcohol, substance use questions
- May have boolean database columns

#### 3. **Social/Administrative Questionnaires**
Location: `lib/constants/questionnaires-social.ts`

**Issues Found:**
- 4 instances of `'Oui'/'Non'` patterns
- Binary choice questions that might be stored as boolean

### Medium Risk: Conditional Logic Dependencies

#### 1. **Conditional Questionnaire Display**
Location: `app/professional/[pathology]/patients/[id]/visits/[visitId]/page.tsx`

**Issues Found:**
- DIVA questionnaire depends on `diva_evaluated === 'oui'`
- Fagerstrom depends on tobacco use status
- If database stores as boolean but code checks for string, conditions fail

**Example:**
```typescript
const isDivaRequired = divaEvaluated === 'oui';  // Fails if DB returns true
```

#### 2. **JSONLogic Display Conditions**
Location: All questionnaire definitions with `display_if`

**Issues Found:**
- Conditional logic may compare strings to boolean values
- Example: `{ "==": [{ "var": "has_anxiety_disorder" }, "oui"] }`
- If database returns `true` instead of `"oui"`, condition fails

---

## Comprehensive Audit Checklist

### For Each Questionnaire:

- [ ] **TypeScript Interface** (`lib/types/database.types.ts`)
  - Check all fields marked as `'oui' | 'non'` or `boolean`
  - Ensure consistency across the interface

- [ ] **Database Schema** (migration files)
  - Identify all BOOLEAN columns
  - Check if they should be VARCHAR(10) or TEXT

- [ ] **Questionnaire Definition** (`lib/constants/questionnaires-*.ts`)
  - Review all `single_choice` questions with Oui/Non options
  - Check if `code` is string (`'oui'`) or boolean (`true`)

- [ ] **Service Layer** (`lib/services/questionnaire-*.service.ts`)
  - Verify transformation logic exists for save operations
  - Verify transformation logic exists for read operations
  - Handle both old (boolean) and new (string) formats

- [ ] **UI Components**
  - Check conditional rendering logic
  - Ensure string comparisons (`=== 'oui'`) work with actual data

- [ ] **Migration Scripts**
  - Ensure idempotent (can run multiple times)
  - Use `IF NOT EXISTS` for adding columns
  - Use `DROP COLUMN IF EXISTS` for removing columns
  - Include PostgREST cache refresh: `NOTIFY pgrst, 'reload schema';`

---

## Recommended Solutions

### Solution 1: Standardize on String Type (Recommended)

**Rationale:** The UI uses French text (`'oui'`, `'non'`), so storing as strings is more semantic.

**Steps:**
1. Update all BOOLEAN columns to VARCHAR(10)
2. Add transformation logic in service layer for backward compatibility
3. Test thoroughly before migration

**Example Migration:**
```sql
-- Convert boolean to string
ALTER TABLE responses_<table> 
ALTER COLUMN <field> TYPE VARCHAR(10) 
USING CASE 
  WHEN <field> = TRUE THEN 'oui'
  WHEN <field> = FALSE THEN 'non'
  ELSE NULL
END;

-- Refresh PostgREST cache
NOTIFY pgrst, 'reload schema';
SELECT pg_sleep(2);
NOTIFY pgrst, 'reload config';
```

### Solution 2: Standardize on Boolean Type

**Rationale:** Database booleans are more efficient and type-safe at DB level.

**Steps:**
1. Keep database columns as BOOLEAN
2. Add bidirectional transformation in ALL service layers
3. Update TypeScript interfaces to reflect database reality

**Example Service Code:**
```typescript
// Save: string → boolean
export async function save<Name>Response(response: <Name>ResponseInsert) {
  const transformed = { ...response };
  
  const stringFields = ['field1', 'field2', ...];
  for (const field of stringFields) {
    if (transformed[field] === 'oui') transformed[field] = true;
    else if (transformed[field] === 'non') transformed[field] = false;
  }
  
  // ... upsert transformed
}

// Read: boolean → string
export async function get<Name>Response(visitId: string) {
  const data = await supabase.from('responses_<table>').select('*')...;
  
  if (data) {
    const transformed = { ...data };
    const stringFields = ['field1', 'field2', ...];
    for (const field of stringFields) {
      if (transformed[field] === true) transformed[field] = 'oui';
      else if (transformed[field] === false) transformed[field] = 'non';
    }
    return transformed;
  }
  
  return data;
}
```

### Solution 3: Hybrid Approach (Current DIVA Implementation)

**Status:** ✅ Already implemented for DIVA

**Pros:**
- Works immediately without migration
- Handles both formats gracefully
- Backward compatible during transition

**Cons:**
- Adds complexity to service layer
- Needs to be replicated for each questionnaire
- Transformation logic must be maintained

---

## Priority Action Items

### Immediate (Critical)

1. **Audit DSM5 Comorbidities Table**
   - Check all boolean columns in `responses_dsm5_comorbid`
   - Identify which fields are used with `'oui'/'non'` in UI
   - Priority fields:
     - `has_anxiety_disorder`, `has_substance_disorder`, `has_eating_disorder`, `has_somatoform_disorder`
     - All `*_present` fields
     - All `*_symptoms_past_month` fields

2. **Check Nurse Questionnaires**
   - Tobacco questionnaire (`responses_tobacco`)
   - Alcohol questionnaire
   - Any fields with Oui/Non options

3. **Test Conditional Logic**
   - Test DIVA conditional display with actual data
   - Test Fagerstrom conditional display
   - Verify all `display_if` conditions work correctly

### Short-term (High Priority)

4. **Standardize All Questionnaires**
   - Choose Solution 1 (strings) or Solution 2 (booleans)
   - Create migration plan for all affected tables
   - Update all service layers with transformation logic

5. **Add Automated Tests**
   - Unit tests for service transformations
   - Integration tests for form submissions
   - E2E tests for conditional questionnaire display

6. **Documentation**
   - Update developer guidelines with type standards
   - Document transformation patterns
   - Add comments to complex transformation logic

### Long-term (Improvements)

7. **Type Safety Enhancements**
   - Use TypeScript branded types to enforce format
   - Create shared utility functions for transformations
   - Add runtime validation with Zod or similar

8. **Migration Safety**
   - Always test migrations on staging first
   - Create rollback scripts for each migration
   - Monitor for PostgREST cache issues

9. **Code Generation**
   - Consider generating TypeScript types from database schema
   - Use tools like Supabase CLI type generation
   - Automate service layer boilerplate

---

## Best Practices Going Forward

### 1. **Type Consistency Rule**
> For any binary choice field (Oui/Non, Yes/No):
> - Choose EITHER `BOOLEAN` in DB + transformation layer
> - OR `VARCHAR` in DB + string values throughout
> - NEVER mix without explicit transformation

### 2. **Migration Checklist**
- [ ] Write idempotent SQL (IF NOT EXISTS, IF EXISTS)
- [ ] Test on local Supabase instance first
- [ ] Apply to staging before production
- [ ] Include schema cache refresh commands
- [ ] Restart Supabase after complex schema changes
- [ ] Update TypeScript types immediately
- [ ] Update service layer transformations
- [ ] Test form submissions after migration

### 3. **Service Layer Pattern**
```typescript
// Always include transformation logic for format changes
export async function save<Name>Response(response: <Name>ResponseInsert) {
  const transformed = transformForDatabase(response);
  // ... save
}

export async function get<Name>Response(visitId: string) {
  const data = await fetch...;
  return transformForUI(data);
}
```

### 4. **Testing Strategy**
- Test with actual French text (`'oui'`, `'non'`)
- Test conditional logic with real database values
- Test both new and existing responses
- Test migration rollback scenarios

### 5. **Code Review Checklist**
- [ ] TypeScript interface matches database schema
- [ ] Service layer has transformation logic
- [ ] Migration is idempotent
- [ ] PostgREST cache refresh included
- [ ] Conditional logic tested with actual values
- [ ] No hardcoded type assumptions

---

## Specific Files Requiring Immediate Attention

### High Priority

1. **`lib/types/database.types.ts`**
   - Lines with `'oui' | 'non' | null` where DB might be BOOLEAN
   - All `*Response` interfaces with binary choice fields

2. **`lib/services/questionnaire-dsm5.service.ts`**
   - Add transformation logic like DIVA
   - Check `saveDsm5ComorbidResponse`, `saveDsm5HumeurResponse`, `saveDsm5PsychoticResponse`

3. **`lib/services/questionnaire-infirmier.service.ts`**
   - Check tobacco, alcohol service functions
   - Add transformations if needed

4. **All migration files with BOOLEAN columns**
   - Identify which need conversion to VARCHAR
   - Create comprehensive conversion migration

### Medium Priority

5. **`components/clinical/questionnaire-renderer.tsx`**
   - Ensure proper rendering of Oui/Non options
   - Check value mapping for single_choice

6. **`app/professional/questionnaires/actions.ts`**
   - Verify all submission actions handle types correctly
   - Add validation before service calls

---

## Monitoring & Validation

### After Each Change:

1. **Check Browser Console**
   - No TypeScript errors
   - No runtime type coercion warnings

2. **Check Server Logs**
   - No PostgreSQL type errors
   - No Supabase RPC errors

3. **Check Database**
   - Verify data is stored in expected format
   - Run sample queries to confirm types

4. **Test User Flow**
   - Fill out questionnaire completely
   - Submit and verify success
   - Load existing response and verify display
   - Test conditional logic triggers

---

## Summary

The DIVA questionnaire error revealed a **systemic type inconsistency pattern** across the codebase. This affects multiple questionnaires where:
- UI uses French string values (`'oui'`, `'non'`)
- Database may use BOOLEAN type (`true`, `false`)
- No transformation layer bridges the gap

**Recommended Immediate Action:**
1. Apply migrations 118 & 119 for DIVA (already fixed in code)
2. Audit all questionnaires for similar boolean/string mismatches
3. Implement transformation layers systematically
4. Standardize on one approach going forward

**Estimated Impact:**
- **High Risk**: DSM5 Comorbidities (~50 fields)
- **Medium Risk**: Nurse questionnaires (~15 fields)
- **Low Risk**: Social questionnaires (~5 fields)

**Total Affected Fields**: ~70-100 across all questionnaires

This is a manageable but important refactoring that will prevent future runtime errors and improve type safety across the entire application.

