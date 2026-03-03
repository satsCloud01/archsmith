from __future__ import annotations

from ..models import ArchitecturePackage
from ..schemas import ImpactChangeSet


def run_impact_analysis(package: ArchitecturePackage, changes: ImpactChangeSet) -> dict:
    service_names = {svc.name for svc in package.services}
    api_names = {api.name for api in package.apis}
    entity_names = {entity.name for entity in package.data_entities}
    event_names = {event.name for event in package.events}

    breaking_changes: list[str] = []

    for removed in changes.removed_services:
        if removed in service_names:
            breaking_changes.append(
                f"Removing service '{removed}' breaks dependent APIs and all subscribed event consumers."
            )

    for rename in changes.renamed_apis:
        old_name = rename.get("from", "")
        new_name = rename.get("to", "")
        if old_name in api_names and new_name:
            breaking_changes.append(
                f"Renaming API '{old_name}' → '{new_name}' requires contract migration across all consumers."
            )

    for entity in changes.modified_entities:
        if entity in entity_names:
            breaking_changes.append(
                f"Schema change on '{entity}' triggers migration risk and potential downstream data contract violations."
            )

    severity = "low"
    if len(breaking_changes) >= 3:
        severity = "high"
    elif breaking_changes:
        severity = "medium"

    mitigation_plan = [
        "Deploy compatibility adapters for one release cycle before hard cutover.",
        "Version all API contracts and publish consumer migration guides.",
        "Run consumer-driven contract tests (CDCT) before rollout.",
        "Set up canary deployment with gradual traffic shifting.",
    ]
    migration_steps = [
        "Implement dual-write / dual-read data migration path.",
        "Enable feature flags for incremental rollout per consumer.",
        "Monitor error budgets and SLO dashboards during rollout.",
        "Schedule rollback window and coordinate with SRE team.",
    ]

    return {
        "severity": severity,
        "breaking_changes": breaking_changes,
        "mitigation_plan": mitigation_plan,
        "migration_steps": migration_steps,
    }
