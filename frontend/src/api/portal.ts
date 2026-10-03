import { apiRequest } from './client'
import type { AuthUser } from './auth'

export type PortalUser = AuthUser & {
  isActive: boolean
  createdAt: string
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: 'admin' | 'staff'
}

export type UpdateUserInput = {
  name?: string
  email?: string
  password?: string
  role?: 'admin' | 'staff'
  isActive?: boolean
}

export function fetchUsers() {
  return apiRequest<PortalUser[]>('/api/v1/users')
}

export function createUser(input: CreateUserInput) {
  return apiRequest<PortalUser>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateUser(id: string, input: UpdateUserInput) {
  return apiRequest<PortalUser>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function setUserActive(id: string, isActive: boolean) {
  return apiRequest<PortalUser>(`/api/v1/users/${id}/active`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
}
