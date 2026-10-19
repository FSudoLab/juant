'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CARD_VIEW_EVENT, readCardViewPreference } from '@/lib/access'

export function CardViewDashboard({ children }: { children: ReactNode }) {
  const [cardView, setCardView] = useState(false)
  const showOverview = useSearchParams().get('view') === 'overview'

  useEffect(() => {
    const sync = () => setCardView(readCardViewPreference())
    sync()
    window.addEventListener(CARD_VIEW_EVENT, sync)
    return () => window.removeEventListener(CARD_VIEW_EVENT, sync)
  }, [])

  if (cardView && !showOverview) return null
  return children
}
