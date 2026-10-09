import { PageIntro } from '@/components/dashboard/primitives'
import { AskJuanChat } from '@/components/employee/ask-juan-chat'
import { requireEmployee } from '@/lib/roles'

export default async function AskJuanPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro eyebrow="Support / Ask Juan" title="Ask Juan" description="Quick answers about your leave, pay, attendance, and documents." />
      <AskJuanChat />
    </>
  )
}
