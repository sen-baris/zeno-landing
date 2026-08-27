# Zeno presentation and adoption revision audit — 2026-08-27

## Scope and acceptance criteria

Audited the homepage revision that removes the page-wide ruled background, removes buyer-facing
draft disclaimers, adds the approved customer-logo rail, makes the Presentation Agent the lead
product example, and introduces a numeric 30/60/90-day adoption view.

Acceptance required a calmer readable canvas; no public “working copy,” “illustrative product
view,” or similar internal labels; a concrete presentation workflow; a visible but non-fabricated
numeric adoption story; customer logos traceable to supplied source assets and claim records; WCAG
2.2 AA-oriented contrast and reflow; responsive evidence at 390px, 768px, and 1440px; preserved
assessment and demo journeys; and no unresolved P0–P2 finding.

## Files and boundaries reviewed

- Homepage composition, product scenes, customer-logo component, and global responsive styles
- Customer-logo assets, claim records, surface allowlist, and registry-to-asset mapping
- Homepage funnel, accessibility, reduced-motion, navigation, and visual tests
- Existing assessment and demo form behavior after the homepage change
- Official TextCortex presentation, agent, template, and workflow material as research context only

No application state, lead payload, analytics event, external package, or runtime dependency changed.
The 30/60/90 numbers describe an adoption-observation framework; they are not presented as customer
results, ROI, time savings, or a delivery guarantee.

## Commands and environments

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- `pnpm check`
- `pnpm exec playwright test tests/e2e/funnel.spec.ts`
- `pnpm exec playwright test tests/e2e/visual.spec.ts --update-snapshots`
- `pnpm test:e2e`
- Browser inspection of the hero and Presentation Agent scene
- Claims, disclaimer, body-grid, asset, and stale-selector searches with `rg`

## Findings

### ZPA-001 — P2 — Page-wide ruling materially reduced readability

- Affected surface: homepage and interactive route canvas in `src/styles/global.css`
- User and impact: readers experienced visual fatigue because horizontal rules crossed every section
  and competed with large display type
- Preconditions: any viewport on the original ruled body background
- Reproduction: inspect the supplied 2026-08-27 screenshot or open the pre-correction page and scroll
  through a large heading
- Expected: structural rules clarify local groupings without becoming a persistent reading layer
- Actual: the body repeated a horizontal rule every 96px, including directly behind text
- Evidence: stakeholder screenshot and direct feedback that the page was difficult to read
- Root cause: an execution-ledger motif was applied globally instead of being contained to product
  diagrams and structured records
- Required correction: replace the body grid with the solid canvas and remove the secondary grid
  from the hero product workspace
- Regression verification: visual baselines at 390px, 768px, and 1440px show a solid canvas; targeted
  CSS search finds no body background-size rule
- Status: RESOLVED

### ZPA-002 — P2 — Violet operational labels narrowly missed WCAG contrast

- Affected surface: homepage eyebrow and product-story labels
- User and impact: small text could be difficult to read for low-vision users
- Preconditions: default light canvas
- Reproduction: run the cross-route axe WCAG A/AA scan
- Expected: at least 4.5:1 contrast for small text
- Actual: `#7658D5` on the canvas measured 4.46:1
- Evidence: first isolated Chromium, Firefox, and WebKit axe run
- Root cause: the prior violet passed visual review but sat just below the small-text threshold after
  the canvas was simplified
- Required correction: darken the ledger violet to `#6F50CA`
- Regression verification: the final accessibility scan passes on all three routes in Chromium,
  Firefox, and WebKit
- Status: RESOLVED

### ZPA-003 — P3 — Internal drafting labels interrupted the buyer narrative

- Affected surface: homepage hero and all product-scene captions
- User and impact: buyers encountered implementation-state language instead of product meaning
- Preconditions: opening the homepage before the revision
- Reproduction: search rendered content for “Working copy” or “Illustrative product view”
- Expected: approval state remains enforced internally without becoming repeated page copy
- Actual: the hero and product captions exposed internal drafting labels
- Evidence: stakeholder feedback and pre-correction DOM
- Root cause: internal content governance was represented as public prose instead of remaining in
  the registry and release gate
- Required correction: remove public labels and retain claim/release enforcement in code
- Regression verification: Playwright asserts the terms are absent; repository search finds none in
  rendered homepage sources
- Status: RESOLVED

### ZPA-004 — P3 — A manually running preview weakened adapter-test isolation

- Affected surface: local Playwright demo submission tests
- User and impact: the first form run produced misleading failures unrelated to this revision
- Preconditions: Playwright reuses a manually started server without its test gateway environment
- Reproduction: leave the plain preview running, then invoke the funnel suite with server reuse
- Expected: adapter-boundary tests run against Playwright’s isolated server configuration
- Actual: the manual server lacked the controlled test endpoint configuration
- Evidence: initial form failure output; the same cases passed after isolated restart
- Root cause: server lifecycle, not application behavior
- Required correction: stop the manual preview before browser automation, then restore it after tests
- Regression verification: all 33 Playwright tests pass in the final isolated run
- Status: RESOLVED

## Claims and provenance review

- Eight supplied SVGs are registered and rendered: Frommer Legal, KBC, MAHLE, b2venture, atares,
  beeradvocaten, Bovensiepen, and TMG Consultants.
- Each logo has a stable customer claim ID, source asset, approval owner/date, allowed surface,
  attribution, re-verification date, and a note limiting the claim to logo placement.
- Approval is recorded from Baris’s explicit working-session direction on 2026-08-27. The rail makes
  no testimonial, outcome, metric, or endorsement statement beyond the “Selected customers” label.
- The Presentation Agent copy follows stakeholder-supplied product screenshots and official product
  research. It introduces no third-party code or visual asset.
- The visible 30/60/90-day framework communicates what administrators can observe. No unapproved
  adoption percentage, customer usage count, efficiency result, or ROI figure is rendered.

## Regression coverage added

- Unit coverage verifies every homepage customer-logo claim is current, surface-approved, uniquely
  mapped, and backed by a local asset.
- Homepage E2E coverage verifies the Presentation Agent heading, 90-day adoption content, MAHLE and
  TMG logos, absence of internal disclaimers, and continued absence of small-pilot framing.
- Visual references were regenerated and reviewed for 390px, 768px, and 1440px.

## Rerun results

- Static verification: PASS — formatting, lint, strict types, preview build, and budgets
- Unit/component/integration: PASS — 61 tests
- Coverage: PASS — 96.78% statements, 98.67% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS — 33 tests across Chromium, Firefox, and WebKit
- Automated accessibility: PASS — no axe WCAG A/AA findings on the three routes
- Responsive and visual: PASS — reviewed at 390px, 768px, and 1440px; 200 percent text reflow passes
- Reduced motion: PASS — the completed execution path remains available without packet movement

## Unverified release surfaces and risk

- Final capability, trust, privacy, security, and legal wording still requires the accountable
  approvals already enforced by the production release gate.
- Production customer-logo permission should be re-verified by the recorded date or earlier if the
  customer relationship or brand guidance changes.
- No Zeno-specific adoption outcome metric, live lead gateway, CRM, hosting, analytics provider,
  DNS change, or redirect removal has been approved or configured.
- Manual screen-reader coverage and production field Core Web Vitals remain release-audit work.

These remain explicit launch gates, not unresolved defects in this preview change.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production remains blocked by the existing fail-closed
release gate.
