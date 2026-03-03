import { useState } from 'react'
import { Settings, Eye, EyeOff, Check, Trash2, KeyRound, User, Building2 } from 'lucide-react'
import { useApiKey } from '../lib/apiKeyContext'
import { useSettings } from '../lib/settingsContext'
import type { Role } from '../types/api'

export default function SettingsPage() {
  const { apiKey, setApiKey, clearApiKey, hasKey } = useApiKey()
  const { tenantId, role, actor, setTenantId, setRole, setActor } = useSettings()

  const [keyInput, setKeyInput] = useState(hasKey ? '••••••••••••••••' : '')
  const [showKey, setShowKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)

  function handleSaveKey() {
    if (!keyInput.trim() || keyInput === '••••••••••••••••') return
    setApiKey(keyInput.trim())
    setKeySaved(true)
    setKeyInput('••••••••••••••••')
    setTimeout(() => setKeySaved(false), 2000)
  }

  function handleClearKey() {
    clearApiKey()
    setKeyInput('')
    setShowKey(false)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-400" />
          Settings
        </h1>
        <p className="text-sm text-slate-500">Tenant, role, actor identity, and API key management</p>
      </div>

      <div className="space-y-4">
        {/* Identity */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold">Identity</span>
          </div>

          <div>
            <label className="label">Tenant ID</label>
            <input className="input" value={tenantId}
              onChange={e => setTenantId(e.target.value)}
              placeholder="enterprise-a" />
            <p className="text-xs text-slate-600 mt-1">All packages are scoped to this tenant.</p>
          </div>

          <div>
            <label className="label">Role</label>
            <select className="select" value={role} onChange={e => setRole(e.target.value as Role)}>
              <option value="ARCHITECT">ARCHITECT — can create, generate, and run impact analysis</option>
              <option value="REVIEWER">REVIEWER — can approve packages</option>
              <option value="ADMIN">ADMIN — full access including approvals</option>
            </select>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Actor Name
            </label>
            <input className="input" value={actor}
              onChange={e => setActor(e.target.value)}
              placeholder="architect.user" />
            <p className="text-xs text-slate-600 mt-1">Used in audit logs and approvals.</p>
          </div>
        </div>

        {/* API Key */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-semibold">Anthropic API Key</span>
            {hasKey && (
              <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                <Check className="w-2.5 h-2.5" /> Active
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Required for AI architecture suggestions in Studio. Keys are stored in your browser's localStorage and never sent to the ArchSmith server — only used client-side when calling the AI endpoint.
          </p>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onFocus={() => { if (keyInput === '••••••••••••••••') setKeyInput('') }}
              onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
              placeholder="sk-ant-api03-..."
              className="input pr-10"
            />
            <button type="button" onClick={() => setShowKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleSaveKey}
              disabled={!keyInput.trim() || keyInput === '••••••••••••••••'}
              className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm">
              {keySaved ? <><Check className="w-4 h-4" /> Saved!</> : <><Check className="w-4 h-4" /> Save Key</>}
            </button>
            {hasKey && (
              <button type="button" onClick={handleClearKey}
                className="btn-outline flex items-center gap-1.5 text-sm text-red-400 border-red-700/40 hover:bg-red-900/20">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="card bg-slate-900/40 border-slate-800/60">
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="text-slate-400 font-medium">ArchSmith</span> — Architecture Intelligence Platform · PRD FR1–FR6 · arc42 aligned<br />
            Backend: <span className="font-mono">localhost:8002</span> · Frontend: <span className="font-mono">localhost:5174</span>
          </p>
        </div>
      </div>
    </div>
  )
}
