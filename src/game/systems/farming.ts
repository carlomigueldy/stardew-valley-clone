import type { CropId, InventoryState } from './inventory';
import { addCrop, cloneInventory, spendSeed, spendWater } from './inventory';

export type PlotStage = 'wild' | 'tilled' | 'seeded' | 'sprout' | 'mature';
export type FarmAction = 'till' | 'plant' | 'water' | 'harvest';

export interface CropDefinition {
  id: CropId;
  label: string;
  growDays: number;
  sellPrice: number;
  seedPrice: number;
}

export const CROP_DEFINITIONS: Record<CropId, CropDefinition> = {
  turnip: { id: 'turnip', label: 'Turnip', growDays: 2, sellPrice: 18, seedPrice: 6 },
  strawberry: { id: 'strawberry', label: 'Strawberry', growDays: 3, sellPrice: 32, seedPrice: 14 },
};

export interface PlotState {
  x: number;
  y: number;
  stage: PlotStage;
  crop: CropId | null;
  daysWatered: number;
  wateredToday: boolean;
}

export interface FarmActionResult {
  plot: PlotState;
  inventory: InventoryState;
  message: string;
  changed: boolean;
  harvestedCrop?: CropId;
}

export interface SellResult {
  inventory: InventoryState;
  coinsEarned: number;
  soldCount: number;
  changed: boolean;
  message: string;
}

export function sellAllCrops(inventory: InventoryState): SellResult {
  const crops = Object.keys(inventory.crops) as CropId[];
  let coinsEarned = 0;
  let soldCount = 0;

  for (const crop of crops) {
    const quantity = inventory.crops[crop];
    if (quantity > 0) {
      coinsEarned += quantity * CROP_DEFINITIONS[crop].sellPrice;
      soldCount += quantity;
    }
  }

  if (soldCount === 0) {
    return {
      inventory,
      coinsEarned: 0,
      soldCount: 0,
      changed: false,
      message: 'The market stall is open, but your basket is empty.',
    };
  }

  const next = cloneInventory(inventory);
  for (const crop of crops) next.crops[crop] = 0;
  next.coins += coinsEarned;

  return {
    inventory: next,
    coinsEarned,
    soldCount,
    changed: true,
    message: `Sold ${soldCount} crop${soldCount === 1 ? '' : 's'} at the market for ${coinsEarned}g.`,
  };
}

export function createPlot(x: number, y: number): PlotState {
  return { x, y, stage: 'wild', crop: null, daysWatered: 0, wateredToday: false };
}

export function tillPlot(plot: PlotState): PlotState {
  if (plot.stage !== 'wild') return plot;
  return { ...plot, stage: 'tilled' };
}

export function plantCrop(plot: PlotState, crop: CropId): PlotState | null {
  if (plot.stage !== 'tilled' || plot.crop) return null;
  return { ...plot, stage: 'seeded', crop, daysWatered: 0, wateredToday: false };
}

export function waterPlot(plot: PlotState): PlotState {
  if (!plot.crop || plot.stage === 'mature' || plot.wateredToday) return plot;
  return { ...plot, wateredToday: true };
}

export function advancePlotDay(plot: PlotState, wasRainy: boolean): PlotState {
  if (!plot.crop) return { ...plot, wateredToday: false };

  const watered = plot.wateredToday || wasRainy;
  const daysWatered = watered ? plot.daysWatered + 1 : plot.daysWatered;
  const growDays = CROP_DEFINITIONS[plot.crop].growDays;
  const stage: PlotStage =
    daysWatered >= growDays ? 'mature' : daysWatered >= Math.ceil(growDays / 2) ? 'sprout' : plot.stage;

  return { ...plot, daysWatered, wateredToday: false, stage };
}

export function harvestPlot(plot: PlotState): { plot: PlotState; crop: CropId } | null {
  if (!plot.crop || plot.stage !== 'mature') return null;
  const crop = plot.crop;
  return {
    crop,
    plot: { ...plot, stage: 'tilled', crop: null, daysWatered: 0, wateredToday: false },
  };
}

export function applyFarmAction(
  plot: PlotState,
  inventory: InventoryState,
  action: FarmAction,
  selectedCrop: CropId = 'turnip',
): FarmActionResult {
  if (action === 'till') {
    const nextPlot = tillPlot(plot);
    return nextPlot === plot
      ? { plot, inventory, changed: false, message: 'This soil is already prepared.' }
      : { plot: nextPlot, inventory, changed: true, message: 'The earth turns soft and ready.' };
  }

  if (action === 'plant') {
    const nextInventory = spendSeed(inventory, selectedCrop);
    if (!nextInventory) {
      return { plot, inventory, changed: false, message: `No ${CROP_DEFINITIONS[selectedCrop].label} seeds left.` };
    }
    const nextPlot = plantCrop(plot, selectedCrop);
    if (!nextPlot) return { plot, inventory, changed: false, message: 'Seeds need a tilled empty plot.' };
    return {
      plot: nextPlot,
      inventory: nextInventory,
      changed: true,
      message: `${CROP_DEFINITIONS[selectedCrop].label} seeds tucked into the soil.`,
    };
  }

  if (action === 'water') {
    if (!plot.crop) return { plot, inventory, changed: false, message: 'Plant seeds before watering this plot.' };
    if (plot.wateredToday) return { plot, inventory, changed: false, message: 'This crop is already watered.' };
    if (plot.stage === 'mature') return { plot, inventory, changed: false, message: 'This crop is ready to harvest.' };
    const nextInventory = spendWater(inventory);
    if (!nextInventory) return { plot, inventory, changed: false, message: 'The watering can is empty. It refills tomorrow.' };
    return {
      plot: waterPlot(plot),
      inventory: nextInventory,
      changed: true,
      message: 'Water beads on the young leaves.',
    };
  }

  const harvest = harvestPlot(plot);
  if (!harvest) return { plot, inventory, changed: false, message: 'Nothing ripe here yet.' };

  return {
    plot: harvest.plot,
    inventory: addCrop(inventory, harvest.crop),
    changed: true,
    harvestedCrop: harvest.crop,
    message: `${CROP_DEFINITIONS[harvest.crop].label} harvested!`,
  };
}
