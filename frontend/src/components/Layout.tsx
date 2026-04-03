// AI-Generated Code - 2026-04-02 - Claude
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-accent/15 text-accent shadow-glow'
      : 'text-slate-400 hover:bg-surface-elevated hover:text-slate-200'
  }`

export function Layout() {
  const { user, logout, canViewRecords, canManageUsers } = useAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-slate-800/80 bg-surface-card px-3 py-6">
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-semibold tracking-tight text-white">FinDash</p>
          <p className="mt-1 text-xs text-slate-500">Finance control center</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          {canViewRecords && (
            <NavLink to="/records" className={linkClass}>
              Records
            </NavLink>
          )}
          {canManageUsers && (
            <NavLink to="/users" className={linkClass}>
              Users
            </NavLink>
          )}
        </nav>
        <div className="mt-auto border-t border-slate-800/80 pt-4">
          <p className="truncate px-2 text-xs text-slate-500">{user?.username}</p>
          <p className="px-2 text-[10px] uppercase tracking-wider text-accent/80">{user?.role}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-lg border border-slate-700 py-2 text-xs text-slate-300 hover:bg-surface-elevated"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
