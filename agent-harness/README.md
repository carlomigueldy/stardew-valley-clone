# Agent Harness

This harness gives parallel contributors a shared operating model for the Stardew-like vertical slice.

## Pieces

- `agent-map.json` maps work lanes to owned paths, review signals, and coordination rules.
- `schemas/` defines the machine-readable contracts used by validation scripts.
- `protocols/` documents how contributors work safely in parallel.
- `templates/` provides repeatable records for decisions and assignments.
- `checklists/` captures release, issue-sync, handoff, and pull request readiness checks.

## Daily workflow

1. Read `feature_list.json` and claim an issue-sized item.
2. Check `agent-map.json` for owned paths and collision risks.
3. Make the smallest useful change.
4. Run `node scripts/quality-gate.mjs` before opening a pull request.
5. Record durable decisions in `docs/decisions/`.
6. Keep issue placeholders current after syncing with GitHub.

## Status vocabulary

Use only `planned`, `ready`, `in-progress`, `blocked`, or `done` in `feature_list.json`.
