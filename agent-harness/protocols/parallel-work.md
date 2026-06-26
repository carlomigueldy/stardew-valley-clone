# Parallel Work Protocol

Use this protocol when more than one contributor is active.

## Before starting

1. Run `git status --short --branch`.
2. Read the closest `AGENTS.md` for the paths you plan to edit.
3. Check `feature_list.json` for dependencies and acceptance criteria.
4. State your intended paths in the handoff or pull request description.

## During work

- Keep changes scoped to your lane.
- Avoid whole-repo formatting unless it is the feature itself.
- Prefer new files over rewrites when a file may be owned by another contributor.
- If you need a package script or dependency, coordinate before editing package metadata.

## When blocked by overlap

- Stop before overwriting the other change.
- Capture the file path, owner if known, and needed decision.
- Add a short note to the pull request or handoff.

## Handoff

Use `agent-harness/checklists/handoff.md` for incomplete work and include exact validation output.
