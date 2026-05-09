import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/useAuth'

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-slate-800 transition-colors hover:text-sky-500"
        >
          TripDesk
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-sm text-slate-500">
                {user.firstName} {user.lastName}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 transition-colors hover:border-slate-500"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-500 transition-colors hover:text-sky-500"
              >
                Logowanie
              </Link>
              <Link
                to="/register"
                className="text-slate-500 transition-colors hover:text-sky-500"
              >
                Rejestracja
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex flex-1 flex-col px-5 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
        <Outlet />
      </main>
    </div>
  )
}
