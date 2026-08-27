# Zeno product visual and motion audit — 2026-08-27

## Scope and acceptance criteria

Audited the homepage refinement that adds product visuals and entrance motion without changing the
narrative, and that publishes the security certifications with a link to the public trust centre.

Added: a scheduled workflow run scene in the operating-model section, three benefit micro-scenes in
the "Why Zeno" section, an administration console and an audited-certification strip in the trust
section, stage connectors in the platform overview, and a page-wide scroll-reveal motion layer.
Changed: the trust section moves from a two-column grid to a full-width 30/60/90 row followed by the
console and certification strip. The four enterprise operating principles keep their exact wording
and are rendered as the administration surface they describe.

Acceptance required unchanged narrative copy; product scenes consistent with the existing
`.product-frame` idiom; motion that is optional, non-essential, and absent under reduced motion; a
complete page without JavaScript; certification statements traceable to approved claim records; an
external trust-centre link that meets the outbound-link safety contract; WCAG 2.2 AA-oriented
contrast and reflow; responsive evidence at 390px, 768px, and 1440px; a homepage client JavaScript
budget well inside 75KB gzip; and no unresolved P0–P2 finding.

## Files and boundaries reviewed

- New components: `WorkflowRun.astro`, `GovernanceConsole.astro`, `TrustCertifications.astro`,
  `BenefitScene.astro`, `MotionRuntime.astro`
- Homepage composition, platform overview, product workspace, customer logo rail, footer, base layout
- `src/styles/global.css`: new component styles, the `html[data-motion='on']` motion layer, the
  reworked trust-section layout, and removal of the now-dead `.adoption-trust-grid` and `.trust-list`
  rules
- Claims boundary: optional `public_url` on `ClaimRecord`, its https validation in
  `isClaimCurrent`, three certification records, `certificationAssets`, and `trustCenterUrl`
- Tests: claims unit, new certification unit, funnel E2E, visual E2E

No lead payload, analytics event, assessment logic, form behaviour, runtime dependency, or external
package changed. No third-party UI source entered the repository; see
`docs/component-intake/ready-made-ui-libraries.md`.

## Commands and environments

- macOS arm64, Node 23.11.0 (the machine default is Node 20, which pnpm rejects), pnpm 10.32.1
- `pnpm check` — formatting, lint, strict types, coverage, preview build, client budgets
- `pnpm check:governance`
- Isolated Playwright funnel suite across Chromium, Firefox, and WebKit against a preview build
  started with the documented gateway environment
- `pnpm test:e2e --project=chromium tests/e2e/visual.spec.ts` after regenerating references
- Browser inspection of every new scene at 390px, 768px, and 1440px
- Direct browser probing of the lead adapter while root-causing ZPV-004

## Findings

### ZPV-001 — P2 — Entrance motion made the page fail an automated contrast scan

- Affected surface: homepage, every element inside a `[data-reveal]` container
- User and impact: text is transparent or partially transparent while it fades in, so an automated
  audit run at that moment reports serious colour-contrast failures across the page
- Preconditions: motion enabled, axe analysing a frame mid-transition
- Reproduction: run the cross-route axe WCAG A/AA scan immediately after `page.goto('/')`
- Expected: the audit evaluates the settled page
- Actual: 408 contrast violations were reported against blended mid-transition colours
- Evidence: first isolated Chromium axe run on the homepage
- Root cause: the accessibility test scanned before the reveal transitions completed
- Required correction: added `settleRevealMotion`, which scrolls the page so every observer fires,
  waits for all `[data-reveal]` elements to be marked revealed, then awaits every finite animation.
  The looping "in progress" indicator is excluded by its infinite iteration count so the helper
  cannot hang.
- Regression verification: the accessibility scan passes on all three routes in Chromium, Firefox,
  and WebKit, and a separate test asserts no element inside a revealed container is left below full
  opacity
- Status: RESOLVED

### ZPV-002 — P2 — Smooth scrolling defeated the reveal-settling helper

- Affected surface: homepage motion tests
- User and impact: only one of nineteen reveal targets was ever observed, so both new motion tests
  and the accessibility scan reported failures unrelated to the page itself
- Preconditions: `html { scroll-behavior: smooth }` with programmatic stepped scrolling
- Reproduction: call `window.scrollTo(0, y)` in a loop and count elements still missing
  `data-revealed`
- Expected: each step lands before the next frame so IntersectionObserver fires
- Actual: each call restarted a smooth scroll animation and the page barely moved; 18 targets
  remained unrevealed
