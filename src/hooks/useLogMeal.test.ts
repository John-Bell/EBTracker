import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLogMeal } from './useLogMeal';

describe('useLogMeal Hook', () => {
  it('should initialize with default states', () => {
    const { result } = renderHook(() => useLogMeal());
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isFocused).toBe(false);
    expect(result.current.itemName).toBe('');
    expect(result.current.calories).toBe('');
    expect(result.current.mealType).toBe('Breakfast');
    expect(result.current.isManualEntry).toBe(false);
    expect(result.current.showSuggestions).toBe(false);
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useLogMeal());
    act(() => {
      result.current.setSearchQuery('Banana');
    });
    expect(result.current.searchQuery).toBe('Banana');
  });

  it('should handle select suggestion', () => {
    const { result } = renderHook(() => useLogMeal());
    act(() => {
      result.current.handleSelectSuggestion({
        name: 'Oatmeal with Berries',
        calories: 240,
        mealType: 'Breakfast',
        icon: 'history',
      });
    });
    expect(result.current.itemName).toBe('Oatmeal with Berries');
    expect(result.current.calories).toBe('240');
    expect(result.current.mealType).toBe('Breakfast');
    expect(result.current.searchQuery).toBe('Oatmeal with Berries');
    expect(result.current.isManualEntry).toBe(false);
    expect(result.current.isFocused).toBe(false);
  });

  it('should handle add manually', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLogMeal());
    act(() => {
      result.current.setSearchQuery('Pancake');
    });
    act(() => {
      result.current.handleAddManually();
    });
    expect(result.current.itemName).toBe('Pancake');
    expect(result.current.isManualEntry).toBe(true);
    expect(result.current.isFocused).toBe(false);
    vi.useRealTimers();
  });

  it('should clear search and form details', () => {
    const { result } = renderHook(() => useLogMeal());
    act(() => {
      result.current.setSearchQuery('Apple');
      result.current.setItemName('Apple');
      result.current.setCalories('100');
      result.current.setIsManualEntry(true);
    });

    act(() => {
      result.current.handleClearSearch();
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.itemName).toBe('');
    expect(result.current.calories).toBe('');
    expect(result.current.isManualEntry).toBe(false);
  });

  it('should handle saving with alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const { result } = renderHook(() => useLogMeal());

    act(() => {
      result.current.setItemName('Test Food');
      result.current.setCalories('500');
      result.current.setMealType('Dinner');
    });

    act(() => {
      result.current.handleSave();
    });

    expect(alertSpy).toHaveBeenCalledWith('Saved food: Test Food (500 kcal) for Dinner');
    alertSpy.mockRestore();
  });
});
