// Notification types
export interface Notification {
  notificationId: string
  uid: string
  type: 'advice_summary' | 'chat' | 'milestone' | 'nudge' | 'nudge_response'
  title: string // Changed from message to title
  summary?: string // Added summary property
  suggestedActions?: string[]
  moodEmoji?: string
  fromUid?: string
  timestamp: number
  read: boolean
  sessionId?: string
  // Nudge specific data
  data?: {
    goalId?: string;
    checklistItemId?: string | null;
    nudgeMessage?: string;
    goalTitle?: string;
  };
}
