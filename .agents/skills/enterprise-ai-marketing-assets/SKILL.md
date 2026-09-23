---
name: enterprise-ai-marketing-assets
description: Create and maintain Zeno social banners and other repository-owned marketing graphics, including editable sources, governed image copy, deterministic exports, and placement-specific crop review. Use for marketing deliverables outside the website build, not ordinary page visuals.
---

# Zeno Marketing Assets

## Source and authority

- Read `docs/site-maintainer-guide.md` for the current brand system. Keep campaign assets under
  `marketing/`, outside `public/` and the Astro page tree.
- Use repository fonts, colors, and native HTML/CSS/SVG for typographic and vector compositions.
  Do not recreate approved logos with generated imagery or copy another brand's artwork.
- Use $enterprise-ai-claims-and-content for exact image copy and surface-specific approval.
  Website approval does not automatically authorize a social campaign. Keep approval notes out
  of exports, and preserve exact approved spelling, punctuation, and qualifiers.
- Creating an asset does not authorize uploading it, changing a social account, pushing Git, or
  releasing the site. Stop at the requested deliverable unless separately authorized.
- The current LinkedIn kit is local-only at the owner's request. Keep `marketing/linkedin/`
  ignored and untracked. A general website push does not override that boundary; publishing this
  kit requires an explicit new instruction. Never delete the local kit when removing tracked copies.

## Build and export

1. Read the placement's current official size and format requirements. Record the checked date
   and source in the kit README. Distinguish platform requirements from conservative crop guides.
2. Adapt the composition to each aspect ratio. Do not stretch one artwork to fill another.
   Keep essential text away from crop edges and profile-photo overlap.
3. Keep editable sources, a typed placement manifest, a reproducible export command, and an
   upload-ready file for each requested variant. Prefer existing build tools over new dependencies.
4. Wait for local fonts before rendering. Validate exact pixel dimensions, maximum bytes, exact
   headline text, loaded font faces, and visible text bounds. Fail the export on violations.
5. Produce a comparison sheet and labeled desktop/mobile crop simulations. Simulations are
   review aids, not a guarantee of every platform layout.

When available locally, the LinkedIn implementation lives in `marketing/linkedin/`. Its README owns
the current commands, manifest, output locations, and crop assumptions. It is absent from fresh
clones, so repository builds and tests must not import it. Regenerate from source instead of editing PNGs.

## Review and handoff

- Inspect every export and its crop simulations at realistic display sizes. Check hierarchy,
  legibility, contrast, line breaks, image quality, and photo overlap, not only file validity.
- Keep the headline and brand consistent across placements while allowing distinct compositions.
- Use $enterprise-ai-testing for manifest, approval, export, and changed navigation contracts.
  Use $enterprise-ai-feature-audit before completion and record findings under `docs/audits/`.
- Link the comparison sheet, upload files, and regeneration instructions in the handoff. State
  which placements were simulated and which actual account uploads were not tested.
