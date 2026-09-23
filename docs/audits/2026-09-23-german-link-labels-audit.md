# German link-label cleanup and push audit

## Scope

- Date: 2026-09-23. Base revision: `293a095f962ae124a301f1f60f295ee45cb89765`.
- Current request: remove parenthetical language labels from German pages and push the pending
  work to GitHub. This includes the previously completed LinkedIn kit and Resources navigation.
- Changed labels: Hilfe-Center, Datenschutz, Nutzungsbedingungen, Impressum, and the Security
  privacy-policy link. Removed the obsolete `englishDocument` UI field rather than retaining an
  empty compatibility property.
- Destinations, original-language quotations, legal document bodies, canonical/hreflang clusters,
  language switching, calculator behavior, and demo submissions remain unchanged.
- The user direction supersedes the prior visible-language-suffix policy. Updated the localization
  skill, its acceptance matrix, the SEO reference, and maintainer guidance before implementation.
  The resource claim keeps the same destinations and approved navigation surfaces.

## Four invariants

| Invariant      | Review                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | Shared UI and German page catalogs own labels. The shared resource record and separate exact approval own the Help Center label. Footer legal links still carry `hreflang="en"`. |
| Feedback       | Link names are shorter; accessible new-tab announcements and visible focus are preserved. No loading or error behavior changes.                                                  |
| Failure radius | Shared German header/footer and Security page. English labels, assets, link targets, legal body checksums, SEO, and conversion behavior remain intact.                           |
| Timing         | Static rendering only. No new script, hydration, request, timer, storage, or tracking.                                                                                           |

## Regression evidence

The new unit expectations failed against the original labels in two tests, then passed after the
copy change. The targeted suite passed nine tests. Governance validation passed all nine skills
and 18 standard-library Python tests.

Added a public-copy regression across German UI/page catalogs and resource labels. Added browser
coverage for clean resource/legal labels and unchanged targets without JavaScript, including
retained legal-link language metadata. The existing all-German-routes test now rejects parenthetical
English-language badges on all 15 pages.

Commands used:

```sh
pnpm exec vitest run tests/unit/page-localization.test.ts tests/unit/marketing-resources.test.ts
pnpm check:governance
pnpm check
CONTENT_MODE=production pnpm exec astro build
pnpm check:budgets
PUBLIC_SITE_BASE=/zeno-landing PUBLIC_SITE_ORIGIN=https://sen-baris.github.io PUBLIC_PREVIEW_DEPLOY=true pnpm build
pnpm check:budgets
```

Browser and visual verification results are recorded below. The existing banner artwork, copy,
fonts, and PNGs are unchanged by this cleanup. Their dimensions, repeatable hashes, crop review,
and export checks remain covered by the
[LinkedIn and Resources audit](2026-09-23-linkedin-resources-audit.md). The Help Center approval
label changes do not affect either banner claim or any generated asset.

## Findings

- The requested label clutter was present in the five identified labels. It is removed at its
  source, with regression coverage rather than CSS hiding or label rewriting at runtime.
- A first type check caught an inferred optional value in a new browser-test tuple. The fixture
  was made a readonly literal tuple without weakening application or test types.
- No new capability, legal-content, security, or privacy claim is introduced. No dependency or
  public route is changed. No unresolved P0-P2 has been identified in the reviewed change.

### P3: generated HTML contained trailing whitespace

- Surface: the editable banner HTML exports, not the website or visible artwork.
- Reproduction: stage the new kit and run `git diff --cached --check`. Whitespace warnings appeared
  on empty template/style lines. Expected: a clean staged diff. Actual: template interpolation
  retained space-only lines, adding avoidable noise to future diffs.
- Correction: normalize line-end whitespace in the exporter instead of hand-editing output files.
- Verification: regenerated the kit, rechecked all export guards, and compared all six PNG hashes
  with the reviewed files. Every PNG remained byte-identical. Formatting, lint, strict types,
  coverage, build, and client budgets were rerun after the exporter change.
- Status: fixed. No deferred issue.

## Push boundary

The current branch is `main`, tracking `origin/main` at
`https://github.com/sen-baris/zeno-landing.git`. Fetch confirmed no divergence before editing.
Only task-owned source, tests, reviewed baselines, documentation, skill files, and the marketing
kit will be staged. Existing scratch directories and unrelated artifacts remain untracked.

The existing `deploy-pages.yml` workflow runs governance and application checks before publishing
the temporary GitHub Pages preview. It keeps `PUBLIC_PREVIEW_DEPLOY=true`, a project base path,
and synthetic lead submission. This push does not authorize a production launch or clear the
existing production legal, content, lead-delivery, domain, and hosting gates.

## Final verification

- `pnpm check` passed: formatting, ESLint, strict TypeScript/Astro, 149 unit/component tests,
  preview build, and client budgets. Coverage remained 94.23% statements, 95.68% lines, 94.52%
  functions, and 88.3% branches.
- Production-mode and project-path preview builds each generated 36 routes. Both budget checks
  passed. Static inspection of all 15 German preview documents found no language badges, retained
  legal destinations with `hreflang="en"`, and retained preview `noindex, nofollow`.
- `pnpm check:governance` passed nine skill records and 18 Python tests.
- The 35 affected German visual tests passed with explicit baseline refresh. Inspected the footer
  regions of all 15 page pairs' German snapshots, focused mobile/desktop resource menus and
  footer layouts at 390, 768, 1101, 1280, and 1440px. Labels, links, wrapping, and focus remain clear.
  English snapshots remain covered by the unchanged-label full browser run.
- `E2E_PORT=4322 pnpm exec playwright test --workers=4 --reporter=line` passed **539 tests** across
  Chromium, Firefox, and WebKit in 3.5 minutes. This includes no-JavaScript labels/destinations,
  every German route, dropdown input methods, enlarged text, reduced motion, conversion, and SEO.
- After that run only this report and the outside-build export whitespace normalization changed.
  The kit export and full core checks were rerun. No website behavior changed after browser QA.

PASS. No unresolved P0-P2 and no deferred P3. This is feature and authorized preview-push evidence,
not production-launch approval. GitHub's post-push workflow and hosted artifact are not claimed
as verified by the local checks. No LinkedIn upload or production release is included.
