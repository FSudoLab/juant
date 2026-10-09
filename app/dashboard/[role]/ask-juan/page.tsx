import { PageIntro } from '@/components/dashboard/primitives'
import { AskJuanChat } from '@/components/employee/ask-juan-chat'
import { requireAnyRole } from '@/lib/roles'

export default async function AskJuanPage({ params }: { params: Promise<{ role: string }> }) {
  const role = await requireAnyRole(params)

  return role === 'hr' ? (
    <>
      <PageIntro eyebrow="Insights & System / Ask Juan AI" title="Ask Juan AI" description="Ask about pending approvals, attendance, payroll deadlines, and workforce numbers." />
      <AskJuanChat variant="hr" />
    </>
  ) : (
    <>
      <PageIntro eyebrow="Support / Ask Juan" title="Ask Juan" description="Quick answers about your leave, pay, attendance, and documents." />
      <AskJuanChat />
    </>
  )
}
