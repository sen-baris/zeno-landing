# Customer proof and case study feature audit

## 1. Scope and acceptance criteria

- Audited the homepage customer proof redesign, native expandable previews, typed customer story
  content, four draft routes, search directives, sitemap behavior, responsive layouts, and the
  preview-to-production publication boundary.
- Required all supplied quotations to remain exact excerpts of their stored source text, every
  metric to retain its material qualifier, and all new customer proof to stay outside production
  until customer approval is recorded.
- Required mouse, keyboard, no-JavaScript, reduced-motion, mobile, tablet, desktop, text zoom, and
  cross-browser behavior to remain usable without changing the solution-page logo rails.
- Customer.io was used only as visual inspiration. No external component code, package, image, or
  other asset was copied.

## 2. Files reviewed

- `src/lib/content/customer-stories.ts`
- `src/components/CustomerLogoRail.astro`
- `src/pages/index.astro`
- `src/pages/customers/[slug].astro`
- `src/pages/sitemap.xml.ts`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `tests/unit/customer-stories.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts` and the affected visual baselines

## 3. Claims and publication review

- The four customer stories, the global energy enterprise quote, the Frommer Legal quote, the
  atares quote, and the MAHLE quote remain marked `approval-pending`.
- Full supplied quotations are retained as internal evidence. Public draft output uses only exact
  excerpts and never changes TextCortex to Zeno inside quotation marks.
- The approved customer logo records and their allowed surfaces were not changed. Logo permission
  was not treated as permission for a quotation, metric, or outcome.
- Preview and development output includes the four draft routes and visible approval notices.
  Production output excludes every pending story, quote, badge, route, and sitemap entry. It keeps
  the approved logos and the approved anonymous strategy consultancy quote.
- The atares story uses a team-level estimate of about 20 hours per week and states that it is not a
  per-user figure. The b2venture story uses the source-body 2x usage figure and does not publish the
  conflicting 7x headline.

## 4. Findings

### CUSTOMER-PROOF-01: P2, resolved

- **Affected surface:** Mobile expanded customer preview.
- **User and impact:** Opening a preview could create a large blank area before the panel, forcing
  the reader to scroll without knowing where the content had gone.
- **Preconditions:** Open a customer disclosure at 560px or narrower.
- **Reproduction:** Open the atares disclosure at 390px and inspect the distance between the
  summary and panel.
- **Expected:** The panel begins directly beneath its selected logo.
- **Actual:** The summary inherited the open details element's full height and expanded along with
  its own panel.
- **Evidence:** Manual browser inspection showed the selected tile filling most of the viewport
  before the panel began.
- **Supported cause:** `height: 100%` on the summary created a circular sizing relationship once
  the panel returned to normal flow on mobile.
- **Correction:** Removed the summary height and reset the mobile details element to automatic
  height.
- **Regression verification:** The 390px geometry test now confirms that the panel begins directly
  below the summary; the no-JavaScript disclosure test and mobile visual baseline pass.
- **Status:** Resolved.

### CUSTOMER-PROOF-02: P2, resolved

- **Affected surface:** Customer controls, expanded preview text, and customer story source label.
- **User and impact:** Low-vision readers could encounter text below the WCAG AA contrast minimum.
- **Preconditions:** View the collapsed or expanded homepage proof grid, or the dark source footer
  on a draft story.
- **Reproduction:** Run the automated WCAG A and AA scan on the homepage and atares story, then open
  the atares preview and scan the section again.
- **Expected:** All text meets the relevant contrast ratio.
- **Actual:** The collapsed gold labels measured 4.36:1, muted preview text measured between 3.96:1
  and 4.07:1, and the story footer eyebrow measured 1.81:1.
- **Evidence:** Axe reported `color-contrast` violations in Chromium, Firefox, and WebKit.
- **Supported cause:** Muted color mixtures were tuned visually without enough contrast for the
  small label sizes.
- **Correction:** Added a darker evidence label color and used the paper color for small text on the
  evidence and dark surfaces.
- **Regression verification:** The collapsed homepage, expanded atares preview, and atares story
  pass automated WCAG A and AA checks in all three browser engines.
- **Status:** Resolved.

### CUSTOMER-PROOF-03: P2, resolved

- **Affected surface:** Homepage proof grid under text zoom and at intermediate viewport widths.
- **User and impact:** Readers using 200 percent text zoom could receive horizontal scrolling, and
  four-column controls could become crowded just above the tablet breakpoint.
- **Preconditions:** Use a 390px viewport with 200 percent root text sizing, or view the grid around
  1101px to 1241px wide.
- **Reproduction:** Compare document scroll width with viewport width while the grid is collapsed
  and expanded.
