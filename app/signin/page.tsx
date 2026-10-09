'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'

type Role = 'employee' | 'hr'

const demoAccounts = {
  employee: { email: 'employee@juant.demo', password: 'employee123', name: 'Demo Employee' },
  hr: { email: 'hr@juant.demo', password: 'hr123456', name: 'Demo HR Manager' },
}

export default function SignInPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('employee')
  const [email, setEmail] = useState(demoAccounts.employee.email)
  const [password, setPassword] = useState(demoAccounts.employee.password)
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')

  function chooseRole(nextRole: Role) {
    setRole(nextRole)
    setEmail(demoAccounts[nextRole].email)
    setPassword(demoAccounts[nextRole].password)
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const account = demoAccounts[role]
    if (email.trim().toLowerCase() === account.email && password === account.password) {
      setSignedIn(true)
      setError('')
      router.push(`/dashboard/${role}`)
    } else {
      setSignedIn(false)
      setError(`Use the ${role} demo credentials shown below.`)
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f6f3] px-5 py-8 text-[#111111] sm:px-10 sm:py-10">
      <section className="mx-auto w-full max-w-lg">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">JuanT workspace</p>
        <div className="mt-5 flex items-start justify-between gap-6">
          <h1 className="text-5xl font-semibold leading-[0.9] tracking-[-0.08em]">Welcome<br />back.</h1>
          <Link href="/" className="group mt-1 inline-flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60 transition-colors hover:text-[#3159ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3159ff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f6f3]">
            <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to JuanT</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#111111]/60">Choose a demo role to explore the JuanT experience.</p>

        <div className="mt-8 grid grid-cols-2 border border-[#111111]/20" role="tablist" aria-label="Demo account type">
          {(['employee', 'hr'] as Role[]).map((option) => (
            <button key={option} type="button" role="tab" aria-selected={role === option} onClick={() => chooseRole(option)} className={`border-r border-[#111111]/20 px-4 py-3 text-left text-sm font-semibold capitalize last:border-r-0 ${role === option ? 'bg-[#3159ff] text-white' : 'text-[#111111]/60 hover:bg-[#111111]/5'}`}>
              {option === 'hr' ? 'HR manager' : 'Employee'}
            </button>
          ))}
        </div>

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="email">Work email<input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="border border-[#111111]/20 bg-transparent px-4 py-3 font-normal outline-none transition-colors focus:border-[#3159ff]" /></label>
          <label className="flex flex-col gap-2 text-sm font-semibold" htmlFor="password">Password<input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="border border-[#111111]/20 bg-transparent px-4 py-3 font-normal outline-none transition-colors focus:border-[#3159ff]" /></label>
          <button type="submit" className="mt-3 inline-flex items-center justify-center gap-2 bg-[#3159ff] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Sign in as {role === 'hr' ? 'HR' : 'employee'} <ArrowUpRight aria-hidden="true" /></button>
        </form>

        {error && <p className="mt-5 border border-red-600/30 bg-red-600/5 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        {signedIn && <div className="mt-5 border border-[#3159ff]/30 bg-[#3159ff]/5 px-4 py-4 text-sm" role="status"><p className="flex items-center gap-2 font-semibold"><Check aria-hidden="true" /> Demo sign in successful</p><p className="mt-1 text-[#111111]/60">You are viewing the {demoAccounts[role].name} experience. No account was created.</p></div>}
        <p className="mt-8 border-t border-[#111111]/10 pt-5 text-xs leading-relaxed text-[#111111]/50">Demo credentials are prefilled. Employee: employee@juant.demo / employee123. HR: hr@juant.demo / hr123456.</p>
      </section>
    </main>
  )
}
