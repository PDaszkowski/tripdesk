import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
} from 'react-icons/hi2'
import { HTTPError } from '@/shared/api/httpClient'
import { useRegisterMutation } from '../api/register'
import type { RegisterPayload } from '../types'
import { buildRegisterPayloadForApi } from '../validation'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/shared/lib/cn'

type Step = 1 | 2

const emptyPayload: RegisterPayload = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'CLIENT',
  agencyName: '',
  agencyNip: '',
  passportNumber: '',
  passportExpiry: '',
}

async function formatError(err: unknown): Promise<string> {
  if (err instanceof HTTPError) {
    try {
      const text = await err.response.clone().text()
      if (text && !text.startsWith('<')) return text
    } catch {
      // ignore
    }
    if (err.response.status === 400) return 'Sprawdź poprawność danych.'
    return `Błąd serwera (${err.response.status}).`
  }
  return 'Rejestracja nie powiodła się.'
}

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<RegisterPayload>(emptyPayload)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleChange<K extends keyof RegisterPayload>(
    key: K,
    value: RegisterPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validateStep1(): string | null {
    if (!form.email.trim()) return 'Podaj adres email.'
    if (!form.email.includes('@')) return 'Email musi zawierać znak @.'
    if (!form.password.trim()) return 'Podaj hasło.'
    if (form.password.length < 8) return 'Hasło musi mieć minimum 8 znaków.'
    if (form.password !== confirmPassword) return 'Hasła nie są identyczne.'
    if (!form.firstName.trim()) return 'Podaj imię.'
    if (!form.lastName.trim()) return 'Podaj nazwisko.'
    if (form.phoneNumber.replace(/\D/g, '').length !== 9) {
      return 'Numer telefonu musi zawierać dokładnie 9 cyfr.'
    }
    return null
  }

  function validateStep2(): string | null {
    if (!form.passportNumber.trim()) return 'Podaj numer paszportu.'
    if (!form.passportExpiry.trim()) return 'Ustaw datę ważności paszportu.'
    return null
  }

  function goBack() {
    setError(null)
    registerMutation.reset()
    setStep(1)
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    registerMutation.reset()

    if (step === 1) {
      const err = validateStep1()
      if (err) {
        setError(err)
        return
      }
      setStep(2)
      return
    }

    const step1Err = validateStep1()
    if (step1Err) {
      setError(step1Err)
      setStep(1)
      return
    }
    const step2Err = validateStep2()
    if (step2Err) {
      setError(step2Err)
      return
    }

    const payload = buildRegisterPayloadForApi(form)

    registerMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/login', {
          replace: false,
          state: { registeredEmail: payload.email },
        })
      },
      onError: async (err) => {
        setError(await formatError(err))
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Stepper currentStep={step} />

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl text-slate-900">
          {step === 1 ? 'Utwórz konto' : 'Weryfikacja dokumentów'}
        </h1>
        <p className="text-sm text-slate-500">
          {step === 1
            ? 'Wypełnij dane, aby rozpocząć'
            : 'Podaj dane z dokumentu tożsamości'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-500 bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <Input
              id="reg-email"
              label="Adres email"
              type="email"
              autoComplete="email"
              required
              placeholder="twoj@email.com"
              icon={<HiOutlineEnvelope size={18} />}
              value={form.email}
              onChange={(ev) => handleChange('email', ev.target.value)}
            />
            <PasswordInput
              id="reg-password"
              label="Hasło"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Minimum 8 znaków"
              value={form.password}
              onChange={(ev) => handleChange('password', ev.target.value)}
            />
            <PasswordInput
              id="reg-confirm"
              label="Potwierdź hasło"
              autoComplete="new-password"
              required
              placeholder="Wpisz hasło ponownie"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
            <Input
              id="reg-first"
              label="Imię"
              autoComplete="given-name"
              required
              placeholder="Jan"
              icon={<HiOutlineUser size={18} />}
              value={form.firstName}
              onChange={(ev) => handleChange('firstName', ev.target.value)}
            />
            <Input
              id="reg-last"
              label="Nazwisko"
              autoComplete="family-name"
              required
              placeholder="Kowalski"
              icon={<HiOutlineUser size={18} />}
              value={form.lastName}
              onChange={(ev) => handleChange('lastName', ev.target.value)}
            />
            <Input
              id="reg-phone"
              label="Telefon"
              type="tel"
              autoComplete="tel"
              required
              placeholder="123 456 789"
              icon={<HiOutlinePhone size={18} />}
              value={form.phoneNumber}
              onChange={(ev) => handleChange('phoneNumber', ev.target.value)}
            />

            <Button variant="primary" fullWidth type="submit" className="mt-2">
              Dalej
              <HiOutlineChevronRight size={18} />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="border-b border-slate-200 pb-3">
              <div className="mb-1 flex items-center gap-2">
                <HiOutlineDocumentText size={20} className="text-sky-500" />
                <h3 className="text-base font-semibold text-slate-900">
                  Dane paszportu
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                Wprowadź informacje z dokumentu tożsamości
              </p>
            </div>

            <Input
              id="reg-passport"
              label="Numer paszportu"
              required
              placeholder="AB1234567"
              icon={<HiOutlineIdentification size={18} />}
              value={form.passportNumber}
              onChange={(ev) =>
                handleChange('passportNumber', ev.target.value.toUpperCase())
              }
            />
            <Input
              id="reg-expiry"
              label="Data ważności paszportu"
              type="date"
              required
              icon={<HiOutlineCalendarDays size={18} />}
              value={form.passportExpiry}
              onChange={(ev) => handleChange('passportExpiry', ev.target.value)}
            />

            <div className="rounded-lg border border-sky-500 bg-sky-100 p-4 text-sm text-slate-800">
              Twoje dane są bezpieczne i szyfrowane. Używamy ich wyłącznie do
              weryfikacji tożsamości.
            </div>

            <div className="mt-2 flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={goBack}
                className="flex-1"
                disabled={registerMutation.isPending}
              >
                <HiOutlineChevronLeft size={18} />
                Wróć
              </Button>
              <Button
                variant="secondary"
                type="submit"
                disabled={registerMutation.isPending}
                className="flex-1"
              >
                {registerMutation.isPending ? 'Wysyłanie…' : 'Zarejestruj się'}
              </Button>
            </div>
          </>
        )}
      </form>

      {step === 1 && (
        <div className="mt-8 text-center text-sm text-slate-500">
          Masz już konto?{' '}
          <Link
            to="/login"
            className="text-sky-500 transition-colors hover:text-sky-600"
          >
            Zaloguj się
          </Link>
        </div>
      )}
    </div>
  )
}

function Stepper({ currentStep }: { currentStep: Step }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <StepBadge
        number={1}
        label="Konto"
        current={currentStep === 1}
        reached={currentStep >= 1}
      />
      <div className="mx-4 h-0.5 flex-1 bg-slate-200">
        <div
          className={cn(
            'h-full bg-sky-500 transition-all duration-300',
            currentStep >= 2 ? 'w-full' : 'w-0',
          )}
        />
      </div>
      <StepBadge
        number={2}
        label="Dokumenty"
        current={currentStep === 2}
        reached={currentStep >= 2}
      />
    </div>
  )
}

function StepBadge({
  number,
  label,
  current,
  reached,
}: {
  number: number
  label: string
  current: boolean
  reached: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all',
          reached ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500',
        )}
      >
        {number}
      </div>
      <span
        className={cn(
          'text-sm',
          current ? 'text-slate-800' : 'text-slate-500',
        )}
      >
        {label}
      </span>
    </div>
  )
}