- Evidence: `expect.poll` reporting 18 outstanding targets
- Root cause: test instrumentation, not application behaviour
- Required correction: scroll with `behavior: 'instant'` inside the helper
- Regression verification: all 39 funnel tests pass across the three browsers
- Status: RESOLVED

### ZPV-003 — P3 — The outbound-link test would have made the suite depend on a live third party

- Affected surface: `internal navigation resolves to real pages or homepage sections`
- User and impact: the existing test issues a real request for every `href` on the homepage. Adding
  the trust-centre link would have made an offline or rate-limited run fail for reasons unrelated to
  the site
- Preconditions: any homepage link pointing at another origin
- Reproduction: add an external `href` and run the test without network access
- Expected: internal routes are fetched; external destinations are checked against a contract
- Actual: the test fetched every destination indiscriminately
- Required correction: split internal from external. Internal links are still fetched and their
  fragments resolved. External links are asserted to be https, `target="_blank"`, and to carry
  `rel="noopener"`, and at least one is required to exist
- Regression verification: the test passes in all three browsers and performs no third-party request
- Status: RESOLVED

### ZPV-004 — P1 — Pre-existing: the synthetic lead adapter throws in real browsers

- Affected surface: `src/lib/leads/adapter.ts`, synthetic branch; the demo request form on `/demo`
- User and impact: the primary conversion fails. The form shows "The request could not be sent.
  Please try again." and never reaches the success status
- Preconditions: `PUBLIC_LEAD_ADAPTER` unset, which is the default in development and in any preview
  build that does not set it
- Reproduction: complete the demo form against a dev server started without lead environment
  variables
- Expected: the synthetic adapter returns a `preview-<uuid>` receipt
- Actual: `(configuration.createId ?? crypto.randomUUID)()` detaches `randomUUID` from `crypto`, and
  the call throws `TypeError: Illegal invocation`
- Evidence: confirmed directly in Chromium — `const g = crypto.randomUUID; g()` throws
  `TypeError: Illegal invocation`. The same demo tests pass against a build started with
  `PUBLIC_LEAD_ADAPTER=gateway`, which never enters this branch
- Root cause: an unbound method reference. It is missed by
  `tests/unit/lead-adapter.test.ts`, which injects `createId` and so never exercises the default,
  and by the E2E suite, whose `playwright.config.ts` server sets `PUBLIC_LEAD_ADAPTER=gateway`
- Required correction: bind the call, for example
  `configuration.createId ?? (() => crypto.randomUUID())`, and add a unit test that fails when the
  function is detached
- Status: OPEN — out of scope for this change, reported to the owner and queued as separate work.
  This defect predates this revision and is not caused by it

### ZPV-005 — P3 — A shared list reset silently overrode the new hero stage rules

- Affected surface: `.platform-overview-flow` stage stacks in `src/styles/global.css`
- User and impact: the connect stage's gathering bracket rendered inside the source tiles instead of
  beside them, and the intended spacing above each stack was ignored
- Preconditions: the hero rework, on any viewport wide enough to show the three-column flow
- Reproduction: inspect the hero frame before the correction; the hand-off dot overlaps the
  "Business systems" tile
- Expected: `.source-stack { padding-right: 30px }` and `.stage-stack { margin-top: 34px }` apply
- Actual: the pre-existing `.platform-overview-flow ul` reset is one class-plus-element more
  specific than a single class, so its `padding: 0` and `margin: 50px 0 0` won regardless of source
  order
- Evidence: rendered geometry showed the tiles at the full column width with the bracket inside them
- Root cause: a descendant-selector reset competing with the new single-class component rules
- Required correction: scope the shared reset to `.platform-governance ul` and give `.stage-stack`
  its own margin, padding, and list-style reset
- Regression verification: the bracket, its stubs, and the hand-off dot render outside the tiles and
  align with the stage connectors at 1440px; the regenerated visual references capture the result
- Status: RESOLVED

## Revision 2 — hero density and the EU mark (same day)

Requested after review: the hero visual read as too text-heavy, and the generic globe used for "EU
operating focus" did not look right.

- The three hero stages now present their items as bordered objects with a glyph each, instead of
  plain bullet lists. Every word is unchanged; the stage headings step down from
  `clamp(1.45rem, 2vw, 2rem)` to `clamp(1.25rem, 1.6vw, 1.6rem)` so the objects carry the frame.
- The connect stage gains a bracket that gathers its three sources into a single hand-off point.
- The three stage stacks share a baseline through a flex `margin-top: auto`, so the stage connectors,
  the bracket, and the hand-off dot all sit on one horizontal flow line regardless of how the
  headings wrap. Below 820px the flow is vertical and every sideways mark is hidden.
