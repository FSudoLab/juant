'use client'

import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Panel, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import type { HrModule, HrRow } from '@/lib/hr-modules'

export function HrModuleView({ module }: { module: HrModule }) {
  const { table, actions = [], create } = module
  const [rows, setRows] = useState<HrRow[]>(table.rows)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [announcement, setAnnouncement] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const confirm = useConfirm()

  const statuses = useMemo(() => ['All', ...Array.from(new Set(rows.map((row) => row.status)))], [rows])
  const counts = useMemo(() => rows.reduce<Record<string, number>>((acc, row) => ({ ...acc, [row.status]: (acc[row.status] ?? 0) + 1 }), {}), [rows])

  const visibleRows = rows.filter((row) => {
    if (statusFilter !== 'All' && row.status !== statusFilter) return false
    if (!query.trim()) return true
    const needle = query.toLowerCase()
    return table.columns.some((column) => row[column.key]?.toLowerCase().includes(needle))
  })

  const primaryLabel = (row: HrRow) => row[table.columns[0].key]

  const applyAction = async (row: HrRow, to: string, label: string) => {
    const ok = await confirm({
      title: `Would you like to ${label.toLowerCase()} ${primaryLabel(row)}?`,
      description: `The status will change from ${row.status} to ${to}.`,
      confirmLabel: `Yes, ${label.toLowerCase()}`,
      tone: ['Declined', 'Rejected', 'Inactive', 'Cancelled'].includes(to) ? 'danger' : 'primary',
    })
    if (!ok) return
    setRows((current) => current.map((item) => (item.id === row.id ? { ...item, status: to } : item)))
    setAnnouncement(`${label}: ${primaryLabel(row)} is now ${to}.`)
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!create) return
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await confirm({ title: `Would you like to ${create.label.toLowerCase()}?`, description: `“${String(data.get(create.fields[0].name) ?? '').trim()}” will be added as ${create.status}.`, confirmLabel: 'Yes, save' })
    if (!ok) return
    const row: HrRow = { id: `new-${Date.now()}`, status: create.status }
    for (const column of table.columns) row[column.key] = '—'
    for (const field of create.fields) {
      const value = String(data.get(field.name) ?? '').trim()
      row[field.name] = field.type === 'date' && value ? formatDate(value) : value || '—'
    }
    setRows((current) => [row, ...current])
    setStatusFilter('All')
    setAnnouncement(`Added ${primaryLabel(row)}.`)
    form.reset()
    dialogRef.current?.close()
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <Panel
        title={table.title}
        description={table.description}
        action={
          create && (
            <button
              type="button"
              onClick={() => dialogRef.current?.showModal()}
              className="inline-flex items-center justify-center gap-2 bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2447d6]"
            >
              <Plus aria-hidden="true" className="size-4" /> {create.label}
            </button>
          )
        }
      >
        <div className="flex flex-col gap-4 border-b border-[#111111]/15 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {statuses.map((status) => {
              const active = statusFilter === status
              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? 'border-[#111111] bg-[#111111] text-[#f6f6f3]' : 'border-[#111111]/15 text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]'}`}
                >
                  {status}
                  <span className={`font-mono text-[10px] ${active ? 'text-white/60' : 'text-[#111111]/40'}`}>{status === 'All' ? rows.length : counts[status]}</span>
                </button>
              )
            })}
          </div>
          <label className="relative block sm:w-64">
            <span className="sr-only">Search {table.title}</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/40" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              className="h-10 w-full border border-[#111111]/15 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#3159ff]"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#111111]/[0.03] font-mono text-[10px] uppercase tracking-[0.12em] text-[#111111]/50">
              <tr className="border-b border-[#111111]/15">
                {table.columns.map((column, index) => (
                  <th key={column.key} scope="col" className={`py-3 font-bold ${index === 0 ? 'px-5 sm:px-6' : 'px-4'}`}>{column.label}</th>
                ))}
                <th scope="col" className="px-4 py-3 font-bold">Status</th>
                {actions.length > 0 && <th scope="col" className="px-5 py-3 text-right font-bold sm:px-6">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {visibleRows.map((row) => {
                const available = actions.filter((action) => action.when.includes(row.status))
                return (
                  <tr key={row.id} className="transition-colors hover:bg-white">
                    {table.columns.map((column, index) => (
                      <td key={column.key} className={`py-4 ${index === 0 ? 'px-5 font-semibold sm:px-6' : 'px-4 text-[#111111]/70'}`}>{row[column.key]}</td>
                    ))}
                    <td className="px-4 py-4"><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td>
                    {actions.length > 0 && (
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex justify-end gap-2">
                          {available.length === 0 && <span className="text-xs text-[#111111]/40">—</span>}
                          {available.map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              onClick={() => applyAction(row, action.to, action.label)}
                              aria-label={`${action.label} ${primaryLabel(row)}`}
                              className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold transition-colors ${action.variant === 'primary' ? 'bg-[#3159ff] text-white hover:bg-[#2447d6]' : 'border border-[#111111]/20 text-[#111111]/70 hover:border-[#111111] hover:text-[#111111]'}`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={table.columns.length + 2} className="px-6 py-12 text-center text-sm text-[#111111]/50">No records match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {create && (
        <dialog
          ref={dialogRef}
          aria-labelledby={`${module.slug}-dialog-title`}
          className="m-auto w-[min(92vw,30rem)] border border-[#111111]/15 bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50"
        >
          <form onSubmit={handleCreate}>
            <div className="flex items-center justify-between border-b border-[#111111]/15 p-5">
              <h2 id={`${module.slug}-dialog-title`} className="text-xl font-semibold tracking-[-0.04em]">{create.label}</h2>
              <button type="button" onClick={() => dialogRef.current?.close()} className="p-1 text-[#111111]/60 hover:text-[#111111]">
                <X aria-hidden="true" className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
              {create.fields.map((field) => {
                const id = `${module.slug}-${field.name}`
                const inputClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60">{field.label}</label>
                    {field.type === 'select' ? (
                      <select id={id} name={field.name} className={inputClass} defaultValue={field.options?.[0]}>
                        {field.options?.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    ) : (
                      <input id={id} name={field.name} type={field.type ?? 'text'} required={field === create.fields[0]} min={field.type === 'number' ? 0 : undefined} className={inputClass} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-end gap-2 border-t border-[#111111]/15 p-5">
              <button type="button" onClick={() => dialogRef.current?.close()} className="border border-[#111111]/20 px-4 py-2.5 text-sm font-semibold hover:border-[#111111]">Cancel</button>
              <button type="submit" className="bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6]">Save</button>
            </div>
          </form>
        </dialog>
      )}
    </>
  )
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
