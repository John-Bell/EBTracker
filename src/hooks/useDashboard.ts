import { useEffect } from 'react';
import useStore from '../store/useStore';
import { calculateWaterProgress, calculateCalorieProgress } from '../utils/dashboardUtils';

export function useDashboard() {
  const {
    calorieGoal,
    waterGoal,
    currentWater,
    consumedCalories,
    foodLogs,
    fetchSettings,
  } = useStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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
    foodLogs,
  };
}
