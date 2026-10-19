'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CARD_VIEW_EVENT, readCardViewPreference } from '@/lib/access'
import type { Role } from '@/lib/navigation'

export function CardViewDashboard({ role, children }: { role: string; children: ReactNode }) {
  const [cardView, setCardView] = useState(false)
  const showOverview = useSearchParams().get('view') === 'overview'

  useEffect(() => {
    const sync = () => setCardView(readCardViewPreference(role as Role))
    sync()
    window.addEventListener(CARD_VIEW_EVENT, sync)
    return () => window.removeEventListener(CARD_VIEW_EVENT, sync)
  }, [role])

  if (cardView && !showOverview) return null
  return children
}
