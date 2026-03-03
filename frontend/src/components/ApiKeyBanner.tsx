import { useState } from 'react'
import { Sparkles, X, Eye, EyeOff, Check } from 'lucide-react'
import { useApiKey } from '../lib/apiKeyContext'

export default function ApiKeyBanner() {
  const { hasKey, setApiKey } = useApiKey()
  const [dismissed, setDismissed] = useState(false)
  const [input, setInput] = useState('')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  if (hasKey || dismissed) return null

  function handleSave() {
    if (!input.trim()) return
    setApiKey(input.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-6 mt-4 mb-0 bg-brand-950/60 border border-brand-700/40 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-900/60 border border-brand-700/40 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-brand-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-200">Enable AI Architecture Suggestions</div>
        <p className="text-xs text-slate-400 mt-0.5">
          Enter your Anthropic API key to unlock AI-powered architecture generation — describe your system and Claude fills every field instantly.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-..."
            className="bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 w-52"
          />
          <button
            onClick={() => setShow(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!input.trim()}
          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
        >
          {saved ? <><Check className="w-3 h-3" /> Saved</> : 'Save Key'}
        </button>
        <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-slate-300 ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
