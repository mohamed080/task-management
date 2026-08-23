import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '../features/auth/auth.types'
import { apiRequest } from './http'

export const login = (input: LoginInput) =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const register = (input: RegisterInput) =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const getMe = () => apiRequest<User>('/auth/me')
