'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

type ConfirmOptions = { title: string; description?: string; confirmLabel?: string; tone?: 'primary' | 'danger' }
type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const resolverRef = useRef<((value: boolean) => void) | null>(null)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback<ConfirmFn>((next) => {
    resolverRef.current?.(false)
    setOptions(next)
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  useEffect(() => {
    if (options && !dialogRef.current?.open) dialogRef.current?.showModal()
  }, [options])

  const settle = (value: boolean) => {
    resolverRef.current?.(value)
    resolverRef.current = null
    dialogRef.current?.close()
    setOptions(null)
  }

  const danger = options?.tone === 'danger'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby={options?.description ? 'confirm-description' : undefined}
        onCancel={(event) => {
          event.preventDefault()
          settle(false)
        }}
        className="m-auto w-[min(92vw,26rem)] border border-[#111111]/15 bg-[#f6f6f3] p-0 text-[#111111] backdrop:bg-[#111111]/50"
      >
        {options && (
          <div>
            <div className="border-b border-[#111111]/15 p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#3159ff]">Please confirm</p>
              <h2 id="confirm-title" className="mt-2 text-pretty text-xl font-semibold tracking-[-0.04em]">{options.title}</h2>
              {options.description && <p id="confirm-description" className="mt-2 text-sm leading-relaxed text-[#111111]/60">{options.description}</p>}
            </div>
            <div className="flex justify-end gap-2 p-5">
              <button type="button" autoFocus onClick={() => settle(false)} className="border border-[#111111]/20 px-4 py-2.5 text-sm font-semibold hover:border-[#111111]">No</button>
              <button
                type="button"
                onClick={() => settle(true)}
                className={`px-4 py-2.5 text-sm font-semibold text-white transition-colors ${danger ? 'bg-[#c2410c] hover:bg-[#9a3412]' : 'bg-[#3159ff] hover:bg-[#2447d6]'}`}
              >
                {options.confirmLabel ?? 'Yes'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider')
  return confirm
}
