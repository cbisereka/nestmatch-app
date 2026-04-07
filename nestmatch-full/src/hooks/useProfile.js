// ============================================================
//  src/hooks/useProfile.js
//  Hook for reading and updating the current user's profile
// ============================================================
import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)

  const saveProfile = useCallback(async (updates) => {
    setSaving(true)
    setError(null)
    try {
      const result = await updateProfile(updates)
      if (!result.success) throw new Error(result.error)
      return result
    } catch (err) {
      setError(err.message)
      return { success:false, error:err.message }
    } finally {
      setSaving(false)
    }
  }, [updateProfile])

  const uploadAvatar = useCallback(async (file) => {
    if (!user) return { success:false, error:'Not authenticated' }
    setSaving(true)
    setError(null)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert:true })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      const result = await updateProfile({ avatar_url: publicUrl })
      return result
    } catch (err) {
      setError(err.message)
      return { success:false, error:err.message }
    } finally {
      setSaving(false)
    }
  }, [user, updateProfile])

  return { profile, saving, error, saveProfile, uploadAvatar, refreshProfile }
}
