import Dexie, { type EntityTable } from 'dexie';

export const dbHooks = { isSyncing: false };

export interface DeletedRow {
  id: string;
  tableName: string;
  deletedAt: number;
}

export interface Log {
  id?: string;
  date: string; // ISO format YYYY-MM-DD
  type: string; // 'food' or 'water'
  synced: boolean;
  updatedAt?: number;
  // other fields can be added here...
  name?: string;
  calories?: number;
  mealType?: string;
  volume?: number;
}

export interface FoodDictionaryItem {
  id?: string;
  name: string;
  updatedAt?: number;
}

export interface Setting {
  id: string;
  value: any;
  updatedAt?: number;
}

export class NutritionTrackerDB extends Dexie {
  logs!: EntityTable<Log, 'id'>;
  foodDictionary!: EntityTable<FoodDictionaryItem, 'id'>;
  settings!: EntityTable<Setting, 'id'>;
  deletedRows!: EntityTable<DeletedRow, 'id'>;

  constructor(dbName = 'NutritionTrackerDB') {
    super(dbName);
    this.version(1).stores({
      logs: 'id, date, [date+type], synced',
      foodDictionary: 'id, &name',
      settings: 'id',
      deletedRows: 'id, deletedAt'
    });

    const addTimestamp = (obj: any) => {
      if (!dbHooks.isSyncing) {
        obj.updatedAt = Date.now();
      }
    };

    const updateTimestamp = (modifications: any) => {
      if (!dbHooks.isSyncing) {
        modifications.updatedAt = Date.now();
      }
    };

    const recordDeletion = async (_primKey: any, obj: any, tableName: string) => {
      if (!dbHooks.isSyncing && obj.id) {
        await this.deletedRows.put({
          id: obj.id,
          tableName,
          deletedAt: Date.now()
        });
      }
    };

    // Hooks for logs
    this.logs.hook('creating', function (_primKey, obj) {
      if (!obj.id) {
        obj.id = crypto.randomUUID();
      }
      addTimestamp(obj);
      return obj.id;
    });
    this.logs.hook('updating', function (modifications, _primKey, _obj) {
      updateTimestamp(modifications);
    });
    this.logs.hook('deleting', function (primKey, obj) {
      recordDeletion(primKey, obj, 'logs');
    });

    // Hooks for foodDictionary
    this.foodDictionary.hook('creating', function (_primKey, obj) {
      if (!obj.id) {
        obj.id = crypto.randomUUID();
      }
      addTimestamp(obj);
      return obj.id;
    });
    this.foodDictionary.hook('updating', function (modifications, _primKey, _obj) {
      updateTimestamp(modifications);
    });
    this.foodDictionary.hook('deleting', function (primKey, obj) {
      recordDeletion(primKey, obj, 'foodDictionary');
    });

    // Hooks for settings
    this.settings.hook('creating', function (_primKey, obj) {
      addTimestamp(obj);
    });
    this.settings.hook('updating', function (modifications, _primKey, _obj) {
      updateTimestamp(modifications);
    });
    this.settings.hook('deleting', function (primKey, obj) {
      recordDeletion(primKey, obj, 'settings');
    });
  }
}

export let db = new NutritionTrackerDB();

export function setTestDb(dbName: string) {
  db = new NutritionTrackerDB(dbName);
}

export async function getSanitizedDbData(): Promise<Record<string, any[]>> {
  const data: Record<string, any[]> = {};
  data.logs = await db.logs.toArray();
  data.foodDictionary = await db.foodDictionary.toArray();
  data.settings = await db.settings.toArray();
  data.deletedRows = await db.deletedRows.toArray();
  return data;
}