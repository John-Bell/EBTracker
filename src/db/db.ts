import Dexie, { type EntityTable } from 'dexie';

export interface Log {
  id?: number;
  date: string; // ISO format YYYY-MM-DD
  type: string; // 'food' or 'water'
  synced: boolean;
  // other fields can be added here...
}

export interface FoodDictionaryItem {
  id?: number;
  name: string;
}

export interface Setting {
  id: string;
  value: any;
}

export const db = new Dexie('NutritionTrackerDB') as Dexie & {
  logs: EntityTable<Log, 'id'>;
  foodDictionary: EntityTable<FoodDictionaryItem, 'id'>;
  settings: EntityTable<Setting, 'id'>;
};

db.version(1).stores({
  logs: '++id, date, [date+type], synced',
  foodDictionary: '++id, &name',
  settings: 'id'
});
