import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FolderOpen, FileText, Zap, ShieldCheck, Loader2, ChevronLeft,
  CheckCircle, AlertCircle
} from 'lucide-react'
import { getArtifacts, generateArtifacts, listArchitectures } from '../lib/api'
import { useSettings } from '../lib/settingsContext'
import ArtifactViewer from '../components/ArtifactViewer'
import type { ArtifactsListResponse, ArchitectureSummary } from '../types/api'

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>()
  const { tenantId, role, actor } = useSettings()
  const pkgId = Number(id)

  const [pkg, setPkg] = useState<ArchitectureSummary | null>(null)
  const [artifacts, setArtifacts] = useState<ArtifactsListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [genBanner, setGenBanner] = useState(false)

  useEffect(() => {
    if (!pkgId) return
    setLoading(true)
    Promise.all([
      listArchitectures(tenantId, role),
      getArtifacts(pkgId, tenantId, role).catch(() => null),
    ]).then(([pkgs, arts]) => {
      setPkg(pkgs.find(p => p.id === pkgId) ?? null)
      if (arts) setArtifacts(arts)
    }).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [pkgId, tenantId, role])

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    try {
      const result = await generateArtifacts(pkgId, actor, tenantId, role)
      setArtifacts(result)
      setGenBanner(true)
      setTimeout(() => setGenBanner(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/packages" className="btn-ghost text-sm flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Packages
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-sm text-slate-400">{pkg?.name ?? `Package #${pkgId}`}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          {/* Package header */}
          <div className="card mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-900/50 border border-brand-700/30 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold mb-1">{pkg?.name}</h1>
                  <p className="text-sm text-slate-500">{pkg?.description || 'No description'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-600">v{pkg?.version}</span>
                    <span className={`badge border text-[10px] ${
                      pkg?.approved
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-600/30'
                    }`}>
                      {pkg?.status}
                    </span>
                    {pkg?.approved && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/impact" className="btn-outline text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Impact
                </Link>
                <Link to="/governance" className="btn-outline text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Approve
                </Link>
                <button onClick={handleGenerate} disabled={generating}
                  className="btn-primary text-xs flex items-center gap-1.5">
                  {generating
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                    : <><FileText className="w-3.5 h-3.5" /> Generate Artifacts</>}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}
          {genBanner && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-4">
              <CheckCircle className="w-3.5 h-3.5" />
              {artifacts?.artifacts.length ?? 0} artifacts generated successfully · version {artifacts?.version}
            </div>
          )}

          {/* Artifacts */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold">Artifacts</span>
              {artifacts && (
                <span className="badge bg-brand-900/40 text-brand-400 text-[10px]">
                  {artifacts.artifacts.length} artifacts · v{artifacts.version}
                </span>
              )}
            </div>
            <ArtifactViewer artifacts={artifacts?.artifacts ?? []} />
          </div>
        </>
      )}
    </div>
  )
}
