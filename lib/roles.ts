import { notFound } from 'next/navigation'
import type { Role } from './navigation'

export function resolveRole(requestedRole: string): Role {
  if (requestedRole === 'hr' || requestedRole === 'system-admin') return requestedRole
  return 'employee'
}

export async function requireAnyRole(params: Promise<{ role: string }>): Promise<Role> {
  const { role } = await params
  if (role !== 'employee' && role !== 'hr' && role !== 'system-admin') notFound()
  return role
}

export async function requireEmployee(params: Promise<{ role: string }>) {
  const { role } = await params
  if (role !== 'employee') notFound()
}
