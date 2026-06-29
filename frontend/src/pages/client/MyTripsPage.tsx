import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMyReservations } from '@/features/reservations/api/getMyReservations'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Opłacona', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  PENDING: {
    label: 'Oczekująca',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  NEW: { label: 'Nowa', color: 'bg-sky-100 text-sky-600 border-sky-200' },
  CANCELLED: {
    label: 'Anulowana',
    color: 'bg-red-100 text-red-600 border-red-200',
  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function MyTripsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentSuccess = searchParams.get('payment_success') === 'true'

  const { data, isPending, isError } = useMyReservations()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isPending) {
    return <Spinner label="Ładowanie podróży…" />
  }

  const reservations = data ?? []

  return (
    <div className="mx-auto w-full max-w-5xl">
      {paymentSuccess && (
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-teal-200 bg-teal-100 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100">
            <svg
              className="h-6 w-6 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-teal-700">
              Płatność zakończona sukcesem!
            </p>
            <p className="text-sm font-medium text-teal-600">
              Twoja rezerwacja została potwierdzona. Szczegóły znajdziesz poniżej.
            </p>
          </div>
        </div>
      )}

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
        Moje <span className="text-sky-500">podróże</span>
      </h1>
      <p className="mb-10 font-medium text-slate-500">
        Historia Twoich rezerwacji i nadchodzących wyjazdów.
      </p>

      {isError && (
        <div className="mb-6 rounded-xl border border-red-500 bg-red-100 px-4 py-3 text-sm font-medium text-red-600">
          Nie udało się pobrać rezerwacji.
        </div>
      )}

      {!isError && reservations.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white py-24 text-center">
          <div className="mb-4 text-6xl">✈️</div>
          <h3 className="mb-2 text-2xl font-bold text-slate-800">
            Brak rezerwacji
          </h3>
          <p className="mb-6 font-medium text-slate-500">
            Nie masz jeszcze żadnych zarezerwowanych wycieczek.
          </p>
          <Button variant="primary" onClick={() => navigate('/trips')}>
            Przeglądaj oferty
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {reservations.map((r) => {
          const status = STATUS_CONFIG[r.status] ?? {
            label: r.status,
            color: 'bg-slate-100 text-slate-500 border-slate-200',
          }
          const isExpanded = expandedId === r.id

          return (
            <div
              key={r.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 shrink-0 md:h-auto md:w-56">
                  <img
                    src={r.trip.imageUrl}
                    alt={r.trip.destinationCity}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent md:bg-linear-to-r" />
                  <div className="absolute bottom-3 left-3 md:hidden">
                    <h3 className="text-xl font-bold text-white">
                      {r.trip.destinationCity}
                    </h3>
                    <p className="text-xs text-white/80">{r.trip.country}</p>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="hidden md:block">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {r.trip.destinationCity}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {r.trip.country} · {r.trip.hotelName}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <DetailItem label="Wylot" value={formatDate(r.trip.departureTime)} />
                    <DetailItem
                      label="Powrót"
                      value={formatDate(r.trip.returnDepartureTime)}
                    />
                    <DetailItem label="Data zakupu" value={formatDate(r.createdAt)} />
                    <DetailItem
                      label="Kwota"
                      value={`${r.totalPrice.toFixed(2)} PLN`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="flex items-center gap-1 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600"
                  >
                    {isExpanded
                      ? 'Ukryj szczegóły ▲'
                      : 'Pokaż uczestników i szczegóły ▼'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">
                        Dane kontaktowe
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-slate-500">Imię:</span>{' '}
                          <span className="font-semibold text-slate-800">
                            {r.contactName}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-500">Email:</span>{' '}
                          <span className="font-semibold text-slate-800">
                            {r.contactEmail}
                          </span>
                        </p>
                        <p>
                          <span className="text-slate-500">Telefon:</span>{' '}
                          <span className="font-semibold text-slate-800">
                            {r.contactPhone}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">
                        Uczestnicy ({r.numberOfPeople})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {r.participants.map((p, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
