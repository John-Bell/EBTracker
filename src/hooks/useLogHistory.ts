import { useState, useEffect } from 'react';
import { db } from '../db/db';
import type { Log } from '../db/db';
import { getDaysInWeek } from '../utils/logHistoryUtils';

export function useLogHistory() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [editingLog, setEditingLog] = useState<Log | null>(null);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editCalories, setEditCalories] = useState('');
  const [editMealType, setEditMealType] = useState('Breakfast');
  const [editVolume, setEditVolume] = useState('');

  const loadLogs = async () => {
    try {
      const data = await db.logs.where('date').equals(selectedDate).toArray();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load logs', err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedDate]);

  const handleDeleteLog = async (id?: string) => {
    if (!id) return;
    try {
      await db.logs.delete(id);
      await loadLogs();
      try {
        const { remoteSyncService } = await import('../db/syncService');
        remoteSyncService.autoSync();
      } catch (err) {
        console.warn('Sync failed to trigger automatically', err);
      }
    } catch (err) {
      console.error('Failed to delete log', err);
    }
  };

  const startEdit = (log: Log) => {
    setEditingLog(log);
    if (log.type === 'food') {
      setEditName(log.name || '');
      setEditCalories(String(log.calories || 0));
      setEditMealType(log.mealType || 'Breakfast');
    } else {
      setEditVolume(String(log.volume || 0));
    }
  };

  const cancelEdit = () => {
    setEditingLog(null);
  };

  const saveEdit = async () => {
    if (!editingLog || !editingLog.id) return;
    try {
      if (editingLog.type === 'food') {
        await db.logs.update(editingLog.id, {
          name: editName,
          calories: Number(editCalories),
          mealType: editMealType,
          synced: false,
        });
      } else {
        await db.logs.update(editingLog.id, {
          volume: Number(editVolume),
          synced: false,
        });
      }
      setEditingLog(null);
      await loadLogs();
      try {
        const { remoteSyncService } = await import('../db/syncService');
        remoteSyncService.autoSync();
      } catch (err) {
        console.warn('Sync failed to trigger automatically', err);
      }
    } catch (err) {
      console.error('Failed to save edit', err);
    }
  };

  const days = getDaysInWeek(selectedDate);
  const waterLogs = logs.filter((log) => log.type === 'water');
  const mealLogs = logs.filter((log) => log.type === 'food');

  return {
    selectedDate,
    setSelectedDate,
    waterLogs,
    mealLogs,
    days,
    handleDeleteLog,
    editingLog,
    startEdit,
    cancelEdit,
    saveEdit,
    editName,
    setEditName,
    editCalories,
    setEditCalories,
    editMealType,
    setEditMealType,
    editVolume,
    setEditVolume,
    loadLogs,
  };
}
