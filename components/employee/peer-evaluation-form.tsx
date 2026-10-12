'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Panel, StatusBadge } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { useEvalStore } from '@/components/hr/use-eval-store'
import { allQuestions, peersOf, writeSubmission, type PeerAnswers, type SurveyConfig } from '@/lib/evaluations'
import { teamRoster, type TeamMember } from '@/lib/team-roster'

const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

export function PeerEvaluationForm({ reviewerId }: { reviewerId: string }) {
  const { survey, submissions } = useEvalStore()
  const reviewer = teamRoster.find((m) => m.id === reviewerId)
  const peers = peersOf(reviewerId)
  const [activeId, setActiveId] = useState<string | null>(null)

  if (!reviewer) return null
  const departmentOpen = survey.departments[reviewer.department] !== false

  if (!survey.open || !departmentOpen) {
    return (
      <Panel title="Peer evaluation is closed" description={survey.open ? `HR has turned off peer evaluations for ${reviewer.department}.` : 'HR has not opened the survey for answers yet.'}>
        <p className="p-5 text-sm text-[#111111]/60 sm:p-6">You will be able to rate your co-workers once HR opens the survey.</p>
      </Panel>
    )
  }

  if (peers.length === 0) {
    return (
      <Panel title="No co-workers to rate" description={`There is no one else in ${reviewer.department} yet.`}>
        <p className="p-5 text-sm text-[#111111]/60 sm:p-6">Peer evaluations only include people in your own department.</p>
      </Panel>
    )
  }

  const current = peers.find((p) => p.id === activeId) ?? peers[0]
  const doneCount = peers.filter((p) => submissions[p.id]?.[reviewerId]).length

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Co-workers to rate" className="flex flex-col border border-[#111111]/15 bg-white">
        <p className={`${labelClass} border-b border-[#111111]/15 px-4 py-3`}>{reviewer.department} · {doneCount}/{peers.length} done</p>
        <ul className="flex flex-col divide-y divide-[#111111]/10">
          {peers.map((peer) => {
            const done = Boolean(submissions[peer.id]?.[reviewerId])
            const active = peer.id === current.id
            return (
              <li key={peer.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(peer.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-[#3159ff] text-white' : 'hover:bg-[#111111]/[0.03]'}`}
                >
                  <span>
                    <span className="block font-semibold">{peer.name}</span>
                    <span className={`text-xs ${active ? 'text-white/70' : 'text-[#111111]/50'}`}>{peer.position}</span>
                  </span>
                  {done && <CheckCircle2 aria-label="Submitted" className="size-4 shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <PeerForm key={current.id} peer={current} survey={survey} saved={submissions[current.id]?.[reviewerId]} onSubmit={(review) => writeSubmission(current.id, reviewerId, review)} />
    </div>
  )
}

function PeerForm({ peer, survey, saved, onSubmit }: { peer: TeamMember; survey: SurveyConfig; saved?: PeerAnswers; onSubmit: (review: PeerAnswers) => void }) {
  const confirm = useConfirm()
  const [answers, setAnswers] = useState<Record<string, number>>(saved?.answers ?? {})
  const [rationale, setRationale] = useState(saved?.rationale ?? '')
  const [status, setStatus] = useState('')
  const complete = allQuestions(survey).every((q) => answers[q.id]) && rationale.trim().length > 0
  const scale = Array.from({ length: survey.scaleMax }, (_, i) => i + 1)

  async function submit() {
    const ok = await confirm({ title: `Would you like to submit your evaluation of ${peer.name}?`, description: 'HR will be able to see your ratings and rationale.', confirmLabel: 'Yes, submit' })
    if (!ok) return
    onSubmit({ answers, rationale: rationale.trim() })
    setStatus(`Evaluation of ${peer.name} submitted.`)
  }

  return (
    <Panel
      title={peer.name}
      description={`Rate each question from 1 to ${survey.scaleMax}, with ${survey.scaleMax} being the highest.`}
      action={saved ? <StatusBadge tone="blue">Submitted</StatusBadge> : <StatusBadge tone="neutral">Not yet rated</StatusBadge>}
    >
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <div className="flex flex-col gap-6 p-5 sm:p-6">
        {survey.categories.map((category) => (
          <fieldset key={category.id} className="flex flex-col gap-2">
            <legend className={`${labelClass} mb-2`}>{category.name}</legend>
            <ul className="flex flex-col divide-y divide-[#111111]/15 border border-[#111111]/15 bg-white">
              {category.questions.map((question) => (
                <li key={question.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p id={`peer-q-${question.id}`} className="text-sm font-medium">{question.text}</p>
                  <div role="radiogroup" aria-labelledby={`peer-q-${question.id}`} className="flex shrink-0 flex-wrap gap-1">
                    {scale.map((value) => {
                      const selected = answers[question.id] === value
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={`${value} out of ${survey.scaleMax}`}
                          onClick={() => setAnswers((a) => ({ ...a, [question.id]: value }))}
                          className={`size-9 border font-mono text-sm font-bold transition-colors ${selected ? 'border-[#3159ff] bg-[#3159ff] text-white' : 'border-[#111111]/20 hover:border-[#3159ff]'}`}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
        ))}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="peer-rationale" className={labelClass}>Rationale</label>
          <textarea
            id="peer-rationale"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            rows={4}
            placeholder={`Why did you give ${peer.name.split(' ')[0]} these ratings?`}
            className="w-full border border-[#111111]/15 bg-white p-3 text-sm outline-none focus:border-[#3159ff]"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={submit} disabled={!complete} className="bg-[#3159ff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-40">
            {saved ? 'Update evaluation' : 'Submit evaluation'}
          </button>
        </div>
      </div>
    </Panel>
  )
}
