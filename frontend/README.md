# Jak pracować na frontendzie

## Rekomendowany zestaw (hot reload)

Do codziennej pracy nad kodem React używasz **serwera deweloperskiego Vite** oraz **backendu z Dockera**.

1. **Backend i baza** — z katalogu głównego repozytorium uruchom:

   ```bash
   docker compose up backend
   ```

   Serwis `backend` w `docker-compose.yml` ma `depends_on: db`, więc Docker podnosi też kontener **PostgreSQL**. Przy zmianach w Dockerfile backendu lub zależnościach dodaj przebudowę:

   ```bash
   docker compose up --build backend
   ```

   API Spring Boot jest dostępne pod **http://localhost:8080**.

2. **Frontend** — w osobnym terminalu, w katalogu `frontend`:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Domyślnie aplikacja działa pod **http://localhost:5173** (port Vite). Edycja plików odświeża widok bez przebudowy obrazu Dockera.

3. **Adres API** — klient HTTP (`httpClient`) domyślnie wskazuje na `http://localhost:8080`. Inny adres możesz ustawić zmienną **`VITE_API_BASE_URL`** przy starcie lub w pliku `.env` w `frontend`.

## Pełny stack w Dockerze (bez `npm run dev`)

Jeśli chcesz uruchomić wszystko jak na „sztywnym” wdrożeniu:

```bash
docker compose up --build
```

Frontend z nginx jest wtedy pod **http://localhost:3000**. Po zmianach w kodzie frontendu trzeba **przebudować obraz** (`--build`), żeby zobaczyć efekt — do szybkiej iteracji nad UI wygodniejszy jest **`npm run dev`**.

## Porty (skrót)

| Usługa   | Port na hoście | Uwagi                          |
|----------|----------------|--------------------------------|
| Vite dev | 5173           | Praca nad frontendem           |
| Frontend (Docker) | 3000 | Statyczny build z nginx |
| Backend  | 8080           | REST API                       |
| Postgres | 5433 → 5432    | Baza w kontenerze              |
