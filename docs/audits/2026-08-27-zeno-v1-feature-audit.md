# Zeno V1 feature audit — 2026-08-27

## Scope and acceptance criteria

Audited the three-route Zeno V1 preview: static homepage, AI Readiness Assessment, progressive demo form, claim and release gates, consented analytics boundary, responsive system, and local verification toolchain.

Acceptance required correct scoring and quadrant boundaries; no contact request before assessment value; non-PII session prefill; clear form loading, validation, failure, retry, and duplicate-submission behavior; approved-claims-only proof; WCAG 2.2 AA-oriented semantics; reduced motion; responsive evidence at 390px, 768px, and 1440px; JavaScript budgets; and no unresolved P0–P2 finding.

No Git revision exists because this folder is intentionally not a Git repository. The audit reviewed the current application, tests, configuration, governance, and documentation files in place.

## Environment and commands

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- Playwright Chromium 151, Firefox 153, and WebKit 26.5
- `pnpm check`
- `pnpm test:e2e`
- `python3 tools/check_agent_skills.py`
- `python3 -m unittest discover -s tests -p "test_agent_skills.py" -v`
- `pnpm audit --prod`
- `pnpm licenses list --prod --json`
- `pnpm dlx lighthouse@latest http://127.0.0.1:4173 ...`
- `pnpm build:release` as an expected fail-closed release-gate check
- Claims, PII logging, historical metrics, competitor names, security terms, and external URL searches with `rg`

## Findings

### ZV1-001 — P1 — Pre-hydration demo input could be lost

- Affected surface: `/demo`, `DemoForm`
- User and impact: a prospect typing immediately after navigation could see valid contact fields reset and be unable to advance.
- Preconditions: the server-rendered form is interactive before React finishes hydration.
- Reproduction: navigate to `/demo`, fill step one immediately, select Continue, and observe email/company returning to empty validation states.
- Expected: values entered into visible controls survive and step two opens.
- Actual: the hydration boundary could replace early DOM values.
- Evidence: initial Playwright demo success and retry journeys timed out on step two with reset step-one fields.
- Root cause: interactive controls were server-rendered before the client state owner was ready.
- Correction: changed both stateful surfaces to client-only React islands with an understandable loading/JavaScript fallback; initialized assessment prefill synchronously at island creation.
- Regression verification: direct demo, assessment-prefilled demo, server failure/retry, and JavaScript-disabled fallback journeys pass in Chromium, Firefox, and WebKit.
- Status: RESOLVED

### ZV1-002 — P2 — Small operational labels missed contrast

- Affected surface: homepage readiness and final CTA sections
- User and impact: low-vision users could not reliably read two small evidence labels.
- Preconditions: default palette at desktop or mobile size.
- Reproduction: run axe on `/`.
- Expected: at least 4.5:1 contrast for small text.
- Actual: ledger blue on sage measured 3.44:1; sage on vermilion measured 3.17:1.
- Evidence: first Playwright axe run.
- Root cause: accent colors were combined without a small-text contrast override.
- Correction: use ink on sage and paper on vermilion for those labels.
- Regression verification: axe WCAG A/AA checks pass on all three routes in all three browser engines; Lighthouse accessibility is 100.
- Status: RESOLVED

### ZV1-003 — P2 — Text-only zoom caused horizontal overflow

- Affected surface: homepage at 390px with 200% root text size
- User and impact: zoomed mobile users had to pan horizontally and content extended beyond the viewport.
- Preconditions: 390px viewport and 200% text size.
- Reproduction: apply `html { font-size: 200% }` and compare document width with viewport width.
- Expected: reflow without horizontal page overflow.
- Actual: document width reached 422px; hero and long display text exceeded their grid tracks.
- Evidence: failed Playwright reflow assertion and bounding-box inspection.
- Root cause: grid children retained intrinsic minimums and mobile display clamps had oversized rem minimums.
- Correction: allow grid children to shrink, permit safe long-text wrapping, constrain evidence stamps, and revise mobile display clamps.
- Regression verification: document width equals 390px at 200% text size in Chromium, Firefox, and WebKit; responsive snapshots pass.
- Status: RESOLVED

### ZV1-004 — P2 — Multi-step focus did not follow changed content

- Affected surface: readiness questions/results and demo steps
- User and impact: keyboard and screen-reader users could remain on a bottom action after the primary question or form heading changed.
- Preconditions: use Next, Back, complete the assessment, or reveal the email plan form.
- Reproduction: inspect active element after a step transition.
- Expected: focus moves to the new question, result heading, form-step heading, or first revealed contact field.
- Actual: focus remained on the triggering control.
- Evidence: adversarial keyboard review.
- Root cause: state transitions lacked an explicit focus contract.
- Correction: added focused, programmatically focusable legends/headings and email-form focus; preserved Safari’s Option+Tab link convention in browser evidence.
- Regression verification: component focus assertions and cross-browser keyboard journeys pass.
- Status: RESOLVED

