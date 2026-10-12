import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageIntro } from '@/components/dashboard/primitives'
import { PeerEvaluationForm } from '@/components/employee/peer-evaluation-form'
import { ReceivedPeerRatings } from '@/components/employee/received-peer-ratings'
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
        action={
          <Link href={`/dashboard/${role}/performance`} className="inline-flex items-center gap-2 border border-[#111111]/20 px-4 py-2.5 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]">
            <ArrowLeft aria-hidden className="size-4" />
            Back to my performance
          </Link>
        }
      />
      <ReceivedPeerRatings employeeId={demoAccountByRole.employee ?? ''} />
      <PeerEvaluationForm reviewerId={demoAccountByRole.employee ?? ''} />
    </>
  )
}
