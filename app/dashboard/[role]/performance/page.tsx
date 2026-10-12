import { PageIntro, Panel, ProgressBar, StatGrid, StatusBadge } from '@/components/dashboard/primitives'
import { PeerFeedbackSummary } from '@/components/employee/peer-feedback-summary'
import { demoAccountByRole } from '@/lib/access'
import { requireEmployee } from '@/lib/roles'

const kpis = [
  { name: 'Ship onboarding redesign', target: 'Launch by Nov 30', progress: 72, status: 'On track' },
  { name: 'Design system adoption', target: '90% of product surfaces', progress: 64, status: 'On track' },
  { name: 'Usability test sessions', target: '12 sessions this quarter', progress: 50, status: 'At risk' },
  { name: 'Mentorship', target: 'Bi-weekly sessions with 1 junior', progress: 85, status: 'On track' },
]

const feedback = [
  { from: 'Maria Santos', role: 'Manager', date: 'Sep 30', message: 'Great job leading the onboarding research. The synthesis made prioritization much easier for the team.' },
  { from: 'Paolo Garcia', role: 'Engineering Lead', date: 'Sep 18', message: 'Handoffs have been very clear. Specs for edge cases saved us a lot of back and forth.' },
]

export default async function PerformancePage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)
  const { role } = await params

  return (
    <>
      <PageIntro eyebrow="My Employment / My Performance" title="My performance" description="Goals for the H2 2026 review cycle, progress to date, and recent feedback." />
      <StatGrid
        label="Performance summary"
        stats={[
          { label: 'Last rating', value: '4.3 / 5', hint: 'H1 2026 · Exceeds' },
          { label: 'Next review', value: 'Dec 15', hint: 'Self-assessment opens Dec 1' },
        ]}
      />
      <PeerFeedbackSummary employeeId={demoAccountByRole.employee ?? ''} peerEvaluationHref={`/dashboard/${role}/peer-evaluation`} />
      <Panel title="Recent feedback">
        <ul className="grid gap-px bg-[#111111]/15 sm:grid-cols-2">
          {feedback.map((item) => (
            <li key={item.from} className="flex flex-col gap-4 bg-[#f6f6f3] p-5 sm:p-6">
              <p className="text-pretty leading-relaxed">{`“${item.message}”`}</p>
              <p className="text-xs text-[#111111]/60">
                <span className="font-semibold text-[#111111]">{item.from}</span> · {item.role} · {item.date}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
