import { auth } from './init'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { db } from './init'
import { doc, setDoc, getDoc } from 'firebase/firestore'

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
}
