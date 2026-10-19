'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { CARD_VIEW_EVENT, readCardViewPreference } from '@/lib/access'

export function CardViewDashboard({ children }: { children: ReactNode }) {
  const [cardView, setCardView] = useState(false)

  useEffect(() => {
    const sync = () => setCardView(readCardViewPreference())
    sync()
    window.addEventListener(CARD_VIEW_EVENT, sync)
    return () => window.removeEventListener(CARD_VIEW_EVENT, sync)
  }, [])

  if (cardView) return null
  return children
}
