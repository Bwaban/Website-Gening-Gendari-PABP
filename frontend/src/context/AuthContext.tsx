import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { TOKEN_KEY, USER_KEY, apiRequest } from '../api/client'
import type { AuthUser, RegisterData } from '../types'

interface AuthResponse {
  success: boolean
  message?: string
  token: string
  user: AuthUser
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const readStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY))
    setUser(readStoredUser())
    setLoading(false)
  }, [])

  const saveSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiRequest<AuthResponse>('/auth/masuk', {
        method: 'POST',
        body: JSON.stringify({
          username: email,
          password,
        }),
      })

      saveSession(response.token, response.user)
    },
    [saveSession]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      const response = await apiRequest<AuthResponse>('/auth/daftar', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      saveSession(response.token, response.user)
    },
    [saveSession]
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [loading, login, logout, register, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
