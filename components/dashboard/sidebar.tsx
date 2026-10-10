'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { employeeNavigation, hrNavigation, managerNavigation, systemAdminNavigation, type HrAccessKey, type Role } from '@/lib/navigation'

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const [hrAccess, setHrAccess] = useState<Record<string, boolean>>({})
  const navigation = role === 'hr' ? hrNavigation : role === 'manager' ? managerNavigation : role === 'system-admin' ? systemAdminNavigation : employeeNavigation
  const workspaceLabel = role === 'hr' ? 'HR Dashboard' : role === 'manager' ? 'Manager Dashboard' : role === 'system-admin' ? 'System Admin' : 'Employee Portal'

  useEffect(() => {
    if (role !== 'hr') return
    const readAccess = () => setHrAccess(JSON.parse(window.localStorage.getItem('juant-hr-access') ?? '{}'))
    readAccess()
    window.addEventListener('juant-hr-access-updated', readAccess)
    return () => window.removeEventListener('juant-hr-access-updated', readAccess)
  }, [role])

  return (
    <aside className="sticky top-0 z-30 flex max-h-screen w-full shrink-0 flex-col border-b border-[#111111]/15 bg-[#111111] text-[#f6f6f3] lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-7">
        <Link href="/" className="mb-8 flex items-center gap-3 border-b border-white/15 pb-6">
          <span className="flex size-9 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
          <span>
            <strong className="block text-lg tracking-[-0.04em]">JuanT</strong>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{workspaceLabel}</span>
          </span>
        </Link>
        <nav className="scrollbar-hidden flex min-w-0 flex-1 flex-wrap gap-x-8 gap-y-6 overflow-y-auto lg:block" aria-label={`${role} navigation`}>
          {navigation.map((group) => {
            const visibleItems = group.items.filter(({ href }) => role !== 'hr' || hrAccess[href.split('/').pop() as HrAccessKey] !== false)
            if (visibleItems.length === 0) return null

            return <div key={group.heading} className="min-w-[180px] lg:mb-7">
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{group.heading}</p>
              <ul className="flex flex-col gap-1">
                {visibleItems.map(({ label, href, icon: Icon, badge }) => {
                  const isActive = href !== '#' && pathname === href
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-white/10 hover:text-white ${isActive ? 'bg-[#3159ff] text-white hover:bg-[#3159ff]' : 'text-white/65'}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon aria-hidden="true" className="size-4" />
                          {label}
                        </span>
                        {badge && <span className="bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#111111]">{badge}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          })}
        </nav>
        <Link href="/signin" className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-semibold text-white/60 hover:text-white">
          <LogOut aria-hidden="true" className="size-4" />
          Logout
        </Link>
      </div>
    </aside>
  )
}
