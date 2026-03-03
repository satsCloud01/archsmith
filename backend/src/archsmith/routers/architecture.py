from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    ADR, API, Artifact, ArchitecturePackage, AuditLog,
    BoundedContext, DataEntity, DeploymentNode, Domain,
    Event, InfraComponent, Requirement, Service, StandardReference,
)
from ..schemas import (
    ApproveRequest, ApproveResponse,
    ArchitectureCreateRequest, ArchitectureCreateResponse, ArchitectureSummary,
    ArtifactsListResponse, ArtifactResponse,
    DashboardResponse, GenerateRequest,
    ImpactRequest, ImpactResponse,
)
from ..security import RequestContext, get_request_context, require_reviewer_or_admin
from ..services.artifact_generator import generate_artifacts
from ..services.impact import run_impact_analysis

router = APIRouter(prefix="/architecture", tags=["architecture"])


def _audit(db: Session, package_id: int, tenant_id: str, actor: str, action: str, payload: dict) -> None:
    db.add(AuditLog(
        package_id=package_id,
        tenant_id=tenant_id,
        actor=actor,
        action=action,
        payload=payload,
    ))


def _fetch_package(db: Session, package_id: int, tenant_id: str) -> ArchitecturePackage:
    stmt = select(ArchitecturePackage).where(
        ArchitecturePackage.id == package_id,
        ArchitecturePackage.tenant_id == tenant_id,
    )
    package = db.scalar(stmt)
    if not package:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found")
    return package


