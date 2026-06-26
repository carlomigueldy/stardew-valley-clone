#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = [
  ['node', ['scripts/validate-feature-list.mjs']],
  ['node', ['scripts/check-agents-map.mjs']],
  ['node', ['scripts/check-attribution.mjs']],
  ['node', ['scripts/verify-owned-paths.mjs']]
];

let failed = false;
for (const [command, args] of required) {
  if (!run(command, args)) failed = true;
}

if (process.env.SKIP_PACKAGE_CHECKS === '1') {
  console.log('Skipping package checks: SKIP_PACKAGE_CHECKS=1.');
} else if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = pkg.scripts || {};
  for (const name of ['lint', 'test', 'build']) {
    if (scripts[name]) {
      if (!run('npm', ['run', name, ...(name === 'test' ? ['--', '--run'] : [])])) failed = true;
    } else {
      console.log(`Skipping npm run ${name}: script is not defined.`);
    }
  }
} else {
  console.log('Skipping package checks: package.json is not present.');
}

if (failed) process.exit(1);
console.log('Quality gate passed.');

function run(command, args) {
  console.log(`\n$ ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    console.error(`Command failed: ${[command, ...args].join(' ')}`);
    return false;
  }
  return true;
}
