import { collection, addDoc, query, where, getDocs, updateDoc, doc, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import { db } from './init';
import type { User } from '../types';

const generateInviteCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createCouple = async (user: User) => {
  if (!user) throw new Error('User not authenticated');

  const inviteCode = generateInviteCode();
  const coupleRef = await addDoc(collection(db, 'couples'), {
    inviteCode,
    createdBy: user.uid,
    createdAt: Timestamp.now(),
          userIds: [user.uid],  });

  await updateDoc(doc(db, 'users', user.uid), {
    coupleId: coupleRef.id,
  });

  return { coupleId: coupleRef.id, inviteCode };
};

export const joinCoupleByCode = async (inviteCode: string, user: User) => {
  if (!user) throw new Error('User not authenticated');

  const q = query(collection(db, 'couples'), where('inviteCode', '==', inviteCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid invite code');
  }

  const coupleDoc = querySnapshot.docs[0];
  const coupleData = coupleDoc.data();

  if (coupleData.userIds.length >= 2) {
    throw new Error('Couple already full');
  }

  if (coupleData.userIds.includes(user.uid)) {
    throw new Error('You are already in this couple');
  }

  await updateDoc(coupleDoc.ref, {
    userIds: arrayUnion(user.uid),
  });

  await updateDoc(doc(db, 'users', user.uid), {
    coupleId: coupleDoc.id,
  });

  return { coupleId: coupleDoc.id };
};

export const getCoupleData = async (coupleId: string) => {
    const coupleRef = doc(db, 'couples', coupleId);
    const coupleSnap = await getDoc(coupleRef);

    if (!coupleSnap.exists()) {
        return null;
    }

    return coupleSnap.data();
};
