'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Bot, Send } from 'lucide-react'

type Message = { role: 'user' | 'juan'; text: string }

const knowledge: { keywords: string[]; answer: string }[] = [
  { keywords: ['leave', 'vacation', 'sick'], answer: 'You have 14 vacation, 8 sick, and 3 emergency leave days left. File a leave from Leave Management at least 3 working days ahead.' },
  { keywords: ['pay', 'salary', 'payslip', 'payroll'], answer: 'Your next pay date is Oct 15 for the Oct 1–15 cutoff. Your latest payslip is available under Payroll & Payslips.' },
  { keywords: ['attendance', 'late', 'time in', 'time-in', 'clock'], answer: 'This week you logged 5 days with 1 late arrival and 1 approved undertime. See every day in Time In.' },
  { keywords: ['schedule', 'shift', 'holiday'], answer: 'Your shift is 08:30–17:30, hybrid (3 onsite, 2 remote). The next holidays are Nov 1 and Nov 2.' },
  { keywords: ['coe', 'certificate', 'document'], answer: 'Your Certificate of Employment was uploaded on Oct 2. You can download it from My Documents.' },
  { keywords: ['overtime', 'ot'], answer: 'Overtime must be filed within 2 days. Your Oct 9 overtime request is pending with Maria Santos.' },
]

const hrKnowledge: { keywords: string[]; answer: string }[] = [
  { keywords: ['approval', 'pending', 'request'], answer: 'You have 8 pending approvals: 4 leave, 3 overtime, and 1 manual time-in. The oldest is Alex Cruz’s vacation leave filed Oct 8.' },
  { keywords: ['attendance', 'late', 'absent', 'today'], answer: '42 of 48 employees checked in today. 3 are late, 1 is absent (Carlo Dizon), and 2 are on approved leave.' },
  { keywords: ['payroll', 'pay', 'cutoff'], answer: 'The Oct 1–15 payroll run is still in Draft. Net pay is ₱1.54M for 48 employees, releasing Oct 15. Approve pending overtime before processing.' },
  { keywords: ['sss', 'philhealth', 'pag-ibig', 'pagibig', 'bir', 'tax', 'contribution'], answer: 'PhilHealth and Pag-IBIG remittances for September are due Oct 15. SSS is due Oct 31. BIR 1601-C was remitted on Oct 10.' },
  { keywords: ['headcount', 'turnover', 'employees'], answer: 'Headcount is 48 (+6 since May). YTD turnover is 6.2%, and Engineering is the largest team with 18 people.' },
  { keywords: ['hiring', 'recruit', 'candidate', 'onboard'], answer: '32 active candidates across 6 open roles. Jasmine Ong has a pending offer and starts onboarding Oct 20 if accepted.' },
]

const variants = {
  employee: {
    knowledge,
    greeting: 'Hi Alex, I’m Juan. Ask me about your leave, pay, attendance, or documents.',
    suggestions: ['How many leave days do I have?', 'When is my next pay day?', 'How was my attendance this week?', 'Where is my COE?'],
    fallback: 'I can help with leave, payroll, attendance, schedules, overtime, and documents. For anything else, reach out through Help & HR Support.',
    placeholder: 'Ask about leave, pay, attendance…',
  },
  hr: {
    knowledge: hrKnowledge,
    greeting: 'Hi Maria, I’m Juan. Ask me about approvals, attendance, payroll, contributions, or headcount.',
    suggestions: ['What approvals are pending?', 'Who is late today?', 'Is payroll ready for Oct 15?', 'When are contributions due?'],
    fallback: 'I can help with approvals, attendance, payroll, government contributions, recruitment, and headcount.',
    placeholder: 'Ask about approvals, payroll, headcount…',
  },
}

export function AskJuanChat({ variant = 'employee' }: { variant?: keyof typeof variants }) {
  const config = variants[variant]
  const { suggestions } = config
  const [messages, setMessages] = useState<Message[]>([{ role: 'juan', text: config.greeting }])
  const [input, setInput] = useState('')

  const answerFor = (question: string) => {
    const lower = question.toLowerCase()
    const match = config.knowledge.find((entry) => entry.keywords.some((keyword) => lower.includes(keyword)))
    return match?.answer ?? config.fallback
  }

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { role: 'user', text: trimmed }, { role: 'juan', text: answerFor(trimmed) }])
    setInput('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    ask(input)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    event.preventDefault()
    ask(input)
  }

  return (
    <section className="flex flex-col border border-[#111111]/15" aria-label="Chat with Juan">
      <ol className="flex min-h-80 flex-col gap-4 p-5 sm:p-6" aria-live="polite">
        {messages.map((message, index) => (
          <li key={index} className={`flex max-w-[85%] gap-3 ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
            {message.role === 'juan' && (
              <span className="flex size-8 shrink-0 items-center justify-center bg-[#3159ff] text-white">
                <Bot aria-hidden="true" className="size-4" />
              </span>
            )}
            <p className={`px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'bg-[#111111] text-[#f6f6f3]' : 'border border-[#111111]/15 bg-white'}`}>
              <span className="sr-only">{message.role === 'user' ? 'You: ' : 'Juan: '}</span>
              {message.text}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2 border-t border-[#111111]/15 px-5 pt-4 sm:px-6">
        {suggestions.map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => ask(suggestion)} className="border border-[#111111]/15 px-3 py-1.5 text-xs font-medium hover:border-[#3159ff] hover:text-[#3159ff]">
            {suggestion}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-end gap-3 p-5 sm:p-6">
        <label htmlFor="ask-juan-input" className="sr-only">Ask Juan a question</label>
        <textarea
          id="ask-juan-input"
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={config.placeholder}
          className="min-h-11 flex-1 resize-none border border-[#111111]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#3159ff]"
        />
        <button type="submit" className="flex size-11 items-center justify-center bg-[#3159ff] text-white hover:bg-[#2447d6]">
          <Send aria-hidden="true" className="size-4" />
          <span className="sr-only">Send</span>
        </button>
      </form>
    </section>
  )
}
