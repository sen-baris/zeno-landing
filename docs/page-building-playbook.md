# Building and maintaining a Zeno page

Last updated: 2026-09-22

This is the short working procedure for a person or agent taking over the site. Start here for a
change, then use the [maintainer guide](site-maintainer-guide.md) for product decisions and file
ownership. [AGENTS.md](../AGENTS.md) remains the binding contract.

## The system in one minute

```text
Route wrapper: locale + stable content reference
    ↓
Shared page composition: approved claims + translated copy + localized SEO
    ↓
Same sections, visuals, and interactions in English and German
    ↓
BaseLayout: head metadata + shared header + footer language links
    ↓
Paired QA → documented feature audit → authorized push / scoped release audit
```

Page structure lives in `src/components/pages/`, not separate English and German templates. English
is the design reference; German is a complete counterpart. Missing copy fails validation instead
of dropping a section or falling back to English.

The calculator and demo form are the only React islands. The calculator is local-only. The demo
form is the only lead-submission boundary. Product visuals remain native Astro, HTML, CSS, and SVG.

## Choose the right skill

These skills are committed under `.agents/skills/`, not tied to one agent's personal setup. Read
the relevant `SKILL.md` and the references it selects. Names are registered in AGENTS.md so a new
agent can discover the same workflow.

| Work                                                                  | Skill                                                                             |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Any page, component, or architecture change                           | [Web development](../.agents/skills/enterprise-ai-web-development/SKILL.md)       |
| Shared/localized pages, copy, visuals, or behavior                    | [Localization](../.agents/skills/enterprise-ai-localization/SKILL.md)             |
| URLs, localized metadata, canonicals, hreflang, sitemap, CMS contract | [SEO](../.agents/skills/enterprise-ai-seo/SKILL.md)                               |
| Product, customer, metric, security, legal, or factual metadata       | [Claims and content](../.agents/skills/enterprise-ai-claims-and-content/SKILL.md) |
| Behavior, mapping, responsive, or regression evidence                 | [Testing](../.agents/skills/enterprise-ai-testing/SKILL.md)                       |
| External code or dependency intake                                    | [Component intake](../.agents/skills/enterprise-ai-component-intake/SKILL.md)     |
| Every meaningful completed change                                     | [Feature audit](../.agents/skills/enterprise-ai-feature-audit/SKILL.md)           |
| Major merge, launch, or deployment candidate                          | [Release audit](../.agents/skills/enterprise-ai-release-audit/SKILL.md)           |

## 1. Inspect and define success

- Read the request, guide, relevant skills, code, tests, and claim records.
- Check `git status`. Preserve unrelated changes and local artifacts.
- Identify every affected page and language. For a shared visual, trace all its consumers.
- Write observable acceptance: what the visitor sees, does, and receives, including failure and
  fallback behavior. Identify ownership, feedback, failure radius, and timing.

For example, “update the Product hero” includes both `/product` and `/de/produkt`, the shared
`ProductPage.astro`, its visual, localized copy, any factual claim, metadata if changed, and both
responsive layouts. It does not authorize a new product capability or a production deployment.

## 2. Implement one shared vertical slice

1. Keep route files thin. The shared page resolves approved claims and SEO before rendering.
2. Use typed content and required localized copy. Update German lookup keys when English source
   wording changes. Translate captions, errors, accessible labels, and visual text as well as prose.
3. For factual changes, validate exact source and localized approvals. Never generate an approval
   snapshot from arbitrary new copy just to satisfy the gate.
4. Reuse existing sections and design tokens. Keep stable anchors/stage IDs, semantic equivalents
   for decorative visuals, and the same interaction code in both languages.
5. Resolve internal links through the locale and base-path helpers. Keep quotations in their
   approved original language. Leave legal documents untouched without approved replacement text.
6. Add regression tests in the same change. Do not change formulas, payloads, or privacy behavior
   unless the request includes that change.

## 3. Verify what visitors actually experience

Start with the narrow test, then expand to the affected families. For shared localization changes,
compare all affected page pairs rather than inspecting one language in isolation.

- Check section order, complete visuals, article bodies, qualified proof, localized links, and
  semantic captions. Matching counts alone do not prove equivalent content.
- Inspect 390, 768, 1101, and 1440px. Look for awkward word fragments, shifted alignment, overlaps,
  clipped text, and reading order, not just document overflow.
- Check enlarged text, reduced motion, no JavaScript, keyboard focus, and touch.
- Exercise pinned scenes forward and backward, including keyboard paging and resize. When text no
  longer fits, the full static scene must appear. Do not mask the problem with hidden overflow.
- Keep the first usable calculator choice and demo field visible in the first mobile/desktop
  screen. Measure the visible control, not its hidden input.
- Exercise form validation, duplicate prevention, gateway failure, retry, success, and abort.
- Inspect snapshots before accepting them. Do not blindly update all baselines.

The [localization matrix](../.agents/skills/enterprise-ai-localization/references/parity-workflow.md)
lists exact scene boundaries and existing test commands. The
[SEO verification guide](../.agents/skills/enterprise-ai-seo/references/routing-and-verification.md)
covers root/project builds, head output, sitemap, and future content groups.

## 4. Run gates and document the audit

```sh
pnpm install --frozen-lockfile
pnpm check
E2E_PORT=4322 pnpm test:e2e --workers=4
pnpm check:governance
```

The separate test port avoids accidentally using the local synthetic demo adapter for gateway
tests. Some visual baselines are platform-specific; use the matching environment or inspect the
differences, rather than claiming an unrun snapshot suite passed.

Save a dated report under `docs/audits/`. Start with the
[feature-audit template](../.agents/skills/enterprise-ai-feature-audit/references/report-template.md).
Record exact scope, commands, results, tested page/state pairs, findings, corrections, reruns, and
limitations. An older audit proves only its recorded revision, not a later edit.

P0-P2 findings block completion. P3 deferrals need impact, owner, and follow-up. Synthetic form
success does not verify email delivery. A compiled site does not prove hosting or indexing.

## 5. Hand off and publish only with authority

- Update the maintainer guide when architecture, behavior, or ownership changes. Update the
  relevant skill when a recurring workflow changes.
- When skills, AGENTS.md, governance scripts, or governance CI change, run the stdlib Python
  checks in `pnpm check:governance`. They validate discovery, registration, metadata, reference
  integrity, and cross-skill handoffs. They cannot judge visual quality or factual approval.
- Review the exact staged diff. Exclude scratch output, traces, secrets, and unrelated work.
- Push only when requested. Record the commit and verify the remote result. A push to `main`
  currently triggers the temporary GitHub Pages preview, not a production launch.
- Use a scoped release audit for a major merge. Preview remains noindex and sends no lead data.
  `pnpm build:release` and the [handover checklist](product-team-handover-checklist.md) still govern
  production. Never remove gates to make the push appear ready.

## Stop and report instead of guessing

Stop affected publication when a translation, claim approval, legal source, or critical test is
missing. Report conflicting requirements and the smallest decision needed. Do not replace a
missing translated experience with a short text-only page, invent a result, or call a partially
verified release ready.
