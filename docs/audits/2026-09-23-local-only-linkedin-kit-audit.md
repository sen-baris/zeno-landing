# Local-only LinkedIn kit correction

## Scope and acceptance

- Date: 2026-09-23. Base: `20cb7f18aedc0a01bbb195820f0a022b15eb2342`.
- Remove the LinkedIn kit from the current GitHub branch while preserving every local source,
  export, license, and review file. Keep website Resources and German label changes intact.
- Scope: Git ignore rules, package export command, kit-dependent tests, marketing skill, and
  maintainer guidance. No website source, public asset, dependency, route, or deployment gate changes.
- This corrective commit does not rewrite history. The original commit remains retrievable.

## Four invariants

| Invariant      | Review                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Ownership      | All 23 kit files remain local. Git tracks the website and reusable guidance, not this kit.                          |
| Feedback       | The local README gives the direct export command; fresh clones do not advertise a missing package script.           |
| Failure radius | Tests must not import an ignored manifest. Resource approvals and links stay unchanged.                             |
| Timing         | Untrack with `git rm --cached`, verify preservation, test a tracked-file snapshot, then push the corrective commit. |

## Verification

- `git rm -r --cached -- marketing/linkedin` removed index entries only. All 23 files still exist.
  Compared each local file against the base commit: all 22 non-README files are byte-identical.
  The local README alone changed to document local-only ownership and the direct export command.
- `git ls-files marketing/linkedin` returns no paths. `git check-ignore` confirms that the kit's
  source and exports match the precise `/marketing/linkedin/` ignore rule.
- Replaced the tracked test's manifest import with direct approval-boundary assertions. Removed
  its local-asset dimension test; local exporter dimension, size, font, and copy guards remain intact.
- Created `/tmp/zeno-local-kit-check.6bbJ3I` using `git checkout-index` after staging the correction.
  It contains no kit. Only installed `node_modules` were linked from the working repository.
- In that snapshot, `pnpm exec vitest run tests/unit/marketing-resources.test.ts` passed 3 tests.
- In that snapshot, `pnpm check` passed formatting, ESLint, strict Astro/TypeScript, all 148 tests,
  the 36-page preview build, and every client budget. Coverage: 94.23% statements, 95.68% lines,
  94.52% functions, and 88.3% branches.
- `pnpm check:governance` passed 9 skills and 18 Python tests after updating the skill boundary.
- `git diff --cached --check` passed. The staged diff for `src`, `public`, deployment workflows,
  the lockfile, and browser configuration is empty.

Environment: macOS, Node 24.19.0, pnpm 10.32.1, existing locked dependencies.

## Audit findings and limitations

The main failure risk was leaving a tracked test and package command dependent on ignored files.
Both dependencies were removed before the clean-snapshot run. The full snapshot check establishes
that the website does not require the local kit. No unresolved P0-P2 or deferred P3 was found.

No browser or visual rerun was needed: all website source, assets, and browser tests are unchanged
from the 539-test cross-browser run at the base revision, documented in
[the prior audit](2026-09-23-german-link-labels-audit.md). That is reused evidence, not a new run.
No PNG was regenerated, no LinkedIn upload occurred, and production release gates remain intact.
The local files are preserved, not backed up to another service. Git history is not purged.

## Decision

PASS for the scoped repository correction. This does not approve a production release.