- **Expected:** Controls reflow inside their tile and the page remains within the viewport.
- **Actual:** The no-wrap control label competed with the logo for a single row and overflowed at
  200 percent text zoom.
- **Evidence:** The cross-browser text-zoom assertion failed before the correction.
- **Supported cause:** The badge was permanently set to `white-space: nowrap` and the layout kept
  four columns through widths that could not reliably hold both elements.
- **Correction:** Allowed mobile controls to wrap, constrained logo width, and introduced a
  two-column intermediate layout through 1240px.
- **Regression verification:** Tests now pass at 390px, 768px, 1101px, 1240px, 1241px, and 1440px,
  including 200 percent text zoom and open-panel geometry.
- **Status:** Resolved.

### CUSTOMER-PROOF-04: P2, resolved

- **Affected surface:** Metrics in expanded homepage story previews.
- **User and impact:** A review reader could see a result without the source or population qualifier
  that limits what the figure means.
- **Preconditions:** Open any case study preview on the homepage.
- **Reproduction:** Compare the preview result rows with the typed `qualifiedResults` records.
- **Expected:** Each displayed figure keeps its qualifier next to the value and label.
- **Actual:** The preview initially rendered only the value and label.
- **Evidence:** Manual content-contract review found the qualifier field was used on the full story
  but omitted from the homepage component.
- **Supported cause:** The compact preview selected only two presentation fields from each result.
- **Correction:** Added the stored qualifier to every preview result row and increased the reserved
  panel space so the added context does not overlap the grid.
- **Regression verification:** The expanded visual baseline shows qualifiers beside both atares
  figures, and the responsive and accessibility checks pass.
- **Status:** Resolved.

### CUSTOMER-PROOF-05: P2, resolved

- **Affected surface:** Future production publication of a customer story and its associated quote.
- **User and impact:** A story promoted to approved status could have rendered an associated quote
  that was still pending, or continued to display a pending label after approval.
- **Preconditions:** Change a story to approved while its quote remains pending.
- **Reproduction:** Trace the dynamic story route's quote lookup and approval notice rendering.
- **Expected:** Every story and voice is filtered independently, and status labels reflect the
  record being rendered.
- **Actual:** The route looked up voices from the unfiltered draft collection and always rendered
  the pending notice.
- **Evidence:** Source review during the feature audit reproduced the invalid state without needing
  a current approved draft.
- **Supported cause:** Route filtering was applied only to story generation, not to associated
  voices or status-dependent copy.
- **Correction:** Filtered voices through the same content mode and made draft labels and source
  language conditional on approval status.
- **Regression verification:** Unit tests cover independent production filtering, and the current
  production build contains no pending story, voice, badge, route, or sitemap entry.
- **Status:** Resolved.

### CUSTOMER-PROOF-06: P3, resolved

- **Affected surface:** Exact-excerpt validation helper.
- **User and impact:** An empty string or ellipsis-only value could have passed the internal
  verbatim check and produced an empty public quotation.
- **Preconditions:** Add a malformed excerpt record.
- **Reproduction:** Call the validation helper with an empty string or `...`.
- **Expected:** At least one source-text segment is required.
- **Actual:** `Array.every` returned true for the empty segment list.
- **Evidence:** The new negative unit cases reproduced the edge condition.
- **Supported cause:** The helper checked segment order but not segment presence.
- **Correction:** Return false when an excerpt contains no non-empty segments.
- **Regression verification:** Valid excerpts, empty excerpts, ellipsis-only excerpts, and reversed
  segment order are covered by unit tests.
- **Status:** Resolved.

## 5. Verification evidence

- Targeted customer proof and story unit tests passed.
- Targeted mouse, keyboard, no-JavaScript, responsive, source, search, and disclosure tests passed.
- Automated WCAG A and AA scans passed for the collapsed homepage, an expanded story preview, and a
  customer story route.
- Desktop and mobile story snapshots plus collapsed and expanded homepage proof snapshots were
  generated and visually reviewed.
- The repository formatting, linting, strict type checking, coverage, preview build, client budget,
  governance, production-boundary, and full cross-browser checks passed after the corrections.

## 6. Unverified surfaces and remaining gates

- Written customer authorization for the new quotations, metrics, outcomes, badges, and story pages
  is not present. These records must remain pending and production-excluded until approval is
  recorded through the claims workflow.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. Semantic details behavior, keyboard
  operation, focus visibility, reading order, text zoom, and automated accessibility checks passed.
- External source availability was not made a runtime dependency. Links were verified as HTTPS and
  remain visibly attributed, but the automated suite does not fetch third-party pages.

## 7. Final decision

**PASS**. No unresolved P0, P1, or P2 feature findings. Publication of the pending customer proof
remains blocked by the approval gate and is excluded from production output.
