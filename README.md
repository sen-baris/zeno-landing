# Zeno V1 — Execution Ledger

Static-first enterprise AI landing funnel for the standalone Zeno brand.

## Routes

- `/` — acquisition homepage and Execution Ledger narrative
- `/ai-readiness` — nine-question Impact × Readiness assessment
- `/demo` — two-step demo request form

Homepage navigation uses real section anchors until the wider information architecture is implemented.

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
- `pnpm test:e2e` runs conversion, failure, accessibility, reflow, reduced-motion, fallback, link, and visual tests in Chromium, Firefox, and WebKit. Visual references are Chromium-only at 390px, 768px, and 1440px.
- `pnpm build:release` is intentionally blocked until Zeno messaging, capabilities, proof, trust, and privacy content are approved; a same-origin lead gateway is configured; and the existing domain redirect is removed and verified.

## Content and data boundaries

- Public proof renders only through approved, current `ClaimRecord` entries.
- The claims registry is intentionally empty; no TextCortex claim is transferred by implication.
- The assessment stores only workflow, score, quadrant, and timestamp in session storage. Answers and PII are not placed in URLs.
- Analytics events are non-PII and dispatch only after explicit consent. No analytics provider is installed.
- The demo form cannot disqualify a request. Qualification context is submission metadata only.

See [AGENTS.md](./AGENTS.md), [the dependency register](./docs/dependency-register.md), [the original V1 feature audit](./docs/audits/2026-08-27-zeno-v1-feature-audit.md), and [the narrative and product-visual revision audit](./docs/audits/2026-08-27-zeno-narrative-product-revision-audit.md) for the governing contracts and evidence.

This folder is not initialized as a Git repository and is not connected to GitHub or a deployment platform.
