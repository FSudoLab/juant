import { PageIntro, Panel } from '@/components/dashboard/primitives'
import { requireEmployee } from '@/lib/roles'

const sections = [
  {
    title: 'Personal information',
    fields: [
      ['Full name', 'Alex Reyes Cruz'],
      ['Birthday', 'March 14, 1995'],
      ['Civil status', 'Single'],
      ['Mobile', '+63 917 555 0142'],
      ['Personal email', 'alex.cruz@email.com'],
      ['Address', '24 Mabini St., Poblacion, Makati City'],
    ],
  },
  {
    title: 'Employment details',
    fields: [
      ['Employee ID', 'JT-2024-0118'],
      ['Position', 'Product Designer'],
      ['Department', 'Product & Design'],
      ['Manager', 'Maria Santos'],
      ['Employment type', 'Regular'],
      ['Date hired', 'January 15, 2024'],
    ],
  },
  {
    title: 'Government IDs',
    fields: [
      ['TIN', '•••-•••-482-000'],
      ['SSS', '••-•••6214-•'],
      ['PhilHealth', '••-•••••7731-•'],
      ['Pag-IBIG', '••••-••••-2290'],
    ],
  },
  {
    title: 'Emergency contact',
    fields: [
      ['Name', 'Liza Cruz'],
      ['Relationship', 'Mother'],
      ['Mobile', '+63 918 555 0199'],
    ],
  },
]

export default async function ProfilePage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro
        eyebrow="My Employment / My Profile"
        title="Alex Cruz"
        description="Product Designer · Product & Design. Need to update something? File a profile change request with HR."
        action={<span className="flex size-20 items-center justify-center bg-[#3159ff] text-2xl font-semibold text-white">AC</span>}
      />
      {sections.map((section) => (
        <Panel key={section.title} title={section.title}>
          <dl className="grid sm:grid-cols-2">
            {section.fields.map(([label, value]) => (
              <div key={label} className="border-b border-[#111111]/15 px-5 py-4 sm:px-6 sm:odd:border-r">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">{label}</dt>
                <dd className="mt-1 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      ))}
    </>
  )
}
