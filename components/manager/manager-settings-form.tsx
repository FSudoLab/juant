'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Panel, PrimaryButton } from '@/components/dashboard/primitives'

const scheduleFieldClass =
  'h-11 w-full rounded-none border border-[#111111]/20 bg-white px-3 text-sm font-normal leading-none focus-visible:border-[#3159ff] focus-visible:outline-none'
const scheduleSelectClass = `${scheduleFieldClass} appearance-none pr-10`

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2)
  const minutes = index % 2 === 0 ? '00' : '30'
  const value = `${String(hours).padStart(2, '0')}:${minutes}`
  const label = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`
  return { value, label }
})

function TimeSelect({ id, label, defaultValue }: { id: string; label: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor={id}>
      {label}
      <span className="relative">
        <select id={id} defaultValue={defaultValue} className={scheduleSelectClass}>
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/60" />
      </span>
    </label>
  )
}

function Toggle({ id, label, hint, defaultOn = false }: { id: string; label: string; hint: string; defaultOn?: boolean }) {
  const [checked, setChecked] = useState(defaultOn)

  return (
    <li className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-semibold">{label}</span>
        <span className="block text-xs text-[#111111]/60">{hint}</span>
      </label>
      <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => setChecked((value) => !value)} className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${checked ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}>
        <span className={`absolute left-0.5 top-0.5 size-4.5 bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </li>
  )
}

export function ManagerSettingsForm() {
  return (
    <>
      <Panel title="Employee schedules" description="Set the standard workweek and daily hours for your team.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="schedule-days">Workweek<span className="relative"><select id="schedule-days" defaultValue="monday-friday" className={scheduleSelectClass}><option value="monday-friday">Monday to Friday</option><option value="all-week">Monday to Sunday</option></select><ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/60" /></span></label>
          <TimeSelect id="start-time" label="Start time" defaultValue="08:30" />
          <TimeSelect id="end-time" label="End time" defaultValue="17:30" />
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="break-time">Break duration<span className="relative"><select id="break-time" defaultValue="60" className={scheduleSelectClass}><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select><ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/60" /></span></label>
        </div>
        <div className="border-t border-[#111111]/15 px-5 py-4 sm:px-6"><PrimaryButton>Save schedule</PrimaryButton></div>
      </Panel>

      <Panel title="Individual schedules & permissions" description="Customize each person's schedule and sidebar access from Employee management." action={<Link href="/dashboard/hr/employee-management" className="text-sm font-semibold text-[#3159ff]">Open employee management →</Link>}>
        <p className="p-5 text-sm text-[#111111]/60 sm:p-6">Use the Schedule and Permissions actions on any employee, HR user, or manager row.</p>
      </Panel>

      <Panel title="Holidays" description="Choose whether company holiday dates appear in team planning.">
        <ul className="divide-y divide-[#111111]/15"><Toggle id="holiday-calendar" label="Show upcoming holidays" hint="Include holidays in schedules and reminders" defaultOn /></ul>
      </Panel>

      <Panel title="Leave rules & approvals" description="Set the allowance and decide which requests you can approve.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="leave-allowance">Annual leave allowance<input id="leave-allowance" type="number" min="0" defaultValue="18" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="sick-allowance">Annual sick leave allowance<input id="sick-allowance" type="number" min="0" defaultValue="10" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label>
        </div>
        <ul className="divide-y divide-[#111111]/15 border-t border-[#111111]/15"><Toggle id="leave-approval" label="Leave approval access" hint="Approve or decline employee leave requests" defaultOn /><Toggle id="schedule-approval" label="Schedule change approval" hint="Approve changes to an employee's schedule" defaultOn /></ul>
        <div className="border-t border-[#111111]/15 px-5 py-4 sm:px-6"><PrimaryButton>Save leave rules</PrimaryButton></div>
      </Panel>

      <Panel title="Team resources" description="Control the information and materials your team can receive from you." action={<Link href="/dashboard/hr/employee-management" className="text-sm font-semibold text-[#3159ff]">Open employee management →</Link>}>
        <ul className="divide-y divide-[#111111]/15"><Toggle id="documents" label="Add team documents" hint="Allow document uploads for your employees" defaultOn /><Toggle id="employee-information" label="Edit employee information" hint="Allow updates to team contact and profile details" defaultOn /></ul>
        <div className="grid gap-5 border-t border-[#111111]/15 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6"><label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="document-name">Add a document<input id="document-name" type="text" placeholder="e.g. Updated remote work policy" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label><PrimaryButton>Add document</PrimaryButton></div>
      </Panel>

      <Panel title="Notifications & support" description="Keep your team informed and make help easy to reach.">
        <ul className="divide-y divide-[#111111]/15"><Toggle id="daily-reminders" label="Daily reminders" hint="Send a daily summary of attendance and pending requests" defaultOn /><Toggle id="hr-support" label="Help & HR support" hint="Show your chosen HR support contact to employees" defaultOn /></ul>
        <div className="border-t border-[#111111]/15 p-5 sm:p-6"><label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="support-contact">HR support contact<textarea id="support-contact" rows={3} defaultValue="People Operations · hr@juant.demo" className="resize-y border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label><div className="mt-4"><PrimaryButton>Save support settings</PrimaryButton></div></div>
      </Panel>

    </>
  )
}
