// AI-Generated Code - 2026-04-02 - Claude
import type { ApiErrorResponse } from '../types'

const API_BASE =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : ''

const TOKEN_KEY = 'finance_dashboard_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function buildUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}

export class ApiError extends Error {
  status: number
  body: ApiErrorResponse | null

  constructor(message: string, status: number, body: ApiErrorResponse | null) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(buildUrl(path), { ...options, headers })
  const text = await res.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      /* plain text */
    }
  }

  if (!res.ok) {
    const body = json as ApiErrorResponse | null
    const msg =
      body?.message ||
      (typeof json === 'object' && json && 'message' in json
        ? String((json as { message?: string }).message)
        : res.statusText)
    throw new ApiError(msg || 'Request failed', res.status, body)
  }

  return json as T
}
