import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from './useStore';

describe('useStore Zustand Store', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;

    // Clear the store state to start fresh
    useStore.setState({
      currentWater: 0,
      consumedCalories: 0,
      foodLogs: [],
    });
  });

  afterEach(async () => {
    if (db.isOpen()) {
      db.close();
    }
  });

  it('addFoodLog correctly inserts a record in IndexedDB and updates foodLogs and consumedCalories', async () => {
    const foodItem = {
      name: 'Egg Sandwich',
      calories: 350,
      mealType: 'Breakfast',
      date: '2026-08-04',
    };

    await useStore.getState().addFoodLog(foodItem);

    // Verify IndexedDB record
    const allLogs = await db.logs.toArray();
    expect(allLogs.length).toBe(1);
    expect(allLogs[0].name).toBe('Egg Sandwich');
    expect(allLogs[0].calories).toBe(350);
    expect(allLogs[0].mealType).toBe('Breakfast');
    expect(allLogs[0].date).toBe('2026-08-04');
    expect(allLogs[0].type).toBe('food');

    // Verify Zustand store state
    const state = useStore.getState();
    expect(state.foodLogs.length).toBe(1);
    expect(state.foodLogs[0].name).toBe('Egg Sandwich');
    expect(state.foodLogs[0].calories).toBe(350);
    expect(state.foodLogs[0].mealType).toBe('Breakfast');
    expect(state.consumedCalories).toBe(350);
  });

  it('addWaterLog correctly inserts a record in IndexedDB and updates currentWater', async () => {
    await useStore.getState().addWaterLog(500);

    // Verify IndexedDB record
    const allLogs = await db.logs.toArray();
    expect(allLogs.length).toBe(1);
    expect(allLogs[0].type).toBe('water');
    expect(allLogs[0].volume).toBe(500);

    // Verify Zustand store state
    const state = useStore.getState();
    expect(state.currentWater).toBe(500);
  });

  it('fetchTodaySummary correctly retrieves and processes records for a specific date', async () => {
    // Manually seed some data for a specific date
    await db.logs.add({
      date: '2026-08-05',
      type: 'food',
      synced: false,
      name: 'Salad',
      calories: 200,
      mealType: 'Lunch',
    });
    await db.logs.add({
      date: '2026-08-05',
      type: 'food',
      synced: false,
      name: 'Nuts',
      calories: 150,
      mealType: 'Snack',
    });
    await db.logs.add({
      date: '2026-08-05',
      type: 'water',
      synced: false,
      volume: 300,
    });
    // This log should be ignored because it is on a different date
    await db.logs.add({
      date: '2026-08-06',
      type: 'food',
      synced: false,
      name: 'Burger',
      calories: 600,
      mealType: 'Dinner',
    });

    await useStore.getState().fetchTodaySummary('2026-08-05');

    const state = useStore.getState();
    // It should have retrieved only the logs for 2026-08-05
    expect(state.foodLogs.length).toBe(2);
    expect(state.foodLogs.some(item => item.name === 'Salad')).toBe(true);
    expect(state.foodLogs.some(item => item.name === 'Nuts')).toBe(true);
    expect(state.foodLogs.some(item => item.name === 'Burger')).toBe(false);

    expect(state.consumedCalories).toBe(350);
    expect(state.currentWater).toBe(300);
  });
});
