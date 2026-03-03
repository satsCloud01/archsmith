import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wand2, Sparkles, BookOpen, Plus, Trash2, ChevronRight, ChevronLeft,
  Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Check
} from 'lucide-react'
import { createArchitecture, aiSuggest } from '../lib/api'
import { useApiKey } from '../lib/apiKeyContext'
import { useSettings } from '../lib/settingsContext'
import ExamplesDrawer from '../components/ExamplesDrawer'
import type {
  RequirementInput, DomainInput, BoundedContextInput,
  ServiceInput, APIInput, EventInput, DataEntityInput,
  InfraComponentInput, ArchitectureCreatePayload
} from '../types/api'

interface FormData {
  name: string
  description: string
  requirements: RequirementInput[]
  domains: DomainInput[]
  bounded_contexts: BoundedContextInput[]
  services: ServiceInput[]
  apis: APIInput[]
  events: EventInput[]
  data_entities: DataEntityInput[]
  infra_components: InfraComponentInput[]
}

const EMPTY: FormData = {
  name: '', description: '',
  requirements: [], domains: [], bounded_contexts: [],
  services: [], apis: [], events: [], data_entities: [], infra_components: [],
}

const STEPS = [
  'System Overview',
  'Requirements',
  'Domains & Services',
  'APIs & Events',
  'Data & Infrastructure',
  'Review & Create',
]

// ── helpers ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 8) }

function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors mt-2">
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  )
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="text-slate-600 hover:text-red-400 transition-colors mt-0.5 flex-shrink-0">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}

// ── ApiKey inline prompt ──────────────────────────────────────────────────────
function ApiKeyPrompt({ onSave }: { onSave: (k: string) => void }) {
  const [val, setVal] = useState('')
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center gap-2 mt-3 p-3 bg-brand-950/40 border border-brand-700/30 rounded-lg">
      <div className="relative flex-1">
        <input
          type={show ? 'text' : 'password'}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && val.trim() && onSave(val.trim())}
          placeholder="Paste Anthropic API key (sk-ant-...)"
          className="input pr-8"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
      <button type="button" onClick={() => val.trim() && onSave(val.trim())}
        className="btn-primary text-xs px-3 py-2 flex items-center gap-1">
        <Check className="w-3 h-3" /> Save & Use
      </button>
    </div>
  )
}

// ── Step components ───────────────────────────────────────────────────────────
function Step1({ form, setForm, onSuggest, suggesting }: {
  form: FormData; setForm: (f: FormData) => void
  onSuggest: () => void; suggesting: boolean
}) {
  const { hasKey } = useApiKey()
  const [showKeyPrompt, setShowKeyPrompt] = useState(false)
  const { setApiKey } = useApiKey()

  function handleSuggest() {
    if (!hasKey) { setShowKeyPrompt(true); return }
    onSuggest()
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Package Name *</label>
        <input className="input" placeholder="e.g. Retail Lending Platform"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="label">System Description *</label>
        <textarea
          className="input min-h-28 resize-y"
          placeholder="Describe your system in 2–3 sentences. e.g. A cloud-native retail banking platform handling account management, payments processing, and real-time fraud detection for 5 million customers across mobile and web channels."
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
        <div className="flex items-start justify-between mt-2">
          <p className="text-xs text-slate-600">
            The more specific you are, the better the AI suggestions will be.
          </p>
          <button
            type="button"
            onClick={handleSuggest}
            disabled={suggesting || form.description.trim().length < 20}
            className="flex items-center gap-1.5 btn-primary text-xs px-3 py-1.5 ml-4 flex-shrink-0"
          >
            {suggesting
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
              : <><Sparkles className="w-3.5 h-3.5" /> AI Generate Architecture</>}
          </button>
        </div>
        {!hasKey && showKeyPrompt && (
          <ApiKeyPrompt onSave={k => { setApiKey(k); setShowKeyPrompt(false); onSuggest() }} />
        )}
        {form.description.trim().length < 20 && form.description.length > 0 && (
          <p className="text-xs text-amber-500 mt-1">Write at least 20 characters for AI suggestions.</p>
        )}
      </div>
    </div>
  )
}

