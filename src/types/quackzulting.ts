// Quackzulting types
export interface QuackzultingSession {
  sessionId: string
  uid: string
  coupleId: string
  createdAt: number
  messages: QuackzultingMessage[]
  status: 'active' | 'archived'
}

export interface QuackzultingMessage {
  msgId: string
  role: 'user' | 'dr_kwuk'
  content: string
  emotionalReflection?: string
  suggestedActions?: string[]
  issueClassification?: string
  timestamp: number
  hintLevel?: number // 1-5, Light to Direct
}
