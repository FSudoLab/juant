import { employeeNavigation, hrNavigation, managerNavigation, type NavGroup, type Role } from './navigation'

export type TeamRole = 'Employee' | 'HR' | 'Manager'
export type AccessMap = Record<string, Record<string, boolean>>

export const ACCESS_STORAGE_KEY = 'juant-access'
export const ACCESS_EVENT = 'juant-access-updated'

export const demoAccountByRole: Partial<Record<Role, string>> = {
  employee: 'e1',
  hr: 'hr1',
  manager: 'm1',
}

const navigationByTeamRole: Record<TeamRole, NavGroup[]> = {
  Employee: employeeNavigation,
  HR: hrNavigation,
  Manager: managerNavigation,
}

const lockedSections = new Set(['employees', 'settings', 'hr-settings'])

export const navKey = (href: string) => href.split('/').slice(3).join('/')

export function accessItemsFor(role: TeamRole) {
  return navigationByTeamRole[role].map((group) => ({
    heading: group.heading,
    items: group.items
      .filter((item) => navKey(item.href) !== '')
      .map((item) => ({ key: navKey(item.href), label: item.label, locked: lockedSections.has(navKey(item.href)) })),
  }))
}

export function readAccess(): AccessMap {
  try {
    return JSON.parse(window.localStorage.getItem(ACCESS_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function writeAccess(employeeId: string, access: Record<string, boolean>) {
  const next = { ...readAccess(), [employeeId]: access }
  window.localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(ACCESS_EVENT))
}
