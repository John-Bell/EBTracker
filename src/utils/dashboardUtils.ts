/**
 * Utility functions for Dashboard page calculations
 */

export function calculateWaterProgress(currentWater: number, waterGoal: number) {
  const waterRatio = waterGoal > 0 ? Math.min(currentWater / waterGoal, 1) : 0;
  const strokeDashoffset = (326.7 * (1 - waterRatio)).toFixed(1);
  return { waterRatio, strokeDashoffset };
}

export function calculateCalorieProgress(consumedCalories: number, calorieGoal: number) {
  const caloriesLeft = Math.max(0, calorieGoal - consumedCalories);
  const caloriePercent = calorieGoal > 0 ? Math.min((consumedCalories / calorieGoal) * 100, 100).toFixed(0) : '0';
  return { caloriesLeft, caloriePercent };
}
