import { useWeather } from '../api/getWeather'
import { weatherEmoji, weatherLabel } from '../lib/weatherCodes'
import type { DayWeather } from '../types'

interface WeatherWidgetProps {
  city: string
  departureTime: string
  returnTime: string
}

function formatDatePL(date: string): string {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
  })
}

export function WeatherWidget({
  city,
  departureTime,
  returnTime,
}: WeatherWidgetProps) {
  const { data, isPending, isError } = useWeather(city, departureTime, returnTime)

  if (isPending) {
    return (
      <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Ładowanie pogody…
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        🌐 Pogoda niedostępna
      </div>
    )
  }

  const { isHistorical, resolvedCity, days } = data

  const visibleDays =
    days.length > 7 ? [days[0], ...days.slice(1, -1), days[days.length - 1]] : days

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-linear-to-r from-sky-500 to-teal-500 px-6 py-4 text-white">
        <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">
          {isHistorical ? 'Przewidywana pogoda w tym okresie' : 'Prognoza pogody'}
        </div>
        <div className="text-sm font-bold">{resolvedCity}</div>
      </div>

      <div className="divide-y divide-slate-100">
        {visibleDays.map((day) => (
          <WeatherDayRow key={day.date} day={day} formatDate={formatDatePL} />
        ))}
      </div>

      <div className="bg-slate-50 px-6 py-3 text-center text-[10px] text-slate-500">
        Open-Meteo {isHistorical ? 'ERA5' : 'Forecast'}
      </div>
    </div>
  )
}

interface WeatherDayRowProps {
  day: DayWeather
  formatDate: (date: string) => string
}

function WeatherDayRow({ day, formatDate }: WeatherDayRowProps) {
  const isKey = day.label.includes('Wylot') || day.label.includes('Powrót')

  return (
    <div
      className={`flex items-center gap-4 px-6 py-3 ${isKey ? 'bg-sky-100' : ''}`}
    >
      <div className="w-32 shrink-0">
        <div
          className={`text-xs font-bold ${isKey ? 'text-sky-500' : 'text-slate-600'}`}
        >
          {day.label}
        </div>
        <div className="text-[10px] text-slate-500">{formatDate(day.date)}</div>
      </div>

      <div className="w-8 text-center text-2xl">
        {weatherEmoji(day.weatherCode)}
      </div>

      <div className="flex-1">
        <div className="text-xs text-slate-500">
          {weatherLabel(day.weatherCode)}
        </div>
        {day.precipitation > 0 && (
          <div className="text-[10px] text-sky-500">💧 {day.precipitation} mm</div>
        )}
      </div>

      <div className="text-right">
        <div className="text-sm font-bold text-slate-900">{day.maxTemp}°</div>
        <div className="text-xs text-slate-500">{day.minTemp}°</div>
      </div>
    </div>
  )
}
