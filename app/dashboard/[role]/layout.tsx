import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { resolveRole } from '@/lib/roles'

export default async function DashboardLayout({ children, params }: { children: ReactNode; params: Promise<{ role: string }> }) {
  const { role: requestedRole } = await params
  const role = resolveRole(requestedRole)

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-[#111111]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar role={role} />
        <div className="min-w-0 flex-1 px-5 py-6 sm:px-10 sm:py-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-12">
            <header className="flex items-center justify-between border-b border-[#111111]/15 pb-5">
              <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#111111]/60 hover:text-[#3159ff]">
                <ArrowLeft aria-hidden="true" className="size-4" /> Back to site
              </Link>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#3159ff]">{role === 'hr' ? 'HR manager workspace' : 'Employee workspace'}</span>
            </header>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
