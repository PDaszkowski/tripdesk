import { useState } from 'react'
import type { SubmitEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2'
import { useAuth } from '../context/useAuth'
import { emailContainsAt } from '../validation'
import { AuthCard } from './AuthCard'
import { Input } from '@/shared/ui/Input'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
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
        <Input
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder='twój@email.com'
          required
          icon={<HiOutlineEnvelope size={18} />}
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <Input
          id="login-password"
          label="Hasło"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder='•••••••••'
          required
          icon={<HiOutlineLockClosed size={18} />}
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <Checkbox
          id="login-remember"
          name="rememberMe"
          label="Zapamiętaj mnie"
          checked={rememberMe}
          onChange={(ev) => setRememberMe(ev.target.checked)}
        />
        <Button variant="primary" fullWidth type="submit" disabled={pending}>
          {pending ? 'Logowanie…' : 'Zaloguj'}
        </Button>
      </form>
    </AuthCard>
  )
}
