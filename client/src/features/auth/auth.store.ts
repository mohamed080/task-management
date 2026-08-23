import { create } from 'zustand'

import type { AuthResponse, User } from './auth.types'

const tokenKey = 'task_manager_token'
const userKey = 'task_manager_user'

interface AuthState {
  token: string
  user: User | null
  isAuthenticated: boolean
  setSession: (session: AuthResponse) => void
  logout: () => void
}

const getStoredUser = () => {
  const user = localStorage.getItem(userKey)
  return user ? (JSON.parse(user) as User) : null
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(tokenKey) ?? '',
  user: getStoredUser(),
  isAuthenticated: Boolean(localStorage.getItem(tokenKey)),
  setSession: ({ token, user }) => {
    localStorage.setItem(tokenKey, token)
    localStorage.setItem(userKey, JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
    set({ token: '', user: null, isAuthenticated: false })
  },
}))
