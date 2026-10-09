import { PageIntro, Panel } from '@/components/dashboard/primitives'
import { SettingsForm } from '@/components/employee/settings-form'
import { requireEmployee } from '@/lib/roles'

const preferences = [
  ['Language', 'English'],
  ['Time zone', 'Asia/Manila (GMT+8)'],
  ['Date format', 'Oct 10, 2026'],
  ['Sign-in email', 'alex.cruz@juant.ph'],
]

export default async function SettingsPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro eyebrow="Support / Settings" title="Settings" description="Notification, privacy, and account preferences for your portal." />
      <SettingsForm />
      <Panel title="Account preferences">
        <dl className="grid sm:grid-cols-2">
          {preferences.map(([label, value]) => (
            <div key={label} className="border-b border-[#111111]/15 px-5 py-4 sm:px-6 sm:odd:border-r">
              <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</dt>
              <dd className="mt-1 text-sm font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </>
  )
}
