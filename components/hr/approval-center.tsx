'use client'

import { useState, type KeyboardEvent } from 'react'
import { StatGrid } from '@/components/dashboard/primitives'
import { HrModuleChart } from '@/components/hr/hr-module-chart'
import { HrModuleView } from '@/components/hr/hr-module-view'
import type { HrModule } from '@/lib/hr-modules'

export type ApprovalTab = { id: string; label: string; module: HrModule }

export function ApprovalCenter({ tabs }: { tabs: ApprovalTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0].id)

  const focusTab = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length]
    setActiveId(next.id)
    document.getElementById(`approval-tab-${next.id}`)?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') focusTab(index + 1)
    else if (event.key === 'ArrowLeft') focusTab(index - 1)
    else if (event.key === 'Home') focusTab(0)
    else if (event.key === 'End') focusTab(tabs.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Approval categories" className="flex overflow-x-auto border-b border-[#111111]/15">
        {tabs.map((tab, index) => {
          const active = tab.id === activeId
          const pending = tab.module.table.rows.filter((row) => row.status === 'Pending' || row.status === 'Late' || row.status === 'Absent').length
          return (
            <button
              key={tab.id}
              id={`approval-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`approval-panel-${tab.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${active ? 'border-[#3159ff] text-[#111111]' : 'border-transparent text-[#111111]/55 hover:text-[#111111]'}`}
            >
              {tab.label}
              {pending > 0 && (
                <span className={`px-1.5 py-0.5 font-mono text-[10px] ${active ? 'bg-[#3159ff] text-white' : 'bg-[#111111]/10 text-[#111111]/60'}`}>{pending}</span>
              )}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => (
        <section
          key={tab.id}
          id={`approval-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`approval-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="flex flex-col gap-6"
        >
          <p className="max-w-2xl text-sm leading-relaxed text-[#111111]/60">{tab.module.description}</p>
          <StatGrid stats={tab.module.stats} label={`${tab.label} summary`} />
          {tab.module.chart && <HrModuleChart chart={tab.module.chart} />}
          <HrModuleView module={tab.module} />
        </section>
      ))}
    </div>
  )
}
