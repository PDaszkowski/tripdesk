import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { endpoints } from '@/shared/api/endpoints'
import type { Reservation } from '../types'

export async function getMyReservations(): Promise<Reservation[]> {
  return httpClient.get(endpoints.reservations.mine).json<Reservation[]>()
}

export function useMyReservations() {
  return useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: getMyReservations,
  })
}
