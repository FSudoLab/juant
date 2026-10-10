'use client'

import { useState } from 'react'
import { Panel } from '@/components/dashboard/primitives'

export function EmployeeInformationEditor() {
  const [editAccess, setEditAccess] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <Panel title="Sample employee" description="Try editing Alex Cruz's information. The access toggle controls whether the fields are editable.">
      <div className="flex items-center justify-between gap-6 border-b border-[#111111]/15 px-5 py-4 sm:px-6">
        <div>
          <p className="font-semibold">Employee information editing</p>
          <p className="mt-1 text-xs text-[#111111]/60">{editAccess ? 'Editing is enabled for this manager.' : 'Editing is disabled for this manager.'}</p>
        </div>
        <button type="button" role="switch" aria-label="Enable employee information editing" aria-checked={editAccess} onClick={() => { setEditAccess((value) => !value); setSaved(false) }} className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${editAccess ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}>
          <span className={`absolute left-0.5 top-0.5 size-4.5 bg-white transition-transform ${editAccess ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="sample-employee-name">Full name<input id="sample-employee-name" defaultValue="Alex Cruz" disabled={!editAccess} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:cursor-not-allowed disabled:bg-[#111111]/5 disabled:text-[#111111]/40" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="sample-employee-email">Work email<input id="sample-employee-email" type="email" defaultValue="alex.cruz@juant.demo" disabled={!editAccess} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:cursor-not-allowed disabled:bg-[#111111]/5 disabled:text-[#111111]/40" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="sample-employee-team">Team<select id="sample-employee-team" defaultValue="product" disabled={!editAccess} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:cursor-not-allowed disabled:bg-[#111111]/5 disabled:text-[#111111]/40"><option value="product">Product</option><option value="operations">Operations</option><option value="people">People</option></select></label>
        <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="sample-employee-phone">Phone<input id="sample-employee-phone" defaultValue="+63 917 555 0142" disabled={!editAccess} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal disabled:cursor-not-allowed disabled:bg-[#111111]/5 disabled:text-[#111111]/40" /></label>
      </div>
      <div className="flex items-center gap-4 border-t border-[#111111]/15 px-5 py-4 sm:px-6"><button type="button" disabled={!editAccess} onClick={() => setSaved(true)} className="inline-flex items-center justify-center gap-2 bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:bg-[#111111]/15 disabled:text-[#111111]/40">{saved ? 'Saved' : 'Save employee'}</button></div>
    </Panel>
  )
}