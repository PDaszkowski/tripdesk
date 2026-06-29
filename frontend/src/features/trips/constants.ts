/** Zdjęcie zastępcze, gdy oferta nie ma własnego obrazka. */
export const TRIP_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500673922987-e212871fec22'

/**
 * Promowane kierunki na dashboardzie.
 * TODO: zastąpić danymi z backendu (GET /api/destinations), gdy będzie dostępny.
 */
export const FEATURED_DESTINATIONS = [
  {
    name: 'Hiszpania',
    code: 'ES',
    img: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1170&auto=format&fit=crop',
  },
  {
    name: 'Turcja',
    code: 'TR',
    img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
  },
  {
    name: 'Egipt',
    code: 'EG',
    img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368',
  },
  {
    name: 'Grecja',
    code: 'GR',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077',
  },
] as const
