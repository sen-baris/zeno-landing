---
name: enterprise-ai-testing
description: Design and implement proportionate, behavior-based automated tests for the enterprise AI website. Use whenever adding or changing logic, content transformations, interactive components, forms, integrations, navigation, analytics, consent, accessibility behavior, responsive behavior, or a regression fix.
---

# Enterprise AI Testing

Prove user-observable behavior at the lowest reliable layer. Do not create tests merely to exercise implementation details.

## Build the test matrix first

1. Describe the changed behavior, its user, and its observable outcome.
2. List success, failure, empty, loading, boundary, permission, timing, and cleanup scenarios that apply.
3. Identify the smallest test layer that can prove each scenario:
   - Unit for pure logic, validators, mappers, and content transformations.
   - Component for interactive islands and accessible UI contracts.
   - Integration for forms, consent, analytics, content loading, and external adapters.
   - End-to-end for critical navigation, demo conversion, and cross-boundary journeys.
   - Accessibility, responsive, and visual evidence for presentation changes.
4. Avoid duplicate coverage unless a high-risk contract warrants defense at multiple layers.

## Write resilient tests

- Assert visible output, semantic roles, accessible names, state changes, and external effects.
- Prefer Testing Library semantic queries and Playwright role- or label-based locators.
- Do not test private functions, CSS class names, framework internals, arbitrary timeouts, or DOM shape without a public contract.
- Keep tests isolated and deterministic. Control clocks, randomness, network responses, locale, and viewport when they affect results.
- Prove a regression test fails against the broken behavior when practical.
- Test unhappy paths deliberately; a mocked success response is not sufficient for a boundary.
- Use snapshots only as reviewable supporting evidence, never as the sole behavioral assertion.
- Never place secrets, customer data, or proprietary content in fixtures or recorded traces.

## Enforce coverage without gaming it

- Require tests in the same change as new or changed behavior.
- Once application coverage is configured, enforce at least 90 percent for statements, lines, and functions and 85 percent for branches.
- Treat coverage as a floor. Do not add meaningless assertions or exclude code simply to improve the number.
- Record a narrow, reasoned exception when code cannot be automated; add proportionate manual verification.

## Verify

Run the narrow test first, then the relevant suite. Run type checking, linting, build checks, accessibility checks, and end-to-end tests when the changed surface requires them. Report commands, results, and anything not verified.

Read [references/test-matrix.md](references/test-matrix.md) when choosing layers or defining acceptance scenarios.