### ZV1-005 — P2 — Mobile same-page menu remained open

- Affected surface: homepage mobile navigation
- User and impact: after selecting a section, the menu could continue covering the destination content.
- Preconditions: mobile layout and a homepage anchor selection.
- Reproduction: open Menu, choose “Who it’s for,” inspect the `details` state.
- Expected: navigation closes after selection.
- Actual: native `details` remained open.
- Evidence: manual interaction review.
- Root cause: same-document anchors do not close a `details` element automatically.
- Correction: added a project-owned 0.1KB script that closes the nearest mobile menu after link activation.
- Regression verification: dedicated mobile anchor test passes in all three browser engines; homepage remains below its 75KB JavaScript budget.
- Status: RESOLVED

### ZV1-006 — P2 — Synthetic development success could imply delivery

- Affected surface: assessment email action and demo success state
- User and impact: a reviewer could mistake a synthetic local receipt for a delivered email or sales request.
- Preconditions: development mode without a real gateway.
- Reproduction: submit through the development adapter and read the success message.
- Expected: development behavior is useful but cannot imply external delivery.
- Actual: the original success copy did not distinguish synthetic confirmation.
- Evidence: claims and failure-state audit.
- Root cause: the receipt contract had no visible synthetic marker.
- Correction: development receipts use a `preview-` ID prefix; both surfaces explicitly state that no email or information was sent. Production remains same-origin-gateway-only.
- Regression verification: adapter and component tests cover synthetic, configured, rejected, malformed, network, abort, retry, and duplicate paths.
- Status: RESOLVED

### ZV1-007 — P2 — Application formatting changed skill metadata style

- Affected surface: six `.agents/skills/*/agents/openai.yaml` files
- User and impact: governance validation failed, so CI would reject the repository.
- Preconditions: run the initial application-wide formatter.
- Reproduction: run the governance validator after formatting.
- Expected: application formatting leaves governance contracts intact.
- Actual: double-quoted values became single-quoted and failed the repo validator.
- Evidence: validator reported 24 metadata errors.
- Root cause: governance paths were not initially excluded from Prettier.
- Correction: restored required YAML quoting and excluded `.agents`, `.github`, and `AGENTS.md` from application formatting.
- Regression verification: six skills validate and all 14 governance unit tests pass.
- Status: RESOLVED

### ZV1-008 — P3 — Audit tooling polluted evidence or reported avoidable warnings

- Affected surface: local visual baselines and Lighthouse best-practices evidence
- User and impact: visual references contained the Astro dev toolbar; Lighthouse reported a missing favicon and a visible-label/accessibility-name mismatch on Menu.
- Preconditions: development-server visual capture or static Lighthouse run.
- Reproduction: capture the homepage in dev and run Lighthouse.
- Expected: evidence represents only Zeno and has no avoidable console/name warnings.
- Actual: dev controls appeared in captures; `/favicon.ico` returned 404; Menu’s accessible name omitted its visible text.
- Evidence: visual inspection and the first Lighthouse report.
- Root cause: local toolbar enabled, no explicit favicon, and an over-specific summary `aria-label`.
- Correction: disabled the dev toolbar, added a Zeno wordmark favicon, and changed the name to include “Menu.”
- Regression verification: regenerated visual references pass; Lighthouse reports no console or label mismatch items, best practices 100.
- Status: RESOLVED

## Rerun results

- Static preview build: PASS, five pages plus sitemap
- Unit/component/integration: PASS, 60 tests
- Coverage: PASS — 96.17% statements, 98% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS across Chromium, Firefox, and WebKit; Chromium visual baselines at 390px, 768px, and 1440px
- Automated accessibility: PASS, no axe WCAG A/AA findings on the three initial routes
- Lighthouse mobile lab: performance 94, accessibility 100, best practices 100, SEO 100; LCP 2.4s, CLS 0.061, TBT 0ms
- Production dependency audit: PASS, no known vulnerabilities
- Governance: PASS, six skills and 14 validator tests
- Release build: correctly BLOCKED by draft hero/capability/trust/privacy content, absent approved Zeno proof, absent live same-origin lead gateway, and unverified domain redirect removal

## Unverified release surfaces and risk

- Field Core Web Vitals at the 75th percentile, including INP, require production traffic; TBT 0ms is only a lab proxy.
- No CRM, email-delivery, analytics, consent-management, hosting, DNS, redirect, or deployment integration exists.
- Final hero, capability, proof, trust, security, privacy, and legal language is not approved.
- Customer proof and production claims remain intentionally absent.
- Manual screen-reader testing and production cache/header verification remain release-audit work.

These are explicit launch gates, not unresolved defects in the V1 preview implementation.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production release remains blocked by the fail-closed release gate and requires the repository release audit after approvals and integrations exist.
