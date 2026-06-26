#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const allowedEmails = new Set(['carlomigueldy@gmail.com', 'carlomigueldy@users.noreply.github.com']);
const forbidden = ['assistant', 'codex', 'claude', 'gpt', 'openai'];

const name = readGitConfig('user.name');
const email = readGitConfig('user.email');
const combined = `${name} ${email}`.toLowerCase();

if (!name || !email) {
  console.error('Git user.name and user.email must be configured before committing.');
  process.exit(1);
}

if (!allowedEmails.has(email)) {
  console.error(`Git user.email must be one of: ${[...allowedEmails].join(', ')}`);
  console.error(`Current user.email: ${email}`);
  process.exit(1);
}

for (const word of forbidden) {
  if (combined.includes(word)) {
    console.error('Git author identity contains a forbidden tool/provider term.');
    process.exit(1);
  }
}

console.log(`Git identity check passed for ${name} <${email}>.`);

function readGitConfig(key) {
  try {
    return execFileSync('git', ['config', '--get', key], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}
