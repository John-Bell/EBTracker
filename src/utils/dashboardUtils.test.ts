import { describe, it, expect } from 'vitest';
import { calculateWaterProgress, calculateCalorieProgress } from './dashboardUtils';

describe('dashboardUtils', () => {
  describe('calculateWaterProgress', () => {
    it('calculates water ratio and stroke dashoffset correctly', () => {
      // 750 / 1000 = 0.75 ratio. offset = 326.7 * (1 - 0.75) = 326.7 * 0.25 = 81.675 -> "81.7"
      const result = calculateWaterProgress(750, 1000);
      expect(result.waterRatio).toBe(0.75);
      expect(result.strokeDashoffset).toBe('81.7');
    });

    it('handles water goal exceeding intake', () => {
      const result = calculateWaterProgress(1500, 1000);
      expect(result.waterRatio).toBe(1.0);
      expect(result.strokeDashoffset).toBe('0.0');
    });

    it('handles zero water goal', () => {
      const result = calculateWaterProgress(500, 0);
      expect(result.waterRatio).toBe(0);
      expect(result.strokeDashoffset).toBe('326.7');
    });
  });

  describe('calculateCalorieProgress', () => {
    it('calculates left calories and percent correctly', () => {
      const result = calculateCalorieProgress(1200, 2000);
      expect(result.caloriesLeft).toBe(800);
      expect(result.caloriePercent).toBe('60');
    });

    it('caps percent at 100% and left calories at 0 when consumed exceeds goal', () => {
      const result = calculateCalorieProgress(2500, 2000);
      expect(result.caloriesLeft).toBe(0);
      expect(result.caloriePercent).toBe('100');
    });

    it('handles zero calorie goal', () => {
      const result = calculateCalorieProgress(500, 0);
      expect(result.caloriesLeft).toBe(0);
      expect(result.caloriePercent).toBe('0');
    });
  });
});
