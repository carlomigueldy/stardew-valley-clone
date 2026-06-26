import { describe, expect, it } from 'vitest';
import { applyFarmAction, advancePlotDay, createPlot, sellAllCrops } from './farming';
import { addCrop, createInventory } from './inventory';

function growTurnip() {
  let plot = createPlot(4, 4);
  let inventory = createInventory();

  ({ plot, inventory } = applyFarmAction(plot, inventory, 'till'));
  ({ plot, inventory } = applyFarmAction(plot, inventory, 'plant', 'turnip'));
  ({ plot, inventory } = applyFarmAction(plot, inventory, 'water'));
  plot = advancePlotDay(plot, false);
  ({ plot, inventory } = applyFarmAction(plot, inventory, 'water'));
  plot = advancePlotDay(plot, false);

  return { plot, inventory };
}

describe('farming lifecycle', () => {
  it('tills, plants, waters, grows, and harvests a turnip', () => {
    let { plot, inventory } = growTurnip();

    expect(plot.stage).toBe('mature');
    expect(inventory.seeds.turnip).toBe(7);
    expect(inventory.water).toBe(10);

    const harvest = applyFarmAction(plot, inventory, 'harvest');
    plot = harvest.plot;
    inventory = harvest.inventory;

    expect(harvest.changed).toBe(true);
    expect(harvest.harvestedCrop).toBe('turnip');
    expect(plot.stage).toBe('tilled');
    expect(plot.crop).toBeNull();
    expect(inventory.crops.turnip).toBe(1);
  });

  it('does not spend seeds on untilled plots', () => {
    const plot = createPlot(2, 3);
    const inventory = createInventory();

    const result = applyFarmAction(plot, inventory, 'plant', 'strawberry');

    expect(result.changed).toBe(false);
    expect(result.inventory.seeds.strawberry).toBe(2);
    expect(result.plot.crop).toBeNull();
  });

  it('rainy days advance watered crops without spending water', () => {
    let plot = createPlot(1, 1);
    let inventory = createInventory();
    ({ plot, inventory } = applyFarmAction(plot, inventory, 'till'));
    ({ plot, inventory } = applyFarmAction(plot, inventory, 'plant', 'turnip'));

    plot = advancePlotDay(plot, true);
    plot = advancePlotDay(plot, true);

    expect(plot.stage).toBe('mature');
    expect(inventory.water).toBe(12);
  });
});

describe('market economy', () => {
  it('sells every harvested crop for the sum of sell prices and clears the basket', () => {
    let inventory = createInventory();
    inventory = addCrop(inventory, 'turnip', 3);
    inventory = addCrop(inventory, 'strawberry', 2);
    const startingCoins = inventory.coins;

    const sale = sellAllCrops(inventory);

    expect(sale.changed).toBe(true);
    expect(sale.soldCount).toBe(5);
    expect(sale.coinsEarned).toBe(3 * 18 + 2 * 32);
    expect(sale.inventory.coins).toBe(startingCoins + sale.coinsEarned);
    expect(sale.inventory.crops.turnip).toBe(0);
    expect(sale.inventory.crops.strawberry).toBe(0);
  });

  it('does nothing when the basket is empty', () => {
    const inventory = createInventory();

    const sale = sellAllCrops(inventory);

    expect(sale.changed).toBe(false);
    expect(sale.soldCount).toBe(0);
    expect(sale.coinsEarned).toBe(0);
    expect(sale.inventory.coins).toBe(inventory.coins);
  });
});
