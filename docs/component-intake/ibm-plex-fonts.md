# IBM Plex font intake

- Decision: accepted for the Zeno V1 typography system.
- Source family: IBM Plex, canonical upstream `https://github.com/IBM/plex`.
- Distribution packages: Fontsource `@fontsource-variable/ibm-plex-sans@5.3.0`, `@fontsource/ibm-plex-serif@5.3.0`, and `@fontsource/ibm-plex-mono@5.3.0` from `https://github.com/fontsource/font-files`.
- License: SIL Open Font License 1.1. Each installed package contains its license file; the lockfile records the exact package versions.
- Files used: variable weight IBM Plex Sans for body and interface text, weight 400 IBM Plex Serif for editorial display headings and the wordmark, and weight 500 IBM Plex Mono for labels inside product visuals.
- Provenance check: npm package metadata and installed license files checked on 2026-08-27.
- Network behavior: none. Font files are bundled at build time and served from the Zeno origin.
- Dependency and script behavior: font packages contain static CSS, metadata, and font assets; they add no runtime scripts or transitive execution behavior.
- Accessibility: text remains selectable and zoomable; system fallbacks are declared; the design does not rely on typeface alone to communicate state.
- Performance: only the required styles are imported. Build output and page budgets must be checked before release.
- Security and privacy: no third-party font request, cookie, tracking, or user data transfer.
- Maintainability: standard CSS imports can be replaced without changing component contracts.
- Brand fit: the serif display face, neutral sans body face, and limited mono product labels support the approved professional editorial direction without importing a pre-styled visual system.
