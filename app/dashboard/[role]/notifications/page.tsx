import { Bell, CalendarDays, CheckCircle2, FileText, Wallet } from 'lucide-react'
import { PageIntro, Panel } from '@/components/dashboard/primitives'
import { requireEmployee } from '@/lib/roles'

const notifications = [
  { icon: CheckCircle2, title: 'Overtime request received', body: 'Your 2h overtime for Oct 9 is waiting for Maria Santos.', time: '2h ago', unread: true },
  { icon: Wallet, title: 'Payslip available', body: 'Your payslip for Sep 16–30 is ready to download.', time: 'Yesterday', unread: true },
  { icon: FileText, title: 'Certificate of Employment ready', body: 'HR has uploaded your COE to My Documents.', time: 'Oct 2', unread: true },
  { icon: CalendarDays, title: 'Holiday reminder', body: 'Nov 1–2 are special non-working days.', time: 'Oct 1', unread: false },
  { icon: Bell, title: 'Policy update', body: 'The 2026 data privacy policy has been updated. Please review.', time: 'Sep 28', unread: false },
]

export default async function NotificationsPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)
  const unread = notifications.filter((notification) => notification.unread).length

  return (
    <>
      <PageIntro eyebrow="Support / Notifications" title="Notifications" description="Approvals, payroll updates, reminders, and announcements from HR." />
      <Panel title="All notifications" description={`${unread} unread`}>
        <ul className="divide-y divide-[#111111]/15">
          {notifications.map(({ icon: Icon, title, body, time, unread: isUnread }) => (
            <li key={title} className={`flex items-start gap-4 px-5 py-4 sm:px-6 ${isUnread ? 'bg-[#3159ff]/[0.05]' : ''}`}>
              <span className={`flex size-10 shrink-0 items-center justify-center ${isUnread ? 'bg-[#3159ff] text-white' : 'border border-[#111111]/15 text-[#111111]/60'}`}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {title}
                  {isUnread && <span className="sr-only"> (unread)</span>}
                </p>
                <p className="mt-0.5 text-sm text-[#111111]/60">{body}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-[#111111]/50">{time}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
