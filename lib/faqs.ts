export type Faq = { id: string; question: string; answer: string }

export const FAQ_EVENT = 'juant-faqs-updated'
const FAQ_KEY = 'juant-faqs'

export const defaultFaqs: Faq[] = [
  { id: 'f1', question: 'How far ahead should I file a vacation leave?', answer: 'At least 3 working days before the start date. Leaves of 5 days or more should be filed 2 weeks ahead.' },
  { id: 'f2', question: 'I forgot to time out. What should I do?', answer: 'File an attendance correction from My Requests within 2 days. Your manager will review and approve it.' },
  { id: 'f3', question: 'When are government contributions deducted?', answer: 'SSS, PhilHealth, and Pag-IBIG are deducted on the second cutoff of each month.' },
  { id: 'f4', question: 'How do I update my bank account for payroll?', answer: 'Send a request to HR with a copy of your bank certificate. Changes take effect on the next cutoff.' },
]

export function readFaqs(): Faq[] {
  try {
    const raw = window.localStorage.getItem(FAQ_KEY)
    return raw ? (JSON.parse(raw) as Faq[]) : defaultFaqs
  } catch {
    return defaultFaqs
  }
}

export function writeFaqs(faqs: Faq[]) {
  window.localStorage.setItem(FAQ_KEY, JSON.stringify(faqs))
  window.dispatchEvent(new Event(FAQ_EVENT))
}
