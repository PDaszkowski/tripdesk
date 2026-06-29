import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { endpoints } from '@/shared/api/endpoints'
import { tokenStorage } from '@/shared/api/tokenStorage'
import { useAuth } from '../context/useAuth'
import type { AuthResponse, LoginCredentials } from '../types'

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  return httpClient
    .post(endpoints.auth.login, { json: credentials })
    .json<AuthResponse>()
}

export function useLoginMutation() {
  const { setSessionUser } = useAuth()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken)
      setSessionUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })
    },
  })
}
