# Feature Audit Contract

## Severity

- P0 — Active data exposure, security compromise, legal breach, destructive behavior, or site-wide outage. Stop work and escalate.
- P1 — Critical conversion failure, materially false public claim, serious accessibility blocker, or major regression without a safe workaround.
- P2 — Significant defect affecting a real user path, device, failure state, trust signal, performance budget, or maintainability with likely near-term impact.
- P3 — Minor defect or polish issue with limited impact and a safe workaround.

## Finding fields

Every finding must include:

- ID and severity
- Affected page, component, file, or external surface
- User and impact
- Preconditions
- Reproduction steps
- Expected behavior
- Actual behavior
- Evidence
- Root cause or strongest supported hypothesis
- Required correction
- Regression test or verification
- Status
- Owner and follow-up for an allowed P3 deferral

## Audit report

1. Scope and acceptance criteria
2. Revision or changed files reviewed
3. Commands and environments used
4. Findings ordered by severity
5. Fixes applied
6. Regression coverage added
7. Rerun results
8. Anything not verified and its risk
9. Final decision: PASS or BLOCKED

PASS requires no unresolved P0-P2. A command that was not run cannot be reported as passing.
