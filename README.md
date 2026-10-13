# JuanT

JuanT is a role-based employee and HR operations platform for small and medium-sized organizations. It brings attendance, schedules, leave, employee records, payroll records, documents, approvals, performance, and support into one workspace.

This repository contains the current functional prototype built with Next.js. It uses demo accounts and browser-local or in-memory state for demonstration purposes.

## Features

- Employee self-service workspace
- HR operations workspace
- Employee management and access permissions
- Attendance and time-in controls
- Schedules, leave, and request workflows
- Payroll and payslip record views
- Employee documents and 201 files
- Performance and peer evaluation screens
- Notifications and Ask Juan support experience
- System administrator workspace for HR users and system configuration
- Responsive desktop and mobile interface

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts
- pnpm

## Getting Started

### Requirements

- Node.js 20 or newer
- pnpm 12 or newer

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Create a production build

```bash
pnpm build
```

### Start the production server

```bash
pnpm start
```

## Demo Accounts

The sign-in page pre-fills these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Employee | `employee@juant.demo` | `employee123` |
| HR | `hr@juant.demo` | `hr123456` |
| System admin | `admin@juant.demo` | `admin12345` |

These accounts are for the prototype only. They do not create real user accounts.

## Project Structure

```text
app/          Next.js routes and role-based pages
components/   Reusable dashboard, HR, employee, and system-admin components
lib/          Navigation, access, demo data, system configuration, and utilities
public/       Static assets
```

## Environment Variables

Local environment files are ignored by Git. Add project-specific variables to `.env.local` when needed.

Do not commit secrets, API keys, database credentials, or production tokens.

## Current Prototype Limitations

- Authentication is simulated with demo credentials.
- Data is not backed by a production database.
- Most updates use in-memory state or browser local storage.
- Production authorization and permission enforcement are not implemented server-side.
- Payroll, statutory contributions, tax filing, notifications, audit logs, billing, and integrations require production implementation and validation.

## Production Roadmap

1. Add secure authentication and organization isolation.
2. Add a persistent database and server-side authorization.
3. Add audit logs, notifications, file storage, backups, and retention controls.
4. Complete attendance, leave, payroll, performance, and offboarding workflows.
5. Validate Philippine privacy, payroll, tax, and statutory compliance requirements.
6. Add integrations, billing, reporting exports, and multi-country configuration.

## Privacy and Security

JuanT is intended to handle sensitive employee information. A production deployment should include least-privilege access, encryption in transit and at rest, secure authentication, audit logging, retention and deletion policies, backups, breach response procedures, and compliance review under applicable privacy and employment laws.

## License

No license has been declared for this prototype.
