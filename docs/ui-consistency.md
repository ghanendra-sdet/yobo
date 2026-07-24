# YOBO — UI Consistency

> Consent and account-linking state surfaces across Account Linking, Consent Approval, the
> Financial Data Dashboard, and Consent Management (see
> [`business-overview.md`](./business-overview.md)). This document covers whether it's
> represented **consistently** across all of them.

## Why This Matters More Here Than in Most Modules

Per [`business-overview.md`](./business-overview.md) section 5, this product's central risk is
consent-boundary integrity — a silent failure mode. The UI is a user's only real-time signal for
what's currently shared and with whom. If "Active" and "Expired" consent states aren't visually
and unambiguously distinct, a user cannot make an informed decision about whether to revoke
access — the UI consistency bar here is a trust guarantee, not a polish item.

## 1. Consent Status Representation Consistency

| Status | Expected Label | Expected Color (convention) |
|---|---|---|
| Consent pending approval | "Pending" | Amber |
| Consent active | "Active" | Green |
| Consent revoked by user | "Revoked" | Red/neutral — distinct from "Expired" (user action vs. time-based) |
| Consent expired | "Expired" | Grey — distinct from "Revoked" (the user didn't have to act) |
| Consent rejected at approval | "Rejected" | Red |

**Test scenario:** "Revoked" and "Expired" must never share a label or color — a user reviewing
their consent history needs to tell "I chose to stop this" apart from "this simply timed out."

## 2. Account Linking Status Consistency

| Element | Convention to Verify |
|---|---|
| "Linked" vs. "Consent Active" | Must never be conflated in copy — an account can be linked with zero active consents |
| FIP/bank name display | Identical formatting of bank names across Account Linking, Dashboard, and Consent history |
| Last-refreshed timestamp | Consistent date/time format across the Dashboard and any exported data view |

## 3. Terminology Consistency

Per the glossary in [`business-overview.md`](./business-overview.md), watch for drift on:

- "Consent" vs. "Permission" vs. "Access Grant" used interchangeably for the same concept
- "FIU" / "Requesting App" — the party requesting data should be labeled identically in the
  consent-approval screen and in consent history, never a technical term in one and a
  user-friendly name in the other without an explicit mapping
- "Revoke" vs. "Cancel" vs. "Stop Sharing" as different labels for the same action

## 4. Cross-FIP Consistency

Per [`architecture-and-flow.md`](./architecture-and-flow.md), different linked banks (FIPs) may
return data at different speeds or completeness. This introduces its own consistency requirement:

- A slow or partial FIP response must be communicated with the same "still loading" / "partial
  data" UI pattern regardless of which bank is involved — never a silent stale figure for one
  bank's data and an explicit loading state for another's

## 5. Empty States & Error Messages

- Does the Dashboard show a deliberate empty state for a user with zero linked accounts, distinct
  from a data-fetch error?
- Is the "this bank is temporarily unavailable" message worded consistently regardless of which
  FIP triggered it?

## 6. Cross-Browser & Responsive Consistency

- Do consent status badges and the Dashboard render identically across Chrome, Firefox, and
  Safari/WebKit?

## 7. Accessibility Consistency

- Are Active/Pending/Revoked/Expired/Rejected states distinguishable by more than color alone?

---

## Coverage Mapping

See [`../regression-checklist.md`](../regression-checklist.md) section 5 for the UI consistency
test cases derived from this document.
