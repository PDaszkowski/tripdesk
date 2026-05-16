import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiOutlineDocumentText,
    HiOutlinePaperAirplane,
    HiOutlineCloud,
    HiOutlineMapPin, // Nowa ikona
} from 'react-icons/hi2';
import { useAuth } from '@/features/auth/context/useAuth';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';
import type { Trip } from './TripsPage'; // Importujemy interfejs

export function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch('http://localhost:8080/api/trips', { headers });
                const data = await res.json();
                // Bierzemy tylko 3 pierwsze
                setFeaturedTrips(Array.isArray(data) ? data.slice(0, 3) : []);
            } catch (err) {
                console.error("Błąd ładowania polecanych:", err);
            }
        };
        fetchTrips();
    }, []);

    const destinations = [
        { name: 'Hiszpania', code: 'ES', img: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { name: 'Turcja', code: 'TR', img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200' },
        { name: 'Egipt', code: 'EG', img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368' },
        { name: 'Grecja', code: 'GR', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077' },
    ];

    return (
        <div className="mx-auto w-full max-w-6xl pb-20">
            <header className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                    Witaj, <span className="text-indigo-600">{user?.firstName ?? 'Podróżniku'}</span>!
                </h1>
                <p className="mt-2 text-slate-500">Zacznij swoją kolejną przygodę dzisiaj.</p>
            </header>

            {/* Szybkie Akcje */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
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
                    title="Moje Podróże"
                    subtitle="3 zaplanowane wyjazdy"
                    to="/trips"
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

            {/* Sekcja: Popularne Kierunki (Destynacje) */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Odkrywaj Świat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {destinations.map((dest) => (
                        <button
                            key={dest.code}
                            onClick={() => navigate(`/trips?country=${dest.name}`)}
                            className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                        >
                            <img src={dest.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                            <span className="absolute inset-0 flex items-center justify-center text-white font-black uppercase tracking-widest text-lg">
                {dest.name}
              </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Sekcja: Polecane Oferty (Inny wygląd niż na liście głównej) */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Gorące Oferty</h2>
                    <Button variant="ghost" onClick={() => navigate('/trips')}>Zobacz więcej →</Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {featuredTrips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                <img src={trip.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                    <HiOutlineMapPin size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{trip.destinationCity}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{trip.hotelName}</h3>
                                <p className="text-xs text-slate-500 line-clamp-1">{trip.description}</p>
                            </div>
                            <div className="text-right pr-4">
                                <p className="text-xs text-slate-400 font-medium">od</p>
                                <p className="text-xl font-black text-slate-900">{trip.price} <span className="text-[10px]">PLN</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
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
