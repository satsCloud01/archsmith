import { useEffect, useState } from 'react'
import { X, BookOpen, Tag, Loader2, ChevronRight } from 'lucide-react'
import { getExample, listExamples } from '../lib/api'
import type { ExampleSummary, ArchitectureCreatePayload } from '../types/api'

const TAG_COLORS: Record<string, string> = {
  banking:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  payments:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  risk:        'bg-red-500/10 text-red-400 border-red-500/20',
  'pci-dss':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'e-commerce':'bg-violet-500/10 text-violet-400 border-violet-500/20',
  microservices:'bg-sky-500/10 text-sky-400 border-sky-500/20',
  retail:      'bg-orange-500/10 text-orange-400 border-orange-500/20',
  healthcare:  'bg-teal-500/10 text-teal-400 border-teal-500/20',
  hipaa:       'bg-pink-500/10 text-pink-400 border-pink-500/20',
  analytics:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
  streaming:   'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

interface ExamplesDrawerProps {
  open: boolean
  onClose: () => void
  onLoad: (payload: Partial<ArchitectureCreatePayload>) => void
}

export default function ExamplesDrawer({ open, onClose, onLoad }: ExamplesDrawerProps) {
  const [examples, setExamples] = useState<ExampleSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    if (open && examples.length === 0) {
      setLoading(true)
      listExamples().then(setExamples).catch(() => {}).finally(() => setLoading(false))
    }
  }, [open])

  async function handleUse(id: string) {
    setApplying(id)
    try {
      const data = await getExample(id)
      const { id: _id, tags: _tags, ...payload } = data
      onLoad(payload)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setApplying(null)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold">Example Templates</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800/50">
          <p className="text-xs text-slate-500">
            Load a pre-built architecture template. All fields will be pre-populated — you can review and edit before creating.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading templates…
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {examples.map(ex => (
              <div key={ex.id} className="card hover:border-brand-700/60 transition-colors group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-medium text-slate-200 group-hover:text-brand-300 transition-colors">
                    {ex.name}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{ex.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {ex.tags.map(tag => (
                    <span key={tag} className={`badge border text-[10px] ${TAG_COLORS[tag] ?? 'bg-slate-700/40 text-slate-400 border-slate-600/30'}`}>
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleUse(ex.id)}
                  disabled={applying === ex.id}
                  className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  {applying === ex.id ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Loading…</>
                  ) : (
                    <>Use Template <ChevronRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
