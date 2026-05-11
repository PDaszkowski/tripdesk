import { useAuth } from '@/features/auth/context/useAuth'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        TripDesk
      </h1>
      <p className="mb-6 text-base leading-relaxed text-slate-500">
        Panel do obsługi biura podróży i klientów — rezerwacje, dokumenty i
        komunikacja w jednym miejscu.
      </p>

      {user ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-500">
          Zalogowano jako{' '}
          <strong className="text-slate-800">{user.email}</strong>
          <span className="font-medium text-slate-500"> ({user.role})</span>
        </p>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-sm leading-relaxed text-slate-500 shadow-md">
          Aby korzystać z pełnych funkcji, zaloguj się lub utwórz konto
        </p>
      )}
    </div>
  )
}