@router.post("/create", response_model=ArchitectureCreateResponse, status_code=status.HTTP_201_CREATED)
def create_architecture(
    payload: ArchitectureCreateRequest,
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> ArchitectureCreateResponse:
    package = ArchitecturePackage(
        tenant_id=ctx.tenant_id,
        name=payload.name,
        description=payload.description,
        created_by=payload.created_by,
    )
    db.add(package)
    db.flush()

    for req in payload.requirements:
        db.add(Requirement(package_id=package.id, key=req.key, category=req.category, text=req.text, priority=req.priority))
    for domain in payload.domains:
        db.add(Domain(package_id=package.id, name=domain.name, description=domain.description))
    for bc in payload.bounded_contexts:
        db.add(BoundedContext(package_id=package.id, domain_name=bc.domain_name, name=bc.name))
    for svc in payload.services:
        db.add(Service(package_id=package.id, bounded_context_name=svc.bounded_context_name, name=svc.name, service_type=svc.service_type))
    for api in payload.apis:
        db.add(API(package_id=package.id, service_name=api.service_name, name=api.name, method=api.method, path=api.path))
    for event in payload.events:
        db.add(Event(package_id=package.id, name=event.name, producer_service=event.producer_service))
    for entity in payload.data_entities:
        db.add(DataEntity(package_id=package.id, name=entity.name, owning_service=entity.owning_service))
    for node in payload.deployment_nodes:
        db.add(DeploymentNode(package_id=package.id, name=node.name, platform=node.platform))
    for component in payload.infra_components:
        db.add(InfraComponent(package_id=package.id, name=component.name, cloud=component.cloud))
    for std in payload.standards:
        db.add(StandardReference(package_id=package.id, source=std.source, citation=std.citation, license=std.license))

    _audit(db, package.id, ctx.tenant_id, payload.created_by, "architecture.create", {"name": payload.name})
    db.commit()
    db.refresh(package)

    return ArchitectureCreateResponse(id=package.id, name=package.name, status=package.status, version=package.version)


@router.post("/{package_id}/generate", response_model=ArtifactsListResponse)
def generate_package_artifacts(
    package_id: int,
    payload: GenerateRequest,
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> ArtifactsListResponse:
    package = _fetch_package(db, package_id, ctx.tenant_id)
    artifacts = generate_artifacts(db, package)
    package.status = "generated"
    package.version += 1
    package.updated_at = datetime.utcnow()

    for artifact in artifacts:
        artifact.version = package.version
        db.add(artifact)

    _audit(db, package.id, ctx.tenant_id, payload.actor, "architecture.generate",
           {"artifact_count": len(artifacts), "version": package.version})
    db.commit()

    latest = list(db.scalars(
        select(Artifact)
        .where(Artifact.package_id == package.id, Artifact.version == package.version)
        .order_by(Artifact.created_at.desc())
    ))

    return ArtifactsListResponse(
        package_id=package.id,
        package_name=package.name,
        version=package.version,
        artifacts=[ArtifactResponse(
            id=a.id, artifact_type=a.artifact_type, name=a.name, version=a.version,
            content=a.content, traceability=a.traceability, created_at=a.created_at,
        ) for a in latest],
    )


@router.get("/{package_id}/artifacts", response_model=ArtifactsListResponse)
def get_package_artifacts(
    package_id: int,
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> ArtifactsListResponse:
    package = _fetch_package(db, package_id, ctx.tenant_id)
    artifacts = list(db.scalars(
        select(Artifact)
        .where(Artifact.package_id == package.id)
        .order_by(Artifact.version.desc(), Artifact.created_at.desc())
    ))
    return ArtifactsListResponse(
        package_id=package.id,
        package_name=package.name,
        version=package.version,
        artifacts=[ArtifactResponse(
            id=a.id, artifact_type=a.artifact_type, name=a.name, version=a.version,
            content=a.content, traceability=a.traceability, created_at=a.created_at,
        ) for a in artifacts],
    )


@router.post("/{package_id}/impact", response_model=ImpactResponse)
def impact_analysis(
    package_id: int,
    payload: ImpactRequest,
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> ImpactResponse:
    package = _fetch_package(db, package_id, ctx.tenant_id)
    result = run_impact_analysis(package, payload.proposed_changes)
    _audit(db, package.id, ctx.tenant_id, payload.actor, "architecture.impact",
           {"severity": result["severity"], "breaking_changes": result["breaking_changes"]})
    db.commit()
    return ImpactResponse(package_id=package.id, **result)


@router.post("/{package_id}/approve", response_model=ApproveResponse)
def approve_architecture(
    package_id: int,
    payload: ApproveRequest,
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> ApproveResponse:
    require_reviewer_or_admin(ctx)
    package = _fetch_package(db, package_id, ctx.tenant_id)
    package.approved = True
    package.approved_by = payload.actor
    package.approved_at = datetime.utcnow()
    package.status = "approved"
    package.version += 1
    package.updated_at = datetime.utcnow()

    db.add(ADR(
        package_id=package.id,
        title=f"ADR-APPROVAL-v{package.version}",
        status="accepted",
        context="Architecture package passed ArchSmith governance review workflow.",
        decision=f"Approved by {payload.actor}. Comment: {payload.comment or 'N/A'}",
    ))
    _audit(db, package.id, ctx.tenant_id, payload.actor, "architecture.approve",
           {"comment": payload.comment, "version": package.version})
    db.commit()
    db.refresh(package)

    return ApproveResponse(
        package_id=package.id,
        approved=package.approved,
        approved_by=package.approved_by or payload.actor,
        approved_at=package.approved_at or datetime.utcnow(),
        version=package.version,
    )


@router.get("", response_model=list[ArchitectureSummary])
def list_architectures(
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> list[ArchitectureSummary]:
    packages = list(db.scalars(
        select(ArchitecturePackage)
        .where(ArchitecturePackage.tenant_id == ctx.tenant_id)
        .order_by(ArchitecturePackage.updated_at.desc())
    ))
    return [ArchitectureSummary(
        id=p.id, name=p.name, description=p.description,
        status=p.status, version=p.version, approved=p.approved, updated_at=p.updated_at,
    ) for p in packages]


@router.get("/dashboard/summary", response_model=DashboardResponse)
def dashboard_summary(
    db: Session = Depends(get_db),
    ctx: RequestContext = Depends(get_request_context),
) -> DashboardResponse:
    packages = list(db.scalars(
        select(ArchitecturePackage).where(ArchitecturePackage.tenant_id == ctx.tenant_id)
    ))
    total = len(packages)
    approved = sum(1 for p in packages if p.approved)
    pending = total - approved

    nfr_scores: list[float] = []
    for p in packages:
        reqs = p.requirements
        if reqs:
            nfr_count = sum(1 for r in reqs if r.category.upper() == "NFR")
            nfr_scores.append(round((nfr_count / len(reqs)) * 100, 2))
        else:
            nfr_scores.append(0.0)

    avg_nfr = round(sum(nfr_scores) / len(nfr_scores), 2) if nfr_scores else 0.0

    return DashboardResponse(
        total_packages=total,
        approved_packages=approved,
        pending_reviews=pending,
        avg_nfr_coverage=avg_nfr,
        packages=sorted([
            ArchitectureSummary(id=p.id, name=p.name, description=p.description,
                                status=p.status, version=p.version, approved=p.approved, updated_at=p.updated_at)
            for p in packages
        ], key=lambda x: x.updated_at, reverse=True),
    )
