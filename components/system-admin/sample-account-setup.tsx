'use client'

import { useState, type FormEvent } from 'react'
import { Circle, MapPin, Upload, UserPlus } from 'lucide-react'

const inputClass = 'h-12 w-full rounded-none border border-[#111111]/20 bg-white px-4 text-sm font-medium text-[#111111] outline-none transition placeholder:text-[#111111]/35 focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10'
const labelClass = 'text-sm font-semibold text-[#111111]/75'

export function SampleAccountSetup() {
  const [company, setCompany] = useState('')
  const [logoName, setLogoName] = useState('')
  const [industry, setIndustry] = useState('technology')
  const [telephone, setTelephone] = useState('')
  const [hrHotline, setHrHotline] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [province, setProvince] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  const companyComplete = Boolean(company && industry && telephone && hrHotline && email && street && city && postal && province)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-1 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 rounded-none border border-[#111111]/10 bg-white p-5 shadow-[0_12px_35px_rgba(17,17,17,0.08)] lg:w-72 lg:p-6">
        <label htmlFor="account-logo" className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-none border-2 border-dashed border-[#111111]/25 bg-[#f6f6f3] text-center transition hover:border-[#111111]/60 hover:bg-[#111111]/5">
          <span className="mb-3 flex size-14 items-center justify-center rounded-full border border-[#111111]/20 bg-white text-[#111111] shadow-sm"><Upload aria-hidden="true" /></span>
          <span className="text-base font-bold">{logoName ? 'Logo selected' : 'Upload logo'}</span>
          <span className="mt-1 text-sm text-[#111111]/45">PNG, JPG or SVG</span>
        </label>
        <input id="account-logo" type="file" accept="image/*" className="sr-only" onChange={(event) => setLogoName(event.target.files?.[0]?.name ?? '')} />
        <div className="mt-7">
          <p className="text-2xl font-bold tracking-[-0.04em]">New account</p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#111111]/10 px-3 py-1.5 text-sm font-semibold text-[#111111]"><Circle aria-hidden="true" className="size-2.5 fill-current" /> Draft · {companyComplete ? '1' : '0'} of 1 complete</p>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#111111]/45">Sections</p>
          <div className="rounded-none bg-[#111111]/10 px-4 py-3.5 text-sm font-bold text-[#111111]">Company information</div>
        </div>
        <button type="button" className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-none border border-[#111111]/12 text-sm font-semibold text-[#111111]/70 transition hover:border-[#111111]/50 hover:text-[#111111]"><MapPin aria-hidden="true" className="size-4 text-[#111111]" /> Pick on map</button>
      </aside>

      <form onSubmit={submit} className="min-w-0 flex-1 rounded-none border border-[#111111]/10 bg-white p-6 shadow-[0_12px_35px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-2 border-b border-[#111111]/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#111111]">System admin · New account</p><h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">Company information</h1></div>
          <p className="text-sm text-[#111111]/45">Required fields marked <span className="text-[#111111]">*</span></p>
        </div>

        <section className="pt-8">
          <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
            <Field id="sample-company" label="Company name" required value={company} onChange={setCompany} placeholder="Enter company name" />
            <FieldSelect id="sample-industry" label="Industry" value={industry} onChange={setIndustry} options={[['technology', 'Technology'], ['retail', 'Retail'], ['services', 'Professional services']]} />
            <Field id="sample-telephone" label="Telephone number" required value={telephone} onChange={setTelephone} placeholder="Enter telephone number" />
            <Field id="sample-hr-hotline" label="HR hotline number" required value={hrHotline} onChange={setHrHotline} placeholder="Enter HR hotline number" />
            <Field id="sample-email" label="Email address" required type="email" value={email} onChange={setEmail} placeholder="Enter email address" />
            <div className="sm:col-span-2 xl:col-span-2"><Field id="sample-street" label="Street address" required value={street} onChange={setStreet} placeholder="Enter street address" /></div>
            <Field id="sample-city" label="City" required value={city} onChange={setCity} placeholder="Enter city" />
            <Field id="sample-postal" label="Postal / zip code" required value={postal} onChange={setPostal} placeholder="Enter postal / zip code" />
            <FieldSelect id="sample-province" label="State / province" required value={province} onChange={setProvince} options={[['', 'Select state / province'], ['metro-manila', 'Metro Manila'], ['cebu', 'Cebu'], ['davao', 'Davao']]} />
          </div>
        </section>

        <div className="mt-9 flex flex-col gap-5 border-t border-[#111111]/10 pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#111111]/45">{companyComplete ? 'All company information is complete.' : 'Complete the required information to create this account.'}</p><button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-none bg-[#111111] px-7 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(17,17,17,0.16)] transition hover:bg-[#333333]"><UserPlus aria-hidden="true" className="size-4" /> Create account</button></div>
      </form>
    </div>
  )
}

function Field({ id, label, required, type = 'text', value, onChange, placeholder }: { id: string; label: string; required?: boolean; type?: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="flex min-w-0 flex-col gap-2"><label htmlFor={id} className={labelClass}>{label}{required && <span className="ml-1 text-[#111111]">*</span>}</label><input id={id} required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></div>
}

function FieldSelect({ id, label, required, value, onChange, options }: { id: string; label: string; required?: boolean; value: string; onChange: (value: string) => void; options: string[][] }) {
  return <div className="flex min-w-0 flex-col gap-2"><label htmlFor={id} className={labelClass}>{label}{required && <span className="ml-1 text-[#111111]">*</span>}</label><select id={id} required={required} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></div>
}
