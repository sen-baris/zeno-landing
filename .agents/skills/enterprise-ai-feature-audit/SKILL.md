---
name: enterprise-ai-feature-audit
description: Perform an adversarial quality audit after a meaningful website feature, behavior change, refactor, integration, or bug fix is implemented. Use before declaring feature work complete to find, reproduce, prioritize, fix, and re-verify functional, accessibility, claims, security, performance, responsive, and maintainability defects.
---

# Enterprise AI Feature Audit

Audit the completed change as a skeptical senior reviewer. Passing implementation tests is the starting point, not the conclusion.

## Establish the audit surface

1. Read the request, acceptance criteria, applicable instructions, changed files, and tests.
2. Map the behavior across ownership, feedback, failure radius, and timing.
3. Identify affected users, viewports, input methods, content claims, integrations, and neighboring behavior.
4. Run the targeted verification that the implementer reports, then inspect beyond its happy path.
5. Review affected language pairs with $enterprise-ai-localization and routing/metadata changes
   with $enterprise-ai-seo. Shared changes require checking English for regressions too.

## Challenge the change

- Exercise success, error, empty, loading, retry, duplicate-action, slow-response, navigation, refresh, and cleanup paths that apply.
- Check keyboard and screen-reader semantics, focus, contrast, zoom, reduced motion, touch, and responsive layout.
- Check stale content, unapproved claims, broken attribution, and accidental disclosure.
- Check hydration, client bundle cost, layout stability, media loading, and graceful fallback.
- Check trust boundaries, unsafe rendering, input validation, secret exposure, analytics consent, and third-party behavior.
- Check tests for user-visible assertions, isolation, realistic failure coverage, and false positives.
- Check whether the change creates unnecessary coupling, duplication, or difficult ownership.

## Resolve findings

Record every issue using the standard finding contract and severity scale. Reproduce it before changing code. Fix findings inside the authorized scope, add regression coverage, and rerun the smallest relevant checks followed by the affected suite.

Do not declare completion with an unresolved P0, P1, or P2. A P3 may be deferred only with its impact, owner, and follow-up recorded. Report zero findings only when the audit evidence supports it.

Save the report in `docs/audits/YYYY-MM-DD-topic-audit.md`, even when there are no findings. Use
the template linked from the audit contract. Include the exact tested scope, commands and results,
reviewed visual states, limitations, and final PASS or BLOCKED. Reused evidence must identify its
revision and explain why it is still applicable. Re-run affected checks after the last relevant edit.

Read [references/audit-contract.md](references/audit-contract.md) before recording or resolving findings.
