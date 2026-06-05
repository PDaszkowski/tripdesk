import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { Trip } from './TripsPage';

// Zastąpiono zewnętrzny import lokalną, bezpieczną implementacją, aby trwale uniknąć błędów kompilacji
const tokenStorage = {
    getAccessToken: () => {
        try {
            return localStorage.getItem('tripdesk_access_token') || null;
        } catch (e) {
            console.error("Błąd odczytu z localStorage:", e);
            return null;
        }
    }
};

export function BookTripPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pobieramy liczbę osób z URL, domyślnie 1
    const peopleParam = searchParams.get('people');
    const numberOfPeople = peopleParam ? parseInt(peopleParam, 10) : 1;

    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Formularz kontaktowy
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    // Formularz uczestników (tablica z wartościami dla każdego)
    const [participants, setParticipants] = useState<string[]>(Array(numberOfPeople).fill(''));

    // Checkbox "Zamawiający jest uczestnikiem"
    const [isBuyerParticipant, setIsBuyerParticipant] = useState(false);

    useEffect(() => {
        if (isBuyerParticipant) {
            setParticipants(prev => {
                const newParticipants = [...prev];
                newParticipants[0] = contactName;
                return newParticipants;
            });
        }
    }, [contactName, isBuyerParticipant]);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const token = tokenStorage.getAccessToken();
                const headers: HeadersInit = {};
                if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`http://localhost:8080/api/trips/${id}`, { headers });
                if (!res.ok) throw new Error("Nie znaleziono wycieczki");

                const data = await res.json();
                setTrip(data);
            } catch (err) {
                console.error(err);
                setError("Nie udało się załadować danych wycieczki.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const handleParticipantChange = (index: number, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = value;
        setParticipants(newParticipants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Walidacja numeru telefonu
        const cleanedPhone = contactPhone.replace(/[\s-]/g, '');
        if (!/^(?:\+48)?\d{9}$/.test(cleanedPhone)) {
            setError("Podaj poprawny, 9-cyfrowy numer telefonu (np. 123456789 lub +48 123 456 789).");
            return;
        }

        setSubmitting(true);

        try {
            const token = tokenStorage.getAccessToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            if (token && token !== 'null') headers['Authorization'] = `Bearer ${token}`;

            const payload = {
                tripId: Number(id),
                numberOfPeople: numberOfPeople,
                contactName: contactName,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                participants: participants
            };

            const res = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Błąd podczas dokonywania rezerwacji");
            }

            // Odbieramy adres sesji płatniczej Stripe Checkout
            const data = await res.json();

            if (data.checkoutUrl) {
                // Przekierowanie użytkownika do bezpiecznej bramki płatności Stripe
                window.location.href = data.checkoutUrl;
            } else {
                // Gdyby bramka była wyłączona, od razu przechodzimy do panelu
                alert("Rezerwacja zapisana! Płatność kartą jest chwilowo niedostępna.");
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Wystąpił nieoczekiwany błąd");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Przygotowywanie formularza...</p>
        </div>
    );

    if (!trip) return (
        <div className="text-center p-20 text-red-500 font-black text-2xl">
            {error || "Nie udało się załadować wycieczki."}
        </div>
    );

    const totalPrice = (trip.price * numberOfPeople).toFixed(2);

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    <span className="text-lg">←</span> Wróć do oferty
                </button>

                <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
                    Potwierdzenie <span className="text-indigo-600">Rezerwacji</span>
                </h1>
                <p className="text-slate-500 font-medium mb-10">
                    Prosimy o wypełnienie danych kontaktowych oraz danych uczestników. Płatność realizowana jest bezpiecznie przez Stripe.
                </p>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold">
                        Błąd: {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Lewa kolumna - Formularz */}
                    <div className="md:col-span-2 space-y-10">
                        <form id="reservation-form" onSubmit={handleSubmit} className="space-y-10">

                            {/* Sekcja: Płatnik / Kontakt */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    Dane Zamawiającego
                                </h2>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Imię i Nazwisko</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            placeholder="Jan Kowalski"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="jan@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Telefon</label>
                                            <input
                                                type="tel"
                                                required
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="+48 123 456 789"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isBuyerParticipant}
                                                    onChange={(e) => setIsBuyerParticipant(e.target.checked)}
                                                    className="peer w-5 h-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                                                />
                                                <svg className="absolute w-3.5 h-3.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                                Zamawiający jest również uczestnikiem
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Sekcja: Uczestnicy */}
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                        Uczestnicy
                                    </h2>
                                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">
                                        Liczba: {numberOfPeople}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {participants.map((p, idx) => (
                                        <div key={idx} className="relative p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <span className="absolute -left-3 -top-3 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest ml-3">Imię i Nazwisko Uczestnika</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={p}
                                                    onChange={(e) => handleParticipantChange(idx, e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                    placeholder="Np. Anna Kowalska"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* Prawa kolumna - Podsumowanie */}
                    <div className="relative">
                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] sticky top-8 shadow-2xl border border-slate-800">
                            <h3 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-4">Wybrana Oferta</h3>

                            <div className="mb-6">
                                <img src={trip.imageUrl} alt={trip.destinationCity} className="w-full h-32 object-cover rounded-2xl opacity-80 mb-4" />
                                <h4 className="text-2xl font-black uppercase tracking-tight">{trip.destinationCity}</h4>
                                <p className="text-indigo-400 font-bold text-sm">{trip.hotelName}</p>
                            </div>

                            <div className="space-y-3 mb-8 text-sm">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Termin:</span>
                                    <span className="font-bold text-slate-200">
                                        {new Date(trip.departureTime).toLocaleDateString()} - {new Date(trip.returnDepartureTime).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Liczba osób:</span>
                                    <span className="font-bold text-slate-200">{numberOfPeople}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Cena bazowa:</span>
                                    <span className="font-bold text-slate-200">{trip.price.toFixed(2)} PLN</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-800 pt-6 mb-8">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Całkowita kwota</p>
                                <p className="text-4xl font-black text-white">{totalPrice} <span className="text-sm text-slate-400 font-normal">PLN</span></p>
                            </div>

                            <button
                                type="submit"
                                form="reservation-form"
                                disabled={submitting}
                                className={`w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest transition-all shadow-xl ${
                                    submitting
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-indigo-900/50 active:scale-95'
                                }`}
                            >
                                {submitting ? 'Przetwarzanie...' : 'Przejdź do Płatności'}
                            </button>

                            <p className="text-[10px] text-slate-500 text-center mt-4 flex items-center justify-center gap-1.5">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Bezpieczne szyfrowanie SSL przez Stripe
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}