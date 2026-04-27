import type { RegisterPayload, RegisterRole } from './types'

/** Email musi zawierać znak @ (walidacja po stronie klienta). */
export function emailContainsAt(email: string): boolean {
  return email.trim().includes('@')
}

/** Dokładnie 9 cyfr — liczone są tylko znaki 0–9 (spacje i myślniki są pomijane). */
export function hasExactlyNinePhoneDigits(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 9
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

/** Data (input type="date") musi być wybrana — niepusty ciąg, zwykle YYYY-MM-DD. */
export function isDateSet(value: string): boolean {
  return value.trim().length > 0
}

/** Zwraca komunikat błędu albo `null`, gdy wszystkie wymagane pola (wg roli) są uzupełnione. */
export function getRegisterFormValidationError(form: RegisterPayload): string | null {
  if (!form.email.trim()) {
    return 'Podaj adres email.'
  }
  if (!emailContainsAt(form.email)) {
    return 'Email musi zawierać znak @.'
  }
  if (!form.password.trim()) {
    return 'Podaj hasło.'
  }
  if (!form.firstName.trim()) {
    return 'Podaj imię.'
  }
  if (!form.lastName.trim()) {
    return 'Podaj nazwisko.'
  }
  if (!hasExactlyNinePhoneDigits(form.phoneNumber)) {
    return 'Numer telefonu musi zawierać dokładnie 9 cyfr.'
  }

  const role = form.role as RegisterRole
  if (role === 'ADMIN') {
    if (!form.agencyName.trim()) return 'Podaj nazwę agencji.'
    if (!form.agencyNip.trim()) return 'Podaj NIP agencji.'
  }
  if (role === 'CLIENT') {
    if (!form.passportNumber.trim()) return 'Podaj numer paszportu.'
    if (!isDateSet(form.passportExpiry)) return 'Ustaw datę ważności paszportu.'
  }
  return null
}

/** Przygotowanie payloadu do wysłania: trim pól tekstowych, telefon jako 9 cyfr. */
export function buildRegisterPayloadForApi(form: RegisterPayload): RegisterPayload {
  return {
    ...form,
    email: form.email.trim(),
    password: form.password.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: normalizePhoneDigits(form.phoneNumber),
    agencyName: form.agencyName.trim(),
    agencyNip: form.agencyNip.trim(),
    passportNumber: form.passportNumber.trim(),
    passportExpiry: form.passportExpiry.trim(),
  }
}
