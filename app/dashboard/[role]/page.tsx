import Link from 'next/link'
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, ShieldCheck, Users } from 'lucide-react'
import { DashboardInsightsChart } from '@/components/employee/dashboard-insights-chart'
import { resolveRole } from '@/lib/roles'

const dashboardData = {
  employee: {
    title: 'Good morning, Alex.',
    description: 'Your workday at a glance. Keep momentum without the busywork.',
    stats: [['Today', '08:30–17:00'], ['Leave balance', '14 days'], ['Open tasks', '06']],
    cards: [
      { icon: CalendarDays, title: 'Upcoming leave', detail: 'Vacation · Oct 22–26', action: 'View leave', href: '/dashboard/employee/leave' },
      { icon: Clock3, title: 'Time this week', detail: '42h 36m logged of 40h', action: 'View schedule', href: '/dashboard/employee/schedule' },
    ],
  },
  hr: {
    title: 'People, moving forward.',
    description: 'A clear view of your team, their time, and what needs attention.',
    stats: [['Team members', '48'], ['Pending requests', '07'], ['This month', '92%']],
    cards: [
      { icon: Users, title: 'Team pulse', detail: '42 of 48 people checked in today', action: 'View attendance', href: '/dashboard/hr/approvals' },
      { icon: CheckCircle2, title: 'Needs your review', detail: '8 leave, overtime, and attendance requests', action: 'Open approval center', href: '/dashboard/hr/approvals' },
    ],
  },
  manager: {
    title: 'Your team, in rhythm.',
    description: 'Keep schedules, approvals, and employee support moving from one focused workspace.',
    stats: [['Team members', '18'], ['Pending approvals', '04'], ['Coverage this week', '96%']],
    cards: [
      { icon: CalendarDays, title: 'Schedule coverage', detail: 'All weekdays covered · 2 weekend shifts', action: 'Manage schedules', href: '/dashboard/manager/shifts' },
      { icon: CheckCircle2, title: 'Requests to review', detail: '4 leave and schedule requests are waiting', action: 'Open approvals', href: '/dashboard/manager/approvals' },
    ],
  },
  'system-admin': {
    title: 'The system, clearly governed.',
    description: 'Manage access, permissions, and the controls that keep every JuanT workspace dependable.',
    stats: [['Active users', '72'], ['HR users', '03'], ['Open audit items', '03']],
    cards: [
      { icon: ShieldCheck, title: 'Access & permissions', detail: 'Edit schedules and sidebar permissions for every role', action: 'Review access', href: '/dashboard/system-admin/hr-access' },
      { icon: Users, title: 'User access', detail: '72 active users across 3 workspace roles', action: 'Manage users', href: '/dashboard/system-admin/users' },
    ],
  },
} as const

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: requestedRole } = await params
  const role = resolveRole(requestedRole)
  const data = dashboardData[role]

  return (
    <>
      <section>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">Dashboard / {role}</p>
        <h1 className="mt-5 max-w-3xl text-6xl font-semibold leading-[0.9] tracking-[-0.08em] sm:text-8xl">{data.title}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#111111]/60">{data.description}</p>
      </section>
      <section className="grid border-l border-t border-[#111111]/15 sm:grid-cols-3" aria-label="Summary metrics">
        {data.stats.map(([label, value]) => (
          <div key={label} className="border-b border-r border-[#111111]/15 p-5 sm:p-7">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</p>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{value}</p>
          </div>
        ))}
      </section>
      {role === 'employee' && <DashboardInsightsChart />}
      <section className="grid gap-px border border-[#111111]/15 bg-[#111111]/15 sm:grid-cols-2" aria-label="Workspace actions">
        {data.cards.map(({ icon: Icon, title, detail, action, href }) => (
          <article key={title} className="flex min-h-56 flex-col justify-between bg-[#f6f6f3] p-6 sm:p-8">
            <Icon aria-hidden="true" className="text-[#3159ff]" />
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
              <p className="mt-2 text-sm text-[#111111]/60">{detail}</p>
              <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3159ff]">
                {action}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
