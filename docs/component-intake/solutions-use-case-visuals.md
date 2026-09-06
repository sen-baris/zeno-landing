# Solutions use-case visuals intake — reference only

Requested on 2026-09-04 by the workspace owner: the industry pages describe their use cases in
words only, and Legora's industry pages show a picture of the product doing each job instead. Build
the same kind of explanatory visual so a reader recognises their own work at a glance.

Two sources were named. Neither was adopted. The visuals were built as project-owned Astro and CSS
in the existing `.product-frame` idiom, the same decision recorded in
[ready-made-ui-libraries.md](ready-made-ui-libraries.md) for the homepage scenes.

## Legora

- Component and intended value: visual reference for how an industry page pairs a written use case
  with a screen of the product doing it
- Canonical source: https://legora.com
- Retrieved: 2026-09-04, as four screenshots supplied by the workspace owner
- Advertised license: none offered; the site is a commercial product marketing site
- Exact source version or commit: not applicable; no source was adopted
- Files or exports adopted: none
- Runtime or development dependencies added: none
- Notices or attribution required in the product: none, because no source, asset, sample content, or
  package entered the repository
- Decision: **reference only, adoption rejected**

No code, markup, CSS, asset, or sample content was copied. The screenshots informed one structural
decision — a caption block beside a product screen, in rows that alternate sides — which is a
common marketing layout and not ownable. Everything inside our screens was written for Zeno against
this repository's tokens and type scale.

Two of Legora's four reference screens were deliberately **not** reproduced:

1. **The Word add-in.** Zeno is a chat, workflow and automation product with a governed workspace.
   Drawing a Word side panel would assert an integration surface we do not ship.
2. **Tabular Review.** Bulk extraction across a whole document set is not chat, workflow or
   automation. A picture of a screen we do not ship reads to a buyer as a description of the
   product, which `enterprise-ai-claims-and-content` treats the same way it treats page copy.

The four surfaces that were built each map to something the product is: `assistant`, `workflow`,
`automation`, and the `result` those hand back for sign-off.

The two chat surfaces close on a composer rather than a submit button, because the product is a
conversation: work is asked for in the thread, and the governed part is which model answers. The
model selector reads "Approved provider", which is the wording the homepage and `/product` already
use for the same control.

## Langdock

- Component and intended value: comparison point named by the workspace owner as the closer
  description of what Zeno is than Legora
- Canonical source: https://www.langdock.com
- Retrieved: 2026-09-04
- Advertised license: none offered; commercial product marketing site
- Files or exports adopted: none
- Decision: **reference only, adoption rejected**

Used to bound which product surfaces may be drawn at all, not for layout or visual language.

## Claims and content

Every string inside the ten surfaces is synthetic and illustrative. Under
`enterprise-ai-claims-and-content` the claims policy covers image text, so no surface carries a
metric, a percentage, a customer name, a certification, a logo, or a date that reads as a result.
Document names are generic (`Complaint_record.pdf`, `Customer_agreement_A.pdf`) and belong to no
real customer or matter.

## Engineering

- No external script, request, embed, tracker, font, or remote asset added
- No runtime or development dependency added
- Static Astro markup and project CSS; no client JavaScript, no hydration, no island
- Accessibility: each screen is `aria-hidden="true"`, the same call `BenefitVisual.astro` makes.
  The caption beside it names the agent, the job and the sources it may read in words, so the scene
  adds nothing to the screen-reader account of the row. The funnel suite asserts the caption stays
  complete, since that is the condition the trade depends on. Every state inside a screen is a word
  before it is a colour, so a verdict or a step state survives monochrome and a colour-blind reader.
- Responsive: rows stack and stop alternating below 1100px, verified at 1440, 1100, 820 and 390
- Motion: no internal animation. One `[data-reveal]` entrance per row, under the existing
  `html[data-motion='on']` scope, so reduced motion and a failed script both render the finished
  composition.
- Maintenance owner: repository frontend owners
- Verification: `pnpm check`, `pnpm check:governance`, `pnpm test:e2e` across Chromium, Firefox and
  WebKit, plus regenerated visual baselines at 1440 and 390
