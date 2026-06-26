# Issue Sync Checklist

- [ ] `feature_list.json` has unique epic and sub-issue ids.
- [ ] Each epic has a `github_issue` object.
- [ ] Each sub-issue has a `github_issue` object.
- [ ] Dry-run output from `node scripts/sync-github-issues.mjs --dry-run` was reviewed.
- [ ] Write mode was run only after confirming the target repository.
- [ ] Created issue numbers and URLs were written back to `feature_list.json`.