function Step2({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  function add() {
    const idx = form.requirements.length + 1
    setForm({ ...form, requirements: [...form.requirements, { key: `FR-${idx}`, category: 'FR', text: '', priority: 'medium' }] })
  }
  function remove(i: number) {
    setForm({ ...form, requirements: form.requirements.filter((_, j) => j !== i) })
  }
  function update(i: number, field: keyof RequirementInput, val: string) {
    const reqs = [...form.requirements]
    reqs[i] = { ...reqs[i], [field]: val } as RequirementInput
    setForm({ ...form, requirements: reqs })
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-4">Define functional (FR) and non-functional (NFR) requirements. NFR coverage is tracked in the dashboard.</p>
      {form.requirements.length === 0 && (
        <div className="text-center py-6 text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">
          No requirements yet — add one or use AI Generate from Step 1.
        </div>
      )}
      <div className="space-y-2">
        {form.requirements.map((req, i) => (
          <div key={uid() + i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
            <input className="input w-20 text-xs" value={req.key} onChange={e => update(i, 'key', e.target.value)} placeholder="FR-1" />
            <select className="select w-20 text-xs" value={req.category} onChange={e => update(i, 'category', e.target.value as 'FR' | 'NFR')}>
              <option value="FR">FR</option>
              <option value="NFR">NFR</option>
            </select>
            <input className="input flex-1 text-xs" value={req.text} onChange={e => update(i, 'text', e.target.value)} placeholder="Requirement description" />
            <select className="select w-24 text-xs" value={req.priority} onChange={e => update(i, 'priority', e.target.value as 'high' | 'medium' | 'low')}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <RemoveBtn onClick={() => remove(i)} />
          </div>
        ))}
      </div>
      <AddRow label="Add Requirement" onClick={add} />
    </div>
  )
}

function Step3({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  function addDomain() {
    setForm({ ...form, domains: [...form.domains, { name: '', description: '' }] })
  }
  function removeDomain(i: number) {
    setForm({ ...form, domains: form.domains.filter((_, j) => j !== i) })
  }
  function addSvc() {
    setForm({ ...form, services: [...form.services, { bounded_context_name: '', name: '', service_type: 'application' }] })
  }
  function removeSvc(i: number) {
    setForm({ ...form, services: form.services.filter((_, j) => j !== i) })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Domains</label>
          <span className="text-xs text-slate-600">{form.domains.length} defined</span>
        </div>
        {form.domains.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No domains yet</div>
        )}
        <div className="space-y-2">
          {form.domains.map((d, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <input className="input w-36 text-xs" value={d.name} onChange={e => {
                const ds = [...form.domains]; ds[i] = { ...ds[i], name: e.target.value }; setForm({ ...form, domains: ds })
              }} placeholder="Domain name" />
              <input className="input flex-1 text-xs" value={d.description} onChange={e => {
                const ds = [...form.domains]; ds[i] = { ...ds[i], description: e.target.value }; setForm({ ...form, domains: ds })
              }} placeholder="Description" />
              <RemoveBtn onClick={() => removeDomain(i)} />
            </div>
          ))}
        </div>
        <AddRow label="Add Domain" onClick={addDomain} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Services</label>
          <span className="text-xs text-slate-600">{form.services.length} defined</span>
        </div>
        {form.services.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No services yet</div>
        )}
        <div className="space-y-2">
          {form.services.map((svc, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <input className="input w-36 text-xs" value={svc.name} onChange={e => {
                const ss = [...form.services]; ss[i] = { ...ss[i], name: e.target.value }; setForm({ ...form, services: ss })
              }} placeholder="Service name" />
              <input className="input flex-1 text-xs" value={svc.bounded_context_name} onChange={e => {
                const ss = [...form.services]; ss[i] = { ...ss[i], bounded_context_name: e.target.value }; setForm({ ...form, services: ss })
              }} placeholder="Bounded context" />
              <select className="select w-32 text-xs" value={svc.service_type} onChange={e => {
                const ss = [...form.services]; ss[i] = { ...ss[i], service_type: e.target.value }; setForm({ ...form, services: ss })
              }}>
                {['application', 'gateway', 'worker', 'cache', 'stream'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <RemoveBtn onClick={() => removeSvc(i)} />
            </div>
          ))}
        </div>
        <AddRow label="Add Service" onClick={addSvc} />
      </div>
    </div>
  )
}

function Step4({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  function addApi() {
    setForm({ ...form, apis: [...form.apis, { service_name: '', name: '', method: 'GET', path: '/' }] })
  }
  function addEvent() {
    setForm({ ...form, events: [...form.events, { name: '', producer_service: '' }] })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">API Endpoints</label>
          <span className="text-xs text-slate-600">{form.apis.length} defined</span>
        </div>
        {form.apis.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No APIs yet</div>
        )}
        <div className="space-y-2">
          {form.apis.map((api, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <select className="select w-20 text-xs" value={api.method} onChange={e => {
                const as = [...form.apis]; as[i] = { ...as[i], method: e.target.value }; setForm({ ...form, apis: as })
              }}>
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => <option key={m}>{m}</option>)}
              </select>
              <input className="input w-36 text-xs" value={api.path} onChange={e => {
                const as = [...form.apis]; as[i] = { ...as[i], path: e.target.value }; setForm({ ...form, apis: as })
              }} placeholder="/path" />
              <input className="input flex-1 text-xs" value={api.name} onChange={e => {
                const as = [...form.apis]; as[i] = { ...as[i], name: e.target.value }; setForm({ ...form, apis: as })
              }} placeholder="Operation name" />
              <input className="input w-36 text-xs" value={api.service_name} onChange={e => {
                const as = [...form.apis]; as[i] = { ...as[i], service_name: e.target.value }; setForm({ ...form, apis: as })
              }} placeholder="Owning service" />
              <RemoveBtn onClick={() => setForm({ ...form, apis: form.apis.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
        <AddRow label="Add API Endpoint" onClick={addApi} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Domain Events</label>
          <span className="text-xs text-slate-600">{form.events.length} defined</span>
        </div>
        {form.events.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No events yet</div>
        )}
        <div className="space-y-2">
          {form.events.map((ev, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <input className="input flex-1 text-xs" value={ev.name} onChange={e => {
                const es = [...form.events]; es[i] = { ...es[i], name: e.target.value }; setForm({ ...form, events: es })
              }} placeholder="EventName (e.g. OrderPlaced)" />
              <input className="input flex-1 text-xs" value={ev.producer_service} onChange={e => {
                const es = [...form.events]; es[i] = { ...es[i], producer_service: e.target.value }; setForm({ ...form, events: es })
              }} placeholder="Producer service" />
              <RemoveBtn onClick={() => setForm({ ...form, events: form.events.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
        <AddRow label="Add Domain Event" onClick={addEvent} />
      </div>
    </div>
  )
}

function Step5({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  function addEntity() {
    setForm({ ...form, data_entities: [...form.data_entities, { name: '', owning_service: '' }] })
  }
  function addInfra() {
    setForm({ ...form, infra_components: [...form.infra_components, { name: '', cloud: 'aws' }] })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Data Entities</label>
          <span className="text-xs text-slate-600">{form.data_entities.length} defined</span>
        </div>
        {form.data_entities.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No entities yet</div>
        )}
        <div className="space-y-2">
          {form.data_entities.map((de, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <input className="input flex-1 text-xs" value={de.name} onChange={e => {
                const es = [...form.data_entities]; es[i] = { ...es[i], name: e.target.value }; setForm({ ...form, data_entities: es })
              }} placeholder="Entity name (e.g. Customer)" />
              <input className="input flex-1 text-xs" value={de.owning_service} onChange={e => {
                const es = [...form.data_entities]; es[i] = { ...es[i], owning_service: e.target.value }; setForm({ ...form, data_entities: es })
              }} placeholder="Owning service" />
              <RemoveBtn onClick={() => setForm({ ...form, data_entities: form.data_entities.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
        <AddRow label="Add Data Entity" onClick={addEntity} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-300">Infrastructure Components</label>
          <span className="text-xs text-slate-600">{form.infra_components.length} defined</span>
        </div>
        {form.infra_components.length === 0 && (
          <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl mb-2">No infra yet</div>
        )}
        <div className="space-y-2">
          {form.infra_components.map((ic, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2">
              <input className="input flex-1 text-xs" value={ic.name} onChange={e => {
                const cs = [...form.infra_components]; cs[i] = { ...cs[i], name: e.target.value }; setForm({ ...form, infra_components: cs })
              }} placeholder="Component name (e.g. eks-cluster)" />
              <select className="select w-24 text-xs" value={ic.cloud} onChange={e => {
                const cs = [...form.infra_components]; cs[i] = { ...cs[i], cloud: e.target.value }; setForm({ ...form, infra_components: cs })
              }}>
                {['aws', 'azure', 'gcp'].map(c => <option key={c}>{c}</option>)}
              </select>
              <RemoveBtn onClick={() => setForm({ ...form, infra_components: form.infra_components.filter((_, j) => j !== i) })} />
            </div>
          ))}
        </div>
        <AddRow label="Add Infra Component" onClick={addInfra} />
      </div>
    </div>
  )
}

function Step6({ form }: { form: FormData }) {
  const counts = [
    { label: 'Requirements', val: form.requirements.length },
    { label: 'Domains', val: form.domains.length },
    { label: 'Services', val: form.services.length },
    { label: 'APIs', val: form.apis.length },
    { label: 'Events', val: form.events.length },
    { label: 'Data Entities', val: form.data_entities.length },
    { label: 'Infra Components', val: form.infra_components.length },
  ]
  const nfrCount = form.requirements.filter(r => r.category === 'NFR').length
  const nfrPct = form.requirements.length ? Math.round((nfrCount / form.requirements.length) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="card bg-slate-900/80">
        <div className="text-sm font-semibold mb-1">{form.name || '(no name)'}</div>
        <p className="text-xs text-slate-500 leading-relaxed">{form.description || '(no description)'}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {counts.map(({ label, val }) => (
          <div key={label} className="card text-center py-3">
            <div className="text-xl font-bold text-brand-400">{val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
        <div className="card text-center py-3">
          <div className={`text-xl font-bold ${nfrPct >= 40 ? 'text-emerald-400' : nfrPct >= 20 ? 'text-amber-400' : 'text-red-400'}`}>
            {nfrPct}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">NFR Coverage</div>
        </div>
      </div>

      {!form.name && (
        <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Package name is required.
        </div>
      )}
    </div>
  )
}

// ── Main Studio component ────────────────────────────────────────────────────
export default function Studio() {
  const navigate = useNavigate()
  const { tenantId, role, actor } = useSettings()
  const { apiKey } = useApiKey()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({ ...EMPTY })
  const [examplesOpen, setExamplesOpen] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestBanner, setSuggestBanner] = useState<'success' | 'error' | null>(null)
  const [suggestError, setSuggestError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  function handleLoadExample(payload: Partial<ArchitectureCreatePayload>) {
    setForm(prev => ({
      ...prev,
      name: payload.name ?? prev.name,
      description: payload.description ?? prev.description,
      requirements: payload.requirements ?? prev.requirements,
      domains: payload.domains ?? prev.domains,
      bounded_contexts: payload.bounded_contexts ?? prev.bounded_contexts,
      services: payload.services ?? prev.services,
      apis: payload.apis ?? prev.apis,
      events: payload.events ?? prev.events,
      data_entities: payload.data_entities ?? prev.data_entities,
      infra_components: payload.infra_components ?? prev.infra_components,
    }))
    setSuggestBanner('success')
    setTimeout(() => setSuggestBanner(null), 3000)
  }

  async function handleAISuggest() {
    if (!form.description.trim() || form.description.trim().length < 20) return
    const key = apiKey
    if (!key) return
    setSuggesting(true)
    setSuggestBanner(null)
    try {
      const result = await aiSuggest(form.description.trim(), key)
      setForm(prev => ({
        ...prev,
        requirements: result.requirements ?? prev.requirements,
        domains: result.domains ?? prev.domains,
        bounded_contexts: result.bounded_contexts ?? prev.bounded_contexts,
        services: result.services ?? prev.services,
        apis: result.apis ?? prev.apis,
        events: result.events ?? prev.events,
        data_entities: result.data_entities ?? prev.data_entities,
        infra_components: result.infra_components ?? prev.infra_components,
      }))
      setSuggestBanner('success')
      setTimeout(() => setSuggestBanner(null), 4000)
    } catch (e: unknown) {
      setSuggestError(e instanceof Error ? e.message : 'AI suggestion failed')
      setSuggestBanner('error')
      setTimeout(() => setSuggestBanner(null), 6000)
    } finally {
      setSuggesting(false)
    }
  }

  async function handleCreate() {
    if (!form.name.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      const payload: ArchitectureCreatePayload = {
        name: form.name,
        description: form.description,
        created_by: actor,
        requirements: form.requirements,
        domains: form.domains,
        bounded_contexts: form.bounded_contexts.length
          ? form.bounded_contexts
          : form.domains.map(d => ({ domain_name: d.name, name: `${d.name} Context` })),
        services: form.services,
        apis: form.apis,
        events: form.events,
        data_entities: form.data_entities,
        deployment_nodes: [{ name: 'archsmith-cluster', platform: 'kubernetes' }],
        infra_components: form.infra_components,
        standards: [{ source: 'ArchSmith Architecture Standards', citation: 'PRD FR1–FR6 aligned', license: 'internal' }],
      }
      const result = await createArchitecture(payload, tenantId, role)
      navigate(`/packages/${result.id}`)
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create package')
    } finally {
      setCreating(false)
    }
  }

  const stepContent = [
    <Step1 key={0} form={form} setForm={setForm} onSuggest={handleAISuggest} suggesting={suggesting} />,
    <Step2 key={1} form={form} setForm={setForm} />,
    <Step3 key={2} form={form} setForm={setForm} />,
    <Step4 key={3} form={form} setForm={setForm} />,
    <Step5 key={4} form={form} setForm={setForm} />,
    <Step6 key={5} form={form} />,
  ]

  return (
    <>
      <ExamplesDrawer open={examplesOpen} onClose={() => setExamplesOpen(false)} onLoad={handleLoadExample} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-brand-400" />
              Architecture Studio
            </h1>
            <p className="text-xs text-slate-500">Create a new architecture package · FR1</p>
          </div>
          <button onClick={() => setExamplesOpen(true)}
            className="btn-outline text-sm flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Load Example
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors w-full ${
                  i === step
                    ? 'bg-brand-900/60 text-brand-300 font-medium border border-brand-700/50'
                    : i < step
                    ? 'bg-slate-800/60 text-slate-400 hover:text-slate-200 cursor-pointer'
                    : 'text-slate-700 cursor-default'
                }`}
              >
                {i < step
                  ? <CheckCircle className="w-3 h-3 text-brand-500 flex-shrink-0" />
                  : <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center flex-shrink-0 border ${i === step ? 'border-brand-500 text-brand-400' : 'border-slate-700 text-slate-600'}`}>{i + 1}</span>
                }
                <span className="hidden sm:inline truncate">{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className="w-2 flex-shrink-0 h-px bg-slate-800 mx-0.5" />}
            </div>
          ))}
        </div>

        {/* AI Banner */}
        {suggestBanner === 'success' && (
          <div className="mb-4 flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            All architecture fields populated — review each step and edit as needed.
          </div>
        )}
        {suggestBanner === 'error' && (
          <div className="mb-4 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {suggestError}
          </div>
        )}
        {createError && (
          <div className="mb-4 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {createError}
          </div>
        )}

        {/* Step content */}
        <div className="card min-h-64">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-slate-800">
            Step {step + 1}: {STEPS[step]}
          </h2>
          {stepContent[step]}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="btn-ghost flex items-center gap-1.5 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="btn-primary flex items-center gap-1.5"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!form.name.trim() || creating}
              onClick={handleCreate}
              className="btn-primary flex items-center gap-1.5"
            >
              {creating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                : <><CheckCircle className="w-4 h-4" /> Create Package</>}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
