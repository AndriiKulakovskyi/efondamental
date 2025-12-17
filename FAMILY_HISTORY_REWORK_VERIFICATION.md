# Family History Questionnaire Rework - Verification

## Implementation Summary

The "Antécédents familiaux" questionnaire has been successfully reworked with three sections:
- **Section 1 - Enfants (Children)**: Support for up to 5 daughters and 5 sons with issues
- **Section 2 - Frères et Soeurs (Siblings)**: Support for up to 5 sisters and 5 brothers with issues
- **Section 3 - Parents**: Basic information about mother and father (history and death details)

## Changes Made

### 1. Database Migration
- **File**: `supabase/migrations/122_rework_family_history_children_only.sql`
- **Action**: DROP and recreate `responses_family_history` table
- **Structure**: Flat schema with:
  - **Section 1 - Enfants:**
    - `num_daughters` (VARCHAR: '0', '1'-'5', '>5')
    - `num_daughters_with_issues` (INTEGER: 0-5)
    - `daughter1_dob` through `daughter5_dob` (DATE)
    - `daughter1_has_issues` through `daughter5_has_issues` (BOOLEAN)
    - `daughter1_deceased` through `daughter5_deceased` (VARCHAR: 'oui', 'non')
    - `daughter1_death_date` through `daughter5_death_date` (DATE)
    - `daughter1_death_cause` through `daughter5_death_cause` (TEXT)
    - Same structure for sons (son1-son5)
  - **Section 2 - Frères et Soeurs:**
    - Same structure for sisters (sister1-sister5)
    - Same structure for brothers (brother1-brother5)
  - **Section 3 - Parents:**
    - `mother_history` (VARCHAR: 'oui', 'non', 'ne_sais_pas')
    - `mother_deceased` (VARCHAR: 'oui', 'non')
    - `mother_death_cause` (TEXT)
    - `father_history` (VARCHAR: 'oui', 'non', 'ne_sais_pas')
    - `father_deceased` (VARCHAR: 'oui', 'non')
    - `father_death_cause` (TEXT)

### 2. TypeScript Types
- **File**: `lib/types/database.types.ts`
- **Updated**: `FamilyHistoryResponse` interface to match new database schema
- **Removed**: All fields related to Mother, Father, Siblings, and Grandparents
- **Added**: Fields for daughters and sons (up to 5 each)

### 3. Questionnaire Definition
- **File**: `lib/constants/questionnaires-hetero.ts`
- **Replaced**: `FAMILY_HISTORY_QUESTIONS` array with new children-focused questions
- **Updated**: `FAMILY_HISTORY_DEFINITION` title and description
- **Removed**: createPsyAssessment helper function (no longer needed)

## Branching Logic Implementation

### Section 1 - Enfants (Children)

1. **Q1: Number of daughters** (Required)
   - Options: Aucune (0), 1, 2, 3, 4, 5, >5

2. **Q1.1: Number of daughters with issues** (Conditional)
   - Display condition: `{ and: [{ '!=': [{ var: 'num_daughters' }, null] }, { '!=': [{ var: 'num_daughters' }, '0'] }] }`
   - Options: Aucune (0), 1, 2, 3, 4, 5

3. **Q1.2.N: Daughter N details** (Repeating blocks 1-5)
   - Display condition: `{ '>=': [{ var: 'num_daughters_with_issues' }, N] }`
   - Questions per daughter:
     - Date of birth (DATE) - Label: "Fille N - Date de naissance"
     - Deceased? (SINGLE_CHOICE: Oui/Non) - Label: "Fille N - Décès"
     - If deceased == 'oui':
       - Death date (DATE) - Label: "Fille N - Date du décès"
       - Cause of death (TEXT) - Label: "Fille N - Cause du décès"

4. **Q2: Number of sons** (Required)
   - Same structure as daughters

5. **Q2.1: Number of sons with issues** (Conditional)
   - Same structure as daughters

6. **Q2.2.N: Son N details** (Repeating blocks 1-5)
   - Same structure as daughters with "Fils N" labels

### Section 2 - Frères et Soeurs (Siblings)

7. **Q3: Number of sisters** (Required)
   - Options: Aucune (0), 1, 2, 3, 4, 5, >5

8. **Q3.1: Number of sisters with issues** (Conditional)
   - Display condition: `{ and: [{ '!=': [{ var: 'num_sisters' }, null] }, { '!=': [{ var: 'num_sisters' }, '0'] }] }`
   - Options: Aucune (0), 1, 2, 3, 4, 5

9. **Q3.2.N: Sister N details** (Repeating blocks 1-5)
   - Display condition: `{ '>=': [{ var: 'num_sisters_with_issues' }, N] }`
   - Questions per sister:
     - Date of birth (DATE) - Label: "Soeur N - Date de naissance"
     - Deceased? (SINGLE_CHOICE: Oui/Non) - Label: "Soeur N - Décès"
     - If deceased == 'oui':
       - Death date (DATE) - Label: "Soeur N - Date du décès"
       - Cause of death (TEXT) - Label: "Soeur N - Cause du décès"

