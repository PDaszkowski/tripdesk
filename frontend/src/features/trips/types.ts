export type TripStatus = 'upcoming' | 'ongoing' | 'completed'

export interface Trip {
  id: string
  destination: string
  country: string
  startDate: string // ISO format YYYY-MM-DD
  endDate: string
  hotelName: string
  flightNumber: string
  status: TripStatus
}
