# Zeno oxblood palette feature audit — 2026-08-27

## Scope and acceptance criteria

Audited the replacement of the forest-led palette with a distinct professional system across the
homepage, AI Readiness Assessment, demo form, error routes, and shared navigation/footer.

Acceptance required no layout, content, route, form, claims, animation, or dependency change;
readable action and state colors at WCAG AA contrast; preserved keyboard focus; no responsive or
200-percent text-zoom regression; updated visual baselines at 390px, 768px, and 1440px; unchanged
client budgets; and no unresolved P0–P2 finding.

## Revision reviewed

- `src/styles/global.css`: renamed semantic color tokens and updated every shared surface
- `src/layouts/BaseLayout.astro`: updated browser theme color
- Homepage visual baselines for mobile, tablet, and desktop

The new system uses porcelain canvas `#F7F3EE`, warm paper `#FFFEFC`, near-black ink `#171518`,
oxblood action `#6B2D4A`, plum hover `#85415F`, blush wash `#F2E8EC`, ochre evidence `#9A621F`, warm
rule `#DED8D5`, and muted text `#66616A`.

## Commands and environments

- macOS arm64, Node 24.19.0, pnpm 10.32.1
- `pnpm format`, `pnpm lint`, and `pnpm typecheck`
- Isolated Chromium funnel, axe, zoom, reduced-motion, and navigation suite
- `pnpm exec playwright test --project=chromium tests/e2e/visual.spec.ts --update-snapshots=all`
- `pnpm check`
- `pnpm test:e2e`
- Manual review of the 390px and 1440px regenerated baselines

## Findings

### ZOP-001 — P3 — Reused preview process did not rehydrate interactive islands

- Affected surface: local assessment and demo automation during the first targeted run
- User and impact: no application defect; three form tests timed out against stale local preview state
- Preconditions: reuse the manually opened development process after Astro type generation
- Reproduction: keep the preview process active, run type generation, then run the form journey suite
- Expected: Playwright owns an isolated server with current generated state
- Actual: static pages and all presentation checks passed, but interactive fields never hydrated
- Evidence: first targeted run; identical journeys passed after the process was stopped and isolated
- Root cause: local preview lifecycle, not CSS or island source
- Required correction: stop the manual preview before automation and restart it afterward
- Regression verification: isolated Chromium suite passed 10/10; final cross-browser suite passed 33/33
- Status: RESOLVED

## Accessibility and visual evidence

- Oxblood action on paper: 10.00:1
- Plum hover on paper: 7.20:1
- Ochre evidence accent on canvas: 4.59:1
- Muted text on canvas: 5.46:1
- Axe WCAG A/AA: no findings on `/`, `/ai-readiness`, or `/demo` in Chromium, Firefox, and WebKit
- Reflow: no horizontal overflow at 390px with 200-percent text zoom
- Motion: no automatic homepage animation; reduced-motion experience remains complete
- Visual references: regenerated and reviewed at 390px, 768px, and 1440px

## Regression results

- Static verification: PASS — formatting, lint, strict types, preview build, and budgets
- Unit/component/integration: PASS — 61 tests
- Coverage: PASS — 96.78% statements, 98.67% lines, 97.64% functions, 88.71% branches
- Client JavaScript: PASS — homepage 0.1KB gzip, readiness 61.5KB, demo 60.6KB
- End-to-end: PASS — 33 tests across Chromium, Firefox, and WebKit
- Visual regression: PASS — three updated baselines

## Unverified release surfaces and risk

Production claims, live lead delivery, privacy approval, analytics, hosting, DNS, field Core Web
Vitals, and manual assistive-technology review remain governed by the existing release gate. The
palette change does not alter those risks.

## Final decision

PASS — no unresolved P0–P2 feature finding. Production remains blocked by the existing fail-closed
release gate.
