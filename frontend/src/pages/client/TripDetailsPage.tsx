import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Trip } from './TripsPage';

export function TripDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);

    // NOWE: Stan dla liczby osób (domyślnie 1)
    const [peopleCount, setPeopleCount] = useState(1);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`http://localhost:8080/api/trips/${id}`, { headers });
                if (!res.ok) throw new Error("Nie znaleziono wycieczki");

                const data = await res.json();
                setTrip(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Pobieranie szczegółów...</p>
        </div>
    );

    if (!trip) return (
        <div className="text-center p-20 text-red-500 font-black text-2xl">
            Nie udało się załadować wycieczki.
        </div>
    );

    const attractionNames = trip.attractions.split(',').map(s => s.trim());

    // Obliczenia cen na podstawie liczby osób
    const totalFlightPrice = (trip.flightPrice * peopleCount).toFixed(2);
    const totalHotelPrice = (trip.hotelPrice * peopleCount).toFixed(2);
    const totalPrice = (trip.price * peopleCount).toFixed(2);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                <img src={trip.imageUrl} className="w-full h-full object-cover" alt={trip.destinationCity} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/20"></div>

                <div className="absolute bottom-16 left-16 right-16 text-white">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm font-bold border border-white/20 shadow-2xl"
                    >
                        <span className="text-xl">←</span> Wróć do ofert
                    </button>

                    <h1 className="text-8xl font-black uppercase tracking-tighter drop-shadow-2xl mb-2 text-white">
                        {trip.destinationCity}
                    </h1>
                    <p className="text-3xl font-medium text-indigo-400 drop-shadow-lg">
                        {trip.hotelName}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Kolumna Lewa: Treść */}
                <div className="lg:col-span-2 space-y-16">

                    {/* Szybkie info - Boxy */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Czas trwania</p>
                            <p className="text-xl font-bold text-slate-900">{trip.durationDays} dni</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wyżywienie</p>
                            <p className="text-lg font-bold text-slate-900 leading-tight">{trip.boardBasis}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Parking</p>
                            <p className="text-xl font-bold text-slate-900">{trip.hasParking ? 'Dostępny' : 'Brak'}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dostępność</p>
                            <p className="text-xl font-bold text-slate-900">Do {trip.maxPeople} os.</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-4xl font-black mb-6 text-slate-900">O podróży</h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-light">
                            {trip.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-4xl font-black mb-10 text-slate-900 flex items-center gap-4">
                            Program i Atrakcje <span className="h-px flex-1 bg-slate-200"></span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {trip.attractionImageUrls && trip.attractionImageUrls.length > 0 ? (
                                trip.attractionImageUrls.map((img, idx) => (
                                    <div key={idx} className="group relative h-72 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transition-all hover:shadow-2xl">
                                        <img
                                            src={img}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={attractionNames[idx] || "Atrakcja"}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                                        <div className="absolute bottom-6 left-8">
                                            <p className="text-white font-black text-xl uppercase tracking-tight">
                                                {attractionNames[idx] || "Lokalna atrakcja"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Zdjęcia atrakcji wkrótce...</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Kolumna Prawa: Kalkulator Rezerwacji */}
                <div className="relative">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] sticky top-8 shadow-2xl border border-slate-800">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-bold text-white">Podsumowanie</h3>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Cena za os.</p>
                                <p className="text-lg font-bold">{trip.price} PLN</p>
                            </div>
                        </div>

                        {/* SEKCJA LICZNIKA OSÓB */}
                        <div className="bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-700/50">
                            <p className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Wybierz liczbę osób</p>
                            <div className="flex items-center justify-between bg-slate-900 rounded-xl p-2 border border-slate-700">
                                <button
                                    onClick={() => setPeopleCount(prev => Math.max(1, prev - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors text-xl font-bold"
                                >
                                    −
                                </button>
                                <span className="text-2xl font-black">{peopleCount}</span>
                                <button
                                    onClick={() => setPeopleCount(prev => Math.min(trip.maxPeople, prev + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-indigo-600 transition-colors text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-3 text-center italic">Maksymalna liczba osób w tym pakiecie: {trip.maxPeople}</p>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="text-sm font-medium">Bilety lotnicze (x{peopleCount})</span>
                                <span className="text-white font-black tracking-tight">{totalFlightPrice} PLN</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="text-sm font-medium">Zakwaterowanie (x{peopleCount})</span>
                                <span className="text-white font-black tracking-tight">{totalHotelPrice} PLN</span>
                            </div>

                            <div className="h-px bg-slate-800 my-4"></div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Suma do zapłaty</p>
                                    <p className="text-5xl font-black text-white">{totalPrice} <span className="text-sm font-normal text-slate-400">PLN</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 text-sm font-medium">
                            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/5 p-3 rounded-xl">
                                <span className="text-lg font-bold">✓</span> Podatek i opłaty wliczone
                            </div>
                            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/5 p-3 rounded-xl">
                                <span className="text-lg font-bold">✓</span> Darmowe odwołanie (24h)
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/book/${trip.id}?people=${peopleCount}`)}
                            className="w-full bg-indigo-600 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-900/40"
                        >
                            Zarezerwuj dla {peopleCount} {peopleCount === 1 ? 'osoby' : 'osób'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}