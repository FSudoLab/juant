'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const attendanceTrend = [
  { label: 'Aug 17', hours: 39.5, onTime: 4 },
  { label: 'Aug 24', hours: 41.2, onTime: 5 },
  { label: 'Aug 31', hours: 38.1, onTime: 3 },
  { label: 'Sep 7', hours: 42.4, onTime: 5 },
  { label: 'Sep 14', hours: 40.6, onTime: 4 },
  { label: 'Sep 21', hours: 43.0, onTime: 5 },
  { label: 'Sep 28', hours: 41.8, onTime: 5 },
  { label: 'Oct 5', hours: 42.6, onTime: 4 },
]

const performanceTrend = [
  { label: 'May', score: 78, goals: 64 },
  { label: 'Jun', score: 81, goals: 70 },
  { label: 'Jul', score: 80, goals: 72 },
  { label: 'Aug', score: 85, goals: 79 },
  { label: 'Sep', score: 88, goals: 83 },
  { label: 'Oct', score: 91, goals: 86 },
]

const views = {
  attendance: {
    label: 'Attendance',
    title: 'Hours logged per week',
    summary: [
      ['Avg / week', '41.2h'],
      ['On-time rate', '88%'],
      ['vs. target', '+3%'],
    ],
    href: '/dashboard/employee/attendance',
    action: 'Full attendance',
  },
  performance: {
    label: 'Performance',
    title: 'Performance score trend',
    summary: [
      ['Current score', '91'],
      ['Goals met', '86%'],
      ['Since May', '+13 pts'],
    ],
    href: '/dashboard/employee/performance',
    action: 'Full performance',
  },
} as const

type View = keyof typeof views

const axisTick = { fill: 'rgba(17,17,17,0.5)', fontSize: 11, fontFamily: 'var(--font-mono, monospace)' }

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  unit: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-[#111111]/15 bg-[#f6f6f3] px-3 py-2 shadow-sm">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="mt-1 flex items-center gap-2 text-sm font-semibold">
          <span className="size-2" style={{ backgroundColor: item.color }} aria-hidden="true" />
          {item.name}: {item.value}
          {unit}
        </p>
      ))}
    </div>
  )
}

export function DashboardInsightsChart() {
  const [view, setView] = useState<View>('attendance')
  const current = views[view]

  return (
    <section className="border border-[#111111]/15" aria-labelledby="insights-title">
      <div className="flex flex-col gap-5 border-b border-[#111111]/15 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">Insights</p>
          <h2 id="insights-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            {current.title}
          </h2>
        </div>
        <div className="flex border border-[#111111]/15" role="tablist" aria-label="Chart view">
          {(Object.keys(views) as View[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                view === key ? 'bg-[#111111] text-[#f6f6f3]' : 'text-[#111111]/60 hover:bg-[#111111]/[0.04]'
              }`}
            >
              {views[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-[1fr_14rem]">
        <div className="h-72 p-4 sm:p-6" role="tabpanel" aria-label={`${current.label} chart`}>
          <ResponsiveContainer width="100%" height="100%">
            {view === 'attendance' ? (
              <BarChart data={attendanceTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(17,17,17,0.08)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} dy={8} />
                <YAxis tickLine={false} axisLine={false} tick={axisTick} domain={[30, 45]} />
                <ReferenceLine
                  y={40}
                  stroke="#111111"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  label={{ value: 'Target 40h', position: 'insideTopRight', fill: 'rgba(17,17,17,0.5)', fontSize: 11 }}
                />
                <Tooltip cursor={{ fill: 'rgba(49,89,255,0.06)' }} content={<ChartTooltip unit="h" />} />
                <Bar dataKey="hours" name="Hours" fill="#3159ff" maxBarSize={36} animationDuration={600} />
              </BarChart>
            ) : (
              <AreaChart data={performanceTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3159ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3159ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(17,17,17,0.08)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} dy={8} />
                <YAxis tickLine={false} axisLine={false} tick={axisTick} domain={[50, 100]} />
                <Tooltip cursor={{ stroke: 'rgba(17,17,17,0.2)' }} content={<ChartTooltip unit="" />} />
                <Area
                  type="monotone"
                  dataKey="goals"
                  name="Goals met %"
                  stroke="#111111"
                  strokeOpacity={0.45}
                  strokeDasharray="4 4"
                  fill="transparent"
                  strokeWidth={1.5}
                  animationDuration={600}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="#3159ff"
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                  activeDot={{ r: 5, fill: '#3159ff', stroke: '#f6f6f3', strokeWidth: 2 }}
                  animationDuration={600}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <dl className="grid grid-cols-3 border-t border-[#111111]/15 sm:grid-cols-1 sm:border-l sm:border-t-0">
          {current.summary.map(([label, value]) => (
            <div key={label} className="border-r border-[#111111]/15 p-4 last:border-r-0 sm:border-b sm:border-r-0 sm:p-5">
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{value}</dd>
            </div>
          ))}
          <div className="col-span-3 flex items-end border-t border-[#111111]/15 p-4 sm:col-span-1 sm:border-t-0 sm:p-5">
            <Link href={current.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#3159ff]">
              {current.action}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </dl>
      </div>
    </section>
  )
}
