# Feature audit: case-study navigation and directory

## Scope and acceptance

Date: 2026-09-25. Base revision: `cfd77e1318a2f22aec03d45b99caa99c2dd52e69`.
Scope: the shared Solutions menu, mobile navigation, new English and German customer indexes,
article back links, localized route registry, narrowly extended narrative claims, tests, budgets,
and the maintainer guide.

The requested **All case studies** link replaces **All industries** at the bottom of Solutions.
Its German counterpart is **Alle Fallstudien**. There was no customer directory at the base
revision. The new `/customers` and `/de/kunden` routes list the four existing approved articles.
Each article returns to its localized directory. `/solutions`, its footer link, and the five
industry links remain available. No new customer results, quotations, logos, or client behavior
are introduced. This task does not include a GitHub push or a production release.

## Four invariants

| Invariant      | Reviewed behavior                                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | The locale UI catalog owns menu labels; the route registry owns destinations and SEO. Existing narrative claims own the exact article titles and summaries. Only those four records gain the `customers.index` surface. |
| Feedback       | The link opens a complete static directory with four descriptive article links and a demo CTA. Existing visible focus and native menu disclosures remain intact.                                                        |
| Failure radius | Shared header changes affect both languages and all routes. Existing industry destinations, Resources, Sign in, demo conversion, footer navigation, and article content are unchanged.                                  |
| Timing         | All directory content and links are server-rendered. Existing optional menu enhancement is unchanged. Canonicals, reciprocal alternates, and sitemap entries derive from the same build-time registry.                  |

## Verification

- Red/green unit checks rejected the missing routes and claim surfaces before implementation.
  A build also caught the missing German action label; a new translation regression covers it.
- `pnpm check` passed formatting, lint, strict types, 160 unit/component tests, coverage, the
  preview build, and client budgets. Coverage: 94.37% statements, 95.77% lines, 94.63% functions,
  88.62% branches.
- `CONTENT_MODE=production pnpm exec astro build` and `pnpm check:budgets` passed. Both modes
  generate 38 pages. Each new index carries about 1.7 KB gzip of existing shared site JavaScript;
  no new client script or dependency was added.
- A project-path preview build with `PUBLIC_PREVIEW_DEPLOY=true`,
  `PUBLIC_SITE_ORIGIN=https://sen-baris.github.io`, and `PUBLIC_SITE_BASE=/zeno-landing` passed.
  Built-HTML checks verified prefixed article links, self-canonicals, reciprocal `en`, `de`, and
  `x-default` links, sitemap entries, and the preview-wide `noindex` policy. Production-mode
  indexes have no `noindex`. This does not bypass the existing production release gate.
- Governance validation passed: nine skills and 18 tests. No skill contract changed.
- `customer-index.spec.ts`: 27 tests passed across Chromium, Firefox, and WebKit. They cover
  both locales, desktop/mobile navigation, all four article journeys and back links, keyboard
  activation, visible focus, JavaScript-disabled operation, localized SEO, the footer language
  switcher, reduced motion, reflow, and axe checks.
- The index and menu were inspected at 390, 768, 1101, and 1440px, with representative paired
  200% text captures. Review covered German wrapping, card order, link placement, mobile menu
  scrolling, clipping, and overlap. Four new directory baselines and four menu baselines were
  reviewed, along with the affected mobile pricing/navigation captures.

Environment: macOS, Node 24.19.0, pnpm 10.32.1, repository-pinned Playwright browsers. Browser
checks use `127.0.0.1:4322`. Builds and browser runs are sequential. Screenshots and traces are
under ignored `test-results/customer-index-*`; accepted visual baselines are in the test folders.

Reproduction commands:

```sh
pnpm check
CONTENT_MODE=production pnpm exec astro build
pnpm check:budgets
pnpm check:governance
E2E_PORT=4322 pnpm exec playwright test tests/e2e/customer-index.spec.ts --workers=4
E2E_PORT=4322 pnpm exec playwright test --workers=4
```

## Findings and corrections

### P3: German index heading wrapped awkwardly at mobile width

- Surface: `/de/kunden`, 390px.
- Impact: the first proposed translation broke the short directory heading into an ungainly
  compound word. Expected: a compact heading consistent with the English directory.
- Reproduction: render the initial `Kundengeschichten.` label at 390px.
- Cause: the longer compound did not fit the inherited display treatment.
- Correction: use the concise neutral label `Kundenstories.`. No factual copy changed.
- Regression: reviewed the final mobile and desktop German baselines plus enlarged-text reflow.
- Status: fixed and verified.

### P2: generic German mobile rules overrode the directory type scale

- Surface: `/de/kunden`, mobile and 200% text size.
- Impact: article headings became larger than English and the directory heading split into
  three fragments. Expected: the shared compact scale with natural compound wrapping.
- Reproduction: compare both directory routes at 390px after setting the root font size to 200%.
- Cause: the existing German mobile `h1`/`h2` selectors outranked the new component rules.
- Correction: explicitly retain the component scale in both languages. A discretionary hyphen
  in `Kundenstories` permits only the natural `Kunden-stories` break when needed.
- Regression: a paired browser assertion compares heading sizes at all four widths and both
  text scales, and limits the enlarged mobile directory heading to two lines.
- Status: fixed and verified in all three browsers, including the paired type-scale regression.

### Test-harness and baseline corrections

The initial full run passed 637 of 650 cases. Four expected mobile navigation snapshots needed
the new link. Eight new tests assumed that macOS Firefox and WebKit Tab through anchors like
Chromium. The harness now opens the native menu by keyboard, tests the actual Tab sequence in
Chromium, and explicitly focuses the link in the other two browsers before asserting its visible
outline and Enter activation. This preserves keyboard assertions without changing site behavior.
The first menu screenshot accidentally captured only the summary box because the panel is
absolutely positioned; it now captures the viewport including the open panel.

One existing WebKit German calculator journey timed out at step three. It passed three isolated
reruns without any calculator edit. No calculator, form, or animation logic changed in this task.

## Final verification and limitations

The full-suite rerun passed all 650 cases, including the previously timed-out WebKit conversion
journey. After the final directory-only German type-scale correction, `pnpm check`, the
production-mode build, budgets, and governance passed again. All 27 directory browser cases
passed. The four directory/menu visual cases passed without snapshot updates after review of
the adjusted German mobile captures. Strict types checked 140 files with zero diagnostics.

The full sitewide browser run preceded that last directory-only typography correction; the
post-correction browser rerun covers both changed routes in all three engines. No other page
uses the affected selectors, and no header behavior changed after the full run.
No production deployment or real lead delivery is exercised by this navigation change.

## Decision

PASS for the scoped feature. No unresolved P0-P2 finding. Existing unrelated production release
gates remain enforced. No GitHub push or deployment was performed.
