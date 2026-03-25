'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from './supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string }) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  configured: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.' }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name ?? '' } },
    })

    if (error) return { error: error.message }

    // If there's data in localStorage, we can optionally sync it here in future
    return { error: null }
  }

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.' }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: { name?: string }): Promise<{ error: string | null }> => {
    if (!supabase || !user) return { error: 'Not signed in.' }

    const { error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) return { error: error.message }
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      configured: supabaseConfigured,
      signUp,
      signIn,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
