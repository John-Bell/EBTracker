import 'fake-indexeddb/auto';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDashboard } from './useDashboard';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from '../store/useStore';

describe('useDashboard Hook', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;

    // Reset store state with default goals and dummy data
    useStore.setState({
      calorieGoal: 2000,
      waterGoal: 2500,
    });
    useStore.getState().loadDummyData();
  });

  afterEach(async () => {
    if (db.isOpen()) {
      db.close();
    }
  });

  it('provides dashboard data and triggers settings fetch', async () => {
    const { result } = renderHook(() => useDashboard());

    // Wait for initial fetchSettings to complete and update state
    await waitFor(() => {
      expect(result.current.calorieGoal).toBe(2000);
    });

    expect(result.current.waterGoal).toBe(2500);
    expect(result.current.currentWater).toBe(750);
    expect(result.current.consumedCalories).toBe(1450);

    // Calculated progress checks
    // water ratio: 750 / 2500 = 0.3. offset: 326.7 * 0.7 = 228.69 -> "228.7"
    expect(result.current.strokeDashoffset).toBe('228.7');
    // calories left: 2000 - 1450 = 550. percent: 1450 / 2000 = 72.5% -> "73"
    expect(result.current.caloriesLeft).toBe(550);
    expect(result.current.caloriePercent).toBe('73');

    // Update goals in store and see if hook returns updated calculations
    const state = useStore.getState();
    await act(async () => {
      await state.saveGoals(3000, 3000);
    });

    await waitFor(() => {
      expect(result.current.calorieGoal).toBe(3000);
      expect(result.current.waterGoal).toBe(3000);
      // water ratio: 750 / 3000 = 0.25. offset: 326.7 * 0.75 = 245.025 -> "245.0"
      expect(result.current.strokeDashoffset).toBe('245.0');
      // calories left: 3000 - 1450 = 1550. percent: 1450 / 3000 = 48.33% -> "48"
      expect(result.current.caloriesLeft).toBe(1550);
      expect(result.current.caloriePercent).toBe('48');
    });
  });

  it('allows logging water and updates state and database', async () => {
    const { result } = renderHook(() => useDashboard());

    // Initially, dummy data is used
    await waitFor(() => {
      expect(result.current.currentWater).toBe(750);
    });

    // Let's add 250ml water
    await act(async () => {
      await result.current.handleAddWater(250);
    });

    // Since we transition from dummy data, the new water is exactly 250
    await waitFor(() => {
      expect(result.current.currentWater).toBe(250);
    });

    // Check database
    const allLogs = await db.logs.toArray();
    expect(allLogs.length).toBe(1);
    expect(allLogs[0].type).toBe('water');
    expect(allLogs[0].volume).toBe(250);

    // Clear dummy food logs to simulate transition from dummy to active logging
    await act(async () => {
      useStore.setState({ foodLogs: [] });
    });

    // Add another 500ml water
    await act(async () => {
      await result.current.handleAddWater(500);
    });

    await waitFor(() => {
      expect(result.current.currentWater).toBe(750);
    });

    const updatedLogs = await db.logs.toArray();
    expect(updatedLogs.length).toBe(2);
    expect(updatedLogs.some(log => log.volume === 250)).toBe(true);
    expect(updatedLogs.some(log => log.volume === 500)).toBe(true);
  });

  it('fetches today summary and clears currentWater to 0 when DB logs count is 0', async () => {
    // Set stale water in store
    useStore.setState({ currentWater: 500, consumedCalories: 300, foodLogs: [] });

    // Ensure DB has no logs for today
    const logsCount = await db.logs.count();
    expect(logsCount).toBe(0);

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.currentWater).toBe(0);
      expect(result.current.consumedCalories).toBe(0);
    });
  });
});
