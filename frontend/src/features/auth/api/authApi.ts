import { httpClient } from '../../../shared/api/httpClient'
import type { AuthUser, LoginCredentials, RegisterPayload } from '../types'

function mapToAuthUser(data: Record<string, unknown>): AuthUser {
  return {
    id: Number(data.id),
    email: String(data.email ?? ''),
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    phoneNumber: String(data.phoneNumber ?? ''),
    role: String(data.role ?? 'CLIENT') as AuthUser['role'],
  }
}

export async function registerUser(payload: RegisterPayload): Promise<string> {
  const { data } = await httpClient.post<string>('/api/register', payload)
  return typeof data === 'string' ? data : String(data)
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
  const { data } = await httpClient.post<Record<string, unknown>>(
    '/api/login',
    credentials,
  )
  return mapToAuthUser(data)
}
