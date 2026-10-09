import { Plus } from 'lucide-react'
import { PageIntro, Panel, PrimaryButton, ProgressBar, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { leaveBalances, leaveHistory } from '@/lib/employee-data'
import { requireEmployee } from '@/lib/roles'

export default async function LeavePage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro
        eyebrow="Workspace / Leave Management"
        title="Leave management"
        description="Track your leave credits and the status of every leave you have filed."
        action={<PrimaryButton><Plus aria-hidden="true" className="size-4" /> File a leave</PrimaryButton>}
      />
      <section className="grid border-l border-t border-[#111111]/15 sm:grid-cols-2 lg:grid-cols-4" aria-label="Leave balances">
        {leaveBalances.map((leave) => {
          const remaining = leave.total - leave.used
          return (
            <div key={leave.type} className="flex flex-col gap-4 border-b border-r border-[#111111]/15 p-5 sm:p-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{leave.type}</p>
              <p className="text-3xl font-semibold tracking-[-0.05em]">
                {remaining}
                <span className="text-base font-medium text-[#111111]/50"> / {leave.total} days</span>
              </p>
              <ProgressBar value={(remaining / leave.total) * 100} label={`${leave.type} remaining`} />
            </div>
          )
        })}
      </section>
      <Panel title="Leave history" description="2026 calendar year">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#111111]/50">
              <tr className="border-b border-[#111111]/15">
                <th scope="col" className="px-5 py-3 font-bold sm:px-6">Type</th>
                <th scope="col" className="px-5 py-3 font-bold">Dates</th>
                <th scope="col" className="px-5 py-3 font-bold">Days</th>
                <th scope="col" className="px-5 py-3 font-bold sm:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {leaveHistory.map((leave) => (
                <tr key={leave.dates}>
                  <td className="px-5 py-4 font-semibold sm:px-6">{leave.type}</td>
                  <td className="px-5 py-4 text-[#111111]/70">{leave.dates}</td>
                  <td className="px-5 py-4">{leave.days}</td>
                  <td className="px-5 py-4 sm:px-6"><StatusBadge tone={statusTone(leave.status)}>{leave.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}
