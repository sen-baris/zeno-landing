# German page parity and QA repair

## Scope and acceptance

All 15 German nonlegal routes must provide the complete English experience. This explicitly
supersedes the former shorter-page policy and the narrower scope of the earlier publication audit.
English is the visual and behavioral reference, including both homepage scroll stories, customer
previews, product workspaces, solution proof, full articles, security disclosures, and conversion.

Reviewed the shared page compositions, all localized visuals, German catalogs and claim records,
motion fit detection, responsive styles, route wrappers, client budgets, and regression tests.
The work is based on main revision `304335e`. No deployment or Git publication is part of this task.

## Ownership and boundaries

- **Ownership:** `src/components/pages/` owns the eight page-family compositions. Both route trees
  use those components. English content records remain the structural reference; `page-copy.ts`
  resolves complete German copy and fails on missing translations. The route registry still owns
  localized URLs, canonicals, alternates, sitemap entries, and footer switching.
- **Claims:** `de-approved-claims.json` records exact reviewed translations against 94 real English
  claim IDs. The page resolver checks source approval, currency, exact wording, and allowed
  surfaces. Catalog edits cannot approve themselves. Customer quotations remain original English
  with `lang="en"`; legal documents and unrelated release gates are unchanged.
- **Feedback:** Both languages use the same animation stages, native disclosures, form validation,
  focus movement, calculator results, and submission statuses. German copy does not change the
  calculator formulas, browser-only state, lead payload, consent, or retry behavior.
- **Failure radius:** Shared markup can affect English as well as German. Paired structural tests
  and existing English snapshots protect against omissions and unintended redesigns.
- **Timing:** Both scroll scenes retain the 300vh track, 76px offset, and 1101px/720px eligibility
  boundaries. Font and viewport changes also check whether complete content fits. Listeners,
  animation frames, and the font-size observer are cleaned up on page exit. Mobile, reduced-motion,
  short, enlarged-text, and no-JavaScript views keep complete static content.

## Findings and corrections

### PARITY-01: P1, complete German page experiences missing

- **Surface and impact:** All German page families. Visitors lost the product explanation and
  homepage progression available in English.
- **Preconditions and reproduction:** Open each English/German pair, especially `/` and `/de/`.
  Count sections and figures, then try the two desktop scroll journeys and logo previews.
- **Expected:** The same sections, visuals, semantic content, interactions, and conversion paths.
- **Actual:** Independent German templates replaced complete compositions with short text blocks.
  Homepage scenes, customer previews, Vision, product workspaces, solution proof, article depth,
  and most Security content were absent.
- **Evidence and cause:** Original German route and `de-content.ts` source, the user-approved QA
  findings, and the initial failing homepage test for the missing journey element.
- **Correction:** Replaced the separate templates with shared locale-aware compositions and
  complete German catalogs. Removed the obsolete reduced-page content model.
- **Regression verification:** Every pair is compared for ordered section IDs, figures, images,
  disclosures, article sections, paragraphs, and localized destinations. Both pinned journeys and
  customer previews are exercised in both languages. German snapshots cover all 15 complete pages.
- **Status:** Resolved.

### PARITY-02: P2, conversion fields below the first screen

- **Surface and impact:** German business-case and demo routes; visitors did not immediately see
  a usable form. The corresponding narrow English calculator also needed a smaller mobile title.
- **Preconditions and reproduction:** Visit at 1280 × 720 or 390 × 844 before scrolling.
- **Expected:** The first usable choice or input appears inside the initial viewport.
- **Actual:** The earlier German introductions placed demo and calculator inputs approximately
  852px and 1071px down at 1280 × 720.
- **Evidence and cause:** Confirmed QA geometry and separate oversized German introduction markup.
- **Correction:** Reused the compact shared split compositions with locale-aware copy and bounded
  mobile heading scales. Preserved hydration, disabled SSR controls, and no-JavaScript guidance.
- **Regression verification:** Both forms in both languages at 390, 768, 1280, and 1440px, plus
  German calculation, validation focus, gateway failure, retry, and success tests.
