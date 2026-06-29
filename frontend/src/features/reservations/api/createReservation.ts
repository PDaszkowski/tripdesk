import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import { endpoints } from '@/shared/api/endpoints'
import type {
  CreateReservationPayload,
  CreateReservationResponse,
} from '../types'

export async function createReservation(
  payload: CreateReservationPayload,
): Promise<CreateReservationResponse> {
  return httpClient
    .post(endpoints.reservations.create, { json: payload })
    .json<CreateReservationResponse>()
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: createReservation,
  })
}
