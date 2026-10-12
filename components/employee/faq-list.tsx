'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ_EVENT, defaultFaqs, readFaqs } from '@/lib/faqs'

export function FaqList() {
  const [faqs, setFaqs] = useState(defaultFaqs)

  useEffect(() => {
    const sync = () => setFaqs(readFaqs())
    sync()
    window.addEventListener(FAQ_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FAQ_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (faqs.length === 0) return <p className="px-5 py-6 text-sm text-[#111111]/60 sm:px-6">HR hasn&apos;t posted any FAQs yet.</p>

  return (
    <ul className="divide-y divide-[#111111]/15">
      {faqs.map((faq) => (
        <li key={faq.id}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold hover:bg-[#111111]/[0.03] sm:px-6 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#111111]/50 transition-transform group-open:rotate-180" />
            </summary>
            <p className="whitespace-pre-line px-5 pb-4 text-sm leading-relaxed text-[#111111]/70 sm:px-6">{faq.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  )
}
