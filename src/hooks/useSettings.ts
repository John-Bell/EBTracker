import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { db } from '../db/db';

export function useSettings() {
  const {
    calorieGoal,
    waterGoal,
    endpointUrl,
    headerName,
    headerKey,
    fetchSettings,
    saveGoals,
    saveConfig,
  } = useStore();

  const [localCalorieGoal, setLocalCalorieGoal] = useState('');
  const [localWaterGoal, setLocalWaterGoal] = useState('');
  const [localEndpointUrl, setLocalEndpointUrl] = useState('');
  const [localHeaderName, setLocalHeaderName] = useState('');
  const [localHeaderKey, setLocalHeaderKey] = useState('');

  const [goalsSaved, setGoalsSaved] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setLocalCalorieGoal(calorieGoal.toString());
    setLocalWaterGoal(waterGoal.toString());
    setLocalEndpointUrl(endpointUrl);
    setLocalHeaderName(headerName);
    setLocalHeaderKey(headerKey);
  }, [calorieGoal, waterGoal, endpointUrl, headerName, headerKey]);

  const handleSaveGoals = async () => {
    try {
      const cal = localCalorieGoal ? parseInt(localCalorieGoal, 10) : 2000;
      const wat = localWaterGoal ? parseInt(localWaterGoal, 10) : 2500;
      await saveGoals(cal, wat);
      setGoalsSaved(true);
      setTimeout(() => setGoalsSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await saveConfig(localEndpointUrl, localHeaderName, localHeaderKey);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      try {
        await db.logs.clear();
        await db.foodDictionary.clear();
        await db.settings.clear();
        await fetchSettings();
        alert('Local cache cleared successfully.');
      } catch (e) {
        console.error(e);
        alert('Failed to clear local cache.');
      }
    }
  };

  const handleSync = () => {
    setSyncState('syncing');

    setTimeout(() => {
      setSyncState('synced');

      setTimeout(() => {
        setSyncState('idle');
      }, 2000);
    }, 1500);
  };

  return {
    calorieGoal,
    waterGoal,
    endpointUrl,
    headerName,
    headerKey,
    localCalorieGoal,
    setLocalCalorieGoal,
    localWaterGoal,
    setLocalWaterGoal,
    localEndpointUrl,
    setLocalEndpointUrl,
    localHeaderName,
    setLocalHeaderName,
    localHeaderKey,
    setLocalHeaderKey,
    goalsSaved,
    configSaved,
    syncState,
    focusedInput,
    setFocusedInput,
    handleSaveGoals,
    handleSaveConfig,
    handleClearCache,
    handleSync,
  };
}
