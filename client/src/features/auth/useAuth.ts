import { login as loginRequest, register as registerRequest } from '../../api/auth.api'
import type { LoginInput, RegisterInput } from './auth.types'
import { useAuthStore } from './auth.store'

export function useAuth() {
  const { token, user, isAuthenticated, setSession, logout } = useAuthStore()

  const login = async (input: LoginInput) => {
    const session = await loginRequest(input)
    setSession(session)
    return session
  }

  const register = async (input: RegisterInput) => {
    const session = await registerRequest(input)
    setSession(session)
    return session
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
}