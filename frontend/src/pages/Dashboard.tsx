import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, CheckCircle, Clock, TrendingUp, FolderOpen, Wand2, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getDashboard } from '../lib/api'
import { useSettings } from '../lib/settingsContext'
import type { DashboardResponse, ArchitectureSummary } from '../types/api'

const STATUS_COLOR: Record<string, string> = {
  draft:     'bg-slate-500/10 text-slate-400 border-slate-600/30',
  generated: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  approved:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const NFR_COLOR = (n: number) => n >= 40 ? '#10b981' : n >= 20 ? '#f59e0b' : '#ef4444'

export default function Dashboard() {
  const { tenantId, role } = useSettings()
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard(tenantId, role)
      .then(setData)
      .catch(e => setError(e.message))
  }, [tenantId, role])

  const chartData = data?.packages.slice(0, 8).map(p => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    nfr: 0, // placeholder – NFR scores are aggregate-only in the API
    version: p.version,
  })) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">Tenant: <span className="text-slate-400">{tenantId}</span></p>
        </div>
        <Link to="/studio" className="btn-primary text-sm flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5" />
          New Architecture
        </Link>
      </div>

      {error && <div className="card border-red-700/40 bg-red-900/10 text-red-400 text-sm mb-6">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Total Packages</span>
            <FolderOpen className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold">{data?.total_packages ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{data?.approved_packages ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{data?.pending_reviews ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Avg NFR Coverage</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold text-brand-400">{data?.avg_nfr_coverage ?? '—'}%</div>
          <div className="text-[10px] text-slate-600 mt-1">Target: 80%</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* NFR chart */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold">NFR Coverage by Package</span>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={20}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                />
                <Bar dataKey="version" name="Version">
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={NFR_COLOR(entry.nfr)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-600 text-sm">No packages yet</div>
          )}
        </div>

        {/* Package list */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold">Recent Packages</span>
            </div>
            <Link to="/packages" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {data?.packages.length === 0 && (
            <div className="text-center py-8 text-slate-600 text-sm">
              No packages yet.{' '}
              <Link to="/studio" className="text-brand-400 hover:text-brand-300">Create your first →</Link>
            </div>
          )}
          <div className="space-y-2">
            {data?.packages.slice(0, 6).map((pkg: ArchitectureSummary) => (
              <Link key={pkg.id} to={`/packages/${pkg.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/60 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-200 group-hover:text-brand-300 transition-colors truncate">
                    {pkg.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    v{pkg.version} · {new Date(pkg.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`badge border text-[10px] flex-shrink-0 ${STATUS_COLOR[pkg.status] ?? 'bg-slate-700/40 text-slate-400 border-slate-600/20'}`}>
                  {pkg.status}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-brand-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
