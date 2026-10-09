import { ChevronDown, Coffee, MapPin } from 'lucide-react'
import type { AttendanceDay } from '@/lib/employee-data'
import { StatusBadge, statusTone } from '@/components/dashboard/primitives'

export function AttendanceLog({ days }: { days: AttendanceDay[] }) {
  return (
    <ul className="divide-y divide-[#111111]/15">
      {days.map((day) => (
        <li key={day.date}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 transition-colors hover:bg-[#111111]/[0.03] sm:px-6 [&::-webkit-details-marker]:hidden">
              <span className="w-16 shrink-0">
                <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{day.day}</span>
                <span className="block text-sm font-semibold">{day.date}</span>
              </span>
              <span className="hidden flex-1 font-mono text-sm sm:block">
                {day.timeIn} <span className="text-[#111111]/40">→</span> {day.timeOut}
              </span>
              <span className="flex-1 text-sm font-semibold sm:w-20 sm:flex-none">{day.hours}</span>
              <StatusBadge tone={statusTone(day.status)}>{day.status}</StatusBadge>
              <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#111111]/50 transition-transform group-open:rotate-180" />
              <span className="sr-only">Toggle details for {day.date}</span>
            </summary>
            <div className="grid gap-4 border-t border-dashed border-[#111111]/15 bg-white/60 px-5 py-4 text-sm sm:grid-cols-3 sm:px-6">
              <p className="flex items-center gap-2 text-[#111111]/70 sm:hidden">
                <span className="font-mono">{day.timeIn} → {day.timeOut}</span>
              </p>
              <p className="flex items-center gap-2 text-[#111111]/70">
                <Coffee aria-hidden="true" className="size-4 text-[#3159ff]" /> Break {day.breakTime}
              </p>
              <p className="flex items-center gap-2 text-[#111111]/70">
                <MapPin aria-hidden="true" className="size-4 text-[#3159ff]" /> {day.location}
              </p>
              <p className="text-[#111111]/70 sm:col-span-1">{day.note ?? 'No remarks for this day.'}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  )
}