- The governance strip becomes a row of chips rather than underlined labels.
- The "EU operating focus" globe is replaced by the twelve-star ring of the European flag, drawn as
  a single decorative `aria-hidden` path in the brand action colour. It is presentational only; the
  principle's heading and sentence remain the sole carriers of meaning, and no statement about EU
  jurisdiction, residency, or regulatory status was added.
- Motion added for the new elements: the bracket spine, its stubs, and the hand-off dot build in
  sequence, and the stage tiles stagger. All of it stays inside the `html[data-motion='on']` scope.

Rerun after revision 2: `pnpm check` PASS (66 unit tests, 96.83% statements, budgets — homepage
still 0.7KB gzip); 39 funnel E2E tests PASS across Chromium, Firefox, and WebKit against an isolated
preview build, including the axe WCAG A/AA scan, the reduced-motion case, and the no-JavaScript
case; visual references regenerated and re-verified at 390px, 768px, and 1440px; no horizontal
overflow at 390px or 768px.

## Revision 3 — visual-first section order (same day)

Requested after review: in the platform section, reading three text columns before reaching the
product view made the association harder than it needed to be, and the wording could be tighter.

- `#platform` now runs heading, then the Presentation Agent workspace, then the three pillars. The
  visual establishes the subject and the pillars read as its summary.
- `#operating-model` has the identical shape and was reordered the same way: heading, then the
  reporting workflow run, then the four steps and the "where teams begin" row. Flagged to the owner
  rather than assumed; revert is a block move.
- Platform pillar bodies were shortened (roughly 22 words to 13 on average) and the third pillar
  title reduced from "See how use grows across the company" to "See how use grows". The section's
  supporting sentence dropped from 19 words to 14. No claim, capability, or qualifier changed; the
  edits remove filler only.
- Spacing follows the new order: the leading visual takes `margin-top: 0` under the section heading,
  and the explanatory block below takes `clamp(74px, 8vw, 118px)`.

The trust section was left as it is. Its first block is the 30/60/90 numerals, which already read as
a visual, and the administration console follows immediately after it.

Rerun after revision 3: `pnpm check` PASS (66 unit tests, homepage still 0.7KB gzip); 39 funnel E2E
tests PASS across Chromium, Firefox, and WebKit against an isolated preview build, including the axe
WCAG A/AA scan, reduced motion, and the no-JavaScript case; visual references regenerated and
re-verified at 390px, 768px, and 1440px.

## Revision 4 — business case figures (same day)

Requested: publish four enterprise impact figures supplied by the workspace owner as real customer
results, using the exact values shown in the supplied reference.

- New `#business-case` section between the platform story and the trust story: heading, then a
  four-figure panel. It is deliberately a plain bordered panel rather than a `.product-frame`, so
  evidence never reads as a product screenshot.
- Four `metric` claim records were added, approved for the `home.business-case` surface only. Each
  record carries the population or method as its `attribution`, and the component renders that
  attribution directly beneath the figure. A figure therefore cannot be published without the
  qualifier it depends on.
- `BusinessCase.astro` fails the build if a rendered value or label does not appear verbatim in its
  approved claim statement, so the display cannot drift from the approved wording.
- The exact supplied values are preserved, including the en dashes and approximation markers:
  `3–10%`, `~200`, `+65%`, `~€7–8M`.

Evidence recorded honestly: the figures were supplied in a working session. The account lists,
measurement methods, observation windows, baselines, and the savings model's inputs are all held
outside this repository. Each record's `notes` names what must be attached before the production
release.

The €7–8M figure is the output of an internal savings model for approximately 2,200 users, not a
realised or audited customer result. The words "projected", "internal enterprise savings model", and
the user population are recorded as material qualifiers and are asserted by a unit test.

These claims were scoped to `home.business-case` and deliberately not to `home.proof`, so the
`check_release_readiness.ts` proof gate is left as it was. That gate still reports no approved
homepage proof claim, which is correct while the underlying evidence is incomplete.

Rerun after revision 4: `pnpm check` PASS (81 unit tests, 96.95% statements, homepage still 0.7KB
gzip); `pnpm check:governance` PASS; 42 funnel E2E tests PASS across Chromium, Firefox, and WebKit
against an isolated preview build; visual references regenerated at 390px, 768px, and 1440px; no
horizontal overflow at 390px, 768px, or 1440px.

## Claims and provenance review

- Three certification records were added: `certification-iso-27001`, `certification-soc-2-type-1`,
  and `certification-soc-2-type-2`, each approved for the `home.trust` surface only.
