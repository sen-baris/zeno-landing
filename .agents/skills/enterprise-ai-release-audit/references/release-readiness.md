# Release Readiness Matrix

## Build integrity

- Reproducible clean install with the repository package manager
- Formatting check, lint, strict type check, tests, coverage, and production build
- No uncommitted generated output required for deployment
- Environment variables documented and validated without exposing values

## User journeys

- Primary navigation and every demo CTA
- Form labels, validation, duplicate prevention, submit, success, failure, and retry
- Consent defaults and preference changes
- Analytics events and absence of optional tracking before consent
- External links, downloads, error pages, refresh, and history

## Trust and content

- Claims reconcile with approved current records
- Customer names, marks, quotations, and metrics have surface-specific approval
- Security, privacy, compliance, certification, and data claims have accountable approval
- No confidential material, personal data, secret, placeholder, or internal note is public
- Legal and policy links are correct for the new brand

## Accessibility and compatibility

- Keyboard, focus, landmarks, headings, names, status messages, contrast, zoom, and reflow
- Reduced motion and fallbacks for optional visual effects
- Representative narrow, medium, and wide viewports
- Supported Chromium, Firefox, and WebKit coverage
- Touch and mobile navigation behavior

## Performance and SEO

- JavaScript, CSS, fonts, images, video, third-party requests, and hydration reviewed
- No unexplained regression in loading, interaction, or layout stability
- Titles, descriptions, canonical URLs, social metadata, structured data, sitemap, and robots
- Correct production origin and no accidental noindex

## Security and operations

- Dependency provenance, licenses, vulnerability results, and lockfile integrity
- No unsafe HTML, dynamic code execution, secret leakage, or unapproved third-party request
- Security headers and caching behavior verified when hosting exists
- Form/CRM ownership, monitoring, alerting, rollback, and incident contact verified when configured

## Decision rules

- READY: all critical surfaces verified and no unresolved findings.
- READY WITH DOCUMENTED P3 FOLLOW-UPS: only owned P3 issues remain.
- BLOCKED: any P0-P2 remains or a critical conversion, claims, security, privacy, compliance, or deployment surface is unverified.
