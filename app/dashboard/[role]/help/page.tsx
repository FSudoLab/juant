import { ChevronDown, LifeBuoy, Mail, Phone } from 'lucide-react'
import { PageIntro, Panel, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { requireEmployee } from '@/lib/roles'

const channels = [
  { icon: Mail, title: 'Email HR', detail: 'hr@juant.ph', hint: 'Replies within 1 business day' },
  { icon: Phone, title: 'HR hotline', detail: '+63 2 8555 0100', hint: 'Mon–Fri, 08:30–17:30' },
  { icon: LifeBuoy, title: 'Walk-in', detail: '12F, Makati HQ', hint: 'People team desk' },
]

const faqs = [
  { question: 'How far ahead should I file a vacation leave?', answer: 'At least 3 working days before the start date. Leaves of 5 days or more should be filed 2 weeks ahead.' },
  { question: 'I forgot to time out. What should I do?', answer: 'File an attendance correction from My Requests within 2 days. Your manager will review and approve it.' },
  { question: 'When are government contributions deducted?', answer: 'SSS, PhilHealth, and Pag-IBIG are deducted on the second cutoff of each month.' },
  { question: 'How do I update my bank account for payroll?', answer: 'Send a request to HR with a copy of your bank certificate. Changes take effect on the next cutoff.' },
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
        <ul className="divide-y divide-[#111111]/15">
          {faqs.map((faq) => (
            <li key={faq.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold hover:bg-[#111111]/[0.03] sm:px-6 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#111111]/50 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-[#111111]/70 sm:px-6">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>
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
