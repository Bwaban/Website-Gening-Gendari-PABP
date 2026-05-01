export const TOKEN_KEY = 'senilokal_token'
export const USER_KEY = 'senilokal_user'

type ErrorShape = {
  success?: boolean
  message?: string
  errors?: Array<{ msg?: string }>
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = new Headers(options.headers ?? {})

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  })

  const data: ErrorShape & T = await response
    .json()
    .catch(() => ({ message: 'Response API tidak valid.' } as ErrorShape & T))

  if (!response.ok || data.success === false) {
    const validationMessage = Array.isArray(data.errors) ? data.errors[0]?.msg : undefined
    throw new Error(data.message || validationMessage || 'Terjadi kesalahan')
  }

  return data as T
}
