import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrip } from '@/features/trips/api/getTrip'
import { WeatherWidget } from '@/features/weather/WeatherWidget_OpenMeteo'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

export function TripDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: trip, isPending, isError } = useTrip(id)

  const [peopleCount, setPeopleCount] = useState(1)

  if (isPending) {
    return <Spinner label="Pobieranie szczegółów…" />
  }

  if (isError || !trip) {
    return (
      <div className="p-20 text-center text-2xl font-bold text-red-600">
        Nie udało się załadować wycieczki.
      </div>
    )
  }

  const attractionNames = trip.attractions.split(',').map((s) => s.trim())
  const totalFlightPrice = (trip.flightPrice * peopleCount).toFixed(2)
  const totalHotelPrice = (trip.hotelPrice * peopleCount).toFixed(2)
  const totalPrice = (trip.price * peopleCount).toFixed(2)

  return (
    <div className="-m-6 min-h-screen bg-white md:-m-8">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={trip.imageUrl}
          className="h-full w-full object-cover"
          alt={trip.destinationCity}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-black/20" />

        <div className="absolute right-8 bottom-12 left-8 text-white md:right-16 md:left-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold shadow-lg backdrop-blur-xl transition-all hover:bg-white/20"
          >
            <span className="text-xl">←</span> Wróć do ofert
          </button>

          <h1 className="mb-2 text-6xl font-bold tracking-tight text-white uppercase drop-shadow-lg md:text-7xl">
            {trip.destinationCity}
          </h1>
          <p className="text-2xl font-medium text-sky-400 drop-shadow md:text-3xl">
            {trip.hotelName}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-16 lg:grid-cols-3">
        <div className="space-y-16 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoBox label="Czas trwania" value={`${trip.durationDays} dni`} />
            <InfoBox label="Wyżywienie" value={trip.boardBasis} />
            <InfoBox
              label="Parking"
              value={trip.hasParking ? 'Dostępny' : 'Brak'}
            />
            <InfoBox label="Dostępność" value={`Do ${trip.maxPeople} os.`} />
          </div>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-slate-900">O podróży</h2>
            <p className="text-lg leading-relaxed font-light text-slate-600">
              {trip.description}
            </p>
          </section>

          <section>
            <h2 className="mb-8 flex items-center gap-4 text-3xl font-bold text-slate-900">
              Program i atrakcje
              <span className="h-px flex-1 bg-slate-200" />
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {trip.attractionImageUrls?.length > 0 ? (
                trip.attractionImageUrls.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative h-64 overflow-hidden rounded-3xl border-4 border-white shadow-md transition-all hover:shadow-xl"
                  >
                    <img
                      src={img}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={attractionNames[idx] || 'Atrakcja'}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <p className="text-xl font-bold tracking-tight text-white uppercase">
                        {attractionNames[idx] || 'Lokalna atrakcja'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">
                    Zdjęcia atrakcji wkrótce…
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="relative space-y-6">
          <WeatherWidget
            city={trip.destinationCity}
            departureTime={trip.departureTime}
            returnTime={trip.returnDepartureTime}
          />

          <div className="sticky top-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl">
            <div className="mb-8 flex items-start justify-between">
              <h3 className="text-2xl font-bold text-white">Podsumowanie</h3>
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                  Cena za os.
                </p>
                <p className="text-lg font-bold">{trip.price} PLN</p>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
              <p className="mb-4 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
                Wybierz liczbę osób
              </p>
              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 p-2">
                <button
                  type="button"
                  onClick={() => setPeopleCount((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-xl font-bold transition-colors hover:bg-sky-500"
                >
                  −
                </button>
                <span className="text-2xl font-bold">{peopleCount}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPeopleCount((p) => Math.min(trip.maxPeople, p + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-xl font-bold transition-colors hover:bg-sky-500"
                >
                  +
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] text-slate-500 italic">
                Maksymalna liczba osób w tym pakiecie: {trip.maxPeople}
              </p>
            </div>

            <div className="mb-10 space-y-6">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-sm font-medium">
                  Bilety lotnicze (x{peopleCount})
                </span>
                <span className="font-bold text-white">
                  {totalFlightPrice} PLN
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-sm font-medium">
                  Zakwaterowanie (x{peopleCount})
                </span>
                <span className="font-bold text-white">
                  {totalHotelPrice} PLN
                </span>
              </div>

              <div className="my-4 h-px bg-slate-800" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                    Suma do zapłaty
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {totalPrice}{' '}
                    <span className="text-sm font-normal text-slate-400">
                      PLN
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(`/book/${trip.id}?people=${peopleCount}`)}
              className="py-4 text-base font-semibold tracking-widest uppercase"
            >
              Zarezerwuj dla {peopleCount}{' '}
              {peopleCount === 1 ? 'osoby' : 'osób'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
