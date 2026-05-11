import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { HTTPError } from '@/shared/api/httpClient'
import { useLoginMutation } from '../api/login'
import { emailContainsAt } from '../validation'
import { AuthCard } from './AuthCard'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'

function formatError(err: unknown): string {
  if (err instanceof HTTPError) {
    if (err.response.status === 401 || err.response.status === 403) {
      return 'Nieprawidłowy email lub hasło.'
    }
    return `Błąd serwera (${err.response.status}).`
  }
  return 'Logowanie nie powiodło się.'
}

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const error =
    localError ?? (loginMutation.error ? formatError(loginMutation.error) : null)

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setLocalError(null)
    loginMutation.reset()

    const emailTrim = email.trim()
    if (!emailContainsAt(emailTrim)) {
      setLocalError('Email musi zawierać znak @.')
      return
    }

    loginMutation.mutate(
      { email: emailTrim, password },
      {
        onSuccess: () => navigate('/'),
      },
    )
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
            className="font-medium text-sky-500 transition-colors hover:text-sky-600"
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
          placeholder="twój@email.com"
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
          placeholder="•••••••••"
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
        <Button
          variant="primary"
          fullWidth
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logowanie…' : 'Zaloguj'}
        </Button>
      </form>
    </AuthCard>
  )
}
