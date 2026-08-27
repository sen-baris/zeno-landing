# Web Quality Checklist

Use the relevant sections; do not treat the checklist as a substitute for reasoning.

## Behavior and boundaries

- Name the user, goal, entry point, success outcome, and failure outcome.
- Identify the authoritative source for content, state, configuration, and submission status.
- Define ownership and cleanup for listeners, timers, observers, requests, and client state.
- Make loading, empty, success, error, retry, disabled, and duplicate-action behavior explicit.
- Handle slow, missing, malformed, stale, and unavailable external data.
- Preserve behavior through navigation, refresh, history, and hydration where applicable.

## Astro and client code

- Keep static markup in Astro.
- Hydrate only the smallest interactive boundary.
- Choose the narrowest client directive.
- Keep serializable props minimal and non-sensitive.
- Keep reusable domain logic outside framework components.
- Provide a functional no-JavaScript or failure fallback when practical.
- Avoid hydration for decoration alone.

## Accessibility

- Use landmarks, headings, links, buttons, labels, and form controls semantically.
- Preserve logical DOM, reading, tab, and focus order.
- Make keyboard behavior equivalent to pointer behavior.
- Provide visible focus and useful error association.
- Check accessible names and status announcements.
- Check contrast, zoom, reflow, touch targets, captions, and meaningful alternative text.
- Respect reduced motion and avoid motion-dependent meaning.

## Performance and resilience

- Measure new JavaScript, CSS, fonts, images, video, and third-party requests.
- Reserve media dimensions and avoid layout shifts.
- Lazy-load non-critical assets and interaction.
- Optimize images for rendered size and format.
- Keep animation off the critical path.
- Provide mobile and reduced-capability fallbacks for heavy effects.
- Avoid WebGL unless its value and fallback are approved.

## Security and privacy

- Keep secrets and server-only configuration out of client output.
- Validate and encode untrusted content at its boundary.
- Avoid unsafe HTML and dynamic code execution.
- Minimize third-party scripts and document their data behavior.
- Honor consent before optional analytics or marketing storage.
- Do not log personal, customer, or confidential content.

## Maintainability

- Prefer cohesive components with explicit inputs.
- Follow existing tokens and primitives.
- Avoid dependency additions for small behavior.
- Remove dead paths and obsolete flags within scope.
- Document only non-obvious constraints and decisions.
- Keep tests beside the behavior they protect.
