# YOBO — Automation Framework

> Automated scenarios trace directly to [`../regression-checklist.md`](../regression-checklist.md)
> sections 2–3 (consent lifecycle + revocation timing). See
> [`../docs/README.md`](../docs/README.md) for the full documentation map.

Automation for the account-linking-to-consent-revocation journey, built with **Playwright +
TypeScript**.

## Why Playwright

- Strong support for network interception — essential here, since simulating a mid-fetch
  revocation (see [`../docs/architecture-and-flow.md`](../docs/architecture-and-flow.md)) requires
  precise control over request timing
- Fast, reliable cross-browser execution for consent-approval UI flows

## Suggested Project Structure

```
automation/
├── README.md
├── playwright.config.ts
├── tests/
│   └── sample-consent-flow.spec.ts
├── fixtures/
│   └── dummy-fip-data.ts
└── pages/
    ├── AccountLinkingPage.ts
    ├── ConsentApprovalPage.ts
    └── DashboardPage.ts
```

> This repo currently includes one representative sample (`sample-consent-flow.spec.ts`) rather
> than the full framework, to keep the portfolio focused.

## Test Data Policy

All automation uses **dummy data only**: dummy bank/FIP accounts, dummy consent artifacts, and
simulated dummy financial data — never real account credentials or real financial records.

## Priority Automated Scenarios

1. Account linking (happy path, multiple FIPs)
2. Consent approval → active data sharing
3. Consent revocation → immediate data-sharing stop
4. Consent expiry → automatic data-sharing stop
5. Cross-FIP consistency checks
