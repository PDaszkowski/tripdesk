import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/useAuth'
import styles from './AppShell.module.css'

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          TripDesk
        </Link>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.user}>{user.firstName} {user.lastName}</span>
              <button type="button" onClick={logout}>
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Logowanie</Link>
              <Link to="/register">Rejestracja</Link>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
