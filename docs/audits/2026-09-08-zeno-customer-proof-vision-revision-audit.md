# Customer proof and Vision revision feature audit

## 1. Scope and acceptance criteria

- Audited the approved customer proof publication, four customer story routes, homepage logo grid,
  compact customer previews, customer claim records, sitemap inclusion, and Vision layout revision.
- Required the homepage to show eight customer logos in a four-column desktop, two-column tablet,
  and one-column mobile grid without changing solution-page logo rails.
- Required temporary desktop previews on hover and focus, click and keyboard pinning, one open
  preview at a time, Escape and outside-click closing, attached card placement, and native
  no-JavaScript disclosure behavior.
- Required all four customer routes to be indexable production pages without visitor-facing draft,
  approval, review, or evidence-source messaging.
- Required the Vision photograph to follow its related paragraphs with a 48px to 56px desktop gap
  and remain at or below 680px wide.
- Customer.io remained visual inspiration only. No external component code, package, image, or
  other asset was copied.

## 2. Revision and files reviewed

- `src/lib/claims/customer-proof-claims.ts`
- `src/lib/claims/registry.ts`
- `src/lib/content/customer-stories.ts`
- `src/components/CustomerLogoRail.astro`
- `src/components/VisionStatement.astro`
- `src/pages/index.astro`
- `src/pages/customers/[slug].astro`
- `src/pages/sitemap.xml.ts`
- `src/styles/global.css`
- `tests/unit/customer-stories.test.ts`
- `tests/unit/customer-quotes.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts` and the affected visual baselines

## 3. Claims and publication review

- The user's 2026-09-08 direction is recorded as surface-specific approval for the four customer
  narratives, their qualified results, and the supplied quotation excerpts.
- Narrative, result, and quotation claims have separate approved records with internal evidence,
  review dates, approval ownership, qualifiers, and allowed surfaces.
- Production and preview builds include `/customers/atares`, `/customers/b2venture`,
  `/customers/mahle`, and `/customers/kbc`.
- The production sitemap contains all four customer routes and the pages do not emit noindex or
  nofollow metadata.
- Visitor-facing output contains no approval, draft, source-review, or TextCortex source-link
  messaging.
- Quotation excerpts remain verbatim apart from the explicitly authorized possessive correction in
  the MAHLE excerpt. TextCortex remains unchanged inside customer quotations, and the attribution is
  `MAHLE`.
- Material metric qualifiers remain attached to their results on the full customer pages.
- Automated public-string checks cover the repository rule that em dashes are not published.

## 4. Findings

### CPV-01: P2, resolved

- **Affected surface:** Homepage customer grid at mobile, tablet, and desktop sizes.
- **User and impact:** Several wordmark logos became very small or visually clipped after the tile
  height was reduced, weakening recognition and making the proof grid look inconsistent.
- **Preconditions:** Render the compact grid using the square 400px logo SVG assets and constrain
  them only with a standard maximum image height.
- **Reproduction:** Open the collapsed customer grid at 1440px and compare the visible atares,
  b2venture, Frommer Legal, and TMG wordmarks with the MAHLE mark.
- **Expected:** Each logo remains readable and balanced inside a short tile.
- **Actual:** Square source canvases with large internal whitespace made several wordmarks appear
  tiny, while tighter artwork appeared substantially larger.
- **Evidence:** Visual inspection of the first generated collapsed desktop baseline reproduced the
  imbalance.
- **Supported cause:** The source SVG files use square canvases with different internal artwork
  bounds, so one shared image height does not produce a shared visible scale.
- **Correction:** Added a 120px by 80px cropped logo viewport with a 112px square inner asset and a
  smaller Bovensiepen override. The viewport normalizes visible artwork without modifying source
  logo files.
- **Regression verification:** The collapsed 1440px, homepage 390px and 768px, hovered, pinned, and
  mobile-open visual baselines were regenerated and inspected. Responsive geometry and horizontal
  overflow assertions pass.
- **Status:** Resolved.

### CPV-02: P2, resolved

- **Affected surface:** Homepage customer proof previews on pointer-capable desktop devices.
- **User and impact:** A visitor could accidentally open a large preview while moving across a
  customer logo, making the section feel overly reactive and distracting.
- **Preconditions:** Use a viewport at least 1101px wide with hover and fine-pointer support.
- **Reproduction:** Move the pointer across any logo tile that has a customer story or quotation.
- **Expected:** A temporary preview opens only when the pointer enters the visible `Case study` or
  `Customer quote` control.
