import { useAuthStore } from '../features/auth/auth.store'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export interface ApiEnvelope<T> {
  success?: boolean
  data?: T
  message?: string | string[]
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const formatApiMessage = (message: string | string[] | undefined) => {
  if (Array.isArray(message)) {
    return message.join(', ')
  }

  return message || 'Something went wrong. Please try again.'
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json()) as ApiEnvelope<T>

  if (!response.ok) {
    throw new ApiError(formatApiMessage(payload.message), response.status)
  }

  return payload.data as T
}
