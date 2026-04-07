// ============================================================
//  src/context/AuthContext.jsx
//  Global auth state — wraps entire app
//  Provides: user, profile, all auth methods
// ============================================================
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null)
  const [profile,     setProfile]     = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError,   setAuthError]   = useState(null)

  // ── Fetch profile from DB ──────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      return data
    } catch (err) {
      console.error('fetchProfile error:', err.message)
      return null
    }
  }, [])

  // ── Bootstrap session on page load ────────────────────
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          const prof = await fetchProfile(session.user.id)
          if (mounted) setProfile(prof)
        }
      } catch (err) {
        console.error('Session init error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user)
          const prof = await fetchProfile(session.user.id)
          if (mounted) setProfile(prof)
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
        if (event === 'USER_UPDATED') {
          setUser(session?.user || null)
        }
      }
    )
    return () => { mounted = false; subscription.unsubscribe() }
  }, [fetchProfile])

  // ── SIGN UP ────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, fullName, role }) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName?.trim(), role: role || 'renter' },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error

      // Update profile with role + name immediately
      if (data.user) {
        await supabase.from('profiles').upsert({
          id:        data.user.id,
          full_name: fullName?.trim(),
          role:      role || 'renter',
          updated_at: new Date().toISOString(),
        })
      }

      const needsConfirmation = !data.user?.email_confirmed_at
      return { success: true, needsConfirmation, user: data.user }
    } catch (err) {
      const msg = friendlyError(err.message)
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── SIGN IN ────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (err) {
      const msg = friendlyError(err.message)
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── SIGN IN WITH GOOGLE ────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err) {
      const msg = friendlyError(err.message)
      setAuthError(msg)
      setAuthLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  // ── SIGN OUT ───────────────────────────────────────────
  const signOut = useCallback(async () => {
    setAuthLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── FORGOT PASSWORD ────────────────────────────────────
  const sendPasswordReset = useCallback(async (email) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      )
      if (error) throw error
      return { success: true }
    } catch (err) {
      const msg = friendlyError(err.message)
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── UPDATE PASSWORD ────────────────────────────────────
  const updatePassword = useCallback(async (newPassword) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      return { success: true }
    } catch (err) {
      const msg = friendlyError(err.message)
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // ── UPDATE PROFILE ─────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)
      return { success: true, profile: data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [user])

  // ── COMPLETE ONBOARDING ────────────────────────────────
  const completeOnboarding = useCallback(async (onboardingData) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    try {
      const updates = {
        ...onboardingData,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      }
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)
      return { success: true, profile: data }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [user])

  // ── REFRESH PROFILE ────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!user) return null
    const prof = await fetchProfile(user.id)
    setProfile(prof)
    return prof
  }, [user, fetchProfile])

  const clearError = useCallback(() => setAuthError(null), [])

  // ── Computed ───────────────────────────────────────────
  const isAuthenticated    = !!user
  const isLandlord         = profile?.role === 'landlord'
  const isRenter           = profile?.role === 'renter' || (!profile?.role && !!user)
  const isAdmin            = profile?.role === 'admin'
  const incomeVerified     = profile?.income_verified === 'verified'
  const onboardingComplete = profile?.onboarding_complete === true

  return (
    <AuthContext.Provider value={{
      user, profile, loading, authLoading, authError,
      isAuthenticated, isLandlord, isRenter, isAdmin,
      incomeVerified, onboardingComplete,
      signUp, signIn, signInWithGoogle, signOut,
      sendPasswordReset, updatePassword,
      updateProfile, completeOnboarding, refreshProfile,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ── Friendly error messages ────────────────────────────
function friendlyError(message = '') {
  const map = {
    'Invalid login credentials':     'Incorrect email or password.',
    'Email not confirmed':           'Please confirm your email first. Check your inbox.',
    'User already registered':       'An account with this email already exists.',
    'Password should be at least 6': 'Password must be at least 8 characters.',
    'Unable to validate email':      'Please enter a valid email address.',
    'Email rate limit exceeded':     'Too many attempts. Wait a few minutes.',
    'Auth session missing':          'Session expired. Please sign in again.',
    'signup_disabled':               'Sign ups are temporarily disabled.',
  }
  for (const [key, val] of Object.entries(map)) {
    if (message.includes(key)) return val
  }
  return message || 'Something went wrong. Please try again.'
}
