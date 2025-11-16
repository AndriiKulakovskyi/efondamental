# Healthcare Professional Workflow - Testing Guide

## Overview
This document guides you through testing the complete Healthcare Professional workflow in eFondaMental.

## Prerequisites
1. Database migrations 003 and 004 must be run in Supabase
2. Login as a healthcare professional user (e.g., `doctor.paris@fondamental.fr`)

## Complete Workflow Test

### 1. Login & Pathology Selection
1. Navigate to `/auth/login`
2. Login with healthcare professional credentials
3. You should land on `/professional` showing pathology cards
4. Click on "Bipolar Disorder" card
5. Expected: Navigate to `/professional/bipolar`

### 2. Dashboard Verification
On `/professional/bipolar`, verify:
- [x] Total Patients stat card displays
- [x] Upcoming Visits stat card displays
- [x] Requiring Follow-up stat card displays
- [x] Notifications panel appears if there are high-risk patients
- [x] Upcoming Visits list shows scheduled visits
- [x] Patients Requiring Follow-up list shows flagged patients
- [x] Sidebar navigation with active states (Dashboard, Patients, Statistics)
- [x] "Back to Pathologies" link in sidebar

### 3. Create New Patient
1. Click "New Patient" button
2. Fill out the form:
   - First Name: Jean
   - Last Name: Dupont  
   - Date of Birth: 1985-05-15
   - Medical Record Number: **MRN-BIPOLAR-001** (must be unique!)
   - Gender: Male
   - Email: jean.dupont@example.com
   - Phone: +33612345678
   - Address: 123 Rue de la Paix, Paris
   - Emergency Contact Name: Marie Dupont
   - Emergency Contact Phone: +33687654321
   - Emergency Contact Relationship: Spouse
3. Click "Create Patient"
4. Expected: Redirect to patient detail page `/professional/bipolar/patients/{id}`

**Note**: If you get "A patient with this Medical Record Number already exists", use a different MRN like MRN-BIPOLAR-002, etc.

### 4. Patient Detail Page
Verify all tabs work:

#### Overview Tab
- [x] Patient information card (name, DOB, age, gender, pathology)
- [x] Contact information card (email, phone, address)
- [x] Emergency contact card
- [x] Risk level alert (if applicable)
- [x] Stats: Total Visits, Completed, Upcoming, Risk Level
- [x] Breadcrumb navigation

#### Visits Tab
- [x] Visit history list (empty for new patient)
- [x] "Schedule New Visit" button
- [x] "Schedule First Visit" link if no visits exist

#### Evaluations Tab
- [x] Clinical evaluations timeline (empty for new patient)
- [x] Message: "No clinical evaluations recorded yet"

#### Analytics Tab
- [x] Mood Trend chart (empty for new patient)
- [x] Risk Assessment History chart (empty for new patient)
- [x] Medication Adherence chart (empty for new patient)

### 5. Schedule a Visit
1. Click "Schedule Visit" button
2. Select Visit Type: "Screening Visit"
3. Set Scheduled Date: Tomorrow's date + time
4. Add Notes: "Initial screening for eBipolar program"
5. Click "Schedule Visit"
6. Expected: Redirect to visit detail page `/professional/bipolar/patients/{id}/visits/{visitId}`

### 6. Visit Detail Page
Verify:
- [x] Visit template name displayed
- [x] Patient name and scheduled date shown
- [x] Status badge shows "Scheduled"
- [x] "Start Visit" button visible
- [x] Dropdown menu with "Reschedule" and "Cancel Visit" options
- [x] Progress bar at 0%
- [x] Clinical modules list with questionnaires
- [x] Each questionnaire shows "Fill" button

### 7. Start Visit
1. Click "Start Visit" button
2. Expected: 
   - Status changes to "In Progress"
   - Button changes to "Complete Visit"
   - Page refreshes automatically

### 8. Fill Questionnaires
For each questionnaire in the visit:
1. Click "Fill" button
2. Answer all required questions (marked with *)
3. Click "Save Progress" (optional - to test auto-save)
4. Click "Submit Questionnaire"
5. Expected: Return to visit detail page
6. Verify: Questionnaire shows green checkmark and "Completed" status
7. Progress bar updates

### 9. Complete All Questionnaires
Repeat step 8 for all questionnaires in all modules until progress shows 100%

### 10. Complete Visit
1. Once all questionnaires are completed (100% progress)
2. Click "Complete Visit" button
3. Expected: 
   - Visit status changes to "Completed"
   - Redirect to patient detail page
   - Visit appears in Visits tab with green "completed" badge

