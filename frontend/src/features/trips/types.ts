export interface Trip {
  id: number
  originCode: string
  destinationCode: string
  destinationCity: string
  departureTime: string
  arrivalTime: string
  outboundDuration: string
  price: number
  imageUrl: string
  description: string
  hotelName: string
  attractions: string
  maxPeople: number
  returnDepartureTime: string
  durationDays: number
  boardBasis: string
  hasParking: boolean
  flightPrice: number
  hotelPrice: number
  attractionImageUrls: string[]
  stopOverInfo?: string
}
