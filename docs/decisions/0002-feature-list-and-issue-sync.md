---
id: ADR-0002
title: Keep feature planning in a machine-readable feature list
status: accepted
date: 2026-06-26
owners:
  - workflow
  - product
---

# ADR-0002: Keep feature planning in a machine-readable feature list

## Context

The project needs epics, sub-issues, dependencies, acceptance criteria, and GitHub issue placeholders that scripts can validate and sync.

## Decision

Use `feature_list.json` as the source of truth for feature planning metadata. Each epic and sub-issue includes a stable id, status, labels, acceptance criteria, and a `github_issue` placeholder.

## Consequences

- Contributors can discover scope without relying on issue tracker state alone.
- Issue sync can be automated from repository data.
- Changes to feature scope should update both code-facing acceptance criteria and issue placeholders when relevant.

## Validation

`node scripts/validate-feature-list.mjs` verifies required fields, ids, status values, dependencies, and placeholder shape.
