import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export interface Trip {
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
    maxPeople: number;
    returnDepartureTime: string;
    durationDays: number;
    boardBasis: string;
    hasParking: boolean;
    flightPrice: number;
    hotelPrice: number;
    attractionImageUrls: string[];
    stopOverInfo?: string; // Nowe pole na przesiadkę
}

export function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const countryFilter = searchParams.get('country');

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

                let url = 'http://localhost:8080/api/trips';
                if (countryFilter) {
                    url += `?country=${encodeURIComponent(countryFilter)}`;
                }

                const res = await fetch(url, { headers });

                if (res.status === 401) throw new Error("Sesja wygasła.");
                if (!res.ok) throw new Error("Błąd serwera");

                const data = await res.json();

                setTrips(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [countryFilter]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pl-PL', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="p-20 text-center font-bold text-slate-400 animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            Pobieranie ofert...
        </div>
    );

    return (
        <div className="w-full px-8 py-12 bg-slate-50 min-h-screen font-sans">
            <header className="mb-12 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900">
                        Karty <span className="text-indigo-600">Podróży</span>
                    </h1>
                    {countryFilter && (
                        <p className="mt-2 text-slate-500 font-medium">
                            Wyniki dla: <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{countryFilter}</span>
                        </p>
                    )}
                </div>
                {countryFilter && (
                    <button
                        onClick={() => navigate('/trips')}
                        className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        Usuń filtry ×
                    </button>
                )}
            </header>

            {trips.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 max-w-[1600px] mx-auto shadow-inner">
                    <p className="text-slate-400 text-xl font-medium italic">
                        {countryFilter ? `Brak ofert dla regionu: ${countryFilter}` : "Brak dostępnych ofert."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1600px] mx-auto">
                    {trips.map((trip) => (
                        <div key={trip.id} className="flex flex-col w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 transition-all hover:shadow-2xl group">

                            {/* Sekcja Zdjęcia Głównego */}
                            <div className="relative w-full h-[350px] overflow-hidden">
                                <img
                                    src={trip.imageUrl || 'https://images.unsplash.com/photo-1500673922987-e212871fec22'}
                                    alt={trip.destinationCity}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                <div className="absolute top-8 left-8 right-8 flex justify-between items-start text-white">
                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                                        <p className="text-2xl font-black">{trip.price} <span className="text-sm opacity-80">PLN</span></p>
                                    </div>
                                    <div className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
                                        👤 max {trip.maxPeople} os.
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-8">
                                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                                        {trip.destinationCity}
                                    </h2>
                                    <p className="text-lg font-bold text-indigo-300 uppercase tracking-widest">
                                        {trip.hotelName}
                                    </p>
                                </div>
                            </div>

                            {/* Sekcja Detali */}
                            <div className="p-10 flex flex-col gap-8">

                                {/* Bilet Lotniczy z obsługą przesiadki */}
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200/60 shadow-inner">
                                    <div className="flex flex-col items-start min-w-[90px]">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Wylot</p>
                                        <p className="text-4xl font-black text-slate-900 leading-none">{trip.originCode}</p>
                                        <p className="text-[12px] font-bold text-slate-600 mt-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                                            {formatDate(trip.departureTime)}
                                        </p>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center px-4 relative">
                                        <span className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest bg-slate-200/50 px-3 py-0.5 rounded-full">
                                            {trip.outboundDuration}
                                        </span>
                                        <div className="w-full flex items-center">
                                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-300"></div>
                                            <div className="mx-3 text-2xl text-indigo-500 transform rotate-45 transition-transform group-hover:translate-x-1">✈</div>
                                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-300"></div>
                                        </div>

                                        {/* INFO O PRZESIADCE */}
                                        {trip.stopOverInfo && (
                                            <p className="absolute -bottom-6 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 whitespace-nowrap">
                                                ⚠ {trip.stopOverInfo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end min-w-[90px]">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Przylot</p>
                                        <p className="text-4xl font-black text-slate-900 leading-none">{trip.destinationCode}</p>
                                        <p className="text-[12px] font-bold text-slate-600 mt-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap">
                                            {formatDate(trip.arrivalTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Opisy i Atrakcje */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-1">
                                            O podróży
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                                            {trip.description}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-1">
                                            Lokalne Atrakcje
                                        </h3>
                                        <p className="text-sm text-slate-800 font-bold leading-snug line-clamp-3 italic">
                                            {trip.attractions}
                                        </p>
                                    </div>
                                </div>

                                {/* Galeria mini zdjęć atrakcji */}
                                {trip.attractionImageUrls && trip.attractionImageUrls.length > 0 && (
                                    <div className="flex gap-2 overflow-hidden rounded-xl h-16">
                                        {trip.attractionImageUrls.map((url, index) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt="atrakcja"
                                                className="w-1/4 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => navigate(`/trips/${trip.id}`)}
                                    className="w-full bg-slate-900 text-white py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:shadow-indigo-200 hover:shadow-2xl hover:translate-y-[-4px] active:scale-[0.98]"
                                >
                                    Zobacz szczegóły i rezerwuj
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}