import { describe, expect, it } from 'vitest';
import { createInventory } from './inventory';
import { claimQuestReward, createQuest, recordHarvest } from './quest';

describe('quest system', () => {
  it('tracks only the requested crop and pays once', () => {
    let quest = createQuest();
    let inventory = createInventory();

    quest = recordHarvest(quest, 'strawberry');
    expect(quest.progress).toBe(0);

    quest = recordHarvest(quest, 'turnip');
    quest = recordHarvest(quest, 'turnip');
    quest = recordHarvest(quest, 'turnip');

    expect(quest.completed).toBe(true);
    expect(quest.progress).toBe(3);

    const firstClaim = claimQuestReward(quest, inventory);
    quest = firstClaim.quest;
    inventory = firstClaim.inventory;

    expect(firstClaim.claimed).toBe(true);
    expect(inventory.coins).toBe(99);

    const secondClaim = claimQuestReward(quest, inventory);
    expect(secondClaim.claimed).toBe(false);
    expect(secondClaim.inventory.coins).toBe(99);
  });
});
