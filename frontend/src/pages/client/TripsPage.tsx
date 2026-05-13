import { useEffect, useState } from 'react';

interface Trip {
    id: number;
    originCode: string;
    destinationCode: string;
    destinationCity: string;
    departureTime: string;
    arrivalTime: string;
    outboundDuration: string;
    price: number;
    imageUrl: string;
    description: string;
    hotelName: string;
    attractions: string;
    maxPersons: number;
}

export function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

        fetch('http://localhost:8080/api/trips', { headers })
            .then(async res => {
                if (res.status === 401) throw new Error("Sesja wygasła.");
                if (!res.ok) throw new Error("Błąd serwera");
                return res.json();
            })
            .then(data => {
                setTrips(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400">Pobieranie ofert...</div>;

    return (
        <div className="w-full px-8 py-12 bg-slate-50 min-h-screen">
            <header className="mb-12 max-w-[1600px] mx-auto">
                <h1 className="text-5xl font-black tracking-tight text-slate-900">
                    Karty <span className="text-indigo-600">Podróży</span>
                </h1>
            </header>

            {trips.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
                    <p className="text-slate-400 text-xl font-medium">Brak dostępnych ofert.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1600px] mx-auto">
                    {trips.map((trip) => (
                        <div key={trip.id} className="flex flex-col w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl">

                            {/* Sekcja Zdjęcia - mniejsza wysokość (350px) */}
                            <div className="relative w-full h-[350px]">
                                <img
                                    src={trip.imageUrl || 'https://images.unsplash.com/photo-1500673922987-e212871fec22'}
                                    alt={trip.destinationCity}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                <div className="absolute top-8 left-8 right-8 flex justify-between items-start text-white">
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                                        <p className="text-2xl font-black">{trip.price} <span className="text-sm opacity-80">PLN</span></p>
                                    </div>
                                    <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                        👤 max {trip.maxPersons} os.
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8">
                                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                                        {trip.destinationCity}
                                    </h2>
                                    <p className="text-lg font-bold text-indigo-300 mt-1 uppercase tracking-widest">
                                        {trip.hotelName}
                                    </p>
                                </div>
                            </div>

                            {/* Sekcja Detali */}
                            <div className="p-10 flex flex-col gap-10">
                                {/* Skalowany Bilet Lotniczy */}
                                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-3xl border border-slate-200/50">
                                    <div className="text-left">
                                        <p className="text-4xl font-black text-slate-900 leading-none">{trip.originCode}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{formatDate(trip.departureTime)}</p>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center px-6">
                                        <span className="text-[10px] font-black text-indigo-500 uppercase mb-2">{trip.outboundDuration}</span>
                                        <div className="w-full h-px bg-slate-300 relative flex justify-center items-center">
                                            <div className="bg-slate-50 px-3 text-xl text-slate-400">✈</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-4xl font-black text-slate-900 leading-none">{trip.destinationCode}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">{formatDate(trip.arrivalTime)}</p>
                                    </div>
                                </div>

                                {/* Opisy z podkreślonymi nagłówkami */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <h3 className="inline-block text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-500 pb-1">
                                            O podróży
                                        </h3>
                                        <p className="text-base text-slate-600 leading-relaxed font-medium line-clamp-4">
                                            {trip.description}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="inline-block text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-indigo-500 pb-1">
                                            Lokalne Atrakcje
                                        </h3>
                                        <p className="text-lg text-slate-800 font-bold leading-snug">
                                            {trip.attractions}
                                        </p>
                                    </div>
                                </div>

                                <button className="w-full bg-slate-900 text-white py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:translate-y-[-2px] active:scale-[0.98]">
                                    Rezerwuj wyjazd
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}