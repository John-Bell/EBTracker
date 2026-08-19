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
    addWaterLog,
    fetchTodaySummary,
  } = useStore();

  useEffect(() => {
    const init = async () => {
      await fetchSettings();
      try {
        const today = new Date().toISOString().split('T')[0];
        await fetchTodaySummary(today);
      } catch (err) {
        console.error('Failed to load today summary on mount', err);
      }
    };
    init();
  }, [fetchSettings, fetchTodaySummary]);

  const { strokeDashoffset, waterRatio } = calculateWaterProgress(currentWater, waterGoal);
  const { caloriesLeft, caloriePercent } = calculateCalorieProgress(consumedCalories, calorieGoal);

  const handleAddWater = async (volume: number) => {
    await addWaterLog(volume);
  };

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
    handleAddWater,
  };
}
