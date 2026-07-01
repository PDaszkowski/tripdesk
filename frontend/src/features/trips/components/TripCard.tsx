import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { TRIP_FALLBACK_IMAGE } from '../constants'
import type { Trip } from '../types'

interface TripCardProps {
  trip: Trip
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate()

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-xl">
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={trip.imageUrl || TRIP_FALLBACK_IMAGE}
          alt={trip.destinationCity}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

        <div className="absolute top-6 right-6 left-6 flex items-start justify-between text-white">
          <div className="rounded-xl border border-white/30 bg-white/20 px-4 py-2 shadow-md backdrop-blur-md">
            <p className="text-2xl font-bold">
              {trip.price} <span className="text-sm opacity-80">PLN</span>
            </p>
          </div>
          <div className="rounded-full bg-sky-500 px-4 py-1.5 text-[10px] font-bold tracking-tight text-white uppercase shadow-md">
            max {trip.maxPeople} os.
          </div>
        </div>

        <div className="absolute bottom-6 left-6">
          <h2 className="mb-1 text-5xl font-bold tracking-tight text-white uppercase">
            {trip.destinationCity}
          </h2>
          <p className="text-base font-semibold tracking-widest text-sky-300 uppercase">
            {trip.hotelName}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex min-w-[90px] flex-col items-start">
            <p className="mb-1 text-[10px] font-bold text-sky-500 uppercase">
              Wylot
            </p>
            <p className="text-3xl font-bold text-slate-900">{trip.originCode}</p>
            <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 shadow-sm">
              {formatDateTime(trip.departureTime)}
            </p>
          </div>

          <div className="relative flex flex-1 flex-col items-center px-4">
            <span className="mb-3 rounded-full bg-slate-200 px-3 py-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {trip.outboundDuration}
            </span>
            <div className="flex w-full items-center">
              <div className="h-[2px] flex-1 bg-slate-300" />
              <div className="mx-3 rotate-45 text-2xl text-sky-500">✈</div>
              <div className="h-[2px] flex-1 bg-slate-300" />
            </div>
            {trip.stopOverInfo && (
              <p className="absolute -bottom-6 rounded border border-red-100 bg-red-100 px-2 py-0.5 text-[9px] font-semibold whitespace-nowrap text-red-600">
                ⚠ {trip.stopOverInfo}
              </p>
            )}
          </div>

          <div className="flex min-w-[90px] flex-col items-end">
            <p className="mb-1 text-[10px] font-bold text-sky-500 uppercase">
              Przylot
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {trip.destinationCode}
            </p>
            <p className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 shadow-sm">
              {formatDateTime(trip.arrivalTime)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-sky-100 bg-sky-100/40 p-5">
            <h3 className="mb-3 border-b border-sky-100 pb-1 text-[11px] font-bold tracking-widest text-sky-500 uppercase">
              O podróży
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
              {trip.description}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 border-b border-slate-200 pb-1 text-[11px] font-bold tracking-widest text-slate-900 uppercase">
              Lokalne atrakcje
            </h3>
            <p className="line-clamp-3 text-sm font-semibold leading-snug text-slate-800 italic">
              {trip.attractions}
            </p>
          </div>
        </div>

        {trip.attractionImageUrls?.length > 0 && (
          <div className="flex h-16 gap-2 overflow-hidden rounded-xl">
            {trip.attractionImageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="atrakcja"
                className="w-1/4 cursor-pointer object-cover transition-transform duration-500 hover:scale-110"
              />
            ))}
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="py-4 text-base font-semibold tracking-wide uppercase"
        >
          Zobacz szczegóły i rezerwuj
        </Button>
      </div>
    </article>
  )
}
