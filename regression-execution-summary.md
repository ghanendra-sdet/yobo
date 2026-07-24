# YOBO — Regression Execution Summary (Sample)

> Representative regression execution report for portfolio purposes.

## Execution Overview

| Metric | Value |
|---|---|
| Test Cycle | Sample Release Regression |
| Total Test Cases Executed | 44 |
| Passed | 40 |
| Failed | 3 |
| Blocked | 1 |
| Pass Rate | 90.9% |

## Results by Area

| Area | Test Cases | Passed | Failed | Notes |
|---|---|---|---|---|
| Account Linking | 4 | 4 | 0 | — |
| Consent Lifecycle | 5 | 5 | 0 | — |
| **Consent Revocation** | 4 | 2 | 2 | **Critical**: in-flight fetch completed after revocation (see `sample-defect-report.md`) |
| Cross-FIP Consistency | 2 | 2 | 0 | 1 blocked in a prior cycle — dummy second-FIP data now seeded |
| UI Consistency | 4 | 3 | 1 | Revoked-vs-Expired badge collision found |

## Defect Summary

| Severity | Count |
|---|---|
| Critical | 1 |
| Major | 1 |

## Conclusion

The regression cycle's most valuable finding was in Consent Revocation — exactly where this
module's QA strategy places the most weight per
[`docs/business-overview.md`](./docs/business-overview.md) section 5. A critical in-flight-fetch
defect was caught before release, directly validating why revocation timing is treated as the
single highest-priority regression area for an Account Aggregator product.

**See also:** [`docs/business-overview.md`](./docs/business-overview.md) sections 4–5 for the
consent-lifecycle and revocation-risk framing behind this test structure, and
[`sample-defect-report.md`](./sample-defect-report.md) for the full worked defect examples.
