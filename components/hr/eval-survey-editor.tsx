'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Panel } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { defaultSurvey, evalDepartments, readSurvey, writeSurvey, type SurveyConfig } from '@/lib/evaluations'
import { teamRoster } from '@/lib/team-roster'

const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

export function EvalSurveyEditor() {
  const confirm = useConfirm()
  const [survey, setSurvey] = useState<SurveyConfig>(defaultSurvey)
  const [status, setStatus] = useState('')

  useEffect(() => setSurvey(readSurvey()), [])

  const update = (patch: Partial<SurveyConfig>) => setSurvey((current) => ({ ...current, ...patch }))
  const valid = survey.title.trim() && survey.questions.length > 0 && survey.questions.every((q) => q.text.trim())

  async function save() {
    const ok = await confirm({ title: 'Would you like to save this evaluation survey?', description: 'Employees will see the updated questions the next time they open their evaluation.', confirmLabel: 'Yes, save' })
    if (!ok) return
    writeSurvey(survey)
    setStatus('Survey saved.')
  }

  async function removeQuestion(id: string) {
    const ok = await confirm({ title: 'Would you like to remove this question?', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (ok) update({ questions: survey.questions.filter((q) => q.id !== id) })
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <Panel title="Survey" description="Every question is rated 1 to 5, with 5 being the highest.">
        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="survey-title" className={labelClass}>Survey title</label>
              <input id="survey-title" value={survey.title} onChange={(e) => update({ title: e.target.value })} className={fieldClass} />
            </div>
            <label className="flex h-10 items-center gap-3 border border-[#111111]/15 bg-white px-3 text-sm font-medium">
              <input type="checkbox" checked={survey.open} onChange={(e) => update({ open: e.target.checked })} className="size-4 accent-[#3159ff]" />
              Open for answers
            </label>
          </div>
          <ol className="flex flex-col gap-3">
            {survey.questions.map((question, index) => (
              <li key={question.id} className="flex items-end gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor={`question-${question.id}`} className={labelClass}>Question {index + 1}</label>
                  <input
                    id={`question-${question.id}`}
                    value={question.text}
                    onChange={(e) => update({ questions: survey.questions.map((q) => (q.id === question.id ? { ...q, text: e.target.value } : q)) })}
                    placeholder="e.g. Works hard and follows through"
                    className={fieldClass}
                  />
                </div>
                <button type="button" onClick={() => removeQuestion(question.id)} aria-label={`Remove question ${index + 1}`} className="flex size-10 items-center justify-center border border-[#111111]/15 text-[#111111]/60 hover:border-[#c2410c] hover:text-[#c2410c]">
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => update({ questions: [...survey.questions, { id: `q${Date.now()}`, text: '' }] })}
            className="inline-flex items-center gap-2 self-start border border-dashed border-[#111111]/30 px-4 py-2 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]"
          >
            <Plus aria-hidden="true" className="size-4" /> Add question
          </button>
        </div>
      </Panel>
      <Panel title="Who can evaluate" description="Employees only evaluate co-workers in their own department — never the whole company. Turn departments on or off.">
        <ul className="divide-y divide-[#111111]/15">
          {evalDepartments.map((department) => {
            const count = teamRoster.filter((m) => m.department === department).length
            const enabled = survey.departments[department] !== false
            return (
              <li key={department} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div>
                  <p className="font-semibold">{department}</p>
                  <p className="text-xs text-[#111111]/60">{count} {count === 1 ? 'person' : 'people'} · {count < 2 ? 'needs at least 2 people' : 'peers review each other'}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`Peer evaluations in ${department}`}
                  onClick={() => update({ departments: { ...survey.departments, [department]: !enabled } })}
                  className={`relative h-6 w-11 shrink-0 transition-colors ${enabled ? 'bg-[#3159ff]' : 'bg-[#111111]/20'}`}
                >
                  <span className={`absolute top-1 size-4 bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                </button>
              </li>
            )
          })}
        </ul>
      </Panel>
      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={!valid} className="bg-[#3159ff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-40">
          Save survey
        </button>
      </div>
    </>
  )
}
