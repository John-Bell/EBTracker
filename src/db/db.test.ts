import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db, dbHooks, setTestDb } from './db';

describe('NutritionTrackerDB UUID Primary Keys', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;
  });

  afterEach(async () => {
    if (db.isOpen()) {
      db.close();
    }
  });

  describe('logs table', () => {
    it('should auto-generate a UUID when adding a log without an id', async () => {
      const logData = {
        date: '2026-08-03',
        type: 'food',
        synced: false,
      };

      const insertedId = await db.logs.add(logData);

      expect(insertedId).toBeDefined();
      const idStr = insertedId!;
      expect(typeof idStr).toBe('string');
      // A standard UUID has 36 characters (including hyphens)
      expect(idStr.length).toBe(36);
      expect(idStr).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Verify the record was stored with the generated id
      const retrievedLog = await db.logs.get(idStr);
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog?.id).toBe(idStr);
      expect(retrievedLog?.date).toBe('2026-08-03');
      expect(retrievedLog?.type).toBe('food');
      expect(retrievedLog?.synced).toBe(false);
    });

    it('should preserve a pre-specified UUID when adding a log with an id', async () => {
      const customId = crypto.randomUUID();
      const logData = {
        id: customId,
        date: '2026-08-03',
        type: 'water',
        synced: true,
      };

      const insertedId = await db.logs.add(logData);

      expect(insertedId).toBe(customId);

      // Verify the record was stored with the custom id
      const retrievedLog = await db.logs.get(customId);
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog?.id).toBe(customId);
      expect(retrievedLog?.type).toBe('water');
      expect(retrievedLog?.synced).toBe(true);
    });
  });

  describe('foodDictionary table', () => {
    it('should auto-generate a UUID when adding an item without an id', async () => {
      const foodItem = {
        name: 'Apple',
      };

      const insertedId = await db.foodDictionary.add(foodItem);

      expect(insertedId).toBeDefined();
      const idStr = insertedId!;
      expect(typeof idStr).toBe('string');
      expect(idStr.length).toBe(36);
      expect(idStr).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      // Verify the record was stored with the generated id
      const retrievedItem = await db.foodDictionary.get(idStr);
      expect(retrievedItem).toBeDefined();
      expect(retrievedItem?.id).toBe(idStr);
      expect(retrievedItem?.name).toBe('Apple');
    });

    it('should preserve a pre-specified UUID when adding an item with an id', async () => {
      const customId = crypto.randomUUID();
      const foodItem = {
        id: customId,
        name: 'Banana',
      };

      const insertedId = await db.foodDictionary.add(foodItem);

      expect(insertedId).toBe(customId);

      // Verify the record was stored with the custom id
      const retrievedItem = await db.foodDictionary.get(customId);
      expect(retrievedItem).toBeDefined();
      expect(retrievedItem?.id).toBe(customId);
      expect(retrievedItem?.name).toBe('Banana');
    });
  });
});
