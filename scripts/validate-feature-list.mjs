#!/usr/bin/env node
import fs from 'node:fs';

const file = 'feature_list.json';
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`${path}: ${error.message}`);
    return null;
  }
}

const data = readJson(file);

if (data) {
  const statuses = new Set(data.status_values || []);
  const epicIds = new Set();
  const itemIds = new Set();

  if (!Array.isArray(data.epics) || data.epics.length === 0) {
    fail('feature_list.json must contain at least one epic.');
  }

  for (const epic of data.epics || []) {
    if (!/^EPIC-[A-Z0-9-]+$/.test(epic.id || '')) fail(`Invalid epic id: ${epic.id}`);
    if (epicIds.has(epic.id)) fail(`Duplicate epic id: ${epic.id}`);
    epicIds.add(epic.id);
    if (!statuses.has(epic.status)) fail(`${epic.id} has status outside status_values: ${epic.status}`);
    validateGithubIssue(`${epic.id}.github_issue`, epic.github_issue);
    if (!Array.isArray(epic.sub_issues) || epic.sub_issues.length === 0) fail(`${epic.id} must contain sub_issues.`);

    for (const item of epic.sub_issues || []) {
      if (!/^[A-Z]+-[0-9]{3}$/.test(item.id || '')) fail(`Invalid sub-issue id: ${item.id}`);
      if (itemIds.has(item.id)) fail(`Duplicate sub-issue id: ${item.id}`);
      itemIds.add(item.id);
      if (!statuses.has(item.status)) fail(`${item.id} has status outside status_values: ${item.status}`);
      validateGithubIssue(`${item.id}.github_issue`, item.github_issue);
      if (!Array.isArray(item.acceptance_criteria) || item.acceptance_criteria.length === 0) fail(`${item.id} needs acceptance criteria.`);
      if (!Array.isArray(item.paths_allowed) || item.paths_allowed.length === 0) fail(`${item.id} needs paths_allowed.`);
      for (const dependency of item.depends_on || []) {
        if (!itemIds.has(dependency) && !isDependencyDeclared(data, dependency)) {
          fail(`${item.id} depends on unknown id: ${dependency}`);
        }
      }
    }
  }
}

function validateGithubIssue(path, value) {
  if (!value || typeof value !== 'object') {
    fail(`${path} must be an object.`);
    return;
  }
  for (const key of ['number', 'url', 'state']) {
    if (!(key in value)) fail(`${path} missing ${key}.`);
  }
  if (!['placeholder', 'open', 'closed', 'transferred'].includes(value.state)) {
    fail(`${path}.state is invalid: ${value.state}`);
  }
  if (value.number !== null && (!Number.isInteger(value.number) || value.number < 1)) {
    fail(`${path}.number must be null or a positive integer.`);
  }
  if (value.url !== null && typeof value.url !== 'string') {
    fail(`${path}.url must be null or a string.`);
  }
}

function isDependencyDeclared(featureList, id) {
  if ((featureList.epics || []).some((epic) => epic.id === id)) return true;
  return (featureList.epics || []).some((epic) => (epic.sub_issues || []).some((item) => item.id === id));
}

if (errors.length > 0) {
  console.error('Feature list validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Feature list validation passed.');
