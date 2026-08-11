import { create } from 'zustand';
import { db } from '../db/db';

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  mealType: string;
}

interface StoreState {
  calorieGoal: number;
  waterGoal: number;
  endpointUrl: string;
  headerName: string;
  headerKey: string;
  syncStatus: 'connected' | 'disconnected';
  lastSynced: number;
  syncPassphrase?: string;

  currentWater: number;
  consumedCalories: number;
  foodLogs: FoodLog[];

  setSyncStatus: (status: 'connected' | 'disconnected') => void;
  setLastSynced: (timestamp: number) => void;

  fetchSettings: () => Promise<void>;
  saveGoals: (calorieGoal: number, waterGoal: number) => Promise<void>;
  saveConfig: (endpointUrl: string, headerName: string, headerKey: string, syncPassphrase?: string) => Promise<void>;

  addFoodLog: (log: any) => Promise<void>;
  addWaterLog: (volume: number) => Promise<void>;
  fetchTodaySummary: (date: string) => Promise<void>;
  loadDummyData: () => void;
}

const DEFAULT_CALORIE_GOAL = 2000;
const DEFAULT_WATER_GOAL = 2500;

const useStore = create<StoreState>((set) => ({
  calorieGoal: DEFAULT_CALORIE_GOAL,
  waterGoal: DEFAULT_WATER_GOAL,
  endpointUrl: '',
  headerName: '',
  headerKey: '',
  syncStatus: 'disconnected',
  lastSynced: 0,

  currentWater: 0,
  consumedCalories: 0,
  foodLogs: [],

  setSyncStatus: (status) => set({ syncStatus: status }),
  setLastSynced: (timestamp) => set({ lastSynced: timestamp }),

  fetchSettings: async () => {
    try {
      const allSettings = await db.settings.toArray();
      const settingsMap = allSettings.reduce((acc, curr) => {
        acc[curr.id] = curr.value;
        return acc;
      }, {} as Record<string, any>);

      set({
        calorieGoal: settingsMap['calorieGoal'] !== undefined ? Number(settingsMap['calorieGoal']) : DEFAULT_CALORIE_GOAL,
        waterGoal: settingsMap['waterGoal'] !== undefined ? Number(settingsMap['waterGoal']) : DEFAULT_WATER_GOAL,
        endpointUrl: settingsMap['endpointUrl'] || '',
        headerName: settingsMap['headerName'] || '',
        headerKey: settingsMap['headerKey'] || '',
        syncPassphrase: settingsMap['syncPassphrase'] || '',
        lastSynced: settingsMap['lastSynced'] || 0,
      });
    } catch (error) {
      console.error('Failed to fetch settings from DB', error);
    }
  },

  saveGoals: async (calorieGoal, waterGoal) => {
    try {
      await db.settings.put({ id: 'calorieGoal', value: calorieGoal });
      await db.settings.put({ id: 'waterGoal', value: waterGoal });
      set({ calorieGoal, waterGoal });
    } catch (error) {
      console.error('Failed to save goals', error);
      throw error;
    }
  },

  saveConfig: async (endpointUrl, headerName, headerKey, syncPassphrase) => {
    try {
      await db.settings.put({ id: 'endpointUrl', value: endpointUrl });
      await db.settings.put({ id: 'headerName', value: headerName });
      await db.settings.put({ id: 'headerKey', value: headerKey });
      if (syncPassphrase !== undefined) {
         await db.settings.put({ id: 'syncPassphrase', value: syncPassphrase });
      }
      set({ endpointUrl, headerName, headerKey, ...(syncPassphrase !== undefined ? { syncPassphrase } : {}) });
    } catch (error) {
      console.error('Failed to save config', error);
      throw error;
    }
  },

  // addFoodLog(log)
  addFoodLog: async (log: { name: string; calories: number; mealType: string; date?: string }) => {
    try {
      const date = log.date || new Date().toISOString().split('T')[0];
      const newLog = {
        date,
        type: 'food',
        synced: false,
        name: log.name,
        calories: Number(log.calories),
        mealType: log.mealType,
      };

      const insertedId = await db.logs.add(newLog);

      set((state) => {
        const isDummy = state.foodLogs.some(item => ['1', '2', '3', '4'].includes(item.id));
        const baseLogs = isDummy ? [] : state.foodLogs;
        const baseCalories = isDummy ? 0 : state.consumedCalories;

        const addedFoodLog: FoodLog = {
          id: insertedId as string,
          name: log.name,
          calories: Number(log.calories),
          mealType: log.mealType,
        };

        return {
          foodLogs: [...baseLogs, addedFoodLog],
          consumedCalories: baseCalories + Number(log.calories),
        };
      });

      try {
        const { remoteSyncService } = await import('../db/syncService');
        remoteSyncService.autoSync();
      } catch (err) {
        console.warn('Sync failed to trigger automatically', err);
      }
    } catch (error) {
      console.error('Failed to add food log', error);
      throw error;
    }
  },

  // addWaterLog(volume)
  addWaterLog: async (volume: number) => {
    try {
      const date = new Date().toISOString().split('T')[0];
      const newLog = {
        date,
        type: 'water',
        synced: false,
        volume: Number(volume),
      };

      await db.logs.add(newLog);

      set((state) => {
        const isDummy = state.foodLogs.some(item => ['1', '2', '3', '4'].includes(item.id));
        const baseWater = isDummy ? 0 : state.currentWater;

        return {
          currentWater: baseWater + Number(volume),
        };
      });

      try {
        const { remoteSyncService } = await import('../db/syncService');
        remoteSyncService.autoSync();
      } catch (err) {
        console.warn('Sync failed to trigger automatically', err);
      }
    } catch (error) {
      console.error('Failed to add water log', error);
      throw error;
    }
  },

  // fetchTodaySummary(date)
  fetchTodaySummary: async (date: string) => {
    try {
      const logs = await db.logs.where('date').equals(date).toArray();

      const foodLogs: FoodLog[] = logs
        .filter((l) => l.type === 'food')
        .map((l) => ({
          id: l.id!,
          name: l.name || '',
          calories: l.calories || 0,
          mealType: l.mealType || '',
        }));
      const consumedCalories = foodLogs.reduce((sum, item) => sum + item.calories, 0);

      const waterLogs = logs.filter((l) => l.type === 'water');
      const currentWater = waterLogs.reduce((sum, item) => sum + (item.volume || 0), 0);

      set({
        foodLogs,
        consumedCalories,
        currentWater,
      });
    } catch (error) {
      console.error('Failed to fetch today summary', error);
      throw error;
    }
  },

  loadDummyData: () => {
    set({
      currentWater: 750,
      consumedCalories: 1450,
      foodLogs: [
        { id: '1', name: 'Oatmeal with Berries', calories: 320, mealType: 'Breakfast' },
        { id: '2', name: 'Grilled Chicken Salad', calories: 540, mealType: 'Lunch' },
        { id: '3', name: 'Salmon & Asparagus', calories: 480, mealType: 'Dinner' },
        { id: '4', name: 'Green Apple', calories: 110, mealType: 'Snacks' }
      ]
    });
  }
}));

// Load dummy data when the store/app initializes
useStore.getState().loadDummyData();

export default useStore;
