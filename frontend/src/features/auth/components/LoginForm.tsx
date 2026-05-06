import { useState } from 'react'
import type { SubmitEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { emailContainsAt } from '../validation'
import { AuthCard } from './AuthCard'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const emailTrim = email.trim()
    if (!emailContainsAt(emailTrim)) {
      setError('Email musi zawierać znak @.')
      return
    }

    setPending(true)
    try {
      await login({ email: emailTrim, password })
      navigate('/')
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? typeof err.response?.data === 'string'
          ? err.response.data
          : 'Nieprawidłowy email lub hasło.'
        : 'Logowanie nie powiodło się.'
      setError(msg)
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthCard
      title="Logowanie"
      subtitle="Zaloguj się na swoje konto TripDesk."
      footer={
        <>
          Nie masz konta?
          <Link to="/register">Zarejestruj się</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error ? <div className={styles.error}>{error}</div> : null}
        <div className={styles.field}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="login-password">Hasło</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? 'Logowanie…' : 'Zaloguj'}
        </button>
      </form>
    </AuthCard>
  )
}
