'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ClipboardList, History } from 'lucide-react'
import { StatGrid, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import type { AttendanceMonth, AttendanceRecord, ManualRequest, RecordLocation } from '@/lib/attendance-records'

type Tab = 'attendance' | 'manual'

const dash = <span className="text-[#111111]/30">—</span>

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}

function num(value: number | null, { hideZero = false, parens = false } = {}) {
  if (value === null || (hideZero && value === 0)) return dash
  const text = value.toFixed(2)
  return parens ? `(${text})` : text
}

function LocationCell({ location }: { location?: RecordLocation }) {
  if (!location) return dash
  return (
    <div className="max-w-44">
      <p className="truncate font-medium">{location.place}</p>
      <p className="mt-0.5 text-xs text-[#111111]/50">{location.source}</p>
    </div>
  )
}

const typeTone: Record<AttendanceRecord['type'], string> = {
  Regular: 'text-[#111111]',
  'Rest Day': 'text-[#111111]/45',
  Holiday: 'text-[#3159ff]',
  Leave: 'text-[#3159ff]',
  Absent: 'text-[#c2410c]',
}

const headers = ['Date', 'Type', 'Status', 'In', 'Out', 'In location', 'Out location', 'Hours', 'Break', 'OT', 'Late', 'Total']
const numericFrom = 7

function sum(records: AttendanceRecord[], key: 'hours' | 'breakHours' | 'ot' | 'late' | 'total') {
  return Math.round(records.reduce((acc, r) => acc + (r[key] ?? 0), 0) * 100) / 100
}

export function AttendanceRecords({ months, manual }: { months: AttendanceMonth[]; manual: ManualRequest[] }) {
  const [tab, setTab] = useState<Tab>('attendance')
  const [index, setIndex] = useState(months.length - 1)
  const month = months[index]

  const worked = month.records.filter((r) => r.timeIn)
  const lateDays = month.records.filter((r) => r.status === 'Late').length
  const totals = {
    hours: sum(month.records, 'hours'),
    breakHours: sum(month.records, 'breakHours'),
    ot: sum(month.records, 'ot'),
    late: sum(month.records, 'late'),
    total: sum(month.records, 'total'),
  }
  const monthManual = manual.filter((m) => m.date.startsWith(month.key))

  return (
    <div className="flex flex-col gap-6">
      <StatGrid
        label={`${month.label} summary`}
        stats={[
          { label: 'Days present', value: String(worked.length), hint: month.label },
          { label: 'Late arrivals', value: String(lateDays), hint: `${totals.late.toFixed(2)} hrs total` },
          { label: 'Overtime', value: `${totals.ot.toFixed(2)}h`, hint: 'Filed and computed' },
          { label: 'Total hours', value: totals.total.toFixed(2), hint: 'Regular + OT' },
        ]}
      />

      <section className="border border-[#111111]/15 bg-[#f6f6f3]">
        <div className="flex flex-col gap-4 border-b border-[#111111]/15 px-5 pt-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div role="tablist" aria-label="History type" className="flex gap-6">
            {(
              [
                { id: 'attendance', label: 'Attendance history', icon: History },
                { id: 'manual', label: 'Manual history', icon: ClipboardList },
              ] as const
            ).map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  id={`tab-${id}`}
                  onClick={() => setTab(id)}
                  className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors ${
                    active ? 'border-[#3159ff] text-[#3159ff]' : 'border-transparent text-[#111111]/55 hover:text-[#111111]'
                  }`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-0 pb-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous month"
              className="flex size-9 items-center justify-center border border-[#111111]/15 hover:bg-[#111111]/5 disabled:opacity-30"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <label htmlFor="attendance-month" className="sr-only">
              Select month
            </label>
            <select
              id="attendance-month"
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              className="h-9 min-w-44 border-y border-[#111111]/15 bg-[#f6f6f3] px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#3159ff]"
            >
              {months.map((m, i) => (
                <option key={m.key} value={i}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(months.length - 1, i + 1))}
              disabled={index === months.length - 1}
              aria-label="Next month"
              className="flex size-9 items-center justify-center border border-[#111111]/15 hover:bg-[#111111]/5 disabled:opacity-30"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        {tab === 'attendance' ? (
          <div id="panel-attendance" role="tabpanel" aria-labelledby="tab-attendance" className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-sm">
              <caption className="sr-only">Attendance records for {month.label}</caption>
              <thead>
                <tr className="bg-[#111111] text-[#f6f6f3]">
                  {headers.map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`whitespace-nowrap px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${i >= numericFrom ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {month.records.map((r) => {
                  const muted = r.type === 'Rest Day'
                  return (
                    <tr key={r.date} className={`border-b border-[#111111]/10 ${muted ? 'bg-[#111111]/[0.03] text-[#111111]/45' : 'hover:bg-white'}`}>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="font-medium tabular-nums">{formatDate(r.date)}</span>
                        <span className="ml-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#111111]/40">{r.weekday}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`font-medium ${typeTone[r.type]}`}>{r.type}</span>
                        {r.note && <p className="text-xs text-[#111111]/50">{r.note}</p>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{r.status ? <StatusBadge tone={statusTone(r.status)}>{r.status}</StatusBadge> : dash}</td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{r.timeIn ?? dash}</td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{r.timeOut ?? dash}</td>
                      <td className="px-4 py-3">
                        <LocationCell location={r.inLocation} />
                      </td>
                      <td className="px-4 py-3">
                        <LocationCell location={r.outLocation} />
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{num(r.hours)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{num(r.breakHours, { parens: true })}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{num(r.ot, { hideZero: true })}</td>
                      <td className={`px-4 py-3 text-right tabular-nums ${r.late ? 'text-[#c2410c]' : ''}`}>{num(r.late, { hideZero: true })}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{num(r.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#111111]/[0.06] font-semibold">
                  <th scope="row" colSpan={numericFrom} className="px-4 py-4 text-left font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
                    Period totals
                  </th>
                  <td className="px-4 py-4 text-right tabular-nums">{totals.hours.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right tabular-nums">({totals.breakHours.toFixed(2)})</td>
                  <td className="px-4 py-4 text-right tabular-nums">{totals.ot.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right tabular-nums text-[#c2410c]">{totals.late.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-base tabular-nums">{totals.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div id="panel-manual" role="tabpanel" aria-labelledby="tab-manual">
            {monthManual.length === 0 ? (
              <p className="p-6 text-sm text-[#111111]/60">No manual requests filed in {month.label}.</p>
            ) : (
              <ul className="divide-y divide-[#111111]/10">
                {monthManual.map((m) => (
                  <li key={m.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">
                        {m.id} · {formatDate(m.date)}
                      </p>
                      <p className="mt-1 font-semibold">
                        {m.kind} <span className="font-normal text-[#111111]/60">· {m.requested}</span>
                      </p>
                      <p className="text-sm text-[#111111]/60">{m.reason}</p>
                    </div>
                    <StatusBadge tone={statusTone(m.status)}>{m.status}</StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
