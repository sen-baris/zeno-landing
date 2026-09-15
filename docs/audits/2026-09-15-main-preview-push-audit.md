# Main preview push audit

## Scope

This audit covers the tracked sitewide copy and conversion cleanup diff against baseline
`3c8eac2`, plus the GitHub Pages workflow that runs on a push to `main`. That workflow publishes
a noindex shared preview. It is not a production launch.

## Preview feature finding

### PAGES-DEMO-01: P2, resolved

- **Affected surface:** GitHub Pages preview `/demo`.
- **User impact:** A reviewer could complete the demo form but receive an unconfigured submission
  error, making the shared preview appear broken.
- **Preconditions:** Build with the Pages workflow's preview variables and no lead gateway.
- **Reproduction:** Submit the built demo form with valid synthetic details.
- **Expected:** A preview-only confirmation that clearly says no information was sent.
- **Actual:** Before correction, the default gateway adapter had no endpoint and returned its
  unconfigured error.
- **Evidence:** Workflow environment inspection and compiled-preview browser exercise.
- **Supported cause:** The Pages workflow did not choose the existing synthetic lead adapter.
- **Correction:** Set `PUBLIC_LEAD_ADAPTER=synthetic` only in the noindex Pages build. No live lead
  endpoint, persistence, tracking, or production adapter was added.
- **Regression verification:** A workflow contract unit test and the compiled Chromium preview
  journey pass. The browser showed “Preview request confirmed. No information was sent.” and
  emitted no non-GET requests.
- **Status:** Resolved.

## Evidence for this push

- Frozen pnpm install against the existing checkout: passed with the lockfile unchanged. A fresh
  empty-machine install was not performed.
- Formatting, lint, Astro diagnostics, strict TypeScript, and governance validation: passed.
- Unit and component coverage: 107 tests passed; 93.49 percent statements, 89.8 percent branches,
  92.5 percent functions, and 94.56 percent lines.
- Exact Pages-style build with preview content mode, project base path, noindex flag, and synthetic
  adapter: 17 static pages built. A second root-based compiled preview confirmed the demo
  confirmation, no lead submission, and `noindex, nofollow` metadata.
- Client JavaScript budgets: all four measured routes passed.
- Production dependency vulnerability audit: no known high-severity vulnerability reported.
- License and tracked-secret filename checks: reviewed. No new dependency or secret file was
  introduced by this change.
- The sitewide feature audit records no unresolved P0 to P2 finding. The isolated full Playwright
  suite passed 193 tests across Chromium, Firefox, and WebKit.
- Outbound trust-center and current Pages preview addresses returned HTTP 200. The application
  login address returned a Cloudflare challenge to a command-line HEAD request, so live login
  availability was not established by that check. Its exact same-tab link is covered in browser
  tests.

## Production release gate

`pnpm build:release` fails closed. Hero, capabilities, trust, privacy, and at least one Zeno proof
claim still require launch approval. A same-origin lead gateway is not configured, and the
existing `heyzeno.com` redirect has not been removed and verified. Production form delivery,
deployment operations, live monitoring, and the final domain behavior are therefore unverified.
The GitHub Pages preview cannot be treated as a production release.

## Release audit decision

**BLOCKED for production release.** Pushing the noindex shared preview to `main` is within the
user's requested scope, but no production launch or release-readiness claim follows from it.
