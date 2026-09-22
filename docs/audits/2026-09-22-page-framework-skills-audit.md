# Page framework, localization, and SEO skills audit

## Scope and acceptance

Date: 2026-09-22. Base revision: `304335e` on `main`.

The current request requires a repeatable, repository-owned page-building and audit system, plus
an authorized push of the completed localization work. This feature audit covers the new
Localization and SEO skills, the page-building playbook, skill registration and validation, the
updated development/testing/audit contracts, and pre-publish governance validation.

The included application work is separately documented in the
[German parity audit](2026-09-22-german-page-parity-audit.md). Its application code and reviewed
visual baselines were not changed during this documentation turn. The full browser suite was
rerun rather than relying only on its historical test results.

## Four invariants

- **Ownership:** `AGENTS.md` sets binding workflow. Skills own focused procedures. The maintainer
  guide records current product and architecture decisions; the playbook connects these resources.
  Shared compositions, typed catalogs, exact claim snapshots, and the route registry remain the
  application sources of truth.
- **Feedback:** Every meaningful change produces a dated audit with scope, commands, findings,
  reruns, and limitations. The validator reports missing registration or broken skill handoffs.
- **Failure radius:** An incorrect agent workflow can reintroduce reduced translated pages, widen
  claims, or publish an invalid configuration. The new procedures preserve the English design,
  exact translation approval, and separate production gates.
- **Timing:** Skills are read before implementation. Narrow tests precede broader checks. Feature
  audits follow implementation; scoped release audits precede major merges. Governance runs in
  the deployment job before artifact upload, not only in an independent workflow.

## Findings

### FRAMEWORK-01: P2, preview publication did not wait for governance validation

- **Surface:** `.github/workflows/deploy-pages.yml` and the separate agent-governance workflow.
- **Impact:** Invalid repository skills or registration could publish with the preview even while
  the independent governance workflow failed.
- **Preconditions:** A main-branch push changes a skill or its registration.
- **Reproduction:** Inspect both workflow job graphs. Follow the preview build from installation
  through verification to artifact upload.
- **Expected:** Governance validation succeeds before the preview artifact can be uploaded.
- **Actual:** The deployment verified formatting, lint, types, and application tests, but did not
  invoke governance validation or depend on its separate workflow.
- **Evidence and cause:** Original deploy job had no `check:governance` step; independent workflows
  do not form a dependency automatically.
- **Correction:** Added `pnpm check:governance` directly before the deployment verification and
  upload steps. Both stdlib Python checks remain unchanged as the CI entry point.
- **Regression verification:** Local command passes all 18 fixture tests; reviewed the job order
  and normal failure propagation before artifact upload. Hosted execution is verified after push
  under the scoped release audit.
- **Status:** Resolved.

### FRAMEWORK-02: P3, noindex documentation did not distinguish deployment from content

- **Surface:** Maintainer SEO rules and future agent handoff.
- **Impact:** A future edit could remove the preview alternate clusters while trying to follow an
  ambiguous exclusion rule.
- **Preconditions:** Review the generated project-path preview against the guide's noindex rule.
- **Reproduction:** Compare `BaseLayout.astro`, a Pages-style build, and the SEO exclusion text.
- **Expected:** Individual content eligibility is distinguished from global preview protection.
- **Actual:** The guide described noindex exclusions without explaining that the review deployment
  retains eligible content's alternate structure under a separate global noindex directive.
- **Evidence and cause:** Built preview head links and the overly broad documentation sentence.
- **Correction:** Documented the distinction in the guide and SEO skill. Also documented that
  setting a layout flag alone does not filter the route registry.
- **Regression verification:** All 33 preview canonical pages have noindex and correct reciprocal
  clusters; all 33 eligible production-mode pages have their own canonicals without noindex.
- **Status:** Resolved. No deferred polish issue.

## Workflow scenario review

The skills were walked through against the actual repository and existing regression fixtures,
without creating an unrequested language, CMS, public claim, or route:

