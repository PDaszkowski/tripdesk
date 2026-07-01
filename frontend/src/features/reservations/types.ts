export type ReservationStatus = 'NEW' | 'PENDING' | 'PAID' | 'CANCELLED'

export interface ReservationTrip {
  id: number
  destinationCity: string
  hotelName: string
  imageUrl: string
  country: string
  departureTime: string
  returnDepartureTime: string
}

export interface Reservation {
  id: number
  status: ReservationStatus | string
  numberOfPeople: number
  totalPrice: number
  createdAt: string
  contactName: string
  contactEmail: string
  contactPhone: string
  participants: string[]
  trip: ReservationTrip
}

export interface CreateReservationPayload {
  tripId: number
  numberOfPeople: number
  contactName: string
  contactEmail: string
  contactPhone: string
  participants: string[]
}

export interface CreateReservationResponse {
  checkoutUrl?: string
}
