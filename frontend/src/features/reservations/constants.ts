export const RESERVATION_STATUS: Record<
  string,
  { label: string; color: string }
> = {
  PAID: { label: 'Opłacona', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  PENDING: {
    label: 'Oczekująca',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  NEW: { label: 'Nowa', color: 'bg-sky-100 text-sky-600 border-sky-200' },
  CANCELLED: {
    label: 'Anulowana',
    color: 'bg-red-100 text-red-600 border-red-200',
  },
}

export const RESERVATION_STATUS_FALLBACK = {
  label: 'Nieznany',
  color: 'bg-slate-100 text-slate-500 border-slate-200',
}
