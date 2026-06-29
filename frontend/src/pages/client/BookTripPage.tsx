import { useState } from 'react'
import type { FormEvent } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useTrip } from '@/features/trips/api/getTrip'
import { useCreateReservation } from '@/features/reservations/api/createReservation'
import { Input } from '@/shared/ui/Input'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

export function BookTripPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const peopleParam = searchParams.get('people')
  const numberOfPeople = peopleParam ? parseInt(peopleParam, 10) : 1

  const { data: trip, isPending, isError } = useTrip(id)
  const createReservation = useCreateReservation()

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [participants, setParticipants] = useState<string[]>(
    Array(numberOfPeople).fill(''),
  )
  const [isBuyerParticipant, setIsBuyerParticipant] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setParticipantAt(index: number, value: string) {
    setParticipants((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleContactNameChange(value: string) {
    setContactName(value)
    if (isBuyerParticipant) setParticipantAt(0, value)
  }

  function handleBuyerParticipantToggle(checked: boolean) {
    setIsBuyerParticipant(checked)
    if (checked) setParticipantAt(0, contactName)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const cleanedPhone = contactPhone.replace(/[\s-]/g, '')
    if (!/^(?:\+48)?\d{9}$/.test(cleanedPhone)) {
      setError(
        'Podaj poprawny, 9-cyfrowy numer telefonu (np. 123456789 lub +48 123 456 789).',
      )
      return
    }

    createReservation.mutate(
      {
        tripId: Number(id),
        numberOfPeople,
        contactName,
        contactEmail,
        contactPhone,
        participants,
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl
          } else {
            navigate('/my-trips')
          }
        },
        onError: () => {
          setError('Nie udało się dokonać rezerwacji. Spróbuj ponownie.')
        },
      },
    )
  }

  if (isPending) {
    return <Spinner label="Przygotowywanie formularza…" />
  }

  if (isError || !trip) {
    return (
      <div className="p-20 text-center text-2xl font-bold text-red-600">
        Nie udało się załadować wycieczki.
      </div>
    )
  }

  const totalPrice = (trip.price * numberOfPeople).toFixed(2)

  return (
    <div className="mx-auto w-full max-w-4xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-sky-500"
      >
        <span className="text-lg">←</span> Wróć do oferty
      </button>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
        Potwierdzenie <span className="text-sky-500">rezerwacji</span>
      </h1>
      <p className="mb-10 font-medium text-slate-500">
        Wypełnij dane kontaktowe oraz dane uczestników. Płatność realizowana jest
        bezpiecznie przez Stripe.
      </p>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500 bg-red-100 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="space-y-10 md:col-span-2">
          <form id="reservation-form" onSubmit={handleSubmit} className="space-y-10">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-slate-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm text-sky-500">
                  1
                </span>
                Dane zamawiającego
              </h2>

              <div className="space-y-5">
                <Input
                  label="Imię i nazwisko"
                  required
                  value={contactName}
                  onChange={(e) => handleContactNameChange(e.target.value)}
                  placeholder="Jan Kowalski"
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jan@example.com"
                  />
                  <Input
                    label="Telefon"
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+48 123 456 789"
                  />
                </div>

                <Checkbox
                  label="Zamawiający jest również uczestnikiem"
                  checked={isBuyerParticipant}
                  onChange={(e) => handleBuyerParticipantToggle(e.target.checked)}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm text-sky-500">
                    2
                  </span>
                  Uczestnicy
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  Liczba: {numberOfPeople}
                </span>
              </div>

              <div className="space-y-6">
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-md">
                      {idx + 1}
                    </span>
                    <Input
                      label="Imię i nazwisko uczestnika"
                      required
                      value={p}
                      onChange={(e) => setParticipantAt(idx, e.target.value)}
                      placeholder="Np. Anna Kowalska"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="relative">
          <div className="sticky top-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl">
            <h3 className="mb-6 border-b border-slate-800 pb-4 text-xl font-bold text-white">
              Wybrana oferta
            </h3>

            <div className="mb-6">
              <img
                src={trip.imageUrl}
                alt={trip.destinationCity}
                className="mb-4 h-32 w-full rounded-2xl object-cover opacity-80"
              />
              <h4 className="text-2xl font-bold tracking-tight uppercase">
                {trip.destinationCity}
              </h4>
              <p className="text-sm font-semibold text-sky-400">
                {trip.hotelName}
              </p>
            </div>

            <div className="mb-8 space-y-3 text-sm">
              <SummaryRow
                label="Termin:"
                value={`${new Date(trip.departureTime).toLocaleDateString()} - ${new Date(trip.returnDepartureTime).toLocaleDateString()}`}
              />
              <SummaryRow label="Liczba osób:" value={String(numberOfPeople)} />
              <SummaryRow
                label="Cena bazowa:"
                value={`${trip.price.toFixed(2)} PLN`}
              />
            </div>

            <div className="mb-8 border-t border-slate-800 pt-6">
              <p className="mb-1 text-[10px] font-bold tracking-widest text-sky-400 uppercase">
                Całkowita kwota
              </p>
              <p className="text-4xl font-bold text-white">
                {totalPrice}{' '}
                <span className="text-sm font-normal text-slate-400">PLN</span>
              </p>
            </div>

            <Button
              variant="primary"
              fullWidth
              type="submit"
              form="reservation-form"
              disabled={createReservation.isPending}
              className="py-4 text-base font-semibold tracking-widest uppercase"
            >
              {createReservation.isPending
                ? 'Przetwarzanie…'
                : 'Przejdź do płatności'}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-500">
              <svg
                className="h-4 w-4 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Bezpieczne szyfrowanie SSL przez Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-400">
      <span>{label}</span>
      <span className="font-semibold text-slate-200">{value}</span>
    </div>
  )
}
