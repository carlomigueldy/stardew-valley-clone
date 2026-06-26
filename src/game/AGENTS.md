# Game Runtime Agent Guide

## File map

- `assets/createPixelArtTextures.ts` creates deterministic Phaser canvas textures for local runtime art.
- `config.ts` builds the Phaser 4 game configuration consumed by React.
- `constants.ts` holds shared viewport/game constants.
- `scenes/FarmScene.ts` owns the current playable farm scene, input, rendering, and snapshot dispatch.
- `systems/farming.ts` contains crop lifecycle and market economy logic.
- `systems/inventory.ts` contains inventory/resource state helpers.
- `systems/quest.ts` contains Rowan quest progression and rewards.
- `systems/time.ts` contains deterministic time, day, season, and weather helpers.
- `types/snapshot.ts` defines the scene-to-React HUD payload.

## Rules

- Prefer deterministic systems so gameplay can be unit-tested.
- Keep Phaser-specific side effects in scenes/assets/config; keep rules in `systems/`.
- When adding a system rule, add or update a colocated `*.test.ts` file.
- Avoid copyrighted lookalike art; runtime textures must stay local and original.
