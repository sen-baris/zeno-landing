# Dependency register

Reviewed on 2026-08-27. Exact direct versions are pinned in `package.json`; the complete graph is fixed by `pnpm-lock.yaml`.

## Production and build dependencies

| Dependency                       | Version | License | Purpose and boundary                                                                                         | Decision |
| -------------------------------- | ------: | ------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| Astro                            |   7.2.8 | MIT     | Static page generation, routing, metadata, and narrow island loading. No deployment adapter is installed.    | Accepted |
| @astrojs/react                   |   6.0.4 | MIT     | Hydrates only the readiness assessment and demo form.                                                        | Accepted |
| React / React DOM                |  19.2.8 | MIT     | Local state and accessible interaction for the two bounded islands; no state library.                        | Accepted |
| Tailwind CSS / @tailwindcss/vite |   4.3.3 | MIT     | Build-time CSS processing and project-owned design tokens. No component kit.                                 | Accepted |
| IBM Plex Fontsource packages     |   5.3.0 | OFL-1.1 | Self-hosted serif display, sans body, and product-label type. See `docs/component-intake/ibm-plex-fonts.md`. | Accepted |

No production dependency sends network requests at runtime. The only application network boundary is the project-owned, same-origin lead gateway adapter; it is unconfigured for release.

## Development dependencies

The repository pins TypeScript, Astro Check, ESLint, Prettier, Vitest, Testing Library, Playwright, axe-core, jsdom, and their type packages. They run only in local or CI verification and are absent from the browser bundle.

## License and vulnerability review

- `pnpm licenses list --prod --json` was reviewed on 2026-08-27. The dependency graph reported permissive/open licenses; the LGPL libvips binary is a transitive build-time Sharp asset, not shipped as browser code.
- `pnpm audit --prod` reported no known vulnerabilities on 2026-08-27.
- No external UI component, snippet, icon set, animation library, analytics SDK, CRM SDK, or deployment adapter is installed.
