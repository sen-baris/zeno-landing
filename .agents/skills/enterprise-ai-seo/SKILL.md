---
name: enterprise-ai-seo
description: Maintain the Astro site's route registry, localized SEO, canonical URLs, hreflang, sitemap, indexing, and CMS-neutral publication contract. Use for route, slug, locale publication, metadata, deployment origin or base-path changes, and future build-time content adapters. Does not authorize publishing or changing hosting.
---

# Enterprise AI SEO

Use one application-owned route model for URLs and search metadata. Do not reconstruct localized
URLs independently in pages, the footer, or a future CMS adapter.

Read [references/routing-and-verification.md](references/routing-and-verification.md) before
changing routes, metadata, publication rules, or content adapters. Read the current maintainer guide
for deployment context. Use $enterprise-ai-localization for full translated page behavior and
$enterprise-ai-claims-and-content for factual metadata.

## Required decisions

- Existing English URLs remain unprefixed. German uses `/de/` with registered localized slugs.
  Stable route keys are independent of public slugs.
- Each indexable localized page has a self-canonical in its own language. Never canonicalize a
  German translation to English.
- A complete published pair emits identical, reciprocal absolute HTML head alternates for `en`,
  `de`, and `x-default`. The English counterpart is this site's `x-default`.
- Do not advertise missing translations, held legal documents, redirects, error pages, or
  individually noindex content. A whole review deployment is separately noindex; its published
  content retains preview-origin alternate tags so the generated structure can be tested.
- HTML head links are the sole hreflang implementation. The sitemap lists published canonical
  routes without duplicate hreflang annotations.
- Build URLs through the configured origin and base-path helper. Test both root and project-path
  builds. Do not hard-code the temporary GitHub Pages domain into content.
- Language selection is a footer link to the same page's published counterpart, not a browser,
  cookie, or IP redirect. English legal pages have no German counterpart or language switcher.

## Evidence and release boundary

Verify rendered HTML and sitemap output, not just helper functions. Cover self-canonicals,
reciprocity, exclusions, real localized destinations, social metadata, `lang`, and base paths with
$enterprise-ai-testing. Treat Search Console submission, hosting changes, redirects, and a CMS
integration as separate tasks requiring authority.

Record results in $enterprise-ai-feature-audit. Use $enterprise-ai-release-audit before a major
merge or launch. An indexable content model or successful production-mode compilation does not
clear content, legal, form-delivery, domain, or hosting release gates.
