# Sample Requirement Traceability Matrix — YOBO

> Worked example using dummy data. An RTM is referenced throughout this portfolio as a core QA
> artifact — this is what that artifact actually looks like, not just a claim that it exists.
> See [`docs/README.md`](./docs/README.md) for the full documentation map.

## What an RTM Is Actually For

A regression checklist (see [`regression-checklist.md`](./regression-checklist.md)) answers
"what do we test." An RTM answers a different, equally important question: **"does every
business requirement have test coverage, and is that coverage actually sufficient?"** The two
documents look similar but serve different purposes — a checklist is organized by test area; an
RTM is organized by *requirement*, which is what makes it the tool that actually catches a
requirement with **no** test coverage at all, not just a weakly-tested one.

## The Matrix

| Req ID | Requirement (from a sample sprint story) | Linked Test Case(s) | Automation Status | Coverage Status |
|---|---|---|---|---|
| REQ-601 | A user can link an account without any data being fetched or shared | TC-001, TC-003 | Automated | ✅ Covered |
| REQ-602 | The Consent Artifact shown to the user is fully explicit (purpose, data types, range, duration) before approval | TC-005 | Manual | ✅ Covered |
| REQ-603 | Data fetched under a consent never exceeds the approved date range or data types | TC-009 | Manual | ✅ Covered |
| REQ-604 | Revoking a consent blocks all future fetch attempts immediately | TC-010 | Automated | ✅ Covered |
| REQ-605 | A fetch already in flight at the moment of revocation does not deliver data to the FIU | TC-011 | Manual | ✅ Covered — this is the exact requirement `BUG-YOBO-3011` violated |
| REQ-606 | Revocation is written to the audit log immutably | TC-013 | Manual | ✅ Covered |
| REQ-607 | "Revoked" and "Expired" are visually and textually distinguishable in Consent History | TC-012, TC-017 | Manual | ✅ Covered — this is the exact requirement `BUG-YOBO-3024` violated |
| REQ-608 | The same consent-approval and fetch flow behaves consistently across different originating FIPs | TC-014 | Manual | ✅ Covered |
| REQ-609 | An FIU cannot retain fetched data beyond the consent artifact's own "Data Life After Fetch" field | — | — | ❌ **Gap — no test case exists yet** |
| REQ-610 | The revocation-vs-in-flight-fetch guarantee (REQ-605) holds under many concurrent fetches, not just one isolated fetch | — | — | ❌ **Gap — identified when performance testing was added to this suite; see `docs/tech-and-skills.md` section 5** |

## What the Gaps Actually Caught

This is the part a checklist alone wouldn't surface, because a checklist only tells you about the
tests that already exist:

- **REQ-609** came directly out of reading [`architecture-and-flow.md`](./docs/architecture-and-flow.md)
  section 3's breakdown of the consent artifact's actual field structure — "Data Life After
  Fetch" is a real, regulatorily-meaningful constraint, but every existing test case in this repo
  focuses on whether data *flows* correctly, never on whether an FIU's *retention* of
  already-delivered data is ever checked or audited. This is the same kind of blind spot an RTM
  exists to catch: a requirement nobody wrote a test for because nobody was looking at the
  artifact's full field list, only at the fetch/revoke mechanics. Raised as a new story
  (illustrative ID `YOBO-2203`).
- **REQ-610** is a gap this RTM only caught because performance testing was added to this
  suite's scope at all — `TC-011` proves the revocation-vs-fetch logic is correct for one fetch,
  tested in isolation. It says nothing about whether that same check stays reliable when many
  fetches and revocations are happening concurrently, which per
  [`docs/tech-and-skills.md`](./docs/tech-and-skills.md) section 5 is exactly the condition under
  which a subtle timing gap in that logic would actually have a chance to reproduce.

**The general pattern:** an RTM's value isn't the rows that say "Covered" — those just confirm
existing test design. Its value is specifically the rows that say "Gap," because those are the
requirements a test-case-first workflow (write tests, forget to check them against the original
requirement list) would never have surfaced on its own.
