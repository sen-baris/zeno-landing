# Work-led business case feature audit

## 1. Scope and acceptance criteria

- The visitor chooses one or more recurring work types, one combined weekly time amount per person, and a team size.
- No work type is assigned a typical duration, savings benchmark, or hourly cost.
- The result uses a disclosed and editable 25 percent recovery scenario, a value of 50 per hour in the selected currency, and 46 working weeks.
- The full-team and 20 percent pilot estimates remain annualized planning scenarios, not guaranteed savings or pilot-period returns.
- The calculator has accessible pointer and keyboard choices, no-JavaScript guidance, local-only state, and a demo CTA.

## 2. Boundaries and invariants reviewed

- Framework-independent calculation and validation: `src/lib/pricing/business-case.ts`.
- Typed question, work, time, and team choices: `src/lib/content/pricing.ts`.
- Approved public wording and surface limits: `src/lib/claims/registry.ts`.
- React interaction boundary and Astro page fallback: `src/components/islands/BusinessCaseCalculator.tsx` and `src/pages/pricing.astro`.
- Presentation and regression evidence: `src/styles/global.css` and pricing unit, component, Playwright, accessibility, responsive, and visual tests.
- Ownership stays inside the calculator for visitor state. No calculator value enters a URL, request, analytics event, or browser storage.
- On hydration, server-rendered disabled controls become active. One question is visible at a time. Invalid answers retain focus and show associated feedback. Back and Edit retain selections.
- A failed or missing client runtime leaves the calculation method, disclaimer, and demo link readable without JavaScript.

## 3. Claims and calculation review

- Annual hours equal people times combined weekly hours spent times recovery share times working weeks.
- Annual time value equals annual hours times the editable planning value per hour.
- Pilot size uses 20 percent of entered people, rounded to a person, with a five-person floor and 20-person cap, never exceeding the entered team.
- The public result names the scenario and inputs. It does not claim that chosen tasks produce measured recovery or that annualized pilot value arrives during the pilot.
- EUR, USD, and GBP are formatting choices only. The number 50 is not converted between currencies.
- No annual-budget field, ROI output, public Zeno price, task-specific benchmark, or em dash is published.

## 4. Findings and corrections

### CALC-01: P2, resolved

- **Affected surface:** Completed result after changing time recovery to zero.
- **User impact:** A visitor could be invited to plan a pilot even though the model showed no value to validate.
- **Preconditions and reproduction:** Complete the three choices, open Calculation settings, and enter `0` for time recovered.
- **Expected and actual:** Expected a zero-value explanation without a pilot CTA. Before correction, the page still displayed the annualized zero-value pilot and its CTA.
- **Evidence and cause:** Component edge-case review. The pilot section used only input validity as its visibility condition.
- **Correction:** Show the pilot recommendation only for a positive modeled annual value. Explain the zero scenario next to the result.
- **Regression verification:** Component test covers the `€0` result, explanatory text, and absent pilot CTA.
- **Status:** Resolved.

### CALC-02: P2, resolved

- **Affected surface:** Calculation-method text after selecting USD or GBP.
- **User impact:** A hard-coded `€50` could imply that a currency conversion had occurred despite the formatting-only rule.
- **Preconditions and reproduction:** Complete an estimate, open Calculation settings, and change Currency from EUR.
- **Expected and actual:** Expected a currency-neutral description of the fixed numeric example. Before correction, the method still said `€50`.
- **Evidence and cause:** Claim and interface review. The approved method sentence had embedded the default EUR symbol.
- **Correction:** State that each hour uses 50 in the selected currency. Keep the actual selected symbol in the result assumptions.
- **Regression verification:** Content and component tests verify the statement, changed currency formatting, and absence of conversion.
- **Status:** Resolved.

### CALC-03: P2, resolved

- **Affected surface:** Guided radio cards in WebKit.
- **User impact:** The invisible full-card input covered the visible label, making pointer targeting of the text unreliable.
- **Preconditions and reproduction:** Select weekly time, advance to team size, then target a visible radio-card label in WebKit.
- **Expected and actual:** Expected the label to activate its native radio. Before correction, ten repeated WebKit label-target journeys failed when the input intercepted the click.
- **Evidence and cause:** Playwright trace and repeated runs with retries disabled. The absolutely positioned, transparent input occupied the entire card.
- **Correction:** Keep the native input in a small hit area and let the named label cover the complete visual card. Preserve the `:focus-visible` ring on the visible card.
- **Regression verification:** Ten repeated WebKit journeys passed with retries disabled. Keyboard radio selection, label clicks, and component tests remain covered.
- **Status:** Resolved.

### TEST-01: P3, resolved

- **Affected surface:** Browser regression test stability.
- **User impact:** None directly, but a brittle test could obscure a genuine regression.
- **Preconditions and reproduction:** Run the cross-browser formula journey after the method copy mentions Calculation settings, or let WebKit auto-scroll a nearly off-screen Continue button in a 720px viewport.
- **Expected and actual:** Expected a deterministic journey. Before correction, the text locator matched both the summary and the method paragraph. A separate WebKit scroll race produced a retry.
- **Evidence and cause:** Playwright strict-mode output, WebKit trace, and repeated browser runs.
- **Correction:** Select the exact summary label, assert the next question, and use native Enter activation for the off-screen continuation. Pointer behavior is separately exercised.
- **Regression verification:** Targeted browser tests and ten WebKit repetitions passed without retries.
- **Status:** Resolved.

## 5. Accessibility, responsive, and fallback review

- Native checkbox and radio groups carry descriptive legends. Error feedback is associated with the affected group or field.
- The Continue action does not advance automatically, and heading focus follows each step. Back and Edit retain answers.
- First-question visibility and no-overflow checks cover 390, 768, 1280, and 1440 pixels. Focused desktop and mobile results were visually inspected.
- Reduced-motion visuals retain the complete question and result. Without JavaScript, the disabled calculator is hidden and manual calculation guidance, caveats, and the demo link remain available.
- No external dependency, client storage, network submission, or calculator tracking was added.

## 6. Verification evidence and limits

- Focused unit and component tests: 20 passed after the edge-case correction.
- WebKit pointer and result journey: 10 of 10 passed with retries disabled after the hit-area correction.
- Focused Chromium pricing visuals: 8 passed after updating and inspecting affected desktop and mobile references.
- Formatting, ESLint, Astro diagnostics, and strict TypeScript passed.
- Isolated unit and component coverage passed with 105 tests and 92.97 percent statements, 87.07 percent branches, 91.2 percent functions, and 94.03 percent lines.
- The complete Chromium, Firefox, and WebKit suite passed with 193 tests and retries disabled.
- Preview and production-mode Astro builds generated 17 static pages each.
- `/pricing` passed the client budget at 64.5 KB gzip against a 150 KB limit.
- Governance validation passed for six repository skills and all 14 validator tests.
- No production deployment, real visitor-data exercise, physical assistive-technology session, or field-performance measurement was requested or performed.

## 7. Final decision

**PASS.** No unresolved P0, P1, or P2 finding remains in the audited implementation.
