# Third-Party Component Intake

## Required record

- Component and intended user value
- Canonical source URL
- Author or publisher
- Exact package version, registry revision, or commit
- Retrieval date
- License identifier and canonical license URL
- Files or exports adopted
- Runtime and development dependencies
- Required notices or attribution
- Security and network behavior
- Accessibility findings
- Client-size and runtime impact
- Browser, device, SSR, and static-build compatibility
- Styling and token adaptation
- Maintenance owner
- Decision: accept, accept with changes, or reject
- Verification commands and results

## Fail-closed license rules

- Require an explicit OSI-approved license for the exact source being used.
- A visible demo, copy button, package publication, or public repository is not by itself permission.
- Stop when the page, package, and repository disagree about ownership or terms.
- Do not adopt code whose license cannot be verified.
- Keep notices required by the license.
- Do not redistribute marketplace collections or paid source.

## Source-specific boundaries

- 21st.dev: treat each entry as a per-author candidate. Verify its original repository and license; do not infer one platform-wide license.
- Aceternity: exclude Pro and custom-license assets under the open-source-only policy. Admit only exact source with a separately verified OSI-approved license.
- ThreeUI: admit only exact community source covered by a verified MIT license. Do not infer that community licensing covers paid or separately distributed material.

## Engineering review

- Read every adopted file and relevant transitive runtime dependency.
- Reject unsafe rendering, hidden tracking, unexpected calls, dynamic execution, or secret access.
- Test semantic structure, keyboard, focus, contrast, reduced motion, zoom, and touch.
- Measure JavaScript, CSS, fonts, media, WebGL, hydration, and main-thread work.
- Require useful behavior when scripts, animation, WebGL, or the network fail.
- Prefer a small project-owned adaptation over a large ongoing dependency.
- Add regression coverage before merging.
