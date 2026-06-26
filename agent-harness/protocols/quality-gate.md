# Quality Gate Protocol

The local quality gate is intentionally dependency-light so it can run before the app shell exists.

## Required checks

```sh
node scripts/validate-feature-list.mjs
node scripts/check-attribution.mjs
node scripts/verify-owned-paths.mjs
```

## Aggregate command

```sh
node scripts/quality-gate.mjs
```

The aggregate command also runs package scripts when `package.json` exists and exposes `lint`, `test`, or `build`. For harness-only checks before dependencies are installed, run `SKIP_PACKAGE_CHECKS=1 node scripts/quality-gate.mjs`.

## Pull request expectation

Paste the commands run and the result in the pull request checklist. If a package script is absent, mark it as skipped with the reason.
