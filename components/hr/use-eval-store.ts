'use client'

import { useEffect, useState } from 'react'
import { EVAL_EVENT, defaultSurvey, readSubmissions, readSurvey, type Submissions, type SurveyConfig } from '@/lib/evaluations'

export function useEvalStore() {
  const [survey, setSurvey] = useState<SurveyConfig>(defaultSurvey)
  const [submissions, setSubmissions] = useState<Submissions>({})
  useEffect(() => {
    const sync = () => {
      setSurvey(readSurvey())
      setSubmissions(readSubmissions())
    }
    sync()
    window.addEventListener(EVAL_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVAL_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return { survey, submissions }
}
