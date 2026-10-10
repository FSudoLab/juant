'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Panel, PrimaryButton } from '@/components/dashboard/primitives'
import { SystemAdminSettingsForm } from '@/components/system-admin/system-admin-settings-form'

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
  const employees = ['Alex Cruz', 'Mia Santos', 'Noah Reyes', 'Jamie Lim']

  return (
    <>
      <Panel title="Employee schedules" description="Set the standard workweek and daily hours for your team.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="schedule-days">Workweek<select id="schedule-days" defaultValue="monday-friday" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal"><option value="monday-friday">Monday to Friday</option><option value="all-week">Monday to Sunday</option></select></label>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="start-time">Start time<input id="start-time" type="time" defaultValue="08:30" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="end-time">End time<input id="end-time" type="time" defaultValue="17:30" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal" /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="break-time">Break duration<select id="break-time" defaultValue="60" className="border border-[#111111]/20 bg-transparent px-3 py-2.5 font-normal"><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option></select></label>
        </div>
        <div className="border-t border-[#111111]/15 px-5 py-4 sm:px-6"><PrimaryButton>Save schedule</PrimaryButton></div>
      </Panel>

      <Panel title="Customize each employee" description="Each employee can have their own workweek, start time, and end time.">
        <div className="divide-y divide-[#111111]/15">
          {employees.map((employee, index) => <EmployeeSchedule key={employee} employee={employee} index={index} />)}
        </div>
      </Panel>

      <SystemAdminSettingsForm />

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

      <Panel title="Team resources" description="Control the information and materials your team can receive from you." action={<Link href="/dashboard/manager/employee-information" className="text-sm font-semibold text-[#3159ff]">Try employee information →</Link>}>
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

function EmployeeSchedule({ employee, index }: { employee: string; index: number }) {
  const [workweek, setWorkweek] = useState(index === 1 ? 'monday-saturday' : 'monday-friday')
  const [start, setStart] = useState(index === 2 ? '09:00' : '08:30')
  const [end, setEnd] = useState(index === 2 ? '18:00' : '17:30')

  return <div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_1.3fr_1fr_1fr_auto] sm:items-end sm:p-6">
    <p className="text-sm font-semibold">{employee}<span className="mt-1 block text-xs font-normal text-[#111111]/50">Individual schedule</span></p>
    <label className="flex flex-col gap-2 text-xs font-semibold" htmlFor={`${employee}-workweek`}>Workweek<select id={`${employee}-workweek`} value={workweek} onChange={(event) => setWorkweek(event.target.value)} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 text-sm font-normal"><option value="monday-friday">Mon-Fri</option><option value="monday-saturday">Mon-Sat</option><option value="all-week">Mon-Sun</option></select></label>
    <label className="flex flex-col gap-2 text-xs font-semibold" htmlFor={`${employee}-start`}>Starts<input id={`${employee}-start`} type="time" value={start} onChange={(event) => setStart(event.target.value)} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 text-sm font-normal" /></label>
    <label className="flex flex-col gap-2 text-xs font-semibold" htmlFor={`${employee}-end`}>Ends<input id={`${employee}-end`} type="time" value={end} onChange={(event) => setEnd(event.target.value)} className="border border-[#111111]/20 bg-transparent px-3 py-2.5 text-sm font-normal" /></label>
    <PrimaryButton>Save</PrimaryButton>
  </div>
}