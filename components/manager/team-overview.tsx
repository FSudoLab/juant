'use client'

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarClock, KeyRound, Search, X } from 'lucide-react'
import { Panel, StatGrid, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { accessItemsFor, readAccess, writeAccess } from '@/lib/access'
import { formatTime, teamRoster, workweekLabels, type Schedule, type TeamMember, type Workweek } from '@/lib/team-roster'

const ALL = 'All'
const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

const statusActions: Record<TeamMember['status'], { label: string; to: TeamMember['status']; danger?: boolean } | undefined> = {
  Probation: { label: 'Regularize', to: 'Active' },
  Active: { label: 'Deactivate', to: 'Inactive', danger: true },
  Inactive: { label: 'Reactivate', to: 'Active' },
}

export function TeamOverview() {
  const confirm = useConfirm()
  const [members, setMembers] = useState(teamRoster)
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
    if (role !== ALL && m.role !== role) return false
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
                    <td className="px-4 py-4"><StatusBadge tone={member.role === 'Employee' ? 'neutral' : 'blue'}>{member.role}</StatusBadge></td>
                    <td className="px-4 py-4 text-[#111111]/70">
                      <span className="block font-medium text-[#111111]">{workweekLabels[member.schedule.workweek]}</span>
                      <span className="text-xs">{formatTime(member.schedule.start)} – {formatTime(member.schedule.end)}</span>
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
      {accessTarget && <PermissionsDialog key={accessTarget.id} member={accessTarget} onClose={() => setAccessTarget(null)} onSaved={() => setAnnouncement(`Saved permissions for ${accessTarget.name}.`)} />}
    </>
  )
}

function EditorDialog({ title, subtitle, onClose, onSubmit, children }: { title: string; subtitle: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <dialog
      ref={(node) => {
        ref.current = node
        if (node && !node.open) node.showModal()
      }}
      aria-labelledby="editor-title"
      onClose={onClose}
      className="m-auto max-h-[90vh] w-[min(94vw,34rem)] border border-[#111111]/15 bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50"
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
          <button type="submit" className="bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6]">Save changes</button>
        </div>
      </form>
    </dialog>
  )
}

function ScheduleDialog({ member, onClose, onSave }: { member: TeamMember; onClose: () => void; onSave: (member: TeamMember, schedule: Schedule) => void }) {
  const confirm = useConfirm()
  const [schedule, setSchedule] = useState(member.schedule)
  const invalid = schedule.end <= schedule.start

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (invalid) return
    const dialog = event.currentTarget.closest('dialog')
    const ok = await confirm({
      title: `Would you like to save ${member.name}'s schedule?`,
      description: `${workweekLabels[schedule.workweek]}, ${formatTime(schedule.start)} – ${formatTime(schedule.end)}, ${schedule.breakMinutes}-minute break.`,
      confirmLabel: 'Yes, save schedule',
    })
    if (!ok) return
    onSave(member, schedule)
    dialog?.close()
  }

  return (
    <EditorDialog title="Edit schedule" subtitle={`${member.name} · ${member.position}`} onClose={onClose} onSubmit={handleSubmit}>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="schedule-workweek" className={labelClass}>Workweek</label>
          <select id="schedule-workweek" value={schedule.workweek} onChange={(e) => setSchedule({ ...schedule, workweek: e.target.value as Workweek })} className={fieldClass}>
            {Object.entries(workweekLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="schedule-break" className={labelClass}>Break</label>
          <select id="schedule-break" value={schedule.breakMinutes} onChange={(e) => setSchedule({ ...schedule, breakMinutes: Number(e.target.value) })} className={fieldClass}>
            {[30, 60, 90].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="schedule-start" className={labelClass}>Start time</label>
          <input id="schedule-start" type="time" required value={schedule.start} onChange={(e) => setSchedule({ ...schedule, start: e.target.value })} className={fieldClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="schedule-end" className={labelClass}>End time</label>
          <input id="schedule-end" type="time" required value={schedule.end} onChange={(e) => setSchedule({ ...schedule, end: e.target.value })} aria-invalid={invalid} aria-describedby={invalid ? 'schedule-error' : undefined} className={fieldClass} />
        </div>
        {invalid && <p id="schedule-error" className="text-xs font-semibold text-[#c2410c] sm:col-span-2">End time must be later than start time.</p>}
      </div>
    </EditorDialog>
  )
}

function PermissionsDialog({ member, onClose, onSaved }: { member: TeamMember; onClose: () => void; onSaved: () => void }) {
  const confirm = useConfirm()
  const groups = useMemo(() => accessItemsFor(member.role), [member.role])
  const [access, setAccess] = useState<Record<string, boolean>>(() => {
    const saved = readAccess()[member.id] ?? {}
    return Object.fromEntries(groups.flatMap((g) => g.items).map((item) => [item.key, item.locked ? true : saved[item.key] !== false]))
  })
  const enabledCount = Object.values(access).filter(Boolean).length

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const dialog = event.currentTarget.closest('dialog')
    const ok = await confirm({
      title: `Would you like to update ${member.name}'s permissions?`,
      description: `${enabledCount} of ${Object.keys(access).length} sidebar sections will be visible to them.`,
      confirmLabel: 'Yes, save permissions',
    })
    if (!ok) return
    writeAccess(member.id, access)
    onSaved()
    dialog?.close()
  }

  return (
    <EditorDialog title="Edit permissions" subtitle={`${member.name} · ${member.role} access · ${enabledCount} sections on`} onClose={onClose} onSubmit={handleSubmit}>
      <div className="max-h-[55vh] overflow-y-auto">
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
