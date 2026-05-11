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

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  email: string
  firstName: string
  lastName: string
  role: RegisterRole
}

export interface AuthUser {
  email: string
  firstName: string
  lastName: string
  role: RegisterRole
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  setSessionUser: (user: AuthUser | null) => void
}
