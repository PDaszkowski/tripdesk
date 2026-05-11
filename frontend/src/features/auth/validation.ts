import type { RegisterPayload } from './types'

/** Email musi zawierać znak @ (walidacja po stronie klienta). */
export function emailContainsAt(email: string): boolean {
  return email.trim().includes('@')
}

/** Zwraca telefon zredukowany do samych cyfr (spacje i myślniki są pomijane). */
export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
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
