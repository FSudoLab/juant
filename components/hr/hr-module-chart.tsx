'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { HrModule } from '@/lib/hr-modules'

export function HrModuleChart({ chart }: { chart: NonNullable<HrModule['chart']> }) {
  const peak = Math.max(...chart.data.map((point) => point.value))

  return (
    <section className="border border-[#111111]/15" aria-labelledby="hr-chart-title">
      <div className="flex flex-col gap-1 border-b border-[#111111]/15 p-5 sm:p-6">
        <h2 id="hr-chart-title" className="text-xl font-semibold tracking-[-0.04em]">{chart.title}</h2>
        <p className="text-sm text-[#111111]/60">{chart.description}</p>
      </div>
      <div className="h-64 p-4 sm:p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#111111" strokeOpacity={0.08} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#11111199' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#11111199' }} />
            <Tooltip
              cursor={{ fill: '#3159ff', fillOpacity: 0.06 }}
              contentStyle={{ border: '1px solid rgba(17,17,17,0.15)', borderRadius: 0, fontSize: 12, background: '#f6f6f3' }}
              formatter={(value) => [`${value}${chart.unit === '%' || chart.unit === '/5' || chart.unit === 'K' ? chart.unit : ` ${chart.unit}`}`.trim(), chart.title]}
            />
            <Bar
              dataKey="value"
              radius={0}
              maxBarSize={56}
              shape={(props: { x?: number; y?: number; width?: number; height?: number; payload?: { value: number } }) => (
                <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={props.height}
                  fill={props.payload?.value === peak ? '#3159ff' : '#111111'}
                  fillOpacity={props.payload?.value === peak ? 1 : 0.85}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
