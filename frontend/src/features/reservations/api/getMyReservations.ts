import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { Reservation } from '../types'

export async function getMyReservations(): Promise<Reservation[]> {
  return httpClient.get('api/reservations/my').json<Reservation[]>()
}

export function useMyReservations() {
  return useQuery({
    queryKey: ['reservations', 'my'],
    queryFn: getMyReservations,
  })
}
