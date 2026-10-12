'use client'

import { useState, type ReactNode } from 'react'

export function SettingsTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id)

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Settings sections" className="flex overflow-x-auto border-b border-[#111111]/15">
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${selected ? 'border-[#3159ff] text-[#3159ff]' : 'border-transparent text-[#111111]/60 hover:text-[#111111]'}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} hidden={tab.id !== active} className="flex flex-col gap-6">
          {tab.content}
        </div>
      ))}
    </div>
  )
}
