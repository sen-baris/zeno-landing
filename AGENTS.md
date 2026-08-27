# Enterprise AI Website Repository Instructions

## Purpose

Build a high-trust marketing website for a new, standalone enterprise AI brand. The primary audience is enterprise AI, innovation, IT, data, and security decision-makers. The primary conversion is a request for a demo.

Public TextCortex pages may be used to understand the broad market context around governed AI agents, connected company knowledge, workflow automation, adoption, trust, and measurable business value. They are research references only. They do not authorize this brand to reuse TextCortex wording, capabilities, customer proof, metrics, certifications, logos, testimonials, or other assets.

The brand name, visual identity, final messaging, analytics provider, form or CRM destination, deployment platform, and approved claims will be supplied or approved separately. Do not invent them.

## Instruction scope and authority

This file applies to the entire repository. A more deeply nested AGENTS.md may add local implementation detail, but it must not weaken the confidentiality, claims, accessibility, testing, audit, or release requirements here.

Use this source-of-truth order:

1. Approved new-brand brief, design system, legal guidance, and claims registry
2. Explicit requirements and decisions accepted for the current task
3. Repository code, schemas, configuration, and tests
4. Public research and inspiration

When sources conflict, stop the affected work, explain the conflict, and obtain an authoritative decision. Never silently promote research into product truth.

## Skills-first rule

Create or update the applicable repo-local skill before implementation when a recurring workflow or non-obvious contract is missing. Keep skills under .agents/skills, follow the skill-creator structure, validate them, and register them here. Skills are governance code and require tests when their contract changes.

Use the following skills:

- $enterprise-ai-web-development for every page, component, integration, refactor, performance change, accessibility change, or frontend architecture decision.
- $enterprise-ai-testing whenever behavior, logic, interactions, forms, integrations, consent, analytics, navigation, accessibility, responsiveness, or regressions change.
- $enterprise-ai-component-intake before copying, installing, adapting, or upgrading any external component, snippet, package, effect, or registry source.
- $enterprise-ai-claims-and-content for public product, customer, metric, ROI, security, privacy, compliance, certification, comparison, metadata, or structured-data statements.
- $enterprise-ai-feature-audit after every meaningful feature, behavior change, refactor, integration, or bug fix and before declaring it complete.
- $enterprise-ai-release-audit before any production deployment, public launch, or release-candidate approval.

Read a triggered SKILL.md completely before acting. Read only its directly relevant references. If a skill blocks publication or release, report the missing evidence or failed gate rather than bypassing it.

## Mandatory engineering workflow

1. Inspect before editing.
   - Read applicable instructions, source, tests, configuration, and approved content.
   - Check repository status and preserve unrelated user work.
   - Trace existing patterns before adding a new abstraction or dependency.
2. Define behavior and evidence.
   - Identify the user, entry point, observable success, failure behavior, and acceptance evidence.
   - Build the proportionate test matrix before implementation.
3. Trace the four invariants.
   - Ownership: where content, state, configuration, and submission truth live.
   - Feedback: how users observe loading, empty, success, validation, and failure states.
   - Failure radius: what can regress, leak, become stale, or affect adjacent surfaces.
   - Timing: build, hydration, navigation, submission, retry, cancellation, and cleanup order.
4. Implement a minimal vertical slice.
   - Add or update tests in the same change.
   - Prefer cohesive, typed, project-native code.
   - Cover relevant accessibility, responsive, reduced-motion, error, and fallback behavior.
5. Verify narrowly, then broadly.
   - Run the smallest relevant test first.
   - Run every applicable formatting, lint, type, test, coverage, build, browser, accessibility, and visual check supported by the repository.
   - Inspect user-visible changes at representative mobile and desktop sizes.
6. Audit.
   - Run $enterprise-ai-feature-audit after the implementation passes its checks.
   - Reproduce findings, fix authorized P0-P2 findings, add regression evidence, and rerun affected checks.
7. Report honestly.
   - Lead with the outcome.
   - List verification performed and anything not verified.
   - Never report an unrun or failing check as passing.

## Architecture defaults

Once the application is scaffolded:

- Use pnpm as the package manager and commit its lockfile.
- Use Astro as the static-first page and content framework.
- Use strict TypeScript.
- Use Tailwind for styling within an approved token and component system.
- Keep pages and non-interactive sections in Astro.
- Use React only for narrowly bounded interactions that require client state or lifecycle.
- Choose the narrowest Astro client directive that meets the interaction.
- Keep reusable logic framework-independent.
- Keep secrets and server-only configuration out of browser output.
- Treat forms, analytics, content sources, media, and third-party embeds as explicit boundaries with typed adapters and failure behavior.

Do not add a runtime dependency when a small project-owned implementation is clearer. Do not introduce a state library, animation system, WebGL dependency, CMS, analytics provider, form backend, or deployment integration without an accepted need and an intake review where applicable.

## Coding standards

- Prefer simple, explicit data flow and small cohesive modules.
- Use precise domain names; do not hide behavior behind vague helpers.
- Avoid shared mutable state, speculative abstractions, and premature generalization.
- Validate external data at its boundary.
- Model states so invalid combinations are difficult to represent.
- Handle errors intentionally; do not swallow them or expose internal detail to users.
- Clean up requests, observers, timers, subscriptions, listeners, and temporary state.
- Use comments for constraints and reasoning, not narration.
- Remove dead code and obsolete branches within the authorized scope.
- Never weaken types, tests, lint rules, security controls, or accessibility checks to make a change pass.
- Do not perform destructive Git operations, initialize remotes, deploy, or publish without explicit authorization.

## Testing contract

Every new or changed behavior requires evidence at the lowest meaningful layer:

