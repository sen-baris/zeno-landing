# Feature audit: [change name]

## Scope and acceptance

- Date, base revision, and reviewed changed-file scope:
- User request and observable acceptance:
- Affected routes, languages, shared components, and adjacent behavior:
- Out of scope and unchanged release gates:

## Four invariants

| Invariant | Ownership or behavior reviewed |
| --- | --- |
| Ownership | Content, claims, configuration, state, submission truth |
| Feedback | Loading, disabled, success, errors, fallback |
| Failure radius | Adjacent pages/locales, privacy, stale records |
| Timing | Build, hydration, scroll, navigation, abort, cleanup |

## Evidence

| Check | Exact command or reproducible procedure | Result and environment |
| --- | --- | --- |
| Targeted regression | Fill with test names and command | Pass/fail, count, revision |
| Broader gates | Formatting, lint, types, coverage, builds, budgets, governance | Actual results or reason not run |
| Browser behavior | Routes, languages, browser versions/projects, viewport, steps | Observed result |
| Visual review | Page/state pairs, desktop/mobile, enlarged text | Wrapping, clipping, overlap, baseline decision |
| Failure/fallback | Service failure, retry, no JavaScript, reduced motion | Observed result or reason inapplicable |

For reused evidence, cite the prior report and prove the tested code is unchanged. Do not turn a
prior pass into a fresh result. For unchanged documentation-only checks, explain the narrow scope.

## Findings

For each issue include ID, P0-P3 severity, affected surface, user impact, preconditions, numbered
reproduction, expected versus actual behavior, evidence, supported cause, correction, regression
verification, and status. Include an owner and follow-up for any deferred P3.

If no issue is found, describe the adversarial cases exercised. Do not invent a finding to fill
the template.

## Final verification and limitations

Record reruns after fixes and the last relevant edit. List anything not verified and its impact.
Distinguish synthetic form success from actual email delivery, and local builds from deployment.

## Decision

Choose PASS or BLOCKED. PASS requires no unresolved P0-P2. Feature completion is not production
release approval; use the separate release audit when required.
