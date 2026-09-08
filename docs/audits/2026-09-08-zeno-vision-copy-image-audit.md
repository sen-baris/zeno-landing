# Vision copy and image feature audit

## 1. Scope and acceptance criteria

- Audited the homepage Vision section after removing em dashes from public copy and reducing the
  founders photograph on desktop.
- Required the revised sentence to preserve its editorial meaning, the photo to retain its natural
  aspect ratio and alignment, and tablet, mobile, and no-JavaScript layouts to remain complete.
- Checked other visitor-facing source text after the user established the no-em-dash writing rule.
  No product, customer, metric, security, privacy, compliance, or certification claim changed.

## 2. Revision and files reviewed

- `.agents/skills/enterprise-ai-claims-and-content/SKILL.md`
- `src/lib/content/site-content.ts`
- `src/lib/leads/adapter.ts`
- `src/styles/global.css`
- `tests/e2e/funnel.spec.ts`
- `tests/unit/lead-adapter.test.ts`
- `tests/e2e/visual.spec.ts-snapshots/home-desktop-1440-chromium-darwin.png`

## 3. Commands and environments

- The system skill validator passed for the updated claims and content skill.
- Repository governance validation passed: 6 skills validated and 14 unit tests passed.
- Targeted lead-adapter unit tests passed: 5 tests.
- Targeted Chromium Vision behavior and responsive checks passed.
- `pnpm check` passed formatting, linting, strict type checking, 85 unit/component tests, coverage,
  preview build, and client budgets. Coverage was 91.77% statements, 88.17% branches, 90.52%
  functions, and 94.15% lines.
- A post-build scan found no em dash characters in generated HTML.
- Full Playwright coverage passed: 94 tests across Chromium, Firefox, and WebKit.
- Manually reviewed the 1440px Vision section before and after the image adjustment.

## 4. Findings

### VISION-01: P3, resolved

- **Affected surface:** Homepage Vision copy, rejected-form feedback, and the decorative marker in
  the homepage before/after comparison.
- **User and impact:** Visitor-facing text and presentation could violate the newly established
  brand-writing rule by displaying an em dash.
- **Preconditions:** Read the first Vision paragraph, receive a rejected lead response, or view the
  first column of the before/after comparison.
- **Reproduction:** Search visitor-facing source strings and generated content for the em dash
  character.
- **Expected:** Public text contains no em dashes.
- **Actual:** Three visitor-facing uses remained.
- **Evidence:** The source scan identified the Vision sentence, the lead rejection message, and a
  CSS generated-content marker.
- **Supported cause:** The punctuation rule was not part of the repository content contract.
- **Correction:** Recast the Vision sentence and rejection message with sentence breaks, replaced
  the decorative dash with a bullet, and added the writing rule to the content governance skill.
- **Regression verification:** The Vision test checks rendered body copy and generated marker
  content, the adapter unit test checks the rejection message, and generated HTML contains no em
  dash characters.
- **Status:** Resolved.

### VISION-02: P3, resolved

- **Affected surface:** Founders photograph in the desktop Vision section.
- **User and impact:** The photograph carried too much visual weight relative to the statement.
- **Preconditions:** View the homepage on a desktop wider than the 900px stacking breakpoint.
- **Reproduction:** Measure the photograph at 1440px viewport width.
- **Expected:** The image remains prominent but slightly smaller, aligned with the statement, and
  uncropped.
- **Actual:** The image filled the entire 851px right column and rendered 585px tall.
- **Evidence:** Pre-correction geometry measured 851 by 585 pixels.
- **Supported cause:** Its width was `min(100%, 900px)`, so the available column always determined
  the size at the reviewed viewport.
- **Correction:** Capped desktop width at 760px and aligned the image to the statement's leading
  edge. The existing narrow-layout rule still expands it to the available mobile or tablet width.
- **Regression verification:** Post-correction geometry is 760 by 523 pixels at 1440px. Automated
  checks preserve left alignment, natural aspect ratio, responsive reading order, no horizontal
  overflow, and no-JavaScript visibility. The updated desktop visual baseline passed review.
- **Status:** Resolved.

## 5. Unverified surfaces and risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. The existing semantic image alternative,
  responsive order, and no-JavaScript checks passed.

## 6. Final decision

**PASS**. No unresolved P0, P1, or P2 findings.
