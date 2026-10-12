'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, Search, X } from 'lucide-react'
import { Panel, StatGrid, StatusBadge } from '@/components/dashboard/primitives'
import { overallScore, peerReviewsFor, reviewScore, type PeerReview, type SurveyConfig } from '@/lib/evaluations'
import { teamRoster, type TeamMember } from '@/lib/team-roster'
import { useEvalStore } from './use-eval-store'

const ALL = 'All'
const fieldClass = 'h-10 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'
const nameOf = (id: string) => teamRoster.find((m) => m.id === id)?.name ?? 'Unknown'

function ScoreValue({ value, max, size = 'base' }: { value: number | null; max: number; size?: 'base' | 'lg' }) {
  if (value === null) return <StatusBadge tone="neutral">No reviews</StatusBadge>
  return (
    <span className={`font-mono font-bold ${size === 'lg' ? 'text-3xl' : 'text-base'}`}>
      {value.toFixed(1)}
      <span className="text-xs font-normal text-[#111111]/50"> / {max}</span>
    </span>
  )
}

export function EvaluationsView() {
  const { survey, submissions } = useEvalStore()
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState(ALL)
  const [target, setTarget] = useState<TeamMember | null>(null)
  const departments = [ALL, ...new Set(teamRoster.map((m) => m.department))]

  const rows = teamRoster.map((member) => {
    const reviews = peerReviewsFor(member.id, survey, submissions)
    return { member, reviews, overall: overallScore(reviews, survey) }
  })
  const visible = rows.filter(({ member }) => {
    if (department !== ALL && member.department !== department) return false
    const needle = query.trim().toLowerCase()
    return !needle || [member.name, member.position, member.empNo].some((v) => v.toLowerCase().includes(needle))
  })

  const scored = rows.map((r) => r.overall).filter((v): v is number => v !== null)
  const average = scored.length ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : '—'
  const totalReviews = rows.reduce((sum, r) => sum + r.reviews.length, 0)
  const selected = target ? rows.find((r) => r.member.id === target.id) : undefined

  return (
    <>
      <StatGrid
        label="Evaluation summary"
        stats={[
          { label: 'Cycle', value: survey.title.split(' ').slice(0, 2).join(' ') },
          { label: 'Status', value: survey.open ? 'Open' : 'Closed' },
          { label: 'Peer reviews', value: String(totalReviews).padStart(2, '0') },
          { label: 'Avg. overall', value: average, hint: `out of ${survey.scaleMax}` },
        ]}
      />
      <Panel title="Employee evaluations" description="Read-only. These are the ratings co-workers in the same department gave each employee. HR does not rate employees here.">
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
                <th scope="col" className="px-4 py-3 font-bold">Reviewed by</th>
                <th scope="col" className="px-4 py-3 font-bold">Overall rating</th>
                <th scope="col" className="px-5 py-3 text-right font-bold sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {visible.map(({ member, reviews, overall }) => (
                <tr key={member.id} className="transition-colors hover:bg-white">
                  <td className="px-5 py-4 sm:px-6">
                    <p className="font-semibold">{member.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#111111]/50">{member.empNo} · {member.department}</p>
                  </td>
                  <td className="px-4 py-4 text-[#111111]/70">{member.position}</td>
                  <td className="px-4 py-4 text-[#111111]/70">
                    {reviews.length === 0 ? 'No co-workers yet' : reviews.map((r) => nameOf(r.reviewerId).split(' ')[0]).join(', ')}
                  </td>
                  <td className="px-4 py-4"><ScoreValue value={overall} max={survey.scaleMax} /></td>
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setTarget(member)} aria-label={`View evaluation of ${member.name}`} className="inline-flex items-center gap-1.5 border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]">
                        <Eye aria-hidden="true" className="size-3.5" /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[#111111]/50">No one matches these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      {selected && <EvaluationDialog key={selected.member.id} member={selected.member} reviews={selected.reviews} overall={selected.overall} survey={survey} onClose={() => setTarget(null)} />}
    </>
  )
}

function EvaluationDialog({ member, reviews, overall, survey, onClose }: { member: TeamMember; reviews: PeerReview[]; overall: number | null; survey: SurveyConfig; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="eval-dialog-title" className="m-auto w-[min(760px,calc(100vw-2rem))] border border-[#111111] bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50">
      <header className="flex items-start justify-between gap-4 border-b border-[#111111]/15 p-5 sm:p-6">
        <div>
          <p className={labelClass}>{member.department} · {member.position}</p>
          <h2 id="eval-dialog-title" className="mt-1 text-xl font-bold">{member.name}</h2>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-right">
            <p className={labelClass}>Overall rating</p>
            <ScoreValue value={overall} max={survey.scaleMax} size="lg" />
          </div>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="p-1 text-[#111111]/60 hover:text-[#111111]">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </header>
      <div className="flex max-h-[65vh] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        {reviews.length === 0 ? (
          <p className="border border-dashed border-[#111111]/20 p-4 text-sm text-[#111111]/60">No co-workers in this department have reviewed {member.name} yet.</p>
        ) : (
          <ol className="flex flex-col gap-4">
            {reviews.map((review, index) => {
              const score = reviewScore(review, survey)
              return (
                <li key={review.reviewerId} className="border border-[#111111]/15 bg-white">
                  <div className="flex items-center justify-between gap-4 border-b border-[#111111]/15 px-4 py-3">
                    <p className="font-semibold">{index + 1}. {nameOf(review.reviewerId)}</p>
                    <p className="font-mono text-sm">Avg <strong>{score?.toFixed(1) ?? '—'}</strong><span className="text-[#111111]/50"> / {survey.scaleMax}</span></p>
                  </div>
                  <div className="flex flex-col gap-4 p-4">
                    {survey.categories.map((category) => (
                      <div key={category.id} className="flex flex-col gap-2">
                        <p className={labelClass}>{category.name}</p>
                        <ul className="flex flex-col divide-y divide-[#111111]/10 border border-[#111111]/10">
                          {category.questions.map((question) => {
                            const value = review.answers[question.id]
                            return (
                              <li key={question.id} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                                <span className="text-[#111111]/80">{question.text}</span>
                                <span className="shrink-0 font-mono font-bold">
                                  {typeof value === 'number' ? value : '—'}
                                  <span className="font-normal text-[#111111]/50">/{survey.scaleMax}</span>
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5">
                      <p className={labelClass}>Rationale</p>
                      <blockquote className="border-l-2 border-[#3159ff] bg-[#3159ff]/[0.04] px-3 py-2 text-sm leading-relaxed text-[#111111]/80">
                        {review.rationale || 'No rationale given.'}
                      </blockquote>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
      <footer className="flex justify-end border-t border-[#111111]/15 p-5 sm:px-6">
        <button type="button" onClick={() => dialogRef.current?.close()} className="border border-[#111111]/20 px-4 py-2 text-sm font-semibold hover:border-[#111111]">
          Close
        </button>
      </footer>
    </dialog>
  )
}
