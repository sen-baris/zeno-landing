# Business case preview push release audit

## Scope and environment

This audit covers the website changes after `e918020` and the GitHub Pages workflow triggered by a push to `main`. The included work replaces the guided business-case choices with work types, weekly time, and team size, then removes the repeated planning sentence and pilot monetary result. The two feature audits for those changes record no unresolved P0 to P2 finding.

The Pages workflow builds in preview content mode with a project base path, `noindex, nofollow`, and a synthetic demo receipt. It is a shared review site, not a production launch. Temporary chart-data, artifact, output, and tool directories are outside this push.

## Preview verification

- Frozen pnpm install against the existing checkout passed with the lockfile unchanged. A fresh empty-machine install was not performed.
- Formatting, lint, Astro diagnostics, strict TypeScript, and governance validation passed.
- Unit and component coverage passed with 106 tests: 92.96 percent statements, 87.13 percent branches, 91.2 percent functions, and 94.02 percent lines.
- The full Chromium, Firefox, and WebKit Playwright suite passed 193 tests with retries disabled. It covers navigation, calculator progression, demo validation and retry, keyboard behavior, no-JavaScript fallbacks, responsive layouts, accessibility checks, and visual references.
- The Pages-style preview build generated 17 static pages. The compiled pricing and demo pages include the project base path and `noindex, nofollow`. The retired planning sentence and pilot value sentence are absent from the compiled pricing page and client assets.
- A compiled Pages-style demo journey confirmed “Preview request confirmed. No information was sent.” with zero non-GET requests. The preview does not represent a live lead submission.
- Client JavaScript budgets passed, including `/pricing` at 64.3 KB gzip against a 150 KB limit.
- The production dependency audit reported no known vulnerabilities. The scoped diff introduces no dependency, tracked secret filename, external asset, or new third-party request.
- The remote `main` tip matched the local base revision before commit.

## Limits and production gate

The production release gate still fails closed. Hero, capabilities, trust, privacy, and Zeno proof require launch approval. A same-origin lead gateway is not configured, and the existing domain redirect has not been removed and verified. Production form delivery, operations, and monitoring remain unverified. A physical assistive-technology session and field-performance measurement were not performed. The actual Pages deployment cannot be checked until after the push and workflow run.

## Decision

**BLOCKED for production release.** The noindex GitHub Pages preview push is within the requested scope and has no unresolved P0 to P2 preview finding. This audit does not approve a live launch.
