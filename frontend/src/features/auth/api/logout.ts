import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { tokenStorage } from '@/shared/api/tokenStorage'
import { useAuth } from '../context/useAuth'

export async function logoutUser(): Promise<void> {
  await httpClient.post('api/auth/logout')
}

export function useLogoutMutation() {
  const { setSessionUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      tokenStorage.clear()
      setSessionUser(null)
      queryClient.clear()
    },
  })
}
