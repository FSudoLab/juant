import { Download, FileText } from 'lucide-react'
import { PageIntro, Panel, StatusBadge } from '@/components/dashboard/primitives'
import { requireEmployee } from '@/lib/roles'

const groups = [
  {
    title: 'Employment',
    documents: [
      { name: 'Employment contract', updated: 'Jan 12, 2024', size: '412 KB', status: 'Signed' },
      { name: 'Job description — Product Designer', updated: 'Jan 12, 2024', size: '128 KB', status: 'Current' },
      { name: 'Certificate of Employment', updated: 'Oct 2, 2026', size: '96 KB', status: 'New' },
    ],
  },
  {
    title: 'Tax & government',
    documents: [
      { name: 'BIR Form 2316 — 2025', updated: 'Jan 30, 2026', size: '210 KB', status: 'Current' },
      { name: 'SSS E-1 form', updated: 'Jan 15, 2024', size: '88 KB', status: 'On file' },
      { name: 'PhilHealth MDR', updated: 'Jan 15, 2024', size: '74 KB', status: 'On file' },
    ],
  },
  {
    title: 'Policies',
    documents: [
      { name: 'Employee handbook 2026', updated: 'Jan 5, 2026', size: '1.8 MB', status: 'Acknowledged' },
      { name: 'Data privacy policy', updated: 'Mar 1, 2026', size: '320 KB', status: 'Acknowledged' },
    ],
  },
]

export default async function DocumentsPage({ params }: { params: Promise<{ role: string }> }) {
  await requireEmployee(params)

  return (
    <>
      <PageIntro eyebrow="My Employment / My Documents" title="My documents" description="Contracts, certificates, government forms, and the policies you have acknowledged." />
      {groups.map((group) => (
        <Panel key={group.title} title={group.title} description={`${group.documents.length} files`}>
          <ul className="divide-y divide-[#111111]/15">
            {group.documents.map((document) => (
              <li key={document.name} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center border border-[#111111]/15">
                    <FileText aria-hidden="true" className="size-4 text-[#3159ff]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{document.name}</p>
                    <p className="text-xs text-[#111111]/60">Updated {document.updated} · {document.size}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden sm:inline-flex"><StatusBadge tone={document.status === 'New' ? 'blue' : 'neutral'}>{document.status}</StatusBadge></span>
                  <button type="button" className="flex size-9 items-center justify-center border border-[#111111]/15 hover:border-[#3159ff] hover:text-[#3159ff]">
                    <Download aria-hidden="true" className="size-4" />
                    <span className="sr-only">Download {document.name}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </>
  )
}
