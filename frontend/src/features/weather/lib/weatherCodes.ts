export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 84) return '🌦️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

export function weatherLabel(code: number): string {
  if (code === 0) return 'Słonecznie'
  if (code <= 2) return 'Częściowe zachmurzenie'
  if (code === 3) return 'Pochmurno'
  if (code <= 49) return 'Mgła'
  if (code <= 69) return 'Deszcz'
  if (code <= 79) return 'Śnieg'
  if (code <= 84) return 'Przelotny deszcz'
  if (code <= 99) return 'Burza'
  return 'Różnie'
}
