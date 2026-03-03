import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role } from '../types/api'

const TENANT_KEY = 'archsmith_tenant'
const ROLE_KEY = 'archsmith_role'
const ACTOR_KEY = 'archsmith_actor'

interface Settings {
  tenantId: string
  role: Role
  actor: string
  setTenantId: (v: string) => void
  setRole: (v: Role) => void
  setActor: (v: string) => void
}

const SettingsContext = createContext<Settings>({
  tenantId: 'enterprise-a',
  role: 'ARCHITECT',
  actor: 'architect.user',
  setTenantId: () => {},
  setRole: () => {},
  setActor: () => {},
})

function load(key: string, fallback: string): string {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
function save(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch {}
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState(() => load(TENANT_KEY, 'enterprise-a'))
  const [role, setRoleState] = useState<Role>(() => load(ROLE_KEY, 'ARCHITECT') as Role)
  const [actor, setActorState] = useState(() => load(ACTOR_KEY, 'architect.user'))

  const setTenantId = (v: string) => { setTenantIdState(v); save(TENANT_KEY, v) }
  const setRole = (v: Role) => { setRoleState(v); save(ROLE_KEY, v) }
  const setActor = (v: string) => { setActorState(v); save(ACTOR_KEY, v) }

  return (
    <SettingsContext.Provider value={{ tenantId, role, actor, setTenantId, setRole, setActor }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
