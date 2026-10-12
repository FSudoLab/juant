import { teamRoster } from './team-roster'

export type EvalQuestion = { id: string; text: string }
export type EvalCategory = { id: string; name: string; questions: EvalQuestion[] }
export type SurveyConfig = {
  title: string
  open: boolean
  scaleMax: number
  categories: EvalCategory[]
  departments: Record<string, boolean>
}
export type PeerAnswers = { answers: Record<string, number>; rationale: string }
export type PeerReview = PeerAnswers & { reviewerId: string }
export type Submissions = Record<string, Record<string, PeerAnswers>>

export const EVAL_EVENT = 'juant-evals-updated'
const SURVEY_KEY = 'juant-eval-survey-v2'
const SUBMISSIONS_KEY = 'juant-eval-submissions'

export const scaleOptions = [5, 7, 10]
export const evalDepartments = [...new Set(teamRoster.map((m) => m.department))].sort()

export const defaultSurvey: SurveyConfig = {
  title: 'H2 2026 peer evaluation',
  open: true,
  scaleMax: 5,
  categories: [
    {
      id: 'work',
      name: 'Work',
      questions: [
        { id: 'work-1', text: 'Is he good at his work?' },
        { id: 'work-2', text: 'Does he pass his work on time?' },
      ],
    },
    {
      id: 'talkative',
      name: 'Talkative',
      questions: [
        { id: 'talk-1', text: 'Is he talkative?' },
        { id: 'talk-2', text: 'Does he speak well of others?' },
      ],
    },
  ],
  departments: Object.fromEntries(evalDepartments.map((d) => [d, true])),
}

export const allQuestions = (survey: SurveyConfig) => survey.categories.flatMap((c) => c.questions)

const seededRationales = [
  'Always delivers on time and keeps the team informed about blockers.',
  'Solid work overall, but could share updates more often during busy weeks.',
  'Easy to talk to and explains things clearly, though handoffs are sometimes late.',
  'Reliable teammate who helps others without being asked.',
]

function hash(value: string) {
  let h = 0
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

function seededReview(revieweeId: string, reviewerId: string, survey: SurveyConfig): PeerAnswers {
  const answers = Object.fromEntries(
    allQuestions(survey).map((q) => {
      const ratio = 0.5 + (hash(`${revieweeId}:${reviewerId}:${q.id}`) % 51) / 100
      return [q.id, Math.max(1, Math.min(survey.scaleMax, Math.round(ratio * survey.scaleMax)))]
    }),
  )
  return { answers, rationale: seededRationales[hash(`${revieweeId}${reviewerId}`) % seededRationales.length] }
}

export const peersOf = (employeeId: string) => {
  const member = teamRoster.find((m) => m.id === employeeId)
  if (!member) return []
  return teamRoster.filter((m) => m.department === member.department && m.id !== member.id)
}

export function peerReviewsFor(employeeId: string, survey: SurveyConfig, submissions: Submissions): PeerReview[] {
  return peersOf(employeeId).map((reviewer) => ({
    reviewerId: reviewer.id,
    ...(submissions[employeeId]?.[reviewer.id] ?? seededReview(employeeId, reviewer.id, survey)),
  }))
}

export function averageOf(values: number[]) {
  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

export const reviewScore = (review: PeerAnswers, survey: SurveyConfig) =>
  averageOf(allQuestions(survey).map((q) => review.answers[q.id]).filter((v): v is number => typeof v === 'number'))

export const overallScore = (reviews: PeerReview[], survey: SurveyConfig) =>
  averageOf(reviews.map((r) => reviewScore(r, survey)).filter((v): v is number => v !== null))

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(EVAL_EVENT))
}

export const readSurvey = (): SurveyConfig => {
  const stored = read<Partial<SurveyConfig>>(SURVEY_KEY, {})
  return { ...defaultSurvey, ...stored, departments: { ...defaultSurvey.departments, ...stored.departments } }
}
export const writeSurvey = (survey: SurveyConfig) => write(SURVEY_KEY, survey)
export const readSubmissions = () => read<Submissions>(SUBMISSIONS_KEY, {})
export const writeSubmission = (revieweeId: string, reviewerId: string, review: PeerAnswers) => {
  const all = readSubmissions()
  write(SUBMISSIONS_KEY, { ...all, [revieweeId]: { ...all[revieweeId], [reviewerId]: review } })
}
