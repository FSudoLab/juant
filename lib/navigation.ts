import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  GraduationCap,
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
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'employee' | 'hr'
export type NavItem = { label: string; href: string; icon: LucideIcon; badge?: string }
export type NavGroup = { heading: string; items: NavItem[] }

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
      hrItem('Approval Center', 'approvals', CheckCircle2, '8'),
    ],
  },
  {
    heading: 'People Management',
    items: [
      hrItem('Employee Management', 'employees', Users),
      hrItem('Organization Structure', 'organization', Network),
      hrItem('Employee 201 Files', '201-files', FolderOpen),
      hrItem('Documents & Forms', 'forms', FileText),
    ],
  },
  { heading: 'Talent Acquisition', items: [hrItem('Recruitment', 'recruitment', UserPlus), hrItem('Onboarding', 'onboarding', Handshake)] },
  {
    heading: 'Time & Attendance',
    items: [
      hrItem('Attendance Management', 'attendance-management', Clock3),
      hrItem('Schedules & Shifts', 'shifts', CalendarDays),
      hrItem('Leave Management', 'leave-management', ShieldCheck),
      hrItem('Overtime & Holiday Work', 'overtime', Sun),
    ],
  },
  {
    heading: 'Compensation',
    items: [
      hrItem('Payroll', 'payroll-runs', Wallet),
      hrItem('Loans & Reimbursements', 'loans', HandCoins),
      hrItem('Government Contributions & Tax', 'contributions', Landmark),
    ],
  },
  {
    heading: 'Employee Development',
    items: [
      hrItem('Performance & KPIs', 'kpis', Target),
      hrItem('Learning & Development', 'learning', GraduationCap),
      hrItem('Engagement & Feedback', 'engagement', MessageCircle),
    ],
  },
  { heading: 'Employee Lifecycle', items: [hrItem('Offboarding & Clearance', 'offboarding', LogOut), hrItem('Final Pay', 'final-pay', Receipt)] },
  {
    heading: 'Insights & System',
    items: [
      hrItem('Reports & Analytics', 'reports', BarChart3),
      hrItem('Ask Juan AI', 'ask-juan', Bot),
      hrItem('HR Settings', 'hr-settings', Settings),
    ],
  },
]
