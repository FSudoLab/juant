export type RecordType = 'Regular' | 'Rest Day' | 'Holiday' | 'Leave' | 'Absent'
export type RecordStatus = 'On time' | 'Late' | 'Undertime' | 'Approved'

export type RecordLocation = { place: string; source: string }

export type AttendanceRecord = {
  date: string
  weekday: string
  type: RecordType
  note?: string
  status?: RecordStatus
  timeIn?: string
  timeOut?: string
  inLocation?: RecordLocation
  outLocation?: RecordLocation
  hours: number | null
  breakHours: number | null
  ot: number | null
  late: number | null
  total: number | null
}

export type AttendanceMonth = { key: string; label: string; records: AttendanceRecord[] }

export type ManualRequest = {
  id: string
  date: string
  kind: string
  requested: string
  reason: string
  status: 'Pending' | 'Approved' | 'Declined'
}

const TODAY = '2026-10-10'
const SHIFT_START = 8 * 60 + 30
const SHIFT_END = 17 * 60 + 30
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const holidays: Record<string, string> = {
  '2026-08-21': 'Ninoy Aquino Day',
  '2026-08-31': 'National Heroes Day',
}
const leaves: Record<string, string> = {
  '2026-08-14': 'Sick leave',
  '2026-09-29': 'Vacation leave',
}
const absences = new Set(['2026-08-26'])

const pad = (value: number) => String(value).padStart(2, '0')
const round2 = (value: number) => Math.round(value * 100) / 100

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function formatClock(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${pad(hour12)}:${pad(m)} ${suffix}`
}

function emptyRecord(date: string, weekday: string, type: RecordType, note?: string): AttendanceRecord {
  return { date, weekday, type, note, hours: null, breakHours: null, ot: null, late: null, total: null }
}

function buildMonth(year: number, month: number): AttendanceMonth {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const records: AttendanceRecord[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${pad(month + 1)}-${pad(day)}`
    const dow = new Date(Date.UTC(year, month, day)).getUTCDay()
    const weekday = WEEKDAYS[dow]
    const isRestDay = dow === 0 || dow === 6

    if (isRestDay) {
      records.push(emptyRecord(date, weekday, 'Rest Day'))
      continue
    }
    if (date >= TODAY) {
      records.push(emptyRecord(date, weekday, 'Regular'))
      continue
    }
    if (holidays[date]) {
      records.push(emptyRecord(date, weekday, 'Holiday', holidays[date]))
      continue
    }
    if (leaves[date]) {
      records.push({ ...emptyRecord(date, weekday, 'Leave', leaves[date]), status: 'Approved', hours: 8, total: 8 })
      continue
    }
    if (absences.has(date)) {
      records.push({ ...emptyRecord(date, weekday, 'Absent'), hours: 0, total: 0 })
      continue
    }

    const seed = year * 10000 + (month + 1) * 100 + day
    const inMinutes = 8 * 60 + 14 + Math.floor(seeded(seed) * 24)
    const outRoll = seeded(seed * 3)
    let outMinutes = SHIFT_END + Math.floor(seeded(seed * 7) * 12)
    if (outRoll < 0.18) outMinutes = SHIFT_END + 30 + Math.floor(seeded(seed * 11) * 90)
    else if (outRoll > 0.94) outMinutes = SHIFT_END - 40 - Math.floor(seeded(seed * 13) * 30)

    const late = round2(Math.max(0, inMinutes - SHIFT_START) / 60)
    const undertime = round2(Math.max(0, SHIFT_END - outMinutes) / 60)
    const overtimeMinutes = Math.max(0, outMinutes - SHIFT_END)
    const ot = overtimeMinutes >= 30 ? Math.floor(overtimeMinutes / 30) * 0.5 : 0
    const hours = round2(8 - late - undertime)

    const remote = dow === 3
    const place = remote ? 'Remote · Quezon City' : 'Makati HQ · Ayala Ave'
    const accuracy = (n: number) => `${5 + Math.floor(seeded(seed * n) * 16)} m`

    records.push({
      date,
      weekday,
      type: 'Regular',
      status: late > 0 ? 'Late' : undertime > 0 ? 'Undertime' : 'On time',
      timeIn: formatClock(inMinutes),
      timeOut: formatClock(outMinutes),
      inLocation: { place, source: `Device · ±${accuracy(17)}` },
      outLocation: { place, source: `Device · ±${accuracy(19)}` },
      hours,
      breakHours: 1,
      ot,
      late,
      total: round2(hours + ot),
    })
  }

  return { key: `${year}-${pad(month + 1)}`, label: `${MONTHS[month]} ${year}`, records }
}

export const attendanceMonths: AttendanceMonth[] = [buildMonth(2026, 7), buildMonth(2026, 8), buildMonth(2026, 9)]

export const manualRequests: ManualRequest[] = [
  { id: 'MAN-0218', date: '2026-10-08', kind: 'Undertime', requested: 'Out 04:10 PM', reason: 'Medical appointment', status: 'Approved' },
  { id: 'MAN-0211', date: '2026-09-18', kind: 'Missed time-out', requested: 'Out 05:34 PM', reason: 'Phone battery died before clock-out', status: 'Approved' },
  { id: 'MAN-0207', date: '2026-09-09', kind: 'Missed time-in', requested: 'In 08:26 AM', reason: 'Location services were off', status: 'Approved' },
  { id: 'MAN-0199', date: '2026-08-26', kind: 'Attendance correction', requested: 'In 08:30 AM · Out 05:30 PM', reason: 'Field visit at client site', status: 'Declined' },
]
