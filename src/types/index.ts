// User types
export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  birthdate?: number
  coupleId?: string
  createdAt: number
  updatedAt: number
}

// Couple types
export interface Couple {
  coupleId: string
  userIds: string[]
  createdBy: string // Add this line
  createdAt: number
  inviteCode?: string
  inviteCodeExpiry?: number
  relationshipStatus?: string
  anniversary?: number
  meetStory?: string
  specialDates?: SpecialDate[]; // Added this line
}

// New type for SpecialDate
export interface SpecialDate {
  id: string;
  name: string;
  date: number; // Timestamp
  recurring?: boolean;
}

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

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'duckdark' | 'navy' | 'tertiary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps {
  id?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  label?: string
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export interface ModalProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  variant?: 'info' | 'warning' | 'danger'
  isLoading?: boolean // Added isLoading prop
}