- Unit tests for pure logic, validation, mapping, and content transformation
- Component tests for interactive islands and accessible UI behavior
- Integration tests for forms, consent, analytics, content adapters, and other boundaries
- Isolated Playwright tests for critical navigation, demo conversion, and cross-boundary journeys
- Accessibility, responsive, and visual-regression evidence for presentation-only changes

Assert user-visible output, semantic roles, accessible names, state changes, and external effects. Do not couple tests to private functions, CSS classes, framework internals, arbitrary delays, or incidental DOM structure.

Keep tests deterministic. Control time, randomness, locale, viewport, and network responses when relevant. Use synthetic fixtures with no personal, customer, confidential, or production data. Snapshots may support review but must not be the only behavioral proof.

Once application coverage exists, enforce minimum global coverage of:

- 90 percent statements
- 90 percent lines
- 90 percent functions
- 85 percent branches

Coverage is a floor, not a goal. Do not add meaningless assertions or unjustified exclusions to improve the number. Any automation exception must be narrow, documented, and paired with proportionate manual evidence.

The future package manifest must expose stable scripts for formatting checks, linting, strict type checking, unit and component tests, coverage, end-to-end tests, and production builds.

## Accessibility, performance, and resilience

- Target WCAG 2.2 AA.
- Use semantic HTML before ARIA.
- Preserve keyboard and pointer parity, visible focus, logical reading order, useful error association, and status announcements.
- Test contrast, zoom, reflow, touch targets, meaningful alternative text, and reduced motion.
- Make animation optional and non-essential to comprehension or conversion.
- Lazy-load non-critical interaction, media, and third-party code.
- Measure the JavaScript, CSS, font, media, hydration, network, and main-thread impact of additions.
- Reserve media dimensions and protect layout stability.
- Require mobile and reduced-capability fallbacks for heavy effects.
- Treat WebGL as opt-in, measured, lazy-loaded enhancement with a non-WebGL fallback.
- Provide understandable behavior when JavaScript, external services, media, or optional enhancements fail.

## Third-party component policy

Complete $enterprise-ai-component-intake before external UI code enters the repository.

Require an explicit OSI-approved license for the exact source, record its canonical URL and version or commit, preserve required notices, inspect its dependencies and network behavior, and verify accessibility, security, performance, static-build compatibility, maintenance cost, and brand fit.

Source-specific defaults:

- Treat each 21st.dev entry as a per-author candidate whose original license must be verified.
- Exclude Aceternity Pro and other custom-license assets under the open-source-only policy.
- Admit only exact ThreeUI community source covered by a verified MIT license.

Do not scrape marketplaces, bypass access controls, infer permission from public visibility, or redistribute paid or marketplace collections. Reject ambiguous ownership or licensing.

## Claims, content, privacy, and confidentiality

Use $enterprise-ai-claims-and-content for any statement that could influence an enterprise buying decision.

Public factual claims must come from the future approved claims registry. Each record must provide:

- Stable claim identifier and exact approved statement
- Claim category and authoritative evidence
- Verification date, approval status, accountable approver, and approval date
- Allowed pages, channels, regions, and metadata surfaces
- Required attribution, qualifiers, and trademark treatment
- Expiry date or revalidation event
- Non-public application notes when needed

Publish only approved, current records. Preserve material qualifiers, populations, samples, dates, regions, methodologies, and attribution.

Require explicit surface-specific approval for:

- Customer names, logos, quotations, and identifiable outcomes
- Adoption, savings, ROI, benchmark, or performance figures
- Product capability and availability statements
- Security, data handling, privacy, compliance, and certification statements
- Competitive comparisons and legal language

Apply these rules to visible copy, metadata, structured data, URLs, image text, alternative text, social cards, analytics labels, and generated content.

Never commit or expose secrets, credentials, personal data, production data, private customer information, confidential source documents, unreleased commercial details, or internal approval discussions. Use synthetic examples and redacted evidence. If approval is missing, keep the statement out of production-consumed content and request it.

## Audit and severity contract

Classify findings consistently:

- P0: active exposure, compromise, legal breach, destructive behavior, or site-wide outage
- P1: critical conversion failure, materially false claim, serious accessibility blocker, or major regression without a safe workaround
- P2: significant real-user, failure-state, trust, performance, responsive, or maintainability defect
- P3: limited-impact defect or polish issue with a safe workaround

Every finding must include severity, affected surface, user impact, preconditions, reproduction, expected and actual behavior, evidence, supported cause, correction, regression verification, and status.

Do not declare feature completion or release readiness with an unresolved P0-P2. A P3 may be deferred only with its impact, owner, and follow-up recorded.

The release audit must issue exactly one decision:

- READY
- READY WITH DOCUMENTED P3 FOLLOW-UPS
- BLOCKED

Any unverified critical conversion, claims, security, privacy, compliance, or deployment surface blocks release.

## Governance validation

Run these checks whenever AGENTS.md, a skill, its metadata, its references, the validator, or governance CI changes:

1. python3 tools/check_agent_skills.py
2. python3 -m unittest discover -s tests -p "test_agent_skills.py" -v

The GitHub workflow must run the same checks. Keep governance validation dependent only on the Python standard library.

## Definition of done

A change is done only when:

- Its behavior and acceptance criteria are satisfied.
- Applicable automated tests pass and required manual evidence is recorded.
- Types, lint, formatting, coverage, production build, and end-to-end checks pass when applicable.
- Accessibility, responsive, reduced-motion, failure, and fallback behavior are verified.
- External components and dependencies have passed intake.
- Public claims and assets have current approval.
- The feature audit has no unresolved P0-P2.
- Documentation and contracts changed with the behavior.
- The final report states what was verified and what remains unverified.

A release additionally requires a passing $enterprise-ai-release-audit.
