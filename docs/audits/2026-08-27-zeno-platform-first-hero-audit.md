# Zeno platform-first hero feature audit — 2026-08-27

## Scope and acceptance criteria

Audited the homepage revision that removes the hero eyebrow and secondary platform paragraph,
reduces the hero to one supporting statement and one primary “Book a demo” action, introduces a
whole-platform visual before any individual agent, moves the Presentation Agent into the later
platform section, and increases the visible size of all eight approved customer marks.

Acceptance required a platform-first story before the specific agent example; no new capability,
customer-outcome, security, compliance, or adoption-result claim; one visible hero conversion at a
common laptop viewport; preserved supplied logo assets and approval records; responsive behavior at
390px, 768px, and 1440px; WCAG A/AA automation; unchanged routes and form behavior; repository
coverage and client budgets; no more than seven homepage sections, 45 bordered descendants, and
three shadows; and no unresolved P0–P2 finding.

## Revision reviewed

- `src/components/PlatformOverview.astro`: new static platform-level Connect → Equip → Run visual
  with an organization-wide governance rail
- `src/components/CustomerLogoRail.astro`: stable claim ID exposed only for asset-specific visual
  sizing; logo order, files, alt text, and approval data remain unchanged
- `src/pages/index.astro`: simplified hero, platform overview placed first, Presentation Agent moved
  to the later What section
- `src/lib/content/site-content.ts`: removed the obsolete eyebrow and secondary platform line
- `src/styles/global.css`: restrained platform composition, responsive rules, larger logo rendering,
  and removal of unnecessary internal separators
- `tests/e2e/funnel.spec.ts`: regression assertions for the single hero CTA, platform-level story,
  retained Presentation Agent, approved logos, and removed hero clutter
- Homepage visual baselines at 390px, 768px, and 1440px

The new component is server-rendered Astro with no props, runtime state, request boundary, client
JavaScript, third-party UI code, package, remote image, or external script.

## Commands and environments

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- `pnpm format`, `pnpm lint`, and `pnpm typecheck`
- `pnpm exec playwright test --project=chromium tests/e2e/visual.spec.ts --update-snapshots=all`
- `pnpm check`
- `pnpm test:e2e`
- Headless Chromium density, conversion-position, and horizontal-overflow inspection at 1440px
- Manual review of regenerated 390px and 1440px full-page baselines

## Findings

### ZPH-001 — P3 — Square source canvases made horizontal customer marks appear too small

- Affected surface: homepage selected-customer logo rail
- User and impact: customer proof was present but too visually weak to scan confidently
- Preconditions: render the supplied 400 × 400 SVGs using a conventional maximum-height rule
- Reproduction: load the homepage at 1440px and compare the visible horizontal mark with the grid
  cell
- Expected: each approved mark has clear visual presence without altering the source asset
- Actual: the maximum-height rule sized the entire square canvas, including its transparent vertical
  area, so the horizontal artwork rendered much smaller than intended
- Evidence: regenerated desktop baseline and inspection of the supplied SVG dimensions
- Root cause: source artwork is centered inside square canvases with substantial transparent vertical
  space
- Required correction: size the complete SVG by width inside a fixed-height, non-interactive crop
  container and preserve an asset-specific limit for the circular Bovensiepen mark
- Regression test or verification: eight-logo count and named-logo assertions pass; regenerated 390px,
  768px, and 1440px baselines were reviewed; source SVG files and claim records are unchanged
- Status: RESOLVED

## Fixes applied

- Removed the hero badge, redundant gray platform paragraph, and readiness CTA from the hero.
- Made “Book a demo” the only hero action.
- Added one concise platform composition showing connected company context, specialized team agents,
  on-demand and scheduled work, reviewed outputs, and cross-organization governance.
- Relocated the Presentation Agent composition below the broader What narrative.
- Increased customer-logo presence without modifying or replacing supplied files.
- Removed nine decorative list rules from the new platform visual to stay below the established
  density limit.

## Claims, provenance, and dependency review

- Platform labels reorganize capability language already accepted for this working draft; no new
  quantified result, security guarantee, certification, compliance statement, or ROI claim was
  introduced.
- Customer-logo assets, names, registry order, and approval records remain unchanged.
- No third-party component, copied layout, runtime dependency, or external asset entered the change.
- Production remains fail-closed while hero, trust, proof, privacy, lead-delivery, and domain gates
  are unresolved.

## Regression coverage and rerun results

- Static verification: PASS — formatting, lint, strict types, preview build, and budgets
- Unit/component/integration: PASS — 61 tests
- Coverage: PASS — 96.78% statements, 98.67% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS — 33 tests across Chromium, Firefox, and WebKit
- Automated accessibility: PASS — no axe WCAG A/AA findings on `/`, `/ai-readiness`, or `/demo`
- Responsive and visual: PASS — regenerated references at 390px, 768px, and 1440px; 200-percent
  text reflow and keyboard focus pass
- Reduced motion: PASS — the complete platform and Presentation Agent stories are static
- Homepage density: PASS — 7 sections, 42 bordered descendants, and 1 shadow
- Primary hero CTA: PASS — bottom edge 448px at 1440 × 900 and visible without scrolling
- Horizontal overflow: PASS — document width equals viewport width at 1440px; mobile zoom test passes

## Anything not verified and risk

Manual assistive-technology testing, production field Core Web Vitals, final capability and trust
approval, live lead delivery, privacy approval, analytics, hosting, DNS, and redirect removal remain
release-audit work. They are existing explicit launch gates and were not broadened by this homepage
change.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production remains blocked by the existing fail-closed
release gate.
