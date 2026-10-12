'use client'

import { useMemo, useRef, useState } from 'react'
import { BellRing, CheckCheck, Eye, FileImage, FilePlus2, FileText, FolderOpen, Search, Trash2, Upload, X } from 'lucide-react'
import { Panel, StatGrid, StatusBadge, statusTone } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { acceptedFileTypes, countByStatus, employeeFiles, fileStatus, formatFileSize, maxFileSizeMb, type EmployeeFile } from '@/lib/employee-files'

const OTHER_FILE = '__other__'
const filters = ['All', 'Incomplete', 'For review', 'Complete'] as const
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const ghostButton = 'inline-flex items-center gap-1.5 whitespace-nowrap border border-[#111111]/20 px-3 py-1.5 text-xs font-semibold text-[#111111]/70 transition-colors hover:border-[#111111] hover:text-[#111111] disabled:pointer-events-none disabled:opacity-35'
const primaryButton = 'inline-flex items-center gap-1.5 whitespace-nowrap bg-[#3159ff] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2447d6] disabled:pointer-events-none disabled:opacity-35'

export function EmployeeFilesView() {
  const [files, setFiles] = useState<EmployeeFile[]>(employeeFiles)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [openId, setOpenId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [uploadError, setUploadError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTarget = useRef<string | null>(null)
  const confirm = useConfirm()

  const openFile = files.find((file) => file.id === openId)

  const stats = useMemo(() => {
    const statuses = files.map(fileStatus)
    const missing = files.reduce((sum, file) => sum + countByStatus(file, 'Missing'), 0)
    return [
      { label: 'Complete files', value: String(statuses.filter((s) => s === 'Complete').length).padStart(2, '0'), hint: `of ${files.length} employees` },
      { label: 'Incomplete', value: String(statuses.filter((s) => s === 'Incomplete').length).padStart(2, '0') },
      { label: 'For review', value: String(statuses.filter((s) => s === 'For review').length).padStart(2, '0') },
      { label: 'Missing documents', value: String(missing).padStart(2, '0'), hint: 'Across all employees' },
    ]
  }, [files])

  const visible = files.filter((file) => {
    if (filter !== 'All' && fileStatus(file) !== filter) return false
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return [file.name, file.empNo, file.department, file.position].some((value) => value.toLowerCase().includes(needle))
  })

  const update = (id: string, change: (file: EmployeeFile) => EmployeeFile) => setFiles((current) => current.map((file) => (file.id === id ? change(file) : file)))

  const sendReminder = async (file: EmployeeFile) => {
    const missing = file.documents.filter((doc) => doc.status === 'Missing').map((doc) => doc.name)
    const ok = await confirm({ title: `Would you like to send a reminder to ${file.name}?`, description: `They'll be asked to submit: ${missing.join(', ')}.`, confirmLabel: 'Yes, send reminder' })
    if (!ok) return
    update(file.id, (f) => ({ ...f, lastReminder: today() }))
    setAnnouncement(`Reminder sent to ${file.name}.`)
  }

  const pickFile = (target: string) => {
    uploadTarget.current = target
    setUploadError('')
    fileInputRef.current?.click()
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    event.target.value = ''
    const target = uploadTarget.current
    if (!picked || !openFile || !target) return
    if (picked.size > maxFileSizeMb * 1024 * 1024) {
      setUploadError(`${picked.name} is larger than ${maxFileSizeMb} MB.`)
      return
    }
    const isOther = target === OTHER_FILE
    const ok = await confirm({
      title: isOther ? `Would you like to add ${picked.name} to ${openFile.name}'s 201 file?` : `Would you like to upload ${picked.name} as ${target}?`,
      description: `${formatFileSize(picked.size)} · ${isOther ? 'Saved under Other files.' : 'It will replace any existing file for this requirement.'}`,
      confirmLabel: 'Yes, upload',
    })
    if (!ok) return
    const attachment = { fileName: picked.name, size: picked.size, type: picked.type, url: URL.createObjectURL(picked) }
    update(openFile.id, (f) => {
      if (isOther) {
        return { ...f, updated: today(), documents: [...f.documents, { name: picked.name, category: 'Other', status: 'Verified', uploaded: today(), attachment }] }
      }
      return {
        ...f,
        updated: today(),
        documents: f.documents.map((doc) => {
          if (doc.name !== target) return doc
          if (doc.attachment) URL.revokeObjectURL(doc.attachment.url)
          return { ...doc, status: 'Verified', uploaded: today(), attachment }
        }),
      }
    })
    setAnnouncement(`${picked.name} uploaded to ${openFile.name}'s 201 file.`)
  }

  const removeOther = async (file: EmployeeFile, documentName: string) => {
    const ok = await confirm({ title: `Would you like to remove ${documentName}?`, description: 'This file will be deleted from the 201 file.', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (!ok) return
    update(file.id, (f) => ({
      ...f,
      documents: f.documents.filter((doc) => {
        if (doc.name === documentName && doc.category === 'Other') {
          if (doc.attachment) URL.revokeObjectURL(doc.attachment.url)
          return false
        }
        return true
      }),
    }))
    setAnnouncement(`${documentName} removed.`)
  }

  const complete = async (file: EmployeeFile) => {
    const missing = countByStatus(file, 'Missing')
    const ok = await confirm({
      title: `Would you like to mark ${file.name}'s 201 file as complete?`,
      description: missing > 0 ? `${missing} document${missing === 1 ? ' is' : 's are'} still missing. Every requirement will be marked verified as received.` : 'Every requirement will be marked verified.',
      confirmLabel: 'Yes, complete',
    })
    if (!ok) return
    update(file.id, (f) => ({ ...f, updated: today(), documents: f.documents.map((doc) => ({ ...doc, status: 'Verified', uploaded: doc.uploaded ?? today() })) }))
    setAnnouncement(`${file.name}'s 201 file is complete.`)
  }

  const showFiles = (id: string) => {
    setOpenId(id)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <StatGrid stats={stats} label="201 files summary" />

      <Panel title="201 files per employee" description="Open an employee to see every requirement they've submitted.">
        <div className="flex flex-col gap-4 border-b border-[#111111]/15 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by file status">
            {filters.map((option) => {
              const active = filter === option
              const count = option === 'All' ? files.length : files.filter((file) => fileStatus(file) === option).length
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(option)}
                  className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? 'border-[#111111] bg-[#111111] text-[#f6f6f3]' : 'border-[#111111]/15 text-[#111111]/70 hover:border-[#3159ff] hover:text-[#3159ff]'}`}
                >
                  {option}
                  <span className={`font-mono text-[10px] ${active ? 'text-white/60' : 'text-[#111111]/40'}`}>{count}</span>
                </button>
              )
            })}
          </div>
          <label className="relative block sm:w-72">
            <span className="sr-only">Search employees</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#111111]/40" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, department, position…"
              className="h-10 w-full border border-[#111111]/15 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#3159ff]"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-[#111111]/[0.03] font-mono text-[10px] uppercase tracking-[0.12em] text-[#111111]/50">
              <tr className="border-b border-[#111111]/15">
                <th scope="col" className="px-5 py-3 font-bold sm:px-6">Employee</th>
                <th scope="col" className="px-4 py-3 font-bold">Department</th>
                <th scope="col" className="px-4 py-3 font-bold">Position</th>
                <th scope="col" className="px-4 py-3 font-bold">Submitted</th>
                <th scope="col" className="px-4 py-3 font-bold">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-bold sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/15">
              {visible.map((file) => {
                const status = fileStatus(file)
                const total = file.documents.length
                const submitted = total - countByStatus(file, 'Missing')
                return (
                  <tr key={file.id} className="transition-colors hover:bg-white">
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-semibold">{file.name}</p>
                      <p className="font-mono text-[11px] text-[#111111]/45">{file.empNo}</p>
                    </td>
                    <td className="px-4 py-4 text-[#111111]/70">{file.department}</td>
                    <td className="px-4 py-4 text-[#111111]/70">{file.position}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#111111]/70">{submitted} / {total}</span>
                        <span aria-hidden="true" className="h-1 w-16 bg-[#111111]/10">
                          <span className="block h-full bg-[#3159ff]" style={{ width: `${(submitted / total) * 100}%` }} />
                        </span>
                      </div>
                      {file.lastReminder && status === 'Incomplete' && <p className="mt-1 text-[11px] text-[#111111]/45">Reminded {file.lastReminder}</p>}
                    </td>
                    <td className="px-4 py-4"><StatusBadge tone={statusTone(status)}>{status}</StatusBadge></td>
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => showFiles(file.id)} className={ghostButton} aria-label={`View files of ${file.name}`}>
                          <FolderOpen aria-hidden="true" className="size-3.5" /> Files
                        </button>
                        <button type="button" onClick={() => sendReminder(file)} disabled={status !== 'Incomplete'} className={ghostButton} aria-label={`Send reminder to ${file.name}`}>
                          <BellRing aria-hidden="true" className="size-3.5" /> Remind
                        </button>
                        <button type="button" onClick={() => complete(file)} disabled={status === 'Complete'} className={primaryButton} aria-label={`Mark ${file.name}'s file complete`}>
                          <CheckCheck aria-hidden="true" className="size-3.5" /> Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#111111]/50">No employees match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <dialog
        ref={dialogRef}
        aria-labelledby="files-dialog-title"
        onClose={() => setOpenId(null)}
        className="m-auto max-h-[88vh] w-[min(94vw,40rem)] border border-[#111111]/15 bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50"
      >
        {openFile && (
          <div className="flex max-h-[88vh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-[#111111]/15 p-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#3159ff]">201 file · {openFile.empNo}</p>
                <h2 id="files-dialog-title" className="mt-1 text-xl font-semibold tracking-[-0.04em]">{openFile.name}</h2>
                <p className="mt-1 text-sm text-[#111111]/60">{openFile.position} · {openFile.department} · Updated {openFile.updated}</p>
              </div>
              <button type="button" onClick={() => dialogRef.current?.close()} className="p-1 text-[#111111]/60 hover:text-[#111111]">
                <X aria-hidden="true" className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept={acceptedFileTypes} onChange={handleUpload} className="sr-only" tabIndex={-1} aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#111111]/15 bg-white px-5 py-3">
              <p className="text-xs text-[#111111]/55">PDF, images, Word or Excel · up to {maxFileSizeMb} MB</p>
              <button type="button" onClick={() => pickFile(OTHER_FILE)} className={primaryButton}>
                <FilePlus2 aria-hidden="true" className="size-3.5" /> Add file
              </button>
            </div>
            {uploadError && <p role="alert" className="border-b border-[#111111]/15 bg-[#ff4b2b]/10 px-5 py-2 text-xs font-semibold text-[#c2311a]">{uploadError}</p>}
            <ul className="divide-y divide-[#111111]/10 overflow-y-auto">
              {openFile.documents.map((doc) => {
                const isOther = doc.category === 'Other'
                const FileIcon = doc.attachment?.type.startsWith('image/') ? FileImage : FileText
                return (
                  <li key={`${doc.category}-${doc.name}`} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileIcon aria-hidden="true" className={`size-4 shrink-0 ${doc.attachment ? 'text-[#3159ff]' : 'text-[#111111]/30'}`} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{doc.name}</p>
                        <p className="truncate text-xs text-[#111111]/50">
                          {doc.category}
                          {doc.attachment ? ` · ${doc.attachment.fileName} · ${formatFileSize(doc.attachment.size)}` : ''}
                          {doc.uploaded ? ` · Uploaded ${doc.uploaded}` : ' · Not submitted'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!isOther && <StatusBadge tone={statusTone(doc.status === 'Verified' ? 'Complete' : doc.status === 'Missing' ? 'Incomplete' : 'For review')}>{doc.status}</StatusBadge>}
                      {doc.attachment && (
                        <a href={doc.attachment.url} target="_blank" rel="noreferrer" className={ghostButton} aria-label={`Open ${doc.attachment.fileName}`}>
                          <Eye aria-hidden="true" className="size-3.5" /> Open
                        </a>
                      )}
                      {isOther ? (
                        <button type="button" onClick={() => removeOther(openFile, doc.name)} className={ghostButton} aria-label={`Remove ${doc.name}`}>
                          <Trash2 aria-hidden="true" className="size-3.5" />
                        </button>
                      ) : (
                        <button type="button" onClick={() => pickFile(doc.name)} className={ghostButton} aria-label={`Upload file for ${doc.name}`}>
                          <Upload aria-hidden="true" className="size-3.5" /> {doc.attachment || doc.status !== 'Missing' ? 'Replace' : 'Upload'}
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-wrap justify-end gap-2 border-t border-[#111111]/15 p-5">
              <button type="button" onClick={() => sendReminder(openFile)} disabled={fileStatus(openFile) !== 'Incomplete'} className={ghostButton}>
                <BellRing aria-hidden="true" className="size-3.5" /> Send reminder
              </button>
              <button type="button" onClick={() => complete(openFile)} disabled={fileStatus(openFile) === 'Complete'} className={primaryButton}>
                <CheckCheck aria-hidden="true" className="size-3.5" /> Mark complete
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
