# YOBO — Architecture & Flow

> See [`business-overview.md`](./business-overview.md) for the AA/FIP/FIU role definitions this
> flow relies on, and [`README.md`](./README.md) for the full documentation map.

## Account Linking Flow

```
User opens YOBO ──▶ Selects "Link Account" ──▶ Chooses a Bank/FIP
      │
      ▼
Redirected to FIP for authentication (YOBO never sees the user's banking credentials)
      │
      ▼
FIP confirms identity ──▶ Returns linked account handles to YOBO
      │
      ▼
Account appears in the user's YOBO Dashboard as "Linked" (no data fetched yet — linking ≠ consent)
```

**Key testing principle:** linking an account and granting consent to share its data are two
**separate** actions. A linked-but-no-active-consent account must never leak data to an FIU.

## Consent & Data-Sharing Flow

```
FIU requests data access (purpose, data types, date range, duration specified upfront)
      │
      ▼
YOBO presents the Consent Artifact to the user — fully explicit, nothing hidden
      │
      ├──▶ User Denies ──▶ REJECTED, no data flows, FIU notified
      │
      ▼
User Approves ──▶ Consent ACTIVE
      │
      ▼
YOBO fetches data from the relevant FIP(s), strictly scoped to the approved data range
      │
      ▼
Data delivered to the FIU, encrypted, matching exactly the approved purpose/scope
      │
      ├──▶ User Revokes (any time) ──▶ Consent REVOKED ──▶ Data sharing stops immediately
      │
      └──▶ Duration Elapses ──▶ Consent EXPIRED ──▶ Data sharing stops automatically
```

## Why Revocation Timing Is the Highest-Risk Test Surface

Because YOBO orchestrates live data flow between two external parties (FIP and FIU) rather than
owning the data itself, the moment between "user clicks Revoke" and "no further data actually
flows" is the product's single most safety-critical window. Any in-flight fetch or scheduled
refresh initiated *before* revocation but completing *after* it needs an explicit, tested rule —
either it's aborted, or the platform can prove the data returned predates the revocation instant.

## System Interaction Map

```
   ┌─────────┐        ┌──────────────────────┐        ┌─────────┐
   │   FIU    │◀──────▶│  YOBO (the AA layer)  │◀──────▶│   FIP   │
   └─────────┘        └──────────┬───────────┘        └─────────┘
                                  │
                     reads/writes Consent Artifact
                     via shared Role & Permission
                     Service + Audit Logs (see
                     shared-platform-services.md)
```

## FIP Integration Variability — A Cross-Bank Consistency Risk

Not every linked FIP returns data in a perfectly uniform shape or at the same latency — some
banks' data feeds are faster or more complete than others. This is conceptually the same risk
category as BBPS's biller-integration variability (see the
[BBPS repository](https://github.com/ghanendra-sdet/bbps-bill-payment-platform)): a defect that
only manifests for accounts linked to specific FIPs, invisible if testing only ever uses one
"reference" bank's dummy data.

**Testing implication:** the regression suite treats "same consent flow, different originating
FIP" as its own dedicated test dimension — see
[`../regression-checklist.md`](../regression-checklist.md) section 4.
