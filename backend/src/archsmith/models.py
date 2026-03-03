from __future__ import annotations

from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class ArchitecturePackage(Base):
    __tablename__ = "architecture_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tenant_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    created_by: Mapped[str] = mapped_column(String(128), default="system")
    status: Mapped[str] = mapped_column(String(64), default="draft", index=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    approved: Mapped[bool] = mapped_column(Boolean, default=False)
    approved_by: Mapped[str | None] = mapped_column(String(128), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    requirements: Mapped[list[Requirement]] = relationship(back_populates="package", cascade="all, delete-orphan")
    domains: Mapped[list[Domain]] = relationship(back_populates="package", cascade="all, delete-orphan")
    bounded_contexts: Mapped[list[BoundedContext]] = relationship(back_populates="package", cascade="all, delete-orphan")
    services: Mapped[list[Service]] = relationship(back_populates="package", cascade="all, delete-orphan")
    apis: Mapped[list[API]] = relationship(back_populates="package", cascade="all, delete-orphan")
    events: Mapped[list[Event]] = relationship(back_populates="package", cascade="all, delete-orphan")
    data_entities: Mapped[list[DataEntity]] = relationship(back_populates="package", cascade="all, delete-orphan")
    deployment_nodes: Mapped[list[DeploymentNode]] = relationship(back_populates="package", cascade="all, delete-orphan")
    infra_components: Mapped[list[InfraComponent]] = relationship(back_populates="package", cascade="all, delete-orphan")
    adrs: Mapped[list[ADR]] = relationship(back_populates="package", cascade="all, delete-orphan")
    standards: Mapped[list[StandardReference]] = relationship(back_populates="package", cascade="all, delete-orphan")
    artifacts: Mapped[list[Artifact]] = relationship(back_populates="package", cascade="all, delete-orphan")
    audit_logs: Mapped[list[AuditLog]] = relationship(back_populates="package", cascade="all, delete-orphan")


class Requirement(Base):
    __tablename__ = "requirements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    key: Mapped[str] = mapped_column(String(64), index=True)
    category: Mapped[str] = mapped_column(String(32), default="FR")
    text: Mapped[str] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(String(32), default="medium")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="requirements")


class Domain(Base):
    __tablename__ = "domains"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="domains")


class BoundedContext(Base):
    __tablename__ = "bounded_contexts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    domain_name: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    package: Mapped[ArchitecturePackage] = relationship(back_populates="bounded_contexts")


class Service(Base):
    __tablename__ = "services"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    bounded_context_name: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    service_type: Mapped[str] = mapped_column(String(64), default="application")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="services")


class API(Base):
    __tablename__ = "apis"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    service_name: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    method: Mapped[str] = mapped_column(String(16), default="GET")
    path: Mapped[str] = mapped_column(String(255), default="/")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="apis")


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    producer_service: Mapped[str] = mapped_column(String(128), default="")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="events")


class DataEntity(Base):
    __tablename__ = "data_entities"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    owning_service: Mapped[str] = mapped_column(String(128), default="")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="data_entities")


class DeploymentNode(Base):
    __tablename__ = "deployment_nodes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    platform: Mapped[str] = mapped_column(String(64), default="kubernetes")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="deployment_nodes")


class InfraComponent(Base):
    __tablename__ = "infra_components"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    cloud: Mapped[str] = mapped_column(String(32), default="aws")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="infra_components")


class ADR(Base):
    __tablename__ = "adrs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    status: Mapped[str] = mapped_column(String(32), default="proposed")
    context: Mapped[str] = mapped_column(Text, default="")
    decision: Mapped[str] = mapped_column(Text, default="")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="adrs")


class StandardReference(Base):
    __tablename__ = "standard_references"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    source: Mapped[str] = mapped_column(String(255), default="")
    citation: Mapped[str] = mapped_column(Text, default="")
    license: Mapped[str] = mapped_column(String(64), default="internal")
    package: Mapped[ArchitecturePackage] = relationship(back_populates="standards")


class Artifact(Base):
    __tablename__ = "artifacts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    artifact_type: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(255))
    version: Mapped[int] = mapped_column(Integer, default=1)
    content: Mapped[str] = mapped_column(Text)
    traceability: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow)
    package: Mapped[ArchitecturePackage] = relationship(back_populates="artifacts")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    package_id: Mapped[int] = mapped_column(ForeignKey("architecture_packages.id"), index=True)
    tenant_id: Mapped[str] = mapped_column(String(128), index=True)
    actor: Mapped[str] = mapped_column(String(128), default="system")
    action: Mapped[str] = mapped_column(String(128), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow)
    package: Mapped[ArchitecturePackage] = relationship(back_populates="audit_logs")
