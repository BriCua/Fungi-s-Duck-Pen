import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './init';
import { notificationService } from './notificationService';
import type { Goal } from '../types/goals';

const goalsCollection = 'goals';

// 1. Create
export const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newGoal = {
    ...goalData,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };
  const docRef = await addDoc(collection(db, goalsCollection), newGoal);
  return docRef.id;
};

// 2. Subscribe
export const subscribeToGoals = (coupleId: string, callback: (goals: Goal[]) => void) => {
  const q = query(collection(db, goalsCollection), where('coupleId', '==', coupleId));
  console.log(`goalService: Setting up listener for coupleId: ${coupleId}`);

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() } as Goal);
    });
    console.log(`goalService: onSnapshot fired. Found ${goals.length} goals.`);
    callback(goals);
  }, (error) => {
    console.error("goalService: Error listening to goals:", error);
    callback([]);
  });

  return unsubscribe;
};

// 3. Update
export const updateGoal = async (goalId: string, updatedData: Partial<Goal>) => {
  const goalRef = doc(db, goalsCollection, goalId);
  await updateDoc(goalRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

// 4. Delete
export const deleteGoal = async (goalId: string) => {
  const goalRef = doc(db, goalsCollection, goalId);
  await deleteDoc(goalRef);
};

// 5. Send Nudge Notification
export const sendNudgeNotification = async (
  recipientId: string,
  senderName: string,
  goalId: string,
  goalTitle: string,
  checklistItemId: string | null,
  message: string,
) => {

  const notificationData = {
    // type: 'nudge', // Removed, now passed as separate arg
    goalId,
    checklistItemId,
    nudgeMessage: message,
    goalTitle,
  };

  await notificationService.createNotification(
    recipientId,
    'nudge', // type
    `${senderName} nudged you about: ${goalTitle}`,
    message, // summary
    notificationData
  );
};


// 6. Send Nudge Response Notification
export const sendNudgeResponseNotification = async (
    recipientId: string,
    senderName: string,
    goalTitle: string,
    responseStatus: string
) => {
    await notificationService.createNotification(
        recipientId,
        'nudge_response', // type
        `${senderName} responded to your nudge for "${goalTitle}"`, // title
        responseStatus // summary
    );
};

// 7. Update Checklist from Nudge Response

// Transactional update for checklist items to avoid lost updates from concurrent clients.
export const updateChecklistFromNudge = async (
  goalId: string,
  checklistItemId: string | null,
  completed = true,
) => {
  const goalRef = doc(db, goalsCollection, goalId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(goalRef);
    if (!snap.exists()) throw new Error('Goal not found');
    const data = snap.data() as any;
    const checklist = Array.isArray(data.checklist) ? data.checklist : [];

    const updatedChecklist = checklist.map((item: any) => {
      if (!checklistItemId) return { ...item, completed };
      return item.id === checklistItemId ? { ...item, completed } : item;
    });

    tx.update(goalRef, {
      checklist: updatedChecklist,
      updatedAt: serverTimestamp(),
    });
  });
};
