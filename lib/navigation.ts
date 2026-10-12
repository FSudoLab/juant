import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  HandCoins,
  Handshake,
  HelpCircle,
  Inbox,
  Landmark,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Network,
  Receipt,
  Settings,
  ShieldCheck,
  Sun,
  Target,
  Timer,
  UserPlus,
  UserCog,
  UserPen,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'employee' | 'hr' | 'manager' | 'system-admin'
export type NavItem = { label: string; href: string; icon: LucideIcon; badge?: string }
export type NavGroup = { heading: string; items: NavItem[] }
export type HrAccessKey = 'approvals' | 'employees' | 'organization' | '201-files' | 'forms' | 'recruitment' | 'onboarding' | 'attendance-management' | 'shifts' | 'leave-management' | 'overtime' | 'payroll-runs' | 'loans' | 'contributions' | 'kpis' | 'engagement' | 'offboarding' | 'final-pay' | 'reports' | 'ask-juan' | 'hr-settings'

export const hrAccessItems: { key: HrAccessKey; label: string }[] = [
  { key: 'approvals', label: 'Approval Center (attendance, leave, overtime)' },
  { key: 'recruitment', label: 'Recruitment' },
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'employees', label: 'Employee Management' },
  { key: 'offboarding', label: 'Offboarding & Clearance' },
  { key: 'organization', label: 'Organization Structure' },
  { key: '201-files', label: 'Employee 201 Files' },
  { key: 'forms', label: 'Company Documents' },
  { key: 'payroll-runs', label: 'Payroll' },
  { key: 'loans', label: 'Loans & Reimbursements' },
  { key: 'contributions', label: 'Government Contributions & Tax' },
  { key: 'final-pay', label: 'Final Pay' },
  { key: 'kpis', label: 'Evaluations' },
  { key: 'engagement', label: 'Eval Surveys' },
  { key: 'reports', label: 'Reports & Analytics' },
  { key: 'ask-juan', label: 'Ask Juan AI' },
  { key: 'hr-settings', label: 'HR Settings' },
]

const employeeBase = '/dashboard/employee'

export const employeeNavigation: NavGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { label: 'Dashboard', href: employeeBase, icon: LayoutDashboard },
      { label: 'Time In', href: `${employeeBase}/attendance`, icon: Clock3 },
      { label: 'My Schedule', href: `${employeeBase}/schedule`, icon: CalendarDays },
      { label: 'Leave Management', href: `${employeeBase}/leave`, icon: ShieldCheck },
      { label: 'My Requests', href: `${employeeBase}/requests`, icon: Inbox },
    ],
  },
  {
    heading: 'My Employment',
    items: [
      { label: 'Payroll & Payslips', href: `${employeeBase}/payroll`, icon: Wallet },
      { label: 'My Documents', href: `${employeeBase}/documents`, icon: FolderOpen },
      { label: 'My Profile', href: `${employeeBase}/profile`, icon: UserRound },
      { label: 'My Performance', href: `${employeeBase}/performance`, icon: BarChart3 },
    ],
  },
  {
    heading: 'Support',
    items: [
      { label: 'Notifications', href: `${employeeBase}/notifications`, icon: Bell, badge: '3' },
      { label: 'Ask Juan', href: `${employeeBase}/ask-juan`, icon: Bot },
      { label: 'Help & HR Support', href: `${employeeBase}/help`, icon: HelpCircle },
      { label: 'Settings', href: `${employeeBase}/settings`, icon: Settings },
    ],
  },
]

const hrBase = '/dashboard/hr'
const hrItem = (label: string, slug: string, icon: LucideIcon, badge?: string): NavItem => ({ label, href: `${hrBase}/${slug}`, icon, badge })

export const hrNavigation: NavGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { label: 'Dashboard', href: hrBase, icon: LayoutDashboard },
      hrItem('Time In', 'attendance', Timer),
      hrItem('Team Overview', 'team-overview', Users),
      hrItem('Approval Center', 'approvals', CheckCircle2, '8'),
    ],
  },
  {
    heading: 'Employee Lifecycle',
    items: [
      hrItem('Recruitment', 'recruitment', UserPlus),
      hrItem('Onboarding', 'onboarding', Handshake),
      hrItem('Employee Management', 'employees', Users),
      hrItem('Offboarding & Clearance', 'offboarding', LogOut),
    ],
  },
  {
    heading: 'Records',
    items: [
      hrItem('Organization Structure', 'organization', Network),
      hrItem('Employee 201 Files', '201-files', FolderOpen),
      hrItem('Company Documents', 'forms', FileText),
    ],
  },
  {
    heading: 'Compensation',
    items: [
      hrItem('Payroll', 'payroll-runs', Wallet),
      hrItem('Loans & Reimbursements', 'loans', HandCoins),
      hrItem('Government Contributions & Tax', 'contributions', Landmark),
      hrItem('Final Pay', 'final-pay', Receipt),
    ],
  },
  {
    heading: 'Employee Development',
    items: [
      hrItem('Evaluations', 'kpis', Target),
      hrItem('Eval Surveys', 'engagement', MessageCircle),
    ],
  },
  {
    heading: 'Insights & System',
    items: [
      hrItem('Reports & Analytics', 'reports', BarChart3),
      hrItem('Ask Juan AI', 'ask-juan', Bot),
      hrItem('Settings', 'hr-settings', Settings),
    ],
  },
]

const managerBase = '/dashboard/manager'
const managerItem = (label: string, slug: string, icon: LucideIcon, badge?: string): NavItem => ({ label, href: `${managerBase}/${slug}`, icon, badge })

export const managerNavigation: NavGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { label: 'Dashboard', href: managerBase, icon: LayoutDashboard },
      managerItem('Team overview', 'employees', Users),
      managerItem('Approval center', 'approvals', CheckCircle2, '4'),
    ],
  },
  {
    heading: 'Team operations',
    items: [
      managerItem('Schedules & shifts', 'shifts', CalendarDays),
      managerItem('Leave management', 'leave-management', ShieldCheck),
      managerItem('Upcoming holidays', 'holidays', Sun),
    ],
  },
  {
    heading: 'Team resources',
    items: [
      managerItem('Documents', 'documents', FileText),
      managerItem('Employee information', 'employee-information', UserPen),
    ],
  },
  {
    heading: 'Support',
    items: [
      managerItem('Notifications & reminders', 'notifications', Bell),
      managerItem('Help & HR support', 'help', HelpCircle),
      managerItem('Manager settings', 'settings', Settings),
    ],
  },
]

const systemAdminBase = '/dashboard/system-admin'

export const systemAdminNavigation: NavGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { label: 'Dashboard', href: systemAdminBase, icon: LayoutDashboard },
      { label: 'User access', href: `${systemAdminBase}/users`, icon: UserCog },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Audit log', href: `${systemAdminBase}/audit-log`, icon: FileText },
      { label: 'System settings', href: `${systemAdminBase}/settings`, icon: Settings },
    ],
  },
]
