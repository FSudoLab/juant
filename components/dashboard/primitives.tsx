import type { ReactNode } from 'react'

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">{eyebrow}</p>
        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">{title}</h1>
      </div>
      {action}
    </section>
  )
}

export function EmployeeAvatar({ className = 'size-9 text-sm' }: { className?: string }) {
  return <span aria-label="Alex Cruz" className={`inline-flex shrink-0 items-center justify-center bg-[#3159ff] font-semibold text-white ${className}`}>AC</span>
}

export function StatGrid({ stats, label }: { stats: { label: string; value: string; hint?: string }[]; label: string }) {
  return (
    <section className="grid border-l border-t border-[#111111]/15 sm:grid-cols-2 lg:grid-cols-4" aria-label={label}>
      {stats.map((stat) => (
        <div key={stat.label} className="border-b border-r border-[#111111]/15 p-5 sm:p-6">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{stat.label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{stat.value}</p>
          {stat.hint && <p className="mt-1 text-xs text-[#111111]/50">{stat.hint}</p>}
        </div>
      ))}
    </section>
  )
}

export function Panel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="border border-[#111111]/15 bg-[#f6f6f3]">
      <div className="flex flex-col gap-3 border-b border-[#111111]/15 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.04em]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[#111111]/60">{description}</p>}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  )
}

const tones = {
  blue: 'border-[#3159ff]/30 bg-[#3159ff]/10 text-[#3159ff]',
  amber: 'border-[#c2410c]/30 bg-[#c2410c]/10 text-[#c2410c]',
  neutral: 'border-[#111111]/20 bg-[#111111]/5 text-[#111111]/70',
  dark: 'border-[#111111] bg-[#111111] text-[#f6f6f3]',
} as const

export type BadgeTone = keyof typeof tones

export function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${tones[tone]}`}>{children}</span>
}

const blueStatuses = ['Approved', 'On time', 'Completed', 'Resolved', 'Active', 'Complete', 'Published', 'Hired', 'Released', 'Remitted', 'Paid', 'Cleared', 'Ready', 'Enabled', 'Excused', 'Acknowledged']
const amberStatuses = ['Late', 'Undertime', 'Declined', 'Rejected', 'Absent', 'Incomplete', 'Inactive', 'Overdue']
const darkStatuses = ['Pending', 'Open', 'For review', 'For approval', 'In progress', 'In review', 'Processing', 'Interview', 'Offer', 'Ongoing', 'Computing', 'Probation', 'New', 'Screening']

export function statusTone(status: string): BadgeTone {
  if (blueStatuses.includes(status)) return 'blue'
  if (amberStatuses.includes(status)) return 'amber'
  if (darkStatuses.includes(status)) return 'dark'
  return 'neutral'
}

export function PrimaryButton({ children, type = 'button' }: { children: ReactNode; type?: 'button' | 'submit' }) {
  return (
    <button type={type} className="inline-flex items-center justify-center gap-2 bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2447d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff]">
      {children}
    </button>
  )
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="h-1.5 w-full bg-[#111111]/10" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-[#3159ff]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}
