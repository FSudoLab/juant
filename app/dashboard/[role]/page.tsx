import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Network,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'

type Role = 'employee' | 'hr'

const employeeNavigation = [
  { heading: 'Workspace', items: [
    ['Dashboard', LayoutDashboard], ['My Attendance', Clock3], ['My Schedule', CalendarDays], ['Leave Management', ShieldCheck], ['My Requests', FileText],
  ] },
  { heading: 'My Employment', items: [
    ['Payroll & Payslips', FileText], ['My Documents', FileText], ['My Profile', UserRound], ['My Performance', BarChart3], ['Learning & Development', GraduationCap],
  ] },
  { heading: 'Support', items: [
    ['Notifications', MessageCircle], ['Ask Juan', MessageCircle], ['Help & HR Support', HelpCircle], ['Settings', Settings],
  ] },
] as const

const hrNavigation = [
  { heading: 'Workspace', items: [['Dashboard', LayoutDashboard], ['Approval Center', CheckCircle2, '8']] },
  { heading: 'People Management', items: [['Employee Management', Users], ['Organization Structure', Network], ['Employee 201 Files', FileText], ['Documents & Forms', FileText]] },
  { heading: 'Talent Acquisition', items: [['Recruitment', Users], ['Onboarding', GraduationCap]] },
  { heading: 'Time & Attendance', items: [['Attendance Management', Clock3], ['Schedules & Shifts', CalendarDays], ['Leave Management', ShieldCheck], ['Overtime & Holiday Work', Clock3]] },
  { heading: 'Compensation', items: [['Payroll', FileText], ['Loans & Reimbursements', FileText], ['Government Contributions & Tax', FileText]] },
  { heading: 'Employee Development', items: [['Performance & KPIs', BarChart3], ['Learning & Development', GraduationCap], ['Engagement & Feedback', MessageCircle]] },
  { heading: 'Employee Lifecycle', items: [['Offboarding & Clearance', FileText], ['Final Pay', FileText]] },
  { heading: 'Insights & System', items: [['Reports & Analytics', BarChart3], ['Ask Juan AI', MessageCircle], ['HR Settings', Settings]] },
] as const

const dashboardData = {
  employee: {
    label: 'Employee workspace',
    title: 'Good morning, Alex.',
    description: 'Your workday at a glance. Keep momentum without the busywork.',
    stats: [['Today', '08:30–17:00'], ['Leave balance', '14 days'], ['Open tasks', '06']],
    cards: [
      { icon: CalendarDays, title: 'Upcoming leave', detail: 'Summer break · Jul 22–26', action: 'View leave' },
      { icon: Clock3, title: 'Time this week', detail: '32h 15m logged of 40h', action: 'View timesheet' },
    ],
  },
  hr: {
    label: 'HR manager workspace',
    title: 'People, moving forward.',
    description: 'A clear view of your team, their time, and what needs attention.',
    stats: [['Team members', '48'], ['Pending requests', '07'], ['This month', '92%']],
    cards: [
      { icon: Users, title: 'Team pulse', detail: '42 of 48 people checked in today', action: 'View team' },
      { icon: CheckCircle2, title: 'Needs your review', detail: '7 leave and profile requests', action: 'Review requests' },
    ],
  },
} as const

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: requestedRole } = await params
  const role: Role = requestedRole === 'hr' ? 'hr' : 'employee'
  const data = dashboardData[role]

  const navigation = role === 'hr' ? hrNavigation : employeeNavigation

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-[#111111]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-[#111111]/15 bg-[#111111] text-[#f6f6f3] lg:w-72 lg:border-b-0 lg:border-r lg:border-[#111111]/15">
          <div className="flex h-full flex-col p-5 sm:p-7 lg:sticky lg:top-0 lg:h-screen">
            <Link href="/" className="mb-8 flex items-center gap-3 border-b border-white/15 pb-6">
              <span className="flex size-9 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
              <span><strong className="block text-lg tracking-[-0.04em]">JuanT</strong><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{role === 'hr' ? 'HR Dashboard' : 'Employee Portal'}</span></span>
            </Link>
            <nav className="flex min-w-0 flex-1 flex-wrap gap-x-8 gap-y-6 overflow-y-auto lg:block" aria-label={`${role} navigation`}>
              {navigation.map((group) => <div key={group.heading} className="min-w-[180px] lg:mb-7"><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{group.heading}</p><ul className="flex flex-col gap-1">{group.items.map(([label, Icon, badge]) => <li key={label}><Link href={label === 'Dashboard' ? `/dashboard/${role}` : '#'} className={`flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-white/10 hover:text-white ${label === 'Dashboard' ? 'bg-[#3159ff] text-white' : 'text-white/65'}`}><span className="flex items-center gap-2.5"><Icon aria-hidden="true" className="size-4" />{label}</span>{badge && <span className="bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#111111]">{badge}</span>}</Link></li>)}</ul></div>)}
            </nav>
            <Link href="/signin" className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-semibold text-white/60 hover:text-white"><LogOut aria-hidden="true" className="size-4" />Logout</Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-5 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-16">
            <header className="flex items-center justify-between border-b border-[#111111]/15 pb-5"><Link href="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#111111]/60 hover:text-[#3159ff]"><ArrowLeft aria-hidden="true" /> Back to site</Link><span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#3159ff]">{data.label}</span></header>
            <section><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">Dashboard / {role}</p><h1 className="mt-5 max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.08em] sm:text-8xl">{data.title}</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-[#111111]/60">{data.description}</p></section>
            <section className="grid border-l border-t border-[#111111]/15 sm:grid-cols-3" aria-label="Summary metrics">{data.stats.map(([label, value]) => <div key={label} className="border-b border-r border-[#111111]/15 p-5 sm:p-7"><p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</p><p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{value}</p></div>)}</section>
            <section className="grid gap-px border border-[#111111]/15 bg-[#111111]/15 sm:grid-cols-2" aria-label="Workspace actions">{data.cards.map(({ icon: Icon, title, detail, action }) => <article key={title} className="flex min-h-56 flex-col justify-between bg-[#f6f6f3] p-6 sm:p-8"><Icon aria-hidden="true" className="text-[#3159ff]" /><div><h2 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h2><p className="mt-2 text-sm text-[#111111]/60">{detail}</p><button type="button" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3159ff]">{action}<ArrowUpRight aria-hidden="true" /></button></div></article>)}</section>
          </div>
        </div>
      </div>
    </main>
  )
}