10. **Q4: Number of brothers** (Required)
    - Same structure as sisters

11. **Q4.1: Number of brothers with issues** (Conditional)
    - Same structure as sisters

12. **Q4.2.N: Brother N details** (Repeating blocks 1-5)
    - Same structure as sisters with "Frère N" labels

### Section 3 - Parents (Mère et Père)

13. **Q5: Mother** (Required)
    - Options: Oui, Non, Ne sais pas

14. **Q6: Mother - Death** (Required)
    - Options: Oui, Non

15. **Q6.1: Mother - Cause of death** (Conditional)
    - Display condition: `{ '==': [{ var: 'mother_deceased' }, 'oui'] }`
    - Type: Text input

16. **Q7: Father** (Required)
    - Options: Oui, Non, Ne sais pas

17. **Q8: Father - Death** (Required)
    - Options: Oui, Non

18. **Q8.1: Father - Cause of death** (Conditional)
    - Display condition: `{ '==': [{ var: 'father_deceased' }, 'oui'] }`
    - Type: Text input

## JSON Logic Operators Used

The questionnaire renderer supports all operators used in the new branching logic:
- `>=` - Greater than or equal (e.g., show daughter 3 if `num_daughters_with_issues >= 3`)
- `in` - Value in array (e.g., show Q1.1 if `num_daughters` is in ['1', '2', '3', '4', '5', '>5'])
- `and` - Logical AND (e.g., show death date if daughter has issues AND is deceased)
- `==` - Equality (e.g., check if `daughterN_deceased == true`)
- `var` - Variable reference (e.g., `{ var: 'num_daughters_with_issues' }`)

## Testing Checklist

### Manual Testing Steps

1. **Navigate to a screening visit**
   - Go to a patient's screening visit
   - Open the "Antécédents Familiaux" questionnaire

2. **Test daughter branching logic**
   - Set `num_daughters` to "0" → Q1.1 should NOT appear
   - Set `num_daughters` to "3" → Q1.1 should appear
   - Set `num_daughters_with_issues` to "0" → No daughter detail sections appear
   - Set `num_daughters_with_issues` to "2" → Sections for Daughter 1 and 2 appear only
   - Set `num_daughters_with_issues` to "5" → All 5 daughter sections appear

3. **Test death fields branching**
   - For Daughter 1, set `deceased` to false → Death date and cause should NOT appear
   - For Daughter 1, set `deceased` to true → Death date and cause fields should appear

4. **Test sons branching logic**
   - Repeat steps 2-3 for sons

5. **Test data persistence**
   - Fill out the form partially
   - Save the questionnaire
   - Reload the page
   - Verify all responses are preserved

6. **Test submission**
   - Complete the entire questionnaire
   - Submit
   - Verify no validation errors for required fields
   - Verify data is saved to database correctly

## Database Considerations

- **Data Loss**: The migration DROPs the existing table, so all previous responses are deleted
- **Rollback**: The table structure can be rolled back by rerunting the old migration, but data cannot be recovered
- **RLS Policies**: Maintained for both healthcare professionals and patients

## Service Layer

No changes needed to `lib/services/questionnaire-hetero.service.ts`:
- `getFamilyHistoryResponse()` works generically
- `saveFamilyHistoryResponse()` works generically
- No scoring logic needed for this questionnaire

## Frontend Integration

No changes needed - the following work automatically:
- `app/professional/questionnaires/actions.ts` - Generic handler
- Questionnaire renderer - Supports JSON Logic out of the box
- Visit detail pages - Reference the questionnaire by code

## Adjustments Made

### UI/UX Improvements
1. **Removed individual section headers**: Eliminated "Fille 1", "Fille 2", etc., and "Fils 1", "Fils 2", etc. section headers. All children now appear under the single "Section 1 - Enfants" header
2. **Changed "Décès" to dropdown**: Changed from checkbox (boolean) to dropdown selection (Oui/Non) for better consistency with other questions
3. **Updated question labels**: Added child identifiers to question labels (e.g., "Fille 1 - Date de naissance") for clarity

## Known Limitations

1. **Maximum 5 per category**: The flat structure supports up to 5 daughters, 5 sons, 5 sisters, and 5 brothers with issues
2. **">5" option**: If user selects ">5", they can still only enter details for up to 5 individuals per category
3. **No information storage for individuals without issues**: Only individuals with issues are tracked in detail

## Verification Status

- [x] Migration file created
- [x] TypeScript types updated
- [x] Questionnaire questions replaced
- [x] Questionnaire definition updated
- [x] No linter errors
- [x] Branching logic verified against JSON Logic implementation
- [ ] Manual testing in browser (requires running application)
- [ ] Database migration applied (requires Supabase access)

## Next Steps

1. Apply the migration: `supabase migration up 122_rework_family_history_children_only.sql`
2. Test the questionnaire in the browser following the testing checklist above
3. Verify data is correctly saved to the database
4. Update any documentation or user guides that reference the old questionnaire structure

