---
name: enterprise-ai-release-audit
description: Perform the final release-readiness audit for the enterprise AI website. Use before a production deployment, public launch, release candidate approval, or major merge to verify functionality, claims, accessibility, performance, SEO, forms, analytics consent, browser coverage, dependencies, secrets, and operational readiness across the whole release.
---

# Enterprise AI Release Audit

Evaluate the release as one public, trust-sensitive system. Do not substitute a collection of feature test results for an end-to-end release decision.

## Confirm prerequisites

1. Identify the exact release revision and environment.
2. Review included changes, approved exceptions, feature-audit results, and outstanding work.
3. Confirm no included feature has an unresolved P0-P2.
4. Establish the commands, URLs, devices, browsers, credentials, and external services that can be safely verified.

## Audit the release

- Run clean install, formatting check, lint, strict type check, unit/component/integration tests, coverage, production build, and end-to-end tests supported by the project.
- Exercise navigation, primary demo conversion, forms, validation, success/error/retry behavior, consent, analytics, and outbound links.
- Review WCAG 2.2 AA essentials across keyboard, focus, semantics, contrast, zoom, reduced motion, and responsive layouts.
- Review performance budgets, hydration, JavaScript, media, fonts, caching, and layout stability.
- Review titles, descriptions, canonical URLs, social metadata, structured data, sitemap, robots directives, and error pages.
- Reconcile public claims, customer assets, metrics, security language, and attribution against approved records.
- Review dependency provenance, licenses, vulnerabilities, third-party requests, secrets, unsafe rendering, and data exposure.
- Verify supported browsers and representative mobile and desktop viewports.
- Confirm monitoring, form ownership, rollback, and incident contacts when deployment configuration exists.

## Decide and report

Record evidence and findings using the standard severity contract. Block release for any unresolved P0-P2 or any unverified critical conversion, claims, security, privacy, or compliance surface. Label anything not tested and explain the resulting risk; absence of access is not a passing result.

Issue exactly one decision: READY, READY WITH DOCUMENTED P3 FOLLOW-UPS, or BLOCKED.

Read [references/release-readiness.md](references/release-readiness.md) before running or reporting the audit.
