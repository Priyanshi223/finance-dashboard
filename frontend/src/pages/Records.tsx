// AI-Generated Code - 2026-04-02 - Claude
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import * as api from '../api/financeApi'
import { useAuth } from '../context/AuthContext'
import type { FinancialRecordResponse, RecordType } from '../types'

function money(n: string | number) {
  const v = typeof n === 'string' ? parseFloat(n) : n
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v || 0)
}

const emptyForm = {
  amount: '',
  type: 'EXPENSE' as RecordType,
  category: '',
  recordDate: new Date().toISOString().slice(0, 10),
  notes: '',
}

export function Records() {
  const { canViewRecords, canManageRecords } = useAuth()
  const [rows, setRows] = useState<FinancialRecordResponse[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({ from: '', to: '', category: '', type: '' as '' | RecordType, q: '' })
  const [err, setErr] = useState<string | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<FinancialRecordResponse | null>(null)
  const [form, setForm] = useState(emptyForm)

  const load = useCallback(async () => {
    try {
      const res = await api.fetchRecords({
        from: filters.from || undefined,
        to: filters.to || undefined,
        category: filters.category || undefined,
        type: filters.type || undefined,
        q: filters.q || undefined,
        page,
        size: 15,
      })
      setRows(res.content)
      setTotalPages(res.totalPages)
      setErr(null)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to load records')
    }
  }, [filters, page])

  useEffect(() => {
    void load()
  }, [load])

  if (!canViewRecords) return <Navigate to="/" replace />

  function openCreate() {
    setForm(emptyForm)
    setModal('create')
  }

  function openEdit(r: FinancialRecordResponse) {
    setEditing(r)
    setForm({
      amount: String(r.amount),
      type: r.type,
      category: r.category,
      recordDate: r.recordDate,
      notes: r.notes ?? '',
    })
    setModal('edit')
  }

  async function submitForm(e: FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (Number.isNaN(amount) || amount <= 0) {
      setErr('Amount must be a positive number')
      return
    }
    try {
      if (modal === 'create') {
        await api.createRecord({
          amount,
          type: form.type,
          category: form.category,
          recordDate: form.recordDate,
          notes: form.notes || undefined,
        })
      } else if (modal === 'edit' && editing) {
        await api.updateRecord(editing.id, {
          amount,
          type: form.type,
          category: form.category,
          recordDate: form.recordDate,
          notes: form.notes || undefined,
        })
      }
      setModal(null)
      setEditing(null)
      await load()
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Save failed')
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Delete this record?')) return
    try {
      await api.deleteRecord(id)
      await load()
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-white">Records</h1>
          <p className="text-slate-400">Filter and browse financial entries</p>
        </div>
        {canManageRecords && (
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface hover:brightness-110"
          >
            New record
          </button>
        )}
      </div>

      {err && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{err}</div>
      )}

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-800/80 bg-surface-card p-4">
        <input
          type="date"
          className="rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
        />
        <input
          type="date"
          className="rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
        />
        <input
          placeholder="Category"
          className="rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        />
        <select
          className="rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as '' | RecordType }))}
        >
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <input
          placeholder="Search notes"
          className="min-w-[160px] flex-1 rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <button
          type="button"
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-surface-elevated"
          onClick={() => {
            setPage(0)
            void load()
          }}
        >
          Apply
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-surface-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated/50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">By</th>
              {canManageRecords && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-300">
                <td className="px-4 py-3 whitespace-nowrap">{r.recordDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.type === 'INCOME' ? 'text-income' : 'text-expense'
                    }
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3 text-right font-medium text-white">{money(r.amount)}</td>
                <td className="max-w-xs truncate px-4 py-3 text-slate-500">{r.notes ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{r.createdByUsername ?? '—'}</td>
                {canManageRecords && (
                  <td className="px-4 py-3 text-right space-x-2">
                    <button type="button" className="text-accent hover:underline" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <button type="button" className="text-danger hover:underline" onClick={() => onDelete(r.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <button
          type="button"
          disabled={page <= 0}
          className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.max(1, totalPages)}
        </span>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          className="rounded border border-slate-700 px-3 py-1 disabled:opacity-40"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-surface-card p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">
              {modal === 'create' ? 'New record' : 'Edit record'}
            </h2>
            <form className="mt-4 space-y-3" onSubmit={submitForm}>
              <div>
                <label className="text-xs text-slate-500">Amount</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Type</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as RecordType }))}
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Category</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Date</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                  value={form.recordDate}
                  onChange={(e) => setForm((f) => ({ ...f, recordDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Notes</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-surface px-3 py-2 text-sm text-white"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
                  onClick={() => {
                    setModal(null)
                    setEditing(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
