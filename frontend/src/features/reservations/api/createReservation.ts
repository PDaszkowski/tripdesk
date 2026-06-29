import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type {
  CreateReservationPayload,
  CreateReservationResponse,
} from '../types'

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<CreateReservationResponse> {
  return httpClient
    .post('api/reservations', { json: payload })
    .json<CreateReservationResponse>()
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: createReservation,
  })
}
