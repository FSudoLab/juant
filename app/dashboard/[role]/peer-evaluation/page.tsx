import type { Metadata } from 'next'
import { PageIntro } from '@/components/dashboard/primitives'
import { PeerEvaluationForm } from '@/components/employee/peer-evaluation-form'
import { demoAccountByRole } from '@/lib/access'
import { requireEmployee } from '@/lib/roles'

export const metadata: Metadata = { title: 'Peer evaluation · JuanT' }

export default async function PeerEvaluationPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)
  const { role } = await params

  return (
    <>
      <PageIntro
        eyebrow="My Employment / Peer Evaluation"
        title="Peer evaluation"
        description="Rate the co-workers in your department on each question and explain why. HR sees your ratings and rationale."
      />
      <PeerEvaluationForm reviewerId={demoAccountByRole.employee ?? ''} />
    </>
  )
}
