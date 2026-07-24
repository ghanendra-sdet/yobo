# Sample Defect Report — YOBO

> Template + worked examples using dummy data. Reflects the consent-boundary-integrity defect
> theme that is the primary risk area for this module — see
> [`docs/business-overview.md`](./docs/business-overview.md) section 5 for why, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

---

## Defect #1

| Field | Value |
|---|---|
| **ID** | BUG-YOBO-3011 (sample) |
| **Title** | Data fetch under a consent completes successfully after the consent was revoked mid-fetch |
| **Severity** | Critical |
| **Module** | YOBO → Consent Revocation |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. Trigger a dummy data fetch under an active consent
2. While the fetch is in progress (test env timing), revoke that consent
3. Check whether the fetch completes and returns data

**Expected Result**
Per [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md), either the in-flight
fetch should be aborted the instant revocation is processed, or any data ultimately returned must
be provably scoped to before the revocation instant.

**Actual Result**
The in-flight fetch completes and returns data to the FIU even though the consent was revoked
before the fetch finished — the revocation check only runs at fetch *initiation*, not
continuously through the fetch lifecycle.

**Impact**
Data is shared after a user explicitly revoked permission — a direct violation of the product's
core trust guarantee and a serious regulatory/compliance exposure for an Account Aggregator.

**Suggested Fix**
Add a revocation check immediately before the data is handed off to the FIU, not only at fetch
initiation — treat revocation as able to interrupt an in-flight operation, not just block future
ones.

---

## Defect #2

| Field | Value |
|---|---|
| **ID** | BUG-YOBO-3024 (sample) |
| **Title** | "Revoked" and "Expired" consents show identical status badges in Consent History |
| **Severity** | Major |
| **Module** | YOBO → Consent Management / UI |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. Revoke one dummy consent manually
2. Let a second dummy consent expire naturally (test env)
3. Compare both entries in Consent History

**Expected Result**
Per [`docs/ui-consistency.md`](./docs/ui-consistency.md) section 1, "Revoked" and "Expired" must
be visually and textually distinct — one was a deliberate user action, the other a passive
timeout.

**Actual Result**
Both entries show a generic grey "Inactive" badge with no distinction, making it impossible for a
user (or a compliance reviewer) to tell whether the user actively revoked access or simply let it
lapse.

**Impact**
Undermines the transparency guarantee at the heart of the AA model — a user reviewing their
consent history cannot verify their own revocation actions were honored, and compliance audits
lose an important distinction.

**Suggested Fix**
Introduce distinct status values and corresponding UI treatment for `REVOKED` vs. `EXPIRED`,
rather than collapsing both into a shared "Inactive" state.

---

## Defect Reporting Template (blank)

| Field | Value |
|---|---|
| **ID** | |
| **Title** | |
| **Severity** | Minor / Major / Critical / Blocker |
| **Module** | |
| **Environment** | |

**Steps to Reproduce**
1.
2.
3.

**Expected Result**


**Actual Result**


**Impact**


**Suggested Fix**

