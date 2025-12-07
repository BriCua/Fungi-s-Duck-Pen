import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { User, Couple } from '../types'

interface AuthContextType {
  user: User | null
  couple: Couple | null
  loading: boolean
  setUser: (user: User | null) => void;
  setCouple: (couple: Couple | null) => void;
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
