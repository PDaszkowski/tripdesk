/** Role values accepted by POST /api/register */
export type RegisterRole = 'CLIENT' | 'AGENT' | 'ADMIN'

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: RegisterRole
  agencyName: string
  agencyNip: string
  passportNumber: string
  passportExpiry: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/** Safe user snapshot for UI (no password). */
export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: RegisterRole
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setSessionUser: (user: AuthUser | null) => void
}
