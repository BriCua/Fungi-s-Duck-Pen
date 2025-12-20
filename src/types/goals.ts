import type { Timestamp } from 'firebase/firestore';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export type GoalType = 'personal' | 'us';
export type GoalPriority = 'urgentAndImportant' | 'importantNotUrgent' | 'urgentNotImportant' | 'notUrgentNotImportant';

export interface Goal {
  id?: string; // This will be the doc ID from firestore
  coupleId: string;
  createdBy: string;
  title: string;
  type: GoalType;
  dueDate: Timestamp;
  details?: string;
  priority?: GoalPriority;
  checklist: ChecklistItem[];
  done?: boolean;
  isArchived?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
