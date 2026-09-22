# Localization framework preview release audit

## Candidate and environment

Date: 2026-09-22. Candidate: the reviewed main-branch changes on top of `304335e`, comprising the
complete German parity repair, shared page compositions, exact localized claim records, reviewed
snapshots, repository Localization and SEO skills, maintainer playbook, and audit/governance updates.
The release commit includes this report. The remote main branch matched `304335e` before staging.

Target: the temporary GitHub Pages review site at `https://sen-baris.github.io/zeno-landing/`.
The workflow retains preview content, global noindex, a project base path, and synthetic lead
submission. No lead data is sent. This is not a production launch and does not authorize changes to
the existing legal/entity, content, domain, or production lead-gateway gates.

Feature evidence:

- [German page parity audit](2026-09-22-german-page-parity-audit.md)
- [Page-framework skills audit](2026-09-22-page-framework-skills-audit.md)

Both report no unresolved P0-P2. The latter explains the independently attempted skill-scaffold
validator's unavailable PyYAML dependency and the successful repository-owned validation used
instead. No application or tool dependency was added.

## Verification

- Frozen-lockfile installation passed without a package or lockfile change.
- `pnpm check` passed formatting, lint, strict types, 144 unit/component tests and coverage, the
  static build, and both-language client budgets. Coverage is 94.15% statements, 88.18% branches,
  94.44% functions, and 95.61% lines.
- The full browser suite passed 466 tests with no failures, skips, or flakiness across Chromium,
  Firefox, and WebKit. It includes all page pairs, mobile/tablet/desktop reflow, 200% text, first-screen
  forms, both pinned journeys, no JavaScript, reduced motion, customer previews, navigation, FAQs,
  localized calculations, validation, gateway failure, retry, and success.
- Reviewed German and affected English baselines from the parity implementation passed unchanged
  in the fresh full-suite run. No new visual baseline was accepted during the documentation turn.
- All eight skills and AGENTS.md passed the stdlib validator and all 18 governance fixtures.
  The publishing job now runs these checks before uploading its artifact.
- Production-mode compilation generated 36 pages after exact German-claim validation. Built HTML
  assertions covered all 33 canonical content routes, including 15 German pages, for language,
  self-canonical, social URL, descriptions, reciprocal alternates, and sitemap inclusion.
- The exact Pages-style build passed the same route checks with the configured origin and
  `/zeno-landing` base. All canonical content pages retained `noindex, nofollow`; internal links
  were base-prefixed. Redirects, errors, held German legal routes, and duplicate sitemap hreflang
  annotations were absent from the canonical sitemap.
- Root-path preview output was rebuilt after the project-path verification. Client bundles remain
  below budget: home 4.1KB, product 1.3KB, calculator 63.2KB, demo 62.2KB gzip in each language.
- `pnpm audit --prod --json` reported no known vulnerabilities. The staged files contain no new
  external component, dependency, third-party script, credential pattern, private key, environment
  file, trace, or scratch output. Large intended additions are reviewed visual regression images.
- Staging was explicit. Unrelated chart directories, local agent artifacts, output folders, and
  temporary files remain untracked and excluded. `git diff --cached --check` passed.

## Post-push follow-up

### FRAMEWORK-PREVIEW-01: P3, hosted verification follows the authorized push

- **Surface and impact:** GitHub Actions and the deployed preview. Local verification cannot prove
  that the newly uploaded artifact is being served until the push runs.
- **Preconditions:** Push the audited commit to `origin/main`.
- **Reproduction:** Inspect the Deploy preview and Agent governance runs for that commit, then
  visit `/zeno-landing/de/` and its business-case, demo, and product routes.
- **Expected:** Both workflows succeed; the hosted German homepage contains the shared sections and
  pinned scenes, footer counterpart links, correct base-path metadata, and global noindex.
- **Actual at audit time:** The exact local deployment build passes; the push-triggered artifact
  does not yet exist.
- **Evidence and cause:** Successful local Pages build and the reviewed push-triggered workflow.
- **Correction and verification:** Check the workflow conclusion and hosted HTML/interaction after
  push. Report the commit and workflow outcome in the task handoff. Do not claim deployment success
  solely from `git push` succeeding.
- **Status:** Post-push verification required.
- **Owner:** Maintainer performing this authorized push; escalate any failure before calling the
  hosted preview updated.

## Production constraints and limits

`CONTENT_MODE=production pnpm exec tsx tools/check_release_readiness.ts` remains blocked by the
pre-existing hero/capability/trust/privacy release approvals, launch-proof requirement, production
lead endpoint, and domain redirect verification. Those gates were not relaxed. German legal
documents remain held. Real Mailgun delivery, production infrastructure, production headers,
physical assistive technology, and external search indexing were not verified in this preview
release. The product-team handover checklist remains authoritative for those tasks.

## Decision

**READY WITH DOCUMENTED P3 FOLLOW-UPS** for the temporary noindex GitHub Pages preview push only.
