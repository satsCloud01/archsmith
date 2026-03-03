from __future__ import annotations

from dataclasses import dataclass

from fastapi import Header, HTTPException, status


@dataclass
class RequestContext:
    tenant_id: str
    role: str


def get_request_context(
    x_tenant_id: str = Header(default="default-tenant"),
    x_role: str = Header(default="ARCHITECT"),
) -> RequestContext:
    return RequestContext(tenant_id=x_tenant_id, role=x_role.upper())


def require_reviewer_or_admin(ctx: RequestContext) -> None:
    if ctx.role not in {"REVIEWER", "ADMIN"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only REVIEWER or ADMIN roles can approve packages.",
        )
