'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bot, ChevronDown, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from 'lucide-react'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { AskJuanChat } from '@/components/employee/ask-juan-chat'
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
  const searchParams = useSearchParams()
  const dashboardHref = `/dashboard/${role}`

  if (pathname !== dashboardHref || searchParams.get('view') === 'overview') {
    return (
      <div className="sticky top-0 z-30 w-full border-b border-[#111111]/10 bg-[#f6f6f3] px-5 py-5 text-[#111111] sm:px-10 lg:basis-full">
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

  return <CardViewHome role={role} dashboardHref={dashboardHref} />
}

function CardViewHome({ role, dashboardHref }: { role: Role; dashboardHref: string }) {
  const navigation = role === 'hr' ? hrNavigation : role === 'system-admin' ? systemAdminNavigation : employeeNavigation
  const items = navigation.flatMap((group) => group.items).filter(({ href }) => href !== dashboardHref)
  const confirm = useConfirm()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [askJuanOpen, setAskJuanOpen] = useState(false)
  const firstName = role === 'employee' ? 'Alex' : role === 'hr' ? 'HR' : 'Admin'

  async function handleCardLogout() {
    const ok = await confirm({ title: 'Would you really like to logout?', description: 'You will need to sign in again to return to your workspace.', confirmLabel: 'Yes, logout', tone: 'danger' })
    if (ok) router.replace('/signin')
  }

  function openDashboard() {
    router.push(`${dashboardHref}?view=overview`)
  }

  return (
    <nav className="fixed inset-0 z-10 h-dvh max-h-dvh w-full overflow-hidden overscroll-none bg-[#f6f6f3] px-5 py-5 text-[#111111] max-lg:overflow-y-auto sm:px-10 sm:py-7 lg:basis-full" aria-label={`${role} card navigation`}>
      <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-hidden max-lg:h-auto max-lg:min-h-full max-lg:overflow-visible">
        <header className="flex items-center justify-between border-b border-[#111111]/15 pb-5">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3">
              <span aria-hidden="true" className="flex size-9 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
              <span>
                <strong className="block text-lg tracking-[-0.04em]">JuanT</strong>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#111111]/45">Employee Portal</span>
              </span>
            </Link>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
              className="inline-flex items-center gap-2 border-2 border-[#3159ff]/35 bg-white px-4 py-2.5 text-sm font-semibold text-[#3159ff] shadow-sm transition-colors hover:border-[#3159ff] hover:bg-[#3159ff] hover:text-white"
            >
              <span>{firstName}</span>
              <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div role="menu" aria-label="Profile menu" className="absolute right-0 top-[calc(100%+0.5rem)] z-20 min-w-40 border border-[#111111]/15 bg-white p-1.5 shadow-lg">
                <Link href={`${dashboardHref}/profile`} role="menuitem" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#111111]/75 transition-colors hover:bg-[#3159ff] hover:text-white">
                  <UserRound aria-hidden="true" className="size-4" />
                  Profile
                </Link>
                <Link href={`${dashboardHref}/settings`} role="menuitem" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#111111]/75 transition-colors hover:bg-[#3159ff] hover:text-white">
                  <Settings aria-hidden="true" className="size-4" />
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
        <div className="mx-auto grid min-h-0 w-full max-w-[1095px] grid-cols-2 content-start items-start gap-2 overflow-hidden auto-rows-max sm:grid-cols-4 sm:gap-3 xl:grid-cols-14 xl:[&>*]:col-span-2 xl:[&>*:nth-child(8)]:col-start-2">
        <button type="button" onClick={openDashboard} className="group flex aspect-square w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden border border-[#111111]/15 bg-white/70 px-1.5 py-1.5 text-center transition-colors hover:border-[#3159ff] hover:bg-[#3159ff] sm:gap-1.5 sm:px-2 sm:py-2">
          <LayoutDashboard aria-hidden="true" className="size-5 shrink-0 text-[#7c9aff] group-hover:text-white sm:size-6" />
          <span className="text-[11px] font-semibold leading-tight group-hover:text-white sm:text-xs">Dashboard</span>
        </button>
        {items.filter(({ href }) => href !== dashboardHref && href !== `${dashboardHref}/ask-juan`).map(({ label, href, icon: Icon, badge }) => {
          return <Link key={label} href={href} className="group flex aspect-square w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden border border-[#111111]/15 bg-white/70 px-1.5 py-1.5 text-center transition-colors hover:border-[#3159ff] hover:bg-[#3159ff] sm:gap-1.5 sm:px-2 sm:py-2">
            <Icon aria-hidden="true" className="size-5 shrink-0 text-[#7c9aff] group-hover:text-white sm:size-6" />
            <span className="text-[11px] font-semibold leading-tight group-hover:text-white sm:text-xs">{label}</span>
            {badge && <span className="font-mono text-[9px] text-[#111111]/45 group-hover:text-white/70 sm:text-[10px]">{badge}</span>}
          </Link>
        })}
        </div>
        {askJuanOpen && (
          <div id="ask-juan-popover" className="fixed bottom-20 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-[28rem] bg-[#f6f6f3] shadow-[0_14px_40px_rgba(17,17,17,0.2)] sm:bottom-24 sm:right-7">
            <div className="flex items-center justify-between border border-b-0 border-[#111111]/15 bg-[#3159ff] px-4 py-3 text-white">
              <div className="flex items-center gap-2 text-sm font-bold"><Bot aria-hidden="true" className="size-4" /> Ask Juan AI</div>
              <button type="button" onClick={() => setAskJuanOpen(false)} className="flex size-7 items-center justify-center hover:bg-white/15" aria-label="Close Ask Juan AI">
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <AskJuanChat />
          </div>
        )}
        <button type="button" onClick={() => setAskJuanOpen((open) => !open)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 border-2 border-[#3159ff] bg-[#3159ff] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(49,89,255,0.25)] transition-colors hover:bg-[#2447d6] sm:bottom-7 sm:right-7" aria-expanded={askJuanOpen} aria-controls="ask-juan-popover">
          <Bot aria-hidden="true" className="size-5" />
          <span>Ask Juan AI</span>
        </button>
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
