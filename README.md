# Zeno enterprise AI website

Static-first enterprise AI website for the standalone Zeno brand.

## Routes

- `/`: acquisition homepage
- `/product` and `/solutions/*`: product and industry narratives
- `/customers/*`: customer stories
- `/pricing`: guided business-case calculator and enterprise pricing close
- `/demo`: demo request form
- `/ai-readiness`: noindex legacy redirect to `/pricing`, with a visible fallback link

The business-case calculator runs locally in the browser. It does not save or submit visitor inputs.

## Local development

Requirements: Node 24.19.0 (minimum 22.12.0) and pnpm 10.32.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The local development lead adapter is synthetic by default. Preview receipts are explicitly labelled and do not send information or email. A production build accepts only a same-origin server gateway path; CRM credentials must never enter the browser bundle.

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

See [AGENTS.md](./AGENTS.md), [the dependency register](./docs/dependency-register.md), [the original V1 feature audit](./docs/audits/2026-08-27-zeno-v1-feature-audit.md), and [the narrative and product-visual revision audit](./docs/audits/2026-08-27-zeno-narrative-product-revision-audit.md) for the governing contracts and evidence.

Do not publish without the repository release audit and the configured production lead gateway.
