import { PageIntro, Panel, StatGrid, StatusBadge } from '@/components/dashboard/primitives'
import { requireEmployee } from '@/lib/roles'

const week = [
  { day: 'Mon', date: 'Oct 12', shift: '08:30–17:30', type: 'Onsite', location: 'Makati HQ' },
  { day: 'Tue', date: 'Oct 13', shift: '08:30–17:30', type: 'Onsite', location: 'Makati HQ' },
  { day: 'Wed', date: 'Oct 14', shift: '08:30–17:30', type: 'Remote', location: 'Home' },
  { day: 'Thu', date: 'Oct 15', shift: '08:30–17:30', type: 'Onsite', location: 'Makati HQ' },
  { day: 'Fri', date: 'Oct 16', shift: '08:30–17:30', type: 'Remote', location: 'Home' },
  { day: 'Sat', date: 'Oct 17', shift: 'Rest day', type: 'Off', location: '—' },
  { day: 'Sun', date: 'Oct 18', shift: 'Rest day', type: 'Off', location: '—' },
]

const holidays = [
  { name: 'All Saints’ Day', date: 'Sun, Nov 1', type: 'Special non-working' },
  { name: 'All Souls’ Day', date: 'Mon, Nov 2', type: 'Special non-working' },
  { name: 'Bonifacio Day', date: 'Mon, Nov 30', type: 'Regular holiday' },
  { name: 'Christmas Day', date: 'Fri, Dec 25', type: 'Regular holiday' },
]

export default async function SchedulePage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro eyebrow="Workspace / My Schedule" title="My schedule" description="Your assigned shifts, work arrangement, and upcoming holidays." />
      <StatGrid
        label="Schedule summary"
        stats={[
          { label: 'Shift', value: '08:30–17:30', hint: 'Day shift' },
          { label: 'Arrangement', value: 'Hybrid', hint: '3 onsite · 2 remote' },
          { label: 'Rest days', value: 'Sat–Sun' },
          { label: 'Next holiday', value: 'Nov 1', hint: 'All Saints’ Day' },
        ]}
      />
      <Panel title="Next week" description="Oct 12 – Oct 18, 2026">
        <ul className="grid divide-y divide-[#111111]/15 sm:grid-cols-7 sm:divide-x sm:divide-y-0">
          {week.map((item) => (
            <li key={item.date} className={`flex items-center justify-between gap-3 p-4 sm:flex-col sm:items-start sm:justify-start ${item.type === 'Off' ? 'bg-[#111111]/[0.04]' : ''}`}>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{item.day}</p>
                <p className="text-sm font-semibold">{item.date}</p>
              </div>
              <div className="flex flex-col items-end gap-2 sm:mt-6 sm:items-start">
                <p className="text-sm font-semibold">{item.shift}</p>
                <StatusBadge tone={item.type === 'Onsite' ? 'blue' : item.type === 'Remote' ? 'dark' : 'neutral'}>{item.type}</StatusBadge>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Upcoming holidays" description="Philippine holidays affecting your schedule">
        <ul className="divide-y divide-[#111111]/15">
          {holidays.map((holiday) => (
            <li key={holiday.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-semibold">{holiday.name}</p>
                <p className="text-sm text-[#111111]/60">{holiday.date}</p>
              </div>
              <StatusBadge tone={holiday.type === 'Regular holiday' ? 'blue' : 'neutral'}>{holiday.type}</StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
