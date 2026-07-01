import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTrips } from '@/features/trips/api/getTrips'
import { TripCard } from '@/features/trips/components/TripCard'
import { Spinner } from '@/shared/ui/Spinner'

export function TripsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const countryFilter = searchParams.get('country') ?? undefined

  const { data, isPending, isError } = useTrips(countryFilter)

  if (isPending) {
    return <Spinner label="Pobieranie ofert…" />
  }

  const trips = data ?? []

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Karty <span className="text-sky-500">podróży</span>
          </h1>
          {countryFilter && (
            <p className="mt-2 font-medium text-slate-500">
              Wyniki dla:{' '}
              <span className="rounded-full border border-sky-100 bg-sky-100 px-3 py-1 text-sky-500">
                {countryFilter}
              </span>
            </p>
          )}
        </div>
        {countryFilter && (
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="text-sm font-semibold text-slate-500 transition-colors hover:text-sky-500"
          >
            Usuń filtry ×
          </button>
        )}
      </header>

      {isError && (
        <div className="rounded-xl border border-red-500 bg-red-100 px-6 py-4 text-sm text-red-600">
          Nie udało się załadować ofert. Spróbuj ponownie.
        </div>
      )}

      {!isError && trips.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center">
          <p className="text-lg font-medium text-slate-500 italic">
            {countryFilter
              ? `Brak ofert dla regionu: ${countryFilter}`
              : 'Brak dostępnych ofert.'}
          </p>
        </div>
      )}

      {trips.length > 0 && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
