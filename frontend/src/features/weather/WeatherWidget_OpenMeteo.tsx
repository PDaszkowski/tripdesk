import { useEffect, useState } from 'react';


interface DayWeather {
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    weatherCode: number;
    label: string;
}

interface WeatherResult {
    isHistorical: boolean;
    resolvedCity: string;
    days: DayWeather[];
}



function weatherEmoji(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 2) return '⛅';
    if (code === 3) return '☁️';
    if (code <= 49) return '🌫️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '❄️';
    if (code <= 84) return '🌦️';
    if (code <= 99) return '⛈️';
    return '🌡️';
}

function weatherLabel(code: number): string {
    if (code === 0) return 'Słonecznie';
    if (code <= 2) return 'Częściowe zachmurzenie';
    if (code === 3) return 'Pochmurno';
    if (code <= 49) return 'Mgła';
    if (code <= 69) return 'Deszcz';
    if (code <= 79) return 'Śnieg';
    if (code <= 84) return 'Przelotny deszcz';
    if (code <= 99) return 'Burza';
    return 'Różnie';
}

function toDateStr(iso: string) {
    return iso.split('T')[0];
}

function formatDatePL(date: string) {
    return new Date(date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short'
    });
}

function shiftDateByYear(date: string, years: number) {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().split('T')[0];
}

function daysBetweenNowAnd(iso: string) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(iso.split('T')[0]);
    return Math.round((target.getTime() - now.getTime()) / 86400000);
}

// ───────────────────────── API ─────────────────────────

async function fetchWeather(
    city: string,
    departureTime: string,
    returnTime: string
): Promise<WeatherResult> {

    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pl&format=json`
    );

    const geoData = await geo.json();
    if (!geoData.results?.length) throw new Error('Nie znaleziono miasta');

    const { latitude, longitude, name, country } = geoData.results[0];
    const resolvedCity = `${name}, ${country}`;

    const depDate = toDateStr(departureTime);
    const retDate = toDateStr(returnTime);

    const isHistorical = daysBetweenNowAnd(departureTime) > 16;

    const startDate = isHistorical ? shiftDateByYear(depDate, -1) : depDate;
    const endDate = isHistorical ? shiftDateByYear(retDate, -1) : retDate;

    const url = isHistorical
        ? `https://archive-api.open-meteo.com/v1/archive`
        + `?latitude=${latitude}&longitude=${longitude}`
        + `&start_date=${startDate}&end_date=${endDate}`
        + `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code`
        + `&timezone=auto`
        : `https://api.open-meteo.com/v1/forecast`
        + `?latitude=${latitude}&longitude=${longitude}`
        + `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code`
        + `&timezone=auto&forecast_days=16`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.daily?.time) {
        console.error(data);
        throw new Error('Brak danych pogodowych');
    }

    const d = data.daily;

    // ───────────────────────── MAPA POGODY ─────────────────────────

    const weatherMap = new Map<string, any>();

    d.time.forEach((date: string, i: number) => {
        weatherMap.set(date, {
            maxTemp: Math.round(d.temperature_2m_max[i]),
            minTemp: Math.round(d.temperature_2m_min[i]),
            precipitation: Math.round(d.precipitation_sum[i] * 10) / 10,
            weatherCode: d.weather_code[i],
        });
    });

    // ───────────────────────── DNI WYCIECZKI ─────────────────────────

    const tripDates: string[] = [];
    const cur = new Date(depDate);
    const end = new Date(retDate);

    while (cur <= end) {
        tripDates.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
    }

    const days: DayWeather[] = tripDates.map((tripDate) => {

        const apiDate = isHistorical
            ? shiftDateByYear(tripDate, -1)
            : tripDate;

        const weather = weatherMap.get(apiDate);

        let label = '';

        if (tripDate === depDate) label = '✈️ Wylot';
        else if (tripDate === retDate) label = '🔙 Powrót';
        else {
            const idx = tripDates.indexOf(tripDate);
            label = `Dzień ${idx + 1}`;
        }

        return {
            date: tripDate,
            maxTemp: weather?.maxTemp ?? 0,
            minTemp: weather?.minTemp ?? 0,
            precipitation: weather?.precipitation ?? 0,
            weatherCode: weather?.weatherCode ?? 0,
            label
        };
    });

    return { isHistorical, resolvedCity, days };
}



interface Props {
    city: string;
    departureTime: string;
    returnTime: string;
}

export function WeatherWidget({ city, departureTime, returnTime }: Props) {

    const [result, setResult] = useState<WeatherResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetchWeather(city, departureTime, returnTime)
            .then(setResult)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));

    }, [city, departureTime, returnTime]);

    if (loading) {
        return (
            <div className="rounded-[2rem] border p-6 animate-pulse">
                Ładowanie pogody...
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="rounded-[2rem] border p-6 text-center">
                🌐 Pogoda niedostępna
            </div>
        );
    }

    const { isHistorical, resolvedCity, days } = result;

    const visibleDays =
        days.length > 7
            ? [days[0], ...days.slice(1, -1), days[days.length - 1]]
            : days;

    return (
        <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-4 text-white">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    {isHistorical ? 'Przewidywana pogoda w tym okresie' : 'Prognoza pogody'}
                </div>
                <div className="text-sm font-bold">{resolvedCity}</div>
            </div>

            {/* DAYS */}
            <div className="divide-y divide-slate-100">
                {visibleDays.map((day) => {
                    const isKey = day.label.includes('Wylot') || day.label.includes('Powrót');

                    return (
                        <div
                            key={day.date}
                            className={`flex items-center gap-4 px-6 py-3 ${isKey ? 'bg-indigo-50' : ''}`}
                        >

                            {/* LABEL + DATE */}
                            <div className="w-32 flex-shrink-0">
                                <div className={`text-xs font-black ${isKey ? 'text-indigo-600' : 'text-slate-600'}`}>
                                    {day.label}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {formatDatePL(day.date)}
                                </div>
                            </div>

                            {/* ICON */}
                            <div className="text-2xl w-8 text-center">
                                {weatherEmoji(day.weatherCode)}
                            </div>

                            {/* INFO */}
                            <div className="flex-1">
                                <div className="text-xs text-slate-500">
                                    {weatherLabel(day.weatherCode)}
                                </div>
                                {day.precipitation > 0 && (
                                    <div className="text-[10px] text-blue-500">
                                        💧 {day.precipitation} mm
                                    </div>
                                )}
                            </div>

                            {/* TEMP */}
                            <div className="text-right">
                                <div className="text-sm font-black">
                                    {day.maxTemp}°
                                </div>
                                <div className="text-xs text-slate-400">
                                    {day.minTemp}°
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* FOOTER */}
            <div className="px-6 py-3 bg-slate-50 text-[10px] text-slate-400 text-center">
                Open-Meteo {isHistorical ? 'ERA5' : 'Forecast'}
            </div>
        </div>
    );
}