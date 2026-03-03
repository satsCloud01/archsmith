import type {
  ArchitectureCreatePayload,
  ArchitectureSummary,
  ArtifactsListResponse,
  AISuggestResponse,
  ApprovalResult,
  DashboardResponse,
  ExampleSummary,
  ImpactResult,
  Role,
} from '../types/api'

const BASE = '/api'

function headers(tenantId: string, role: Role): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
    'X-Role': role,
  }
}

async function get<T>(path: string, tenantId: string, role: Role): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { headers: headers(tenantId, role) })
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }))
    throw new Error(err.detail || `API error ${r.status}`)
  }
  return r.json()
}

async function post<T>(path: string, body: unknown, tenantId: string, role: Role): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: headers(tenantId, role),
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }))
    throw new Error(err.detail || `API error ${r.status}`)
  }
  return r.json()
}

// Architecture
export const getDashboard = (t: string, r: Role) =>
  get<DashboardResponse>('/architecture/dashboard/summary', t, r)

export const listArchitectures = (t: string, r: Role) =>
  get<ArchitectureSummary[]>('/architecture', t, r)

export const createArchitecture = (payload: ArchitectureCreatePayload, t: string, r: Role) =>
  post<{ id: number; name: string; status: string; version: number }>('/architecture/create', payload, t, r)

export const generateArtifacts = (id: number, actor: string, t: string, r: Role) =>
  post<ArtifactsListResponse>(`/architecture/${id}/generate`, { actor }, t, r)

export const getArtifacts = (id: number, t: string, r: Role) =>
  get<ArtifactsListResponse>(`/architecture/${id}/artifacts`, t, r)

export const runImpact = (
  id: number,
  payload: { actor: string; proposed_changes: { removed_services: string[]; renamed_apis: { from: string; to: string }[]; modified_entities: string[] } },
  t: string,
  r: Role,
) => post<ImpactResult>(`/architecture/${id}/impact`, payload, t, r)

export const approvePackage = (id: number, actor: string, comment: string, t: string, r: Role) =>
  post<ApprovalResult>(`/architecture/${id}/approve`, { actor, comment }, t, r)

// Examples
export const listExamples = async (): Promise<ExampleSummary[]> => {
  const r = await fetch(`${BASE}/examples`)
  if (!r.ok) throw new Error('Failed to load examples')
  return r.json()
}

export const getExample = async (id: string): Promise<ArchitectureCreatePayload & { id: string; tags: string[] }> => {
  const r = await fetch(`${BASE}/examples/${id}`)
  if (!r.ok) throw new Error('Example not found')
  return r.json()
}

// AI suggest (no tenant headers needed — uses api_key in body)
export const aiSuggest = async (description: string, apiKey: string): Promise<AISuggestResponse> => {
  const r = await fetch(`${BASE}/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, api_key: apiKey }),
  })
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }))
    throw new Error(err.detail || `AI suggest failed (${r.status})`)
  }
  return r.json()
}
