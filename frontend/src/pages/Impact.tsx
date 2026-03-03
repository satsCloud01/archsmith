import { useEffect, useState } from 'react'
import { Zap, Plus, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { listArchitectures, runImpact } from '../lib/api'
import { useSettings } from '../lib/settingsContext'
import type { ArchitectureSummary, ImpactResult } from '../types/api'

const SEVERITY_STYLE: Record<string, string> = {
  low:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high:   'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function Impact() {
  const { tenantId, role, actor } = useSettings()
  const [packages, setPackages] = useState<ArchitectureSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | ''>('')
  const [removedServices, setRemovedServices] = useState<string[]>([''])
  const [renamedApis, setRenamedApis] = useState<{ from: string; to: string }[]>([{ from: '', to: '' }])
  const [modifiedEntities, setModifiedEntities] = useState<string[]>([''])
  const [result, setResult] = useState<ImpactResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    listArchitectures(tenantId, role).then(setPackages).catch(e => setError(e.message))
  }, [tenantId, role])

  async function handleRun() {
    if (!selectedId) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await runImpact(
        selectedId as number,
        {
          actor,
          proposed_changes: {
            removed_services: removedServices.filter(Boolean),
            renamed_apis: renamedApis.filter(r => r.from && r.to),
            modified_entities: modifiedEntities.filter(Boolean),
          },
        },
        tenantId,
        role,
      )
      setResult(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Impact analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-400" />
          Impact Analysis
        </h1>
        <p className="text-sm text-slate-500">Breaking change detection and migration planning · FR3</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-6">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="card space-y-5">
          <div>
            <label className="label">Select Package</label>
            <select className="select" value={selectedId} onChange={e => setSelectedId(Number(e.target.value) || '')}>
              <option value="">— choose a package —</option>
              {packages.map(p => (
                <option key={p.id} value={p.id}>#{p.id} {p.name} (v{p.version})</option>
              ))}
            </select>
          </div>

          {/* Removed services */}
          <div>
            <label className="label">Removed Services</label>
            {removedServices.map((val, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input className="input flex-1 text-xs" value={val}
                  onChange={e => { const s = [...removedServices]; s[i] = e.target.value; setRemovedServices(s) }}
                  placeholder="e.g. Risk Engine" />
                <button type="button" onClick={() => setRemovedServices(removedServices.filter((_, j) => j !== i))}
                  className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setRemovedServices([...removedServices, ''])}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
              <Plus className="w-3.5 h-3.5" /> Add service
            </button>
          </div>

          {/* Renamed APIs */}
          <div>
            <label className="label">Renamed APIs</label>
            {renamedApis.map((r, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input className="input flex-1 text-xs" value={r.from}
                  onChange={e => { const rs = [...renamedApis]; rs[i] = { ...rs[i], from: e.target.value }; setRenamedApis(rs) }}
                  placeholder="Old name" />
                <span className="text-slate-600 text-xs">→</span>
                <input className="input flex-1 text-xs" value={r.to}
                  onChange={e => { const rs = [...renamedApis]; rs[i] = { ...rs[i], to: e.target.value }; setRenamedApis(rs) }}
                  placeholder="New name" />
                <button type="button" onClick={() => setRenamedApis(renamedApis.filter((_, j) => j !== i))}
                  className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setRenamedApis([...renamedApis, { from: '', to: '' }])}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
              <Plus className="w-3.5 h-3.5" /> Add rename
            </button>
          </div>

          {/* Modified entities */}
          <div>
            <label className="label">Modified Data Entities</label>
            {modifiedEntities.map((val, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input className="input flex-1 text-xs" value={val}
                  onChange={e => { const s = [...modifiedEntities]; s[i] = e.target.value; setModifiedEntities(s) }}
                  placeholder="e.g. LoanApplication" />
                <button type="button" onClick={() => setModifiedEntities(modifiedEntities.filter((_, j) => j !== i))}
                  className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setModifiedEntities([...modifiedEntities, ''])}
              className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300">
              <Plus className="w-3.5 h-3.5" /> Add entity
            </button>
          </div>

          <button
            type="button"
            disabled={!selectedId || loading}
            onClick={handleRun}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
              : <><Zap className="w-4 h-4" /> Run Impact Analysis</>}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !loading && (
            <div className="card text-center py-12 text-slate-600 text-sm">
              Select a package and describe the proposed changes, then click Run.
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">Impact Result</span>
                  <span className={`badge border font-medium ${SEVERITY_STYLE[result.severity]}`}>
                    {result.severity.toUpperCase()} severity
                  </span>
                </div>

                {result.breaking_changes.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    No breaking changes detected for this changeset.
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Breaking Changes</p>
                    <ul className="space-y-1.5">
                      {result.breaking_changes.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-red-300 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="card">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Mitigation Plan</p>
                <ul className="space-y-1.5">
                  {result.mitigation_plan.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-300">
                      <span className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Migration Steps</p>
                <ul className="space-y-1.5">
                  {result.migration_steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-400">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
