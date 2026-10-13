import type { Role } from './navigation'

export type SystemKey = 'hr' | 'evaluation'
export type SystemConfig = Record<SystemKey, boolean>

export const SYSTEMS_STORAGE_KEY = 'juant-systems'
export const SYSTEMS_EVENT = 'juant-systems-updated'

// The demo employee belongs to this HR workspace, so they inherit its configuration.
export const DEMO_HR_ACCOUNT = 'hr1'

export const defaultSystemConfig: SystemConfig = { hr: true, evaluation: true }

export const systemDefinitions: { key: SystemKey; label: string; description: string; hrFeatures: string[]; employeeFeatures: string[] }[] = [
  {
    key: 'hr',
    label: 'HR system',
    description: 'Core HR operations: attendance, lifecycle, records, and compensation.',
    hrFeatures: ['Dashboard', 'Time In', 'Approval Center', 'Recruitment', 'Onboarding', 'Employee Management', 'Offboarding & Clearance', 'Organization Structure', 'Employee 201 Files', 'Company Documents', 'Payroll', 'Loans & Reimbursements', 'Government Contributions & Tax', 'Final Pay', 'Reports & Analytics', 'Ask Juan AI', 'Settings'],
    employeeFeatures: ['Dashboard', 'Time In', 'My Schedule', 'Leave Management', 'My Requests', 'Payroll & Payslips', 'My Documents', 'My Profile', 'Notifications', 'Ask Juan', 'Help & HR Support', 'Settings'],
  },
  {
    key: 'evaluation',
    label: 'Evaluation system',
    description: 'Performance reviews, peer evaluations, and evaluation surveys.',
    hrFeatures: ['Dashboard', 'Evaluations', 'Eval Surveys', 'Reports & Analytics', 'Ask Juan AI', 'Settings'],
    employeeFeatures: ['Dashboard', 'My Performance', 'Peer Evaluation', 'Ask Juan', 'Help & HR Support', 'Settings'],
  },
]

const sectionsBySystem: Record<'hr' | 'employee', Record<SystemKey, Set<string>>> = {
  hr: {
    hr: new Set(['', 'attendance', 'approval-center', 'recruitment', 'onboarding', 'employee-management', 'offboarding', 'organization-structure', '201-files', 'company-documents', 'payroll-runs', 'loans-reimbursements', 'government-contributions', 'final-pay', 'reports-analytics', 'ask-juan', 'hr-settings']),
    evaluation: new Set(['', 'evaluations', 'eval-surveys', 'reports-analytics', 'ask-juan', 'hr-settings']),
  },
  employee: {
    hr: new Set(['', 'attendance', 'schedule', 'leave', 'requests', 'payroll', 'documents', 'profile', 'notifications', 'ask-juan', 'help', 'settings']),
    evaluation: new Set(['', 'performance', 'peer-evaluation', 'ask-juan', 'help', 'settings']),
  },
}

export function isSectionEnabled(role: Role, section: string, config: SystemConfig) {
  if (role !== 'hr' && role !== 'employee') return true
  const systems = sectionsBySystem[role]
  return (Object.keys(systems) as SystemKey[]).some((key) => config[key] && systems[key].has(section))
}

export function readSystems(): Record<string, SystemConfig> {
  try {
    return JSON.parse(window.localStorage.getItem(SYSTEMS_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function systemConfigFor(accountId: string): SystemConfig {
  return { ...defaultSystemConfig, ...readSystems()[accountId] }
}

export function writeSystemConfig(accountId: string, config: SystemConfig) {
  window.localStorage.setItem(SYSTEMS_STORAGE_KEY, JSON.stringify({ ...readSystems(), [accountId]: config }))
  window.dispatchEvent(new Event(SYSTEMS_EVENT))
}
