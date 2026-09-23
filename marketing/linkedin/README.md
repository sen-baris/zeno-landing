# Zeno LinkedIn banner kit

Three English concepts, each composed separately for personal profiles and company pages.
The approved headline is **AI agents your teams actually use.**

## Choose and upload

Open [the comparison sheet](exports/comparison.png) to compare the three directions.
Check [the crop simulations](exports/crop-review.png) before choosing an upload.

| Direction         | Personal profile                                           | Company page                                               |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Paper editorial   | [PNG](exports/zeno-linkedin-paper-editorial-profile.png)   | [PNG](exports/zeno-linkedin-paper-editorial-company.png)   |
| Dark statement    | [PNG](exports/zeno-linkedin-dark-statement-profile.png)    | [PNG](exports/zeno-linkedin-dark-statement-company.png)    |
| Product narrative | [PNG](exports/zeno-linkedin-product-narrative-profile.png) | [PNG](exports/zeno-linkedin-product-narrative-company.png) |

Only upload the six `zeno-linkedin-*.png` files. The comparison and crop sheets are review aids.
No account changes or uploads are made by the export command.

## Regenerate

Use the repository's Node version and locked pnpm dependencies. The existing Playwright Chromium
installation is required. No image service, external request, or additional runtime dependency is used.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm marketing:linkedin
```

- `manifest.ts`: dimensions, limits, exact copy, concept and placement records, conservative guides.
- `banner.html`: editable document structure, headline and wordmark placeholders.
- `banner.css`: brand styles and distinct placement compositions.
- `export.ts`: resolves the approved claims, embeds installed local fonts, checks rendered bounds,
  and generates the PNGs, self-contained editable HTML variants, review sheets, and verification JSON.
- `exports/verification.json`: renderer version, dimensions, file bytes, copy, font status, bounds,
  and SHA-256 hashes for each upload file. It is generated evidence, not a substitute for review.

Edit the source files, regenerate, and inspect every PNG and crop view. Never manually retouch the
exports. The standalone HTML files embed IBM Plex fonts from the existing Fontsource packages.
Their original license is retained in `exports/FONT-LICENSE.txt`. Do not remove it when sharing HTML.
PNG rendering can vary slightly across operating systems or browser versions. Use the locked
Playwright version and recorded renderer when reproducing the reviewed output.

## Placement requirements and crop assumptions

Checked against LinkedIn's official guidance on 2026-09-23:

- [Personal profile background](https://www.linkedin.com/help/linkedin/answer/a568217/):
  1584 × 396 pixels, PNG under 8 MB.
- [Company-page image specifications](https://www.linkedin.com/help/linkedin/answer/a563309/image-specifications-for-your-linkedin-pages-and-career-pages):
  the current recommendation is 1512 × 256 pixels, under 3 MB. The accepted project plan requests
  4200 × 700 high-resolution PNGs, so this kit retains that size rather than silently changing
  the deliverables. It also checks the slight crop to the current 1512:256 display ratio.

The exporter uses decimal byte limits, which are conservatively below binary MB limits. These
native flat-color compositions are substantially smaller than either limit.

LinkedIn can crop or overlay covers differently by device and page experience. There is no claim
that our guide rectangles are official safe zones. The review sheet shows full-width and roughly
88% center-cropped views, with simulated lower-left photo overlays. Company simulations also use
the current 1512:256 display ratio. Essential text remains outside
the manifest's conservative edge and photo rectangles. Confirm the actual upload preview on both
desktop and mobile before applying a chosen design. More aggressive future crops may require a
new composition rather than a stretched export.

## Approval and boundaries

The headline and the three product-motif labels are approved only for these two LinkedIn placements
in `src/lib/claims/marketing-claims.ts`. The export fails when copy no longer matches those records.
Do not add statistics, customer marks, certification badges, personal names, or additional promises.
Use the repository's `enterprise-ai-marketing-assets` skill for subsequent kits.

This directory is outside Astro's public build. Source and review files are delivered locally and
in the repository only. Creating the kit does not authorize GitHub publication or LinkedIn uploads.

## Replacing website resource destinations

`src/lib/content/resources.ts` owns the shared resource IDs, EN/DE labels, and exact destinations.
The header, mobile group, and footer all consume this record. The three current TextCortex URLs
were explicitly supplied as approved interim destinations.

When a replacement is supplied, update its content record and exact approval in
`src/lib/claims/marketing-claims.ts` together, including approval and revalidation dates. Update the
link regression fixture, then run the Resources unit and browser tests. Preserve HTTPS, safe
new-tab attributes, both localized labels, and the accessible new-tab announcement. Do not append
tracking parameters or add embeds. Sign in is a separate claim and destination.
