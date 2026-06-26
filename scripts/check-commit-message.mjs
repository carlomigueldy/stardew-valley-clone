#!/usr/bin/env node
import fs from 'node:fs';

const messagePath = process.argv[2];
if (!messagePath) {
  console.error('Usage: node scripts/check-commit-message.mjs <commit-msg-file>');
  process.exit(1);
}

const message = fs.readFileSync(messagePath, 'utf8');
const forbidden = ['assistant', 'codex', 'claude', 'gpt', 'openai'];
const trailerPattern = /^co-authored-by:/i;

for (const line of message.split(/\r?\n/)) {
  const lower = line.toLowerCase();
  if (trailerPattern.test(lower) && forbidden.some((word) => lower.includes(word))) {
    console.error('Commit message contains a forbidden co-author trailer.');
    process.exit(1);
  }
}

if (/^(feat|fix|chore|docs|refactor|test|ci|build|perf|revert)(\(.+\))?!?: .+/m.test(message)) {
  console.log('Commit message check passed.');
} else {
  console.error('Commit message must use a conventional commit prefix.');
  process.exit(1);
}