- **Status:** Resolved.

### PARITY-03: P2, translation approval was not tied to exact source wording

- **Surface and impact:** German factual claims and production route generation. A future catalog
  edit could inherit approval without review, and synthetic source IDs weakened traceability.
- **Preconditions and reproduction:** Compare old localized claim construction with the English
  registry, then change a translated statement without changing its approval record.
- **Expected:** Real source IDs, surface-limited permission, and exact approved wording are required.
- **Actual:** Approval records were constructed from mutable German content rather than a reviewed
  immutable wording snapshot.
- **Evidence and cause:** Previous `de-claims.ts` generated records and shortened German content.
- **Correction:** Added exact source-linked approval records and fail-closed validation at shared
  page boundaries. Customer article and result statements are reconstructed from rendered data.
- **Regression verification:** Tests reject missing, draft, expired, changed, and wrong-surface
  records. Production-mode route generation validates the current German set.
- **Status:** Resolved.

### PARITY-04: P2, qualified proof and calculator disclaimer drift

- **Surface and impact:** German private-equity customer band and business-case disclaimer. Missing
  context could make adjacent VC evidence look like a PE result or misdescribe calculator inputs.
- **Preconditions and reproduction:** Read the PE proof band and complete the German calculator.
- **Expected:** Explicit venture-capital context and the current planning-assumption disclaimer.
- **Actual:** The shortened page omitted the VC qualifier; the disclaimer reflected an older model.
- **Evidence and cause:** Original independent German copy versus the approved English records.
- **Correction:** Shared customer-result rendering restores the full qualifiers. The calculator
  receives the exact approved translation of its current English disclaimer.
- **Regression verification:** Exact claim checks, explicit VC browser assertion, paired content
  coverage, and the unchanged 18-person calculation returning 828 hours and 41.400 €.
- **Status:** Resolved.

### PARITY-05: P2, text expansion and responsive layout defects

- **Surface and impact:** German headings, mobile solution headings, customer quotations, footer
  labels, and pinned scenes. Text expansion produced awkward breaks, clipping, or oversized labels.
- **Preconditions and reproduction:** Compare 390, 768, 1101, and 1440px layouts. Increase root text
  size to 200%, including both homepage scenes at the minimum desktop eligibility boundary.
- **Expected:** Natural word wrapping, complete reachable content, and compact shared footer labels.
- **Actual:** Arbitrary word breaking, narrow mobile split headings, and no content-fit guard. QA
  also reproduced quotation overflow, a WebKit arrow sizing issue, and German footer labels
  inheriting the mobile page-heading scale.
- **Evidence and cause:** Rendered snapshots and bounding-box/scroll-width diagnostics. A late
  solution heading rule defeated its mobile stack; broad German heading rules affected the footer.
- **Correction:** Language-aware wrapping, component-sized mobile headings, stacked solution
  headings, readable original-language quote sizing, an em-sized arrow, main-only heading rules,
  and complete static motion fallback when content does not fit. No overflow-hiding workaround.
- **Regression verification:** All page pairs at four widths; all German pages at 200% text at
  390 and 1440px; paired footer font sizes; exact pin boundaries, resizing, reverse scroll, keyboard
  paging, and no-JavaScript rendering in all three engines.
- **Status:** Resolved.

### PARITY-06: P3, shared-layout polish found during regression review

- **Surface and impact:** English homepage document height and governance caption spacing.
- **Preconditions and reproduction:** Compare the original English homepage snapshots and read
  the governance caption after the shared-component extraction.
- **Expected:** Unchanged English homepage height and a space between the hosting and example text.
- **Actual:** The first fit observer's invisible probe added 16px after the footer, and a caption
  fragment lost its separating space.
- **Evidence and cause:** English snapshot differences and the caption assertion identified an
  absolutely positioned probe without an explicit origin and adjacent Astro text expressions.
- **Correction:** Anchor the non-layout probe at top/left zero and restore explicit text spacing.
- **Regression verification:** Original English homepage snapshots pass unchanged; the complete
  cross-browser governance-caption test remains in place.
