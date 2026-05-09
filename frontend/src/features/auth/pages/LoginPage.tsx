import { useLocation } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

interface LoginLocationState {
  registeredEmail?: string
}

export function LoginPage() {
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const showFlash = Boolean(state?.registeredEmail)

  return (
    <>
      {showFlash ? (
        <div
          role="status"
          className="mx-auto mb-5 w-full max-w-md rounded-lg border border-teal-500 bg-teal-100 px-4 py-3 text-sm text-teal-700"
        >
          Rejestracja zakończona pomyślnie. Możesz zalogować się na podany adres
          email.
        </div>
      ) : null}
      <LoginForm />
    </>
  )
}
