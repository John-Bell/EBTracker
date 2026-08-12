import 'fake-indexeddb/auto';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettings } from './useSettings';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from '../store/useStore';

describe('useSettings Hook', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    if (db.isOpen()) db.close();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;
  });



  it('loads initial settings correctly', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
      expect(result.current.localWaterGoal).toBe('2500');
      expect(result.current.localEndpointUrl).toBe('');
    });
  });

  it('allows saving goals and provides goalsSaved status', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
    });

    act(() => {
      result.current.setLocalCalorieGoal('1800');
      result.current.setLocalWaterGoal('2200');
    });

    await act(async () => {
      await result.current.handleSaveGoals();
    });

    expect(result.current.goalsSaved).toBe(true);
    expect(useStore.getState().calorieGoal).toBe(1800);
    expect(useStore.getState().waterGoal).toBe(2200);

    const storedCalorieGoal = await db.settings.get('calorieGoal');
    expect(storedCalorieGoal?.value).toBe(1800);
  });

  it('allows saving server config and provides configSaved status', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localEndpointUrl).toBe('');
    });

    act(() => {
      result.current.setLocalEndpointUrl('https://api.example.com');
      result.current.setLocalHeaderName('X-Auth');
      result.current.setLocalHeaderKey('pass123');
    });

    await act(async () => {
      await result.current.handleSaveConfig();
    });

    expect(result.current.configSaved).toBe(true);
    expect(useStore.getState().endpointUrl).toBe('https://api.example.com');
    expect(useStore.getState().headerName).toBe('X-Auth');
    expect(useStore.getState().headerKey).toBe('pass123');
  });

  it('allows clearing local cache and resetting store when confirmed', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // First, populate some items in the database and store
    await db.logs.add({ date: '2023-10-10', type: 'food', synced: false, name: 'Apple', calories: 100 });
    await db.deletedRows.add({ id: 'some-id', tableName: 'logs', deletedAt: Date.now() });

    useStore.setState({
      currentWater: 500,
      consumedCalories: 800,
      foodLogs: [{ id: '123', name: 'Apple', calories: 100, mealType: 'Breakfast' }],
      syncStatus: 'connected',
      lastSynced: 1234567,
    });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
    });

    await act(async () => {
      await result.current.handleClearCache();
    });

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to clear all local data? This cannot be undone.');
    expect(alertSpy).toHaveBeenCalledWith('Local cache cleared successfully.');

    // Verify all DB tables cleared
    const logsCount = await db.logs.count();
    const deletedCount = await db.deletedRows.count();
    expect(logsCount).toBe(0);
    expect(deletedCount).toBe(0);

    // Verify store resets
    const store = useStore.getState();
    expect(store.currentWater).toBe(0);
    expect(store.consumedCalories).toBe(0);
    expect(store.foodLogs).toEqual([]);
    expect(store.syncStatus).toBe('disconnected');
    expect(store.lastSynced).toBe(0);

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('does not clear local cache when not confirmed', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await db.logs.add({ date: '2023-10-10', type: 'food', synced: false, name: 'Apple', calories: 100 });

    useStore.setState({
      currentWater: 500,
    });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
    });

    await act(async () => {
      await result.current.handleClearCache();
    });

    expect(confirmSpy).toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();

    const logsCount = await db.logs.count();
    expect(logsCount).toBe(1);
    expect(useStore.getState().currentWater).toBe(500);

    confirmSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('handles sync simulation', async () => {
    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
    });

    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    expect(result.current.syncState).toBe('idle');

    act(() => {
      result.current.handleSync();
    });

    expect(result.current.syncState).toBe('syncing');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.syncState).toBe('synced');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.syncState).toBe('idle');
  });
});
