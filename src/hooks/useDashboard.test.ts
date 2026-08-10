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
});
