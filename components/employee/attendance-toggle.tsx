import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Clock3 } from 'lucide-react'
import { attendanceThisWeek } from '@/lib/employee-data'
import { AttendanceLog } from './attendance-log'

export function AttendanceToggle() {
  const onTime = attendanceThisWeek.filter((day) => day.status === 'On time').length

  return (
    <details className="group/attendance border border-[#111111]/15" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-[#111111]/[0.03] sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-4">
          <span className="flex size-10 items-center justify-center bg-[#3159ff] text-white">
            <Clock3 aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-[-0.04em]">My attendance this week</span>
            <span className="block text-sm text-[#111111]/60">
              {attendanceThisWeek.length} days logged · {onTime} on time
            </span>
          </span>
        </span>
        <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/60">
          <span className="hidden group-open/attendance:inline">Hide</span>
          <span className="group-open/attendance:hidden">Show</span>
          <span className="flex size-8 items-center justify-center border border-[#111111]/15">
            <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open/attendance:rotate-180" />
          </span>
        </span>
      </summary>
      <div className="border-t border-[#111111]/15">
        <AttendanceLog days={attendanceThisWeek} />
        <div className="border-t border-[#111111]/15 px-5 py-4 sm:px-6">
          <Link href="/dashboard/employee/attendance" className="inline-flex items-center gap-2 text-sm font-semibold text-[#3159ff]">
            View full attendance <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </details>
  )
}
