# Package Integration TODO (for the package.json owner)

This file is owned by the harness/workflow lane. `package.json` is owned by another
worker, so the harness lane does not edit it directly. The items below report the
exact scripts and dependencies the harness needs so the package owner can wire them in.

## Scripts already present (verified)

- `check:attribution` -> `node scripts/check-attribution.mjs`
- `check:features`    -> `node scripts/validate-feature-list.mjs`
- `check:agents`      -> `node scripts/check-agents-map.mjs`
- `prepare`          -> `husky`
- `release-please`   -> release-pr with the harness config + manifest

## Scripts to ADD (no current package.json entry)

```json
{
  "check:owned-paths": "node scripts/verify-owned-paths.mjs",
  "quality:harness": "SKIP_PACKAGE_CHECKS=1 node scripts/quality-gate.mjs",
  "quality:gate": "node scripts/quality-gate.mjs",
  "issue:sync:dry-run": "node scripts/sync-github-issues.mjs --dry-run",
  "issue:sync:write": "node scripts/sync-github-issues.mjs --write",
  "hooks:install": "node scripts/install-husky-hooks.mjs"
}
```

## Dependencies

- `husky` (devDependency) — present (`^9.1.7`). The hook installer now writes the
  husky v9.1+ format (no shebang, no `husky.sh` sourcing line) so it stays
  compatible through husky v10.
- `release-please` (devDependency) — present.
- `@eslint/js` (devDependency) — present; required by `eslint.config.js`.

## Husky hook wiring

Run once after dependencies are installed:

```sh
node scripts/install-husky-hooks.mjs
```

It generates `.husky/pre-commit` containing `npx lint-staged` (a `lint-staged`
config already exists in package.json) followed by the harness checks. It is
idempotent and will not overwrite an existing hook.
