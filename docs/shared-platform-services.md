# YOBO — Shared Platform Services

> YOBO doesn't run in isolation — it's one of several products (Collection, Payout, Connected
> Banking, BBPS, Reseller, YOBO, and others) built on top of a **common company-wide platform
> layer**. This document lists the shared services this Account Aggregator product depends on,
> distinct from its own consent and data-aggregation logic (see the [README](../README.md)).

## Why "Shared Platform" Matters for Testing

A defect in a shared service doesn't stay contained to one product. A bug in the company-wide
**Role & Permission Service** or **Audit Logs**, for example, is especially consequential for
YOBO — as a consent-based Account Aggregator, its entire value proposition rests on access being
correctly scoped and every data-sharing event being reliably logged, both of which lean on
shared platform infrastructure rather than YOBO-only code.

## Shared Platform Services (Company-Wide)

### Identity & Access
- Authentication
- Authorization
- OTP Service
- User Management
- Role & Permission Service

### Merchant Lifecycle
- Merchant Management
- Merchant Onboarding
- Merchant Activation
- Merchant Profile

### Financial Engines
- Commercial Engine
- GST Engine
- Ledger Engine
- Settlement Engine
- Reconciliation Engine

### Reporting & Data Export
- Report Engine
- Export Engine
- Download Engine
- Dashboard Service
- Search Engine
- Filter Engine

### Platform Infrastructure
- Audit Logs
- Activity Logs
- Notification Service
- API Gateway
- Validation Service
- File Upload Service
- File Download Service
- Scheduler / Background Workers

## How YOBO Depends on These

- **Authorization / Role & Permission Service** — every consent grant/revoke and data-sharing
  request YOBO handles is, at its core, an authorization decision — YOBO's own consent engine is
  a product-specific layer on top of this shared access-control infrastructure, similar to how
  Connected Banking's consent management (see the Connected Banking repo's `business-flow.md`)
  depends on the same shared services
- **Audit Logs / Activity Logs** — every instance of a user's financial data being aggregated,
  viewed, or shared needs to be logged reliably and immutably — this is a shared platform
  guarantee YOBO inherits rather than reimplements
- **API Gateway / Validation Service** — as an API-first aggregation product, YOBO's real-time
  multi-bank data requests flow through the same shared gateway and validation layer as every
  other product's API traffic
- **Notification Service** — consent expiry warnings and data-sharing confirmations use the
  shared notification layer

## Platform Summary (Company-Wide Context)

| Product | Approx. Services |
|---|---|
| Collection | 38 |
| Payout | 35 |
| Connected Banking | 28 |
| Shared Platform | 28 |

**~70–80 unique logical services** across the platform in total — many shared rather than
independently reimplemented per product. YOBO does not yet have its own separately-documented
internal service breakdown in this portfolio; its module-level view is in the
[README](../README.md).

## Testing Implication: Blast Radius

When scoping regression for a change to any shared service, ask: *which other products also
depend on this service?* For YOBO specifically, the Role & Permission Service and Audit Logs are
the dependencies most worth flagging — a regression in either has consent-and-compliance
implications that go directly to the core trust model of an Account Aggregator product, not just
a functional inconvenience.
