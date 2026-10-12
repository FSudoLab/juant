const renamedSections = {
  hr: {
    approvals: 'approval-center',
    employees: 'employee-management',
    organization: 'organization-structure',
    forms: 'company-documents',
    shifts: 'schedules-shifts',
    loans: 'loans-reimbursements',
    contributions: 'government-contributions',
    kpis: 'evaluations',
    engagement: 'eval-surveys',
    reports: 'reports-analytics',
  },
  manager: {
    employees: 'team-overview',
    approvals: 'approval-center',
    shifts: 'schedules-shifts',
    documents: 'team-documents',
    notifications: 'notifications-reminders',
    help: 'help-hr-support',
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return Object.entries(renamedSections).flatMap(([role, sections]) =>
      Object.entries(sections).map(([from, to]) => ({
        source: `/dashboard/${role}/${from}`,
        destination: `/dashboard/${role}/${to}`,
        permanent: false,
      })),
    )
  },
}

export default nextConfig
