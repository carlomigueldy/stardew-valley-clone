import type { InventoryState } from '../systems/inventory';
import type { QuestState } from '../systems/quest';
import type { Season, TimeState, Weather } from '../systems/time';

export interface FarmSnapshot {
  inventory: InventoryState;
  time: TimeState;
  season: Season;
  weather: Weather;
  quest: QuestState;
  selectedTool: string;
  selectedSeed: string;
  prompt: string;
  controlsHint: string;
}
