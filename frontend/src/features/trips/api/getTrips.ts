import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { Trip } from '../types'

export async function getTrips(country?: string): Promise<Trip[]> {
  return httpClient
    .get('api/trips', country ? { searchParams: { country } } : undefined)
    .json<Trip[]>()
}

export function useTrips(country?: string) {
  return useQuery({
    queryKey: ['trips', country ?? null],
    queryFn: () => getTrips(country),
  })
}
