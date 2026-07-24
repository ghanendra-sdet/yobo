# YOBO — Regression Checklist & Test Cases

> Sample regression suite structure with dummy data. Format: ID | Scenario | Steps | Expected Result.
> See [`docs/business-overview.md`](./docs/business-overview.md) for why consent-boundary
> integrity (section 5) is treated as the first-class scenario here, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## 1. Account Linking

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-001 | Link a dummy bank account | 1. Select a dummy bank (FIP) 2. Complete dummy authentication | Account appears as "Linked" with zero active consents |
| TC-002 | Link multiple accounts across different banks | 1. Repeat linking for 2+ dummy FIPs | All linked accounts appear correctly attributed to their respective bank |
| TC-003 | Linking without granting consent shares no data | 1. Link an account 2. Do not approve any consent request | No data is fetched or shared for that account |
| TC-004 | Unlink an account | 1. Remove a previously linked account | Account no longer appears; any active consents tied to it are also terminated |

## 2. Consent Lifecycle

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-005 | Consent Artifact is fully explicit | 1. Trigger a dummy FIU consent request | Purpose, data types, date range, and duration are all shown clearly before approval |
| TC-006 | User approves consent | 1. Approve a dummy consent request | Consent status becomes `ACTIVE`; data begins flowing per the approved scope |
| TC-007 | User denies consent | 1. Deny a dummy consent request | Consent status becomes `REJECTED`; no data flows; FIU is notified |
| TC-008 | Consent expires automatically | 1. Simulate a consent reaching its approved duration (test env) | Status becomes `EXPIRED`; data sharing stops automatically, no user action required |
| TC-009 | Data fetch strictly matches approved scope | 1. Approve a consent for a specific date range 2. Inspect the data actually fetched | Fetched data never exceeds the approved date range or data types |

## 3. Consent Revocation (Highest Priority)

> Derived from [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md) — the window
> between revocation and data flow actually stopping is this product's highest-risk test surface.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-010 | Revocation stops future data sharing immediately | 1. Revoke an active consent 2. Attempt a subsequent data fetch under that consent | Fetch is blocked; no data returned |
| TC-011 | In-flight fetch at the moment of revocation | 1. Trigger a data fetch 2. Revoke consent mid-fetch (test env timing) | Either the fetch is aborted, or returned data is provably scoped to before the revocation instant — never data fetched after revocation |
| TC-012 | Revoked consent is clearly distinguished from expired consent | 1. Revoke one consent, let a second expire naturally 2. Compare their history entries | Distinct status labels/timestamps — a compliance reviewer can tell the two apart unambiguously |
| TC-013 | Revocation is logged immutably | 1. Revoke a consent 2. Check the audit log | Revocation event is present, timestamped, and cannot be altered or removed |

## 4. Cross-FIP Consistency

> Derived from [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md) — FIP
> integration variability is analogous to BBPS's biller-integration risk.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-014 | Same consent flow, different originating FIPs | 1. Run the identical consent-approval and data-fetch flow against 2+ dummy FIPs | Behavior and data completeness are consistent — no FIP silently underperforming |
| TC-015 | Slow/partial FIP response handled gracefully | 1. Simulate a delayed or partial dummy FIP response | Clear "still loading" / "partial data" state shown — never a silently stale or wrong figure |

## 5. UI Consistency

> Derived from [`docs/ui-consistency.md`](./docs/ui-consistency.md) — cross-screen consistency,
> not single-screen correctness.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-016 | Consent status labeling consistency | 1. Compare "Active"/"Pending"/"Revoked"/"Expired"/"Rejected" labels across Consent Approval, Consent Management, and Dashboard | Identical labels and colors everywhere |
| TC-017 | "Revoked" visually distinct from "Expired" | 1. Compare a revoked consent's history entry against an expired one | Different color/label — never overlapping |
| TC-018 | Linked-vs-consented terminology consistency | 1. Compare how "Linked" and "Active Consent" are labeled across Account Linking and Dashboard | Identical terminology, never conflated |
| TC-019 | Consent states distinguishable without color | 1. View all 5 consent states with color/grayscale rendering simulated | Each remains distinguishable via icon/text label alone |

## 6. Full Regression Checklist

- [ ] Account Linking (single / multiple banks, unlinking)
- [ ] Consent Lifecycle (request, approve, deny, expire)
- [ ] Consent Revocation (immediate stop, in-flight fetch handling, audit logging)
- [ ] Cross-FIP Consistency
- [ ] Financial Data Dashboard accuracy
- [ ] UI Consistency (consent status labeling, terminology, accessibility)

## 7. Priority Automation Candidates

1. Account linking (happy path, multiple FIPs)
2. Consent approval → active data sharing
3. Consent revocation → immediate data-sharing stop
4. Consent expiry → automatic data-sharing stop
5. Cross-FIP consistency checks

See [`automation/`](./automation) for the Playwright implementation.
