import type { CropId, InventoryState } from './inventory';
import { addCoins } from './inventory';

export interface QuestState {
  id: 'first-harvest';
  title: string;
  description: string;
  targetCrop: CropId;
  target: number;
  progress: number;
  completed: boolean;
  rewarded: boolean;
}

export function createQuest(): QuestState {
  return {
    id: 'first-harvest',
    title: 'First Harvest',
    description: 'Harvest 3 turnips for Rowan by the well.',
    targetCrop: 'turnip',
    target: 3,
    progress: 0,
    completed: false,
    rewarded: false,
  };
}

export function recordHarvest(quest: QuestState, crop: CropId): QuestState {
  if (quest.completed || crop !== quest.targetCrop) return quest;
  const progress = Math.min(quest.target, quest.progress + 1);
  return { ...quest, progress, completed: progress >= quest.target };
}

export function claimQuestReward(
  quest: QuestState,
  inventory: InventoryState,
): { quest: QuestState; inventory: InventoryState; message: string; claimed: boolean } {
  if (!quest.completed) return { quest, inventory, message: 'Rowan still needs a few more turnips.', claimed: false };
  if (quest.rewarded) return { quest, inventory, message: 'Rowan is already planning the next market day.', claimed: false };

  return {
    quest: { ...quest, rewarded: true },
    inventory: addCoins(inventory, 75),
    message: 'Rowan pays 75g and promises to spread the word about Amberfall Farm.',
    claimed: true,
  };
}
