import { PageIntro } from '@/components/dashboard/primitives'
import { AttendanceRecords } from '@/components/employee/attendance-records'
import { TimeClock } from '@/components/employee/time-clock'
import { attendanceMonths, manualRequests } from '@/lib/attendance-records'
import { requireEmployee } from '@/lib/roles'

export default async function TimeInPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro
        eyebrow="Workspace / Time In"
        title="Time in"
        description="Clock in and out with your location, then review your daily time records month by month."
      />
      <TimeClock />
      <AttendanceRecords months={attendanceMonths} manual={manualRequests} />
    </>
  )
}
