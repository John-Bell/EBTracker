import 'fake-indexeddb/auto';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSettings } from './useSettings';
import { db } from '../db/db';
import useStore from '../store/useStore';

describe('useSettings Hook', () => {
  beforeEach(async () => {
    if (!db.isOpen()) {
      await db.open();
    }
    await db.settings.clear();
    await db.logs.clear();
    await db.foodDictionary.clear();
    const state = useStore.getState();
    await state.saveGoals(2000, 2500);
    await state.saveConfig('', '', '');
  });

  afterEach(async () => {
    vi.useRealTimers();
    await db.settings.clear();
    await db.logs.clear();
    await db.foodDictionary.clear();
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

  it('handles clearing cache after confirmation', async () => {
    await db.logs.add({ date: '2026-08-03', type: 'food', synced: false });

    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.localCalorieGoal).toBe('2000');
    });

    await act(async () => {
      await result.current.handleClearCache();
    });

    expect(confirmSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Local cache cleared successfully.');

    const logs = await db.logs.toArray();
    expect(logs.length).toBe(0);

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
