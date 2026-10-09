export type AttendanceStatus = 'On time' | 'Late' | 'Undertime' | 'On leave' | 'Rest day'

export type AttendanceDay = {
  day: string
  date: string
  timeIn: string
  timeOut: string
  hours: string
  status: AttendanceStatus
  breakTime: string
  location: string
  note?: string
}

export const attendanceThisWeek: AttendanceDay[] = [
  { day: 'Mon', date: 'Oct 5', timeIn: '08:27', timeOut: '17:04', hours: '8h 37m', status: 'On time', breakTime: '12:00–13:00', location: 'Makati HQ' },
  { day: 'Tue', date: 'Oct 6', timeIn: '08:41', timeOut: '17:15', hours: '8h 34m', status: 'Late', breakTime: '12:05–13:00', location: 'Makati HQ', note: '11 minutes late — traffic along EDSA.' },
  { day: 'Wed', date: 'Oct 7', timeIn: '08:25', timeOut: '17:02', hours: '8h 37m', status: 'On time', breakTime: '12:00–13:00', location: 'Remote' },
  { day: 'Thu', date: 'Oct 8', timeIn: '08:30', timeOut: '16:10', hours: '7h 40m', status: 'Undertime', breakTime: '12:00–12:30', location: 'Makati HQ', note: 'Approved half-hour undertime for a medical appointment.' },
  { day: 'Fri', date: 'Oct 9', timeIn: '08:22', timeOut: '17:30', hours: '9h 08m', status: 'On time', breakTime: '12:00–13:00', location: 'Makati HQ' },
]

export const attendanceLastWeek: AttendanceDay[] = [
  { day: 'Mon', date: 'Sep 28', timeIn: '08:29', timeOut: '17:01', hours: '8h 32m', status: 'On time', breakTime: '12:00–13:00', location: 'Makati HQ' },
  { day: 'Tue', date: 'Sep 29', timeIn: '—', timeOut: '—', hours: '—', status: 'On leave', breakTime: '—', location: '—', note: 'Vacation leave (approved).' },
  { day: 'Wed', date: 'Sep 30', timeIn: '08:28', timeOut: '17:05', hours: '8h 37m', status: 'On time', breakTime: '12:00–13:00', location: 'Remote' },
  { day: 'Thu', date: 'Oct 1', timeIn: '08:45', timeOut: '17:20', hours: '8h 35m', status: 'Late', breakTime: '12:00–13:00', location: 'Makati HQ', note: '15 minutes late.' },
  { day: 'Fri', date: 'Oct 2', timeIn: '08:20', timeOut: '17:00', hours: '8h 40m', status: 'On time', breakTime: '12:00–13:00', location: 'Makati HQ' },
]

export const leaveBalances = [
  { type: 'Vacation leave', used: 1, total: 15 },
  { type: 'Sick leave', used: 2, total: 10 },
  { type: 'Emergency leave', used: 0, total: 3 },
  { type: 'Birthday leave', used: 0, total: 1 },
]

export type RequestStatus = 'Pending' | 'Approved' | 'Declined'

export const leaveHistory: { type: string; dates: string; days: number; status: RequestStatus }[] = [
  { type: 'Vacation leave', dates: 'Oct 22–26, 2026', days: 5, status: 'Pending' },
  { type: 'Vacation leave', dates: 'Sep 29, 2026', days: 1, status: 'Approved' },
  { type: 'Sick leave', dates: 'Aug 14–15, 2026', days: 2, status: 'Approved' },
  { type: 'Emergency leave', dates: 'Jun 3, 2026', days: 1, status: 'Declined' },
]

export const myRequests: { id: string; type: string; summary: string; filed: string; approver: string; status: RequestStatus }[] = [
  { id: 'REQ-1042', type: 'Leave', summary: 'Vacation leave · Oct 22–26', filed: 'Oct 8', approver: 'Maria Santos', status: 'Pending' },
  { id: 'REQ-1039', type: 'Overtime', summary: '2h overtime · Oct 9', filed: 'Oct 9', approver: 'Maria Santos', status: 'Pending' },
  { id: 'REQ-1031', type: 'Certificate', summary: 'Certificate of Employment', filed: 'Oct 1', approver: 'HR Team', status: 'Approved' },
  { id: 'REQ-1024', type: 'Schedule change', summary: 'Shift to 07:30–16:30 on Fridays', filed: 'Sep 22', approver: 'Maria Santos', status: 'Declined' },
  { id: 'REQ-1017', type: 'Attendance correction', summary: 'Missed time-out · Sep 18', filed: 'Sep 19', approver: 'Maria Santos', status: 'Approved' },
]

export const payslips = [
  { period: 'Sep 16–30, 2026', payDate: 'Sep 30', gross: 32500, net: 27184 },
  { period: 'Sep 1–15, 2026', payDate: 'Sep 15', gross: 32500, net: 27184 },
  { period: 'Aug 16–31, 2026', payDate: 'Aug 31', gross: 33850, net: 28212 },
  { period: 'Aug 1–15, 2026', payDate: 'Aug 15', gross: 32500, net: 27184 },
]

export const latestPayslip = {
  period: 'Sep 16–30, 2026',
  payDate: 'Sep 30, 2026',
  earnings: [
    { label: 'Basic pay', amount: 30000 },
    { label: 'Rice subsidy', amount: 1000 },
    { label: 'Transportation allowance', amount: 1500 },
  ],
  deductions: [
    { label: 'Withholding tax', amount: 3166 },
    { label: 'SSS', amount: 1350 },
    { label: 'PhilHealth', amount: 750 },
    { label: 'Pag-IBIG', amount: 50 },
  ],
}

export const peso = (amount: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(amount)
