import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { endpoints } from '@/shared/api/endpoints'
import type { Trip } from '../types'

export async function getTrip(id: string | number): Promise<Trip> {
  return httpClient.get(endpoints.trips.detail(id)).json<Trip>()
}

export function useTrip(id: string | undefined) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => getTrip(id as string),
    enabled: Boolean(id),
  })
}
