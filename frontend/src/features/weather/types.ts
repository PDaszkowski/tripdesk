export interface DayWeather {
  date: string
  maxTemp: number
  minTemp: number
  precipitation: number
  weatherCode: number
  label: string
}

export interface WeatherResult {
  isHistorical: boolean
  resolvedCity: string
  days: DayWeather[]
}

/* Surowe kształty odpowiedzi Open-Meteo */

export interface GeocodingResult {
  latitude: number
  longitude: number
  name: string
  country: string
}

export interface GeocodingResponse {
  results?: GeocodingResult[]
}

export interface DailyForecast {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  weather_code: number[]
}

export interface ForecastResponse {
  daily?: DailyForecast
}
