# Full customer articles feature audit

## 1. Scope and acceptance criteria

- Audited the expansion of the atares, b2venture, MAHLE, and KBC customer routes into complete
  editorial case studies.
- Required five substantive sections per story while preserving the existing hero, results strip,
  approved quotations, canonical routes, sitemap entries, and demo call to action.
- Required neutral product wording in article prose, with TextCortex retained only inside approved
  quotation excerpts.
- Required each new factual section to resolve through an independent approved claim record that
  is limited to the corresponding customer route.
- Required no new photography, third-party code, runtime dependency, client interaction, public
  evidence links, approval labels, or internal review messaging.
- Required readable long-form layouts without horizontal overflow at 390px, 768px, 1101px, and
  1440px, plus semantic headings and automated accessibility coverage.

## 2. Revision and files reviewed

- `src/lib/content/customer-stories.ts`
- `src/lib/claims/customer-proof-claims.ts`
- `src/pages/customers/[slug].astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `tests/unit/customer-stories.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts` and the two affected visual baselines

## 3. Claims and publication review

- The user's 2026-09-09 direction is recorded as approval for the new full article sections on the
  four named customer routes.
- Every section has a stable page-only claim ID, exact approved statement, authoritative HTTPS
  evidence, verification date, approval owner, revalidation date, and one allowed customer surface.
- Homepage preview validation remains limited to the existing short narrative and first result.
  Long-form article claims cannot broaden the logo preview.
- The existing conservative results and qualifiers remain unchanged. The b2venture 7x headline,
  unrelated promotional metrics, competitive comparisons, certifications, and additional company
  statistics remain excluded.
- Visitor-facing article prose uses neutral product terms. TextCortex appears only in the existing
  approved atares and MAHLE quotation excerpts.
- Public content contains no em dashes, source links, draft labels, approval notices, or review copy.

## 4. Findings

### FULL-STORY-01: P1, resolved

- **Affected surface:** Homepage.
- **User and impact:** The first implementation returned the generic error page instead of the
  homepage, blocking the primary visitor journey.
- **Preconditions:** Add page-only section claims to the existing customer story claim list while
  continuing to destructure its first two values for homepage preview validation.
- **Reproduction:** Load `/` after adding the article section claim IDs.
- **Expected:** The homepage validates the narrative and first approved result for each preview.
- **Actual:** It attempted to validate the first page-only article claim on `home.customer-proof`,
  where that claim is intentionally not allowed, and rendered the 500 fallback.
- **Evidence:** Browser inspection reproduced the 500 page while Astro and TypeScript diagnostics
  remained clean.
- **Supported cause:** One ordered helper was being used for two different claim surfaces.
- **Correction:** Added a dedicated homepage preview claim helper that returns only the narrative
  and first result, while the customer page helper returns the complete article claim set.
- **Regression verification:** The homepage recovered immediately. The homepage preview tests,
  customer route tests, and complete cross-browser suite passed.
- **Status:** Resolved.

### FULL-STORY-02: P2, resolved

- **Affected surface:** Customer claim governance.
- **User and impact:** A future content edit could have changed both the public article and its
  generated approved claim statement at the same time, bypassing meaningful approval review.
- **Preconditions:** Generate approved article claim records directly from the public story data.
- **Reproduction:** Change a section paragraph without changing approval metadata and observe that
  the generated claim statement changes automatically.
- **Expected:** Approved statements remain independent records, and tests fail when rendered copy
  diverges from them.
- **Actual:** The first implementation derived approval statements from the content being approved.
- **Evidence:** Diff review showed `approvedArticleSections` consuming `customerStoryDrafts`.
- **Supported cause:** The implementation reduced duplication by coupling evidence records to
  public content ownership.
- **Correction:** Replaced generated approvals with independent exact statements in the claims
  registry. The content test compares every rendered section with its approved record.
- **Regression verification:** Focused claim and customer-content tests passed, including exact
  statement, evidence URL, and surface checks for all 20 article sections.
- **Status:** Resolved.

## 5. Functional, accessibility, and responsive review

- Each customer page renders one H1 followed by five ordered H2 sections: customer context, the
  challenge, the approach, workflows in practice, and results and operating impact.
- Workflow lists use semantic list markup and remain supplementary to the narrative.
- The article body uses a 70-character maximum reading column on desktop and stacks into one column
  on tablet and mobile.
- Existing result figures remain prominent and retain their visible qualifiers.
- atares and MAHLE retain their approved full-width quotation treatments. b2venture and KBC proceed
  directly from the article to the existing demo call to action.
- The page requires no new client JavaScript and remains complete without JavaScript.
- Automated checks found no horizontal overflow at 390px, 768px, 1101px, or 1440px. The customer
  page remains included in the existing WCAG A and AA axe pass.
- Desktop and mobile full-page baselines were regenerated and visually inspected.

## 6. Verification evidence

- Formatting and ESLint passed.
- Astro diagnostics passed for 77 files with no errors, warnings, or hints. Strict TypeScript also
  passed.
- Unit and component coverage passed with 94 tests. Coverage was 92.57 percent statements, 88.85
  percent branches, 91.96 percent functions, and 94.69 percent lines.
- The focused customer story browser test passed in Chromium before the complete suite.
- The complete serial Playwright suite passed with 111 tests across Chromium, Firefox, and WebKit,
  including behavior, accessibility, responsive, no-JavaScript, and visual coverage.
- Preview and production builds each generated all four customer routes and the sitemap entries.
- Client bundle budgets passed. No client dependency or hydrated code was added.
- An initial browser run reused a development server whose React dependency cache had been
  invalidated by re-optimization. The static pages loaded without the assessment and demo islands.
  Restarting the exact local server restored hydration, the three affected conversion tests passed,
  and the clean full suite then passed.

## 7. Not verified and remaining risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. Semantic structure, keyboard-accessible
  navigation, automated accessibility checks, and responsive reflow passed.

## 8. Final decision

**PASS**. No unresolved P0, P1, or P2 findings remain for the full customer articles.
