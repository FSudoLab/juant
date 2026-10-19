'use client'

import { useState } from 'react'
import { Panel } from '@/components/dashboard/primitives'
import { readCardViewPreference, writeCardViewPreference } from '@/lib/access'

const groups = [
  {
    title: 'Notifications',
    description: 'Choose what Juan notifies you about',
    options: [
      { id: 'approvals', label: 'Request approvals', hint: 'When a leave, overtime, or correction is approved or declined', defaultOn: true },
      { id: 'payroll', label: 'Payslip releases', hint: 'When a new payslip is available', defaultOn: true },
      { id: 'reminders', label: 'Time-in reminders', hint: 'A nudge at 08:20 if you have not timed in', defaultOn: false },
      { id: 'announcements', label: 'Company announcements', hint: 'Policy updates and holiday notices', defaultOn: true },
    ],
  },
  {
    title: 'Appearance',
    description: 'Choose how your employee portal navigation appears',
    options: [
      { id: 'card-view', label: 'Card view', hint: 'Show dashboard actions as cards instead of the sidebar', defaultOn: false },
    ],
  },
  {
    title: 'Privacy & security',
    description: 'Control your account and data',
    options: [
      { id: 'two-factor', label: 'Two-step verification', hint: 'Require a code from your phone on sign in', defaultOn: true },
      { id: 'birthday', label: 'Show my birthday to teammates', hint: 'Displayed on the team calendar', defaultOn: false },
    ],
  },
]

function Toggle({ id, label, hint, defaultOn }: { id: string; label: string; hint: string; defaultOn: boolean }) {
  const [checked, setChecked] = useState(() => id === 'card-view' ? readCardViewPreference() : defaultOn)

  function toggle() {
    const nextValue = !checked
    setChecked(nextValue)
    if (id === 'card-view') writeCardViewPreference(nextValue)
  }
  return (
    <li className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-semibold">{label}</span>
        <span className="block text-xs text-[#111111]/60">{hint}</span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${checked ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}
      >
        <span className={`absolute left-0.5 top-0.5 size-4.5 bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </li>
  )
}

export function SettingsForm() {
  return (
    <>
      {groups.map((group) => (
        <Panel key={group.title} title={group.title} description={group.description}>
          <ul className="divide-y divide-[#111111]/15">
            {group.options.map((option) => (
              <Toggle key={option.id} {...option} />
            ))}
          </ul>
        </Panel>
      ))}
    </>
  )
}
