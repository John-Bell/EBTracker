import { describe, it, expect } from 'vitest';
import { filterSuggestions, shouldShowSuggestions } from './logMealUtils';

describe('logMealUtils', () => {
  describe('filterSuggestions', () => {
    it('returns empty array when query is empty', () => {
      expect(filterSuggestions('')).toEqual([]);
    });

    it('filters suggestions correctly (case-insensitive)', () => {
      const results = filterSuggestions('oat');
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Oatmeal with Berries');
      expect(results[1].name).toBe('Oat Milk Latte');
    });

    it('filters with custom suggestions array', () => {
      const customSuggestions = [
        { name: 'Apple', calories: 95, mealType: 'Snack' as const, icon: 'apple' },
        { name: 'Banana', calories: 105, mealType: 'Breakfast' as const, icon: 'banana' },
      ];
      const results = filterSuggestions('ap', customSuggestions);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Apple');
    });
  });

  describe('shouldShowSuggestions', () => {
    it('returns true when focused, query is non-empty, and not manual entry', () => {
      expect(shouldShowSuggestions(true, 'abc', false)).toBe(true);
    });

    it('returns false when not focused', () => {
      expect(shouldShowSuggestions(false, 'abc', false)).toBe(false);
    });

    it('returns false when query is empty or whitespace', () => {
      expect(shouldShowSuggestions(true, '', false)).toBe(false);
      expect(shouldShowSuggestions(true, '   ', false)).toBe(false);
    });

    it('returns false when in manual entry mode', () => {
      expect(shouldShowSuggestions(true, 'abc', true)).toBe(false);
    });
  });
});
