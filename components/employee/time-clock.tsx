'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock3, FilePlus2, LogOut, MapPin } from 'lucide-react'

type LocationState =
  | { state: 'locating' }
  | { state: 'ready'; accuracy: number }
  | { state: 'error' }
  | { state: 'unsupported' }

type Session = { timeIn: Date | null; timeOut: Date | null }

const timeFormat: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }
const shortTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true }

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function TimeClock() {
  const [now, setNow] = useState<Date | null>(null)
  const [location, setLocation] = useState<LocationState>({ state: 'locating' })
  const [session, setSession] = useState<Session>({ timeIn: null, timeOut: null })

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocation({ state: 'unsupported' })
      return
    }
    setLocation({ state: 'locating' })
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ state: 'ready', accuracy: Math.round(position.coords.accuracy) }),
      () => setLocation({ state: 'error' }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  useEffect(() => {
    locate()
  }, [locate])

  const isTimedIn = session.timeIn !== null && session.timeOut === null
  const isDone = session.timeOut !== null

  function handleClock() {
    const stamp = new Date()
    if (!session.timeIn) setSession({ timeIn: stamp, timeOut: null })
    else if (!session.timeOut) setSession({ ...session, timeOut: stamp })
  }

  const day = now?.toLocaleDateString('en-US', { day: '2-digit' }) ?? '--'
  const month = now?.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() ?? '---'
  const weekday = now?.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() ?? '---'
  const clock = now?.toLocaleTimeString('en-US', timeFormat) ?? '--:--:-- --'

  const locationLabel =
    location.state === 'ready'
      ? `Location ready (±${location.accuracy} m)`
      : location.state === 'locating'
        ? 'Getting your location…'
        : location.state === 'error'
          ? 'Location unavailable'
          : 'Location not supported'

  return (
    <section aria-label="Time clock" className="border border-[#111111]/15 bg-[#f6f6f3]">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-semibold tabular-nums tracking-[-0.05em]">{day}</span>
            <span className="flex flex-col font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.12em] text-[#111111]/50">
              <span>{month}</span>
              <span>{weekday}</span>
            </span>
          </div>
          <time className="text-3xl font-semibold tabular-nums tracking-[-0.04em] sm:text-4xl" aria-live="off" suppressHydrationWarning>
            {clock}
          </time>
          <button
            type="button"
            onClick={handleClock}
            disabled={isDone}
            className={`inline-flex min-w-36 items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3159ff] disabled:cursor-not-allowed disabled:bg-[#111111]/20 disabled:text-[#111111]/50 ${
              isTimedIn ? 'bg-[#111111] hover:bg-[#111111]/85' : 'bg-[#3159ff] hover:bg-[#2447d6]'
            }`}
          >
            {isDone ? 'Done for today' : isTimedIn ? 'Time Out' : 'Time In'}
            {isTimedIn ? <LogOut aria-hidden="true" className="size-4" /> : <Clock3 aria-hidden="true" className="size-4" />}
          </button>
          <div className="flex items-center gap-3 text-sm xl:border-l xl:border-[#111111]/15 xl:pl-6">
            <MapPin aria-hidden="true" className={`size-4 ${location.state === 'ready' ? 'text-[#3159ff]' : 'text-[#c2410c]'}`} />
            <span className="text-[#111111]/70" role="status">
              {locationLabel}
            </span>
            <button
              type="button"
              onClick={locate}
              disabled={location.state === 'locating'}
              className="font-semibold text-[#3159ff] underline underline-offset-4 hover:text-[#2447d6] disabled:opacity-50"
            >
              Retry location
            </button>
          </div>
        </div>
        <Link
          href="/dashboard/employee/requests"
          className="inline-flex items-center justify-center gap-2 border border-[#3159ff] px-4 py-2.5 text-sm font-semibold text-[#3159ff] transition-colors hover:bg-[#3159ff] hover:text-white"
        >
          <FilePlus2 aria-hidden="true" className="size-4" />
          Create manual request
        </Link>
      </div>

      {session.timeIn && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[#111111]/15 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#111111]/60 sm:px-6">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 ${isTimedIn ? 'animate-pulse bg-[#3159ff]' : 'bg-[#111111]/30'}`} />
            {isTimedIn ? 'On the clock' : 'Clocked out'}
          </span>
          <span>In {session.timeIn.toLocaleTimeString('en-US', shortTime)}</span>
          {session.timeOut && <span>Out {session.timeOut.toLocaleTimeString('en-US', shortTime)}</span>}
          <span className="text-[#111111]">
            Elapsed {formatDuration((session.timeOut ?? now ?? session.timeIn).getTime() - session.timeIn.getTime())}
          </span>
        </div>
      )}
    </section>
  )
}
