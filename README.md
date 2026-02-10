# eFondaMental Platform

A unified clinical management platform for longitudinal follow-up of patients with major psychiatric disorders, developed in partnership with the FondaMental Foundation.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [User Roles](#user-roles)
- [User Stories - Bipolar Pathology](#user-stories---bipolar-pathology)
- [Questionnaires - Bipolar Pathology](#questionnaires---bipolar-pathology)
- [Dependencies](#dependencies)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Security & GDPR](#security--gdpr)
- [Development](#development)

---

## Overview

eFondaMental is a multi-center platform designed to support the management of patients with major psychiatric disorders:

- **Bipolar Disorder** (implementation completed, in testing)
- **Schizophrenia** (implementation in progress)
- **Autism Spectrum Disorder - Asperger** (planned)
- **Depression** (planned)

The platform implements a federated multi-center model with strict data isolation, role-based access control (RBAC), and comprehensive clinical workflows including structured visit templates, validated questionnaires, and neuropsychological assessments.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 15)                  │
│  ┌─────────────┬──────────────┬──────────────┬────────────┐ │
│  │   Admin     │   Manager    │ Professional │  Patient   │ │
│  │  Dashboard  │   Dashboard  │   Dashboard  │   Portal   │ │
│  └─────────────┴──────────────┴──────────────┴────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API Routes)           │
│  • Authentication     • User Provisioning                   │
│  • Patient Management • Visit Management                    │
│  • Questionnaires     • Data Export                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer (TypeScript)               │
│  • questionnaire.service.ts  • patient.service.ts           │
│  • visit.service.ts          • user-provisioning.service.ts │
│  • auth.service.ts           • email.service.ts             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (Supabase/PostgreSQL)           │
│  • Row Level Security (RLS)                                 │
│  • Multi-tenant data isolation                              │
│  • Audit logging                                            │
│  • 100+ clinical response tables                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│  • NotificationAPI (Email)  • Supabase Auth                 │
└─────────────────────────────────────────────────────────────┘
```

### Data Architecture

**Multi-Center Isolation:**
- Each center is a separate entity with its own managers, professionals, and patients
- Strict data isolation enforced through Row Level Security (RLS)
- Administrators can view all centers; managers and professionals are scoped to their center

**Patient-Visit-Questionnaire Model:**
```
Centers → Patients → Visits → Questionnaire Responses
                   ↓
              Visit Templates (by pathology & visit type)
```

**Questionnaire Storage:**
- Each questionnaire has its own dedicated table (`responses_<code>`)
- Type-safe schema with constraints
- Automatic scoring and interpretation
- Supports both auto-questionnaires (patient-completed) and hetero-questionnaires (professional-administered)

---

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library built on Radix UI
- **TanStack Table 8.20** - Data tables
- **Recharts 2.15** - Data visualization
- **next-themes** - Dark mode support

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase (PostgreSQL)** - Database and authentication
- **Row Level Security (RLS)** - Database-level authorization
- **Zod 3.24** - Runtime validation
- **date-fns 4.1** - Date manipulation

### External Services
- **Supabase Auth** - User authentication
- **NotificationAPI** - Email delivery (optional)

### Development Tools
- **ESLint 9** - Code linting
- **Autoprefixer & PostCSS** - CSS processing
- **Turbopack** - Fast builds (Next.js 15)

---

## User Roles

### 1. Administrator

**Responsibilities:**
- Platform governance across all centers
- Center creation and management
- Manager user creation and assignment
- Global analytics and reporting
- GDPR compliance tools (data export, deletion)

**Access:**
- View and manage all centers
- Access to global statistics dashboard
- User management for all roles
- System settings and configuration

**Default Landing:** `/admin`

---

### 2. Manager

**Responsibilities:**
- Center-level operations and oversight
- Healthcare professional recruitment and management
- Patient oversight and monitoring
- Permission management for professionals
- Center-specific reporting and analytics

**Access:**
- Full access to their assigned center's data
- Create and manage healthcare professionals
- View all patients within their center
- Access center-specific statistics
- Can view clinical data (read-only)

**Default Landing:** `/manager`

---

### 3. Healthcare Professional

**Responsibilities:**
- Direct patient care and management
- Patient registration and onboarding
- Clinical assessment and visit management
- Questionnaire administration (hetero-questionnaires)
- Treatment tracking and follow-up

**Access:**
- Manage their assigned patients
- Create and conduct clinical visits
- Administer and review questionnaires
- View patient clinical history
- Limited statistics (if permission granted by manager)

**Default Landing:** `/professional`

---

### 4. Patient

**Responsibilities:**
- Complete self-assessment questionnaires
- Review personal clinical data
- Maintain personal information

**Access:**
- View own clinical data and visit history
- Complete auto-questionnaires assigned by professionals
- View appointment schedule
- Access to secure messaging (planned)

**Default Landing:** `/patient`

---

## User Stories - Bipolar Pathology

### Administrator Stories

**US-AD-01: Multi-Center Setup**
> As an **Administrator**, I want to **create and configure new expert centers** so that **the platform can expand to new locations while maintaining data isolation**.

**US-AD-02: Manager Provisioning**
> As an **Administrator**, I want to **invite and assign managers to centers** so that **each center has autonomous leadership**.

**US-AD-03: Global Oversight**
> As an **Administrator**, I want to **view aggregated statistics across all centers** so that **I can monitor platform-wide clinical outcomes and usage patterns**.

**US-AD-04: GDPR Compliance**
> As an **Administrator**, I want to **export or delete patient data upon request** so that **the platform complies with GDPR regulations**.

---

### Manager Stories

**US-MG-01: Professional Onboarding**
> As a **Manager**, I want to **invite healthcare professionals to join my center** so that **I can build my clinical team**.

**US-MG-02: Center Overview**
> As a **Manager**, I want to **see a dashboard of all patients and professionals in my center** so that **I can monitor center operations**.

**US-MG-03: Permission Management**
> As a **Manager**, I want to **grant or revoke specific permissions to professionals (e.g., statistics access)** so that **I can control data access within my center**.

**US-MG-04: Data Export**
> As a **Manager**, I want to **export center data in multiple formats (CSV, Excel, JSON)** so that **I can perform external analysis or reporting**.

---

### Healthcare Professional Stories

**US-PR-01: Patient Registration**
> As a **Healthcare Professional**, I want to **register a new bipolar patient and send them an invitation** so that **they can access the patient portal**.

**US-PR-02: Screening Visit**
> As a **Healthcare Professional**, I want to **conduct a screening visit with ASRM, QIDS-SR16, and MDQ questionnaires** so that **I can assess whether the patient has bipolar disorder**.

**US-PR-03: Initial Evaluation**
> As a **Healthcare Professional**, I want to **perform a comprehensive initial evaluation** including:
> - Module 1: Nursing assessment (tobacco, physical parameters, biological tests)
> - Module 2: Mood and functioning (MADRS, YMRS, CGI, FAST)
> - Module 4: Neuropsychological battery (WAIS, TMT, Stroop, CVLT)
> - Module 5: Patient self-assessments (EQ-5D-5L, STAI, MARS)
> - Module 7: Trait questionnaires (ASRS, CTQ, WURS-25)
>
> So that **I have a complete baseline clinical profile**.

**US-PR-04: Visit Progress Tracking**
> As a **Healthcare Professional**, I want to **see which questionnaires are completed and which are pending** so that **I can efficiently manage the visit workflow**.

**US-PR-05: Patient Dashboard**
> As a **Healthcare Professional**, I want to **view a patient's clinical history, visit timeline, and score trends** so that **I can make informed treatment decisions**.

**US-PR-06: Follow-up Visits**
> As a **Healthcare Professional**, I want to **schedule and conduct biannual follow-up visits** with abbreviated questionnaire sets so that **I can monitor patient progress longitudinally**.

**US-PR-07: Clinical Interpretation**
> As a **Healthcare Professional**, I want to **see automatic scoring and interpretation for questionnaires** (e.g., MADRS severity, YMRS mania level) so that **I can quickly assess patient state**.

---

### Patient Stories

**US-PT-01: Account Activation**
> As a **Patient**, I want to **receive an email invitation and activate my account** so that **I can access my clinical portal**.

**US-PT-02: Self-Assessment**
> As a **Patient**, I want to **complete assigned auto-questionnaires (ASRM, QIDS, MDQ)** from home so that **my healthcare provider can prepare for my visit**.

**US-PT-03: Clinical History**
> As a **Patient**, I want to **view my visit history and questionnaire scores** so that **I can track my own progress over time**.

**US-PT-04: Appointment Overview**
> As a **Patient**, I want to **see my upcoming and past appointments** so that **I can stay informed about my care schedule**.

---

## Questionnaires - Bipolar Pathology

The platform implements 80+ validated clinical questionnaires for bipolar disorder assessment. Below is a comprehensive list organized by visit type and module.

### Screening Visit

#### Patient Self-Assessments

| Code | Questionnaire | Type | Items | Score Range | Purpose |
|------|---------------|------|-------|-------------|---------|
| `ASRM_FR` | Altman Self-Rating Mania Scale | Auto | 5 | 0-20 | Manic symptom screening |
| `QIDS_SR16_FR` | Quick Inventory of Depressive Symptomatology | Auto | 16 | 0-27 | Depression severity |
| `MDQ_FR` | Mood Disorder Questionnaire | Auto | 13+2 | Positive/Negative | Bipolar screening |

#### Medical Assessment

| Code | Questionnaire | Type | Purpose |
|------|---------------|------|---------|
| `EBIP_SCR_DIAG` | Diagnostic Evaluation | Hetero | Diagnostic confirmation |
| `EBIP_SCR_ORIENT` | Center Orientation | Hetero | Eligibility criteria |

---

### Initial Evaluation

#### Module 1: Nursing Assessment

| Code | Questionnaire | Type | Purpose |
|------|---------------|------|---------|
| `TOBACCO` | Tobacco Use Evaluation | Hetero | Smoking status and history |
| `FAGERSTROM` | Fagerstrom Test | Hetero | Nicotine dependence (0-10) |
| `PHYSICAL_PARAMS` | Physical Parameters | Hetero | Height, weight, BMI, waist |
| `BLOOD_PRESSURE` | Blood Pressure | Hetero | BP and heart rate (supine/standing) |
| `SLEEP_APNEA` | STOP-Bang | Hetero | Sleep apnea screening (0-8) |
| `BIOLOGICAL_ASSESSMENT` | Biological Tests | Hetero | Complete lab panel |
| `ECG` | Electrocardiogram | Hetero | ECG parameters, QTc calculation |

---

#### Module 2: Mood and Functioning

| Code | Questionnaire | Type | Items | Score Range | Purpose |
|------|---------------|------|-------|-------------|---------|
| `MADRS` | Montgomery-Asberg Depression Rating Scale | Hetero | 10 | 0-60 | Depression severity |
| `YMRS` | Young Mania Rating Scale | Hetero | 11 | 0-60 | Mania severity |
| `CGI` | Clinical Global Impression | Hetero | 4 | - | Overall severity and improvement |
| `EGF` | Global Assessment of Functioning | Hetero | 1 | 1-100 | Functional level |
| `ALDA` | Alda Scale | Hetero | 6 | 0-10 | Lithium response |
| `ETAT_PATIENT` | Patient State (DSM-IV) | Hetero | 18 | - | Current symptom checklist |
| `FAST` | Functioning Assessment Short Test | Hetero | 24 | 0-72 | Functional impairment |

---

#### Module 3: Medical History

| Code | Questionnaire | Type | Purpose |
|------|---------------|------|---------|
| `FAMILY_HISTORY_FR` | Family History | Hetero | Psychiatric family history |
| `CSSRS_FR` | Columbia Suicide Severity Rating Scale | Hetero | Suicidal ideation and behavior |
| `ISA_FR` | Current Suicidal Intent | Hetero | Active suicidal ideation |
| `SIS_FR` | Suicide Intent Scale | Hetero | Most recent attempt assessment |
| `SUICIDE_HISTORY_FR` | Suicide Attempt History | Hetero | Historical suicide attempts |
| `PERINATALITE_FR` | Perinatal History | Hetero | Birth and perinatal conditions |
| `PATHO_NEURO_FR` | Neurological Pathologies | Hetero | Neurological comorbidities |
| `PATHO_CARDIO_FR` | Cardiovascular Pathologies | Hetero | Cardiac comorbidities |
| `PATHO_ENDOC_FR` | Endocrine & Metabolic Pathologies | Hetero | Endocrine comorbidities |
| `PATHO_DERMATO_FR` | Dermatological Pathologies | Hetero | Skin comorbidities |
| `PATHO_URINAIRE_FR` | Urinary Pathologies | Hetero | Urinary comorbidities |
| `ANTECEDENTS_GYNECO_FR` | Gynecological History | Hetero | Gynecological history (female) |
| `PATHO_HEPATO_GASTRO_FR` | Hepato-Gastro Pathologies | Hetero | GI comorbidities |
| `PATHO_ALLERGIQUE_FR` | Allergic & Inflammatory Pathologies | Hetero | Allergies and autoimmune |
| `AUTRES_PATHO_FR` | Other Pathologies | Hetero | Cancer, infections, surgery |

---

#### Module 4: Neuropsychological Assessment

##### Intelligence Tests (WAIS-IV)

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `WAIS4_CRITERIA_FR` | WAIS-IV Criteria | Test selection criteria |
| `WAIS4_LEARNING_FR` | WAIS-IV Learning | Learning and memory |
| `WAIS4_MATRICES_FR` | WAIS-IV Matrices | Perceptual reasoning |
| `WAIS4_CODE_FR` | WAIS-IV Coding | Processing speed |
| `WAIS4_DIGIT_SPAN_FR` | WAIS-IV Digit Span | Working memory |
| `WAIS4_SIMILITUDES_FR` | WAIS-IV Similarities | Verbal reasoning |

##### Intelligence Tests (WAIS-III)

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `WAIS3_CRITERIA_FR` | WAIS-III Criteria | Test selection |
| `WAIS3_LEARNING_FR` | WAIS-III Learning | Learning assessment |
| `WAIS3_VOCABULAIRE_FR` | WAIS-III Vocabulary | Verbal knowledge |
| `WAIS3_MATRICES_FR` | WAIS-III Matrices | Reasoning |
| `WAIS3_CODE_SYMBOLES_FR` | WAIS-III Coding | Processing speed |
| `WAIS3_DIGIT_SPAN_FR` | WAIS-III Digit Span | Working memory |

##### Memory and Attention Tests

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `CVLT_FR` | California Verbal Learning Test | Verbal memory |
| `WAIS3_CVLT_FR` | CVLT (WAIS-III battery) | Verbal learning |
| `MEM3_SPATIAL_FR` | MEM-III Spatial | Spatial memory |

##### Executive Function Tests

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `TMT_FR` | Trail Making Test | Executive function, cognitive flexibility |
| `WAIS3_TMT_FR` | TMT (WAIS-III battery) | Executive function |
| `STROOP_FR` | Stroop Test | Selective attention, inhibition |
| `WAIS3_STROOP_FR` | Stroop (WAIS-III battery) | Inhibition |
| `FLUENCES_VERBALES_FR` | Verbal Fluency | Language and executive function |
| `WAIS3_FLUENCES_VERBALES_FR` | Verbal Fluency (WAIS-III) | Language fluency |

##### Sustained Attention Tests

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `CPT3_FR` | Continuous Performance Test III | Sustained attention (WAIS-IV) |
| `WAIS3_CPT2_FR` | Continuous Performance Test II | Sustained attention (WAIS-III) |

##### Composite Tests

| Code | Questionnaire | Purpose |
|------|---------------|---------|
| `COBRA_FR` | COBRA Battery | Cognitive assessment for bipolar disorder |
| `TEST_COMMISSIONS_FR` | Commission Test | Impulsivity and errors |
| `SCIP_FR` | Screen for Cognitive Impairment in Psychiatry | Brief cognitive screen |

---

#### Module 5: Patient Self-Assessments (State)

| Code | Questionnaire | Type | Items | Score Range | Purpose |
|------|---------------|------|-------|-------------|---------|
| `EQ5D5L` | EuroQol 5D-5L | Auto | 5+VAS | Utility index | Quality of life |
| `STAI_YA` | State-Trait Anxiety Inventory (State) | Auto | 20 | 20-80 | Current anxiety |
| `MARS` | Medication Adherence Rating Scale | Auto | 10 | 0-10 | Medication adherence |
| `MATHYS` | Multidimensional Mood Assessment | Auto | 20 | 0-10 each | Mood dimensions |
| `EPWORTH` | Epworth Sleepiness Scale | Auto | 8 | 0-24 | Daytime sleepiness |

---

#### Module 6: Social Functioning

| Code | Questionnaire | Type | Purpose |
|------|---------------|------|---------|
| `SOCIAL_FR` | Social Functioning | Hetero | Social relationships and activities |

---

#### Module 7: Patient Self-Assessments (Traits)

| Code | Questionnaire | Type | Items | Score Range | Purpose |
|------|---------------|------|-------|-------------|---------|
| `ASRS` | Adult ADHD Self-Report Scale | Auto | 18 | Screening | ADHD screening |
| `CTQ` | Childhood Trauma Questionnaire | Auto | 28 | 5 subscales | Childhood trauma |
| `BIS10` | Barratt Impulsiveness Scale | Auto | 12 | - | Impulsivity |
| `WURS25` | Wender Utah Rating Scale | Auto | 25 | 0-100 | Childhood ADHD symptoms |

---

#### Module 8: DSM-5 Diagnostic Assessments

| Code | Questionnaire | Type | Purpose |
|------|---------------|------|---------|
| `DSM5_HUMEUR_FR` | DSM-5 Mood Disorders | Hetero | Mood episode diagnosis |
| `DSM5_PSYCHOTIC_FR` | DSM-5 Psychotic Symptoms | Hetero | Psychotic features |
| `DSM5_COMORBID_FR` | DSM-5 Comorbid Disorders | Hetero | Anxiety, OCD, PTSD, eating disorders |

---

### Follow-up Visits

Follow-up visits (biannual, annual) use abbreviated questionnaire sets focusing on:
- Mood assessment (ASRM, QIDS, MADRS, YMRS)
- Functioning (CGI, FAST)
- Medication adherence (MARS)
- Self-reported state (EQ-5D-5L, STAI)

---

## Dependencies

### External Services

#### 1. Supabase (Required)

**Purpose:** Database, authentication, and row-level security

**What you need:**
- Supabase project (free tier available)
- Project URL
- Anon (public) key
- Service role key (for admin operations)

**Setup:**
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys from Settings > API

---

#### 2. NotificationAPI (Optional)

**Purpose:** Email delivery for user invitations and notifications

**What you need:**
- NotificationAPI account (free tier available)
- Client ID
- Client Secret

**Setup:**
1. Create account at [notificationapi.com](https://www.notificationapi.com)
2. Create a notification template with ID: `efondamental_user_created`
3. Get your Client ID and Client Secret from dashboard

**Note:** The application works without NotificationAPI, but user invitation emails will not be sent. You can manually share invitation URLs with users.

---

## Environment Configuration

Create a `.env.local` file in the project root:

```bash
# ============================================================================
# SUPABASE (REQUIRED)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role key for admin operations (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ============================================================================
# APPLICATION (REQUIRED)
# ============================================================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================================================
# NOTIFICATIONAPI (OPTIONAL - for email sending)
# ============================================================================
NOTIFICATIONAPI_CLIENT_ID=your-client-id
NOTIFICATIONAPI_CLIENT_SECRET=your-client-secret
```

### Environment Variables Explained

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key (safe for browser) | `eyJhbGciOiJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Admin key for server operations | `eyJhbGciOiJ...` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Application URL (for email links) | `http://localhost:3000` |
| `NOTIFICATIONAPI_CLIENT_ID` | No | NotificationAPI client ID | `YOUR_CLIENT_ID` |
| `NOTIFICATIONAPI_CLIENT_SECRET` | No | NotificationAPI secret key | `YOUR_SECRET` |

---

## Database Setup

### Prerequisites

**IMPORTANT:** Before running any SQL scripts, you must create authentication users in the Supabase Dashboard.

### Step 1: Create Authentication Users

Navigate to **Supabase Dashboard > Authentication > Users > Add User**

**Enable "Auto Confirm User"** for each user, then create:

```
Email: admin@fondamental.fr
Password: Password123!

Email: manager.paris@fondamental.fr
Password: Password123!

Email: manager.lyon@fondamental.fr
Password: Password123!

Email: doctor.paris@fondamental.fr
Password: Password123!

Email: doctor.lyon@fondamental.fr
Password: Password123!
```

**Security Note:** Change these passwords immediately in production!

---

### Step 2: Run Database Initialization

Navigate to **Supabase Dashboard > SQL Editor > New Query**

Copy and paste the **entire contents** of:
```
supabase/migrations/000_complete_init.sql
```

Click **Run** to execute.

**This script creates:**
- Complete database schema (tables, enums, indexes)
- All questionnaire response tables (80+ tables)
- Row Level Security policies
- Seed data (pathologies, permissions, centers)
- User profiles for the auth users created in Step 1
- Sample data (2 centers: Paris and Lyon)

---

### Step 3: Verify Installation

Run this query in SQL Editor:

```sql
-- Verify users created
SELECT email, role FROM user_profiles;

-- Verify centers created
SELECT name, code FROM centers;

-- Verify pathologies created
SELECT type, name FROM pathologies;
```

**Expected output:**
- 5 user profiles (1 admin, 2 managers, 2 doctors)
- 2 centers (Paris, Lyon)
- 4 pathologies (bipolar, schizophrenia, asd_asperger, depression)

---

### Step 4: Apply Subsequent Migrations (Optional)

If you need the latest schema updates, apply migrations in order:

```bash
# Migrations are numbered: 000, 002, 003, etc.
# Apply each in SQL Editor in numerical order
```

**Note:** `000_complete_init.sql` contains the core schema. Subsequent migrations add features and fixes.

---

### Troubleshooting

**Issue:** "User profiles not created"
**Solution:** Ensure auth users were created in Step 1 BEFORE running Step 2

**Issue:** "RLS policy errors"
**Solution:** Check that your auth user email matches exactly (case-sensitive)

**Issue:** "Foreign key violation"
**Solution:** Run migrations in order, starting with `000_complete_init.sql`

---

## Getting Started

### Quick Setup (Recommended)

This project uses **Supabase LOCAL** for development. Everything is automated!

```bash
# 1. Clone the repository
git clone <repository-url>
cd efondamental

# 2. Run the setup script (that's it!)
./setup.sh
```

**The script will automatically:**
- Create `.env.local` if it doesn't exist
- Install npm dependencies
- Start Supabase local (Docker)
- Apply all 74 database migrations
- Create test users with seed data
- Configure `.env.local` with correct credentials
- Offer to start the development server

### That's it!

The setup is **fully automated**. Just run `./setup.sh` and follow the prompts.

If you choose to start the app during setup, it will be available at **http://localhost:3000**

### Manual Start (if needed)

```bash
# Start the Next.js development server
npm run dev
```

### Useful Commands

```bash
npx supabase status     # Check Supabase status
npx supabase stop       # Stop Supabase
npx supabase db reset   # Reset database with fresh data
```

**Supabase Studio (Web UI):** http://127.0.0.1:54323

---

### Login Credentials (Seed Users)

After database setup, you can log in with:

| Role | Email | Password | Landing Page |
|------|-------|----------|--------------|
| Administrator | admin@fondamental.fr | Password123! | `/admin` |
| Manager (Paris) | manager.paris@fondamental.fr | Password123! | `/manager` |
| Manager (Lyon) | manager.lyon@fondamental.fr | Password123! | `/manager` |
| Professional (Paris) | doctor.paris@fondamental.fr | Password123! | `/professional` |
| Professional (Lyon) | doctor.lyon@fondamental.fr | Password123! | `/professional` |

**Note:** Change passwords in production!

---

### First Steps After Login

**As Administrator:**
1. Navigate to `/admin`
2. View centers and users
3. Create additional managers if needed

**As Manager:**
1. Navigate to `/manager`
2. View your center's professionals and patients
3. Invite new healthcare professionals via `/manager/professionals/new`

**As Healthcare Professional:**
1. Navigate to `/professional`
2. Select pathology (currently only Bipolar is active)
3. Register new patients via the patient creation form
4. Start a screening visit for a patient

---

## Project Structure

```
efondamental/
├── app/                          # Next.js App Router
│   ├── admin/                    # Administrator dashboard
│   │   ├── centers/              # Center management
│   │   ├── users/                # Global user management
│   │   ├── gdpr/                 # GDPR tools
│   │   └── settings/             # Platform settings
│   ├── manager/                  # Manager dashboard
│   │   ├── professionals/        # Professional management
│   │   ├── patients/             # Patient overview
│   │   └── settings/             # Center settings
│   ├── professional/             # Professional dashboard
│   │   ├── [pathology]/          # Pathology-specific views
│   │   │   ├── patients/         # Patient list
│   │   │   ├── visits/           # Visit management
│   │   │   └── statistics/       # Clinical statistics
│   │   └── questionnaires/       # Questionnaire actions
│   ├── patient/                  # Patient portal
│   │   ├── appointments/         # Appointment view
│   │   ├── messages/             # Secure messaging
│   │   └── questionnaires/       # Self-assessment forms
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── invite/               # Invitation acceptance
│   │   └── forgot-password/
│   └── api/                      # API routes
│       ├── admin/                # Admin endpoints
│       ├── manager/              # Manager endpoints
│       ├── professional/         # Professional endpoints
│       └── invitations/          # Invitation handling
│
├── components/                   # React components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── data-table.tsx        # TanStack Table wrapper
│   │   └── ...
│   └── clinical/                 # Clinical components
│       ├── questionnaire-renderer.tsx
│       └── questionnaire-progress-header.tsx
│
├── lib/                          # Shared libraries
│   ├── constants/                # Questionnaire definitions
│   │   ├── questionnaires.ts     # Auto-questionnaires (patient)
│   │   ├── questionnaires-hetero.ts  # Hetero-questionnaires (professional)
│   │   ├── questionnaires-dsm5.ts    # DSM-5 diagnostic assessments
│   │   ├── questionnaires-infirmier.ts   # Nursing assessments
│   │   └── questionnaires-social.ts  # Social functioning
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts       # Authentication
│   │   ├── patient.service.ts    # Patient CRUD
│   │   ├── visit.service.ts      # Visit management
│   │   ├── questionnaire.service.ts  # Auto-questionnaires
│   │   ├── questionnaire-hetero.service.ts  # Hetero-questionnaires
│   │   ├── user-provisioning.service.ts  # User creation
│   │   └── email.service.ts      # Email sending
│   ├── rbac/                     # Role-based access control
│   │   ├── roles.ts              # Role hierarchy and capabilities
│   │   ├── permissions.ts        # Permission definitions
│   │   └── middleware.ts         # Authorization middleware
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── admin.ts              # Admin client (service role)
│   │   └── middleware.ts         # Auth middleware
│   ├── types/                    # TypeScript types
│   │   ├── database.types.ts     # Database schema types
│   │   ├── enums.ts              # Enum definitions
│   │   └── models.ts             # Domain models
│   └── utils/                    # Utility functions
│       ├── date.ts
│       ├── validation.ts
│       └── formatting.ts
│
├── supabase/
│   └── migrations/               # Database migrations (149 files)
│       ├── 000_complete_init.sql # Initial schema
│       ├── 008_bipolar_screening_autoquestionnaires.sql
│       ├── 014_add_evaluation_questionnaires.sql
│       └── ...
│
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## Security & GDPR

### Row Level Security (RLS)

Every table has RLS policies that enforce:
- Patients can only see their own data
- Professionals can only see patients assigned to them
- Managers can see all data in their center
- Administrators can see all data across centers

**Example RLS Policy:**
```sql
-- Patients can only view their own questionnaire responses
CREATE POLICY "Patients view own ASRM"
  ON responses_asrm
  FOR SELECT
  USING (auth.uid() = patient_id);
```

---

### Top-Down User Provisioning

**No Public Registration:**
- Users cannot self-register
- All user creation is top-down:
  - Admin creates Managers
  - Managers create Professionals
  - Professionals create Patients

**Invitation Flow:**
1. Higher-level user creates invitation
2. Email sent with secure token
3. New user accepts invitation and sets password
4. User profile automatically created with appropriate permissions

---

### Audit Logging

All critical actions are logged in `audit_logs` table:
- User logins
- Patient creation/modification
- Data exports
- Permission changes
- Visit creation and completion

**Audit Log Fields:**
- `user_id`: Who performed the action
- `action`: What was done (CREATE, UPDATE, DELETE, VIEW, EXPORT)
- `table_name`: Which table was affected
- `record_id`: Which record was affected
- `details`: JSON payload with additional context
- `ip_address`: Source IP
- `timestamp`: When it occurred

---

### GDPR Compliance Features

**Data Export:**
- Administrators can export all data for a patient in JSON format
- Includes all questionnaires, visits, clinical notes
- Available at `/admin/gdpr`

**Data Deletion:**
- Administrators can permanently delete patient records
- Cascading deletion removes all associated data
- Irreversible operation with confirmation required

**Data Retention:**
- All records include `created_at` and `updated_at` timestamps
- Soft delete capability (records marked as inactive, not removed)

---

## Development

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

### Linting

```bash
# Run ESLint
npm run lint
```

---

### Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No implicit any
- Exhaustive switch statements

**Component Structure:**
- Server components by default
- Client components marked with `'use client'`
- Separation of concerns (UI vs business logic)

**Service Layer:**
- All database interactions in service files
- Type-safe Supabase queries
- Error handling and logging

---

### Adding a New Questionnaire

See developer guide in `.cursor/questionnaire-creation-guide.md` for detailed instructions.

**Quick Overview:**
1. Create migration with table schema
2. Define questionnaire in `lib/constants/`
3. Add service functions (fetch/save)
4. Register in visit templates
5. Add server action handler
6. Update score display component (if scored)

---

### Key Design Patterns

**Server-Side Rendering:**
- Most pages are Server Components
- Data fetched on server, no loading states
- Better SEO and initial load performance

**Progressive Enhancement:**
- Forms work without JavaScript
- Server Actions for mutations
- Client components only where needed (interactivity)

**Type Safety:**
- End-to-end TypeScript
- Zod for runtime validation
- Database types generated from schema

---

## Acknowledgments

**FondaMental Foundation:** Clinical expertise and validated questionnaire battery

**Development Team:** Architecture, implementation, and deployment

---

## License

Proprietary - FondaMental Foundation

---

## Support

For technical support or questions:
- Contact your system administrator
- Refer to inline documentation in code
- Check Supabase logs for database errors
- Review browser console for frontend issues

---

**Version:** 1.0.0
**Last Updated:** December 2024
