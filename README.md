# TripDesk

> Projekt w trakcie tworzenia... WORK IN PROGRESS

TripDesk to system klasy CRM dla biura podróży, który łączy obsługę klienta,
sprzedaż wycieczek i komunikację w jednym miejscu. Agent zarządza relacjami,
rezerwacjami i płatnościami, a klient w wygodny sposób przegląda i rezerwuje
oferty.

Sercem systemu jest warstwa AI, która wspiera codzienną pracę - od podpowiedzi
i automatyzacji komunikacji, po wzbogacanie ofert o dodatkowy kontekst
(np. prognozę pogody dla terminu wyjazdu).

---

## Stack

**Frontend**
- React 19 + TypeScript, Vite
- Tailwind CSS v4 (design tokeny: slate / sky / teal)
- TanStack Query + ky (HTTP) + Zod (walidacja)
- React Router v7

**Backend**
- Spring Boot 3.5 (Java 21)
- Spring Security + JWT (access / refresh)
- JPA + PostgreSQL, Redis (sesje / cache)
- Spring AI (Ollama), Stripe (płatności), Duffel (loty), Unsplash (zdjęcia)

---

## Architektura

**Frontend** - wzorzec **bulletproof-react** (feature-based), z jednokierunkowymi
zależnościami: `shared → features → pages → app`.

```
frontend/src/
├── app/        # root aplikacji, routing, guardy (RequireAuth, RequireRole)
├── pages/      # widoki łączące funkcjonalności
├── features/   # moduły domenowe (auth, trips, reservations, weather)
│   └── [feature]/
│       ├── api/         # hooki + funkcje API (useLogin, useTrips, ...)
│       ├── components/  # komponenty danej funkcjonalności
│       ├── lib/         # czyste helpery
│       ├── types.ts     # typy domenowe
│       └── constants.ts # wartości stałe / mapowania
└── shared/     # współdzielone między funkcjonalnościami
    ├── ui/     # komponenty prezentacyjne (Button, Input, Spinner)
    ├── api/    # klient HTTP, endpointy, przechowywanie tokenów
    ├── config/ # konfiguracja środowiska (env.ts)
    └── lib/    # narzędzia ogólnego użytku
```

**Backend** - warstwowa architektura Spring Boot (controller → service →
repository) z bezstanowym uwierzytelnianiem JWT.

---

## Uruchomienie

### Wymagania
- Docker + Docker Compose
- Node.js 20+ (tryb deweloperski frontendu)
- Java 21 (tryb deweloperski backendu)

### Konfiguracja

W katalogu głównym utwórz plik `.env`:

```env
JWT_SECRET=<min. 32 znaki>
DUFFEL_TOKEN=<token Duffel>
UNSPLASH_ACCESS_KEY=<klucz Unsplash>
STRIPE_API_KEY=<klucz Stripe>
STRIPE_WEBHOOK_SECRET=<sekret webhooka Stripe>
```

### Cały stack (Docker)

```bash
docker compose up --build
```

| Usługa     | Adres                  |
|------------|------------------------|
| Frontend   | http://localhost:3000  |
| Backend    | http://localhost:8080  |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5433         |
| Redis      | localhost:6379         |
| Ollama     | localhost:11434        |

### Tryb deweloperski

Frontend (z hot-reloadem na porcie 5173):

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
./gradlew bootRun
```

---

## Skrypty (frontend)

| Komenda          | Opis                          |
|------------------|-------------------------------|
| `npm run dev`    | serwer deweloperski (Vite)    |
| `npm run build`  | build produkcyjny             |
| `npm run lint`   | analiza statyczna (ESLint)    |
| `npm run preview`| podgląd buildu produkcyjnego  |
