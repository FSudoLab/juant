'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarClock, Copy, KeyRound, Search, ShieldCheck, ShieldOff, X } from 'lucide-react'
import { Panel, StatGrid, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { ACCESS_EVENT, accessItemsFor, powerAccessId, powerAccessItems, readAccess, readPowerUsers, writeAccess, writePowerUser } from '@/lib/access'
import {
  dayError,
  dayKeys,
  dayLabels,
  dayMinutes,
  hoursLabel,
  teamRoster,
  weekdays,
  weeklyHours,
  workingDaysLabel,
  type DayKey,
  type DaySchedule,
  type Schedule,
  type Shift,
  type TeamMember,
} from '@/lib/team-roster'

const ALL = 'All'
const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

const statusActions: Record<TeamMember['status'], { label: string; to: TeamMember['status']; danger?: boolean } | undefined> = {
  Probation: { label: 'Regularize', to: 'Active' },
  Active: { label: 'Deactivate', to: 'Inactive', danger: true },
  Inactive: { label: 'Reactivate', to: 'Active' },
}

const POWER = 'Power user'

export function TeamOverview({ canGrantPower = false }: { canGrantPower?: boolean }) {
  const confirm = useConfirm()
  const [members, setMembers] = useState(teamRoster)
  const [powerUsers, setPowerUsers] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const sync = () => setPowerUsers(readPowerUsers())
    sync()
    window.addEventListener(ACCESS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(ACCESS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isPower = (m: TeamMember) => Boolean(powerUsers[m.id])
  const roleLabel = (m: TeamMember) => (isPower(m) ? (m.role === 'Employee' ? POWER : `${m.role} · Power`) : m.role)

  async function togglePower(member: TeamMember) {
    const granting = !isPower(member)
    const ok = await confirm({
      title: granting ? `Would you like to promote ${member.name} to power user?` : `Would you like to remove power access from ${member.name}?`,
      description: granting
        ? 'They will get HR-level sections in their sidebar. You can still limit exactly what they see under Permissions → Power permissions.'
        : `They will go back to normal ${member.role} access. Their power permission settings are kept in case you grant it again.`,
      confirmLabel: granting ? 'Yes, promote' : 'Yes, demote',
      tone: granting ? 'primary' : 'danger',
    })
    if (!ok) return
    writePowerUser(member.id, granting)
    setAnnouncement(granting ? `${member.name} is now a power user.` : `${member.name} is back to normal employee access.`)
  }
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(ALL)
  const [position, setPosition] = useState(ALL)
  const [role, setRole] = useState(ALL)
  const [announcement, setAnnouncement] = useState('')
  const [scheduleTarget, setScheduleTarget] = useState<TeamMember | null>(null)
  const [accessTarget, setAccessTarget] = useState<TeamMember | null>(null)

  const departments = useMemo(() => [ALL, ...new Set(members.map((m) => m.department))].sort((a, b) => (a === ALL ? -1 : b === ALL ? 1 : a.localeCompare(b))), [members])
  const positions = useMemo(
    () => [ALL, ...new Set(members.filter((m) => department === ALL || m.department === department).map((m) => m.position))],
    [members, department],
  )

  const visible = members.filter((m) => {
    if (department !== ALL && m.department !== department) return false
    if (position !== ALL && m.position !== position) return false
    if (role === POWER && !isPower(m)) return false
    if (role !== ALL && role !== POWER && (m.role !== role || isPower(m))) return false
    const needle = query.trim().toLowerCase()
    return !needle || [m.name, m.email, m.empNo, m.department, m.position].some((value) => value.toLowerCase().includes(needle))
  })

  const hasFilters = query || department !== ALL || position !== ALL || role !== ALL

  async function changeStatus(member: TeamMember) {
    const action = statusActions[member.status]
    if (!action) return
    const ok = await confirm({
      title: `Would you like to ${action.label.toLowerCase()} ${member.name}?`,
      description: `Their status will change from ${member.status} to ${action.to}.`,
      confirmLabel: `Yes, ${action.label.toLowerCase()}`,
      tone: action.danger ? 'danger' : 'primary',
    })
    if (!ok) return
    setMembers((current) => current.map((m) => (m.id === member.id ? { ...m, status: action.to } : m)))
    setAnnouncement(`${member.name} is now ${action.to}.`)
  }

  function saveSchedule(member: TeamMember, schedule: Schedule) {
    setMembers((current) => current.map((m) => (m.id === member.id ? { ...m, schedule } : m)))
    setAnnouncement(`Saved the schedule for ${member.name}.`)
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <StatGrid
        label="Team summary"
        stats={[
          { label: 'People', value: String(members.length).padStart(2, '0') },
          { label: 'Departments', value: String(departments.length - 1).padStart(2, '0') },
          { label: 'HR users', value: String(members.filter((m) => m.role === 'HR').length).padStart(2, '0') },
          { label: 'Power users', value: String(members.filter(isPower).length).padStart(2, '0') },
          { label: 'Inactive', value: String(members.filter((m) => m.status === 'Inactive').length).padStart(2, '0') },
        ]}
      />
      <Panel title="Everyone in the workspace" description="Filter by department or position, then edit each person's schedule and sidebar permissions.">
        <div className="grid gap-4 border-b border-[#111111]/15 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="team-search" className={labelClass}>Search</label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/40" />
              <input id="team-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email, or employee no." className={`${fieldClass} pl-9`} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="team-department" className={labelClass}>Department</label>
            <select id="team-department" value={department} onChange={(e) => { setDepartment(e.target.value); setPosition(ALL) }} className={fieldClass}>
              {departments.map((d) => <option key={d} value={d}>{d === ALL ? 'All departments' : d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="team-position" className={labelClass}>Position</label>
            <select id="team-position" value={position} onChange={(e) => setPosition(e.target.value)} className={fieldClass}>
              {positions.map((p) => <option key={p} value={p}>{p === ALL ? 'All positions' : p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="team-role" className={labelClass}>Access role</label>
            <select id="team-role" value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
              <option value={ALL}>All roles</option>
              <option value="Employee">Employee</option>
              <option value={POWER}>Power user</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[#111111]/15 px-5 py-3 text-xs text-[#111111]/60 sm:px-6">
          <span>Showing <strong className="text-[#111111]">{visible.length}</strong> of {members.length} people</span>
          {hasFilters && (
            <button type="button" onClick={() => { setQuery(''); setDepartment(ALL); setPosition(ALL); setRole(ALL) }} className="font-semibold text-[#3159ff] hover:underline">
              Clear filters
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-[#111111]/[0.03] font-mono text-[10px] uppercase tracking-[0.12em] text-[#111111]/50">
              <tr className="border-b border-[#111111]/15">
                <th scope="col" className="px-5 py-3 font-bold sm:px-6">Employee</th>
                <th scope="col" className="px-4 py-3 font-bold">Department</th>
                <th scope="col" className="px-4 py-3 font-bold">Position</th>
                <th scope="col" className="px-4 py-3 font-bold">Role</th>
                <th scope="col" className="px-4 py-3 font-bold">Schedule</th>
                <th scope="col" className="px-4 py-3 font-bold">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-bold sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {visible.map((member) => {
                const statusAction = statusActions[member.status]
                return (
                  <tr key={member.id} className="transition-colors hover:bg-white">
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-semibold">{member.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#111111]/50">{member.empNo} · {member.email}</p>
                    </td>
                    <td className="px-4 py-4 text-[#111111]/70">{member.department}</td>
                    <td className="px-4 py-4 text-[#111111]/70">{member.position}</td>
                    <td className="px-4 py-4"><StatusBadge tone={isPower(member) ? 'dark' : member.role === 'Employee' ? 'neutral' : 'blue'}>{roleLabel(member)}</StatusBadge></td>
                    <td className="px-4 py-4 text-[#111111]/70">
                      <span className="block font-medium text-[#111111]">{workingDaysLabel(member.schedule)}</span>
                      <span className="block text-xs">{hoursLabel(member.schedule)}</span>
                      <span className="font-mono text-[10px] text-[#111111]/45">{weeklyHours(member.schedule)} hrs/week</span>
                    </td>
                    <td className="px-4 py-4"><StatusBadge tone={statusTone(member.status)}>{member.status}</StatusBadge></td>
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setScheduleTarget(member)} aria-label={`Edit schedule for ${member.name}`} className="inline-flex items-center gap-1.5 whitespace-nowrap border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]">
                          <CalendarClock aria-hidden="true" className="size-3.5" /> Schedule
                        </button>
                        <button type="button" onClick={() => setAccessTarget(member)} aria-label={`Edit permissions for ${member.name}`} className="inline-flex items-center gap-1.5 whitespace-nowrap border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]">
                          <KeyRound aria-hidden="true" className="size-3.5" /> Permissions
                        </button>
                        {canGrantPower && (
                          <button
                            type="button"
                            onClick={() => togglePower(member)}
                            aria-label={isPower(member) ? `Demote ${member.name} to normal employee` : `Promote ${member.name} to power user`}
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-semibold transition-colors ${isPower(member) ? 'border border-[#111111]/20 text-[#111111]/70 hover:border-[#c2410c] hover:text-[#c2410c]' : 'border border-[#111111] bg-[#111111] text-[#f6f6f3] hover:bg-[#111111]/85'}`}
                          >
                            {isPower(member) ? <ShieldOff aria-hidden="true" className="size-3.5" /> : <ShieldCheck aria-hidden="true" className="size-3.5" />}
                            {isPower(member) ? 'Demote' : 'Promote'}
                          </button>
                        )}
                        {statusAction && (
                          <button type="button" onClick={() => changeStatus(member)} aria-label={`${statusAction.label} ${member.name}`} className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold transition-colors ${statusAction.danger ? 'border border-[#c2410c]/40 text-[#c2410c] hover:bg-[#c2410c] hover:text-white' : 'bg-[#3159ff] text-white hover:bg-[#2447d6]'}`}>
                            {statusAction.label}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[#111111]/50">No one matches these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {scheduleTarget && <ScheduleDialog key={scheduleTarget.id} member={scheduleTarget} onClose={() => setScheduleTarget(null)} onSave={saveSchedule} />}
      {accessTarget && <PermissionsDialog key={accessTarget.id} member={accessTarget} isPower={isPower(accessTarget)} canEditPower={canGrantPower} onClose={() => setAccessTarget(null)} onSaved={() => setAnnouncement(`Saved permissions for ${accessTarget.name}.`)} />}
    </>
  )
}

function EditorDialog({ title, subtitle, onClose, onSubmit, children, wide = false, submitDisabled = false }: { title: string; subtitle: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; children: ReactNode; wide?: boolean; submitDisabled?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <dialog
      ref={(node) => {
        ref.current = node
        if (node && !node.open) node.showModal()
      }}
      aria-labelledby="editor-title"
      onClose={onClose}
      className={`m-auto max-h-[92vh] ${wide ? 'w-[min(96vw,52rem)]' : 'w-[min(94vw,34rem)]'} border border-[#111111]/15 bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50`}
    >
      <form onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#111111]/15 p-5">
          <div>
            <h2 id="editor-title" className="text-xl font-semibold tracking-[-0.04em]">{title}</h2>
            <p className="mt-1 text-sm text-[#111111]/60">{subtitle}</p>
          </div>
          <button type="button" onClick={() => ref.current?.close()} className="p-1 text-[#111111]/60 hover:text-[#111111]">
            <X aria-hidden="true" className="size-4" /><span className="sr-only">Close</span>
          </button>
        </div>
        {children}
        <div className="flex justify-end gap-2 border-t border-[#111111]/15 p-5">
          <button type="button" onClick={() => ref.current?.close()} className="border border-[#111111]/20 px-4 py-2.5 text-sm font-semibold hover:border-[#111111]">Cancel</button>
          <button type="submit" disabled={submitDisabled} className="bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-50">Save changes</button>
        </div>
      </form>
    </dialog>
  )
}

function ScheduleDialog({ member, onClose, onSave }: { member: TeamMember; onClose: () => void; onSave: (member: TeamMember, schedule: Schedule) => void }) {
  const confirm = useConfirm()
  const [schedule, setSchedule] = useState(member.schedule)
  const errors = Object.fromEntries(dayKeys.map((key) => [key, dayError(schedule.days[key])])) as Record<DayKey, string | null>
  const hasErrors = dayKeys.some((key) => errors[key])
  const workingCount = dayKeys.filter((key) => schedule.days[key].working).length

  function updateDay(key: DayKey, patch: Partial<DaySchedule>) {
    setSchedule((current) => ({ ...current, days: { ...current.days, [key]: { ...current.days[key], ...patch } } }))
  }

  function applyPreset(days: readonly DayKey[]) {
    setSchedule((current) => ({
      ...current,
      days: Object.fromEntries(dayKeys.map((key) => [key, { ...current.days[key], working: days.includes(key) }])) as Schedule['days'],
    }))
  }

  function copyToWorkingDays(source: DayKey) {
    const { shift, split, second } = schedule.days[source]
    setSchedule((current) => ({
      ...current,
      days: Object.fromEntries(
        dayKeys.map((key) => [key, current.days[key].working ? { ...current.days[key], shift, split, second } : current.days[key]]),
      ) as Schedule['days'],
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (hasErrors) return
    const dialog = event.currentTarget.closest('dialog')
    const ok = await confirm({
      title: `Would you like to save ${member.name}'s schedule?`,
      description: `${workingDaysLabel(schedule)} · ${hoursLabel(schedule)} · ${weeklyHours(schedule)} hours per week.`,
      confirmLabel: 'Yes, save schedule',
    })
    if (!ok) return
    onSave(member, schedule)
    dialog?.close()
  }

  const presets: { label: string; days: readonly DayKey[] }[] = [
    { label: 'Mon–Fri', days: weekdays },
    { label: 'Mon–Sat', days: [...weekdays, 'sat'] },
    { label: 'All week', days: dayKeys },
  ]

  return (
    <EditorDialog wide title="Edit schedule" subtitle={`${member.name} · ${member.position} · ${weeklyHours(schedule)} hrs/week`} onClose={onClose} onSubmit={handleSubmit} submitDisabled={hasErrors}>
      <div className="flex flex-col gap-4 border-b border-[#111111]/15 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Quick set working days</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button key={preset.label} type="button" onClick={() => applyPreset(preset.days)} className="border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]">
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 sm:w-44">
          <label htmlFor="schedule-break" className={labelClass}>Break (single shift)</label>
          <select id="schedule-break" value={schedule.breakMinutes} onChange={(e) => setSchedule({ ...schedule, breakMinutes: Number(e.target.value) })} className={fieldClass}>
            {[0, 30, 60, 90].map((minutes) => <option key={minutes} value={minutes}>{minutes === 0 ? 'No break' : `${minutes} minutes`}</option>)}
          </select>
        </div>
      </div>

      <ul className="max-h-[52vh] divide-y divide-[#111111]/10 overflow-y-auto" aria-label="Daily schedule">
        {dayKeys.map((key) => (
          <DayRow
            key={key}
            dayKey={key}
            day={schedule.days[key]}
            error={errors[key]}
            canCopy={workingCount > 1}
            onChange={(patch) => updateDay(key, patch)}
            onCopy={() => copyToWorkingDays(key)}
          />
        ))}
      </ul>
    </EditorDialog>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${checked ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}
    >
      <span className={`absolute left-0.5 top-0.5 size-4.5 bg-[#f6f6f3] transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function ShiftInputs({ id, label, shift, invalid, onChange }: { id: string; label: string; shift: Shift; invalid: boolean; onChange: (shift: Shift) => void }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${labelClass} mb-1.5`}>{label}</legend>
      <div className="flex items-center gap-2">
        <label htmlFor={`${id}-start`} className="sr-only">{label} start</label>
        <input id={`${id}-start`} type="time" required value={shift.start} onChange={(e) => onChange({ ...shift, start: e.target.value })} aria-invalid={invalid} className={`${fieldClass} sm:w-32`} />
        <span aria-hidden="true" className="text-[#111111]/40">–</span>
        <label htmlFor={`${id}-end`} className="sr-only">{label} end</label>
        <input id={`${id}-end`} type="time" required value={shift.end} onChange={(e) => onChange({ ...shift, end: e.target.value })} aria-invalid={invalid} className={`${fieldClass} sm:w-32`} />
      </div>
    </fieldset>
  )
}

function DayRow({ dayKey, day, error, canCopy, onChange, onCopy }: { dayKey: DayKey; day: DaySchedule; error: string | null; canCopy: boolean; onChange: (patch: Partial<DaySchedule>) => void; onCopy: () => void }) {
  const name = dayLabels[dayKey].long
  const hours = Math.round((dayMinutes(day) / 60) * 10) / 10

  return (
    <li className={`flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-start ${day.working ? '' : 'bg-[#111111]/[0.03]'}`}>
      <div className="flex items-center gap-3 lg:w-40 lg:pt-6">
        <Toggle label={`${name} is a working day`} checked={day.working} onChange={(working) => onChange({ working })} />
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="font-mono text-[10px] text-[#111111]/50">{day.working ? `${hours} hrs` : 'Rest day'}</p>
        </div>
      </div>

      {day.working ? (
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <ShiftInputs id={`${dayKey}-first`} label={day.split ? 'Morning / first shift' : 'Work hours'} shift={day.shift} invalid={Boolean(error)} onChange={(shift) => onChange({ shift })} />
            {day.split && (
              <ShiftInputs id={`${dayKey}-second`} label="Night / second shift" shift={day.second} invalid={Boolean(error)} onChange={(second) => onChange({ second })} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <Toggle label={`Split shift on ${name}`} checked={day.split} onChange={(split) => onChange({ split })} />
              <span className="text-xs font-semibold text-[#111111]/70">Split shift {day.split ? 'enabled' : 'disabled'}</span>
            </div>
            {canCopy && (
              <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3159ff] hover:underline">
                <Copy aria-hidden="true" className="size-3.5" /> Copy to all working days
              </button>
            )}
          </div>
          {day.split && !error && <p className="text-xs text-[#111111]/55">Both shifts count as one work day.</p>}
          {error && <p role="alert" className="text-xs font-semibold text-[#c2410c]">{error}</p>}
        </div>
      ) : (
        <p className="flex-1 text-sm text-[#111111]/50 lg:pt-6">Not scheduled. Turn the switch on to add hours for {name}.</p>
      )}
    </li>
  )
}

type AccessGroup = { heading: string; items: { key: string; label: string; locked: boolean }[] }

function initialAccess(groups: AccessGroup[], saved: Record<string, boolean>) {
  return Object.fromEntries(groups.flatMap((g) => g.items).map((item) => [item.key, item.locked ? true : saved[item.key] !== false]))
}

function PermissionsDialog({ member, isPower, canEditPower, onClose, onSaved }: { member: TeamMember; isPower: boolean; canEditPower: boolean; onClose: () => void; onSaved: () => void }) {
  const confirm = useConfirm()
  const showPowerTab = isPower && canEditPower
  const [tab, setTab] = useState<'base' | 'power'>('base')
  const baseGroups = useMemo(() => accessItemsFor(member.role), [member.role])
  const powerGroups = useMemo(() => powerAccessItems(), [])
  const [baseAccess, setBaseAccess] = useState<Record<string, boolean>>(() => initialAccess(baseGroups, readAccess()[member.id] ?? {}))
  const [powerAccess, setPowerAccess] = useState<Record<string, boolean>>(() => initialAccess(powerGroups, readAccess()[powerAccessId(member.id)] ?? {}))

  const groups = tab === 'power' ? powerGroups : baseGroups
  const access = tab === 'power' ? powerAccess : baseAccess
  const setAccess = tab === 'power' ? setPowerAccess : setBaseAccess
  const count = (map: Record<string, boolean>) => Object.values(map).filter(Boolean).length
  const enabledCount = count(access)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const dialog = event.currentTarget.closest('dialog')
    const ok = await confirm({
      title: `Would you like to update ${member.name}'s permissions?`,
      description: showPowerTab
        ? `Employee: ${count(baseAccess)} of ${Object.keys(baseAccess).length} sections on. Power: ${count(powerAccess)} of ${Object.keys(powerAccess).length} HR sections on.`
        : `${count(baseAccess)} of ${Object.keys(baseAccess).length} sidebar sections will be visible to them.`,
      confirmLabel: 'Yes, save permissions',
    })
    if (!ok) return
    writeAccess(member.id, baseAccess)
    if (showPowerTab) writeAccess(powerAccessId(member.id), powerAccess)
    onSaved()
    dialog?.close()
  }

  const tabClass = (active: boolean) =>
    `flex-1 px-4 py-3 text-left text-xs font-semibold transition-colors ${active ? 'border-b-2 border-[#3159ff] text-[#111111]' : 'border-b-2 border-transparent text-[#111111]/50 hover:text-[#111111]'}`

  return (
    <EditorDialog title="Edit permissions" subtitle={`${member.name} · ${isPower ? 'Power user' : member.role} · ${enabledCount} sections on`} onClose={onClose} onSubmit={handleSubmit}>
      {showPowerTab && (
        <div role="tablist" aria-label="Permission sets" className="flex border-b border-[#111111]/15">
          <button type="button" role="tab" aria-selected={tab === 'base'} onClick={() => setTab('base')} className={tabClass(tab === 'base')}>
            Employee permissions
            <span className="block font-mono text-[10px] font-normal text-[#111111]/45">{count(baseAccess)} of {Object.keys(baseAccess).length} on</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'power'} onClick={() => setTab('power')} className={tabClass(tab === 'power')}>
            Power permissions
            <span className="block font-mono text-[10px] font-normal text-[#111111]/45">{count(powerAccess)} of {Object.keys(powerAccess).length} HR sections on</span>
          </button>
        </div>
      )}
      {tab === 'power' && (
        <p className="border-b border-[#111111]/15 bg-[#111111]/[0.03] px-5 py-3 text-xs leading-relaxed text-[#111111]/60">
          HR-level sections this power user can open. Team overview, Manager settings, and HR settings always stay HR-only.
        </p>
      )}
      <div className="max-h-[50vh] overflow-y-auto">
        {groups.map((group) => (
          <fieldset key={group.heading} className="border-b border-[#111111]/15 last:border-b-0">
            <legend className="sr-only">{group.heading}</legend>
            <p aria-hidden="true" className="px-5 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#111111]/40">{group.heading}</p>
            <ul className="divide-y divide-[#111111]/10">
              {group.items.map((item) => {
                const on = access[item.key]
                return (
                  <li key={item.key} className="flex items-center justify-between gap-6 px-5 py-3">
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-[#111111]/50">{item.locked ? 'Always on — required' : on ? 'Visible in sidebar' : 'Hidden from sidebar'}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-label={`${item.label} access`}
                      aria-checked={on}
                      disabled={item.locked}
                      onClick={() => setAccess((current) => ({ ...current, [item.key]: !current[item.key] }))}
                      className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] disabled:cursor-not-allowed disabled:opacity-50 ${on ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 size-4.5 bg-[#f6f6f3] transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </EditorDialog>
  )
}
