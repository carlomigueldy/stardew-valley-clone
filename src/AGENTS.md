# Source Agent Guide

This directory owns the React shell and Phaser runtime code.

## File map

- `App.tsx` renders the outer product shell, instructions, and React HUD fed by game snapshots.
- `main.tsx` mounts the React app.
- `styles.css` contains global layout, HUD, and responsive presentation styles.
- `components/GameCanvas.tsx` creates and destroys the Phaser game instance.
- `game/` contains Phaser scenes, generated runtime textures, pure game systems, and shared types.
- `vite-env.d.ts` contains Vite type references.

## Rules

- Keep React responsible for page shell/HUD and Phaser responsible for live gameplay.
- Keep pure simulation logic in `game/systems/` with Vitest coverage.
- Do not change harness, workflow, or GitHub files from this lane unless coordinating across lanes.
- Run `npm run lint`, `npm run test`, and `npm run build` after runtime changes.
