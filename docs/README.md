# YOBO — Documentation Map

> New to this repo? Start here. This page answers the questions a tech-curious QA/SDET would
> actually ask, and points to exactly the doc that answers each one.

| Question | Answer |
|---|---|
| What is this, in plain terms? | [`business-overview.md`](./business-overview.md) sections 1–2 |
| What do AA / FIP / FIU actually mean? | [`business-overview.md`](./business-overview.md) section 3 |
| Who's involved / stakeholders? | [`business-overview.md`](./business-overview.md) section 6 |
| What does it depend on? | [`business-overview.md`](./business-overview.md) section 7, [`shared-platform-services.md`](./shared-platform-services.md) |
| How does account linking & consent actually work — tech flow? | [`architecture-and-flow.md`](./architecture-and-flow.md) |
| What's the highest-risk testing theme? | [`business-overview.md`](./business-overview.md) section 5 (consent-boundary integrity) |
| What does the UI need to get right, consistently? | [`ui-consistency.md`](./ui-consistency.md) |
| What's tested? | [`../regression-checklist.md`](../regression-checklist.md) |
| What's automated? | [`../automation/README.md`](../automation/README.md) |
| What does a real-looking defect report look like? | [`../sample-defect-report.md`](../sample-defect-report.md) |
| What does a regression execution report look like? | [`../regression-execution-summary.md`](../regression-execution-summary.md) |

## Business Flow vs. Tech Flow vs. User Flow

- **Business Flow** — why a consent-based Account Aggregator exists at all: financial data is
  scattered across institutions, and the only safe way to share it with a trusted app or lender is
  through an explicit, revocable, scoped consent rather than handing over credentials. See
  [`business-overview.md`](./business-overview.md) sections 1 and 4.
- **Tech Flow** — how account linking, consent presentation, data fetch, and revocation actually
  execute between YOBO, the FIP (bank), and the FIU (requesting app). See
  [`architecture-and-flow.md`](./architecture-and-flow.md).
- **User Flow** — what the user actually clicks through: Link Account → authenticate with the
  bank → review and approve (or deny) a Consent Artifact → view aggregated data on the Dashboard
  → revoke consent whenever they choose. See the README's
  [How It Works](../README.md#-how-it-works--consent--data-sharing-flow) section.

## Reading Order

```
README.md (repo root)
      │
      ▼
docs/business-overview.md      ← what this is, AA/FIP/FIU roles, consent lifecycle, stakeholders
      │
      ▼
docs/architecture-and-flow.md  ← account linking + consent/data-sharing flow, revocation timing risk
      │
      ▼
docs/ui-consistency.md         ← consent-status and cross-FIP UI consistency
      │
      ▼
docs/shared-platform-services.md  ← company-wide services this product depends on
      │
      ▼
regression-checklist.md → sample-defect-report.md → regression-execution-summary.md → automation/README.md
```
