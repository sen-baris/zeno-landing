# Zeno editorial simplification feature audit — 2026-08-27

## Scope and acceptance criteria

Audited the professional editorial homepage redesign: the seven-section information architecture,
serif display typography, forest-and-paper palette, simplified Presentation Agent composition,
combined customer/audience proof, unboxed why/how/what narratives, merged adoption/trust content,
and single conversion section.

Acceptance required no more than seven homepage sections, 45 bordered descendants, and three
shadows; one dominant product composition; no obsolete ledger or platform-showcase code; all eight
approved customer logos; preserved homepage anchors and both conversion routes; hero primary CTA
visibility at 1280×720; WCAG A/AA automated scans across all three routes; reflow at 200 percent
text zoom; responsive evidence at 390px, 768px, and 1440px; no motion-dependent meaning; existing
coverage and client-JavaScript budgets; and no unresolved P0–P2 finding.

## Files and boundaries reviewed

- Homepage Astro composition, customer-logo rail, Presentation Agent visual, shared layout, header,
  footer, and global responsive styles
- Homepage content arrays, approved claims resolution, eight customer-logo records, and asset mapping
- IBM Plex package intake, dependency register, lockfile, and third-party notice
- Assessment and demo form rendering, validation, consent, failure, retry, duplicate-submission, and
  no-JavaScript fallback behavior under the calmer shared tokens
- Homepage funnel, navigation, accessibility, reduced-motion, reflow, cross-browser, and visual tests

No claim record, lead contract, submission adapter, analytics event, route, assessment calculation,
customer asset, or production release gate changed. Harvey and Legora were visual-strategy references
only; no code, component, layout, asset, or claim was copied.

## Commands and environments

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- `pnpm format`, `pnpm lint`, and `pnpm typecheck`
- `pnpm check`
- `pnpm exec playwright test tests/e2e/funnel.spec.ts --project=chromium`
- `pnpm exec playwright test tests/e2e/visual.spec.ts --project=chromium --update-snapshots`
- `pnpm test:e2e` using Playwright's isolated server
- Headless Chromium measurements at 390px, 768px, 1280×720, and 1440px
- Direct review of the 390px and 1440px full-page visual baselines
- Stale-component, font, palette, motion, and selector searches with `rg`

## Findings

### ZES-001 — P2 — Coral micro-labels missed WCAG AA contrast

- Affected surface: small source indices, benefit numbers, platform-pillar labels, operating-model
  numbers, and adoption day labels
- User and impact: low-vision readers could have difficulty reading operational labels
- Preconditions: default canvas or paper background with the original coral text treatment
- Reproduction: run the homepage axe WCAG A/AA scan after the first implementation pass
- Expected: small text reaches at least 4.5:1 contrast against its rendered background
- Actual: `#C45C43` measured 4.23:1 on paper and 3.87:1 on canvas at the rendered label sizes
- Evidence: first isolated Chromium accessibility result, with failures tied to each affected label
- Root cause: the approved coral accent was used for small text rather than a non-text accent
- Required correction: use the forest action color for small labels and retain coral as the non-text
  status dot, focus treatment, and score marker
- Regression verification: the final axe run passes `/`, `/ai-readiness`, and `/demo` in Chromium,
  Firefox, and WebKit
- Status: RESOLVED

### ZES-002 — P2 — Two display strings overflowed at 200 percent text zoom

- Affected surface: mobile homepage display headings and generated-deck title treatment
- User and impact: text-zoom users could encounter horizontal scrolling and clipped content
- Preconditions: 390px viewport with the document root font size increased to 200 percent
- Reproduction: open the homepage at 390×844, apply `html { font-size: 200%; }`, and compare document
  scroll width with viewport width
- Expected: all content reflows within the viewport without loss of information or functionality
- Actual: the first pass produced document width beyond the viewport because display and strong text
  did not expose an emergency wrap opportunity
- Evidence: the first mobile reflow Playwright failure
- Root cause: the new serif display rules used balanced wrapping but omitted `overflow-wrap`
- Required correction: apply `overflow-wrap: anywhere` to display headings, interface headings, and
  strong product-display text
