// AI-Generated Code - 2026-04-02 - Claude
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { user, login, loading } = useAuth()
  const loc = useLocation() as { state?: { from?: string } }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (!loading && user?.active) {
    const to = loc.state?.from && loc.state.from !== '/login' ? loc.state.from : '/'
    return <Navigate to={to} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setPending(true)
    try {
      await login(username, password)
    } catch (ex) {
      if (ex instanceof ApiError) setErr(ex.message)
      else setErr('Could not sign in')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.12),transparent_50%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800/80 bg-surface-card p-8 shadow-glow">
        <h1 className="font-display text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to your finance dashboard</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="u">
              Username
            </label>
            <input
              id="u"
              autoComplete="username"
              className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2.5 text-sm text-white outline-none ring-accent/40 focus:border-accent focus:ring-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400" htmlFor="p">
              Password
            </label>
            <input
              id="p"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2.5 text-sm text-white outline-none ring-accent/40 focus:border-accent focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && <p className="text-sm text-danger">{err}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-surface transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-slate-500">
          Demo: <span className="text-slate-400">admin / admin123</span> · analyst / analyst123 · viewer /
          viewer123
        </p>
      </div>
    </div>
  )
}
