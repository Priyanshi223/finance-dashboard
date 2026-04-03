// AI-Generated Code - 2026-04-02 - Claude
export type Role = 'VIEWER' | 'ANALYST' | 'ADMIN'
export type RecordType = 'INCOME' | 'EXPENSE'

export interface UserResponse {
  id: number
  username: string
  email: string | null
  role: Role
  active: boolean
}

export interface LoginResponse {
  token: string
  tokenType: string
  username: string
  role: Role
  active: boolean
}

export interface FinancialRecordResponse {
  id: number
  amount: string
  type: RecordType
  category: string
  recordDate: string
  notes: string | null
  createdAt: string
  createdByUsername: string | null
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface DashboardSummaryResponse {
  totalIncome: string
  totalExpense: string
  netBalance: string
  incomeCount: number
  expenseCount: number
}

export interface CategoryTotalResponse {
  category: string
  type: RecordType
  total: string
  count: number
}

export interface TrendPointResponse {
  period: string
  income: string
  expense: string
}

export interface RecentActivityResponse {
  id: number
  amount: string
  type: RecordType
  category: string
  recordDate: string
  notes: string | null
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  details: string[]
  path: string
}
