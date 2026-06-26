#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const strict = process.argv.includes('--strict') || process.env.HARNESS_ONLY === '1';
const forbiddenForHarnessOnly = [/^src\//, /^public\/assets\//];
const warnings = [];
let status = '';

try {
  status = execFileSync('git', ['status', '--short'], { encoding: 'utf8' });
} catch {
  console.log('Owned path check skipped: git status is unavailable.');
  process.exit(0);
}

for (const line of status.split(/\r?\n/).filter(Boolean)) {
  const file = parseStatusPath(line);
  if (!file) continue;
  if (forbiddenForHarnessOnly.some((pattern) => pattern.test(file))) {
    warnings.push(file);
  }
}

if (warnings.length > 0) {
  const heading = strict
    ? 'Harness-only change includes paths outside the harness lane:'
    : 'Owned path notice: current checkout also includes app or asset paths:';
  console.error(heading);
  for (const file of warnings) console.error(`- ${file}`);
  if (strict) {
    console.error('Document the ownership handoff or run without --strict for whole-project pull requests.');
    process.exit(1);
  }
  console.error('Continuing because strict harness-only mode is not enabled.');
} else {
  console.log('Owned path check passed for harness lane.');
}

function parseStatusPath(line) {
  const raw = line.slice(3).trim();
  if (!raw) return null;
  const renameMarker = ' -> ';
  if (raw.includes(renameMarker)) return raw.split(renameMarker).at(-1);
  return raw.replace(/^"|"$/g, '');
}
