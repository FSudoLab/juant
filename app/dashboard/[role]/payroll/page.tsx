import { Download } from 'lucide-react'
import { PageIntro, Panel, StatGrid } from '@/components/dashboard/primitives'
import { latestPayslip, payslips, peso } from '@/lib/employee-data'
import { requireEmployee } from '@/lib/roles'

function LineItems({ title, items, total }: { title: string; items: { label: string; amount: number }[]; total: number }) {
  return (
    <div className="flex flex-col p-5 sm:p-6">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{title}</p>
      <dl className="mt-4 flex flex-col gap-3 text-sm">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between gap-4">
            <dt className="text-[#111111]/70">{item.label}</dt>
            <dd className="font-mono">{peso(item.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-[#111111]/15 pt-3 font-semibold">
          <dt>Total</dt>
          <dd className="font-mono">{peso(total)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default async function PayrollPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)
  const gross = latestPayslip.earnings.reduce((sum, item) => sum + item.amount, 0)
  const deductions = latestPayslip.deductions.reduce((sum, item) => sum + item.amount, 0)

  return (
    <>
      <PageIntro eyebrow="My Employment / Payroll & Payslips" title="Payroll & payslips" description="Semi-monthly pay, itemized. Download any payslip for your records." />
      <StatGrid
        label="Payroll summary"
        stats={[
          { label: 'Latest net pay', value: peso(gross - deductions), hint: latestPayslip.payDate },
          { label: 'Next pay date', value: 'Oct 15', hint: 'Oct 1–15 cutoff' },
          { label: 'YTD gross', value: peso(589000) },
          { label: 'YTD tax withheld', value: peso(56988) },
        ]}
      />
      <Panel title="Latest payslip" description={`${latestPayslip.period} · Paid ${latestPayslip.payDate}`}>
        <div className="grid divide-y divide-[#111111]/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <LineItems title="Earnings" items={latestPayslip.earnings} total={gross} />
          <LineItems title="Deductions" items={latestPayslip.deductions} total={deductions} />
        </div>
        <div className="flex items-center justify-between border-t border-[#111111]/15 bg-[#111111] px-5 py-4 text-[#f6f6f3] sm:px-6">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">Net pay</span>
          <span className="text-2xl font-semibold tracking-[-0.04em]">{peso(gross - deductions)}</span>
        </div>
      </Panel>
      <Panel title="Payslip history">
        <ul className="divide-y divide-[#111111]/15">
          {payslips.map((slip) => (
            <li key={slip.period} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div>
                <p className="font-semibold">{slip.period}</p>
                <p className="text-xs text-[#111111]/60">Paid {slip.payDate} · Gross {peso(slip.gross)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden font-mono text-sm font-semibold sm:inline">{peso(slip.net)}</span>
                <button type="button" className="inline-flex items-center gap-2 border border-[#111111]/15 px-3 py-2 text-xs font-semibold hover:border-[#3159ff] hover:text-[#3159ff]">
                  <Download aria-hidden="true" className="size-4" />
                  <span>PDF</span>
                  <span className="sr-only">payslip for {slip.period}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
