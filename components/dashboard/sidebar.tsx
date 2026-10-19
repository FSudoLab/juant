'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { ACCESS_EVENT, CARD_VIEW_EVENT, demoAccountByRole, navKey, powerAccessId, powerNavigationFor, readAccess, readCardViewPreference, readPowerUsers } from '@/lib/access'
import { DEMO_HR_ACCOUNT, SYSTEMS_EVENT, defaultSystemConfig, isSectionEnabled, systemConfigFor, type SystemConfig } from '@/lib/systems'
import { employeeNavigation, hrNavigation, systemAdminNavigation, type NavGroup, type Role } from '@/lib/navigation'

export function DashboardNavigation({ role }: { role: Role }) {
  const [cardView, setCardView] = useState(false)

  useEffect(() => {
    const sync = () => setCardView(role === 'employee' && readCardViewPreference())
    sync()
    window.addEventListener(CARD_VIEW_EVENT, sync)
    return () => window.removeEventListener(CARD_VIEW_EVENT, sync)
  }, [role])

  if (!cardView) return <Sidebar role={role} />
  return <CardViewNavigation role={role} />
}

function CardViewNavigation({ role }: { role: Role }) {
  const pathname = usePathname()
  const dashboardHref = `/dashboard/${role}`

  if (pathname !== dashboardHref) {
    return (
      <div className="w-full border-b border-[#111111]/10 bg-[#f6f6f3] px-5 py-5 text-[#111111] sm:px-10 lg:basis-full">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href={dashboardHref} className="group inline-flex items-center gap-2 text-sm font-semibold text-[#111111]/65 transition-colors hover:text-[#3159ff]">
            <span aria-hidden="true" className="text-base leading-none transition-transform group-hover:-translate-x-1">&larr;</span>
            <span>Back to dashboard</span>
          </Link>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111]/35">Employee portal</span>
        </div>
      </div>
    )
  }

  const navigation = role === 'hr' ? hrNavigation : role === 'system-admin' ? systemAdminNavigation : employeeNavigation
  const items = navigation.flatMap((group) => group.items).filter(({ href }) => href !== dashboardHref)
  const confirm = useConfirm()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)

  async function handleCardLogout() {
    const ok = await confirm({ title: 'Would you really like to logout?', description: 'You will need to sign in again to return to your workspace.', confirmLabel: 'Yes, logout', tone: 'danger' })
    if (ok) router.replace('/signin')
  }

  return (
    <nav className="w-full bg-[#f6f6f3] px-5 py-5 text-[#111111] sm:px-10 sm:py-7 lg:basis-full" aria-label={`${role} card navigation`}>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between border-b border-[#111111]/15 pb-5">
          <Link href="/" className="flex items-center gap-3">
            <span aria-hidden="true" className="flex size-9 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
            <span>
              <strong className="block text-lg tracking-[-0.04em]">JuanT</strong>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111111]/45">Employee Portal</span>
            </span>
          </Link>
          <div className="relative">
            <button
              type="button"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
              className="inline-flex items-center gap-2 border border-[#111111]/15 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#111111] shadow-sm transition-colors hover:border-[#3159ff] hover:text-[#3159ff]"
            >
              <UserRound aria-hidden="true" className="size-4" />
              <span>Profile</span>
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div role="menu" aria-label="Profile menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-40 border border-[#111111]/15 bg-white p-1.5 shadow-lg">
                <Link href={`${dashboardHref}/settings`} role="menuitem" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#111111]/75 transition-colors hover:bg-[#3159ff] hover:text-white">
                  <UserRound aria-hidden="true" className="size-4" />
                  Settings
                </Link>
                <button type="button" role="menuitem" onClick={handleCardLogout} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-[#111111]/75 transition-colors hover:bg-[#3159ff] hover:text-white">
                  <LogOut aria-hidden="true" className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <section>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#7c9aff]">JuanT / Employee Portal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">What would you like to do?</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#111111]/55">Choose an area to continue.</p>
        </section>
        <div className="flex flex-wrap justify-center gap-3">
        {items.map(({ label, href, icon: Icon, badge }) => {
          return <Link key={label} href={href} className="group flex min-h-24 w-full flex-col items-center justify-center gap-2 border border-[#111111]/15 bg-white/55 px-3 py-3 text-center transition-colors hover:border-[#3159ff] hover:bg-[#3159ff] sm:min-h-28 sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
            <Icon aria-hidden="true" className="size-6 text-[#7c9aff] group-hover:text-white" />
            <span className="text-xs font-semibold leading-tight group-hover:text-white">{label}</span>
            {badge && <span className="font-mono text-[10px] text-[#111111]/45 group-hover:text-white/70">{badge}</span>}
          </Link>
        })}
        </div>
      </div>
    </nav>
  )
}

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname()
  const router = useRouter()
  const confirm = useConfirm()
  const [access, setAccess] = useState<Record<string, boolean>>({})
  const [powerNav, setPowerNav] = useState<NavGroup[]>([])
  const [systems, setSystems] = useState<SystemConfig>(defaultSystemConfig)
  const [mobileOpen, setMobileOpen] = useState(false)
  const baseNavigation = role === 'hr' ? hrNavigation : role === 'system-admin' ? systemAdminNavigation : employeeNavigation
  const navigation = [...baseNavigation, ...powerNav]
  const workspaceLabel = role === 'hr' ? 'HR Dashboard' : role === 'system-admin' ? 'System Admin' : 'Employee Portal'
  const isSampleAccount = pathname === '/dashboard/system-admin/sample-new-account'

  useEffect(() => {
    const accountId = demoAccountByRole[role]
    if (!accountId) return
    const sync = () => {
      const map = readAccess()
      setAccess(map[accountId] ?? {})
      setSystems(systemConfigFor(DEMO_HR_ACCOUNT))
      setPowerNav(role === 'employee' && readPowerUsers()[accountId] ? powerNavigationFor(map[powerAccessId(accountId)] ?? {}) : [])
    }
    sync()
    window.addEventListener(ACCESS_EVENT, sync)
    window.addEventListener(SYSTEMS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(ACCESS_EVENT, sync)
      window.removeEventListener(SYSTEMS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [role])

  async function handleLogout() {
    const ok = await confirm({ title: 'Would you really like to logout?', description: 'You will need to sign in again to return to your workspace.', confirmLabel: 'Yes, logout', tone: 'danger' })
    if (ok) router.replace('/signin')
  }

  if (isSampleAccount) return null

  return (
    <>
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="dashboard-sidebar-navigation"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed right-5 top-5 z-50 inline-flex size-11 items-center justify-center border border-[#111111]/15 bg-[#111111] text-[#f6f6f3] shadow-lg transition-colors hover:bg-[#3159ff] lg:hidden"
      >
        {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {mobileOpen && <button type="button" aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-[#111111]/35 lg:hidden" />}
      <aside className={`fixed inset-y-0 right-0 z-40 flex w-[min(21rem,calc(100vw-1.5rem))] flex-col bg-[#111111] text-[#f6f6f3] shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-72 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${mobileOpen ? 'translate-x-0' : 'translate-x-full'} lg:border-r lg:border-[#111111]/15`}>
        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-7">
          <Link href="/" className="mb-8 flex items-center gap-3 border-b border-white/15 pb-6">
            <span className="flex size-9 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
            <span>
              <strong className="block text-lg tracking-[-0.04em]">JuanT</strong>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">{workspaceLabel}</span>
            </span>
          </Link>
        <nav id="dashboard-sidebar-navigation" className="scrollbar-hidden min-w-0 flex-1 flex-wrap gap-x-8 gap-y-6 overflow-y-auto lg:flex lg:overflow-y-auto" aria-label={`${role} navigation`}>
          {navigation.map((group) => {
            const isPowerGroup = group.heading.startsWith('Power · ')
            const visibleItems = group.items.filter(({ href }) => access[navKey(href)] !== false && isSectionEnabled(isPowerGroup ? 'hr' : role, navKey(href), systems))
            if (visibleItems.length === 0) return null

            return <div key={group.heading} className="min-w-[180px] lg:mb-7">
              <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">{group.heading}</p>
              <ul className="flex flex-col gap-1">
                {visibleItems.map(({ label, href, icon: Icon, badge }) => {
                  const isActive = href !== '#' && pathname === href
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${isActive ? 'bg-[#3159ff] text-white hover:bg-[#3159ff]' : 'text-white/65'}`}
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
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-5">
          <p className="min-w-0 truncate text-sm font-semibold text-white">{role === 'hr' ? 'HR Admin' : role === 'system-admin' ? 'System Admin' : 'Alex'}</p>
          <button type="button" onClick={handleLogout} className="inline-flex shrink-0 items-center gap-2 text-left text-sm font-semibold text-white/60 hover:text-white">
            <LogOut aria-hidden="true" className="size-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
