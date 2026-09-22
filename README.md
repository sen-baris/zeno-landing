# Zeno enterprise AI website

Static-first enterprise AI website for the standalone Zeno brand.

## Start here

Read the [site maintainer guide](./docs/site-maintainer-guide.md) before changing page structure,
public claims, customer proof, security content, legal text, forms, localization, or release
configuration. It is the practical handover for the current site and records the design and content
decisions behind the implementation.

The current GitHub Pages deployment is temporary demo infrastructure. Product-team migration tasks
are tracked in the [handover checklist](./docs/product-team-handover-checklist.md).

## Routes

- `/`: acquisition homepage
- `/product` and `/solutions/*`: product and industry narratives
- `/customers/*`: customer stories
- `/pricing`: guided business-case calculator and enterprise pricing close
- `/demo`: demo request form
- `/security`: security, privacy, certification, and workspace-control overview
- `/privacy-policy`, `/terms-of-service`, and `/imprint`: approved verbatim legal documents
- `/de/*`: published German routes with localized slugs; legal documents remain English-only
- `/ai-readiness`: noindex legacy redirect to `/pricing`, with a visible fallback link

The business-case calculator runs locally in the browser. It does not save or submit visitor inputs.

## Local development

Requirements: Node 24.19.0 (minimum 22.12.0) and pnpm 10.32.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The local development lead adapter is synthetic by default. Its confirmation states that no
information was sent. A production build accepts only a same-origin server gateway path; CRM
credentials must never enter the browser bundle.

## Verification

```sh
pnpm check
pnpm test:e2e
pnpm check:governance
pnpm build:release
```

- `pnpm check` runs formatting, lint, strict type checks, coverage, a static preview build, and client-JavaScript budgets.
- `pnpm test:e2e` runs conversion, failure, accessibility, reflow, reduced-motion, fallback, link, and visual tests in Chromium, Firefox, and WebKit. Set `E2E_PORT=4322` to use a separate test server while the usual local preview runs on port 4321.
- `pnpm build:release` is a separate deployment gate. It requires a configured production lead gateway and the repository release checks.

## Content and data boundaries

- Public proof renders only through approved, current `ClaimRecord` entries.
- Approved claims are resolved at public page boundaries. Customer quotations retain their approved wording and attribution.
- The retired readiness assessment no longer stores data or submits leads. The demo form is the only lead form.
- Analytics events are non-PII and dispatch only after explicit consent. No analytics provider is installed.
- The demo form validates meeting-request details and supports submission failure and retry.

See [AGENTS.md](./AGENTS.md), [the site maintainer guide](./docs/site-maintainer-guide.md),
[the dependency register](./docs/dependency-register.md), and [the audit archive](./docs/audits/) for
the governing contracts, implementation decisions, and verification evidence.

Do not publish without the repository release audit and the configured production lead gateway.
