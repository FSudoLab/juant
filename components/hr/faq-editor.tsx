'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Panel } from '@/components/dashboard/primitives'
import { useConfirm } from '@/components/dashboard/confirm-dialog'
import { defaultFaqs, readFaqs, writeFaqs, type Faq } from '@/lib/faqs'

const fieldClass = 'w-full border border-[#111111]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

export function FaqEditor() {
  const confirm = useConfirm()
  const [faqs, setFaqs] = useState<Faq[]>(defaultFaqs)
  const [status, setStatus] = useState('')

  useEffect(() => setFaqs(readFaqs()), [])

  const edit = (id: string, patch: Partial<Faq>) => setFaqs((current) => current.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  const valid = faqs.every((f) => f.question.trim() && f.answer.trim())

  async function remove(id: string) {
    const ok = await confirm({ title: 'Would you like to remove this FAQ?', confirmLabel: 'Yes, remove', tone: 'danger' })
    if (ok) setFaqs((current) => current.filter((f) => f.id !== id))
  }

  async function save() {
    const ok = await confirm({ title: 'Would you like to publish these FAQs?', description: 'Employees will see them right away under Help & HR Support.', confirmLabel: 'Yes, publish' })
    if (!ok) return
    writeFaqs(faqs)
    setStatus('FAQs published.')
  }

  return (
    <Panel title="Employee FAQs" description="These questions and answers appear on the employee Help & HR Support page.">
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <ol className="divide-y divide-[#111111]/15">
        {faqs.map((faq, index) => (
          <li key={faq.id} className="flex gap-3 p-5 sm:p-6">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`faq-q-${faq.id}`} className={labelClass}>Question {index + 1}</label>
                <input id={`faq-q-${faq.id}`} value={faq.question} onChange={(e) => edit(faq.id, { question: e.target.value })} className={`${fieldClass} h-10`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`faq-a-${faq.id}`} className={labelClass}>Answer</label>
                <textarea id={`faq-a-${faq.id}`} rows={2} value={faq.answer} onChange={(e) => edit(faq.id, { answer: e.target.value })} className={`${fieldClass} resize-y leading-relaxed`} />
              </div>
            </div>
            <button type="button" onClick={() => remove(faq.id)} aria-label={`Remove FAQ ${index + 1}`} className="flex size-10 shrink-0 items-center justify-center border border-[#111111]/15 text-[#111111]/60 hover:border-[#c2410c] hover:text-[#c2410c]">
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#111111]/15 p-5 sm:p-6">
        <button type="button" onClick={() => setFaqs((current) => [...current, { id: `f${Date.now()}`, question: '', answer: '' }])} className="inline-flex items-center gap-2 border border-dashed border-[#111111]/30 px-4 py-2 text-sm font-semibold hover:border-[#3159ff] hover:text-[#3159ff]">
          <Plus aria-hidden="true" className="size-4" /> Add FAQ
        </button>
        <button type="button" onClick={save} disabled={!valid} className="bg-[#3159ff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2447d6] disabled:cursor-not-allowed disabled:opacity-40">
          Publish FAQs
        </button>
      </div>
    </Panel>
  )
}
