import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Couple } from '../types/couple'
import type { User } from '../types/user'

interface AuthContextType {
  user: User | null
  couple: Couple | null
  partner: User | null; // Add partner to context
  loading: boolean
  setUser: (user: User | null) => void;
  setCouple: (couple: Couple | null) => void;
  setPartner: (partner: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
