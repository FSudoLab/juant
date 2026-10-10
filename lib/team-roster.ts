import type { TeamRole } from './access'

export const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = (typeof dayKeys)[number]
export const dayLabels: Record<DayKey, { short: string; long: string }> = {
  mon: { short: 'Mon', long: 'Monday' },
  tue: { short: 'Tue', long: 'Tuesday' },
  wed: { short: 'Wed', long: 'Wednesday' },
  thu: { short: 'Thu', long: 'Thursday' },
  fri: { short: 'Fri', long: 'Friday' },
  sat: { short: 'Sat', long: 'Saturday' },
  sun: { short: 'Sun', long: 'Sunday' },
}

export type Shift = { start: string; end: string }
export type DaySchedule = { working: boolean; shift: Shift; split: boolean; second: Shift }
export type Schedule = { days: Record<DayKey, DaySchedule>; breakMinutes: number }

export const defaultSecondShift: Shift = { start: '18:00', end: '21:00' }

export function makeSchedule(workingDays: readonly DayKey[], start: string, end: string, overrides: Partial<Record<DayKey, Partial<DaySchedule>>> = {}): Schedule {
  const days = Object.fromEntries(
    dayKeys.map((key) => [key, { working: workingDays.includes(key), shift: { start, end }, split: false, second: defaultSecondShift, ...overrides[key] }]),
  ) as Record<DayKey, DaySchedule>
  return { days, breakMinutes: 60 }
}

function toMinutes(value: string) {
  const [h, m] = value.split(':').map(Number)
  return h * 60 + m
}

export function dayError(day: DaySchedule): string | null {
  if (!day.working) return null
  if (toMinutes(day.shift.end) <= toMinutes(day.shift.start)) return 'End time must be later than start time.'
  if (!day.split) return null
  if (toMinutes(day.second.start) < toMinutes(day.shift.end)) return 'Second shift must start after the first one ends.'
  if (toMinutes(day.second.end) <= toMinutes(day.second.start)) return 'Second shift must end after it starts.'
  return null
}

export function dayMinutes(day: DaySchedule) {
  if (!day.working) return 0
  const first = toMinutes(day.shift.end) - toMinutes(day.shift.start)
  const second = day.split ? toMinutes(day.second.end) - toMinutes(day.second.start) : 0
  return Math.max(first, 0) + Math.max(second, 0)
}

export function weeklyHours(schedule: Schedule) {
  const total = dayKeys.reduce((sum, key) => {
    const day = schedule.days[key]
    if (!day.working) return sum
    const breakMinutes = day.split ? 0 : schedule.breakMinutes
    return sum + Math.max(dayMinutes(day) - breakMinutes, 0)
  }, 0)
  return Math.round((total / 60) * 10) / 10
}

export function workingDaysLabel(schedule: Schedule) {
  const working = dayKeys.filter((key) => schedule.days[key].working)
  if (working.length === 0) return 'No working days'
  const indexes = working.map((key) => dayKeys.indexOf(key))
  const contiguous = indexes.every((value, i) => i === 0 || value === indexes[i - 1] + 1)
  if (contiguous && working.length > 2) return `${dayLabels[working[0]].short}–${dayLabels[working[working.length - 1]].short}`
  return working.map((key) => dayLabels[key].short).join(', ')
}

export function hoursLabel(schedule: Schedule) {
  const working = dayKeys.filter((key) => schedule.days[key].working).map((key) => schedule.days[key])
  if (working.length === 0) return 'Off all week'
  const signature = (d: DaySchedule) => `${d.shift.start}-${d.shift.end}-${d.split ? `${d.second.start}-${d.second.end}` : ''}`
  if (!working.every((d) => signature(d) === signature(working[0]))) return 'Varies by day'
  const d = working[0]
  const first = `${formatTime(d.shift.start)} – ${formatTime(d.shift.end)}`
  return d.split ? `${first} · ${formatTime(d.second.start)} – ${formatTime(d.second.end)}` : first
}

export type TeamMember = {
  id: string
  name: string
  empNo: string
  email: string
  department: string
  position: string
  role: TeamRole
  status: 'Active' | 'Probation' | 'Inactive'
  schedule: Schedule
}

export const weekdays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri']
const standard = makeSchedule(weekdays, '08:30', '17:30')

export const teamRoster: TeamMember[] = [
  { id: 'm1', name: 'Jordan Velasco', empNo: 'JT-0021', email: 'jordan.velasco@juant.demo', department: 'Engineering', position: 'Engineering Manager', role: 'Manager', status: 'Active', schedule: standard },
  { id: 'hr1', name: 'Taylor Morgan', empNo: 'JT-0034', email: 'taylor.morgan@juant.demo', department: 'People & Culture', position: 'HR Administrator', role: 'HR', status: 'Active', schedule: standard },
  { id: 'e6', name: 'Faye Tan', empNo: 'JT-0065', email: 'faye.tan@juant.demo', department: 'People & Culture', position: 'HR Generalist', role: 'HR', status: 'Inactive', schedule: standard },
  { id: 'e1', name: 'Alex Cruz', empNo: 'JT-0142', email: 'alex.cruz@juant.demo', department: 'Engineering', position: 'Frontend Engineer', role: 'Employee', status: 'Active', schedule: standard },
  { id: 'e2', name: 'Bea Ramos', empNo: 'JT-0118', email: 'bea.ramos@juant.demo', department: 'Operations', position: 'Ops Specialist', role: 'Employee', status: 'Active', schedule: makeSchedule([...weekdays, 'sat'], '08:30', '17:30', { sat: { shift: { start: '08:00', end: '12:00' } } }) },
  { id: 'e3', name: 'Carlo Dizon', empNo: 'JT-0201', email: 'carlo.dizon@juant.demo', department: 'Sales', position: 'Account Executive', role: 'Employee', status: 'Probation', schedule: makeSchedule(weekdays, '09:00', '18:00') },
  { id: 'e4', name: 'Dana Lim', empNo: 'JT-0097', email: 'dana.lim@juant.demo', department: 'Finance', position: 'Payroll Officer', role: 'Employee', status: 'Active', schedule: standard },
  { id: 'e5', name: 'Enzo Reyes', empNo: 'JT-0210', email: 'enzo.reyes@juant.demo', department: 'Engineering', position: 'QA Analyst', role: 'Employee', status: 'Probation', schedule: makeSchedule(weekdays, '08:00', '12:00', Object.fromEntries(weekdays.map((d) => [d, { split: true, second: { start: '18:00', end: '22:00' } }]))) },
  { id: 'e7', name: 'Mia Santos', empNo: 'JT-0156', email: 'mia.santos@juant.demo', department: 'Operations', position: 'Support Lead', role: 'Employee', status: 'Active', schedule: makeSchedule(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], '07:00', '16:00') },
  { id: 'e8', name: 'Noah Reyes', empNo: 'JT-0177', email: 'noah.reyes@juant.demo', department: 'Sales', position: 'Sales Associate', role: 'Employee', status: 'Active', schedule: standard },
]

export function formatTime(value: string) {
  const [h, m] = value.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}
