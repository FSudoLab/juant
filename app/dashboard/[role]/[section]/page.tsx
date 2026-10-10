import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageIntro, Panel, StatGrid } from '@/components/dashboard/primitives'
import { ApprovalCenter } from '@/components/hr/approval-center'
import { EmployeeFilesView } from '@/components/hr/employee-files-view'
import { HrModuleChart } from '@/components/hr/hr-module-chart'
import { HrModuleView } from '@/components/hr/hr-module-view'
import { EmployeeInformationEditor } from '@/components/manager/employee-information-editor'
import { TeamOverview } from '@/components/manager/team-overview'
import { getHrModule, hrModules } from '@/lib/hr-modules'

type Params = Promise<{ role: string; section: string }>

const hrApprovalTabs = [
  { id: 'approvals', label: 'All requests' },
  { id: 'attendance-management', label: 'Attendance' },
  { id: 'leave-management', label: 'Leave' },
  { id: 'overtime', label: 'Overtime & holiday work' },
]

const managerSections = {
  holidays: { title: 'Upcoming holidays', description: 'Review the holiday calendar used by your team and its schedule planning.' },
  notifications: { title: 'Notifications & reminders', description: 'Keep daily attendance, approval, and team updates visible to the people who need them.' },
  help: { title: 'Help & HR support', description: 'Share the right HR support channel with your employees.' },
  'employee-information': { title: 'Employee information', description: 'Review and update the contact and profile information held for your team.' },
  documents: { title: 'Documents', description: 'Add and share policies, forms, and team resources.' },
}

const systemAdminSections = {
  users: { title: 'User access', description: 'Review workspace users and the roles assigned to them.' },
  'hr-access': { title: 'HR access', description: 'Control the permissions HR uses to approve or decline requests.' },
  'audit-log': { title: 'Audit log', description: 'Review recent access and permission changes across the workspace.' },
}

export function generateStaticParams() {
  return [
    ...hrModules.map((module) => ({ role: 'hr', section: module.slug })),
    ...hrModules.map((module) => ({ role: 'manager', section: module.slug })),
    ...Object.keys(managerSections).map((section) => ({ role: 'manager', section })),
    ...Object.keys(systemAdminSections).map((section) => ({ role: 'system-admin', section })),
  ]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section } = await params
  const hrModule = getHrModule(section)
  return { title: hrModule ? `${hrModule.label} · JuanT HR` : 'JuanT workspace' }
}

export default async function HrSectionPage({ params }: { params: Params }) {
  const { role, section } = await params
  if ((role === 'manager' || role === 'hr') && section === 'employees') {
    return (
      <>
        <PageIntro
          eyebrow={role === 'manager' ? 'Workspace / Team overview' : 'People Management / Employee Management'}
          title={role === 'manager' ? 'Team overview' : 'Employee management'}
          description="Everyone in the workspace in one place. Search by department or position, customize each person's schedule, and control what they can access."
        />
        <TeamOverview />
      </>
    )
  }
  const customSection = role === 'manager' ? managerSections[section as keyof typeof managerSections] : role === 'system-admin' ? systemAdminSections[section as keyof typeof systemAdminSections] : undefined
  if (customSection) {
    if (role === 'manager' && section === 'employee-information') {
      return (
        <>
          <PageIntro eyebrow="Team operations / Employee information" title="Employee information" description="Review and update the contact and profile information held for your team." />
          <EmployeeInformationEditor />
        </>
      )
    }
    if (role === 'system-admin' && section === 'hr-access') {
      return (
        <>
          <PageIntro eyebrow="System / Access" title="Access & permissions" description="Edit schedules and sidebar permissions for every employee, HR user, and manager." />
          <TeamOverview />
        </>
      )
    }
    return (
      <>
        <PageIntro eyebrow={`${role === 'manager' ? 'Team operations' : 'System'} / ${customSection.title}`} title={customSection.title} description={customSection.description} />
        <Panel title="Workspace controls" description="This workspace view is ready for your team data and permissions.">
          <div className="p-5 text-sm text-[#111111]/60 sm:p-6">Your current access allows you to review and manage this area from the JuanT workspace.</div>
        </Panel>
      </>
    )
  }
  if (role === 'hr' && section === 'approvals') {
    const tabs = hrApprovalTabs.flatMap(({ id, label }) => {
      const module = getHrModule(id)
      return module ? [{ id, label, module }] : []
    })
    return (
      <>
        <PageIntro eyebrow="Workspace / Approval Center" title="Approval center" description="Every request waiting on HR, grouped by type. Review attendance, leave, and overtime without leaving the page." />
        <ApprovalCenter tabs={tabs} />
      </>
    )
  }
  const hrModule = role === 'hr' || role === 'manager' ? getHrModule(section) : undefined
  if (!hrModule) notFound()

  if (section === '201-files') {
    return (
      <>
        <PageIntro eyebrow={`${hrModule.group} / ${hrModule.label}`} title={hrModule.title} description={hrModule.description} />
        <EmployeeFilesView />
      </>
    )
  }

  return (
    <>
      <PageIntro eyebrow={`${hrModule.group} / ${hrModule.label}`} title={hrModule.title} description={hrModule.description} />
      <StatGrid stats={hrModule.stats} label={`${hrModule.label} summary`} />
      {hrModule.chart && <HrModuleChart chart={hrModule.chart} />}
      <HrModuleView key={hrModule.slug} module={hrModule} />
    </>
  )
}
