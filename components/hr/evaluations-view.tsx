'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, Search, X } from 'lucide-react'
import { Panel, StatGrid, StatusBadge } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { EVAL_EVENT, defaultSurvey, finalScore, peerReviewsFor, readRatings, readSurvey, writeRating, type HrRatings, type SurveyConfig } from '@/lib/evaluations'
import { teamRoster, type TeamMember } from '@/lib/team-roster'

const ALL = 'All'
const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'
const nameOf = (id: string) => teamRoster.find((m) => m.id === id)?.name ?? 'Unknown'

function useEvalStore() {
  const [survey, setSurvey] = useState<SurveyConfig>(defaultSurvey)
  const [ratings, setRatings] = useState<HrRatings>({})
  useEffect(() => {
    const sync = () => {
      setSurvey(readSurvey())
      setRatings(readRatings())
    }
    sync()
    window.addEventListener(EVAL_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVAL_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return { survey, ratings }
}

export function EvaluationsView() {
  const { survey, ratings } = useEvalStore()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(ALL)
  const [target, setTarget] = useState<TeamMember | null>(null)
  const departments = [ALL, ...new Set(teamRoster.map((m) => m.department))]

  const visible = teamRoster.filter((m) => {
    if (department !== ALL && m.department !== department) return false
    const needle = query.trim().toLowerCase()
    return !needle || [m.name, m.position, m.empNo].some((v) => v.toLowerCase().includes(needle))
  })

  const scored = teamRoster.map((m) => finalScore(ratings[m.id], survey.questions)).filter((v): v is number => v !== null)
  const average = scored.length ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : '—'

  return (
    <>
      <StatGrid
        label="Evaluation summary"
        stats={[
          { label: 'Cycle', value: survey.title.split(' ').slice(0, 2).join(' ') },
          { label: 'People', value: String(teamRoster.length).padStart(2, '0') },
          { label: 'HR rated', value: String(scored.length).padStart(2, '0') },
          { label: 'Avg. final score', value: average, hint: 'out of 5' },
        ]}
      />
      <Panel title="Employee evaluations" description="Open an employee to read co-worker reviews and give the HR rating that decides their final score.">
        <div className="grid gap-4 border-b border-[#111111]/15 p-5 sm:grid-cols-[1.5fr_1fr] sm:p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="eval-search" className={labelClass}>Search</label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/40" />
              <input id="eval-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, position, or employee no." className={`${fieldClass} pl-9`} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="eval-department" className={labelClass}>Department</label>
            <select id="eval-department" value={department} onChange={(e) => setDepartment(e.target.value)} className={fieldClass}>
              {departments.map((d) => <option key={d} value={d}>{d === ALL ? 'All departments' : d}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#111111]/[0.03] font-mono text-[10px] uppercase tracking-[0.12em] text-[#111111]/50">
              <tr className="border-b border-[#111111]/15">
                <th scope="col" className="px-5 py-3 font-bold sm:px-6">Employee</th>
                <th scope="col" className="px-4 py-3 font-bold">Position</th>
                <th scope="col" className="px-4 py-3 font-bold">Peer reviews</th>
                <th scope="col" className="px-4 py-3 font-bold">Final score</th>
                <th scope="col" className="px-5 py-3 text-right font-bold sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {visible.map((member) => {
                const score = finalScore(ratings[member.id], survey.questions)
                const reviews = peerReviewsFor(member.id)
                return (
                  <tr key={member.id} className="transition-colors hover:bg-white">
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-semibold">{member.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-[#111111]/50">{member.empNo} · {member.department}</p>
                    </td>
                    <td className="px-4 py-4 text-[#111111]/70">{member.position}</td>
                    <td className="px-4 py-4 text-[#111111]/70">{reviews.length === 0 ? 'None yet' : `${reviews.length} co-worker${reviews.length > 1 ? 's' : ''}`}</td>
                    <td className="px-4 py-4">
                      {score === null ? <StatusBadge tone="neutral">Not rated</StatusBadge> : <span className="font-mono text-base font-bold">{score.toFixed(1)}<span className="text-xs font-normal text-[#111111]/50"> / 5</span></span>}
                    </td>
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setTarget(member)} aria-label={`View evaluation of ${member.name}`} className="inline-flex items-center gap-1.5 border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]">
                          <Eye aria-hidden="true" className="size-3.5" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#111111]/50">No one matches these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      {target && <EvaluationDialog key={target.id} member={target} survey={survey} saved={ratings[target.id]} onClose={() => setTarget(null)} />}
    </>
  )
}

function EvaluationDialog({ member, survey, saved, onClose }: { member: TeamMember; survey: SurveyConfig; saved?: Record<string, number>; onClose: () => void }) {
  const confirm = useConfirm()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [answers, setAnswers] = useState<Record<string, number>>(saved ?? {})
  const reviews = peerReviewsFor(member.id)
  const score = finalScore(answers, survey.questions)
  const complete = survey.questions.every((q) => answers[q.id])

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  async function save() {
    const ok = await confirm({
      title: `Would you like to save the rating for ${member.name}?`,
      description: `Their final score will be ${score?.toFixed(1) ?? '—'} out of 5.`,
      confirmLabel: 'Yes, save rating',
    })
    if (!ok) return
    writeRating(member.id, answers)
    onClose()
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="eval-dialog-title" className="m-auto w-[min(720px,calc(100vw-2rem))] border border-[#111111] bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50">
      <header className="flex items-start justify-between gap-4 border-b border-[#111111]/15 p-5 sm:p-6">
        <div>
          <p className={labelClass}>{member.department} · {member.position}</p>
          <h2 id="eval-dialog-title" className="mt-1 text-xl font-bold">{member.name}</h2>
        </div>
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="p-1 text-[#111111]/60 hover:text-[#111111]">
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>
      <div className="flex max-h-[65vh] flex-col gap-6 overflow-y-auto p-5 sm:p-6">
        <section aria-labelledby="peer-heading" className="flex flex-col gap-3">
          <h3 id="peer-heading" className={labelClass}>Co-worker reviews · same department</h3>
          {reviews.length === 0 ? (
            <p className="border border-dashed border-[#111111]/20 p-4 text-sm text-[#111111]/60">No co-workers in this department have reviewed {member.name} yet.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-[#111111]/15 border border-[#111111]/15 bg-white">
              {reviews.map((review, index) => (
                <li key={review.reviewerId} className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{index + 1}. {nameOf(review.reviewerId)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#111111]/70">{review.comment}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold">{review.score}<span className="font-normal text-[#111111]/50">/5</span></span>
                </li>
              ))}
            </ol>
          )}
        </section>
        <section aria-labelledby="hr-heading" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <h3 id="hr-heading" className={labelClass}>HR rating · decides the final score</h3>
            <p className="font-mono text-sm">Final <strong className="text-lg">{score?.toFixed(1) ?? '—'}</strong> / 5</p>
          </div>
          <ul className="flex flex-col divide-y divide-[#111111]/15 border border-[#111111]/15 bg-white">
            {survey.questions.map((question) => (
              <li key={question.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p id={`q-${question.id}`} className="text-sm font-medium">{question.text}</p>
                <div role="radiogroup" aria-labelledby={`q-${question.id}`} className="flex shrink-0 gap-1">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const selected = answers[question.id] === value
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${value} out of 5`}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                        className={`size-9 border font-mono text-sm font-bold transition-colors ${selected ? 'border-[#3159ff] bg-[#3159ff] text-white' : 'border-[#111111]/20 hover:border-[#3159ff] hover:text-[#3159ff]'}`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#111111]/50">1 is the lowest and 5 is the highest. Co-worker scores are for reference only.</p>
        </section>
      </div>
      <footer className="flex justify-end gap-3 border-t border-[#111111]/15 p-5 sm:p-6">
        <button type="button" onClick={() => dialogRef.current?.close()} className="border border-[#111111]/20 px-4 py-2 text-sm font-semibold hover:border-[#111111]">Cancel</button>
        <button type="button" onClick={save} disabled={!complete} className="bg-[#3159ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-40">Save rating</button>
      </footer>
    </dialog>
  )
}
