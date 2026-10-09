import { ArrowUpRight } from 'lucide-react'
import { PageIntro, Panel, StatGrid, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { myRequests } from '@/lib/employee-data'
import { requireEmployee } from '@/lib/roles'

const requestTypes = ['Leave', 'Overtime', 'Attendance correction', 'Schedule change', 'Certificate of Employment', 'Reimbursement']

export default async function RequestsPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)
  const count = (status: string) => myRequests.filter((request) => request.status === status).length

  return (
    <>
      <PageIntro eyebrow="Workspace / My Requests" title="My requests" description="Everything you have filed with your manager or HR, in one place." />
      <StatGrid
        label="Request summary"
        stats={[
          { label: 'Total filed', value: String(myRequests.length), hint: 'Last 60 days' },
          { label: 'Pending', value: String(count('Pending')) },
          { label: 'Approved', value: String(count('Approved')) },
          { label: 'Declined', value: String(count('Declined')) },
        ]}
      />
      <Panel title="New request" description="Choose what you want to file">
        <ul className="grid gap-px bg-[#111111]/15 sm:grid-cols-3">
          {requestTypes.map((type) => (
            <li key={type} className="bg-[#f6f6f3]">
              <button type="button" className="flex w-full items-center justify-between gap-3 p-5 text-left text-sm font-semibold transition-colors hover:bg-[#3159ff] hover:text-white">
                {type}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Request history">
        <ul className="divide-y divide-[#111111]/15">
          {myRequests.map((request) => (
            <li key={request.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{request.id} · {request.type}</p>
                <p className="font-semibold">{request.summary}</p>
                <p className="text-xs text-[#111111]/60">Filed {request.filed} · Approver: {request.approver}</p>
              </div>
              <StatusBadge tone={statusTone(request.status)}>{request.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
