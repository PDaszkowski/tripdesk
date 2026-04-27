import { useState } from 'react'
import type { SubmitEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import type { RegisterPayload, RegisterRole } from '../types'
import {
  buildRegisterPayloadForApi,
  getRegisterFormValidationError,
} from '../validation'
import { AuthCard } from './AuthCard'
import styles from './RegisterForm.module.css'

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

export function RegisterForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterPayload>(emptyPayload)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  function handleChange<K extends keyof RegisterPayload>(
    key: K,
    value: RegisterPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const validationError = getRegisterFormValidationError(form)
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = buildRegisterPayloadForApi(form)
    const emailTrim = payload.email

    setPending(true)
    try {
      await registerUser(payload)
      navigate('/login', {
        replace: false,
        state: { registeredEmail: emailTrim },
      })
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.status === 400
            ? 'Sprawdź poprawność danych.'
            : 'Rejestracja nie powiodła się.'
        : 'Rejestracja nie powiodła się.'
      setError(msg)
    } finally {
      setPending(false)
    }
  }

  const role = form.role as RegisterRole

  return (
    <AuthCard
      title="Rejestracja"
      subtitle="Utwórz swoje konto TripDesk."
      footer={
        <>
          Masz już konto?
          <Link to="/login">Zaloguj się</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error ? <div className={styles.error}>{error}</div> : null}

        <p className={styles.sectionLabel}>Konto</p>
        <div className={`${styles.row} ${styles.rowTwo}`}>
          <div className={styles.field}>
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(ev) => handleChange('email', ev.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="reg-password">Hasło</label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(ev) => handleChange('password', ev.target.value)}
            />
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowTwo}`}>
          <div className={styles.field}>
            <label htmlFor="reg-first">Imię</label>
            <input
              id="reg-first"
              autoComplete="given-name"
              required
              value={form.firstName}
              onChange={(ev) => handleChange('firstName', ev.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="reg-last">Nazwisko</label>
            <input
              id="reg-last"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={(ev) => handleChange('lastName', ev.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-phone">Telefon</label>
          <input
            id="reg-phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phoneNumber}
            onChange={(ev) => handleChange('phoneNumber', ev.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-role">Rola</label>
          <select
            id="reg-role"
            required
            value={form.role}
            onChange={(ev) =>
              handleChange('role', ev.target.value as RegisterRole)
            }
          >
            <option value="CLIENT">Klient</option>
            <option value="AGENT">Agent</option>
            <option value="ADMIN">Administrator agencji</option>
          </select>
        </div>

        {role === 'ADMIN' ? (
          <>
            <p className={styles.sectionLabel}>Agencja</p>
            <div className={`${styles.row} ${styles.rowTwo}`}>
              <div className={styles.field}>
                <label htmlFor="reg-agency">Nazwa agencji</label>
                <input
                  id="reg-agency"
                  required
                  value={form.agencyName}
                  onChange={(ev) => handleChange('agencyName', ev.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="reg-nip">NIP</label>
                <input
                  id="reg-nip"
                  required
                  value={form.agencyNip}
                  onChange={(ev) => handleChange('agencyNip', ev.target.value)}
                />
              </div>
            </div>
          </>
        ) : null}

        {role === 'CLIENT' ? (
          <>
            <p className={styles.sectionLabel}>Klient — dokument</p>
            <div className={`${styles.row} ${styles.rowTwo}`}>
              <div className={styles.field}>
                <label htmlFor="reg-passport">Numer paszportu</label>
                <input
                  id="reg-passport"
                  required
                  value={form.passportNumber}
                  onChange={(ev) =>
                    handleChange('passportNumber', ev.target.value)
                  }
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="reg-expiry">Ważność paszportu</label>
                <input
                  id="reg-expiry"
                  type="date"
                  required
                  value={form.passportExpiry}
                  onChange={(ev) =>
                    handleChange('passportExpiry', ev.target.value)
                  }
                />
              </div>
            </div>
          </>
        ) : null}

        <button className={styles.submit} type="submit" disabled={pending}>
          {pending ? 'Wysyłanie…' : 'Zarejestruj się'}
        </button>
      </form>
    </AuthCard>
  )
}
