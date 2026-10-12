'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Panel, ProgressBar, StatusBadge } from '@/components/dashboard/primitives'
import { useEvalStore } from '@/components/hr/use-eval-store'
import { averageOf, overallScore, peerReviewsFor, peersOf } from '@/lib/evaluations'

const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

export function PeerFeedbackSummary({ employeeId, peerEvaluationHref }: { employeeId: string; peerEvaluationHref: string }) {
  const { survey, submissions } = useEvalStore()
  const reviews = peerReviewsFor(employeeId, survey, submissions)
  const overall = overallScore(reviews, survey)
  const peers = peersOf(employeeId)
  const given = peers.filter((p) => submissions[p.id]?.[employeeId]).length
  const remaining = peers.length - given

  const categories = survey.categories.map((category) => ({
    ...category,
    average: averageOf(
      reviews.flatMap((r) => category.questions.map((q) => r.answers[q.id])).filter((v): v is number => typeof v === 'number'),
    ),
  }))

  return (
    <Panel title="Peer evaluation" description={`${survey.title} · ratings from co-workers in your department`}>
      <div className="grid gap-px bg-[#111111]/15 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-2 bg-[#f6f6f3] p-5 sm:p-6">
          <p className={labelClass}>Overall peer rating</p>
          <p className="font-mono text-4xl font-bold">
            {overall ?? '—'}
            <span className="text-base text-[#111111]/50"> / {survey.scaleMax}</span>
          </p>
          <p className="text-xs text-[#111111]/60">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} received
          </p>
        </div>
        <ul className="flex flex-col divide-y divide-[#111111]/10 bg-[#f6f6f3]">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
              <span className="w-28 shrink-0 text-sm font-semibold">{category.name}</span>
              <ProgressBar value={category.average ? (category.average / survey.scaleMax) * 100 : 0} label={`${category.name} average`} />
              <span className="w-14 text-right font-mono text-xs font-bold">
                {category.average ?? '—'} / {survey.scaleMax}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {reviews.length > 0 && (
        <ul className="grid gap-px border-t border-[#111111]/15 bg-[#111111]/15 sm:grid-cols-2">
          {reviews.slice(0, 4).map((review, index) => (
            <li key={review.reviewerId} className="flex flex-col gap-2 bg-[#f6f6f3] p-5 sm:p-6">
              <p className={labelClass}>Anonymous peer {index + 1}</p>
              <p className="text-pretty text-sm leading-relaxed">{`“${review.rationale || 'No rationale given.'}”`}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 border-t border-[#111111]/15 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3 text-sm">
          <StatusBadge tone={remaining === 0 ? 'blue' : 'amber'}>{remaining === 0 ? 'All done' : `${remaining} to rate`}</StatusBadge>
          <span className="text-[#111111]/60">
            You rated {given} of {peers.length} co-workers
          </span>
        </div>
        <Link
          href={peerEvaluationHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#3159ff] underline-offset-4 hover:underline"
        >
          {remaining === 0 ? 'Review my ratings' : 'Rate co-workers'}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </Panel>
  )
}
