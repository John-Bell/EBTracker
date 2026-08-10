import 'fake-indexeddb/auto';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from './Settings';
import { describe, it, expect, beforeEach } from 'vitest';
import { db, dbHooks, setTestDb } from '../db/db';
import useStore from '../store/useStore';

describe('Settings Component', () => {
  beforeEach(async () => {
    const testDbName = 'NutritionTrackerDB_' + crypto.randomUUID();
    if (db.isOpen()) db.close();
    setTestDb(testDbName);
    dbHooks.isSyncing = true;
    if (!db.isOpen()) {
      await db.open();
    }
    dbHooks.isSyncing = false;
  });



  it('renders settings page headers and default values from store', async () => {
    render(<Settings />);

    // Check header
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();

    // Check section headers
    expect(screen.getByText('Daily Goals')).toBeInTheDocument();
    expect(screen.getByText('Server Config')).toBeInTheDocument();

    // Wait for the defaults to be retrieved/set
    await waitFor(() => {
      const calorieInput = screen.getByLabelText('Calorie Goal') as HTMLInputElement;
      expect(calorieInput.value).toBe('2000');
    });

    const waterInput = screen.getByLabelText('Water Goal') as HTMLInputElement;
    expect(waterInput.value).toBe('2500');

    const endpointInput = screen.getByLabelText('Endpoint URL') as HTMLInputElement;
    expect(endpointInput.value).toBe('');
  });

  it('allows updating goals inputs and saving them', async () => {
    render(<Settings />);

    const calorieInput = screen.getByLabelText('Calorie Goal') as HTMLInputElement;
    const waterInput = screen.getByLabelText('Water Goal') as HTMLInputElement;
    const saveGoalsBtn = screen.getByText('Save Goals');

    fireEvent.change(calorieInput, { target: { value: '2200' } });
    fireEvent.change(waterInput, { target: { value: '3000' } });

    expect(calorieInput.value).toBe('2200');
    expect(waterInput.value).toBe('3000');

    // Click Save Goals
    fireEvent.click(saveGoalsBtn);

    // Verify goals have been saved in the store / display feedback
    await waitFor(() => {
      expect(screen.getByText('Goals Saved!')).toBeInTheDocument();
    });

    // Check store
    expect(useStore.getState().calorieGoal).toBe(2200);
    expect(useStore.getState().waterGoal).toBe(3000);

    // Check Dexie DB
    const storedCalorieGoal = await db.settings.get('calorieGoal');
    const storedWaterGoal = await db.settings.get('waterGoal');
    expect(storedCalorieGoal?.value).toBe(2200);
    expect(storedWaterGoal?.value).toBe(3000);
  });

  it('allows updating server config inputs and saving them', async () => {
    render(<Settings />);

    const endpointInput = screen.getByLabelText('Endpoint URL') as HTMLInputElement;
    const headerNameInput = screen.getByLabelText('Header Name') as HTMLInputElement;
    const headerKeyInput = screen.getByLabelText('Header Key') as HTMLInputElement;
    const saveConfigBtn = screen.getByText('Save Configuration');

    fireEvent.change(endpointInput, { target: { value: 'https://test-api.io/v1' } });
    fireEvent.change(headerNameInput, { target: { value: 'X-Auth-Token' } });
    fireEvent.change(headerKeyInput, { target: { value: 'secret123' } });

    expect(endpointInput.value).toBe('https://test-api.io/v1');
    expect(headerNameInput.value).toBe('X-Auth-Token');
    expect(headerKeyInput.value).toBe('secret123');

    // Click Save Configuration
    fireEvent.click(saveConfigBtn);

    // Verify config has been saved in store / display feedback
    await waitFor(() => {
      expect(screen.getByText('Configuration Saved!')).toBeInTheDocument();
    });

    // Check store
    expect(useStore.getState().endpointUrl).toBe('https://test-api.io/v1');
    expect(useStore.getState().headerName).toBe('X-Auth-Token');
    expect(useStore.getState().headerKey).toBe('secret123');

    // Check Dexie DB
    const storedEndpoint = await db.settings.get('endpointUrl');
    const storedHeaderName = await db.settings.get('headerName');
    const storedHeaderKey = await db.settings.get('headerKey');

    expect(storedEndpoint?.value).toBe('https://test-api.io/v1');
    expect(storedHeaderName?.value).toBe('X-Auth-Token');
    expect(storedHeaderKey?.value).toBe('secret123');
  });

  });
