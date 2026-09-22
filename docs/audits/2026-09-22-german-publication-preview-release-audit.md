# German publication GitHub Pages preview release audit

## Scope and environment

This audit covers the changes staged on top of `40df68f` for the GitHub Pages workflow triggered by
a push to `main`. The release publishes the existing German nonlegal routes, moves language
selection to the footer, adds reciprocal localization metadata, and updates the maintainer and
handover documentation.

The target is the temporary GitHub Pages review site. The workflow builds with preview content,
`noindex, nofollow`, a repository subpath, and a synthetic demo adapter that sends no lead data. It
is not a production launch. The German publication feature audit records no unresolved P0 to P2
finding.

## Release verification

- Local `main` and `origin/main` both resolved to `40df68f` before the release commit.
- `pnpm install --frozen-lockfile` completed with the lockfile unchanged.
- Formatting, ESLint, Astro diagnostics, strict TypeScript, unit and component coverage, the preview
  build, client budgets, and governance validation passed.
- Coverage passed with 136 tests: 93.48 percent statements, 86.22 percent branches, 94.3 percent
  functions, and 95.17 percent lines.
- The full Playwright suite passed 320 tests across Chromium, Firefox, and WebKit with retries
  disabled. It covers conversion, validation, error and retry states, accessibility, reduced motion,
  responsive layouts, 200 percent text size, no-JavaScript behavior, localized forms, canonical and
  hreflang output, all 15 German routes, and visual baselines.
- A production-mode Astro build generated all 15 German routes after the German factual-claim gate
  passed. No German page carried an accidental noindex directive in that build.
- An exact Pages-style build used the configured GitHub Pages origin and `/zeno-landing` base path.
  The compiled German product page had its preview canonical, reciprocal alternates, base-prefixed
  language links, and `noindex, nofollow` directive.
- Client bundles stayed below their route budgets: homepage 3.8 KB, product 1.3 KB, business case
  63.2 KB, and demo 62.2 KB gzip.
- The production dependency audit reported no known vulnerabilities. The staged change contains no
  package or lockfile update, credential pattern, external component, third-party script, or new
  network boundary.
- Customer metrics, security language, qualifications, and original-language quotations remain
  governed by their approved source records. The German records carry the approved publication
  direction dated 2026-09-22.
- Manual desktop and mobile inspection covered the German product page and footer at 1440 and 390
  pixels. The `English / Deutsch` switcher is readable, keyboard reachable, and absent from the
  header and mobile menu.

## Findings and follow-up

### PREVIEW-DEPLOY-01: P3, open until the push workflow completes

- **Affected surface:** Temporary GitHub Pages review deployment.
- **User impact:** The local build is verified, but the hosted artifact and workflow result do not
  exist until the requested push occurs.
- **Preconditions:** Push the audited commit to `origin/main`.
- **Reproduction:** Open the repository Actions run and the resulting Pages URL.
- **Expected:** The workflow succeeds and the deployed German pages retain the project base path,
  footer switcher, and global noindex directive.
- **Actual:** Pre-push verification can only exercise the exact local Pages build.
- **Evidence:** Successful local Pages-style build and workflow configuration review.
- **Supported cause:** Deployment is intentionally triggered by the push being audited.
- **Required correction:** Check the workflow result and smoke-test the deployed German product page
  after the push.
- **Regression verification:** Confirm the action succeeds and the deployed route responds after the
  commit reaches `main`.
- **Status:** Open P3 follow-up.
- **Owner:** Repository owner performing this push.

## Limits

- German legal documents remain intentionally unavailable and German pages clearly link to the
  approved English documents.
- Production lead delivery, production monitoring, hosting headers, field performance, and a
  physical assistive-technology session were not verified because this release targets the
  synthetic noindex review environment.
- Existing production launch gates remain blocked and unchanged. This audit does not approve a live
  production launch.

## Decision

**READY WITH DOCUMENTED P3 FOLLOW-UPS** for the noindex GitHub Pages preview push. This is not a
production release decision.
