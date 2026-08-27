# Ready-made UI library intake — homepage product visuals and motion

Requested on 2026-08-27 by the workspace owner: build the new homepage product visuals and
animations from a ready-made component library such as shadcn/ui or Beautiful UI rather than
designing them from scratch, using https://legora.com/product/aos as the reference for tone.

Both sources were evaluated for this change. Neither was adopted. The visuals were built as
project-owned Astro and CSS in the existing `.product-frame` idiom.

## shadcn/ui

- Component and intended value: prebuilt card, badge, progress, separator, and tabs primitives for
  the workflow run, administration console, certification strip, and benefit scenes
- Canonical source: https://ui.shadcn.com — registry source at https://github.com/shadcn-ui/ui
- Retrieved: 2026-08-27
- Advertised license: MIT
- Exact source version or commit: not applicable; no source was adopted
- Files or exports adopted: none
- Runtime or development dependencies added: none
- Notices or attribution required in the product: none, because no source, asset, or package entered
  the repository
- Decision: **rejected for this change**

Reasons, in the order they were decisive:

1. Architecture cost. Every visual added here is non-interactive presentational markup that renders
   at build time. shadcn primitives are React components over Radix UI, so adopting them would turn
   static Astro sections into hydrated islands. The homepage currently ships 0.7KB gzip of client
   JavaScript against a 75KB budget, and AGENTS.md restricts React to interactions that genuinely
   need client state or lifecycle. None of these scenes do.
2. Two token systems. shadcn expects its own Tailwind theme contract (`--background`, `--primary`, a
   shared radius scale) plus `cn()`, `class-variance-authority`, `tailwind-merge`, `clsx`, and
   `lucide-react`. This repository owns a hand-authored token set (`--canvas`, `--paper`, `--ink`,
   `--action`, `--wash`, `--evidence`, `--rule`, `--muted`) and an IBM Plex editorial type scale.
   Running both would mean maintaining two design systems for markup that is a few dozen lines.
3. Fit. The pieces actually needed — a scheduled workflow run with step states, an administration
   console, an audited-certification strip — are not in the registry. shadcn provides application
   primitives (button, dialog, dropdown), not marketing product scenes. The library would have been
   restyled past recognition and still required the same custom composition.
4. Motion. The reveal behaviour is roughly 25 lines of CSS plus a small IntersectionObserver, with a
   reduced-motion and no-JavaScript path the repository must own anyway. An animation package would
   add client weight for behaviour that is already this small.

## Beautiful UI

- Canonical source: https://www.beautifului.dev/
- Retrieved: 2026-08-27 (re-reviewed for this change)
- Advertised license: MIT via https://www.beautifului.dev/license
- Files or exports adopted: none
- Decision: **reference only**, unchanged from `beautiful-ui-reference.md`

## Legora aOS

- Canonical source: https://legora.com/product/aos
- Retrieved: 2026-08-27
- Use: read as a public marketing page for tone and pacing only — restrained product frames, plain
  state labels, an explicitly named security and governance layer
- Files, markup, styles, copy, or assets adopted: none

## Verification

`pnpm check`, `pnpm check:governance`, the isolated Playwright funnel suite across Chromium,
Firefox, and WebKit, and regenerated visual references at 390px, 768px, and 1440px. Homepage client
JavaScript after the change: 0.7KB gzip.

Revisit this decision if a future surface needs genuinely interactive UI — a combobox, dialog, date
picker, or command palette — where an audited accessible primitive would beat a project-owned one.
