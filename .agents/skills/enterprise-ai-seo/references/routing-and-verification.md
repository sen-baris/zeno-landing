# Routing, SEO, and future content contract

## Current owners

| Concern | Repository path |
| --- | --- |
| Locale code, label, direction, number locale, publication | `src/lib/i18n/locales.ts` |
| Static route keys, dynamic slugs, counterparts | `src/lib/i18n/routes.ts` |
| Localized SEO record and standalone exclusions | `src/lib/i18n/seo.ts` |
| Head rendering and footer counterpart delivery | `src/layouts/BaseLayout.astro` |
| Origin, base, default locale configuration | `astro.config.ts` |
| Base-path-safe links | `src/lib/routing/base-path.ts` |
| Published canonical sitemap | `src/pages/sitemap.xml.ts` |
| Future provider-neutral content groups | `src/lib/i18n/content.ts` |

`createLocalizedSeo` supplies the locale, canonical path, published alternate paths, and footer
counterparts. Localized title and description are separate required `BaseLayout` props. Both are
resolved by the shared page boundary. `BaseLayout` makes paths absolute using the configured site
and base. Use `createStandaloneSeo` for redirect/error pages with no alternate group.

## Route or metadata change

1. Identify the stable reference and its published counterparts. Inspect the registry, route
   wrappers, sitemap, approved metadata, and current tests before editing.
2. Update registered slugs and required localized content together. Keep canonical paths in their
   own language. Slug changes need a deliberate legacy-link migration, not a silent broken URL.
3. Keep `hreflang` self-inclusive and reciprocal. Emit `x-default` only with a published English
   counterpart. Never invent a translation to complete a cluster.
4. For individually excluded content, use an empty alternate set and remove the entry from the
   sitemap at its source. Merely setting `noIndex` on a paired layout does not filter its registry.
5. Keep publication separate from deployment. German is published; the temporary Pages host is
   globally `noindex, nofollow`. Preview canonicals/alternates use the preview origin and base.
6. Keep unpublished German legal paths out of generation and alternates. Their approved English
   documents remain available through footer links with `hreflang="en"`. Use the normal localized
   link labels without parenthetical language suffixes.

Do not add `changefreq`, priority, fabricated `lastmod`, duplicate annotation systems, automatic
locale redirects, or arbitrary CMS canonical overrides. No public blog prefix or CMS vendor is
approved yet.

## Future CMS adapter

Treat `LocalizedContentEntry` as the normalization boundary, not as a live CMS integration.

- Normalize build-time entries into `translationKey`, locale, localized slug, title, description,
  publication/indexing status, claim IDs, and real publication/modification dates.
- Group by stable `translationKey`. Reject duplicate locale/slug combinations and more than one
  entry per locale in a translation group, including conflicting drafts.
- Resolve paths through an application-owned route reference. The current helper validates that an
  entry's slug agrees with that registered route; it does not create arbitrary blog routes.
- A localized article can publish alone. It gets no alternates or `x-default` until an indexable,
  published English counterpart exists.
- Validate upstream dates and schema at the adapter boundary. Use real `updatedAt` for `lastmod`;
  omit it when unavailable. Do not update dates simply because a build ran.
- Add the selected collection/loader only when requested. Keep secrets at build time and preserve
  static output. Never store untrusted remote HTML or approval notes in browser props.

## Verification

Use existing unit fixtures for missing locales, duplicate slugs, draft/noindex groups, changed
slugs, same-language canonicals, and base paths. Use browser tests for the actual emitted head,
footer switching, and localized destinations. Check each complete group on both pages.

```sh
pnpm exec vitest run tests/unit/localization.test.ts tests/unit/page-localization.test.ts
E2E_PORT=4322 pnpm exec playwright test tests/e2e/localization.spec.ts tests/e2e/localization-parity.spec.ts --workers=4
CONTENT_MODE=production pnpm exec astro build
PUBLIC_PREVIEW_DEPLOY=true PUBLIC_SITE_ORIGIN=https://sen-baris.github.io PUBLIC_SITE_BASE=/zeno-landing pnpm build
```

The third command tests production-mode generation and the localized claim gate; it does **not**
replace `pnpm build:release`. Inspect each build before overwriting `dist` with the next:

- `lang`, localized title/description, one absolute self-canonical, matching social URL;
- the exact reciprocal alternate set and English `x-default`;
- sitemap contains every eligible canonical once and no redirects, errors, drafts, or held legal;
- no double base prefixes, broken localized links, or remote-origin leakage;
- preview noindex remains global; eligible production-mode pages are not accidentally noindex.

Do not describe a local HTML inspection as a Google indexing result. Record the target environment,
commands, page groups, assertions, and any unverified hosting behavior in the audit.

## Primary reference guidance

Checked on 2026-09-22. Recheck official documentation when changing routing architecture or framework
versions; project policy choices are narrower than what the platforms permit.

- [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions): absolute self-inclusive reciprocal alternates; one annotation method is sufficient.
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): use a same-language canonical with hreflang.
- [Astro internationalization](https://docs.astro.build/en/guides/internationalization/): locale routing and unprefixed default locale.
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/): build-time collections and loaders for a later normalized content adapter.
