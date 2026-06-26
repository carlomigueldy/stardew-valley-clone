import { useEffect, useState } from 'react';
import GameCanvas from './components/GameCanvas';
import type { FarmSnapshot } from './game/types/snapshot';

const initialSnapshot: FarmSnapshot = {
  inventory: {
    seeds: { turnip: 8, strawberry: 2 },
    crops: { turnip: 0, strawberry: 0 },
    coins: 24,
    water: 12,
    wood: 5,
  },
  time: { day: 1, hour: 6, minute: 0, totalMinutes: 360 },
  season: 'Spring',
  weather: 'Sunny',
  quest: {
    id: 'first-harvest',
    title: 'First Harvest',
    description: 'Harvest 3 turnips for Rowan by the well.',
    targetCrop: 'turnip',
    target: 3,
    progress: 0,
    completed: false,
    rewarded: false,
  },
  selectedTool: 'Hoe',
  selectedSeed: 'Turnip',
  prompt: 'Wake up on Amberfall Farm.',
  controlsHint: 'Move WASD/Arrows • Tools 1-5 • Seed Q • Space/Enter to act',
};

function formatClock(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
}

export default function App() {
  const [snapshot, setSnapshot] = useState<FarmSnapshot>(initialSnapshot);

  useEffect(() => {
    const handleSnapshot = (event: CustomEvent<FarmSnapshot>) => {
      setSnapshot(event.detail);
    };

    window.addEventListener('farm-snapshot', handleSnapshot);
    return () => window.removeEventListener('farm-snapshot', handleSnapshot);
  }, []);

  const questPercent = Math.min(100, Math.round((snapshot.quest.progress / snapshot.quest.target) * 100));

  return (
    <main className="shell">
      <section className="hero-panel" aria-label="Game overview">
        <div>
          <p className="eyebrow">Amberfall Farm</p>
          <h1>Restore a little hillside farm before moonrise.</h1>
          <p className="lede">
            A first playable slice with farming, movement, weather, time pressure, a neighbor quest,
            and commit-ready pixel-art-style assets.
          </p>
        </div>
        <div className="day-card" aria-label="Current farm conditions">
          <span>Day {snapshot.time.day}</span>
          <strong>{formatClock(snapshot.time.totalMinutes)}</strong>
          <em>
            {snapshot.season} • {snapshot.weather}
          </em>
        </div>
      </section>

      <section className="play-layout">
        <GameCanvas />

        <aside className="hud-panel" aria-label="Farm status">
          <div className="hud-section">
            <h2>Satchel</h2>
            <dl className="inventory-grid">
              <div>
                <dt>Coins</dt>
                <dd>{snapshot.inventory.coins}g</dd>
              </div>
              <div>
                <dt>Water</dt>
                <dd>{snapshot.inventory.water}</dd>
              </div>
              <div>
                <dt>Wood</dt>
                <dd>{snapshot.inventory.wood}</dd>
              </div>
              <div>
                <dt>Turnips</dt>
                <dd>{snapshot.inventory.crops.turnip}</dd>
              </div>
              <div>
                <dt>Seeds</dt>
                <dd>
                  {snapshot.inventory.seeds.turnip} turnip • {snapshot.inventory.seeds.strawberry} berry
                </dd>
              </div>
              <div>
                <dt>Equipped</dt>
                <dd>{snapshot.selectedTool}</dd>
              </div>
            </dl>
          </div>

          <div className="hud-section quest-card">
            <div className="quest-heading">
              <span>Rowan's request</span>
              <strong>{snapshot.quest.completed ? 'Ready' : `${snapshot.quest.progress}/${snapshot.quest.target}`}</strong>
            </div>
            <h2>{snapshot.quest.title}</h2>
            <p>{snapshot.quest.description}</p>
            <div className="progress-track" aria-label={`Quest progress ${questPercent}%`}>
              <span style={{ width: `${questPercent}%` }} />
            </div>
          </div>

          <div className="hud-section prompt-card">
            <h2>Hint</h2>
            <p>{snapshot.prompt}</p>
            <small>{snapshot.controlsHint}</small>
          </div>
        </aside>
      </section>
    </main>
  );
}
