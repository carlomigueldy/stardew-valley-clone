# Moonberry Farmstead

A cozy farming RPG vertical slice built with React, Vite, TypeScript, and Phaser 4. The project is structured for public GitHub development, Vercel deployment, and multi-agent implementation workflows.

## First playable slice

The current build includes:

- Top-down farm exploration with WASD/arrow-key movement.
- A Phaser 4 game mounted and cleaned up by React.
- Farm plots with a complete loop: till, plant, water, grow, harvest.
- Deterministic time, day transitions, weather, and seasons.
- Inventory, seed selection, crop stacks, water refills, and coins.
- Rowan's first-harvest quest and reward interaction.
- Local pixel-art-style terrain, character, crop, weather, UI, and SVG support assets.

## Controls

| Action | Input |
| --- | --- |
| Move | WASD or arrow keys |
| Select tools | 1 Hoe, 2 Seeds, 3 Watering Can, 4 Harvest Basket, 5 Inspect |
| Change seed | Q |
| Use selected tool / talk | Space or Enter |

## Live deployment

Production is live on Vercel:

https://stardew-valley-clone-five.vercel.app

## Local development

```sh
npm install
npm run dev
```

Open the Vite URL shown in the terminal. The default local port is `5173`.

## Quality gates

```sh
npm run lint
npm run test
npm run build
npm run test:e2e
npm run quality:gate
```

The pre-commit hook runs staged linting, feature-list validation, agent-map validation, and attribution checks.

Install or refresh hooks with:

```sh
npm run hooks:install
```

## Agent harness

- `feature_list.json` is the machine-readable epic/sub-issue source of truth.
- `agent-harness/agent-map.json` maps file ownership lanes.
- Nested `AGENTS.md` files explain path-specific rules.
- Decision records live in `docs/decisions/`.
- GitHub issue sync is available via `npm run issue:sync:dry-run` and `npm run issue:sync:write` after a remote exists.

## Assets

Run:

```sh
npm run generate:assets
```

This recreates deterministic SVG support assets in `public/assets/pixel/`. Runtime pixel textures are generated locally in `src/game/assets/createPixelArtTextures.ts`.

## Release and deployment

- Production URL: https://stardew-valley-clone-five.vercel.app
- Vercel config is in `vercel.json` for Vite static output.
- Release Please config is in `release-please-config.json` and `.release-please-manifest.json`.
- GitHub Actions run quality, feature-list validation, PR hygiene, issue sync, and release automation.

Expected deployment path:

```sh
vercel link
vercel deploy
vercel deploy --prod
```

## Git workflow

Work starts from an epic branch such as `epic/foundation-vertical-slice`. Sub-issue branches merge into the epic branch after quality gates pass. The epic branch then opens a PR into `main`.
