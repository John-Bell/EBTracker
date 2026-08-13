import 'fake-indexeddb/auto';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLogHistory } from './useLogHistory';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from '../store/useStore';
import { remoteSyncService } from '../db/syncService';

describe('useLogHistory Hook', () => {
  beforeEach(async () => {
    // Clear any pending sync timeout
    if (remoteSyncService._syncTimeout) {
      clearTimeout(remoteSyncService._syncTimeout);
      remoteSyncService._syncTimeout = null;
    }

    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    if (db.isOpen()) db.close();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;

    // Reset store state
    useStore.setState({
      foodLogs: [],
      consumedCalories: 0,
      currentWater: 0,
      syncStatus: 'disconnected',
    });
  });

  afterEach(async () => {
    // Clear any pending sync timeout
    if (remoteSyncService._syncTimeout) {
      clearTimeout(remoteSyncService._syncTimeout);
      remoteSyncService._syncTimeout = null;
    }
  });

  it('loads empty logs initially for today', async () => {
    const { result, unmount } = renderHook(() => useLogHistory());

    await waitFor(() => {
      expect(result.current.selectedDate).toBe(new Date().toISOString().split('T')[0]);
    });

    expect(result.current.waterLogs).toEqual([]);
    expect(result.current.mealLogs).toEqual([]);
    expect(result.current.days).toHaveLength(7);

    unmount();
  });

  it('loads water and food logs for a selected date', async () => {
    const date = '2024-08-14';

    // Insert dummy data directly in DB
    await db.logs.add({
      date,
      type: 'water',
      synced: false,
      volume: 250,
      updatedAt: Date.now(),
    });

    await db.logs.add({
      date,
      type: 'food',
      synced: false,
      name: 'Greek Yogurt',
      calories: 320,
      mealType: 'Breakfast',
      updatedAt: Date.now(),
    });

    const { result, unmount } = renderHook(() => useLogHistory());

    // Switch selected date to the target date
    act(() => {
      result.current.setSelectedDate(date);
    });

    await waitFor(() => {
      expect(result.current.waterLogs).toHaveLength(1);
      expect(result.current.mealLogs).toHaveLength(1);
    });

    expect(result.current.waterLogs[0].volume).toBe(250);
    expect(result.current.mealLogs[0].name).toBe('Greek Yogurt');
    expect(result.current.mealLogs[0].calories).toBe(320);
    expect(result.current.mealLogs[0].mealType).toBe('Breakfast');

    unmount();
  });

  it('can delete a log entry', async () => {
    const date = '2024-08-14';

    const logId = await db.logs.add({
      date,
      type: 'water',
      synced: false,
      volume: 250,
      updatedAt: Date.now(),
    }) as string;

    const { result, unmount } = renderHook(() => useLogHistory());

    act(() => {
      result.current.setSelectedDate(date);
    });

    await waitFor(() => {
      expect(result.current.waterLogs).toHaveLength(1);
    });

    // Set isSyncing to true to prevent background deletion tombstone hook from spawning unawaited tasks
    dbHooks.isSyncing = true;

    // Delete the entry
    await act(async () => {
      await result.current.handleDeleteLog(logId);
    });

    dbHooks.isSyncing = false;

    await waitFor(() => {
      expect(result.current.waterLogs).toHaveLength(0);
    });

    const dbLogs = await db.logs.toArray();
    expect(dbLogs).toHaveLength(0);

    unmount();
  });

  it('can edit a food log entry', async () => {
    const date = '2024-08-14';

    const foodLog = {
      date,
      type: 'food',
      synced: false,
      name: 'Apple',
      calories: 90,
      mealType: 'Snack',
      updatedAt: Date.now(),
    };

    await db.logs.add(foodLog);

    const { result, unmount } = renderHook(() => useLogHistory());

    act(() => {
      result.current.setSelectedDate(date);
    });

    await waitFor(() => {
      expect(result.current.mealLogs).toHaveLength(1);
    });

    // Start editing
    const itemToEdit = result.current.mealLogs[0];
    act(() => {
      result.current.startEdit(itemToEdit);
    });

    expect(result.current.editingLog).not.toBeNull();
    expect(result.current.editName).toBe('Apple');
    expect(result.current.editCalories).toBe('90');
    expect(result.current.editMealType).toBe('Snack');

    // Make modifications
    act(() => {
      result.current.setEditName('Big Apple');
      result.current.setEditCalories('120');
      result.current.setEditMealType('Lunch');
    });

    // Save modifications
    await act(async () => {
      await result.current.saveEdit();
    });

    await waitFor(() => {
      expect(result.current.editingLog).toBeNull();
      expect(result.current.mealLogs[0].name).toBe('Big Apple');
      expect(result.current.mealLogs[0].calories).toBe(120);
      expect(result.current.mealLogs[0].mealType).toBe('Lunch');
    });

    unmount();
  });

  it('can edit a water log entry', async () => {
    const date = '2024-08-14';

    const waterLog = {
      date,
      type: 'water',
      synced: false,
      volume: 250,
      updatedAt: Date.now(),
    };

    await db.logs.add(waterLog);

    const { result, unmount } = renderHook(() => useLogHistory());

    act(() => {
      result.current.setSelectedDate(date);
    });

    await waitFor(() => {
      expect(result.current.waterLogs).toHaveLength(1);
    });

    // Start editing
    const itemToEdit = result.current.waterLogs[0];
    act(() => {
      result.current.startEdit(itemToEdit);
    });

    expect(result.current.editingLog).not.toBeNull();
    expect(result.current.editVolume).toBe('250');

    // Make modifications
    act(() => {
      result.current.setEditVolume('500');
    });

    // Save modifications
    await act(async () => {
      await result.current.saveEdit();
    });

    await waitFor(() => {
      expect(result.current.editingLog).toBeNull();
      expect(result.current.waterLogs[0].volume).toBe(500);
    });

    unmount();
  });
});
