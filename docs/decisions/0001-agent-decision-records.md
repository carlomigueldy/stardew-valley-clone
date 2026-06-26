---
id: ADR-0001
title: Use decision records for coordination-sensitive choices
status: accepted
date: 2026-06-26
owners:
  - workflow
---

# ADR-0001: Use decision records for coordination-sensitive choices

## Context

Parallel contributors need a durable way to understand why workflow, ownership, and architecture choices were made.

## Decision

Use short decision records in `docs/decisions/` for choices that affect multiple contributors or future maintenance.

## Consequences

- Contributors can review important choices without reading every pull request.
- Small implementation details should stay near the code instead of becoming decision records.
- Superseded decisions must link to the replacement record.

## Validation

The pull request template asks whether a decision record is needed, and the docs area guide defines the expected format.
