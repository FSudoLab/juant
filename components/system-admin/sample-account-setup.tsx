'use client'

import { useState, type FormEvent } from 'react'
import { Check, Circle, Plus, Upload, UserPlus } from 'lucide-react'
import { Panel } from '@/components/dashboard/primitives'

const inputClass = 'h-11 w-full border border-[#111111]/15 bg-white px-3 text-sm outline-none focus:border-[#3159ff]'
const labelClass = 'font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#111111]/60'

type Employee = { id: number; name: string; email: string; role: string }

export function SampleAccountSetup() {
  const [company, setCompany] = useState('')
  const [logoName, setLogoName] = useState('')
  const [hrName, setHrName] = useState('')
  const [hrEmail, setHrEmail] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: '', email: '', role: 'Employee' },
  ])
  const [completed, setCompleted] = useState(false)

  function updateEmployee(id: number, field: keyof Employee, value: string) {
    setEmployees((current) => current.map((employee) => employee.id === id ? { ...employee, [field]: value } : employee))
  }

  function addEmployee() {
    setEmployees((current) => [...current, { id: Date.now(), name: '', email: '', role: 'Employee' }])
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCompleted(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-2 sm:py-6">
      <header className="flex flex-col gap-5 border-b border-[#111111]/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-[#3159ff] font-mono text-sm font-bold text-white">JT</span>
          <div>
            <p className="text-xl font-bold tracking-[-0.04em]">JuanT</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#111111]/50">HR workspace setup</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#3159ff]">HR preview</p>
          <p className="mt-1 text-sm text-[#111111]/60">Configure the workspace before inviting the team.</p>
        </div>
      </header>
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#111111]/50">New account setup</p>
        <h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Set up your HR workspace</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#111111]/60">Add your company details, invite HR, and prepare your first employees. This is the workspace HR will use after setup is complete.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="grid gap-4 border border-[#111111]/15 bg-[#f7f7f4] p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
        <div className="flex size-16 items-center justify-center border border-dashed border-[#3159ff]/50 bg-white text-[#3159ff]">
          {logoName ? <span className="font-mono text-xs font-bold">LOGO</span> : <Upload aria-hidden="true" className="size-5" />}
        </div>
        <div>
          <label htmlFor="account-logo" className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#3159ff] hover:underline">Upload company logo</label>
          <input id="account-logo" type="file" accept="image/*" className="sr-only" onChange={(event) => setLogoName(event.target.files?.[0]?.name ?? '')} />
          <p className="mt-1 text-xs text-[#111111]/55">This branding will appear in the HR workspace.</p>
        </div>
      </div>

      <Panel title="1. Company details" description="Set up the account that the invited HR team will manage.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex flex-col gap-1.5 sm:col-span-2"><label htmlFor="sample-company" className={labelClass}>Company name</label><input id="sample-company" required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Juant Technologies" className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="sample-industry" className={labelClass}>Industry</label><select id="sample-industry" className={inputClass} defaultValue="technology"><option value="technology">Technology</option><option value="retail">Retail</option><option value="services">Professional services</option></select></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="sample-size" className={labelClass}>Company size</label><select id="sample-size" className={inputClass} defaultValue="1-25"><option>1–25 employees</option><option>26–100 employees</option><option>101–500 employees</option><option>500+ employees</option></select></div>
        </div>
      </Panel>

      <Panel title="2. Invite HR" description="The HR user receives access to finish configuration before launch.">
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex flex-col gap-1.5"><label htmlFor="sample-hr-name" className={labelClass}>HR name</label><input id="sample-hr-name" required value={hrName} onChange={(event) => setHrName(event.target.value)} placeholder="Juan dela Cruz" className={inputClass} /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="sample-hr-email" className={labelClass}>HR email</label><input id="sample-hr-email" required type="email" value={hrEmail} onChange={(event) => setHrEmail(event.target.value)} placeholder="hr@company.com" className={inputClass} /></div>
        </div>
      </Panel>

      <Panel title="3. Add employees" description="Start with a sample roster. HR can add or edit employees after accepting the invitation.">
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          {employees.map((employee, index) => <div key={employee.id} className="grid gap-3 border border-[#111111]/10 p-4 sm:grid-cols-[1fr_1fr_180px]">
            <div className="flex flex-col gap-1.5"><label htmlFor={`employee-name-${employee.id}`} className={labelClass}>Employee {index + 1}</label><input id={`employee-name-${employee.id}`} required value={employee.name} onChange={(event) => updateEmployee(employee.id, 'name', event.target.value)} placeholder="Employee name" className={inputClass} /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor={`employee-email-${employee.id}`} className={labelClass}>Email</label><input id={`employee-email-${employee.id}`} required type="email" value={employee.email} onChange={(event) => updateEmployee(employee.id, 'email', event.target.value)} placeholder="employee@company.com" className={inputClass} /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor={`employee-role-${employee.id}`} className={labelClass}>Role</label><select id={`employee-role-${employee.id}`} value={employee.role} onChange={(event) => updateEmployee(employee.id, 'role', event.target.value)} className={inputClass}><option>Employee</option><option>Manager</option><option>HR</option></select></div>
          </div>)}
          <button type="button" onClick={addEmployee} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#3159ff] hover:underline"><Plus aria-hidden="true" className="size-4" /> Add another employee</button>
        </div>
      </Panel>

      <div className="flex flex-col gap-4 border-t border-[#111111]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-[#111111]/60"><Circle aria-hidden="true" className="size-3 fill-[#111111]/20" /> HR configures modules, permissions, and policies after accepting the invite.</p>
        <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 bg-[#3159ff] px-6 text-sm font-semibold text-white hover:bg-[#2447d6]"><UserPlus aria-hidden="true" className="size-4" /> Create sample account</button>
      </div>
        {completed && <div role="status" className="flex items-center gap-2 border border-[#3159ff]/25 bg-[#3159ff]/5 p-4 text-sm"><Check aria-hidden="true" className="size-4 text-[#3159ff]" /> Sample account prepared for {company}. The HR invitation is ready to send.</div>}
      </form>
    </div>
  )
}
