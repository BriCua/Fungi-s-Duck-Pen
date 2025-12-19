import { auth } from './init'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { db } from './init'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import type { User } from '../types/user'; // Import User type

export const authService = {
  // Sign up with email/password
  async signUp(email: string, password: string, displayName: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  },

  // Sign in with email/password
  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password)
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Create user profile if new
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    await signOut(auth)
  },

  // Listen to auth state
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  },

  // Get user profile by UID
  async getUserProfile(uid: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(uid: string, displayName: string, birthdate: Date | undefined): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== uid) {
      throw new Error("User not authenticated or UID mismatch.");
    }

    // 1. Update Firebase Auth profile
    await updateProfile(currentUser, { displayName });

    // 2. Update Firestore document (only update birthdate if provided)
    const userDocRef = doc(db, 'users', uid);
    const updatePayload: { [key: string]: any } = {
      displayName,
      updatedAt: Date.now(),
    };
    if (birthdate !== undefined) {
      updatePayload.birthdate = birthdate.getTime(); // Store as timestamp
    }
    await updateDoc(userDocRef, updatePayload);
  },
}

