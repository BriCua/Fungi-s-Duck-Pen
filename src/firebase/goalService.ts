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
export const updateChecklistFromNudge = async () => {
    // This is tricky. We need to read the doc, update the checklist, and write it back.
    // This should be done in a transaction for safety.
    // For now, a simple update will be used. A more robust solution might be needed.
    
    // As we don't have the goal object here, we can't just update the checklist.
    // This function will likely need to be called from a place where the goal object is available.
    // Or we need to fetch the goal here, which is not ideal.
    
    // Let's assume for now this logic will be handled in the component that calls this,
    // and this function will just update the goal with the new checklist.
    
    // The logic to find and update the specific checklist item will be complex here without the goal object.
    // Let's leave this as a placeholder and implement it in the hook `useGoals.ts`
    // which will have access to the goal's state.
    console.warn("updateChecklistFromNudge requires the full goal object to perform an update. This logic should be handled in the calling hook or component.");
};
