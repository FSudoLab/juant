import { notFound } from 'next/navigation'
import type { Role } from './navigation'

export function resolveRole(requestedRole: string): Role {
  return requestedRole === 'hr' ? 'hr' : 'employee'
}

export async function requireEmployee(params: Promise<{ role: string }>) {
  const { role } = await params
  if (role !== 'employee') notFound()
}
