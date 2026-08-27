# Zeno narrative and product-visual revision audit — 2026-08-27

## Scope and acceptance criteria

Audited the homepage revision that changes the buyer narrative to why → how → what, introduces the “Make AI part of everyday work” hero, replaces blue primary actions with a coral action system, adds project-owned product scenes, strengthens enterprise-wide adoption and governance framing, and removes pilot language from assessment recommendations.

Acceptance required a short memorable hero; primary conversion visible at a common laptop viewport; concrete company-wide platform framing; recognizable assistance, agent, workflow, model-choice, and administration scenes; no actual customer data or unapproved metrics; no copied third-party UI code; WCAG 2.2 AA-oriented contrast and reflow; responsive evidence at 390px, 768px, and 1440px; preserved assessment and demo journeys; and no unresolved P0–P2 finding.

## Files and boundaries reviewed

- Homepage, header, footer, global tokens, responsive rules, and static visual components
- Homepage and assessment draft content sources
- Assessment scoring copy and related unit/component tests
- Playwright funnel, accessibility, reduced-motion, reflow, navigation, and visual tests
- Claims registry and release gate
- Beautiful UI reference-only intake decision

Ownership remains explicit: draft public wording lives in repository content and page sources; approved proof can render only from the empty claims registry; product visuals contain synthetic illustrative labels; the demo adapter and consent contracts are unchanged. The revision adds no client state, request boundary, runtime package, remote image, or external script.

## Commands and environments

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- `pnpm check`
- `pnpm test:e2e`
- targeted Chromium funnel and axe reruns during correction
- Chromium visual baseline regeneration at 390px, 768px, and 1440px
- Lighthouse mobile against the static preview
- claims, pilot-language, dependency, and dead-selector searches with `rg`

## Findings

### ZNR-001 — P2 — Small illustrative product labels missed text contrast

- Affected surface: homepage product workspace and three platform scenes
- User and impact: low-vision users could not reliably read several small operational labels
- Preconditions: default light palette
- Reproduction: run the homepage axe WCAG A/AA scan
- Expected: at least 4.5:1 contrast for small text
- Actual: muted labels measured between 3.77:1 and 4.28:1
- Evidence: initial Chromium axe failure identified composer, model, agent, schedule, workflow, and administration labels
- Root cause: the new muted-text mixes were selected visually before small-text contrast verification
- Correction: raised product-scene secondary text to a 72 percent ink mix while preserving hierarchy through size and typography
- Regression verification: axe passes on all three routes in Chromium, Firefox, and WebKit; Lighthouse accessibility is 100
- Status: RESOLVED

### ZNR-002 — P2 — Primary hero conversion initially fell below a common laptop viewport

- Affected surface: homepage hero at 1280 × 720
- User and impact: a first-visit prospect could understand the headline but not see either conversion action without scrolling
- Preconditions: 1280 × 720 viewport with fonts loaded
- Reproduction: inspect the hero action row bounding box after the first narrative implementation
- Expected: the primary and secondary actions are visible with the hero message
- Actual: the action row began around 801px, below the 720px viewport
- Evidence: browser bounding-box inspection and initial hero screenshot
- Root cause: a four-line headline combined with the first split-column proportion and display scale
- Correction: gave the narrative column more width and reduced the responsive display scale; the headline now occupies two lines at that viewport
- Regression verification: action row begins around 624px at 1280 × 720; updated responsive screenshots and cross-browser funnel tests pass
- Status: RESOLVED

### ZNR-003 — P3 — A manually running development server weakened test isolation

- Affected surface: local end-to-end verification process
- User and impact: conversion tests returned synthetic development behavior rather than their controlled `/api/leads` responses, producing misleading failures
- Preconditions: Playwright reuses a manually started server without the test gateway environment
- Reproduction: start the plain development server, then run the funnel suite with server reuse enabled
- Expected: Playwright owns the server environment used by adapter-boundary tests
- Actual: the existing server was reused and the request mocks did not represent the configured production-like path
- Evidence: success and retry assertions failed with development-adapter copy
- Root cause: the visual-review server remained active during the first test run
- Correction: stop the manual server before end-to-end verification and allow Playwright to launch its configured isolated server
- Regression verification: all 33 Playwright tests pass in the final run
- Status: RESOLVED

## Claims and component-intake review

- Product, governance, model-access, EU-focus, security, and privacy language remains draft and is explicitly blocked by the production release gate.
- No customer name, logo, quote, usage figure, ROI estimate, security certification, or compliance guarantee was added.
- The supplied administration screenshot informed layout only; its values were not reproduced.
- All product scenes state or describe their illustrative nature, and the administration view explicitly says no customer data is shown.
- Beautiful UI was treated as visual research only. No code, package, asset, or dependency was copied; the decision is recorded in `docs/component-intake/beautiful-ui-reference.md`.

## Rerun results

- Static verification: PASS — formatting, lint, strict types, preview build, and budgets
- Unit/component/integration: PASS — 60 tests
- Coverage: PASS — 96.17% statements, 98% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS — 33 tests across Chromium, Firefox, and WebKit
- Automated accessibility: PASS — no axe WCAG A/AA findings on the three routes
- Responsive and visual: PASS — reviewed references at 390px, 768px, and 1440px; 200 percent text reflow passes
- Reduced motion: PASS — the static completed execution path remains available
- Lighthouse mobile lab: performance 96, accessibility 100, best practices 100, SEO 100; LCP 2.3s, CLS 0.001, TBT 0ms

## Unverified release surfaces and risk

- Final product, governance, security, EU-focus, trust, privacy, and legal language requires accountable approval.
- Product UI is intentionally illustrative and must be reconciled with approved public capability wording before release.
- No approved Zeno proof item or live lead gateway exists.
- Production field Core Web Vitals, manual screen-reader coverage, CRM, analytics, hosting, DNS, and redirect removal remain release-audit work.

These are explicit launch gates, not unresolved defects in this preview change.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production remains blocked by the existing fail-closed release gate.