### 11. Verify Patient List
1. Navigate to `/professional/bipolar/patients`
2. Verify:
   - [x] Search box at top
   - [x] Filter button (click to show filters)
   - [x] Patient appears in table
   - [x] Columns: Name (clickable), MRN, Age, Gender, Status
   - [x] Quick action buttons (View, Schedule Visit)
   - [x] "Export to CSV" button works
   - [x] Search by name or MRN works
   - [x] Filters work (age range, etc.)

### 12. Test Advanced Search
1. Type patient name in search box
2. Expected: Autocomplete dropdown appears after 2 characters
3. Click a search result
4. Expected: Navigate to that patient's detail page

### 13. Statistics Dashboard
1. Navigate to `/professional/bipolar/statistics`
2. Verify:
   - [x] "Your Performance" section with 4 stat cards
   - [x] Visit Type Breakdown showing visit counts
   - [x] Pending Work alert (if applicable)
   - [x] Center Overview section with stats
   - [x] Pathology Distribution breakdown

### 14. Test Visit Actions
For a scheduled visit:
1. Test Reschedule:
   - Click dropdown → "Reschedule"
   - Select new date
   - Click "Reschedule"
   - Verify: Visit date updated

2. Test Cancel:
   - Click dropdown → "Cancel Visit"
   - Confirm cancellation
   - Verify: Status changes to "Cancelled"

### 15. Navigation Test
1. Verify sidebar active states:
   - Dashboard: Active when on `/professional/bipolar`
   - Patients: Active when on `/professional/bipolar/patients/*`
   - Statistics: Active when on `/professional/bipolar/statistics`
2. Click "Back to Pathologies" → should go to `/professional`
3. Breadcrumbs work on patient detail pages

## Expected Results

✅ **All workflows should complete without errors**
✅ **Data persists correctly in database**
✅ **Navigation works smoothly**
✅ **UI is responsive and professional**
✅ **Error messages are clear and helpful**

## Known Limitations

1. **Risk Level Calculation**: Currently requires evaluations to be completed (via questionnaire responses)
2. **Analytics Charts**: Will be empty until evaluations with mood/adherence data are created
3. **Duplicate MRN**: System correctly prevents duplicate Medical Record Numbers
4. **Empty States**: New patients show helpful empty state messages

## Troubleshooting

### "A patient with this Medical Record Number already exists"
- **Solution**: Use a unique MRN. Try MRN-BIPOLAR-XXX where XXX is a unique number

### "Failed to fetch evaluations"
- **Solution**: This has been fixed. Refresh the page if you still see it.

### Module not found errors
- **Solution**: Restart the dev server: `npm run dev`

### Build errors with auth/invite page
- **Solution**: This is a pre-existing issue, not related to the healthcare workflow

## Database Queries to Verify Data

After testing, verify data in Supabase SQL Editor:

```sql
-- Check patients
SELECT id, first_name, last_name, medical_record_number, active 
FROM patients 
WHERE medical_record_number LIKE 'MRN-BIPOLAR-%';

-- Check visits
SELECT v.id, p.first_name, p.last_name, v.visit_type, v.status, v.scheduled_date
FROM visits v
JOIN patients p ON v.patient_id = p.id
WHERE p.medical_record_number LIKE 'MRN-BIPOLAR-%'
ORDER BY v.scheduled_date DESC;

-- Check questionnaire responses
SELECT qr.id, q.title, qr.status, qr.completed_at
FROM questionnaire_responses qr
JOIN questionnaires q ON qr.questionnaire_id = q.id
JOIN visits v ON qr.visit_id = v.id
JOIN patients p ON v.patient_id = p.id
WHERE p.medical_record_number LIKE 'MRN-BIPOLAR-%';

-- Check visit templates
SELECT vt.name, vt.visit_type, path.name as pathology, 
       (SELECT COUNT(*) FROM modules WHERE visit_template_id = vt.id) as module_count
FROM visit_templates vt
JOIN pathologies path ON vt.pathology_id = path.id
ORDER BY path.name, vt.visit_type;
```

## Success Criteria

The Healthcare Professional workflow is fully functional if:
1. ✅ Can create patients with unique MRNs
2. ✅ Can schedule visits using templates
3. ✅ Can start, complete, cancel, and reschedule visits
4. ✅ Can fill out questionnaires with various question types
5. ✅ Visit completion validates all questionnaires are done
6. ✅ Search and filtering work properly
7. ✅ All tabs (Overview, Visits, Evaluations, Analytics) display correctly
8. ✅ Statistics dashboard shows meaningful data
9. ✅ Navigation is smooth with proper active states
10. ✅ Notifications appear for patients requiring follow-up

