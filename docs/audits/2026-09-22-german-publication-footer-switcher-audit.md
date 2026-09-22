# German publication and footer language switcher feature audit

## Scope and acceptance

- Reviewed publication of the 15 existing nonlegal German routes, their route mappings, metadata,
  canonical URLs, reciprocal hreflang clusters, and sitemap entries.
- Required language selection to appear only in the footer as `English / Deutsch`, preserve the
  current page, and remain available without JavaScript.
- Required neutral German without direct formal or informal address, visitor-facing preview labels,
  or em dashes in Zeno-authored copy.
- Kept the three legal documents English-only and required German pages to label those destinations
  as English documents.
- Preserved original-language customer quotations, metrics, qualifiers, product meaning, and the
  temporary deployment's global noindex behavior.

## Ownership, feedback, failure radius, and timing

- `src/lib/i18n/locales.ts` owns locale publication state. The route registry remains the source for
  localized paths, alternates, switcher destinations, and sitemap entries.
- `BaseLayout` passes the resolved counterpart set to `Footer`. The header and mobile menu no longer
  receive or render locale links.
- German editorial content, form copy, shared interface text, and factual claim approvals remain in
  their typed locale records. Production route generation validates the German claim set before
  rendering.
- The switcher is a set of ordinary links. It uses no redirect, client state, cookie, storage,
  analytics event, or hydration timing.
- English legal routes have no German counterpart and therefore render no language switcher or
  German alternate metadata.

## Findings

### LOC-FOOTER-01: P3, resolved

- **Affected surface:** Footer language switcher.
- **User impact:** The first implementation separated the languages with a thin vertical border,
  which did not exactly match the approved `English / Deutsch` presentation.
- **Preconditions:** Visit any English or German page with a published counterpart and inspect the
  footer metadata row.
- **Reproduction:** Compare the rendered separator with the approved switcher text.
- **Expected:** A literal slash separates the two plain-text language links.
- **Actual:** A vertical rule separated the links.
- **Evidence:** Desktop and mobile full-page visual inspection.
- **Supported cause:** The original footer CSS reused a border-based navigation separator.
- **Correction:** Added an aria-hidden slash and removed the border treatment.
- **Regression verification:** The localization browser test asserts the slash and the complete
  cross-browser suite passes.
- **Status:** Resolved.

### LOC-TEST-01: P3, resolved

- **Affected surface:** German demo-form localization browser test.
- **User impact:** No visitor impact. The test looked for `role="alert"` even though field errors are
  associated with their inputs through `aria-describedby` and do not use that role.
- **Preconditions:** Submit the empty German demo form in the localization test.
- **Reproduction:** Run the initial localization browser test across any engine.
- **Expected:** Assert the visible localized error and focus on the invalid name field.
- **Actual:** The interface was correct, but the role-based locator could not find the error.
- **Evidence:** Playwright's accessibility snapshot showed the visible error, invalid input state,
  and focused field relationship.
- **Supported cause:** The test assumed a live-region role that the form intentionally does not use.
- **Correction:** Targeted the exact associated error text and retained the focus assertion.
- **Regression verification:** The affected test passes in Chromium, Firefox, and WebKit, followed by
  a green full cross-browser suite.
- **Status:** Resolved.

### LOC-COPY-01: P3, resolved

- **Affected surface:** German pricing, security, manufacturing, private-equity, legal, customer,
  and demo copy.
- **User impact:** A small number of grammatically awkward compounds and article choices made the
  first translation pass read less naturally.
- **Preconditions:** Read the affected German pages.
- **Reproduction:** Inspect phrases including the pilot description, Investment-Memo headline, and
  legal Playbook headline.
- **Expected:** Direct, idiomatic German with the same meaning and factual boundaries as English.
- **Actual:** The initial draft contained awkward phrases such as `Der Investment-Memo` and
  `gegen das eigene Playbook`.
- **Evidence:** Editorial source review and desktop/mobile rendered-page inspection.
- **Supported cause:** Literal translation choices did not consistently follow natural German
  grammar.
- **Correction:** Corrected grammar, compounds, and phrasing without changing facts, figures,
  qualifiers, customer quotations, or claim surfaces.
- **Regression verification:** German copy regression tests, claim approval tests, builds, and all
  localized browser journeys pass.
- **Status:** Resolved.

## Verification

- Formatting, ESLint, Astro diagnostics, and strict TypeScript: passed.
- Unit and component coverage: 136 tests passed; 93.48 percent statements, 86.22 percent branches,
  94.3 percent functions, and 95.17 percent lines.
- Preview build: all 15 German routes generated with reciprocal alternate metadata and sitemap
  entries.
- Production-mode build: all 15 German routes generated after the German factual-claim gate passed.
- Temporary deployment build: German routes retain the deployment-wide `noindex, nofollow` meta.
- Client budgets: homepage 3.8 KB, product 1.3 KB, business case 63.2 KB, and demo 62.2 KB gzip,
  each below its route budget.
- Governance validation: six repository skills and 14 validator tests passed.
- Full cross-browser Playwright suite: 320 tests passed across Chromium, Firefox, and WebKit,
  including all 15 German routes, exact SEO alternates, no-JavaScript switching, localized form
  states, 200 percent text size, responsive overflow, and automated accessibility checks.
- Manual inspection: German product and footer layouts at 1440 and 390 pixels. The footer remains
  readable, compact, and free of header or mobile-menu duplication.

## Remaining risk and decision

- German legal documents remain intentionally unavailable until separately approved. German pages
  link to the English legal documents with an explicit language label.
- No physical assistive-technology session, production deployment, external SEO crawl, or release
  audit was performed for this feature task.
- Existing unrelated production release gates remain unchanged.

**PASS.** No unresolved P0, P1, or P2 findings remain in this feature audit.
