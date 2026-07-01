export const endpoints = {
  auth: {
    login: 'api/auth/login',
    register: 'api/auth/register',
    logout: 'api/auth/logout',
    refresh: 'api/auth/refresh',
  },
  trips: {
    list: 'api/trips',
    detail: (id: string | number) => `api/trips/${id}`,
  },
  reservations: {
    create: 'api/reservations',
    mine: 'api/reservations/my',
  },
} as const
