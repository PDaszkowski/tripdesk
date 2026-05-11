import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlinePaperAirplane,
  HiOutlineCloud,
} from 'react-icons/hi2'
import { useAuth } from '@/features/auth/context/useAuth'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Witaj, {user?.firstName ?? 'Podróżniku'}!
        </h1>
        <p className="mt-2 text-base text-slate-500">
          Oto przegląd Twoich aktywności
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickCard
          icon={<HiOutlineDocumentText size={24} />}
          iconColor="sky"
          title="Dokumenty"
          subtitle="5 plików"
          to="/documents"
          buttonLabel="Zarządzaj"
          buttonVariant="primary"
        />
        <QuickCard
          icon={<HiOutlinePaperAirplane size={24} />}
          iconColor="teal"
          title="Podróże"
          subtitle="3 zaplanowane"
          to="/trips"
          buttonLabel="Zobacz"
          buttonVariant="secondary"
        />
        <QuickCard
          icon={<HiOutlineCloud size={24} />}
          iconColor="sky"
          title="Pogoda"
          subtitle="Aktualne warunki"
          to="/weather"
          buttonLabel="Sprawdź"
          buttonVariant="outline"
        />
      </div>
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
      <Button
        variant={buttonVariant}
        fullWidth
        onClick={() => navigate(to)}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
