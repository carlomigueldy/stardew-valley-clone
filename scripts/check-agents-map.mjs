#!/usr/bin/env node
import fs from 'node:fs';

const path = 'agent-harness/agent-map.json';
const errors = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(path, 'utf8'));
} catch (error) {
  console.error(`${path}: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(data.lanes) || data.lanes.length === 0) {
  errors.push('agent map must contain at least one lane.');
}

const laneIds = new Set();
for (const lane of data.lanes || []) {
  if (!lane.id) errors.push('lane missing id.');
  if (laneIds.has(lane.id)) errors.push(`duplicate lane id: ${lane.id}`);
  laneIds.add(lane.id);
  for (const key of ['owned_paths', 'avoid_paths', 'primary_checks', 'coordination_notes']) {
    if (!Array.isArray(lane[key])) errors.push(`${lane.id || 'lane'} ${key} must be an array.`);
  }
  if (Array.isArray(lane.owned_paths) && lane.owned_paths.length === 0) {
    errors.push(`${lane.id} must declare owned_paths.`);
  }
}

const policy = data.collision_policy;
if (!policy || typeof policy !== 'object') {
  errors.push('collision_policy is required.');
} else {
  for (const key of ['before_editing', 'if_conflict_detected']) {
    if (!Array.isArray(policy[key]) || policy[key].length === 0) {
      errors.push(`collision_policy.${key} must be a non-empty array.`);
    }
  }
}

if (errors.length > 0) {
  console.error('Agent map validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Agent map validation passed.');
