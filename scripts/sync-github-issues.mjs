#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const write = args.has('--write');
const dryRun = !write;
const featurePath = 'feature_list.json';
const data = JSON.parse(fs.readFileSync(featurePath, 'utf8'));
let repo = process.env.GITHUB_REPOSITORY || process.env.GH_REPO || inferRepo();

if (!repo && write) {
  console.error('Unable to determine repository. Set GH_REPO=owner/name or GITHUB_REPOSITORY=owner/name.');
  process.exit(1);
}

if (!repo) {
  repo = '<target-repository>';
  console.log('Repository not detected; dry run will use a placeholder target.');
}

const created = [];
const ensuredLabels = new Set();

for (const epic of data.epics) {
  const epicBody = [
    epic.description,
    '',
    '## Sub-issues',
    ...epic.sub_issues.map((item) => `- ${item.id}: ${item.title}`),
    '',
    `Source: ${epic.id} in feature_list.json`,
  ].join('\n');
  syncIssue(epic, `[${epic.id}] ${epic.title}`, labelsFor(epic, 'epic'), epicBody);

  for (const item of epic.sub_issues) {
    const body = [
      `Parent epic: ${epic.id}`,
      '',
      '## Acceptance criteria',
      ...item.acceptance_criteria.map((criterion) => `- [ ] ${criterion}`),
      '',
      `Dependencies: ${(item.depends_on || []).join(', ') || 'none'}`,
      `Allowed paths: ${(item.paths_allowed || []).join(', ')}`,
      '',
      `Source: ${item.id} in feature_list.json`,
    ].join('\n');
    syncIssue(item, `[${item.id}] ${item.title}`, labelsFor(item, item.type), body);
  }
}

if (write && created.length > 0) {
  fs.writeFileSync(featurePath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Updated ${featurePath} with ${created.length} issue placeholder value(s).`);
} else if (dryRun) {
  console.log('Dry run complete. Re-run with --write to create missing issues.');
}

function syncIssue(entry, title, labels, body) {
  if (entry.github_issue?.url) {
    console.log(`Exists: ${entry.id} -> ${entry.github_issue.url}`);
    return;
  }

  if (dryRun) {
    console.log(`Would create issue in ${repo}: ${title}`);
    console.log(`  labels: ${labels.join(', ')}`);
    return;
  }

  ensureLabels(labels);

  const result = spawnSync(
    'gh',
    [
      'issue',
      'create',
      '--repo',
      repo,
      '--title',
      title,
      '--body',
      body,
      ...labels.flatMap((label) => ['--label', label]),
    ],
    { encoding: 'utf8' },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  const url = result.stdout.trim();
  entry.github_issue = {
    number: Number(url.split('/').at(-1)) || null,
    url,
    state: 'open',
  };
  created.push(entry.id);
  console.log(`Created: ${entry.id} -> ${url}`);
}

function labelsFor(entry, fallback) {
  return [...new Set([...(entry.labels || []), fallback].filter(Boolean))];
}

function ensureLabels(labels) {
  for (const label of labels) {
    if (ensuredLabels.has(label)) continue;

    const existing = spawnSync('gh', ['label', 'list', '--repo', repo, '--search', label, '--json', 'name', '-q', '.[].name'], {
      encoding: 'utf8',
    });
    const names = existing.status === 0 ? existing.stdout.split(/\r?\n/).map((name) => name.trim()) : [];
    if (names.includes(label)) {
      ensuredLabels.add(label);
      continue;
    }

    const color = labelColor(label);
    const createdLabel = spawnSync(
      'gh',
      ['label', 'create', label, '--repo', repo, '--color', color, '--description', `Project label: ${label}`],
      { encoding: 'utf8' },
    );
    if (createdLabel.status !== 0 && !/already exists/i.test(createdLabel.stderr || createdLabel.stdout)) {
      console.error(createdLabel.stderr || createdLabel.stdout);
      process.exit(createdLabel.status ?? 1);
    }
    ensuredLabels.add(label);
  }
}

function labelColor(label) {
  if (label === 'epic') return '7f52ff';
  if (label === 'bug') return 'd73a4a';
  if (label === 'feature') return '0e8a16';
  if (label === 'task') return '1d76db';
  if (label === 'chore') return 'cfd3d7';
  if (label === 'foundation') return 'fbca04';
  if (label === 'gameplay') return '5319e7';
  if (label === 'farming') return '0e8a16';
  if (label === 'delivery') return '0052cc';
  return 'cfd3d7';
}

function inferRepo() {
  try {
    return execFileSync('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}
