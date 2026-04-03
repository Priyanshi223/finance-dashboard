// AI-Generated Code - 2026-04-02 - Claude
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import * as api from '../api/financeApi'
import { useAuth } from '../context/AuthContext'
import type { Role, UserResponse } from '../types'

export function Users() {
  const { canManageUsers } = useAuth()
  const [users, setUsers] = useState<UserResponse[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'VIEWER' as Role,
  })

  const load = useCallback(async () => {
    try {
      const list = await api.fetchUsers()
      setUsers(list)
      setErr(null)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to load users')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (!canManageUsers) return <Navigate to="/" replace />

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    try {
      await api.createUser({
        username: form.username,
        password: form.password,
        email: form.email || undefined,
        role: form.role,
      })
      setShowCreate(false)
      setForm({ username: '', password: '', email: '', role: 'VIEWER' })
      await load()
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Create failed')
    }
  }

  async function toggleRole(u: UserResponse, role: Role) {
    try {
      await api.patchUserRole(u.id, role)
      await load()
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Update failed')
    }
  }

  async function toggleActive(u: UserResponse) {
    try {
      await api.patchUserStatus(u.id, !u.active)
      await load()
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Users</h1>
          <p className="text-slate-400">Manage roles and account status</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface hover:brightness-110"
        >
          Add user
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{err}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-surface-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated/50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {users.map((u) => (
              <tr key={u.id} className="text-slate-300">
                <td className="px-4 py-3 font-medium text-white">{u.username}</td>
                <td className="px-4 py-3 text-slate-500">{u.email ?? '—'}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded border border-slate-700 bg-surface px-2 py-1 text-xs text-white"
                    value={u.role}
                    onChange={(e) => void toggleRole(u, e.target.value as Role)}
                  >
                    <option value="VIEWER">VIEWER</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.active ? 'text-income' : 'text-danger'
                    }
                  >
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => void toggleActive(u)}
                  >
                    {u.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-surface-card p-6">
            <h2 className="font-display text-lg font-semibold text-white">New user</h2>
            <form className="mt-4 space-y-3" onSubmit={onCreate}>
              <input
                placeholder="Username"
                className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                required
              />
              <input
                type="password"
                placeholder="Password (min 6)"
                className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
              <input
                type="email"
                placeholder="Email (optional)"
                className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <select
                className="w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              >
                <option value="VIEWER">VIEWER</option>
                <option value="ANALYST">ANALYST</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
