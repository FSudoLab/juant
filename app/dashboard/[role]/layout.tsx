import type { ReactNode } from 'react'
import { ConfirmProvider } from '@/components/dashboard/confirm-dialog'
import { DashboardNavigation } from '@/components/dashboard/sidebar'
import { resolveRole } from '@/lib/roles'

export default async function DashboardLayout({ children, params }: { children: ReactNode; params: Promise<{ role: string }> }) {
  const { role: requestedRole } = await params
  const role = resolveRole(requestedRole)

  return (
    <ConfirmProvider>
    <main className="min-h-screen bg-[#f6f6f3] text-[#111111]">
      <div className="flex min-h-screen flex-col flex-wrap lg:flex-row has-[>[data-card-header]]:content-start">
        <DashboardNavigation role={role} />
        <div className="min-w-0 flex-1 px-5 py-5 sm:px-10 sm:py-7">
          <div className="mx-auto flex max-w-5xl flex-col gap-7">
            {children}
          </div>
        </div>
      </div>
    </main>
    </ConfirmProvider>
  )
}