- **Status:** Resolved. No deferred follow-up.

## Verification record

Environment: macOS, Node 24.19, pnpm 10.32.1, Playwright 1.62.1. Browser tests use a local
gateway fixture, not a real submission service. No visitor or customer data was used.

| Check                                           | Result                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm format:check`, `pnpm lint`                | Passed                                                                                                                               |
| `pnpm typecheck`                                | 123 Astro files, no errors, warnings, or hints; strict TypeScript passed                                                             |
| `pnpm test:coverage`                            | 144 tests in 25 files passed                                                                                                         |
| Coverage                                        | 94.15% statements, 88.18% branches, 94.44% functions, 95.61% lines                                                                   |
| `E2E_PORT=4322 pnpm exec playwright test`       | 466 passed, zero failed, skipped, or flaky; Chromium, Firefox, WebKit                                                                |
| Accessibility                                   | All 15 German routes at 390 and 1440px in each engine; no automated WCAG A/AA findings                                               |
| Page parity and reflow                          | All 15 pairs at 390, 768, 1101, 1440px; localized metadata and destinations matched                                                  |
| Enlarged text                                   | All German pages at 200% text at 390 and 1440px; complete static homepage scenes when needed                                         |
| First-screen conversion                         | Both languages and both forms at 390 × 844, 768 × 900, 1280 × 720, 1440 × 900                                                        |
| Motion                                          | Forward/reverse, matching stages, paging, resize, 1100/1101px and 719/720px boundaries, no-JavaScript and reduced-motion fallbacks   |
| Visual baselines                                | 40 German page/state captures reviewed; seven affected English mobile baselines updated after inspection                             |
| `CONTENT_MODE=production pnpm exec astro build` | Passed, 36 generated pages; exact German publication validation passed                                                               |
| Project-path preview build                      | Passed with `/zeno-landing`, GitHub preview origin, and global noindex                                                               |
| Built HTML verification                         | All 33 canonical content routes checked for exact base-path canonicals, reciprocal alternates, links, noindex, and sitemap inclusion |
| `pnpm build`                                    | Root-path preview restored successfully after deployment-shape verification                                                          |
| `pnpm check:budgets`                            | Both languages: home 4.1KB, product 1.3KB, calculator 63.2KB, demo 62.2KB gzip; all below existing budgets                           |
| `pnpm check:governance`                         | Six skills and 14 governance validator tests passed                                                                                  |
| `git diff --check`                              | Passed                                                                                                                               |

The shared-header/footer and full-page screenshots were reviewed alongside focused hero/adoption
states, customer previews, completed estimates, article layouts, and intermediate-width workspace
captures. The English homepage baselines remained unchanged. Navigation away from and back to the
German homepage also restored its enhanced state in all three browser engines.

A final targeted rerun passed all 12 conversion-viewport cases after strengthening the assertion
to measure the visible calculator choice card, not only its hidden native input. Both the card
and the first demo field remain fully inside the required initial viewport.

`CONTENT_MODE=production pnpm exec tsx tools/check_release_readiness.ts` still returns **BLOCKED**
for the pre-existing hero/capability/trust/privacy approval flags, homepage launch-proof gate,
same-origin lead endpoint configuration, and unverified domain redirect removal. Those are release
constraints, not localization test failures. No flag or gate was relaxed to obtain a successful
compilation, and no deployment was attempted.

## Remaining limits

- This is a feature audit, not production release approval. Legal/entity, operational integration,
  and other existing release gates remain enforced.
- No real lead was sent, and Mailgun or a production CRM was not exercised. The shared lead
  adapter was verified with synthetic success and failure responses.
- No physical assistive-technology session, external search-engine crawl, or physical-device lab
  was performed. Automated accessibility and local Chromium, Firefox, and WebKit evidence do not
  replace those release checks.
- German legal documents remain intentionally unavailable. Footer links identify English legal
  documents, and no nonexistent German alternate is advertised.

**PASS for this feature.** All recorded P0 to P2 findings are resolved and re-verified. This does
not authorize a production release or override the existing blocked release gate.
