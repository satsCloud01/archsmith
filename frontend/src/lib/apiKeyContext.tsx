import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const STORAGE_KEY = 'archsmith_anthropic_key'

interface ApiKeyContextValue {
  apiKey: string
  setApiKey: (key: string) => void
  clearApiKey: () => void
  hasKey: boolean
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: '',
  setApiKey: () => {},
  clearApiKey: () => {},
  hasKey: false,
})

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY) ?? '' } catch { return '' }
  })

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim()
    setApiKeyState(trimmed)
    try {
      if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const clearApiKey = useCallback(() => {
    setApiKeyState('')
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, hasKey: apiKey.length > 0 }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  return useContext(ApiKeyContext)
}

export function getStoredApiKey(): string {
  try { return localStorage.getItem(STORAGE_KEY) ?? '' } catch { return '' }
}
