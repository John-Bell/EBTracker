export interface SuggestionItem {
  name: string;
  calories: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  icon: string;
}

export const MOCK_SUGGESTIONS: SuggestionItem[] = [
  { name: 'Oatmeal with Berries', calories: 240, mealType: 'Breakfast', icon: 'history' },
  { name: 'Oat Milk Latte', calories: 120, mealType: 'Snack', icon: 'restaurant' },
];

/**
 * Filter suggestions based on query
 */
export function filterSuggestions(query: string, suggestions: SuggestionItem[] = MOCK_SUGGESTIONS): SuggestionItem[] {
  if (!query) {
    return [];
  }
  return suggestions.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Determine if suggestions popover should show
 */
export function shouldShowSuggestions(
  isFocused: boolean,
  searchQuery: string,
  isManualEntry: boolean
): boolean {
  return isFocused && searchQuery.trim().length > 0 && !isManualEntry;
}
