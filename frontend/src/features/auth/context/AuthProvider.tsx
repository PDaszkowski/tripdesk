import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthContextValue, AuthUser } from '../types'
import { tokenStorage } from '@/shared/api/tokenStorage'
import { AuthContext } from './auth-context'

const USER_KEY = 'tripdesk_auth_user'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (typeof parsed?.email !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (!tokenStorage.getAccessToken()) return null
    return readStoredUser()
  })

  const setSessionUser = useCallback((next: AuthUser | null) => {
    setUser(next)
    persistUser(next)
  }, [])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === USER_KEY && e.newValue === null) {
        setUser(null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      setSessionUser,
    }),
    [user, setSessionUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
