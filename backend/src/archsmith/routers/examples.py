from __future__ import annotations

from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/examples", tags=["examples"])

EXAMPLES: list[dict] = [
    {
        "id": "retail-banking-core",
        "name": "Retail Banking Core",
        "description": "Cloud-native retail banking platform covering account management, payments, and risk.",
        "tags": ["banking", "payments", "risk", "pci-dss"],
        "domains": [
            {"name": "Accounts", "description": "Customer account lifecycle and balance management"},
            {"name": "Payments", "description": "Payment processing, settlement, and reconciliation"},
            {"name": "Risk", "description": "Real-time fraud detection and risk assessment"},
        ],
        "bounded_contexts": [
            {"domain_name": "Accounts", "name": "Account Management"},
            {"domain_name": "Payments", "name": "Payment Processing"},
            {"domain_name": "Risk", "name": "Fraud & Risk Assessment"},
        ],
        "services": [
            {"bounded_context_name": "Account Management", "name": "Account Service", "service_type": "application"},
            {"bounded_context_name": "Account Management", "name": "Notification Service", "service_type": "worker"},
            {"bounded_context_name": "Payment Processing", "name": "Payment Gateway", "service_type": "gateway"},
            {"bounded_context_name": "Payment Processing", "name": "Settlement Service", "service_type": "worker"},
            {"bounded_context_name": "Fraud & Risk Assessment", "name": "Risk Engine", "service_type": "application"},
        ],
        "apis": [
            {"service_name": "Account Service", "name": "Create Account", "method": "POST", "path": "/accounts"},
            {"service_name": "Account Service", "name": "Get Account", "method": "GET", "path": "/accounts/{id}"},
            {"service_name": "Account Service", "name": "Update Account", "method": "PUT", "path": "/accounts/{id}"},
            {"service_name": "Payment Gateway", "name": "Initiate Payment", "method": "POST", "path": "/payments"},
            {"service_name": "Payment Gateway", "name": "Get Payment Status", "method": "GET", "path": "/payments/{id}"},
            {"service_name": "Risk Engine", "name": "Assess Transaction Risk", "method": "POST", "path": "/risk/assess"},
        ],
        "events": [
            {"name": "AccountCreated", "producer_service": "Account Service"},
            {"name": "PaymentInitiated", "producer_service": "Payment Gateway"},
            {"name": "PaymentCompleted", "producer_service": "Settlement Service"},
            {"name": "FraudAlertRaised", "producer_service": "Risk Engine"},
        ],
        "data_entities": [
            {"name": "Account", "owning_service": "Account Service"},
            {"name": "Customer", "owning_service": "Account Service"},
            {"name": "Payment", "owning_service": "Payment Gateway"},
            {"name": "RiskProfile", "owning_service": "Risk Engine"},
        ],
        "deployment_nodes": [
            {"name": "banking-core-cluster", "platform": "kubernetes"},
            {"name": "banking-data-tier", "platform": "aws-rds"},
        ],
        "infra_components": [
            {"name": "eks-cluster", "cloud": "aws"},
            {"name": "rds-postgres", "cloud": "aws"},
            {"name": "elasticache-redis", "cloud": "aws"},
            {"name": "msk-kafka", "cloud": "aws"},
        ],
        "requirements": [
            {"key": "FR-1", "category": "FR", "text": "Customers can open and manage bank accounts online", "priority": "high"},
            {"key": "FR-2", "category": "FR", "text": "Customers can initiate domestic and international payments", "priority": "high"},
            {"key": "FR-3", "category": "FR", "text": "Risk engine assesses transaction risk in real-time", "priority": "high"},
            {"key": "FR-4", "category": "FR", "text": "Customers receive notifications for all account activity", "priority": "medium"},
            {"key": "NFR-1", "category": "NFR", "text": "System must maintain 99.99% uptime SLA", "priority": "high"},
            {"key": "NFR-2", "category": "NFR", "text": "All PII data encrypted at rest (AES-256) and in transit (TLS 1.3)", "priority": "high"},
            {"key": "NFR-3", "category": "NFR", "text": "Payment API response time under 200ms at 95th percentile", "priority": "high"},
            {"key": "NFR-4", "category": "NFR", "text": "System must comply with PCI-DSS v4.0 and Basel III", "priority": "high"},
        ],
        "standards": [
            {"source": "PCI-DSS v4.0", "citation": "Payment Card Industry Data Security Standard", "license": "public"},
            {"source": "Basel III", "citation": "Bank for International Settlements risk framework", "license": "public"},
        ],
    },
    {
        "id": "ecommerce-platform",
        "name": "E-Commerce Platform",
        "description": "Scalable multi-vendor e-commerce microservices platform with real-time inventory and order management.",
        "tags": ["e-commerce", "microservices", "retail", "catalog"],
        "domains": [
            {"name": "Catalog", "description": "Product listing, categorisation, and search"},
            {"name": "Orders", "description": "Order lifecycle from placement to delivery"},
            {"name": "Payments", "description": "Checkout, payment processing, and refunds"},
            {"name": "Fulfillment", "description": "Inventory management, picking, and shipping"},
        ],
        "bounded_contexts": [
            {"domain_name": "Catalog", "name": "Product Management"},
            {"domain_name": "Orders", "name": "Order Management"},
            {"domain_name": "Payments", "name": "Checkout & Billing"},
            {"domain_name": "Fulfillment", "name": "Inventory & Shipping"},
        ],
        "services": [
            {"bounded_context_name": "Product Management", "name": "Product Service", "service_type": "application"},
            {"bounded_context_name": "Product Management", "name": "Search Service", "service_type": "application"},
            {"bounded_context_name": "Order Management", "name": "Order Service", "service_type": "application"},
            {"bounded_context_name": "Checkout & Billing", "name": "Checkout Service", "service_type": "application"},
            {"bounded_context_name": "Checkout & Billing", "name": "Payment Processor", "service_type": "gateway"},
            {"bounded_context_name": "Inventory & Shipping", "name": "Inventory Service", "service_type": "application"},
            {"bounded_context_name": "Inventory & Shipping", "name": "Shipping Service", "service_type": "worker"},
        ],
        "apis": [
            {"service_name": "Product Service", "name": "List Products", "method": "GET", "path": "/products"},
            {"service_name": "Product Service", "name": "Get Product", "method": "GET", "path": "/products/{id}"},
            {"service_name": "Order Service", "name": "Place Order", "method": "POST", "path": "/orders"},
            {"service_name": "Order Service", "name": "Get Order", "method": "GET", "path": "/orders/{id}"},
            {"service_name": "Checkout Service", "name": "Start Checkout", "method": "POST", "path": "/checkout"},
            {"service_name": "Inventory Service", "name": "Check Stock", "method": "GET", "path": "/inventory/{sku}"},
        ],
        "events": [
            {"name": "OrderPlaced", "producer_service": "Order Service"},
            {"name": "OrderShipped", "producer_service": "Shipping Service"},
            {"name": "PaymentCaptured", "producer_service": "Payment Processor"},
            {"name": "InventoryReserved", "producer_service": "Inventory Service"},
            {"name": "StockThresholdBreached", "producer_service": "Inventory Service"},
        ],
        "data_entities": [
            {"name": "Product", "owning_service": "Product Service"},
            {"name": "Order", "owning_service": "Order Service"},
            {"name": "Cart", "owning_service": "Checkout Service"},
            {"name": "InventoryItem", "owning_service": "Inventory Service"},
            {"name": "Shipment", "owning_service": "Shipping Service"},
        ],
        "deployment_nodes": [
            {"name": "ecom-app-cluster", "platform": "kubernetes"},
            {"name": "ecom-search-cluster", "platform": "elasticsearch"},
        ],
        "infra_components": [
            {"name": "gke-cluster", "cloud": "gcp"},
            {"name": "cloud-sql-postgres", "cloud": "gcp"},
            {"name": "elasticsearch", "cloud": "gcp"},
            {"name": "pub-sub", "cloud": "gcp"},
            {"name": "cloud-cdn", "cloud": "gcp"},
        ],
        "requirements": [
            {"key": "FR-1", "category": "FR", "text": "Shoppers can browse and search a product catalogue", "priority": "high"},
            {"key": "FR-2", "category": "FR", "text": "Shoppers can place and track orders end-to-end", "priority": "high"},
            {"key": "FR-3", "category": "FR", "text": "System reserves inventory at checkout to prevent overselling", "priority": "high"},
            {"key": "FR-4", "category": "FR", "text": "Vendors can list and manage their products via API", "priority": "medium"},
            {"key": "NFR-1", "category": "NFR", "text": "Homepage and search must load under 500ms globally", "priority": "high"},
            {"key": "NFR-2", "category": "NFR", "text": "System must handle 50,000 concurrent users during peak", "priority": "high"},
            {"key": "NFR-3", "category": "NFR", "text": "Order data retained for 7 years for compliance", "priority": "medium"},
        ],
        "standards": [
            {"source": "PCI-DSS v4.0", "citation": "Payment security standard", "license": "public"},
            {"source": "GDPR", "citation": "EU General Data Protection Regulation", "license": "public"},
        ],
    },
    {
        "id": "healthcare-data-platform",
        "name": "Healthcare Data Platform",
        "description": "HIPAA-compliant patient data platform for clinical records, diagnostics, and billing.",
        "tags": ["healthcare", "hipaa", "ehr", "clinical"],
        "domains": [
            {"name": "Patient", "description": "Patient identity, demographics, and consent management"},
            {"name": "Clinical", "description": "Clinical records, diagnostics, and care plans"},
            {"name": "Billing", "description": "Insurance claims, invoicing, and payment processing"},
        ],
        "bounded_contexts": [
            {"domain_name": "Patient", "name": "Patient Identity"},
            {"domain_name": "Clinical", "name": "Electronic Health Records"},
            {"domain_name": "Clinical", "name": "Diagnostics & Imaging"},
            {"domain_name": "Billing", "name": "Claims & Invoicing"},
        ],
        "services": [
            {"bounded_context_name": "Patient Identity", "name": "Patient Registry", "service_type": "application"},
            {"bounded_context_name": "Electronic Health Records", "name": "EHR Service", "service_type": "application"},
            {"bounded_context_name": "Diagnostics & Imaging", "name": "Diagnostics Service", "service_type": "application"},
            {"bounded_context_name": "Claims & Invoicing", "name": "Claims Service", "service_type": "application"},
            {"bounded_context_name": "Claims & Invoicing", "name": "Insurance Gateway", "service_type": "gateway"},
        ],
        "apis": [
            {"service_name": "Patient Registry", "name": "Register Patient", "method": "POST", "path": "/patients"},
            {"service_name": "Patient Registry", "name": "Get Patient", "method": "GET", "path": "/patients/{id}"},
            {"service_name": "EHR Service", "name": "Create Clinical Note", "method": "POST", "path": "/records"},
            {"service_name": "EHR Service", "name": "Get Patient Records", "method": "GET", "path": "/records/{patientId}"},
            {"service_name": "Diagnostics Service", "name": "Submit Lab Result", "method": "POST", "path": "/diagnostics/results"},
            {"service_name": "Claims Service", "name": "Submit Insurance Claim", "method": "POST", "path": "/claims"},
        ],
        "events": [
            {"name": "PatientAdmitted", "producer_service": "Patient Registry"},
            {"name": "ClinicalNoteCreated", "producer_service": "EHR Service"},
            {"name": "LabResultReceived", "producer_service": "Diagnostics Service"},
            {"name": "ClaimSubmitted", "producer_service": "Claims Service"},
            {"name": "ClaimApproved", "producer_service": "Insurance Gateway"},
        ],
        "data_entities": [
            {"name": "Patient", "owning_service": "Patient Registry"},
            {"name": "ClinicalRecord", "owning_service": "EHR Service"},
            {"name": "LabResult", "owning_service": "Diagnostics Service"},
            {"name": "InsuranceClaim", "owning_service": "Claims Service"},
        ],
        "deployment_nodes": [
            {"name": "health-app-cluster", "platform": "kubernetes"},
            {"name": "health-data-tier", "platform": "azure-sql"},
        ],
        "infra_components": [
            {"name": "aks-cluster", "cloud": "azure"},
            {"name": "azure-sql-db", "cloud": "azure"},
            {"name": "azure-blob-storage", "cloud": "azure"},
            {"name": "azure-service-bus", "cloud": "azure"},
            {"name": "azure-key-vault", "cloud": "azure"},
        ],
        "requirements": [
            {"key": "FR-1", "category": "FR", "text": "Clinicians can create and retrieve patient health records", "priority": "high"},
            {"key": "FR-2", "category": "FR", "text": "Lab results are ingested and linked to patient records automatically", "priority": "high"},
            {"key": "FR-3", "category": "FR", "text": "Billing team can submit insurance claims electronically", "priority": "high"},
            {"key": "FR-4", "category": "FR", "text": "Patients can view their own records with consent", "priority": "medium"},
            {"key": "NFR-1", "category": "NFR", "text": "All PHI encrypted at rest and in transit per HIPAA §164.312", "priority": "high"},
            {"key": "NFR-2", "category": "NFR", "text": "Complete audit log for all PHI access and modifications", "priority": "high"},
            {"key": "NFR-3", "category": "NFR", "text": "System must comply with HL7 FHIR R4 and HIPAA", "priority": "high"},
            {"key": "NFR-4", "category": "NFR", "text": "Patient records retained for minimum 10 years", "priority": "medium"},
        ],
        "standards": [
            {"source": "HIPAA", "citation": "Health Insurance Portability and Accountability Act", "license": "public"},
            {"source": "HL7 FHIR R4", "citation": "Fast Healthcare Interoperability Resources", "license": "public"},
        ],
    },
    {
        "id": "realtime-analytics",
        "name": "Real-Time Analytics Platform",
        "description": "Streaming analytics platform for ingestion, processing, and visualisation of high-volume event data.",
        "tags": ["analytics", "streaming", "kafka", "real-time"],
        "domains": [
            {"name": "Ingestion", "description": "Multi-source data ingestion and normalisation"},
            {"name": "Processing", "description": "Stream processing, enrichment, and aggregation"},
            {"name": "Storage", "description": "Time-series storage and query optimisation"},
            {"name": "Visualisation", "description": "Dashboard delivery and alerting"},
        ],
        "bounded_contexts": [
            {"domain_name": "Ingestion", "name": "Event Collection"},
            {"domain_name": "Processing", "name": "Stream Processing"},
            {"domain_name": "Storage", "name": "Time-Series Store"},
            {"domain_name": "Visualisation", "name": "Dashboard & Alerts"},
        ],
        "services": [
            {"bounded_context_name": "Event Collection", "name": "Ingestion Gateway", "service_type": "gateway"},
            {"bounded_context_name": "Event Collection", "name": "Schema Registry", "service_type": "application"},
            {"bounded_context_name": "Stream Processing", "name": "Enrichment Service", "service_type": "stream"},
            {"bounded_context_name": "Stream Processing", "name": "Aggregation Worker", "service_type": "worker"},
            {"bounded_context_name": "Time-Series Store", "name": "Query Service", "service_type": "application"},
            {"bounded_context_name": "Dashboard & Alerts", "name": "Dashboard API", "service_type": "application"},
            {"bounded_context_name": "Dashboard & Alerts", "name": "Alert Engine", "service_type": "worker"},
        ],
        "apis": [
            {"service_name": "Ingestion Gateway", "name": "Ingest Event", "method": "POST", "path": "/events/ingest"},
            {"service_name": "Ingestion Gateway", "name": "Batch Ingest", "method": "POST", "path": "/events/batch"},
            {"service_name": "Query Service", "name": "Query Metrics", "method": "POST", "path": "/metrics/query"},
            {"service_name": "Dashboard API", "name": "Get Dashboard", "method": "GET", "path": "/dashboards/{id}"},
            {"service_name": "Dashboard API", "name": "Create Alert Rule", "method": "POST", "path": "/alerts/rules"},
        ],
        "events": [
            {"name": "RawEventReceived", "producer_service": "Ingestion Gateway"},
            {"name": "EventEnriched", "producer_service": "Enrichment Service"},
            {"name": "AggregationCompleted", "producer_service": "Aggregation Worker"},
            {"name": "AlertTriggered", "producer_service": "Alert Engine"},
        ],
        "data_entities": [
            {"name": "RawEvent", "owning_service": "Ingestion Gateway"},
            {"name": "EnrichedEvent", "owning_service": "Enrichment Service"},
            {"name": "MetricAggregate", "owning_service": "Aggregation Worker"},
            {"name": "AlertRule", "owning_service": "Alert Engine"},
            {"name": "Dashboard", "owning_service": "Dashboard API"},
        ],
        "deployment_nodes": [
            {"name": "analytics-compute-cluster", "platform": "kubernetes"},
            {"name": "analytics-stream-cluster", "platform": "kafka"},
        ],
        "infra_components": [
            {"name": "eks-cluster", "cloud": "aws"},
            {"name": "msk-kafka", "cloud": "aws"},
            {"name": "opensearch", "cloud": "aws"},
            {"name": "timestream-db", "cloud": "aws"},
            {"name": "s3-data-lake", "cloud": "aws"},
        ],
        "requirements": [
            {"key": "FR-1", "category": "FR", "text": "System ingests events from multiple sources via REST and Kafka", "priority": "high"},
            {"key": "FR-2", "category": "FR", "text": "Events are enriched and aggregated in real-time", "priority": "high"},
            {"key": "FR-3", "category": "FR", "text": "Users can query metrics via dashboard API with sub-second latency", "priority": "high"},
            {"key": "FR-4", "category": "FR", "text": "Alert rules trigger notifications when metric thresholds are breached", "priority": "medium"},
            {"key": "NFR-1", "category": "NFR", "text": "System processes 1 million events per second at peak load", "priority": "high"},
            {"key": "NFR-2", "category": "NFR", "text": "End-to-end latency from ingestion to dashboard under 2 seconds", "priority": "high"},
            {"key": "NFR-3", "category": "NFR", "text": "Raw events retained in data lake for 90 days", "priority": "medium"},
        ],
        "standards": [
            {"source": "Apache Kafka Protocol", "citation": "Kafka distributed event streaming specification", "license": "open-source"},
            {"source": "OpenMetrics", "citation": "Cloud Native Computing Foundation metric exposition format", "license": "open-source"},
        ],
    },
]


@router.get("")
def list_examples() -> list[dict]:
    return [
        {
            "id": e["id"],
            "name": e["name"],
            "description": e["description"],
            "tags": e["tags"],
        }
        for e in EXAMPLES
    ]


@router.get("/{example_id}")
def get_example(example_id: str) -> dict:
    for example in EXAMPLES:
        if example["id"] == example_id:
            return example
    raise HTTPException(status_code=404, detail=f"Example '{example_id}' not found.")
