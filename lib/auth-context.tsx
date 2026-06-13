'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type User } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setUser(null)
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        await loadUserProfile(authUser.id)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      console.log('Loading profile for user:', userId)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)

      if (error) {
        console.error('Error loading profile:', error.message, error.details)
        return
      }

      if (data && data.length > 0) {
        console.log('Profile loaded:', data[0])
        setUser(data[0])
      } else {
        console.warn('No user profile found for ID:', userId)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  async function signUp(email: string, password: string, name: string) {
    try {
      // 1. Crear cuenta de auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (signUpData.user) {
        console.log('Auth user created:', signUpData.user.id)

        // 2. Crear perfil de usuario
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: signUpData.user.id,
              email,
              name,
              avatar_url: '👤',
            },
          ])

        if (profileError) {
          console.error('Profile insert error:', profileError.message, profileError.details)
          throw profileError
        }
        console.log('Profile inserted successfully')

        // 3. Loguear automáticamente (sin esperar confirmación de email)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          console.warn('Auto sign-in failed, but account was created:', signInError)
        } else {
          console.log('User auto-signed in')
          await loadUserProfile(signUpData.user.id)
        }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
