# Behavior Test Matrix

Choose only the rows that apply, and record why a layer is sufficient.

| Surface                     | Primary evidence                      | Essential scenarios                                                |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| Pure function or validator  | Unit test                             | valid, invalid, boundary, deterministic error                      |
| Content transformation      | Unit test                             | missing fields, ordering, escaping, approved output                |
| Interactive island          | Component test                        | keyboard/pointer parity, state transitions, accessible names       |
| Form                        | Component plus integration            | validation, submit, duplicate submit, server error, retry, success |
| External adapter            | Integration test                      | success, timeout, malformed response, authorization failure        |
| Navigation or CTA           | Component or end-to-end               | correct destination, history, modified click, focus                |
| Consent and analytics       | Integration plus end-to-end           | denied, accepted, changed choice, event payload, no early tracking |
| Critical conversion journey | End-to-end                            | desktop/mobile success, validation, service failure, recovery      |
| Responsive presentation     | Browser/visual evidence               | narrow, medium, wide, zoom, long content                           |
| Accessibility behavior      | Component plus automated/manual audit | semantics, keyboard, focus, announcement, contrast                 |
| Motion or heavy visual      | Component/browser evidence            | reduced motion, unsupported capability, slow device fallback       |
| Localized/shared page       | Paired content plus browser/visual evidence | section and visual parity, language-specific wrapping, first-screen conversion, interactions and localized links |
| Route or SEO change         | Unit plus built HTML/sitemap evidence | self-canonical, reciprocal alternates, exclusions, root and project base paths |
| Agent workflow contract     | Governance fixtures plus scenario walkthrough | discovery, valid references, missing registration, broken handoff, scope and approval boundaries |

## Required habits

- Give each test one behavioral reason to exist.
- Arrange through public inputs and assert public outcomes.
- Use semantic queries before test identifiers.
- Keep one independent browser context per end-to-end test unless state sharing is the behavior.
- Replace arbitrary sleeps with observable readiness.
- Mock at the system boundary, not inside the behavior under test.
- Keep fixtures synthetic, minimal, and free of sensitive information.
- Verify negative assertions do not pass before the interaction has settled.
- Review snapshots deliberately and pair them with behavioral assertions.
- Use $enterprise-ai-localization for the paired acceptance matrix and $enterprise-ai-seo for URL
  and metadata output. A count or absence of overflow cannot prove that a page looks or works right.
- Measure the visible choice card or actual field for first-screen conversion, not a hidden input.
- Record which browser and viewport produced a baseline. Do not accept a generated image merely
  because a snapshot update command succeeds.

## Evidence report

For each changed surface, record:

- Behavior protected
- Layer and test name
- Command run
- Result
- Viewport or environment when relevant
- Manual checks and why automation was insufficient
- Known gap, risk, and owner
