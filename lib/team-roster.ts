import type { TeamRole } from './access'

export type Workweek = 'monday-friday' | 'monday-saturday' | 'all-week'
export type Schedule = { workweek: Workweek; start: string; end: string; breakMinutes: number }

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

export const workweekLabels: Record<Workweek, string> = {
  'monday-friday': 'Mon–Fri',
  'monday-saturday': 'Mon–Sat',
  'all-week': 'Mon–Sun',
}

const standard: Schedule = { workweek: 'monday-friday', start: '08:30', end: '17:30', breakMinutes: 60 }

export const teamRoster: TeamMember[] = [
  { id: 'm1', name: 'Jordan Velasco', empNo: 'JT-0021', email: 'jordan.velasco@juant.demo', department: 'Engineering', position: 'Engineering Manager', role: 'Manager', status: 'Active', schedule: standard },
  { id: 'hr1', name: 'Taylor Morgan', empNo: 'JT-0034', email: 'taylor.morgan@juant.demo', department: 'People & Culture', position: 'HR Administrator', role: 'HR', status: 'Active', schedule: standard },
  { id: 'e6', name: 'Faye Tan', empNo: 'JT-0065', email: 'faye.tan@juant.demo', department: 'People & Culture', position: 'HR Generalist', role: 'HR', status: 'Inactive', schedule: standard },
  { id: 'e1', name: 'Alex Cruz', empNo: 'JT-0142', email: 'alex.cruz@juant.demo', department: 'Engineering', position: 'Frontend Engineer', role: 'Employee', status: 'Active', schedule: standard },
  { id: 'e2', name: 'Bea Ramos', empNo: 'JT-0118', email: 'bea.ramos@juant.demo', department: 'Operations', position: 'Ops Specialist', role: 'Employee', status: 'Active', schedule: { ...standard, workweek: 'monday-saturday' } },
  { id: 'e3', name: 'Carlo Dizon', empNo: 'JT-0201', email: 'carlo.dizon@juant.demo', department: 'Sales', position: 'Account Executive', role: 'Employee', status: 'Probation', schedule: { ...standard, start: '09:00', end: '18:00' } },
  { id: 'e4', name: 'Dana Lim', empNo: 'JT-0097', email: 'dana.lim@juant.demo', department: 'Finance', position: 'Payroll Officer', role: 'Employee', status: 'Active', schedule: standard },
  { id: 'e5', name: 'Enzo Reyes', empNo: 'JT-0210', email: 'enzo.reyes@juant.demo', department: 'Engineering', position: 'QA Analyst', role: 'Employee', status: 'Probation', schedule: { ...standard, start: '10:00', end: '19:00' } },
  { id: 'e7', name: 'Mia Santos', empNo: 'JT-0156', email: 'mia.santos@juant.demo', department: 'Operations', position: 'Support Lead', role: 'Employee', status: 'Active', schedule: { ...standard, workweek: 'all-week', start: '07:00', end: '16:00' } },
  { id: 'e8', name: 'Noah Reyes', empNo: 'JT-0177', email: 'noah.reyes@juant.demo', department: 'Sales', position: 'Sales Associate', role: 'Employee', status: 'Active', schedule: standard },
]

export function formatTime(value: string) {
  const [h, m] = value.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}
