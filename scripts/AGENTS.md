# Scripts Area Guide

Scripts in this directory support repository workflow and validation.

## Rules

- Prefer dependency-free Node scripts so checks run before package bootstrap.
- Keep scripts safe by default; issue sync must dry-run unless write mode is explicit.
- Do not modify package metadata from scripts unless the user runs an install helper intentionally.
- Keep output concise and actionable for CI logs.
