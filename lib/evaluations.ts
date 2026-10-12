import { teamRoster } from './team-roster'

export type EvalQuestion = { id: string; text: string }
export type SurveyConfig = {
  title: string
  open: boolean
  questions: EvalQuestion[]
  departments: Record<string, boolean>
}
export type PeerReview = { reviewerId: string; comment: string; score: number }
export type HrRatings = Record<string, Record<string, number>>

export const EVAL_EVENT = 'juant-evals-updated'
const SURVEY_KEY = 'juant-eval-survey'
const RATINGS_KEY = 'juant-eval-ratings'

export const evalDepartments = [...new Set(teamRoster.map((m) => m.department))].sort()

export const defaultSurvey: SurveyConfig = {
  title: 'H2 2026 peer evaluation',
  open: true,
  questions: [
    { id: 'q1', text: 'Works hard and follows through on tasks' },
    { id: 'q2', text: 'Communicates clearly with the team' },
    { id: 'q3', text: 'Shows up on time and is reliable' },
    { id: 'q4', text: 'Helps co-workers when they need it' },
  ],
  departments: Object.fromEntries(evalDepartments.map((d) => [d, true])),
}

const seededComments = [
  { comment: 'Always delivers on time and keeps the team informed.', score: 5 },
  { comment: 'Solid work, but could share updates more often.', score: 4 },
  { comment: 'Hard to reach during busy weeks and misses some handoffs.', score: 2 },
  { comment: 'Reliable and easy to work with.', score: 4 },
]

export function peerReviewsFor(employeeId: string): PeerReview[] {
  const member = teamRoster.find((m) => m.id === employeeId)
  if (!member) return []
  return teamRoster
    .filter((m) => m.department === member.department && m.id !== member.id)
    .map((reviewer, index) => {
      const seed = seededComments[(index + employeeId.length + employeeId.charCodeAt(employeeId.length - 1)) % seededComments.length]
      return { reviewerId: reviewer.id, ...seed }
    })
}

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

export const readSurvey = () => {
  const stored = read<SurveyConfig>(SURVEY_KEY, defaultSurvey)
  return { ...defaultSurvey, ...stored, departments: { ...defaultSurvey.departments, ...stored.departments } }
}
export const writeSurvey = (survey: SurveyConfig) => write(SURVEY_KEY, survey)
export const readRatings = () => read<HrRatings>(RATINGS_KEY, {})
export const writeRating = (employeeId: string, answers: Record<string, number>) => write(RATINGS_KEY, { ...readRatings(), [employeeId]: answers })

export function finalScore(answers: Record<string, number> | undefined, questions: EvalQuestion[]) {
  if (!answers) return null
  const scores = questions.map((q) => answers[q.id]).filter((v): v is number => typeof v === 'number')
  if (scores.length === 0) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}
