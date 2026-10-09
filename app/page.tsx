import Image from 'next/image'
import { ArrowUpRight, Check, ChevronRight, Clock3, FileCheck2, Menu, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'

const modules = [
  { icon: UsersRound, label: 'People', title: 'One clear view of every person.', copy: 'Profiles, documents, org charts, and employee history — finally connected.', tone: 'blue' },
  { icon: Clock3, label: 'Work', title: 'Work that flows without friction.', copy: 'Attendance, leave, schedules, and approvals in one calm workspace.', tone: 'lime' },
  { icon: FileCheck2, label: 'Pay', title: 'Payroll you can stand behind.', copy: 'Accurate payroll, local compliance, payslips, and a complete audit trail.', tone: 'peach' },
]

const proofPoints = ['Built for Philippine teams', 'Role-based from day one', 'One trusted employee record']

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f6f3] text-[#111111]">
      <nav className="mx-auto flex max-w-[1320px] items-center justify-between border-x border-[#111111]/10 px-5 py-5 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3 font-mono text-sm font-bold tracking-[-0.04em]" aria-label="JuanT home">
          <span className="grid size-8 place-items-center bg-[#111111] text-[#f6f6f3]">JT</span>
          <span>JUANT<span className="text-[#3159ff]">.</span></span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#platform" className="transition-opacity hover:opacity-60">Platform</a>
          <a href="#why-juant" className="transition-opacity hover:opacity-60">Why JuanT</a>
          <a href="#contact" className="transition-opacity hover:opacity-60">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/signin" aria-label="Sign in to JuanT" className="relative z-10 hidden cursor-pointer text-sm font-semibold underline-offset-4 transition-opacity hover:opacity-60 hover:underline sm:block">Sign in</a>
          <a href="#contact" className="inline-flex items-center gap-2 bg-[#3159ff] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">Book a demo <ArrowUpRight aria-hidden="true" /></a>
          <button className="grid size-10 place-items-center border border-[#111111]/15 md:hidden" aria-label="Open menu"><Menu aria-hidden="true" /></button>
        </div>
      </nav>

      <section id="top" className="mx-auto grid max-w-[1320px] border-x border-[#111111]/10 lg:grid-cols-[1.04fr_.96fr]">
        <div className="flex min-h-[580px] flex-col justify-between border-b border-[#111111]/10 px-5 pb-10 pt-20 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:pb-14 lg:pt-28">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 border border-[#3159ff]/30 bg-[#3159ff]/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#3159ff]"><span className="size-1.5 bg-[#3159ff]" /> The human operating system</div>
            <h1 className="max-w-[720px] text-[clamp(3.8rem,8vw,7.8rem)] font-semibold leading-[0.88] tracking-[-0.09em]">People work<br /><span className="text-[#3159ff]">better</span> here.</h1>
            <p className="mt-9 max-w-[500px] text-lg leading-relaxed text-[#111111]/65 sm:text-xl">JuanT brings your people, payroll, and everyday work into one sharp, simple HR platform built for teams that are going places.</p>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#111111]/50">
            {proofPoints.map((point) => <span key={point} className="flex items-center gap-2"><Check className="text-[#3159ff]" aria-hidden="true" /> {point}</span>)}
          </div>
        </div>
        <div className="relative min-h-[520px] overflow-hidden bg-[#dce5ff] lg:min-h-0">
          <Image src="/juant-team-hero.png" alt="A diverse team collaborating in a bright office" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute bottom-5 left-5 max-w-[250px] bg-[#f6f6f3] p-4 sm:bottom-8 sm:left-8"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#3159ff]">Designed for momentum</p><p className="mt-2 text-sm font-medium leading-snug">The less time you spend managing work, the more time your people have to do it.</p></div>
          <div className="absolute right-5 top-5 grid size-16 place-items-center bg-[#d8f06a] font-mono text-xs font-bold uppercase leading-none tracking-tight sm:right-8 sm:top-8"><Sparkles aria-hidden="true" /><span className="sr-only">Human-first design</span></div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-[1320px] border-x border-t border-[#111111]/10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-14 grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">01 / The platform</p></div><div><h2 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.07em] sm:text-6xl">Everything your people need. Nothing they don't.</h2><p className="mt-6 max-w-xl text-base leading-relaxed text-[#111111]/60">From first day to final pay, JuanT gives every team a shared source of truth — and gives HR room to think bigger.</p></div></div>
        <div className="grid border-t border-[#111111]/15 md:grid-cols-3">{modules.map(({ icon: Icon, label, title, copy, tone }, index) => <article key={label} className={`border-b border-[#111111]/15 py-8 md:border-b-0 md:px-7 md:py-9 ${index !== 0 ? 'md:border-l' : 'md:pl-0'} ${index === 2 ? 'md:pr-0' : ''}`}><div className={`mb-14 grid size-12 place-items-center ${tone === 'blue' ? 'bg-[#3159ff] text-white' : tone === 'lime' ? 'bg-[#d8f06a]' : 'bg-[#ffb497]'}`}><Icon aria-hidden="true" /></div><p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#111111]/45">{label}</p><h3 className="mt-3 max-w-xs text-2xl font-semibold leading-tight tracking-[-0.05em]">{title}</h3><p className="mt-4 max-w-xs text-sm leading-relaxed text-[#111111]/60">{copy}</p><a href="#contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Explore module <ChevronRight aria-hidden="true" /></a></article>)}</div>
      </section>

      <section id="why-juant" className="mx-auto grid max-w-[1320px] border-x border-t border-[#111111]/10 bg-[#111111] text-[#f6f6f3] lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-[#f6f6f3]/20 px-5 py-20 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-24"><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#d8f06a]">02 / Why JuanT</p><h2 className="mt-20 max-w-lg text-5xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl">Make work feel <span className="text-[#d8f06a]">lighter.</span></h2></div>
        <div className="grid sm:grid-cols-2"><div className="border-b border-[#f6f6f3]/20 p-8 sm:border-r lg:p-10"><ShieldCheck className="mb-20 text-[#d8f06a]" aria-hidden="true" /><h3 className="text-xl font-semibold tracking-[-0.04em]">Trust, by design.</h3><p className="mt-3 text-sm leading-relaxed text-[#f6f6f3]/60">Sensitive employee and payroll data stays protected with granular access, audit logs, and secure workflows.</p></div><div className="border-b border-[#f6f6f3]/20 p-8 lg:p-10"><Sparkles className="mb-20 text-[#ffb497]" aria-hidden="true" /><h3 className="text-xl font-semibold tracking-[-0.04em]">Clarity at every step.</h3><p className="mt-3 text-sm leading-relaxed text-[#f6f6f3]/60">Less chasing. Fewer spreadsheets. One beautifully organized place for the work behind your people.</p></div><div className="col-span-full flex flex-wrap items-center justify-between gap-6 p-8 lg:p-10"><p className="max-w-md text-lg leading-snug text-[#f6f6f3]/70">A modern HR foundation for ambitious Philippine teams.</p><a href="#contact" className="inline-flex items-center gap-2 bg-[#f6f6f3] px-5 py-3 text-sm font-semibold text-[#111111]">See how it works <ArrowUpRight aria-hidden="true" /></a></div></div>
      </section>

      <section id="contact" className="mx-auto max-w-[1320px] border-x border-t border-[#111111]/10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#3159ff]">03 / Start here</p><h2 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.08em] sm:text-7xl">Your people are<br /><span className="text-[#3159ff]">worth the upgrade.</span></h2></div><a href="mailto:hello@juant.ph" className="inline-flex w-fit items-center gap-3 border-b-2 border-[#111111] pb-2 text-sm font-semibold">hello@juant.ph <ArrowUpRight aria-hidden="true" /></a></div></section>
      <footer className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 border-x border-t border-[#111111]/10 px-5 py-6 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-[#111111]/50 sm:px-8 lg:px-10"><span>© 2026 JuanT / FSudoLab</span><span>People first. Always.</span></footer>
    </main>
  )
}