- **Actual:** Entering any part of the details element, including the logo, opened the preview.
- **Evidence:** The pointer listener was attached to the full details element, and the new negative
  browser assertion reproduced the unwanted opening before the correction.
- **Supported cause:** The temporary preview trigger used the tile boundary instead of the visible
  disclosure control as its pointer target.
- **Correction:** Moved the pointer-enter listener to `.customer-proof-control`. The details element
  still owns pointer-leave behavior so visitors can move into and interact with the open card.
- **Regression verification:** A Chromium behavior test confirms that logo hover keeps the preview
  closed and control hover opens it. Card positioning, pinning, and the hovered visual baseline
  pass. The cross-browser suite completed with 110 passing tests and one unrelated WebKit
  assessment timing failure; that isolated WebKit test passed immediately on a clean rerun.
- **Status:** Resolved.

### CPV-03: P2, resolved

- **Affected surface:** Numeric result line in the homepage customer preview cards.
- **User and impact:** The oversized serif result and much smaller qualifier split one proof point
  into two competing typographic levels, making the evidence harder to scan and visually
  overpowering the card.
- **Preconditions:** Open a result-based preview such as b2venture or KBC.
- **Reproduction:** Compare the result value with the explanatory label beneath the customer story
  title.
- **Expected:** The value and explanation use one consistent text size, with modest weight emphasis
  on the value.
- **Actual:** The value used a 1.45rem to 2rem display size at weight 400 while the explanation used
  0.78rem body text.
- **Evidence:** The supplied screenshots and browser inspection showed the mismatch on both KBC and
  b2venture cards.
- **Supported cause:** The result value inherited a display-heading treatment even though the value
  and label form one semantic proof statement.
- **Correction:** Applied the same responsive body size and 1.4 line height to both parts, inherited
  the body family for the value, aligned the line on its baseline, and set only the value to weight 650.
- **Regression verification:** The browser test asserts equal computed font sizes and a heavier
  result value. Inspection measured both parts at 15.68px, with weights 650 and 400. Nine affected
  customer-proof tests passed across Chromium, Firefox, and WebKit, including responsive overflow
  and no-JavaScript behavior. The focused visual test also passed.
- **Status:** Resolved.

## 5. Functional, accessibility, and responsive review

- Desktop hover and focus open a temporary card attached to the selected logo.
- Click, Enter, and Space pin or unpin the selected card. Escape and outside click close it.
- Opening another preview closes the previous one, and a pinned preview remains open after pointer
  exit.
- First-row desktop cards open below their tiles, second-row cards open above, and edge tiles align
  inward so the card remains within the viewport.
- At tablet and mobile sizes, the card stays in document flow directly beneath its logo.
- Without JavaScript, the native details element remains keyboard and pointer operable.
- The controls keep visible focus, semantic names, logical reading order, and no horizontal page
  overflow at 390px, 768px, 1100px, 1101px, and 1440px.
- The compact anonymous quotes remain secondary to the grid, while story cards expose one concise
  proof point and a clear destination link.
- The Vision content now forms one right-column stack. Its photograph follows the paragraphs by the
  specified gap, stays within the 680px cap, and follows the heading and paragraphs in mobile
  reading order.

## 6. Verification evidence

- Formatting check passed.
- ESLint passed.
- Astro strict checks and TypeScript checks passed with 77 files and no diagnostics.
- Unit and component coverage passed with 92 tests. Coverage was 92.39 percent statements, 88.77
  percent branches, 91.5 percent functions, and 94.57 percent lines.
- The earlier full Playwright revision suite passed with 111 tests across Chromium, Firefox, and
  WebKit. After the pointer-target correction, 110 tests passed in one full rerun and the remaining
  unrelated WebKit assessment timing test passed in isolation.
- Updated homepage, customer proof, customer page, and Vision visual baselines passed and were
  visually inspected.
- Preview and production builds each generated 16 pages, including all four customer routes.
- Client bundle budgets passed for the homepage, product, AI readiness, and demo entry points.
- Production output checks found no visitor-facing approval, draft, source-review, noindex, or
  nofollow text on customer routes, and confirmed all customer URLs in the sitemap.
- A stale development server once served incompatible cached React development output after a
  production build. Restarting with a clean Playwright-owned server resolved the environment issue,
  and the complete clean cross-browser rerun passed.

## 7. Not verified and remaining risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. Semantic disclosure behavior, keyboard
  operation, focus management, reading order, text zoom, and automated accessibility checks passed.
- Pointer hover is intentionally a desktop enhancement. Touch layouts use the native inline
  disclosure pattern.

## 8. Final decision

**PASS**. No unresolved P0, P1, or P2 findings remain for the customer proof and Vision revision.
