import ky, { HTTPError } from 'ky'
import { tokenStorage } from './tokenStorage'

const baseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const data = await ky
    .post('api/auth/refresh', {
      prefix: baseUrl,
      json: { refreshToken },
    })
    .json<{ accessToken: string; refreshToken: string }>()

  tokenStorage.setTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

function handleAuthFailure(): void {
  tokenStorage.clear()
  try {
    localStorage.removeItem('tripdesk_auth_user')
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login'
  }
}

export const httpClient = ky.extend({
  prefix: baseUrl,
  retry: {
    limit: 1,
    methods: ['get', 'post', 'put', 'patch', 'delete'],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = tokenStorage.getAccessToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401) return
        if (retryCount > 0) return

        const url = new URL(request.url)
        if (url.pathname.startsWith('/api/auth/')) return

        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        try {
          const newToken = await refreshPromise
          const headers = new Headers(request.headers)
          headers.set('Authorization', `Bearer ${newToken}`)
          return ky.retry({
            request: new Request(request, { headers }),
            code: 'TOKEN_REFRESHED',
          })
        } catch {
          handleAuthFailure()
          return
        }
      },
    ],
  },
})

export { HTTPError }
