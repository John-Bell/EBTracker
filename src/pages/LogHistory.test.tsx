import { render, screen, fireEvent } from '@testing-library/react';
import { LogHistory } from './LogHistory';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogHistory } from '../hooks/useLogHistory';

vi.mock('../hooks/useLogHistory', () => ({
  useLogHistory: vi.fn(),
}));

describe('LogHistory Component', () => {
  const mockSetSelectedDate = vi.fn();
  const mockGoToPreviousWeek = vi.fn();
  const mockGoToNextWeek = vi.fn();
  const mockHandleDeleteLog = vi.fn();
  const mockStartEdit = vi.fn();
  const mockCancelEdit = vi.fn();
  const mockSaveEdit = vi.fn();
  const mockSetEditName = vi.fn();
  const mockSetEditCalories = vi.fn();
  const mockSetEditMealType = vi.fn();
  const mockSetEditVolume = vi.fn();

  const baseMockHookValue = {
    selectedDate: '2024-08-14',
    setSelectedDate: mockSetSelectedDate,
    goToPreviousWeek: mockGoToPreviousWeek,
    goToNextWeek: mockGoToNextWeek,
    waterLogs: [],
    mealLogs: [],
    days: [
      { dateStr: '2024-08-11', dayNum: 11, weekday: 'Sun' },
      { dateStr: '2024-08-12', dayNum: 12, weekday: 'Mon' },
      { dateStr: '2024-08-13', dayNum: 13, weekday: 'Tue' },
      { dateStr: '2024-08-14', dayNum: 14, weekday: 'Wed' },
      { dateStr: '2024-08-15', dayNum: 15, weekday: 'Thu' },
      { dateStr: '2024-08-16', dayNum: 16, weekday: 'Fri' },
      { dateStr: '2024-08-17', dayNum: 17, weekday: 'Sat' },
    ],
    handleDeleteLog: mockHandleDeleteLog,
    editingLog: null,
    startEdit: mockStartEdit,
    cancelEdit: mockCancelEdit,
    saveEdit: mockSaveEdit,
    editName: '',
    setEditName: mockSetEditName,
    editCalories: '',
    setEditCalories: mockSetEditCalories,
    editMealType: 'Breakfast',
    setEditMealType: mockSetEditMealType,
    editVolume: '',
    setEditVolume: mockSetEditVolume,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard header, bottom navigation and selected date', () => {
    vi.mocked(useLogHistory).mockReturnValue(baseMockHookValue as any);

    render(<LogHistory />);

    expect(screen.getAllByText('EBTracker').length).toBeGreaterThan(0);
    expect(screen.getAllByText('History').length).toBeGreaterThan(0);
    expect(screen.getByText('Wed, 14th Log')).toBeInTheDocument();
  });

  it('renders calendar strip and handles clicking on days', () => {
    vi.mocked(useLogHistory).mockReturnValue(baseMockHookValue as any);

    render(<LogHistory />);

    // Check days are present
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();

    // Click on Mon (12)
    const monButton = screen.getByText('Mon').closest('button');
    expect(monButton).toBeInTheDocument();
    fireEvent.click(monButton!);

    expect(mockSetSelectedDate).toHaveBeenCalledWith('2024-08-12');
  });

  it('renders week navigation and handles clicking previous and next', () => {
    vi.mocked(useLogHistory).mockReturnValue(baseMockHookValue as any);

    render(<LogHistory />);

    // Check month and year are rendered based on selectedDate
    expect(screen.getByText('August 2024')).toBeInTheDocument();

    // Find previous and next buttons
    const prevButton = screen.getByText('chevron_left').closest('button');
    const nextButton = screen.getByText('chevron_right').closest('button');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    fireEvent.click(prevButton!);
    expect(mockGoToPreviousWeek).toHaveBeenCalled();

    fireEvent.click(nextButton!);
    expect(mockGoToNextWeek).toHaveBeenCalled();
  });

  it('renders empty logs state when there are no logs', () => {
    vi.mocked(useLogHistory).mockReturnValue(baseMockHookValue as any);

    render(<LogHistory />);

    expect(screen.getByText('No water logged for this day.')).toBeInTheDocument();
    expect(screen.getByText('No meals logged for this day.')).toBeInTheDocument();
  });

  it('renders water and meal logs correctly', () => {
    const mockWithLogs = {
      ...baseMockHookValue,
      waterLogs: [
        { id: 'water-1', type: 'water', volume: 250, updatedAt: 1723626000000 }, // 09:00 AM on 14 Aug 2024 UTC
      ],
      mealLogs: [
        { id: 'meal-1', type: 'food', name: 'Greek Yogurt & Berries', mealType: 'Breakfast', calories: 320, updatedAt: 1723624200000 }, // 08:30 AM on 14 Aug 2024 UTC
      ],
    };

    vi.mocked(useLogHistory).mockReturnValue(mockWithLogs as any);

    render(<LogHistory />);

    expect(screen.queryByText('No water logged for this day.')).not.toBeInTheDocument();
    expect(screen.queryByText('No meals logged for this day.')).not.toBeInTheDocument();

    // Check water log info
    expect(screen.getByText('250ml')).toBeInTheDocument();

    // Check food log info
    expect(screen.getByText('Greek Yogurt & Berries')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('320 kcal')).toBeInTheDocument();
  });

  it('handles delete action for an entry', () => {
    const mockWithLogs = {
      ...baseMockHookValue,
      waterLogs: [
        { id: 'water-1', type: 'water', volume: 250, updatedAt: 1723626000000 },
      ],
    };

    vi.mocked(useLogHistory).mockReturnValue(mockWithLogs as any);

    render(<LogHistory />);

    const deleteBtn = screen.getByText('delete').closest('button');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn!);

    expect(mockHandleDeleteLog).toHaveBeenCalledWith('water-1');
  });

  it('handles edit action for an entry and displays the modal', () => {
    const mockWithLogs = {
      ...baseMockHookValue,
      waterLogs: [
        { id: 'water-1', type: 'water', volume: 250, updatedAt: 1723626000000 },
      ],
    };

    vi.mocked(useLogHistory).mockReturnValue(mockWithLogs as any);

    render(<LogHistory />);

    const editBtn = screen.getByText('edit').closest('button');
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn!);

    expect(mockStartEdit).toHaveBeenCalledWith(mockWithLogs.waterLogs[0]);
  });

  it('renders edit modal and allows saving when editingLog is present', () => {
    const mockEditing = {
      ...baseMockHookValue,
      editingLog: { id: 'water-1', type: 'water', volume: 250 },
      editVolume: '250',
    };

    vi.mocked(useLogHistory).mockReturnValue(mockEditing as any);

    render(<LogHistory />);

    expect(screen.getByText('Edit Entry')).toBeInTheDocument();
    expect(screen.getByLabelText('Volume (ml)')).toBeInTheDocument();

    const saveBtn = screen.getByText('Save');
    fireEvent.click(saveBtn);
    expect(mockSaveEdit).toHaveBeenCalled();

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(mockCancelEdit).toHaveBeenCalled();
  });
});
