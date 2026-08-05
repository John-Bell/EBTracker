import { useState, useRef, useEffect } from 'react';
import { BottomNav } from '../components/BottomNav';

interface SuggestionItem {
  name: string;
  calories: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  icon: string;
}

const MOCK_SUGGESTIONS: SuggestionItem[] = [
  { name: 'Oatmeal with Berries', calories: 240, mealType: 'Breakfast', icon: 'history' },
  { name: 'Oat Milk Latte', calories: 120, mealType: 'Snack', icon: 'restaurant' },
];

export function LogMeal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [itemName, setItemName] = useState('');
  const [calories, setCalories] = useState<string>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const caloriesInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  const filteredSuggestions = searchQuery
    ? MOCK_SUGGESTIONS.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Determine if popover should show
  const showSuggestions =
    isFocused &&
    searchQuery.trim().length > 0 &&
    !isManualEntry;

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

  const handleSave = () => {
    // Save functionality can be implemented/extended later, as requested by prompt
    alert(`Saved food: ${itemName || searchQuery || 'Oatmeal'} (${calories || '0'} kcal) for ${mealType}`);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-body-lg text-on-surface antialiased overflow-x-hidden">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b-[0.5px] border-outline-variant/30 flex flex-col px-4 pt-6 pb-2 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">EBTracker</h1>
          </div>
          <button className="material-symbols-outlined text-primary dark:text-primary-fixed-dim active:opacity-70 transition-opacity active:scale-95 transition-transform duration-150">
            calendar_today
          </button>
        </div>
      </header>

      <main className="px-margin-mobile pt-stack-gap pb-52 max-w-2xl mx-auto">
        {/* Search Section */}
        <div className="relative z-30 mb-8" ref={popoverRef}>
          <div className="flex items-center bg-white dark:bg-surface-container rounded-xl px-4 py-3 ios-shadow focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline mr-3">search</span>
            <input
              className="bg-transparent border-none p-0 w-full focus:ring-0 font-body-lg placeholder:text-outline/60 focus:outline-none"
              placeholder="Search past meals..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (isManualEntry) {
                  setItemName(e.target.value);
                }
              }}
              onFocus={() => setIsFocused(true)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="material-symbols-outlined text-outline/40 cursor-pointer active:scale-90 transition-transform"
              >
                cancel
              </button>
            )}
          </div>

          {/* Autocomplete Popover */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-container-highest rounded-xl ios-shadow-lg border border-outline-variant/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {filteredSuggestions.map((item, index) => (
                  <div key={item.name}>
                    {index > 0 && <div className="h-[0.5px] bg-outline-variant/30 ml-14"></div>}
                    <div
                      onClick={() => handleSelectSuggestion(item)}
                      className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-label-caps text-on-surface">{item.name}</p>
                        <p className="text-caption text-on-surface-variant">
                          {item.calories} kcal • {item.mealType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSuggestions.length > 0 && <div className="h-[0.5px] bg-outline-variant/30 ml-14"></div>}

                <div
                  onClick={handleAddManually}
                  className="flex items-center gap-4 p-3 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer active:scale-[0.98] bg-primary/5"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">add</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-primary">Add "{searchQuery}" manually</p>
                    <p className="text-caption text-on-surface-variant/60">Create a new entry</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <section className="space-y-6">
          <div className="bg-white rounded-2xl p-card-padding ios-shadow">
            <h2 className="font-label-caps text-outline mb-4 uppercase tracking-wider text-[11px]">Item Details</h2>
            <div className="space-y-5">
              {/* Item Name */}
              <div className="space-y-1.5">
                <label htmlFor="item-name-input" className="font-label-caps text-on-surface-variant px-1">Item Name</label>
                <input
                  id="item-name-input"
                  className="w-full bg-[#E9E9EB]/50 border-none rounded-lg px-4 py-3 font-body-lg focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                  placeholder="Enter food name"
                  type="text"
                  value={isManualEntry ? itemName : (itemName || searchQuery)}
                  onChange={(e) => {
                    setItemName(e.target.value);
                    setIsManualEntry(true);
                  }}
                />
              </div>
              {/* Calories */}
              <div className="space-y-1.5">
                <label htmlFor="calories-input" className="font-label-caps text-on-surface-variant px-1">Calories</label>
                <div className="relative">
                  <input
                    id="calories-input"
                    ref={caloriesInputRef}
                    className={`w-full bg-[#E9E9EB]/50 border-none rounded-lg px-4 py-3 font-display text-headline-md focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none ${
                      isManualEntry ? 'ring-2 ring-primary/20' : ''
                    }`}
                    placeholder="0"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-label-caps">kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Type Segmented Control */}
          <div className="bg-white rounded-2xl p-card-padding ios-shadow">
            <h2 className="font-label-caps text-outline mb-4 uppercase tracking-wider text-[11px]">Meal Type</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 bg-[#E9E9EB]/50 p-1 rounded-xl">
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`font-label-caps py-2.5 rounded-lg active:scale-95 transition-all focus:outline-none ${
                    mealType === type
                      ? 'bg-white text-primary shadow-sm border border-black/5'
                      : 'text-on-surface-variant hover:bg-white/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Log Card (Asymmetric Layout element) */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-card-padding flex items-start gap-4">
            <div className="bg-primary/20 p-2 rounded-xl">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
            </div>
            <div>
              <h3 className="font-label-caps text-primary">Pro Tip</h3>
              <p className="text-caption text-on-primary-fixed-variant mt-1 leading-relaxed">
                Most logged meals appear in search suggestions. Log your morning oatmeal once to find it instantly tomorrow.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Actions - Positioned perfectly above the persistent 83px Bottom Navigation Bar */}
      <div className="fixed bottom-[calc(83px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-t-[0.5px] border-outline-variant/30 px-6 py-4">
        <button
          onClick={handleSave}
          className="w-full h-[50px] bg-primary text-white font-headline-md rounded-[12px] shadow-lg active:scale-95 active:bg-primary-container transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          Save Food
        </button>
      </div>

      {/* Navigation */}
      <BottomNav activeTab="log" />
    </div>
  );
}
