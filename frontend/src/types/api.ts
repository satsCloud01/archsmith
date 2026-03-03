export type Role = 'ARCHITECT' | 'REVIEWER' | 'ADMIN'

export interface RequirementInput {
  key: string
  category: 'FR' | 'NFR'
  text: string
  priority: 'high' | 'medium' | 'low'
}

export interface DomainInput {
  name: string
  description: string
}

export interface BoundedContextInput {
  domain_name: string
  name: string
}

export interface ServiceInput {
  bounded_context_name: string
  name: string
  service_type: string
}

export interface APIInput {
  service_name: string
  name: string
  method: string
  path: string
}

export interface EventInput {
  name: string
  producer_service: string
}

export interface DataEntityInput {
  name: string
  owning_service: string
}

export interface DeploymentNodeInput {
  name: string
  platform: string
}

export interface InfraComponentInput {
  name: string
  cloud: string
}

export interface StandardInput {
  source: string
  citation: string
  license: string
}

export interface ArchitectureCreatePayload {
  name: string
  description: string
  created_by: string
  requirements: RequirementInput[]
  domains: DomainInput[]
  bounded_contexts: BoundedContextInput[]
  services: ServiceInput[]
  apis: APIInput[]
  events: EventInput[]
  data_entities: DataEntityInput[]
  deployment_nodes: DeploymentNodeInput[]
  infra_components: InfraComponentInput[]
  standards: StandardInput[]
}

export interface ArchitectureSummary {
  id: number
  name: string
  description: string
  status: string
  version: number
  approved: boolean
  updated_at: string
}

export interface DashboardResponse {
  total_packages: number
  approved_packages: number
  pending_reviews: number
  avg_nfr_coverage: number
  packages: ArchitectureSummary[]
}

export interface Artifact {
  id: number
  artifact_type: string
  name: string
  version: number
  content: string
  traceability: {
    requirements: string[]
    adrs: string[]
    citations: string[]
  }
  created_at: string
}

export interface ArtifactsListResponse {
  package_id: number
  package_name: string
  version: number
  artifacts: Artifact[]
}

export interface ImpactResult {
  package_id: number
  severity: string
  breaking_changes: string[]
  mitigation_plan: string[]
  migration_steps: string[]
}

export interface ApprovalResult {
  package_id: number
  approved: boolean
  approved_by: string
  approved_at: string
  version: number
}

export interface AISuggestResponse {
  requirements: RequirementInput[]
  domains: DomainInput[]
  bounded_contexts: BoundedContextInput[]
  services: ServiceInput[]
  apis: APIInput[]
  events: EventInput[]
  data_entities: DataEntityInput[]
  infra_components: InfraComponentInput[]
}

export interface ExampleSummary {
  id: string
  name: string
  description: string
  tags: string[]
}
