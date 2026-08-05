import { render, screen, fireEvent } from '@testing-library/react';
import { LogMeal } from './LogMeal';
import { describe, it, expect } from 'vitest';

describe('LogMeal Component', () => {
  it('renders top app bar with title EBTracker', () => {
    render(<LogMeal />);
    expect(screen.getAllByText('EBTracker').length).toBeGreaterThan(0);
  });

  it('renders search past meals input and updates search query', () => {
    render(<LogMeal />);
    const searchInput = screen.getByPlaceholderText('Search past meals...') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Oat' } });
    expect(searchInput.value).toBe('Oat');
  });

  it('shows matched mock suggestions and the manual entry option when typing', async () => {
    render(<LogMeal />);
    const searchInput = screen.getByPlaceholderText('Search past meals...');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'Oat' } });

    // "Oatmeal with Berries" and "Oat Milk Latte" should be shown
    expect(screen.getByText('Oatmeal with Berries')).toBeInTheDocument();
    expect(screen.getByText('Oat Milk Latte')).toBeInTheDocument();

    // "Add "Oat" manually" option should be shown
    expect(screen.getByText('Add "Oat" manually')).toBeInTheDocument();
  });

  it('selects a suggestion and fills the form', () => {
    render(<LogMeal />);
    const searchInput = screen.getByPlaceholderText('Search past meals...');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'Oatmeal' } });

    const suggestion = screen.getByText('Oatmeal with Berries');
    fireEvent.click(suggestion);

    // Checks if the Item Name inputs matches
    const nameInput = screen.getByLabelText('Item Name') as HTMLInputElement;
    expect(nameInput.value).toBe('Oatmeal with Berries');

    const caloriesInput = screen.getByLabelText('Calories') as HTMLInputElement;
    expect(caloriesInput.value).toBe('240');
  });

  it('triggers manual entry when clicking "Add manually"', async () => {
    render(<LogMeal />);
    const searchInput = screen.getByPlaceholderText('Search past meals...');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'Pancake' } });

    const manualBtn = screen.getByText('Add "Pancake" manually');
    fireEvent.click(manualBtn);

    // Item name input should show "Pancake"
    const nameInput = screen.getByLabelText('Item Name') as HTMLInputElement;
    expect(nameInput.value).toBe('Pancake');

    // Autocomplete should be hidden
    expect(screen.queryByText('Add "Pancake" manually')).not.toBeInTheDocument();
  });

  it('allows changing meal types via segmented controls', () => {
    render(<LogMeal />);
    const lunchBtn = screen.getByText('Lunch');
    const breakfastBtn = screen.getByText('Breakfast');

    // Initially Breakfast should be active (contains bg-white text-primary or equivalent check)
    expect(breakfastBtn).toHaveClass('bg-white');

    fireEvent.click(lunchBtn);
    expect(lunchBtn).toHaveClass('bg-white');
    expect(breakfastBtn).not.toHaveClass('bg-white');
  });

  it('clears search when cancel/clear button is clicked', () => {
    render(<LogMeal />);
    const searchInput = screen.getByPlaceholderText('Search past meals...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Toast' } });
    expect(searchInput.value).toBe('Toast');

    const clearBtn = screen.getByText('cancel');
    fireEvent.click(clearBtn);

    expect(searchInput.value).toBe('');
  });
});
