# YOBO — Business Overview

> **Start here if you're new to fintech QA, in HR, or from a non-QA technical role.** This
> document explains what an Account Aggregator platform does and why consent is the central
> concept, before you look at any test case or code.

## 1. What problem does it solve?

Financial data about a single user is scattered across many institutions — bank accounts,
deposits, loans, insurance, mutual funds. Before Account Aggregators existed, sharing that data
with a lender, advisor, or budgeting app meant emailing PDF statements or handing over net-banking
credentials — slow, insecure, and impossible to revoke cleanly.

YOBO is a **consent-based Account Aggregator (AA)**: it lets a user securely link accounts across
multiple banks/financial institutions and share a real-time, machine-readable view of that data
with an app or lender they trust — **without YOBO itself ever seeing or storing the underlying
financial data unencrypted**, and with every share governed by an explicit, revocable consent.

## 2. Core Modules

- **Account Discovery & Linking** — user finds and links their accounts across multiple banks/FIs
- **Consent Management** — the user grants, views, and revokes data-sharing consent, scoped to a
  specific purpose, data range, and duration
- **Data Aggregation** — real-time fetch and consolidation of linked account data, per an active
  consent
- **Financial Data Dashboard** — the user's own consolidated view of their linked accounts
- **Consent Revocation** — a user can revoke a previously granted consent at any time, immediately
  stopping further data sharing
- **Audit & Compliance** — every consent action and data-sharing event logged immutably

## 3. Key Roles in the AA Ecosystem (RBI Framework Terminology)

| Role | Who they are | In YOBO's context |
|---|---|---|
| **AA (Account Aggregator)** | The licensed consent-management intermediary | YOBO itself |
| **FIP (Financial Information Provider)** | The bank/institution holding the user's actual account data | The banks a user links |
| **FIU (Financial Information User)** | The app/lender requesting the user's data via consent | The third-party requesting access |
| **Customer** | The individual whose financial data is being aggregated and shared | The end user |

**Critical architectural point for QA:** YOBO is a **data conduit, not a data warehouse** — it
orchestrates consent and data flow between FIPs and FIUs, but is not meant to persist the
underlying financial data beyond what's needed to fulfill an active, time-bound consent. This
shapes the entire risk model below.

## 4. Consent Lifecycle

```
Consent Requested (by FIU, via YOBO)
      │
      ▼
Consent Presented to User (purpose, data types, date range, duration — all explicit)
      │
      ├──▶ User Denies ──▶ Consent REJECTED — no data flows
      │
      ▼
User Approves ──▶ Consent ACTIVE
      │
      ├──▶ Data Fetch & Share (per approved scope, until expiry or revocation)
      │
      ├──▶ User Revokes at any time ──▶ Consent REVOKED — data sharing stops immediately
      │
      └──▶ Duration Elapses ──▶ Consent EXPIRED — data sharing stops automatically
```

## 5. Why Consent Integrity Is the Central Testing Theme

Every other feature in this product is secondary to one guarantee: **data only ever flows for the
exact scope, duration, and purpose the user explicitly approved, and stops the instant that
consent is revoked or expires.** A functional bug elsewhere (a dashboard chart rendering wrong) is
a UX defect; a consent-boundary bug (data still flowing after revocation, or flowing outside the
approved data range) is a **regulatory and trust-critical defect** — the single highest-severity
class of issue this product can produce.

## 6. Stakeholders / Involved Parties

| Stakeholder | Role in this module |
|---|---|
| **Customer / User** | Links accounts, grants/revokes consent, views their own aggregated data |
| **FIP (Bank/Financial Institution)** | Authenticates the user and serves the actual account data per an active consent |
| **FIU (Requesting App/Lender)** | Requests consent and consumes the shared data for its own purpose (e.g. loan underwriting) |
| **Platform Admin/Ops** | Monitors consent volumes, FIP/FIU integration health, and compliance reporting |
| **Compliance Team** | Audits consent artifact integrity and data-retention adherence against RBI AA framework requirements |
| **Support Team** | First point of contact for consent confusion or data-sharing disputes; escalates unresolved cases (see section 8) |

## 7. Dependencies

### Direct Ecosystem Dependencies

Unlike most shared-platform-service dependencies (see
[`shared-platform-services.md`](./shared-platform-services.md)), YOBO's core function depends on
**external FIP integrations** it doesn't control — each linked bank is effectively a live
dependency whose uptime and data-format consistency directly determines whether a user's data
fetch succeeds. This is conceptually similar to BBPS's dependency on biller integrations (see the
[BBPS repository](https://github.com/ghanendra-sdet/bbps-bill-payment-platform)) — an
integration-quality risk largely outside the platform's own code, but still the platform's
responsibility to handle gracefully.

### Shared Platform Services

See [`shared-platform-services.md`](./shared-platform-services.md) for the full company-wide
service list (Authorization/Role & Permission Service, Audit Logs, API Gateway, etc.).

## 8. Cross-Module Dependencies

- **Role & Permission Service** — every consent grant/revoke is fundamentally an authorization
  decision built on this shared service
- **Audit Logs** — every consent action and data-sharing event must be immutably logged for
  compliance
- **AI Dispute Resolution Engine** — consent confusion, data-sharing disputes, and account-detail
  changes are ultimately routed to the shared
  [AI Dispute Resolution Engine](https://github.com/ghanendra-sdet/ai-dispute-resolution-engine)
  — see [`shared-platform-services.md`](./shared-platform-services.md) for how this ties together
  across products

## 9. Glossary

| Term | Meaning |
|---|---|
| **AA (Account Aggregator)** | The licensed consent-management intermediary — YOBO's role |
| **FIP (Financial Information Provider)** | The bank/institution holding the user's actual data |
| **FIU (Financial Information User)** | The app/lender requesting the user's data via consent |
| **Consent Artifact** | The structured record of exactly what was approved — purpose, data types, date range, duration |
| **Data Flow** | The actual (encrypted) transfer of financial data from FIP to FIU, gated by an active consent |
| **Consent Revocation** | A user-initiated action that immediately and permanently stops further data sharing under that consent |
