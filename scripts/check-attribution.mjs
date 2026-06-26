#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skippedDirs = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.vercel']);
const self = path.normalize('scripts/check-attribution.mjs');
const patterns = [
  /co-authored-by:\s*.*(?:bot|assistant|codex|claude|gpt|openai|ai|llm)/i,
  /(?:generated|created|written|authored)\s+by\s+(?:an?\s+)?(?:ai|llm|assistant|codex|claude|gpt|openai)/i,
  /(?:ai|llm)\s+generated/i
];
const findings = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skippedDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(root, fullPath);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && relative !== self && isTextFile(entry.name)) {
      scanFile(fullPath, relative);
    }
  }
}

function isTextFile(name) {
  return /\.(cjs|css|html|js|json|jsx|md|mjs|ts|tsx|txt|yml|yaml)$/.test(name) || name === 'AGENTS.md';
}

function scanFile(fullPath, relative) {
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        findings.push(`${relative}:${index + 1}`);
        break;
      }
    }
  });
}

walk(root);

if (findings.length > 0) {
  console.error('Forbidden attribution text found:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log('Attribution check passed.');
