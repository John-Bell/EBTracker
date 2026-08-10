import { create } from 'zustand';
import { db } from '../db/db';

interface StoreState {
  calorieGoal: number;
  waterGoal: number;
  endpointUrl: string;
  headerName: string;
  headerKey: string;
  syncStatus: 'connected' | 'disconnected';
  lastSynced: number;
  syncPassphrase?: string;

  setSyncStatus: (status: 'connected' | 'disconnected') => void;
  setLastSynced: (timestamp: number) => void;

  fetchSettings: () => Promise<void>;
  saveGoals: (calorieGoal: number, waterGoal: number) => Promise<void>;
  saveConfig: (endpointUrl: string, headerName: string, headerKey: string, syncPassphrase?: string) => Promise<void>;

  addFoodLog: (log: any) => Promise<void>;
  addWaterLog: (volume: number) => Promise<void>;
  fetchTodaySummary: (date: string) => Promise<void>;
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
  addFoodLog: async (_log) => {
    // Implementation to be added later
  },

  // addWaterLog(volume)
  addWaterLog: async (_volume) => {
    // Implementation to be added later
  },

  // fetchTodaySummary(date)
  fetchTodaySummary: async (_date) => {
    // Implementation to be added later
  }
}));

export default useStore;
