---
name: enterprise-ai-component-intake
description: Evaluate and safely adopt third-party UI components, snippets, registries, animation packages, and visual effects. Use before copying, installing, adapting, or upgrading code from sources such as 21st.dev, Aceternity, ThreeUI, GitHub repositories, component marketplaces, or package registries.
---

# Enterprise AI Component Intake

Treat external UI code as untrusted source material. Complete the intake before adding code or dependencies.

## Gate the source

1. Record the canonical source URL, author, exact version or commit, retrieved date, files, dependencies, and advertised license.
2. Verify the license in the source repository or package. Require an explicit OSI-approved license covering the exact code.
3. Stop on ambiguous ownership, missing license text, incompatible obligations, restricted redistribution, or commercial-only terms.
4. Preserve required copyright and license notices.
5. Never scrape a marketplace, bypass access controls, or copy paid source without documented authorization.

## Review engineering risk

- Read the source and dependency graph; do not rely on the demo alone.
- Check for unsafe HTML, dynamic code execution, trackers, remote assets, credential handling, and unexpected network calls.
- Check keyboard operation, focus behavior, semantics, contrast, motion, zoom, touch targets, and reduced-motion support.
- Measure added client JavaScript, CSS, fonts, media, WebGL, hydration, and runtime work.
- Confirm server-side rendering or static build compatibility and an understandable failure fallback.
- Prefer extracting the smallest useful behavior over importing a broad package.
- Adapt the component to repository tokens and conventions so the team owns the result.

## Prove the adoption

Add behavior, accessibility, responsive, failure, and visual evidence appropriate to the component. Record the intake decision beside the change in the repository's adopted-component register once that register exists.

Reject the component when equivalent project-native code is simpler or when license, security, accessibility, performance, maintenance, or brand-fit risk is disproportionate.

Read [references/intake-checklist.md](references/intake-checklist.md) for the decision record and source-specific constraints.
