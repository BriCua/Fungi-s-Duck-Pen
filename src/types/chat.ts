// Chat types
export interface ChatMessage {
  msgId: string
  coupleId: string
  senderUid: string
  senderName: string
  senderAvatar?: string
  content: string
  mode: 'normal' | 'quackzulting'
  timestamp: number
  edited?: boolean
  editedAt?: number
}
