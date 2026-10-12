import { LifeBuoy, Mail, Phone } from 'lucide-react'
import { PageIntro, Panel, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { FaqList } from '@/components/employee/faq-list'
import { requireEmployee } from '@/lib/roles'

const channels = [
  { icon: Mail, title: 'Email HR', detail: 'hr@juant.ph', hint: 'Replies within 1 business day' },
  { icon: Phone, title: 'HR hotline', detail: '+63 2 8555 0100', hint: 'Mon–Fri, 08:30–17:30' },
  { icon: LifeBuoy, title: 'Walk-in', detail: '12F, Makati HQ', hint: 'People team desk' },
]

const tickets = [
  { id: 'HR-318', subject: 'Clarification on transportation allowance', updated: 'Oct 7', status: 'Open' },
  { id: 'HR-297', subject: 'Update emergency contact', updated: 'Sep 12', status: 'Resolved' },
]

export default async function HelpPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro eyebrow="Support / Help & HR Support" title="Help & HR support" description="Find quick answers or reach the People team directly." />
      <section className="grid gap-px border border-[#111111]/15 bg-[#111111]/15 sm:grid-cols-3" aria-label="Contact channels">
        {channels.map(({ icon: Icon, title, detail, hint }) => (
          <div key={title} className="flex flex-col gap-6 bg-[#f6f6f3] p-5 sm:p-6">
            <Icon aria-hidden="true" className="size-5 text-[#3159ff]" />
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{title}</p>
              <p className="mt-1 font-semibold">{detail}</p>
              <p className="text-xs text-[#111111]/60">{hint}</p>
            </div>
          </div>
        ))}
      </section>
      <Panel title="Frequently asked questions">
        <FaqList />
      </Panel>
      <Panel title="My support tickets">
        <ul className="divide-y divide-[#111111]/15">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{ticket.id}</p>
                <p className="font-semibold">{ticket.subject}</p>
                <p className="text-xs text-[#111111]/60">Updated {ticket.updated}</p>
              </div>
              <StatusBadge tone={statusTone(ticket.status)}>{ticket.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