- Evidence is the live TrustCloud compliance feed at https://trust.textcortex.com/home, read on
  2026-08-27, which lists SOC 2 Type I, SOC 2 Type II, and ISO 27001 as its three certifications.
- Approval is recorded from Baris's explicit working-session direction on 2026-08-27, matching the
  precedent already set by the customer-logo records.
- Attribution is published on the page: "Held by Text Cortex AI, the operating company behind Zeno."
  The strip claims no scope, no certificate number, no coverage period, and no guarantee. Report and
  certificate access is described as happening in the trust centre, not on this page.
- `ClaimRecord.public_url` is optional and validated: a record whose public reference is not an
  https URL is not current and cannot be published. Unit coverage includes `http:`, a relative path,
  an empty string, and a `javascript:` scheme.
- The product scenes use synthetic content only. No numeric adoption, ROI, efficiency, benchmark, or
  customer-outcome figure was added. The workflow run states a schedule, an owner, connected source
  categories, and step states; the administration console states no quantity at all.

## Regression coverage added

- Unit: certification records resolve in order on `home.trust`, each has a unique public label and
  the https trust-centre reference, and none can resolve on `home.proof`.
- Unit: `isClaimCurrent` rejects a non-https, relative, empty, or `javascript:` public reference.
- E2E: reduced motion leaves `data-motion` unset, keeps all three new visuals present, and reports
  zero animations.
- E2E: with motion running, every `[data-reveal]` target is revealed and no descendant is left below
  full opacity.
- E2E: with JavaScript disabled, the workflow steps, the governance panels, the ISO 27001 card, and
  the trust-centre link are all visible.
- E2E: the trust section renders all three certification labels, the published attribution, and a
  trust-centre link with the expected `href`, `target`, and `rel`.
- E2E: outbound links must be https with `target="_blank"` and `rel="noopener"`.
- Visual references regenerated at 390px, 768px, and 1440px. `visual.spec.ts` now emulates reduced
  motion so the captured composition is the settled one and cannot depend on what the screenshot
  scroll happened to observe.

## Rerun results

- Static verification: PASS — formatting, lint, strict types, preview build, budgets
- Unit/component/integration: PASS — 66 tests across 10 files
- Coverage: PASS — 96.83% statements, 98.7% lines, 97.67% functions, 88.8% branches
- Client JavaScript: PASS — homepage 0.7KB gzip against 75KB, readiness 62.1KB, demo 61.1KB
- End-to-end: PASS — 39 funnel tests across Chromium, Firefox, and WebKit against an isolated
  preview build; 3 visual tests in Chromium
- Automated accessibility: PASS — no axe WCAG A/AA findings on `/`, `/ai-readiness`, `/demo`
- Responsive and visual: PASS — reviewed at 390px, 768px, and 1440px; no horizontal overflow at
  390px or 768px; 200 percent text reflow passes
- Reduced motion: PASS — `data-motion` is never set, `document.getAnimations()` is empty, and the
  complete composition is present
- No JavaScript: PASS — every new visual renders and the trust-centre link is present
- Governance: PASS — 14 agent-skill validator tests

## Motion contract

The head script sets `html[data-motion='on']` before first paint, only when the visitor has not
requested reduced motion and `IntersectionObserver` exists, and it clears the flag after two seconds
if the module script has not confirmed it is observing. Every hiding, offsetting, and animating rule
in `global.css` is scoped to that attribute. A page with reduced motion, without JavaScript, with a
failed module, or with an unsupported observer therefore renders the finished composition with no
animation registered. Motion communicates nothing the static page does not already state.

## Unverified release surfaces and risk

- **Certification attribution needs counsel.** The certificates are held by Text Cortex AI. Zeno is
  presented as a standalone brand, and AGENTS.md states that public TextCortex evidence is not
  transferable without a new-brand approval record. The page attributes the certificates to the
  operating company rather than to Zeno, which is the accurate framing available today, but the
  operating-entity relationship must be confirmed by an accountable approver before production. This
  is recorded in each claim's `notes`.
- The trust centre is a third-party TrustCloud surface. Its content is outside this repository and
  is not asserted by any test.
- ZPV-004 remains open and blocks a release audit until fixed.
- Final capability, trust, privacy, security, and legal wording still requires the approvals already
  enforced by the production release gate.
- Manual screen-reader coverage and production field Core Web Vitals remain release-audit work.

## Final decision

PASS for this change — no unresolved P0–P2 finding introduced by it. ZPV-004 is a pre-existing P1
defect outside this scope; it must be resolved before any release audit can return READY.
