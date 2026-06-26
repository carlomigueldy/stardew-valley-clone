#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const huskyDir = '.husky';
const hookPath = path.join(huskyDir, 'pre-commit');

if (!fs.existsSync('package.json')) {
  console.error('package.json is required before installing Husky hooks.');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scripts = pkg.scripts || {};
const hasLintStaged = Boolean(pkg['lint-staged']) || Boolean((pkg.devDependencies || {})['lint-staged']);

fs.mkdirSync(huskyDir, { recursive: true });
if (fs.existsSync(hookPath)) {
  console.log(`${hookPath} already exists; leaving it unchanged.`);
  process.exit(0);
}

// Husky v9.1+ hook format: no shebang and no husky.sh sourcing line.
const lines = [];
if (hasLintStaged) {
  lines.push('npx lint-staged');
}
if (scripts['check:features']) {
  lines.push('npm run check:features');
} else {
  lines.push('node scripts/validate-feature-list.mjs');
}
if (scripts['check:agents']) {
  lines.push('npm run check:agents');
} else {
  lines.push('node scripts/check-agents-map.mjs');
}
if (scripts['check:attribution']) {
  lines.push('npm run check:attribution');
} else {
  lines.push('node scripts/check-attribution.mjs');
}

fs.writeFileSync(hookPath, `${lines.join('\n')}\n`);
fs.chmodSync(hookPath, 0o755);
console.log(`Created ${hookPath}.`);
