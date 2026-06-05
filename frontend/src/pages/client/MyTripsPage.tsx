import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const tokenStorage = {
    getAccessToken: () => {
        try { return localStorage.getItem('tripdesk_access_token') || null; }
        catch (e) { return null; }
    }
};

interface TripSummary {
    id: number;
    destinationCity: string;
    hotelName: string;
    imageUrl: string;
    country: string;
    departureTime: string;
    returnDepartureTime: string;
}

interface Reservation {
    id: number;
    status: string;
    numberOfPeople: number;
    totalPrice: number;
    createdAt: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    participants: string[];
    trip: TripSummary;
}

export function MyTripsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paymentSuccess = searchParams.get('payment_success') === 'true';

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = tokenStorage.getAccessToken();
                if (!token) { navigate('/login'); return; }

                const res = await fetch('http://localhost:8080/api/reservations/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Nie udało się pobrać rezerwacji");
                const data = await res.json();
                setReservations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' });

    const statusConfig: Record<string, { label: string; color: string }> = {
        PAID:    { label: 'Opłacona',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        PENDING: { label: 'Oczekująca',  color: 'bg-amber-100 text-amber-700 border-amber-200' },
        NEW:     { label: 'Nowa',        color: 'bg-blue-100 text-blue-700 border-blue-200' },
        CANCELLED:{ label: 'Anulowana', color: 'bg-red-100 text-red-700 border-red-200' },
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Ładowanie podróży...</p>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-8 font-sans">
            <div className="max-w-5xl mx-auto">

                {paymentSuccess && (
                    <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-black text-emerald-800 text-lg">Płatność zakończona sukcesem!</p>
                            <p className="text-emerald-600 text-sm font-medium">Twoja rezerwacja została potwierdzona. Szczegóły znajdziesz poniżej.</p>
                        </div>
                    </div>
                )}

                <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
                    Moje <span className="text-indigo-600">Podróże</span>
                </h1>
                <p className="text-slate-500 font-medium mb-10">
                    Historia Twoich rezerwacji i nadchodzących wyjazdów.
                </p>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold mb-6">
                        {error}
                    </div>
                )}

                {reservations.length === 0 && !error && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="text-6xl mb-4">✈️</div>
                        <h3 className="text-2xl font-black text-slate-700 mb-2">Brak rezerwacji</h3>
                        <p className="text-slate-400 font-medium mb-6">Nie masz jeszcze żadnych zarezerwowanych wycieczek.</p>
                        <button
                            onClick={() => navigate('/trips')}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all"
                        >
                            Przeglądaj oferty
                        </button>
                    </div>
                )}

                <div className="space-y-6">
                    {reservations.map(r => {
                        const status = statusConfig[r.status] ?? { label: r.status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
                        const isExpanded = expandedId === r.id;

                        return (
                            <div key={r.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="relative md:w-56 h-48 md:h-auto flex-shrink-0">
                                        <img
                                            src={r.trip.imageUrl}
                                            alt={r.trip.destinationCity}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                                        <div className="absolute bottom-3 left-3 md:hidden">
                                            <h3 className="text-white font-black text-xl">{r.trip.destinationCity}</h3>
                                            <p className="text-white/80 text-xs">{r.trip.country}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                            <div className="hidden md:block">
                                                <h3 className="text-2xl font-black text-slate-900">{r.trip.destinationCity}</h3>
                                                <p className="text-slate-400 font-medium text-sm">{r.trip.country} · {r.trip.hotelName}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black border ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wylot</p>
                                                <p className="font-bold text-slate-800 text-sm">{formatDate(r.trip.departureTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Powrót</p>
                                                <p className="font-bold text-slate-800 text-sm">{formatDate(r.trip.returnDepartureTime)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data zakupu</p>
                                                <p className="font-bold text-slate-800 text-sm">{formatDate(r.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kwota</p>
                                                <p className="font-bold text-slate-800 text-sm">{r.totalPrice.toFixed(2)} PLN</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                            className="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors flex items-center gap-1"
                                        >
                                            {isExpanded ? 'Ukryj szczegóły ▲' : 'Pokaż uczestników i szczegóły ▼'}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-slate-100 p-6 bg-slate-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Dane kontaktowe</h4>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="text-slate-400">Imię:</span> <span className="font-bold text-slate-700">{r.contactName}</span></p>
                                                    <p><span className="text-slate-400">Email:</span> <span className="font-bold text-slate-700">{r.contactEmail}</span></p>
                                                    <p><span className="text-slate-400">Telefon:</span> <span className="font-bold text-slate-700">{r.contactPhone}</span></p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                                    Uczestnicy ({r.numberOfPeople})
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {r.participants.map((p, idx) => (
                                                        <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}