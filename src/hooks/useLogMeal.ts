import { useState, useRef, useEffect } from 'react';
import { filterSuggestions, shouldShowSuggestions } from '../utils/logMealUtils';
import type { SuggestionItem } from '../utils/logMealUtils';
import useStore from '../store/useStore';

export function useLogMeal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [itemName, setItemName] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const caloriesInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  const filteredSuggestions = filterSuggestions(searchQuery);

  // Determine if popover should show
  const showSuggestions = shouldShowSuggestions(isFocused, searchQuery, isManualEntry);

  // Handle clicking outside of suggestions popover to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setItemName(item.name);
    setCalories(item.calories.toString());
    setMealType(item.mealType);
    setSearchQuery(item.name);
    setIsManualEntry(false);
    setIsFocused(false);
  };

  const handleAddManually = () => {
    setItemName(searchQuery);
    setIsManualEntry(true);
    setIsFocused(false);
    // Focus calories input on next render
    setTimeout(() => {
      caloriesInputRef.current?.focus();
    }, 50);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setItemName('');
    setCalories('');
    setIsManualEntry(false);
  };

  const handleSave = async () => {
    const name = itemName || searchQuery || 'Oatmeal';
    const kcal = parseInt(calories, 10) || 0;

    await useStore.getState().addFoodLog({
      name,
      calories: kcal,
      mealType,
    });

    alert(`Saved food: ${name} (${kcal} kcal) for ${mealType}`);
    window.location.hash = '#/';
  };

  return {
    searchQuery,
    setSearchQuery,
    isFocused,
    setIsFocused,
    itemName,
    setItemName,
    calories,
    setCalories,
    mealType,
    setMealType,
    isManualEntry,
    setIsManualEntry,
    caloriesInputRef,
    popoverRef,
    filteredSuggestions,
    showSuggestions,
    handleSelectSuggestion,
    handleAddManually,
    handleClearSearch,
    handleSave,
  };
}
