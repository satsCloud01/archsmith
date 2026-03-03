from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class RequirementInput(BaseModel):
    key: str
    category: str = Field(default="FR")
    text: str
    priority: str = Field(default="medium")


class DomainInput(BaseModel):
    name: str
    description: str = ""


class BoundedContextInput(BaseModel):
    domain_name: str
    name: str


class ServiceInput(BaseModel):
    bounded_context_name: str
    name: str
    service_type: str = "application"


class APIInput(BaseModel):
    service_name: str
    name: str
    method: str = "GET"
    path: str = "/"


class EventInput(BaseModel):
    name: str
    producer_service: str = ""


class DataEntityInput(BaseModel):
    name: str
    owning_service: str = ""


class DeploymentNodeInput(BaseModel):
    name: str
    platform: str = "kubernetes"


class InfraComponentInput(BaseModel):
    name: str
    cloud: str = "aws"


class StandardReferenceInput(BaseModel):
    source: str
    citation: str
    license: str = "internal"


class ArchitectureCreateRequest(BaseModel):
    name: str
    description: str = ""
    created_by: str = "system"
    requirements: list[RequirementInput] = Field(default_factory=list)
    domains: list[DomainInput] = Field(default_factory=list)
    bounded_contexts: list[BoundedContextInput] = Field(default_factory=list)
    services: list[ServiceInput] = Field(default_factory=list)
    apis: list[APIInput] = Field(default_factory=list)
    events: list[EventInput] = Field(default_factory=list)
    data_entities: list[DataEntityInput] = Field(default_factory=list)
    deployment_nodes: list[DeploymentNodeInput] = Field(default_factory=list)
    infra_components: list[InfraComponentInput] = Field(default_factory=list)
    standards: list[StandardReferenceInput] = Field(default_factory=list)


class ArchitectureCreateResponse(BaseModel):
    id: int
    name: str
    status: str
    version: int


class GenerateRequest(BaseModel):
    actor: str = "system"


class ArtifactResponse(BaseModel):
    id: int
    artifact_type: str
    name: str
    version: int
    content: str
    traceability: dict
    created_at: datetime


class ArtifactsListResponse(BaseModel):
    package_id: int
    package_name: str
    version: int
    artifacts: list[ArtifactResponse]


class ImpactChangeSet(BaseModel):
    removed_services: list[str] = Field(default_factory=list)
    renamed_apis: list[dict[str, str]] = Field(default_factory=list)
    modified_entities: list[str] = Field(default_factory=list)


class ImpactRequest(BaseModel):
    actor: str = "system"
    proposed_changes: ImpactChangeSet


class ImpactResponse(BaseModel):
    package_id: int
    severity: str
    breaking_changes: list[str]
    mitigation_plan: list[str]
    migration_steps: list[str]


class ApproveRequest(BaseModel):
    actor: str = "reviewer"
    comment: str = ""


class ApproveResponse(BaseModel):
    package_id: int
    approved: bool
    approved_by: str
    approved_at: datetime
    version: int


class ArchitectureSummary(BaseModel):
    id: int
    name: str
    description: str
    status: str
    version: int
    approved: bool
    updated_at: datetime


class DashboardResponse(BaseModel):
    total_packages: int
    approved_packages: int
    pending_reviews: int
    avg_nfr_coverage: float
    packages: list[ArchitectureSummary]


# AI suggestion schemas
class AISuggestRequest(BaseModel):
    description: str
    api_key: str


class AISuggestResponse(BaseModel):
    requirements: list[RequirementInput] = Field(default_factory=list)
    domains: list[DomainInput] = Field(default_factory=list)
    bounded_contexts: list[BoundedContextInput] = Field(default_factory=list)
    services: list[ServiceInput] = Field(default_factory=list)
    apis: list[APIInput] = Field(default_factory=list)
    events: list[EventInput] = Field(default_factory=list)
    data_entities: list[DataEntityInput] = Field(default_factory=list)
    infra_components: list[InfraComponentInput] = Field(default_factory=list)
