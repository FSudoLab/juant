import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageIntro, StatGrid } from '@/components/dashboard/primitives'
import { HrModuleChart } from '@/components/hr/hr-module-chart'
import { HrModuleView } from '@/components/hr/hr-module-view'
import { getHrModule, hrModules } from '@/lib/hr-modules'

type Params = Promise<{ role: string; section: string }>

export function generateStaticParams() {
  return hrModules.map((module) => ({ role: 'hr', section: module.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section } = await params
  const hrModule = getHrModule(section)
  return { title: hrModule ? `${hrModule.label} · JuanT HR` : 'JuanT HR' }
}

export default async function HrSectionPage({ params }: { params: Params }) {
  const { role, section } = await params
  const hrModule = role === 'hr' ? getHrModule(section) : undefined
  if (!hrModule) notFound()

  return (
    <>
      <PageIntro eyebrow={`${hrModule.group} / ${hrModule.label}`} title={hrModule.title} description={hrModule.description} />
      <StatGrid stats={hrModule.stats} label={`${hrModule.label} summary`} />
      {hrModule.chart && <HrModuleChart chart={hrModule.chart} />}
      <HrModuleView key={hrModule.slug} module={hrModule} />
    </>
  )
}
