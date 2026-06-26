---
id: ADR-0003
title: Run dependency-light quality gates before pull requests
status: accepted
date: 2026-06-26
owners:
  - workflow
  - release
---

# ADR-0003: Run dependency-light quality gates before pull requests

## Context

The repository may be edited before the application package is fully bootstrapped. Contributors still need checks that can run in a new checkout.

## Decision

Provide Node-based scripts that validate feature planning, guard attribution text, verify harness path ownership, and run package scripts only when they exist. Use GitHub Actions for pull request checks and release-please for changelog pull requests.

## Consequences

- Harness checks run before dependencies are installed.
- App-specific lint, test, and build commands are automatically picked up once package metadata exists.
- Release automation depends on conventional commit titles and messages.

## Validation

`node scripts/quality-gate.mjs` is the aggregate local command and `.github/workflows/quality.yml` runs it in pull requests.
