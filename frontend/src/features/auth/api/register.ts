import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { RegisterPayload } from '../types'

/** Backend zwraca plain text body (np. "User x@y.com registered..."), nie JSON. */
export async function registerUser(payload: RegisterPayload): Promise<string> {
  return httpClient.post('api/auth/register', { json: payload }).text()
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  })
}
