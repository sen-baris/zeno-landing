---
name: enterprise-ai-web-development
description: Build and modify the enterprise AI marketing website with production-grade Astro, strict TypeScript, Tailwind, and deliberately isolated React interactions. Use for any website feature, refactor, bug fix, component, page, integration, performance change, accessibility change, or frontend architecture decision in this repository.
---

# Enterprise AI Web Development

Build the smallest reliable solution that preserves user trust, keeps the static-first architecture intact, and remains easy to verify.

## Work from evidence

1. Read the applicable AGENTS.md files and relevant source, tests, configuration, and approved content.
2. State the intended user behavior and acceptance evidence before editing.
3. Trace four invariants:
   - Ownership: identify the authoritative source for content, state, and configuration.
   - Feedback: show loading, success, empty, and error outcomes where users need them.
   - Failure radius: identify what can fail, leak, regress, or become stale.
   - Timing: account for build time, hydration, navigation, submission, retries, and cleanup.
4. Reuse established project patterns unless evidence justifies a new one.

## Preserve architecture boundaries

- Keep pages and presentational sections in Astro by default.
- Add a React island only for behavior that requires client state or lifecycle.
- Choose the narrowest Astro client directive that satisfies the interaction.
- Keep domain logic framework-independent and typed.
- Keep server-only values and secrets out of browser bundles.
- Treat content, analytics, forms, and third-party embeds as external boundaries with explicit failure behavior.
- Use semantic HTML first. Add ARIA only when native semantics cannot express the behavior.

## Implement in a vertical slice

1. Add or update the behavior test at the lowest meaningful layer.
2. Implement the minimal coherent change.
3. Cover keyboard, focus, reduced motion, responsive layout, and failure states where relevant.
4. Run targeted formatting, lint, type, unit, component, integration, and end-to-end checks supported by the repository.
5. Inspect the rendered result at representative mobile and desktop sizes for visible changes.
6. Use $enterprise-ai-claims-and-content for public claims and $enterprise-ai-component-intake before adopting external UI code.
7. Use $enterprise-ai-feature-audit after the implementation and its tests pass.

## Apply engineering defaults

- Use pnpm once a package manifest exists.
- Use strict TypeScript; do not introduce untyped escape hatches without a documented boundary reason.
- Prefer explicit data flow and small cohesive modules over shared mutable state.
- Avoid speculative abstractions and dependency additions.
- Lazy-load heavy interaction, animation, and media.
- Make animation non-essential and provide a reduced-motion path.
- Never make WebGL a baseline dependency; require a measured fallback-first justification.
- Keep initial client JavaScript lean and record the effect of new hydrated code.
- Do not expose confidential information, personal data, credentials, or internal-only material.

## Exit criteria

Do not call a change complete until the applicable tests pass, visible behavior has evidence, accessibility and failure states are addressed, claims are approved, and the feature audit has no unresolved P0-P2 findings.

Read [references/quality-checklist.md](references/quality-checklist.md) when planning or reviewing a user-facing implementation.
