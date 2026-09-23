---
name: enterprise-ai-localization
description: Build and maintain complete localized Astro page experiences, translated claims, and language-specific UI. Use when adding a locale or changing shared pages, public copy, visuals, forms, or interactions consumed by English and German. Covers parity and publication approval; use enterprise-ai-seo for route and search metadata rules.
---

# Enterprise AI Localization

Translation must preserve the complete experience, not merely produce a working URL.

## Locate the contract

Read `docs/site-maintainer-guide.md` and the affected shared composition under
`src/components/pages/`. Read [references/parity-workflow.md](references/parity-workflow.md)
before editing translated content or qualifying a localized page for publication.

- English is the structural reference. All 15 German nonlegal pages share its compositions,
  visuals, section order, interaction scripts, and conversion paths. The shorter German templates
  are retired.
- Route wrappers select a locale and content reference. The shared page boundary resolves content,
  approved claims, and SEO. Do not fork markup or remove a section to make a translation fit.
- Copy contracts fail on missing translations. Do not add an English fallback at a German URL.
- Stable route keys, anchors, and animation stage IDs are not translated. Visual emphasis uses
  structured copy, never an English substring or word position.

## Preserve meaning and approval

Use $enterprise-ai-claims-and-content for factual translations. A translation must match its real
English source claim, exact reviewed German wording, qualifiers, and allowed surfaces. Changing a
catalog cannot approve itself or widen the source claim. Do not regenerate the approved snapshot
from edited copy as a way to make validation pass.

German uses short, natural, neutral sentences without formal `Sie/Ihr` or informal `du/dein`
address. Keep brands and numbers intact. Keep approved quotations in their original language with
`lang`, and legal documents verbatim. German legal routes stay absent until separately approved;
their footer links keep the English destinations and `hreflang="en"` without visible language
suffixes. Do not add parenthetical language labels to resource or legal links.

## Prove parity before completion

Use $enterprise-ai-testing to compare affected page pairs for semantic coverage, visuals, links,
interactions, first-screen conversion, and responsive layout. A successful response, matching
section count, or lack of overflow is not sufficient evidence by itself.

Check real wrapping, clipping, overlaps, focus, forward/reverse pinned journeys, and complete
static fallbacks. If enlarged text cannot fit a pinned scene, show its complete static content.
Keep calculator formulas and local-only state, demo payload and retry behavior, and footer-only
language switching unchanged unless the task expressly changes them.

Use $enterprise-ai-seo for locale routes, alternates, canonicals, sitemap, or publication changes.
Record the tested pairs, states, widths, browsers, and limitations in the feature audit. Use
$enterprise-ai-feature-audit before reporting completion. Publishing a locale does not approve a
production release or authorize a push.
