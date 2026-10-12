'use client'

import { useState } from 'react'
import { systemConfigFor, systemDefinitions, writeSystemConfig, type SystemConfig, type SystemKey } from '@/lib/systems'

export function HrSystemConfig({ userId, userName, onSaved }: { userId: string; userName: string; onSaved: (message: string) => void }) {
  const [config, setConfig] = useState<SystemConfig>(() => systemConfigFor(userId))
  const enabledCount = Object.values(config).filter(Boolean).length

  function toggle(key: SystemKey) {
    const next = { ...config, [key]: !config[key] }
    setConfig(next)
    writeSystemConfig(userId, next)
    const label = systemDefinitions.find((s) => s.key === key)?.label ?? key
    onSaved(`${label} ${next[key] ? 'enabled' : 'disabled'} for ${userName}.`)
  }

  return (
    <div className="flex flex-col gap-4 bg-[#f6f6f3] px-5 py-5 sm:px-6">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60">Configuration</p>
        <p className="mt-1 text-sm text-[#111111]/70">Choose which systems {userName} and their employees can use. At least one system must stay enabled.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {systemDefinitions.map((system) => {
          const enabled = config[system.key]
          const isLastEnabled = enabled && enabledCount === 1
          const switchId = `system-${userId}-${system.key}`
          return (
            <div key={system.key} className={`flex flex-col gap-4 border bg-white p-4 ${enabled ? 'border-[#3159ff]/40' : 'border-[#111111]/15'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor={switchId} className="font-semibold">{system.label}</label>
                  <p className="mt-1 text-xs leading-relaxed text-[#111111]/60">{system.description}</p>
                </div>
                <button
                  id={switchId}
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  disabled={isLastEnabled}
                  title={isLastEnabled ? 'At least one system must stay enabled' : undefined}
                  onClick={() => toggle(system.key)}
                  className={`relative h-6 w-11 shrink-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${enabled ? 'bg-[#3159ff]' : 'bg-[#111111]/20'}`}
                >
                  <span className="sr-only">{enabled ? 'Enabled' : 'Disabled'}</span>
                  <span aria-hidden="true" className={`absolute left-0 top-1 size-4 bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className={`grid gap-3 sm:grid-cols-2 ${enabled ? '' : 'opacity-50'}`}>
                <FeatureList title="HR sees" features={system.hrFeatures} />
                <FeatureList title="Employees see" features={system.employeeFeatures} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeatureList({ title, features }: { title: string; features: string[] }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{title}</p>
      <ul className="flex flex-col gap-0.5 text-xs text-[#111111]/70">
        {features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
    </div>
  )
}
