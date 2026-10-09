import { CalendarCheck } from 'lucide-react'
import { PageIntro, Panel, StatGrid } from '@/components/dashboard/primitives'
import { AttendanceLog } from '@/components/employee/attendance-log'
import { attendanceLastWeek, attendanceThisWeek } from '@/lib/employee-data'
import { requireEmployee } from '@/lib/roles'

export default async function AttendancePage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro
        eyebrow="Workspace / My Attendance"
        title="My attendance"
        description="Your daily time records. Expand any day to see breaks, work location, and remarks."
        action={
          <div className="flex items-center gap-3 border border-[#111111]/15 p-4">
            <CalendarCheck aria-hidden="true" className="size-5 text-[#3159ff]" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">Last time-out</p>
              <p className="text-sm font-semibold">Fri, Oct 9 · 17:30</p>
            </div>
          </div>
        }
      />
      <StatGrid
        label="Attendance summary"
        stats={[
          { label: 'Days present', value: '18 / 19', hint: 'October to date' },
          { label: 'Late arrivals', value: '2', hint: '26 minutes total' },
          { label: 'Undertime', value: '1', hint: 'Approved' },
          { label: 'Avg. hours/day', value: '8h 31m', hint: 'Target 8h' },
        ]}
      />
      <Panel title="This week" description="Oct 5 – Oct 9, 2026">
        <AttendanceLog days={attendanceThisWeek} />
      </Panel>
      <Panel title="Last week" description="Sep 28 – Oct 2, 2026">
        <AttendanceLog days={attendanceLastWeek} />
      </Panel>
    </>
  )
}
