// Couple types
export interface Couple {
  coupleId: string
  userIds: string[]
  createdBy: string
  createdAt: number
  inviteCode?: string
  inviteCodeExpiry?: number
  relationshipStatus?: string
  anniversary?: number
  meetStory?: string
  specialDates?: SpecialDate[];
}

// New type for SpecialDate
export interface SpecialDate {
  id: string;
  name: string;
  date: number; // Timestamp
  recurring?: boolean;
}
