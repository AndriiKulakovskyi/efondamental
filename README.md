# eFondaMental Platform

A unified clinical management platform for longitudinal follow-up of patients with major psychiatric disorders.

## Overview

eFondaMental is a multi-center platform designed to support the management of patients with:
- Bipolar Disorder
- Schizophrenia
- Autism Spectrum Disorder (Asperger)
- Depression

The platform implements a federated multi-center model with strict data isolation, role-based access control, and comprehensive clinical workflows.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Validation**: Zod
- **Tables**: TanStack Table
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd efondamental
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up the database:
- Create a new Supabase project
- Run the migration file: `supabase/migrations/001_initial_schema.sql`
- Run the seed data: `supabase/seed.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
efondamental/
├── app/                    # Next.js App Router
│   ├── admin/             # Administrator dashboard
│   ├── manager/           # Manager dashboard
│   ├── professional/      # Professional dashboard
│   ├── patient/           # Patient portal
│   └── auth/              # Authentication pages
├── components/
│   ├── ui/                # UI components
│   ├── clinical/          # Clinical components
│   └── *-dashboard/       # Dashboard-specific components
├── lib/
│   ├── types/             # TypeScript types
│   ├── services/          # Business logic
│   ├── rbac/              # Authorization
│   ├── supabase/          # Supabase clients
│   └── utils/             # Utilities
└── supabase/
    ├── migrations/        # Database schema
    └── seed.sql           # Seed data
```

## User Roles

### Administrator
- Platform governance
- Center management
- Global analytics
- Manager creation

### Manager
- Center operations
- Professional management
- Permission management
- Full clinical access within center

### Healthcare Professional
- Patient management
- Clinical workflows
- Visit management
- Limited statistics (if granted)

### Patient
- Self-assessment questionnaires
- Appointment viewing
- Secure messaging

## Key Features

- **Multi-Center Architecture**: Strict data isolation between centers
- **RBAC**: Granular role-based access control
- **Clinical Workflows**: Structured visit templates and questionnaires
- **Dynamic Forms**: Questionnaire engine with conditional logic
- **Audit Logging**: Complete activity tracking
- **GDPR Compliance**: Data export and deletion tools

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Security

- Row Level Security (RLS) enforces data isolation
- No public registration (top-down user provisioning only)
- Complete audit trail
- GDPR-compliant data handling

## Documentation

See `IMPLEMENTATION.md` for detailed implementation notes.

## License

Proprietary - FondaMental Foundation

## Support

For support, contact your system administrator or the development team.
