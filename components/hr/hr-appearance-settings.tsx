'use client'

import { useEffect, useState } from 'react'
import { Panel } from '@/components/dashboard/primitives'
import { readCardViewPreference, writeCardViewPreference } from '@/lib/access'

export function HrAppearanceSettings() {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(readCardViewPreference('hr'))
  }, [])

  function toggle() {
    const nextValue = !checked
    setChecked(nextValue)
    writeCardViewPreference(nextValue, 'hr')
  }

  return (
    <Panel title="Appearance" description="Choose how your HR portal navigation appears">
      <ul className="divide-y divide-[#111111]/15">
        <li className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6">
          <label htmlFor="hr-card-view" className="cursor-pointer">
            <span className="block font-semibold">Card view</span>
            <span className="block text-xs text-[#111111]/60">Show dashboard actions as cards instead of the sidebar</span>
          </label>
          <button
            id="hr-card-view"
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={toggle}
            className={`relative h-6 w-11 shrink-0 overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] ${checked ? 'border-[#3159ff] bg-[#3159ff]' : 'border-[#111111]/20 bg-[#111111]/10'}`}
          >
            <span className={`absolute left-0.5 top-0.5 size-4.5 bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </li>
      </ul>
    </Panel>
  )
}
