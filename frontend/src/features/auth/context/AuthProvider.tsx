import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser, AuthContextValue, LoginCredentials } from '../types'
import { loginUser } from '../api/authApi'
import { AuthContext } from './auth-context'

const STORAGE_KEY = 'tripdesk_auth_user'

function readStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (typeof parsed?.id !== 'number' || typeof parsed.email !== 'string') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const setSessionUser = useCallback((next: AuthUser | null) => {
    setUser(next)
    persistUser(next)
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const nextUser = await loginUser(credentials)
      setSessionUser(nextUser)
    },
    [setSessionUser],
  )

  const logout = useCallback(() => {
    setSessionUser(null)
  }, [setSessionUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
      setSessionUser,
    }),
    [user, login, logout, setSessionUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