| Scenario                                          | Verified next-agent behavior and evidence                                                                                                                                     |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change a Product hero                             | Shared composition and both language catalogs are selected; no independent German template. Paired page tests cover the result.                                               |
| Edit a factual German sentence                    | Real source ID and exact snapshot required. Unit tests reject arbitrary wording, stale source, missing approval, and widened surfaces.                                        |
| Add a third locale                                | Skill explicitly identifies locale-dependent route and copy branches, approval, and complete UI work; toggling the locale array is insufficient. No third locale was created. |
| Request a German legal page without approved text | Held route is not generated or advertised. Existing tests reject its localized SEO resolution and retain English legal links.                                                 |
| Import a future CMS draft or conflicting slug     | Provider-neutral fixtures reject duplicate locales/slugs, exclude drafts/noindex content, and require registered routes. No CMS integration was introduced.                   |
| Add a broken skill handoff                        | New fixture fails for an unknown skill in a nested reference or AGENTS.md; valid cross-skill references pass.                                                                 |
| Qualify a translated page by overflow alone       | Skill and audit template require semantic, visual, interaction, wrapping, and first-screen evidence. The complete paired browser suite exercises those checks.                |

This was a local scenario walkthrough, not an independent agent or physical-device evaluation.

## Verification

Environment: macOS, Node 24.19, pnpm 10.32.1, Playwright 1.62.1. Synthetic gateway fixtures only.

| Check                                                                 | Result                                                                                    |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                      | Passed; lockfile unchanged                                                                |
| `pnpm check`                                                          | Formatting, lint, strict types, coverage, build, and budgets passed                       |
| Unit/component coverage                                               | 144 tests; 94.15% statements, 88.18% branches, 94.44% functions, 95.61% lines             |
| `python3 tools/check_agent_skills.py`                                 | Eight registered repository skills validated                                              |
| `python3 -m unittest discover -s tests -p 'test_agent_skills.py' -v`  | 18 passed, including new registration and cross-skill fixtures                            |
| `E2E_PORT=4322 pnpm exec playwright test --workers=4 --reporter=json` | 466 passed, no failures; Chromium, Firefox, WebKit, including reviewed visual baselines   |
| Production-mode Astro build                                           | 36 generated pages; exact German claim validation passed                                  |
| Pages-style build                                                     | Correct preview origin, `/zeno-landing` base, synthetic adapter, global noindex           |
| Built HTML and sitemap assertions                                     | All 33 canonical content routes and all 15 German routes in both build shapes passed      |
| Client budgets                                                        | Both languages: home 4.1KB, product 1.3KB, calculator 63.2KB, demo 62.2KB gzip            |
| `pnpm audit --prod --json`                                            | No reported vulnerabilities; no new dependency                                            |
| Handover link inspection                                              | All local Markdown destinations in README, AGENTS, guide, playbook, and checklist resolve |
| `git diff --check`                                                    | Passed                                                                                    |

The bundled skill-creator `quick_validate.py` was attempted but could not import its external
PyYAML dependency on this host. No dependency was added to work around it. The repository's own
stdlib validator independently passed frontmatter, metadata, naming, unfinished-marker, reference,
registration, and handoff checks. Generated metadata and instruction scope were also reviewed.

The skill creation helper generated only the two new skill directories and their interface
metadata. No external UI code, script, or runtime dependency entered the application.

## Limitations and decision

The production release gate still blocks on the existing content/approval, proof, lead-gateway,
and domain-redirect requirements. Real Mailgun delivery, production hosting, physical assistive
technology, and search-engine indexing were not verified. Existing legal and security approval
boundaries remain unchanged. The later preview release audit governs the authorized push.

**PASS.** No unresolved P0-P2 feature finding remains. The audit workflow is documented and its
structural checks are enforced before preview artifact publication; this does not claim that CI
can replace human visual or claims review.
