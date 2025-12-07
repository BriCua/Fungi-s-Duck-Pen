import { useEffect, useState } from 'react';
import { authService } from '../firebase/authService';
import { coupleService } from '../firebase/coupleService';
import type { User, Couple } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/init';

interface AuthContextType {
  user: User | null;
  couple: Couple | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setCouple: (couple: Couple | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

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
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch couple data whenever the user object changes
  useEffect(() => {
    const fetchCouple = async () => {
      if (user?.coupleId) {
        const coupleData = await coupleService.getCoupleData(user.coupleId);
        setCouple(coupleData as Couple | null);
      } else {
        setCouple(null);
      }
    };

    if (user) {
      fetchCouple();
    }
  }, [user]);

  return {
    user,
    couple,
    loading,
    setUser,
    setCouple,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut,
  };
};
