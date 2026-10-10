export type DocumentStatus = 'Verified' | 'For review' | 'Missing'
export type FileStatus = 'Complete' | 'For review' | 'Incomplete'

export type EmployeeDocument = { name: string; category: 'Pre-employment' | 'Government' | 'Education' | 'Contract'; status: DocumentStatus; uploaded?: string }

export type EmployeeFile = {
  id: string
  name: string
  empNo: string
  department: string
  position: string
  updated: string
  lastReminder?: string
  documents: EmployeeDocument[]
}

export const requiredDocuments: Pick<EmployeeDocument, 'name' | 'category'>[] = [
  { name: 'Resume / CV', category: 'Pre-employment' },
  { name: 'PSA birth certificate', category: 'Pre-employment' },
  { name: 'NBI clearance', category: 'Pre-employment' },
  { name: 'Medical certificate', category: 'Pre-employment' },
  { name: '2x2 ID photo', category: 'Pre-employment' },
  { name: 'TIN', category: 'Government' },
  { name: 'SSS E-1', category: 'Government' },
  { name: 'PhilHealth MDR', category: 'Government' },
  { name: 'Pag-IBIG MDF', category: 'Government' },
  { name: 'Diploma', category: 'Education' },
  { name: 'Transcript of records', category: 'Education' },
  { name: 'Signed employment contract', category: 'Contract' },
]

function buildDocuments(overrides: Record<string, DocumentStatus>, uploaded: string): EmployeeDocument[] {
  return requiredDocuments.map((doc) => {
    const status = overrides[doc.name] ?? 'Verified'
    return { ...doc, status, uploaded: status === 'Missing' ? undefined : uploaded }
  })
}

export const employeeFiles: EmployeeFile[] = [
  { id: 'f1', name: 'Alex Cruz', empNo: 'JT-0142', department: 'Engineering', position: 'Frontend Engineer', updated: 'Oct 2', documents: buildDocuments({}, 'Oct 2') },
  { id: 'f2', name: 'Bea Ramos', empNo: 'JT-0118', department: 'Operations', position: 'Ops Specialist', updated: 'Sep 18', documents: buildDocuments({}, 'Sep 18') },
  { id: 'f3', name: 'Carlo Dizon', empNo: 'JT-0201', department: 'Sales', position: 'Account Executive', updated: 'Oct 7', documents: buildDocuments({ 'NBI clearance': 'Missing', TIN: 'Missing', 'Medical certificate': 'For review' }, 'Oct 7') },
  { id: 'f4', name: 'Dana Lim', empNo: 'JT-0097', department: 'Finance', position: 'Payroll Officer', updated: 'Oct 5', documents: buildDocuments({ 'PhilHealth MDR': 'For review' }, 'Oct 5') },
  { id: 'f5', name: 'Enzo Reyes', empNo: 'JT-0210', department: 'Engineering', position: 'QA Analyst', updated: 'Oct 9', documents: buildDocuments({ Diploma: 'For review', 'Transcript of records': 'For review' }, 'Oct 9') },
  { id: 'f6', name: 'Faye Tan', empNo: 'JT-0065', department: 'People & Culture', position: 'HR Generalist', updated: 'Aug 21', documents: buildDocuments({}, 'Aug 21') },
  { id: 'f7', name: 'Gino Navarro', empNo: 'JT-0215', department: 'Operations', position: 'Logistics Coordinator', updated: 'Oct 1', lastReminder: 'Oct 3', documents: buildDocuments({ 'Medical certificate': 'Missing', 'SSS E-1': 'Missing', 'Pag-IBIG MDF': 'Missing' }, 'Oct 1') },
]

export function fileStatus(file: EmployeeFile): FileStatus {
  if (file.documents.some((doc) => doc.status === 'Missing')) return 'Incomplete'
  if (file.documents.some((doc) => doc.status === 'For review')) return 'For review'
  return 'Complete'
}

export function countByStatus(file: EmployeeFile, status: DocumentStatus) {
  return file.documents.filter((doc) => doc.status === status).length
}
