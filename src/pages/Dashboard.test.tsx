import 'fake-indexeddb/auto';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from '../store/useStore';

describe('Dashboard Component', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;

    // Reset store state with default goals and dummy data
    useStore.setState({
      calorieGoal: 2000,
      waterGoal: 2500,
    });
    useStore.getState().loadDummyData();
  });

  afterEach(async () => {
    if (db.isOpen()) {
      db.close();
    }
  });

  it('renders water progress and goal', () => {
    render(<Dashboard />);
    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('/ 2500 ml')).toBeInTheDocument();
  });

  it('saves water to store and database when "+ Glass (250ml)" is clicked', async () => {
    render(<Dashboard />);

    const glassBtn = screen.getByText('+ Glass (250ml)');
    expect(glassBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(glassBtn);
    });

    // After clicking, it transitions from dummy data, so 750ml dummy is reset to 0 + 250 = 250
    await waitFor(() => {
      expect(screen.getByText('250')).toBeInTheDocument();
    });

    // Check database has the log saved
    const logs = await db.logs.toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe('water');
    expect(logs[0].volume).toBe(250);
  });

  it('saves water to store and database when "+ Bottle (500ml)" is clicked', async () => {
    render(<Dashboard />);

    const bottleBtn = screen.getByText('+ Bottle (500ml)');
    expect(bottleBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(bottleBtn);
    });

    // After clicking, transitions from dummy data, so 0 + 500 = 500
    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    // Check database has the log saved
    const logs = await db.logs.toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].type).toBe('water');
    expect(logs[0].volume).toBe(500);
  });
});
