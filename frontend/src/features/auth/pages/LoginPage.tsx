import { useLocation } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import styles from './LoginPage.module.css'

interface LoginLocationState {
  registeredEmail?: string
}

export function LoginPage() {
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const showFlash = Boolean(state?.registeredEmail)

  return (
    <div className={styles.shell}>
      {showFlash ? (
        <div className={styles.flash} role="status">
          Rejestracja zakończona pomyślnie. Możesz zalogować się na podany adres email.
        </div>
      ) : null}
      <LoginForm />
    </div>
  )
}
