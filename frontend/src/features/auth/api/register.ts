import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { endpoints } from '@/shared/api/endpoints'
import type { RegisterPayload } from '../types'

export async function registerUser(payload: RegisterPayload): Promise<string> {
  return httpClient.post(endpoints.auth.register, { json: payload }).text()
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  })
}
