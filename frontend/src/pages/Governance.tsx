import { useEffect, useState } from 'react'
import { ShieldCheck, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react'
import { listArchitectures, approvePackage } from '../lib/api'
import { useSettings } from '../lib/settingsContext'
import type { ArchitectureSummary, ApprovalResult } from '../types/api'

export default function Governance() {
  const { tenantId, role, actor } = useSettings()
  const [packages, setPackages] = useState<ArchitectureSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | ''>('')
  const [comment, setComment] = useState('Architecture package reviewed and approved for production.')
  const [result, setResult] = useState<ApprovalResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canApprove = role === 'REVIEWER' || role === 'ADMIN'

  useEffect(() => {
    listArchitectures(tenantId, role).then(pkgs => {
      setPackages(pkgs)
      const first = pkgs.find(p => !p.approved)
      if (first) setSelectedId(first.id)
    }).catch(e => setError(e.message))
  }, [tenantId, role])

  async function handleApprove() {
    if (!selectedId) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await approvePackage(selectedId as number, actor, comment, tenantId, role)
      setResult(res)
      setPackages(prev => prev.map(p => p.id === selectedId ? { ...p, approved: true, status: 'approved' } : p))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Approval failed')
    } finally {
      setLoading(false)
    }
  }

  const selected = packages.find(p => p.id === selectedId)
  const pending = packages.filter(p => !p.approved)
  const approved = packages.filter(p => p.approved)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-400" />
          Governance & Approval
        </h1>
        <p className="text-sm text-slate-500">Role-gated approval workflow with audit trail · FR6</p>
      </div>

      {/* Role notice */}
      {!canApprove && (
        <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <div>
            <span className="font-medium">REVIEWER or ADMIN role required to approve.</span>
            {' '}Your current role is <span className="font-mono">{role}</span>. Change it in <a href="/settings" className="text-brand-400 hover:text-brand-300">Settings</a>.
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-6">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Approval form */}
        <div className="card space-y-5">
          <div>
            <label className="label">Select Package to Approve</label>
            <select className="select" value={selectedId} onChange={e => { setSelectedId(Number(e.target.value) || ''); setResult(null) }}>
              <option value="">— choose a package —</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.id} {p.name} (v{p.version}) {p.approved ? '✓ Approved' : ''}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`badge border text-[10px] ${
                  selected.approved
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-600/30'
                }`}>{selected.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Version</span>
                <span className="text-xs text-slate-300">v{selected.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Last Updated</span>
                <span className="text-xs text-slate-300">{new Date(selected.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div>
            <label className="label">Approval Comment</label>
            <textarea className="input resize-none" rows={4} value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Describe the review outcome and any conditions…" />
          </div>

          <button
            type="button"
            disabled={!selectedId || !canApprove || loading || selected?.approved}
            onClick={handleApprove}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Approving…</>
              : selected?.approved
              ? <><CheckCircle className="w-4 h-4" /> Already Approved</>
              : <><ShieldCheck className="w-4 h-4" /> Approve Package</>}
          </button>
        </div>

        {/* Queues */}
        <div className="space-y-4">
          {result && (
            <div className="card border-emerald-700/40 bg-emerald-900/10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">Approved Successfully</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved by</span>
                  <span className="text-slate-300 font-mono">{result.approved_by}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Version</span>
                  <span className="text-slate-300">v{result.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="text-slate-300">{new Date(result.approved_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold">Pending Review</span>
              <span className="badge bg-amber-500/10 text-amber-400 text-[10px]">{pending.length}</span>
            </div>
            {pending.length === 0
              ? <p className="text-xs text-slate-600">All packages approved.</p>
              : pending.map(p => (
                  <div key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors">
                    <div className="text-xs font-medium text-slate-300">{p.name}</div>
                    <div className="text-[10px] text-slate-600">v{p.version}</div>
                  </div>
                ))
            }
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Approved</span>
              <span className="badge bg-emerald-500/10 text-emerald-400 text-[10px]">{approved.length}</span>
            </div>
            {approved.length === 0
              ? <p className="text-xs text-slate-600">No approvals yet.</p>
              : approved.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg">
                    <div className="text-xs font-medium text-slate-300">{p.name}</div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> v{p.version}
                    </span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
