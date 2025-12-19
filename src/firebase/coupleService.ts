import { collection, addDoc, query, where, getDocs, updateDoc, doc, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import { db } from './init';
import type { Couple, SpecialDate } from '../types/couple';
import type { User } from '../types/user';

const generateInviteCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const coupleService = {
  createCouple: async (user: User) => {
    if (!user) throw new Error('User not authenticated');

    const inviteCode = generateInviteCode();
    const specialDates = [];
    if (user.birthdate) {
      specialDates.push({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: `${user.displayName}'s Birthday`,
        date: user.birthdate,
        recurring: true,
      });
    }

    const coupleRef = await addDoc(collection(db, 'couples'), {
      inviteCode,
      createdBy: user.uid,
      createdAt: Timestamp.now(),
      userIds: [user.uid],
      specialDates,
    });

    await updateDoc(doc(db, 'users', user.uid), {
      coupleId: coupleRef.id,
    });

    return { coupleId: coupleRef.id, inviteCode };
  },

  joinCoupleByCode: async (inviteCode: string, user: User) => {
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

    const partnerId = coupleData.userIds[0];
    const partnerDoc = await getDoc(doc(db, 'users', partnerId));
    const partner = partnerDoc.data() as User;

    const specialDates = coupleData.specialDates || [];

    if (user.birthdate && !specialDates.some((d: SpecialDate) => d.name === `${user.displayName}'s Birthday`)) {
      specialDates.push({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: `${user.displayName}'s Birthday`,
        date: user.birthdate,
        recurring: true,
      });
    }

    if (partner.birthdate && !specialDates.some((d: SpecialDate) => d.name === `${partner.displayName}'s Birthday`)) {
      specialDates.push({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name: `${partner.displayName}'s Birthday`,
        date: partner.birthdate,
        recurring: true,
      });
    }

    await updateDoc(coupleDoc.ref, {
      userIds: arrayUnion(user.uid),
      specialDates,
    });

    await updateDoc(doc(db, 'users', user.uid), {
      coupleId: coupleDoc.id,
    });

    return { coupleId: coupleDoc.id };
  },

  getCoupleData: async (coupleId: string) => {
    const coupleRef = doc(db, 'couples', coupleId);
    const coupleSnap = await getDoc(coupleRef);

    if (!coupleSnap.exists()) {
      return null;
    }

    return { coupleId: coupleSnap.id, ...coupleSnap.data() } as Couple;
  },

  updateCoupleDetails: async (coupleId: string, details: Partial<{
    relationshipStatus: string;
    anniversary: Date | undefined;
    meetStory: string;
  }>) => {
    if (!coupleId) throw new Error("Couple ID is required.");

    const coupleDocRef = doc(db, 'couples', coupleId);
    
    const payload: { [key: string]: any } = {
      updatedAt: Date.now(),
    };

    if (details.relationshipStatus) payload.relationshipStatus = details.relationshipStatus;
    if (details.anniversary !== undefined) payload.anniversary = details.anniversary.getTime();
    if (details.meetStory) payload.meetStory = details.meetStory;

    await updateDoc(coupleDocRef, payload);
  },

  addSpecialDate: async (coupleId: string, name: string, date: number, recurring: boolean) => {
    if (!coupleId) throw new Error("Couple ID is required.");
    if (!name) throw new Error("Special date name is required.");
    if (!date) throw new Error("Special date date is required.");

    const coupleDocRef = doc(db, 'couples', coupleId);
    
    const newSpecialDate: SpecialDate = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name,
      date,
      recurring,
    };

    await updateDoc(coupleDocRef, {
      specialDates: arrayUnion(newSpecialDate),
      updatedAt: Date.now(),
    });
    return newSpecialDate;
  },

  updateSpecialDate: async (coupleId: string, updatedDate: SpecialDate) => {
    if (!coupleId) throw new Error("Couple ID is required.");
    const coupleDocRef = doc(db, 'couples', coupleId);
    const coupleDoc = await getDoc(coupleDocRef);

    if (coupleDoc.exists()) {
      if (updatedDate.id === 'anniversary') {
        // Handle anniversary update separately
        await updateDoc(coupleDocRef, {
          anniversary: updatedDate.date,
          updatedAt: Date.now(),
        });
        return; // Exit function after updating anniversary
      }

      const coupleData = coupleDoc.data();
      const specialDates = coupleData.specialDates || [];
      const dateIndex = specialDates.findIndex((d: SpecialDate) => d.id === updatedDate.id);
      
      if (dateIndex > -1) {
        specialDates[dateIndex] = updatedDate;
        await updateDoc(coupleDocRef, { specialDates, updatedAt: Date.now() });
      } else {
        throw new Error("Special date not found.");
      }
    } else {
      throw new Error("Couple not found.");
    }
  },

  deleteSpecialDate: async (coupleId: string, dateId: string) => {
    if (!coupleId) throw new Error("Couple ID is required.");
    
    if (dateId === 'anniversary') {
      // Anniversaries cannot be deleted this way
      throw new Error("Anniversary cannot be deleted directly.");
    }

    const coupleDocRef = doc(db, 'couples', coupleId);
    const coupleDoc = await getDoc(coupleDocRef);

    if (coupleDoc.exists()) {
      const coupleData = coupleDoc.data();
      const specialDates = coupleData.specialDates || [];
      const updatedDates = specialDates.filter((d: SpecialDate) => d.id !== dateId);
      
      await updateDoc(coupleDocRef, { specialDates: updatedDates, updatedAt: Date.now() });
    } else {
      throw new Error("Couple not found.");
    }
  },
};

