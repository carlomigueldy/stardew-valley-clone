# Repository Agent Guide

This repository is a React, Vite, and Phaser game project. Work in small, coordinated changes and keep handoffs readable for other contributors.

## Coordination rules

- Check `agent-harness/agent-map.json` before changing files outside your lane.
- Do not revert or overwrite work you did not create.
- Prefer additive changes when another contributor may be editing nearby files.
- Record decisions that affect delivery, file ownership, workflows, or product scope in `docs/decisions/`.
- Keep `feature_list.json` machine readable and update issue placeholders after issue sync.

## Ownership map

- Harness and workflow: `agent-harness/`, `docs/decisions/`, `.github/`, `scripts/`, `feature_list.json`, release and deployment config.
- Application implementation: `src/` and runtime game code.
- Visual assets: `public/assets/` and generated art sources.
- Package manager metadata: coordinate before editing `package.json` or lockfiles.

## Attribution and commits

- Use conventional commits when committing changes.
- Use the authenticated GitHub account as the author.
- Do not add tool, assistant, or generator attribution to commit messages, trailers, comments, or pull request text.