- Regression verification: the 390px/200-percent Playwright check passes and reports no horizontal
  overflow; normal 390px, 768px, and 1440px measurements also match their viewport widths
- Status: RESOLVED

### ZES-003 — P3 — A reused development server invalidated one full-suite run

- Affected surface: local Playwright assessment and demo hydration checks
- User and impact: no product defect; the reused server produced misleading timeouts after the build
  step refreshed Astro's generated state
- Preconditions: run the production build while a manually started development server remains
  available for Playwright reuse
- Reproduction: keep that server active, run `pnpm check`, then invoke the complete Playwright suite
- Expected: browser automation owns a clean server with the test gateway environment
- Actual: static pages loaded, but interactive islands did not hydrate in the reused process
- Evidence: the first complete run timed out waiting for assessment radios and demo fields while its
  static, navigation, accessibility, and visual cases continued to pass
- Root cause: local server lifecycle and reuse, not application source or form behavior
- Required correction: stop the manual server and rerun with Playwright's isolated web server
- Regression verification: the isolated complete run passes all 33 cases across Chromium, Firefox,
  and WebKit
- Status: RESOLVED

## Density and visual review

- Homepage sections: 7 — target no more than 7
- Bordered descendants inside `main`: 34 — target no more than 45
- Shadowed descendants inside `main`: 1 — target no more than 3
- Primary hero CTA bottom edge at 1280×720: 511px — visible without scrolling
- Homepage total client JavaScript: 0.1KB gzip — budget 75KB
- Horizontal overflow: none at 390px, 768px, 1280px, or 1440px
- Motion: no automatic homepage animation; reduced-motion mode retains the complete product story
- Full-page baselines: reviewed at 390px and 1440px; 768px baseline regenerated and exercised in the
  passing visual suite

The retained rules are local separators for hierarchy, not decorative background lines. The only
homepage shadow belongs to the product frame. Mobile-menu elevation is present only while the menu
is available.

## Claims, provenance, and dependency review

- All eight previously approved logo records and supplied SVG assets remain unchanged and render in
  their existing registry order.
- No customer outcome, adoption percentage, ROI, security certification, or compliance claim was
  added. The 30/60/90 numbers remain explicitly an adoption-observation framework.
- The Presentation Agent remains a project-owned static Astro illustration derived from the accepted
  product narrative; it contains no customer data, external UI code, or third-party visual asset.
- IBM Plex Serif 5.3.0 replaces IBM Plex Sans Condensed. The exact package is OFL-1.1 licensed, has no
  runtime dependencies or network behavior, and is documented in the intake record, dependency
  register, lockfile, and third-party notice.
- No Harvey, Legora, component-library, animation-package, icon-library, analytics, CRM, hosting, or
  deployment dependency entered the repository.

## Regression coverage and rerun results

- Static verification: PASS — formatting, lint, strict types, preview build, and budgets
- Unit/component/integration: PASS — 61 tests
- Coverage: PASS — 96.78% statements, 98.67% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS — 33 tests across Chromium, Firefox, and WebKit
- Automated accessibility: PASS — no axe WCAG A/AA findings on `/`, `/ai-readiness`, or `/demo`
- Responsive and visual: PASS — 390px, 768px, and 1440px references; 200 percent text zoom; keyboard
  focus; and mobile navigation
- Forms and fallbacks: PASS — assessment-to-demo prefill, native demo success, server failure/retry,
  consent, duplicate-submission protection, and no-JavaScript messaging

## Unverified release surfaces and risk

- Final capability, trust, privacy, security, and legal wording still requires the existing accountable
  approvals enforced by the production release gate.
- A live lead gateway, CRM, consented analytics provider, hosting, DNS, redirect removal, production
  Core Web Vitals, and manual assistive-technology review remain release-audit work.
- Customer-logo permission remains subject to its recorded re-verification dates.

These are existing production launch gates, not unresolved defects in this preview redesign.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production remains blocked by the existing fail-closed
release gate.
