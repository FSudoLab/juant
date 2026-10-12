import { employeeNavigation, hrNavigation, type NavGroup, type Role } from './navigation'

export type TeamRole = 'Employee' | 'HR'
export type AccessMap = Record<string, Record<string, boolean>>

export const ACCESS_STORAGE_KEY = 'juant-access'
export const ACCESS_EVENT = 'juant-access-updated'

export const demoAccountByRole: Partial<Record<Role, string>> = {
  employee: 'e1',
  hr: 'hr1',
}

const navigationByTeamRole: Record<TeamRole, NavGroup[]> = {
  Employee: employeeNavigation,
  HR: hrNavigation,
}

const lockedSections = new Set(['employee-management', 'team-overview', 'settings', 'hr-settings'])

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

export const POWER_STORAGE_KEY = 'juant-power-users'
export const powerAccessId = (employeeId: string) => `power:${employeeId}`

// HR-exclusive sections stay with HR so it remains the top of the hierarchy.
const hrOnlySections = new Set(['', 'team-overview', 'manager-settings', 'hr-settings', 'settings'])

export function powerAccessItems() {
  return hrNavigation
    .map((group) => ({
      heading: group.heading,
      items: group.items
        .filter((item) => !hrOnlySections.has(navKey(item.href)))
        .map((item) => ({ key: navKey(item.href), label: item.label, locked: false })),
    }))
    .filter((group) => group.items.length > 0)
}

export function powerNavigationFor(access: Record<string, boolean>): NavGroup[] {
  return hrNavigation
    .map((group) => ({
      heading: `Power · ${group.heading}`,
      items: group.items.filter((item) => !hrOnlySections.has(navKey(item.href)) && access[navKey(item.href)] !== false),
    }))
    .filter((group) => group.items.length > 0)
}

export function readPowerUsers(): Record<string, boolean> {
  try {
    return JSON.parse(window.localStorage.getItem(POWER_STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function writePowerUser(employeeId: string, isPower: boolean) {
  const next = { ...readPowerUsers(), [employeeId]: isPower }
  window.localStorage.setItem(POWER_STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(ACCESS_EVENT))
}
