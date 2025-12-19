// Pond Memories types
export interface PondMemory {
  activityId: string
  coupleId: string
  type: 'quackzulting_summary' | 'chat_milestone' | 'duck_clicker' | 'partner_action'
  title: string
  description: string
  data: Record<string, unknown>
  photoURL?: string
  timestamp: number
}
