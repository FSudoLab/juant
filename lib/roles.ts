import { notFound } from 'next/navigation'
import type { Role } from './navigation'

export function resolveRole(requestedRole: string): Role {
  return requestedRole === 'hr' ? 'hr' : 'employee'
}

export async function requireAnyRole(params: Promise<{ role: string }>): Promise<Role> {
  const { role } = await params
  if (role !== 'employee' && role !== 'hr') notFound()
  return role
}

export async function requireEmployee(params: Promise<{ role: string }>) {
  const { role } = await params
  if (role !== 'employee') notFound()
}
