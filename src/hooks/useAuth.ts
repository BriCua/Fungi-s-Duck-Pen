import { useEffect, useState } from 'react';
import { authService } from '../firebase/authService';
import { coupleService } from '../firebase/coupleService';
import type { Couple } from '../types/couple';
import type { User } from '../types/user';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/init';

interface AuthContextType {
  user: User | null;
  couple: Couple | null;
  partner: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setCouple: (couple: Couple | null) => void;
  setPartner: (partner: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setCouple(null);
    setPartner(null);
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // This case handles a newly signed-in user whose doc might not be created yet.
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setUser(newUser);
        }
      } else {
        // On logout, handleSignOut is not strictly needed if we just clear state
        setUser(null);
        setCouple(null);
        setPartner(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch couple and partner data whenever the user object changes
  useEffect(() => {
    const fetchCoupleAndPartner = async () => {
      if (user?.coupleId) {
        const coupleData = await coupleService.getCoupleData(user.coupleId);
        setCouple(coupleData as Couple | null);

        // Now fetch partner data
        if (coupleData && coupleData.userIds) {
          const partnerId = coupleData.userIds.find((id) => id !== user.uid);
          if (partnerId) {
            const partnerData = await authService.getUserProfile(partnerId);
            setPartner(partnerData);
          } else {
            setPartner(null); // If partner ID not found
          }
        }
      } else {
        setCouple(null);
        setPartner(null);
      }
    };

    if (user) {
      fetchCoupleAndPartner();
    }
  }, [user]);

  return {
    user,
    couple,
    partner,
    loading,
    setUser,
    setCouple,
    setPartner,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: handleSignOut,
  };
};
