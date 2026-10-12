'use client'

import { useState, type FormEvent } from 'react'
import { Mail, SlidersHorizontal, Trash2, UserPlus } from 'lucide-react'
import { HrSystemConfig } from '@/components/system-admin/hr-system-config'
import { Panel, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'

type HrUser = { id: string; name: string; email: string; employees: number; status: 'Active' | 'Pending' }

const initialUsers: HrUser[] = [
  { id: 'hr1', name: 'Maria Santos', email: 'maria.santos@juant.ph', employees: 24, status: 'Active' },
  { id: 'hr2', name: 'Paolo Reyes', email: 'paolo.reyes@juant.ph', employees: 18, status: 'Active' },
  { id: 'hr3', name: 'Andrea Cruz', email: 'andrea.cruz@juant.ph', employees: 6, status: 'Pending' },
]

const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'
const iconButtonClass = 'flex size-9 items-center justify-center border border-[#111111]/15 text-[#111111]/60'

export function HrUserAccess() {
  const confirm = useConfirm()
  const [users, setUsers] = useState<HrUser[]>(initialUsers)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [employees, setEmployees] = useState('')
  const [status, setStatus] = useState('')
  const [configuring, setConfiguring] = useState<string | null>(null)

  const employeeCount = Number(employees)
  const emailTaken = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  const valid = name.trim() && /^\S+@\S+\.\S+$/.test(email.trim()) && !emailTaken && Number.isInteger(employeeCount) && employeeCount >= 0 && employees !== ''

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid) return
    const ok = await confirm({ title: `Would you like to invite ${name.trim()} as HR?`, description: `An invitation will be sent to ${email.trim()}.`, confirmLabel: 'Yes, send invite' })
    if (!ok) return
    setUsers((current) => [...current, { id: `hr${Date.now()}`, name: name.trim(), email: email.trim(), employees: employeeCount, status: 'Pending' }])
    setStatus(`Invitation sent to ${email.trim()}.`)
    setName('')
    setEmail('')
    setEmployees('')
  }

  async function resend(user: HrUser) {
    const ok = await confirm({ title: `Resend the invitation to ${user.name}?`, confirmLabel: 'Yes, resend' })
    if (ok) setStatus(`Invitation resent to ${user.email}.`)
  }

  async function remove(user: HrUser) {
    const ok = await confirm({ title: `Would you like to remove ${user.name}'s HR access?`, description: 'They will no longer be able to sign in to the HR workspace.', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (!ok) return
    setUsers((current) => current.filter((u) => u.id !== user.id))
    setConfiguring((current) => (current === user.id ? null : current))
    setStatus(`${user.name} was removed.`)
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="sr-only" role="status" aria-live="polite">{status}</p>

      <Panel title="Invite HR" description="Send an invitation to give someone access to the HR workspace.">
        <form onSubmit={invite} className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="invite-name" className={labelClass}>Name</label>
            <input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan dela Cruz" autoComplete="off" className={fieldClass} />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="invite-email" className={labelClass}>Email</label>
            <input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" autoComplete="off" aria-invalid={emailTaken || undefined} aria-describedby={emailTaken ? 'invite-email-error' : undefined} className={fieldClass} />
            {emailTaken && <p id="invite-email-error" className="text-xs text-[#c2410c]">This email already has HR access.</p>}
          </div>
          <div className="flex flex-col gap-1.5 lg:w-36">
            <label htmlFor="invite-employees" className={labelClass}>Employees</label>
            <input id="invite-employees" type="number" inputMode="numeric" min={0} step={1} value={employees} onChange={(e) => setEmployees(e.target.value)} placeholder="0" className={fieldClass} />
          </div>
          <button type="submit" disabled={!valid} className="inline-flex h-10 items-center justify-center gap-2 bg-[#3159ff] px-5 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-40">
            <UserPlus aria-hidden="true" className="size-4" /> Send invite
          </button>
        </form>
      </Panel>

      {configuring && users.find((user) => user.id === configuring) && (() => {
        const user = users.find((candidate) => candidate.id === configuring)
        if (!user) return null
        return (
          <Panel title={`Configure ${user.name}`} description="Choose which HR systems this user can access.">
            <div role="tabpanel">
              <HrSystemConfig userId={user.id} userName={user.name} onSaved={setStatus} />
            </div>
          </Panel>
        )
      })()}

      <Panel title="HR users" description={`${users.length} ${users.length === 1 ? 'person has' : 'people have'} HR workspace access.`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#111111]/15">
                {['Name', 'Email', 'Employees', 'Actions'].map((heading) => (
                  <th key={heading} scope="col" className={`px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50 sm:px-6 ${heading === 'Employees' ? 'text-right' : ''} ${heading === 'Actions' ? 'text-right' : ''}`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{user.name}</span>
                      <StatusBadge tone={statusTone(user.status)}>{user.status}</StatusBadge>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#111111]/70 sm:px-6">{user.email}</td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums sm:px-6">{user.employees}</td>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setConfiguring((current) => (current === user.id ? null : user.id))}
                        aria-expanded={configuring === user.id}
                        aria-label={`Configure systems for ${user.name}`}
                        title="Configuration"
                        className={`${iconButtonClass} hover:border-[#3159ff] hover:text-[#3159ff] ${configuring === user.id ? 'border-[#3159ff] bg-[#3159ff] text-white hover:text-white' : ''}`}
                      >
                        <SlidersHorizontal aria-hidden="true" className="size-4" />
                      </button>
                      {user.status === 'Pending' && (
                        <button type="button" onClick={() => resend(user)} aria-label={`Resend invite to ${user.name}`} title="Resend invite" className={`${iconButtonClass} hover:border-[#3159ff] hover:text-[#3159ff]`}>
                          <Mail aria-hidden="true" className="size-4" />
                        </button>
                      )}
                      <button type="button" onClick={() => remove(user)} aria-label={`Remove ${user.name}`} title="Remove access" className={`${iconButtonClass} hover:border-[#c2410c] hover:text-[#c2410c]`}>
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[#111111]/60 sm:px-6">No HR users yet. Invite someone above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {configuring && users.find((user) => user.id === configuring) && (() => {
          const user = users.find((candidate) => candidate.id === configuring)
          if (!user) return null
          return (
            <div role="tabpanel" className="border-t border-[#111111]/15">
              <HrSystemConfig userId={user.id} userName={user.name} onSaved={setStatus} />
            </div>
          )
        })()}
      </Panel>
    </div>
  )
}
