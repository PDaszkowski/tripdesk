import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/useAuth'
import { useLogoutMutation } from '../../features/auth/api/logout'

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const logoutMutation = useLogoutMutation()

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate('/login'),
    })
  }

  return (
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
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-slate-800 transition-colors hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutMutation.isPending ? 'Wylogowywanie…' : 'Wyloguj'}
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
  )
}
