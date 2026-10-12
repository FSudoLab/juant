'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Panel } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { defaultSurvey, evalDepartments, readSurvey, scaleOptions, writeSurvey, type EvalCategory, type SurveyConfig } from '@/lib/evaluations'
import { teamRoster } from '@/lib/team-roster'

const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function EvalSurveyEditor() {
  const confirm = useConfirm()
  const [survey, setSurvey] = useState<SurveyConfig>(defaultSurvey)
  const [status, setStatus] = useState('')

  useEffect(() => setSurvey(readSurvey()), [])

  const update = (patch: Partial<SurveyConfig>) => setSurvey((current) => ({ ...current, ...patch }))
  const updateCategory = (id: string, patch: (category: EvalCategory) => EvalCategory) =>
    setSurvey((current) => ({ ...current, categories: current.categories.map((c) => (c.id === id ? patch(c) : c)) }))

  const valid =
    survey.title.trim() &&
    survey.categories.length > 0 &&
    survey.categories.every((c) => c.name.trim() && c.questions.length > 0 && c.questions.every((q) => q.text.trim()))

  async function save() {
    const ok = await confirm({ title: 'Would you like to save this evaluation survey?', description: 'Employees will see the updated categories and questions the next time they open their peer evaluation.', confirmLabel: 'Yes, save' })
    if (!ok) return
    writeSurvey(survey)
    setStatus('Survey saved.')
  }

  async function removeCategory(category: EvalCategory) {
    const ok = await confirm({ title: `Would you like to remove the ${category.name || 'untitled'} category?`, description: 'All of its questions will be removed too.', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (ok) update({ categories: survey.categories.filter((c) => c.id !== category.id) })
  }

  async function removeQuestion(categoryId: string, questionId: string) {
    const ok = await confirm({ title: 'Would you like to remove this question?', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (ok) updateCategory(categoryId, (c) => ({ ...c, questions: c.questions.filter((q) => q.id !== questionId) }))
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <Panel title="Survey" description={`Every question is rated 1 to ${survey.scaleMax}, with ${survey.scaleMax} being the highest.`}>
        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-end sm:p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="survey-title" className={labelClass}>Survey title</label>
            <input id="survey-title" value={survey.title} onChange={(e) => update({ title: e.target.value })} className={fieldClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="survey-scale" className={labelClass}>Rating scale</label>
            <select id="survey-scale" value={survey.scaleMax} onChange={(e) => update({ scaleMax: Number(e.target.value) })} className={`${fieldClass} sm:w-32`}>
              {scaleOptions.map((max) => <option key={max} value={max}>1 to {max}</option>)}
            </select>
          </div>
          <label className="flex h-10 items-center gap-3 border border-[#111111]/15 bg-white px-3 text-sm font-medium">
            <input type="checkbox" checked={survey.open} onChange={(e) => update({ open: e.target.checked })} className="size-4 accent-[#3159ff]" />
            Open for answers
          </label>
        </div>
      </Panel>

      {survey.categories.map((category, categoryIndex) => (
        <section key={category.id} aria-label={`Category ${categoryIndex + 1}`} className="border border-[#111111]/15 bg-white">
          <header className="flex items-end gap-3 border-b border-[#111111]/15 p-5 sm:p-6">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor={`category-${category.id}`} className={labelClass}>Category {categoryIndex + 1}</label>
              <input
                id={`category-${category.id}`}
                value={category.name}
                onChange={(e) => updateCategory(category.id, (c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Work"
                className={`${fieldClass} text-base font-semibold`}
              />
            </div>
            <button type="button" onClick={() => removeCategory(category)} aria-label={`Remove category ${category.name || categoryIndex + 1}`} className="flex size-10 items-center justify-center border border-[#111111]/15 text-[#111111]/60 hover:border-[#c2410c] hover:text-[#c2410c]">
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </header>
          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <ol className="flex flex-col gap-3">
              {category.questions.map((question, index) => (
                <li key={question.id} className="flex items-end gap-3">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor={`question-${question.id}`} className={labelClass}>Question {index + 1}</label>
                    <input
                      id={`question-${question.id}`}
                      value={question.text}
                      onChange={(e) => updateCategory(category.id, (c) => ({ ...c, questions: c.questions.map((q) => (q.id === question.id ? { ...q, text: e.target.value } : q)) }))}
                      placeholder="e.g. Is he good at his work?"
                      className={fieldClass}
                    />
                  </div>
                  <button type="button" onClick={() => removeQuestion(category.id, question.id)} aria-label={`Remove question ${index + 1} from ${category.name || 'category'}`} className="flex size-10 items-center justify-center border border-[#111111]/15 text-[#111111]/60 hover:border-[#c2410c] hover:text-[#c2410c]">
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </li>
              ))}
            </ol>
            {category.questions.length === 0 && <p className="text-sm text-[#c2410c]">Add at least one question to this category.</p>}
            <button
              type="button"
              onClick={() => updateCategory(category.id, (c) => ({ ...c, questions: [...c.questions, { id: uid('q'), text: '' }] }))}
              className="inline-flex items-center gap-2 self-start border border-dashed border-[#111111]/30 px-4 py-2 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]"
            >
              <Plus aria-hidden="true" className="size-4" /> Add question
            </button>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={() => update({ categories: [...survey.categories, { id: uid('cat'), name: '', questions: [{ id: uid('q'), text: '' }] }] })}
        className="inline-flex items-center justify-center gap-2 border border-dashed border-[#111111]/30 bg-white px-4 py-4 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]"
      >
        <Plus aria-hidden="true" className="size-4" /> Add category
      </button>

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
