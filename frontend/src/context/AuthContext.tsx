// AI-Generated Code - 2026-04-02 - Claude
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError, getToken, setToken } from '../api/client'
import * as api from '../api/financeApi'
import type { UserResponse } from '../types'

type AuthState = {
  user: UserResponse | null
  loading: boolean
  error: string | null
}

type AuthContextValue = AuthState & {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  canViewRecords: boolean
  canManageRecords: boolean
  canManageUsers: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await api.fetchMe()
      setUser(me)
      setError(null)
    } catch (e) {
      setUser(null)
      setToken(null)
      if (e instanceof ApiError && e.status === 401) setError(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = useCallback(async (username: string, password: string) => {
    setError(null)
    const res = await api.login(username, password)
    setToken(res.token)
    setUser({
      id: 0,
      username: res.username,
      email: null,
      role: res.role,
      active: res.active,
    })
    const me = await api.fetchMe()
    setUser(me)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const role = user?.role
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      refreshUser,
      canViewRecords: role === 'ANALYST' || role === 'ADMIN',
      canManageRecords: role === 'ADMIN',
      canManageUsers: role === 'ADMIN',
    }),
    [user, loading, error, login, logout, refreshUser, role]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
