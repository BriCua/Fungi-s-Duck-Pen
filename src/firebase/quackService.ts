import { doc, onSnapshot, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './init';

const quackCountsCollection = 'quackCounts';

// This function now takes an amount to increment by.
export const incrementQuackCount = async (userId: string, amount: number) => {
  if (!userId) throw new Error('User not authenticated');
  if (amount === 0) return; // Don't perform a write if there's nothing to add.

  const quackCountRef = doc(db, quackCountsCollection, userId);

  await setDoc(quackCountRef, {
    count: increment(amount),
    lastQuack: serverTimestamp(),
  }, { merge: true });
};

export const subscribeToQuackCount = (userId: string, callback: (count: number) => void) => {
  if (!userId) {
    console.error("User not authenticated, can't subscribe to quack count.");
    return () => {}; // Return an empty unsubscribe function
  }

  const quackCountRef = doc(db, quackCountsCollection, userId);

  const unsubscribe = onSnapshot(quackCountRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().count);
    } else {
      callback(0);
    }
  }, (error) => {
    console.error("Error listening to quack count:", error);
    // You might want to handle this error, e.g., by showing a message to the user.
    callback(0); // Reset count on error or handle as you see fit
  });

  return unsubscribe;
};
