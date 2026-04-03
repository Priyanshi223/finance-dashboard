// AI-Generated Code - 2026-04-02 - Claude
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ApiError } from '../api/client'
import * as api from '../api/financeApi'
import { useAuth } from '../context/AuthContext'
import type { CategoryTotalResponse, DashboardSummaryResponse, RecentActivityResponse, TrendPointResponse } from '../types'

function money(n: string | number) {
  const v = typeof n === 'string' ? parseFloat(n) : n
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v || 0)
}

function Card({
  title,
  value,
  sub,
  tone,
}: {
  title: string
  value: string
  sub?: string
  tone?: 'default' | 'income' | 'expense'
}) {
  const toneCls =
    tone === 'income' ? 'text-income' : tone === 'expense' ? 'text-expense' : 'text-white'
  return (
    <div className="rounded-xl border border-slate-800/80 bg-surface-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${toneCls}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null)
  const [categories, setCategories] = useState<CategoryTotalResponse[]>([])
  const [trends, setTrends] = useState<TrendPointResponse[]>([])
  const [recent, setRecent] = useState<RecentActivityResponse[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const [s, c, t, r] = await Promise.all([
          api.fetchSummary(),
          api.fetchCategories(),
          api.fetchTrends(12),
          api.fetchRecent(8),
        ])
        if (!cancel) {
          setSummary(s)
          setCategories(c)
          setTrends(t)
          setRecent(r)
          setErr(null)
        }
      } catch (e) {
        if (!cancel) {
          setErr(e instanceof ApiError ? e.message : 'Failed to load dashboard')
        }
      }
    })()
    return () => {
      cancel = true
    }
  }, [])

  const chartData = trends.map((p) => ({
    period: p.period,
    income: Number(p.income),
    expense: Number(p.expense),
  }))

  const catExpense = categories.filter((c) => c.type === 'EXPENSE')
  const catBar = catExpense.map((c) => ({
    name: c.category,
    total: Number(c.total),
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          Signed in as <span className="text-slate-200">{user?.username}</span> — summaries respect your role
          (viewers see activity without notes).
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{err}</div>
      )}

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Total income" value={money(summary.totalIncome)} sub={`${summary.incomeCount} entries`} tone="income" />
          <Card title="Total expenses" value={money(summary.totalExpense)} sub={`${summary.expenseCount} entries`} tone="expense" />
          <Card title="Net balance" value={money(summary.netBalance)} />
          <Card title="Activity" value={`${summary.incomeCount + summary.expenseCount}`} sub="Total records" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800/80 bg-surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-white">Monthly trends</h2>
          <p className="text-xs text-slate-500">Income vs expense by month</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a222d', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={(value) => money(Number(value))}
                />
                <Legend />
                <Bar dataKey="income" fill="#4ade80" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#fb923c" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-white">Expenses by category</h2>
          <p className="text-xs text-slate-500">Where spending concentrates</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catBar} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={88} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a222d', border: '1px solid #334155', borderRadius: 8 }}
                  formatter={(value) => money(Number(value))}
                />
                <Bar dataKey="total" fill="#34d399" name="Total" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-surface-card overflow-hidden">
        <div className="border-b border-slate-800/80 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-white">Recent activity</h2>
          <p className="text-xs text-slate-500">Latest entries (notes hidden for viewers)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-elevated/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recent.map((r) => (
                <tr key={r.id} className="text-slate-300">
                  <td className="px-5 py-3 whitespace-nowrap">{r.recordDate}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        r.type === 'INCOME'
                          ? 'rounded-full bg-income/15 px-2 py-0.5 text-xs text-income'
                          : 'rounded-full bg-expense/15 px-2 py-0.5 text-xs text-expense'
                      }
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">{r.category}</td>
                  <td className="px-5 py-3 text-right font-medium text-white">{money(r.amount)}</td>
                  <td className="px-5 py-3 text-slate-500">{r.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
