import { apiRequest } from './client'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  isActive?: boolean
  createdAt?: string
}

export function login(email: string, password: string) {
  return apiRequest<{ user: AuthUser }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchMe() {
  return apiRequest<AuthUser>('/api/v1/auth/me')
}

export function refreshSession() {
  return apiRequest<{ ok: boolean }>('/api/v1/auth/refresh', { method: 'POST' })
}

export function logout() {
  return apiRequest<{ ok: boolean }>('/api/v1/auth/logout', { method: 'POST' })
}
