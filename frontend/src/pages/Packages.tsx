import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, ChevronRight, CheckCircle, Clock, FileText, Wand2 } from 'lucide-react'
import { listArchitectures } from '../lib/api'
import { useSettings } from '../lib/settingsContext'
import type { ArchitectureSummary } from '../types/api'

const STATUS: Record<string, { color: string; icon: React.ReactNode }> = {
  draft:     { color: 'bg-slate-500/10 text-slate-400 border-slate-600/30', icon: <FileText className="w-3 h-3" /> },
  generated: { color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',       icon: <FileText className="w-3 h-3" /> },
  approved:  { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle className="w-3 h-3" /> },
}

export default function Packages() {
  const { tenantId, role } = useSettings()
  const [packages, setPackages] = useState<ArchitectureSummary[]>([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'draft' | 'generated' | 'approved'>('all')

  useEffect(() => {
    listArchitectures(tenantId, role)
      .then(setPackages)
      .catch(e => setError(e.message))
  }, [tenantId, role])

  const filtered = filter === 'all' ? packages : packages.filter(p => p.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand-400" />
            Packages
          </h1>
          <p className="text-sm text-slate-500">{packages.length} packages in tenant <span className="text-slate-400">{tenantId}</span></p>
        </div>
        <Link to="/studio" className="btn-primary text-sm flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5" />
          New Package
        </Link>
      </div>

      {error && <div className="card border-red-700/40 bg-red-900/10 text-red-400 text-sm mb-6">{error}</div>}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit">
        {(['all', 'draft', 'generated', 'approved'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === f ? 'bg-brand-900/60 text-brand-300' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {f} {f === 'all' ? `(${packages.length})` : `(${packages.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600 text-sm">
          {filter === 'all' ? (
            <>No packages yet. <Link to="/studio" className="text-brand-400 hover:text-brand-300">Create your first →</Link></>
          ) : (
            `No ${filter} packages.`
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(pkg => {
            const s = STATUS[pkg.status] ?? STATUS.draft
            return (
              <Link key={pkg.id} to={`/packages/${pkg.id}`}
                className="card flex items-center gap-4 hover:border-brand-700/50 transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-brand-900/40 border border-brand-700/30 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium group-hover:text-brand-300 transition-colors truncate">
                      {pkg.name}
                    </span>
                    <span className="text-xs text-slate-600">#{pkg.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{pkg.description || 'No description'}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="text-xs font-semibold text-slate-300">v{pkg.version}</div>
                    <div className="text-[10px] text-slate-600">version</div>
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(pkg.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  {pkg.approved && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Approved</span>
                    </div>
                  )}
                  <span className={`badge border text-[10px] flex-shrink-0 ${s.color}`}>
                    {s.icon} {pkg.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-brand-400 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
