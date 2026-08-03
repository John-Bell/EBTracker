import { create } from 'zustand';

interface StoreState {
  addFoodLog: (log: any) => Promise<void>;
  addWaterLog: (volume: number) => Promise<void>;
  fetchTodaySummary: (date: string) => Promise<void>;
}

const useStore = create<StoreState>(() => ({
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
