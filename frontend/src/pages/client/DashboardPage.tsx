import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlinePaperAirplane,
  HiOutlineCloud,
  HiOutlineMapPin,
} from 'react-icons/hi2'
import { useAuth } from '@/features/auth/context/useAuth'
import { useTrips } from '@/features/trips/api/getTrips'
import { FEATURED_DESTINATIONS } from '@/features/trips/constants'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: trips } = useTrips()

  const featuredTrips = trips?.slice(0, 3) ?? []

  return (
    <div className="mx-auto w-full max-w-6xl pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Witaj,{' '}
          <span className="text-sky-500">{user?.firstName ?? 'Podróżniku'}</span>
          !
        </h1>
        <p className="mt-2 text-slate-500">
          Zacznij swoją kolejną przygodę dzisiaj.
        </p>
      </header>
      
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <QuickCard
          icon={<HiOutlineDocumentText size={24} />}
          iconColor="sky"
          title="Dokumenty"
          subtitle="Twoje bilety i umowy"
          to="/documents"
          buttonLabel="Zarządzaj"
          buttonVariant="primary"
        />
        <QuickCard
          icon={<HiOutlinePaperAirplane size={24} />}
          iconColor="teal"
          title="Moje podróże"
          subtitle="Twoje rezerwacje"
          to="/my-trips"
          buttonLabel="Zobacz wszystkie"
          buttonVariant="secondary"
        />
        <QuickCard
          icon={<HiOutlineCloud size={24} />}
          iconColor="sky"
          title="Pogoda"
          subtitle="Sprawdź cel podróży"
          to="/weather"
          buttonLabel="Sprawdź"
          buttonVariant="outline"
        />
      </div>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Odkrywaj świat</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURED_DESTINATIONS.map((dest) => (
            <button
              key={dest.code}
              type="button"
              onClick={() => navigate(`/trips?country=${dest.name}`)}
              className="group relative h-40 overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-xl"
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tracking-widest text-white uppercase">
                {dest.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Gorące oferty</h2>
          <Button variant="ghost" onClick={() => navigate('/trips')}>
            Zobacz więcej →
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {featuredTrips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="group flex cursor-pointer items-center gap-6 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-sky-500 hover:shadow-md"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={trip.imageUrl}
                  alt={trip.destinationCity}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2 text-sky-500">
                  <HiOutlineMapPin size={14} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {trip.destinationCity}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-sky-500">
                  {trip.hotelName}
                </h3>
                <p className="line-clamp-1 text-xs text-slate-500">
                  {trip.description}
                </p>
              </div>
              <div className="pr-4 text-right">
                <p className="text-xs font-medium text-slate-500">od</p>
                <p className="text-xl font-bold text-slate-900">
                  {trip.price} <span className="text-[10px]">PLN</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

interface QuickCardProps {
  icon: React.ReactNode
  iconColor: 'sky' | 'teal'
  title: string
  subtitle: string
  to: string
  buttonLabel: string
  buttonVariant: 'primary' | 'secondary' | 'outline'
}

function QuickCard({
  icon,
  iconColor,
  title,
  subtitle,
  to,
  buttonLabel,
  buttonVariant,
}: QuickCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            'flex items-center justify-center rounded-lg p-3',
            iconColor === 'sky'
              ? 'bg-sky-100 text-sky-500'
              : 'bg-teal-100 text-teal-500',
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <Button variant={buttonVariant} fullWidth onClick={() => navigate(to)}>
        {buttonLabel}
      </Button>
    </div>
  )
}
