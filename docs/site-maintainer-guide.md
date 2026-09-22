# Zeno website maintainer guide

Last updated: 2026-09-22

This is the main handover document for the Zeno marketing website. It explains what the site is
trying to do, where each source of truth lives, how the interactive parts work, and which decisions
future contributors must preserve.

Use this guide together with [AGENTS.md](../AGENTS.md). AGENTS.md contains the binding engineering,
claims, accessibility, testing, and release rules. This guide explains how those rules apply to the
site that exists today.

## Five-minute orientation

- **Primary goal:** turn enterprise interest into a business-case estimate or a prepared demo
  conversation.
- **Core story:** company context, a prebuilt or custom agent, reviewable work, then governed
  adoption.
- **Architecture:** static Astro pages with two small React islands for the calculator and demo
  form.
- **Public truth:** factual statements come from approved claim records, not directly from page
  components.
- **Current deployment:** GitHub Pages is a temporary noindex demo build with synthetic lead
  submission. Production hosting has not been selected in this repository.
- **Current localization:** English and German are published. German legal documents are not yet
  available.

If a change affects a public claim, customer proof, security statement, legal document, form,
localized route, or release setting, read the relevant detailed section before editing.

## Contents

1. [Purpose and conversion model](#purpose-and-conversion-model)
2. [Product and editorial narrative](#product-and-editorial-narrative)
3. [Technology and architecture](#technology-and-architecture)
4. [Routes and source ownership](#routes-and-source-ownership)
5. [Content and claims governance](#content-and-claims-governance)
6. [Design system and interaction principles](#design-system-and-interaction-principles)
7. [Business case calculator](#business-case-calculator)
8. [Demo request and lead handling](#demo-request-and-lead-handling)
9. [Customer stories and proof](#customer-stories-and-proof)
10. [Security and legal content](#security-and-legal-content)
11. [Localization and international SEO](#localization-and-international-seo)
12. [Testing and quality gates](#testing-and-quality-gates)
13. [Preview, production, and release](#preview-production-and-release)
14. [Common maintenance workflows](#common-maintenance-workflows)
15. [Decisions worth preserving](#decisions-worth-preserving)
16. [Known open work](#known-open-work)

## Purpose and conversion model

Zeno is presented as a standalone enterprise AI brand for AI, innovation, IT, data, operations,
and security decision-makers.

The site has two conversion paths:

1. **Build a business case.** A visitor selects recurring work, estimates the time it takes, and
   receives a local planning estimate.
2. **Book a demo.** A visitor sends a compact meeting request. This is the only lead-submission
   form on the site.

The business-case calculator never sends, stores, persists, or tracks its inputs. The demo request
is the only surface that can transmit personal or company information.

The retired `/ai-readiness` route is a noindex compatibility page that redirects to `/pricing`.
Do not restore the old readiness questionnaire or its scoring model.

## Product and editorial narrative

The core narrative is:

> Company context → prebuilt or custom agent → reviewable work → governed adoption

The visitor should understand these ideas without reading a feature catalogue:

- Zeno grounds AI agents in company knowledge and business systems.
- Teams can begin with a prebuilt agent or shape one around their workflow.
- Human owners review important work.
- Knowledge access, model choice, review, and adoption stay visible in one governed workspace.
- Zeno remains involved through adoption. It is not presented as optional setup help.

### Homepage

The homepage is an editorial story, not a product manual. Its intended rhythm is:

1. A direct hero about AI agents teams actually use.
2. A three-stage adoption journey.
3. A business problem and operating shift.
4. Customer stories and proof.
5. The post-launch adoption chapter.
6. Trust and security teaser.
7. Vision, near the end of the page.
8. Final conversion.

The hero uses the label **Start your way** and explains the prebuilt or custom path. Avoid adding a
catalogue, extra slide, or competing CTA to the hero.

### Product

The product page should remain concise. It communicates:

- enterprise AI grounded in company context;
- prebuilt and custom agents;
- connected knowledge and MCP connectors;
- access to major AI models with EU hosting;
- one governed workspace.

It uses product-like HTML, CSS, and SVG compositions. They are explanatory visuals, not copied
screenshots. Do not turn this page back into a long feature list.

### Solutions

Each solution page follows the same structure but uses the language and work products of its
industry. The five current mappings are:

| Solution              | Customer proof | Important qualifier                                               |
| --------------------- | -------------- | ----------------------------------------------------------------- |
| Manufacturing         | MAHLE          | Use the approved activation and time results.                     |
| Management consulting | KBC            | Use the approved search, proposal, and weekly-use results.        |
| M&A                   | atares         | The time result is an approximate team total.                     |
| Private equity        | b2venture      | Identify it as adjacent venture-capital investment-team evidence. |
| Legal                 | Frommer Legal  | Quote only. There is no Frommer customer-story route.             |

The solution headlines are intentionally playful and industry-specific. Supporting copy should be
plain, short, and understandable to a general industry buyer. Avoid jargon-heavy examples that only
one specialist would understand.

## Technology and architecture

The application is static-first:

- **Astro** owns pages, layouts, navigation, content composition, and non-interactive visuals.
- **Strict TypeScript** owns content contracts, calculators, validation, claims, and route logic.
- **React** is limited to two client islands:
  - `BusinessCaseCalculator.tsx`
  - `DemoForm.tsx`
- **Tailwind** provides the build integration, but most of the established site styling lives in
  `src/styles/global.css` and uses project-owned tokens and classes.
- No client state library, animation package, analytics SDK, CMS SDK, or component library is
  installed.

Keep static markup in Astro. Add a React island only when browser state or lifecycle is necessary.
Decorative behavior does not justify hydration.

### Directory map

```text
src/
  assets/                 Local image assets
  components/             Shared Astro components and product visuals
  components/islands/     Narrow React interactions
  layouts/                Shared document shells
  lib/claims/              Approved public claims and resolvers
  lib/content/             Typed English page and story content
  lib/i18n/                Locales, routes, German content, and SEO records
  lib/leads/               Demo validation and submission boundary
  lib/pricing/             Framework-independent calculator logic
  lib/routing/             Deployment base-path handling
  pages/                   Astro routes
  styles/                  Global design system and responsive behavior
public/
  connector-logos/        Approved connector marks
  customer-logos/         Approved customer logo files
tests/
  unit/                    Pure content and domain tests
  components/              React island behavior
  e2e/                    Browser, accessibility, fallback, and visual tests
docs/
  audits/                  Dated feature-audit evidence
  component-intake/        Third-party intake decisions
```

### Four boundaries to preserve

| Boundary                                | Owner                                          |
| --------------------------------------- | ---------------------------------------------- |
| Public factual truth                    | Approved claim records under `src/lib/claims/` |
| Editorial structure                     | Typed records under `src/lib/content/`         |
| Interactive calculations and validation | Framework-independent modules under `src/lib/` |
| Rendering and layout                    | Astro pages, components, and `global.css`      |

Do not move factual claims directly into a component to save time. Do not bury business formulas in
JSX. Do not make CSS or screenshots the only place a user can understand a product concept.

## Routes and source ownership

| Public route        | Main page                          | Primary content source                 |
| ------------------- | ---------------------------------- | -------------------------------------- |
| `/`                 | `src/pages/index.astro`            | `site-content.ts` and approved claims  |
| `/product`          | `src/pages/product.astro`          | `product.ts`                           |
| `/solutions`        | `src/pages/solutions/index.astro`  | `solutions.ts`                         |
| `/solutions/:slug`  | `src/pages/solutions/[slug].astro` | `solutions.ts`                         |
| `/customers/:slug`  | `src/pages/customers/[slug].astro` | `customer-stories.ts`                  |
| `/pricing`          | `src/pages/pricing.astro`          | `pricing.ts` and business-case logic   |
| `/demo`             | `src/pages/demo.astro`             | approved claims and `DemoForm.tsx`     |
| `/security`         | `src/pages/security.astro`         | `security.ts` and certification claims |
| `/privacy-policy`   | Markdown legal page                | approved legal document record         |
| `/terms-of-service` | Markdown legal page                | approved legal document record         |
| `/imprint`          | Markdown legal page                | approved legal document record         |
| `/ai-readiness`     | legacy redirect page               | noindex redirect to `/pricing`         |
| `/de/*`             | `src/pages/de/[...path].astro`     | Published German content and claims    |

The central localized route registry is `src/lib/i18n/routes.ts`. Internal links, canonicals,
language switching, and the sitemap should resolve through it rather than reconstructing slugs in
individual components.

## Content and claims governance

Public product, customer, metric, security, privacy, compliance, certification, legal, and ROI
statements are governed content.

### Source-of-truth order

1. Approved brief, legal guidance, and claim registry
2. Explicit accepted direction for the current task
3. Repository content and tests
4. Public research used only for context

Public TextCortex pages may inform research. They do not automatically authorize Zeno claims.

### Claim flow

1. Add or update a `ClaimRecord` in `src/lib/claims/`.
2. Include exact wording, evidence, dates, accountable approver, allowed surfaces, qualifiers, and
   revalidation timing.
3. Reference the stable claim ID from typed content.
4. Resolve it at the page boundary with `resolveApprovedClaims`.
5. Pass only the approved statement into the rendering component.

`resolveApprovedClaims` fails closed when a claim is missing, expired, unapproved, duplicated, or
used on an unapproved surface.

### Writing rules

- Use direct sentences and plain terms.
- Avoid comma chains and unnecessary subordinate clauses.
- Avoid repeated hedging such as “should” and “could” when describing approved product behavior.
- Preserve genuine uncertainty in estimates and future plans.
- Do not use em dashes in public Zeno copy.
- Keep customer quotations verbatim. Do not silently rewrite text inside quotation marks.
- Preserve metric qualifiers, populations, time periods, and attribution.
- Do not expose approval notes or internal evidence in the visitor interface.
- Use neutral product language in customer-story narrative. Keep TextCortex unchanged inside
  approved quotations.

### Public proof is not ordinary copy

Customer names, logos, quotes, case-study facts, metrics, certifications, security statements, and
ROI language require explicit surface-specific approval. Metadata, image text, captions, structured
data, and social cards count as public surfaces too.

## Design system and interaction principles

### Visual language

The design is intentionally restrained and editorial:

- canvas: `#f7f3ee`
- paper: `#fffefc`
- ink: `#171518`
- action: `#6b2d4a`
- evidence: `#9a621f`
- rules: `#ded8d5`
- display type: IBM Plex Serif
- body type: IBM Plex Sans Variable
- labels: IBM Plex Mono

The source of truth is the token block at the top of `src/styles/global.css`.

Use generous whitespace, thin rules, clear hierarchy, and product-like information design. Avoid
large decorative brand marks, heavy framing, floating ornament, and bright CTA treatments that look
like active navigation states.

### Navigation

The desktop order is:

1. Product
2. Solutions
3. Security
4. Calculate business case →
5. Sign in
6. Book a demo

“Calculate business case” is plain text with slightly stronger weight and an arrow. It is not a
colored pill and does not use an active-page underline. The Zeno wordmark is the route home, so
“Why Zeno” does not belong in the header.

The Solutions menu uses native `<details>` with a small enhancement for pointer and keyboard
behavior. Preserve click, hover, Enter, Escape, outside-click, focus exit, and no-JavaScript use.

### Motion

The homepage hero and adoption chart use pinned scroll only on capable desktop viewports. Mobile,
tablet, short viewports, reduced-motion users, and no-JavaScript users receive complete static
content.

Motion is decorative. It must never hide a required claim, step, control, or CTA.

### Responsive and accessibility baseline

Changes are reviewed at 390, 768, 1101, and 1440 pixels. Important layouts also receive 200 percent
text-size checks.

Preserve:

- semantic landmarks and heading order;
- keyboard and pointer parity;
- visible evidence-colored focus states;
- meaningful status and error announcements;
- no horizontal overflow;
- usable touch targets;
- reduced-motion behavior;
- understandable no-JavaScript fallbacks.

## Business case calculator

The calculator lives on `/pricing`. It is an estimate builder, not public pricing and not a promise
of savings.

### Visitor flow

1. Select one or more work types.
2. Select or enter weekly time spent per person.
3. Select a team-size range or enter an exact amount.
4. Review a planning estimate and a suggested pilot size.

No work type, hours, or team size is preselected.

### Default planning settings

The secondary Calculation settings disclosure contains:

- 25 percent time-recovery scenario;
- 50 planning value per hour in the selected currency;
- 46 working weeks per year;
- EUR by default, with USD and GBP formatting choices.

Currency selection changes formatting only. It does not perform exchange-rate conversion.

### Formula

```text
annual hours returned = people × weekly hours spent × recovery percentage × working weeks
annual time value = annual hours returned × hourly planning value
```

The visitor-facing result calls this the potential yearly value of recovered time. Do not rename it
to guaranteed savings, revenue, capacity created, or ROI.

### Pilot rule

The suggested pilot uses 20 percent of the team, rounded to the nearest person. It uses a five-seat
minimum when the team allows it, a 20-seat maximum, and never exceeds the entered team size.

The pilot section shows pilot size and annualized hours only. The second pilot monetary result was
removed because it competed with the main result and was difficult to understand.

### Technical ownership

- Questions and choice records: `src/lib/content/pricing.ts`
- Validation, formulas, formatting, and pilot sizing: `src/lib/pricing/business-case.ts`
- Client interaction: `src/components/islands/BusinessCaseCalculator.tsx`
- Localized UI copy: `src/lib/i18n/forms.ts`

All calculator state remains in React memory. Do not add persistence, storage, analytics, URL state,
or network submission.

## Demo request and lead handling

The demo form appears in the first viewport on desktop and begins immediately after the short intro
on mobile.

Required fields:

- full name;
- work email;
- company;
- privacy acknowledgement.

The form also asks for a phone number, but it may be left blank. Optional planning context remains
inside a native disclosure and includes role, organization size, desired start, and systems or
context. Empty optional fields are omitted from the payload.

Marketing consent is not collected. The adapter always sends `marketing: false`.

### Submission modes

| Mode                 | Behavior                                                       |
| -------------------- | -------------------------------------------------------------- |
| Local development    | Synthetic confirmation by default. No lead is sent.            |
| GitHub Pages preview | Synthetic confirmation. No lead is sent.                       |
| Production           | Same-origin gateway configured through `PUBLIC_LEAD_ENDPOINT`. |

CRM secrets and credentials must never enter client code. The browser only knows a root-relative
gateway path such as `/api/leads`.

The form supports validation, duplicate-submit protection, cancellation on unmount, understandable
gateway failure, retry, and success confirmation. Keep these behaviors when changing fields.

Analytics code only dispatches non-PII browser events after an explicit `zeno-analytics-consent`
value of `granted`. No analytics provider is installed.

## Customer stories and proof

Customer records live in `src/lib/content/customer-stories.ts`. Claims live separately under
`src/lib/claims/`.

The homepage uses a compact logo grid. Story previews open only from the Case study control, not
from the entire logo area. Desktop previews attach to the selected logo. Mobile previews expand in
the reading flow. The native `<details>` disclosure remains usable without JavaScript.

Current customer-story routes:

- `/customers/atares`
- `/customers/b2venture`
- `/customers/mahle`
- `/customers/kbc`

Each article uses a consistent editorial structure:

1. Customer context
2. The challenge
3. The approach
4. Workflows in practice
5. Results and operating impact

Prominent results must preserve their approved qualifiers. Do not infer new metrics from prose or
promotional headlines. Do not add a customer-story link for Frommer Legal until an approved article
exists.

Customer logo assets are under `public/customer-logos/`. A logo approval does not authorize a quote,
outcome, narrative, or metric.

## Security and legal content

### Security

`/security` is the dedicated buyer-facing security page. The homepage `#trust` section remains a
short teaser for backward compatibility.

The Security page distinguishes:

- ISO 27001 certification;
- SOC 2 Type I report on control design;
- SOC 2 Type II report on operating effectiveness;
- GDPR privacy and legal positioning.

Do not call GDPR a certification. Do not call SOC 2 a certification. Do not introduce unsupported
claims about encryption algorithms, BYOK, monitoring frequency, penetration-test frequency,
incident-response SLAs, SSO, retention controls, model training, ISO 42001, or EU AI Act compliance.

The operating-company attribution and release gate must remain intact until legal confirmation is
complete.

### Legal pages

The Privacy Policy, Terms of Service, and Imprint are verbatim legal documents copied from the
approved TextCortex sources. Their visible legal content must not be edited for tone, grammar,
branding, punctuation, or the public no-em-dash style rule.

`src/lib/content/legal-documents.ts` records the approved source, revision, route, dates, and SHA-256
checksum. Tests fail when the approved text changes.

To update a legal page:

1. Obtain an approved, current source document.
2. Replace the complete visible legal body only.
3. Update the legal record, revision date, capture date, approval data, and checksum.
4. Verify every embedded link.
5. Run legal unit and browser tests.

Never perform a casual copy edit on these documents.

## Localization and international SEO

English is the unprefixed default locale. German uses `/de/` and localized slugs.

### Current publication status

| Locale  | Status    | Search behavior                                                      |
| ------- | --------- | -------------------------------------------------------------------- |
| English | Published | Self-canonical and indexable unless the whole deployment is preview. |
| German  | Published | Self-canonical and indexable unless the whole deployment is preview. |

German factual statements have separate approved claim records in `src/lib/i18n/de-claims.ts`. A
production build validates their approval ownership and date before generating German routes.
Changing locale status alone is never enough to publish a future locale.

Language switching appears only in the footer and preserves the current page. German uses a
neutral, direct voice without formal `Sie` or informal `du` address. The switcher has no preview,
version, or experimental status label.

German legal routes are reserved but not generated:

- `/de/datenschutz`
- `/de/nutzungsbedingungen`
- `/de/impressum`

German pages link to the English legal documents with a visible English-language label until
approved German documents exist.

### SEO rules

- Every published localized page uses a self-referential canonical.
- A complete language pair emits absolute `hreflang="en"`, `hreflang="de"`, and
  `hreflang="x-default"` links in the HTML head.
- `x-default` points to English.
- Both language versions emit the same reciprocal set.
- Missing, draft, noindex, redirect, error, and untranslated legal routes do not emit hreflang.
- HTML head annotations are the only hreflang mechanism. Do not duplicate them in sitemap XML or
  HTTP headers.
- No browser-language, cookie, or IP redirect is used.
- The sitemap uses the same route registry and contains only published canonical URLs.

### Adding or publishing a locale

1. Add its definition in `locales.ts`.
2. Add every localized static and dynamic slug to `routes.ts`.
3. Add shared UI, forms, metadata, and page content catalogs.
4. Create separate localized claim records for factual statements.
5. Add page generation and responsive coverage.
6. Keep the locale in preview until claims and legal requirements are approved.
7. Verify reciprocal hreflang, self-canonicals, x-default, sitemap output, and base-path handling.
8. Change the publication status only after the approval gate passes.

### Future blog or headless CMS

`src/lib/i18n/content.ts` defines the provider-neutral contract. Each entry has a stable
`translationKey`, locale, localized slug, title, description, publication status, indexing status,
claim IDs, and real publication or modification dates.

The adapter must:

- group translations by `translationKey`, never by slug;
- enforce one entry per locale in a translation group;
- enforce unique locale and slug combinations;
- derive canonicals through the application route registry;
- create hreflang only from published, indexable counterparts;
- require a published English counterpart before adding x-default;
- use real `updatedAt` values for sitemap `lastmod`;
- fetch and normalize content at build time.

No CMS vendor or blog prefix has been selected. Do not introduce either speculatively.

## Testing and quality gates

Requirements:

- Node version from `.nvmrc`
- pnpm version from `package.json`

Install and run locally:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Main verification commands:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm check:budgets
pnpm test:e2e
pnpm check:governance
```

`pnpm check` runs the first six commands except browser tests and governance checks.

If the normal development server is already running on port 4321, isolate Playwright so it does not
reuse the synthetic preview server:

```sh
E2E_PORT=4322 pnpm test:e2e
```

The suite covers:

- unit logic and claim resolution;
- calculator and form components;
- navigation and conversion paths;
- submission failure and retry;
- no-JavaScript and reduced-motion behavior;
- keyboard and focus behavior;
- accessibility scans;
- responsive reflow and overflow;
- legal-document integrity;
- localization, canonicals, hreflang, and sitemap behavior;
- Chromium, Firefox, and WebKit;
- visual baselines for high-risk layouts.

Do not update visual snapshots blindly. Inspect the rendered difference first, then update only the
baseline that represents an accepted visual change.

Coverage floors are 90 percent for statements, lines, and functions, and 85 percent for branches.

## Preview, production, and release

### Temporary GitHub Pages demo preview

Pushing to `main` runs `.github/workflows/deploy-pages.yml` and publishes a shared review build.

That workflow:

- uses `CONTENT_MODE=preview`;
- configures the GitHub Pages origin and project base path;
- marks the deployment `noindex`;
- uses the synthetic lead adapter;
- sends no lead data.

This deployment is not a production launch and must not determine the permanent hosting
architecture. Use the [product team handover checklist](./product-team-handover-checklist.md) when
moving the site to its production platform.

### Production release

`pnpm build:release` is intentionally stricter than `pnpm build`. It checks:

- production content mode;
- approved homepage, capability, trust, and privacy release status;
- at least one approved current proof claim for the homepage;
- a same-origin lead gateway path;
- confirmation that the existing domain redirect was removed.

Current repository content still contains release-blocking draft statuses. This is intentional.
Never weaken the gate to make a release command pass.

Relevant environment variables:

| Variable                       | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `CONTENT_MODE`                 | Selects preview or production content.                     |
| `PUBLIC_PREVIEW_DEPLOY`        | Adds deployment-wide noindex behavior.                     |
| `PUBLIC_SITE_ORIGIN`           | Sets the canonical deployment origin.                      |
| `PUBLIC_SITE_BASE`             | Supports project-path deployments such as `/zeno-landing`. |
| `PUBLIC_LEAD_ADAPTER`          | Selects synthetic or gateway demo submission.              |
| `PUBLIC_LEAD_ENDPOINT`         | Same-origin production lead gateway path.                  |
| `ZENO_DOMAIN_REDIRECT_REMOVED` | Release confirmation for the production domain.            |

Use `withBase` for internal paths so preview deployments continue to work below a domain root.

## Common maintenance workflows

### Change public copy

1. Classify the copy as editorial or factual.
2. For factual copy, locate or add the approved claim record first.
3. Update the typed content record and exact claim wording together.
4. Resolve the claim at the page boundary.
5. Check metadata, captions, accessibility labels, and localized versions.
6. Add or update tests.
7. Run the feature audit before completion.

### Add a solution

1. Add a complete `Solution` record in `solutions.ts`.
2. Give it a unique stable slug, headline, workspace, customer proof, controls, FAQs, and conversion.
3. Add approved workspace and proof claims.
4. Add its localized slug mapping.
5. Add German content and separately governed localized claim records.
6. Confirm the Solutions menu and sitemap derive it automatically.
7. Add unit, browser, responsive, and visual coverage.

### Add a customer story

1. Add the logo only when its logo claim is approved.
2. Add the story, result, and optional quotation records separately.
3. Preserve every metric qualifier and attribution.
4. Add the article sections and story route.
5. Map it to a solution only when the evidence is genuinely relevant.
6. Add localized preview content and claims independently.
7. Verify homepage preview behavior, article layout, sitemap, and no-JavaScript rendering.

### Change the calculator

1. Update framework-independent types, validation, and formulas first.
2. Add deterministic unit tests for edge cases and formatting.
3. Update the React island without adding persistence or submission.
4. Preserve the planning disclaimer and local-data statement.
5. Recheck keyboard progression, focus movement, live announcements, back/edit behavior, and mobile
   reflow.

### Change the demo form

1. Update lead types and validation together.
2. Keep optional empty fields out of the payload.
3. Preserve `marketing: false` unless a separately approved marketing-consent flow is introduced.
4. Test validation, duplicate submission, abort cleanup, gateway rejection, retry, and success.
5. Never put a CRM credential or third-party form secret in browser code.

### Add an external component or dependency

Run the repository component-intake process first. Record exact source, license, version, network
behavior, dependencies, accessibility, performance, and maintenance impact. Public visibility is not
permission to copy code.

## Decisions worth preserving

These decisions came from repeated design and editorial review. Treat them as intentional unless a
new accepted direction replaces them.

- Keep the homepage focused. Product detail belongs on `/product` and industry detail belongs on
  solution pages.
- Make prebuilt versus custom agents easy to understand without adding another homepage section.
- Present Zeno as ongoing reinforcement through adoption, not optional consulting.
- Use simple supporting copy. Strong headlines do not need long explanations.
- Prefer concrete verbs over “should,” “could,” and vague AI language.
- Call the proof section **Customer stories**, not “Customer proof.”
- Keep customer previews compact and attached to the chosen logo.
- Keep Vision near the end of the homepage.
- Keep the Business case action distinct through weight and an arrow, not a bright pill or active
  underline.
- Use one dominant monetary result in the calculator. Do not revive the secondary pilot amount.
- Keep the Security page factual, verifiable, and free of unsupported feature claims.
- Keep product visuals minimal. Do not place a large Z mark on every screen.
- Preserve the original language of approved customer quotations.
- Preserve the legal documents exactly.
- Do not create German legal routes before approved documents exist.
- Do not redirect visitors automatically based on language.

## Known open work

- The product team must select and own the production hosting platform.
- The temporary GitHub Pages workflow must either remain an explicit noindex preview or be retired
  after production cutover.
- German Privacy Policy, Terms of Service, and Imprint are not approved.
- No CMS provider or public blog route has been selected.
- No analytics provider is installed.
- The production `/api/leads` gateway and Mailgun delivery integration still need implementation and
  deployment configuration.
- Production release remains blocked by the explicit content and domain gates in
  `tools/check_release_readiness.ts`.
- The broader operating-company attribution for Zeno security claims still requires final legal
  confirmation before launch.

When any of these changes, update this guide in the same pull request as the implementation.
