export type CropId = 'turnip' | 'strawberry';

export interface InventoryState {
  seeds: Record<CropId, number>;
  crops: Record<CropId, number>;
  coins: number;
  water: number;
  wood: number;
}

export function createInventory(): InventoryState {
  return {
    seeds: { turnip: 8, strawberry: 2 },
    crops: { turnip: 0, strawberry: 0 },
    coins: 24,
    water: 12,
    wood: 5,
  };
}

export function cloneInventory(inventory: InventoryState): InventoryState {
  return {
    seeds: { ...inventory.seeds },
    crops: { ...inventory.crops },
    coins: inventory.coins,
    water: inventory.water,
    wood: inventory.wood,
  };
}

export function spendSeed(inventory: InventoryState, crop: CropId): InventoryState | null {
  if (inventory.seeds[crop] <= 0) return null;
  const next = cloneInventory(inventory);
  next.seeds[crop] -= 1;
  return next;
}

export function spendWater(inventory: InventoryState): InventoryState | null {
  if (inventory.water <= 0) return null;
  const next = cloneInventory(inventory);
  next.water -= 1;
  return next;
}

export function refillWater(inventory: InventoryState, amount = 12): InventoryState {
  return { ...cloneInventory(inventory), water: amount };
}

export function addCrop(inventory: InventoryState, crop: CropId, amount = 1): InventoryState {
  const next = cloneInventory(inventory);
  next.crops[crop] += amount;
  return next;
}

export function addCoins(inventory: InventoryState, amount: number): InventoryState {
  return { ...cloneInventory(inventory), coins: inventory.coins + amount };
}
