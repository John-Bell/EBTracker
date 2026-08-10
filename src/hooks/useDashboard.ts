import { useEffect } from 'react';
import useStore from '../store/useStore';
import { calculateWaterProgress, calculateCalorieProgress } from '../utils/dashboardUtils';

export function useDashboard() {
  const { calorieGoal, waterGoal, fetchSettings } = useStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Hardcoded current values (to be connected to database in the future)
  const currentWater = 750;
  const consumedCalories = 1450;

  const { strokeDashoffset, waterRatio } = calculateWaterProgress(currentWater, waterGoal);
  const { caloriesLeft, caloriePercent } = calculateCalorieProgress(consumedCalories, calorieGoal);

  return {
    calorieGoal,
    waterGoal,
    currentWater,
    consumedCalories,
    waterRatio,
    strokeDashoffset,
    caloriesLeft,
    caloriePercent,
  };
}
