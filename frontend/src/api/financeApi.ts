// AI-Generated Code - 2026-04-02 - Claude
import { apiFetch } from './client'
import type {
  CategoryTotalResponse,
  DashboardSummaryResponse,
  FinancialRecordResponse,
  LoginResponse,
  PageResponse,
  RecentActivityResponse,
  TrendPointResponse,
  UserResponse,
} from '../types'
import type { RecordType, Role } from '../types'

export function login(username: string, password: string) {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function fetchMe() {
  return apiFetch<UserResponse>('/api/auth/me')
}

export function fetchSummary() {
  return apiFetch<DashboardSummaryResponse>('/api/dashboard/summary')
}

export function fetchCategories() {
  return apiFetch<CategoryTotalResponse[]>('/api/dashboard/categories')
}

export function fetchTrends(months = 12) {
  return apiFetch<TrendPointResponse[]>(`/api/dashboard/trends?months=${months}`)
}

export function fetchRecent(limit = 10) {
  return apiFetch<RecentActivityResponse[]>(`/api/dashboard/recent?limit=${limit}`)
}

export function fetchRecords(params: {
  from?: string
  to?: string
  category?: string
  type?: RecordType
  q?: string
  page?: number
  size?: number
}) {
  const sp = new URLSearchParams()
  if (params.from) sp.set('from', params.from)
  if (params.to) sp.set('to', params.to)
  if (params.category) sp.set('category', params.category)
  if (params.type) sp.set('type', params.type)
  if (params.q) sp.set('q', params.q)
  sp.set('page', String(params.page ?? 0))
  sp.set('size', String(params.size ?? 20))
  return apiFetch<PageResponse<FinancialRecordResponse>>(`/api/records?${sp}`)
}

export function createRecord(body: {
  amount: number
  type: RecordType
  category: string
  recordDate: string
  notes?: string
}) {
  return apiFetch<FinancialRecordResponse>('/api/records', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateRecord(
  id: number,
  body: { amount: number; type: RecordType; category: string; recordDate: string; notes?: string }
) {
  return apiFetch<FinancialRecordResponse>(`/api/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteRecord(id: number) {
  return apiFetch<void>(`/api/records/${id}`, { method: 'DELETE' })
}

export function fetchUsers() {
  return apiFetch<UserResponse[]>('/api/users')
}

export function createUser(body: {
  username: string
  password: string
  email?: string
  role: Role
}) {
  return apiFetch<UserResponse>('/api/users', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function patchUserRole(id: number, role: Role) {
  return apiFetch<UserResponse>(`/api/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

export function patchUserStatus(id: number, active: boolean) {
  return apiFetch<UserResponse>(`/api/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
}
