'use client'

import { ChevronDown } from 'lucide-react'
import { Panel } from '@/components/dashboard/primitives'
import { useEvalStore } from '@/components/hr/use-eval-store'
import { overallScore, peerReviewsFor, reviewScore } from '@/lib/evaluations'

const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

export function ReceivedPeerRatings({ employeeId }: { employeeId: string }) {
  const { survey, submissions } = useEvalStore()
  const reviews = peerReviewsFor(employeeId, survey, submissions)
  const overall = overallScore(reviews, survey)

  return (
    <Panel
      title="Ratings you received"
      description={`Every rating and rationale from your co-workers. Reviewer names are hidden. Overall: ${overall ?? '—'} / ${survey.scaleMax}`}
    >
      {reviews.length === 0 ? (
        <p className="p-5 text-sm text-[#111111]/60 sm:p-6">No co-workers have rated you yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-[#111111]/15">
          {reviews.map((review, index) => {
            const score = reviewScore(review, survey)
            return (
              <li key={review.reviewerId}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-[#111111]/[0.03] sm:px-6 [&::-webkit-details-marker]:hidden">
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="font-semibold">Anonymous peer {index + 1}</h3>
                      <p className="truncate text-sm text-[#111111]/60 group-open:hidden">
                        {`“${review.rationale || 'No rationale given.'}”`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-sm font-bold">
                        {score ?? '—'}
                        <span className="text-[#111111]/50"> / {survey.scaleMax}</span>
                      </span>
                      <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
                    </div>
                  </summary>

                  <div className="flex flex-col gap-4 px-5 pb-5 sm:px-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {survey.categories.map((category) => (
                        <div key={category.id} className="flex flex-col gap-2">
                          <p className={labelClass}>{category.name}</p>
                          <ul className="flex flex-col divide-y divide-[#111111]/10 border border-[#111111]/15 bg-white">
                            {category.questions.map((question) => (
                              <li key={question.id} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                                <span className="text-pretty">{question.text}</span>
                                <span className="shrink-0 font-mono text-xs font-bold">
                                  {review.answers[question.id] ?? '—'} / {survey.scaleMax}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className={labelClass}>Rationale</p>
                      <p className="text-pretty text-sm leading-relaxed">{`“${review.rationale || 'No rationale given.'}”`}</p>
                    </div>
                  </div>
                </details>
              </li>
            )
          })}
        </ol>
      )}
    </Panel>
  )
}
