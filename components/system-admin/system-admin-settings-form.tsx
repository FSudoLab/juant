'use client'

import { useEffect, useState } from 'react'
import { Panel, PrimaryButton } from '@/components/dashboard/primitives'
import { hrAccessItems, type HrAccessKey } from '@/lib/navigation'

export function SystemAdminSettingsForm() {
  const [hrAccess, setHrAccess] = useState<Record<HrAccessKey, boolean>>(() => Object.fromEntries(hrAccessItems.map(({ key }) => [key, true])) as Record<HrAccessKey, boolean>)
  const [editingUser, setEditingUser] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)

  useEffect(() => {
    const savedAccess = window.localStorage.getItem('juant-hr-access')
    if (savedAccess) setHrAccess((current) => ({ ...current, ...JSON.parse(savedAccess) }))
  }, [])

  function toggleAccess(key: HrAccessKey) {
    setHrAccess((current) => {
      const next = { ...current, [key]: !current[key] }
      window.localStorage.setItem('juant-hr-access', JSON.stringify(next))
      window.dispatchEvent(new Event('juant-hr-access-updated'))
      return next
    })
  }

  return (
    <Panel title="HR access" description="Select an HR user, review their details, then open access editing to show or hide sidebar sections.">
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="hr-name">Name<input id="hr-name" defaultValue="Taylor Morgan" disabled={!editingUser} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:bg-[#111111]/5" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="hr-email">Email<input id="hr-email" type="email" defaultValue="taylor.morgan@juant.demo" disabled={!editingUser} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:bg-[#111111]/5" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="hr-team">Team<input id="hr-team" defaultValue="People Operations" disabled={!editingUser} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:bg-[#111111]/5" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="hr-role">Role<select id="hr-role" defaultValue="hr-admin" disabled={!editingUser} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:bg-[#111111]/5"><option value="hr-admin">HR administrator</option><option value="hr-specialist">HR specialist</option><option value="recruiter">Recruiter</option></select></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#111111]/15 px-5 py-4 sm:px-6">
        <p className="text-sm text-[#111111]/60">Status: <strong className="text-[#111111]">Active</strong></p>
        <button type="button" onClick={() => setEditingUser((value) => !value)} className="border border-[#111111]/20 px-4 py-2.5 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]">{editingUser ? 'Done editing' : 'Edit HR user'}</button>
      </div>
      <div className="border-t border-[#111111]/15">
        <button type="button" aria-expanded={accessOpen} onClick={() => setAccessOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold hover:bg-[#111111]/5 sm:px-6"><span>{accessOpen ? 'Close access controls' : 'Edit access permissions'}</span><span className="font-mono text-xs text-[#3159ff]">{accessOpen ? 'Close' : 'Open'}</span></button>
        {accessOpen && <ul className="divide-y divide-[#111111]/15 border-t border-[#111111]/15">
          {hrAccessItems.map(({ key, label }) => <li key={key} className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
            <div><p className="font-semibold">{label}</p><p className="mt-1 text-xs text-[#111111]/60">{hrAccess[key] ? 'Visible in the HR sidebar' : 'Hidden from the HR sidebar'}</p></div>
            <button type="button" role="switch" aria-label={`${label} access`} aria-checked={hrAccess[key]} onClick={() => toggleAccess(key)} className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${hrAccess[key] ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}><span className={`absolute left-0.5 top-0.5 size-4.5 bg-white transition-transform ${hrAccess[key] ? 'translate-x-5' : 'translate-x-0'}`} /></button>
          </li>)}
        </ul>}
      </div>
      {accessOpen && <div className="border-t border-[#111111]/15 p-5 sm:p-6"><PrimaryButton>Save access</PrimaryButton></div>}
    </Panel>
  )
}