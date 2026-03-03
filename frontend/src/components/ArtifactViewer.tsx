import { useState } from 'react'
import { Copy, Check, Tag } from 'lucide-react'
import type { Artifact } from '../types/api'

const TYPE_COLORS: Record<string, string> = {
  domain_model:    'bg-violet-500/10 text-violet-400',
  c4:              'bg-sky-500/10 text-sky-400',
  openapi:         'bg-emerald-500/10 text-emerald-400',
  asyncapi:        'bg-orange-500/10 text-orange-400',
  terraform:       'bg-amber-500/10 text-amber-400',
  adr:             'bg-red-500/10 text-red-400',
  impact_baseline: 'bg-pink-500/10 text-pink-400',
  arc42:           'bg-brand-500/10 text-brand-400',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

interface ArtifactViewerProps {
  artifacts: Artifact[]
}

export default function ArtifactViewer({ artifacts }: ArtifactViewerProps) {
  const [selected, setSelected] = useState(0)

  if (artifacts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600 text-sm">
        No artifacts generated yet. Click "Generate Artifacts" to create them.
      </div>
    )
  }

  const current = artifacts[selected]

  return (
    <div className="flex gap-4 h-full min-h-96">
      {/* Tab list */}
      <div className="flex flex-col gap-1 min-w-48 max-w-52">
        {artifacts.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setSelected(i)}
            className={`text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-start gap-2 ${
              i === selected
                ? 'bg-brand-900/60 text-brand-300 font-medium'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className={`badge mt-0.5 flex-shrink-0 ${TYPE_COLORS[a.artifact_type] ?? 'bg-slate-500/10 text-slate-400'}`}>
              v{a.version}
            </span>
            <span className="leading-snug">{a.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className={`badge ${TYPE_COLORS[current.artifact_type] ?? 'bg-slate-500/10 text-slate-400'}`}>
              {current.artifact_type}
            </span>
            <span className="text-xs text-slate-500">v{current.version}</span>
          </div>
          <div className="flex items-center gap-3">
            {current.traceability.requirements.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Tag className="w-3 h-3" />
                {current.traceability.requirements.join(', ')}
              </div>
            )}
            <CopyButton text={current.content} />
          </div>
        </div>
        <pre className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-mono overflow-auto whitespace-pre-wrap leading-relaxed">
          {current.content}
        </pre>
      </div>
    </div>
  )
}
