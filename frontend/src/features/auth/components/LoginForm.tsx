import { useState } from 'react'
import type { SubmitEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { useAuth } from '../context/useAuth'
import { emailContainsAt } from '../validation'
import { AuthCard } from './AuthCard'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'

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
          Nie masz konta?{' '}
          <Link
            to="/register"
            className="text-sky-500 transition-colors hover:text-sky-600"
          >
            Zarejestruj się
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {error ? (
          <div className="rounded-lg border border-red-500 bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
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
        <PasswordInput
          id="login-password"
          label="Hasło"
          name="password"
          autoComplete="current-password"
          placeholder='•••••••••'
          required
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
