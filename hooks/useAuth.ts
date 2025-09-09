'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export type AuthUser = {
  id: string
  email?: string | null
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const init = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null)
      setLoading(false)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      throw error
    }
    const uid = data.user?.id
    if (uid && fullName) {
      await supabase.from('profiles').upsert({ uid, full_name: fullName }).select()
    }
    return data
  }, [])

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      throw error
    }
    return data
  }, [])

  const signInWithMagicLink = useCallback(async (email: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setError(error.message)
      throw error
    }
    return data
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
      throw error
    }
  }, [])

  return { user, loading, error, signUp, signInWithPassword, signInWithMagicLink, signOut }
}
