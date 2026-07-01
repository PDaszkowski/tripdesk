import ky from 'ky'
import { useQuery } from '@tanstack/react-query'
import type {
  DayWeather,
  ForecastResponse,
  GeocodingResponse,
  WeatherResult,
} from '../types'

// Zewnętrzne API Open-Meteo (NIE nasz backend - bez httpClient/Bearera).
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive'
const DAILY_METRICS =
  'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code'
const FORECAST_HORIZON_DAYS = 16

function toDateStr(iso: string): string {
  return iso.split('T')[0]
}

function shiftDateByYear(date: string, years: number): string {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d.toISOString().split('T')[0]
}

function daysBetweenNowAnd(iso: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(iso.split('T')[0])
  return Math.round((target.getTime() - now.getTime()) / 86_400_000)
}

function buildTripDates(depDate: string, retDate: string): string[] {
  const dates: string[] = []
  const cur = new Date(depDate)
  const end = new Date(retDate)
  while (cur <= end) {
    dates.push(cur.toISOString().split('T')[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export async function fetchWeather(
  city: string,
  departureTime: string,
  returnTime: string,
): Promise<WeatherResult> {
  const geo = await ky
    .get(GEOCODING_URL, {
      searchParams: { name: city, count: 1, language: 'pl', format: 'json' },
    })
    .json<GeocodingResponse>()

  const place = geo.results?.[0]
  if (!place) throw new Error('Nie znaleziono miasta')

  const resolvedCity = `${place.name}, ${place.country}`
  const depDate = toDateStr(departureTime)
  const retDate = toDateStr(returnTime)

  const isHistorical = daysBetweenNowAnd(departureTime) > FORECAST_HORIZON_DAYS

  const data = await ky
    .get(isHistorical ? ARCHIVE_URL : FORECAST_URL, {
      searchParams: {
        latitude: place.latitude,
        longitude: place.longitude,
        daily: DAILY_METRICS,
        timezone: 'auto',
        ...(isHistorical
          ? {
              start_date: shiftDateByYear(depDate, -1),
              end_date: shiftDateByYear(retDate, -1),
            }
          : { forecast_days: FORECAST_HORIZON_DAYS }),
      },
    })
    .json<ForecastResponse>()

  const daily = data.daily
  if (!daily?.time) throw new Error('Brak danych pogodowych')

  const metricsByDate = new Map<string, Omit<DayWeather, 'date' | 'label'>>()
  daily.time.forEach((date, i) => {
    metricsByDate.set(date, {
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      precipitation: Math.round(daily.precipitation_sum[i] * 10) / 10,
      weatherCode: daily.weather_code[i],
    })
  })

  const tripDates = buildTripDates(depDate, retDate)
  const days: DayWeather[] = tripDates.map((tripDate, idx) => {
    const apiDate = isHistorical ? shiftDateByYear(tripDate, -1) : tripDate
    const metrics = metricsByDate.get(apiDate)

    let label: string
    if (tripDate === depDate) label = '✈️ Wylot'
    else if (tripDate === retDate) label = '🔙 Powrót'
    else label = `Dzień ${idx + 1}`

    return {
      date: tripDate,
      maxTemp: metrics?.maxTemp ?? 0,
      minTemp: metrics?.minTemp ?? 0,
      precipitation: metrics?.precipitation ?? 0,
      weatherCode: metrics?.weatherCode ?? 0,
      label,
    }
  })

  return { isHistorical, resolvedCity, days }
}

export function useWeather(
  city: string,
  departureTime: string,
  returnTime: string,
) {
  return useQuery({
    queryKey: ['weather', city, departureTime, returnTime],
    queryFn: () => fetchWeather(city, departureTime, returnTime),
    enabled: Boolean(city && departureTime && returnTime),
    staleTime: 1000 * 60 * 30,
  })
}
