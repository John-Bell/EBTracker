import Dexie, { type EntityTable } from 'dexie';

export interface Log {
  id?: string;
  date: string; // ISO format YYYY-MM-DD
  type: string; // 'food' or 'water'
  synced: boolean;
  // other fields can be added here...
}

export interface FoodDictionaryItem {
  id?: string;
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
  logs: 'id, date, [date+type], synced',
  foodDictionary: 'id, &name',
  settings: 'id'
});

// Auto-generate UUIDs for logs if not provided
db.logs.hook('creating', function (_primKey, obj) {
  if (!obj.id) {
    obj.id = crypto.randomUUID();
    return obj.id;
  }
});

// Auto-generate UUIDs for food dictionary items if not provided
db.foodDictionary.hook('creating', function (_primKey, obj) {
  if (!obj.id) {
    obj.id = crypto.randomUUID();
    return obj.id;
  }
});
