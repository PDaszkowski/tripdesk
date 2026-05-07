import { useAuth } from '../context/useAuth'
import styles from './HomePage.module.css'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className={styles.wrap}>
      <h1 className={styles.hero}>TripDesk</h1>
      <p className={styles.lead}>
        Panel do obsługi biura podróży i klientów — rezerwacje, dokumenty i komunikacja w jednym
        miejscu.
      </p>

      {user ? (
        <p className={styles.status}>
          Zalogowano jako <strong>{user.email}</strong>
          <span className={styles.role}> ({user.role})</span>
        </p>
      ) : (
        <p className={styles.hint}>
          Aby korzystać z pełnych funkcji, zaloguj się lub utwórz konto
        </p>
      )}
    </div>
  )
}
