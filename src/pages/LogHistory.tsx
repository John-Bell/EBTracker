import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useLogHistory } from '../hooks/useLogHistory';
import { formatSelectedDate } from '../utils/logHistoryUtils';

function formatTime(updatedAt?: number) {
  if (!updatedAt) return '12:00 PM';
  const d = new Date(updatedAt);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}

export function LogHistory() {
  const {
    selectedDate,
    setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
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
  } = useLogHistory();

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-body-lg text-on-background antialiased pb-[117px]">
      <Header title="History" />

      <main className="w-full max-w-md mx-auto">
        {/* Calendar Strip */}
        <div className="bg-surface border-b-[0.5px] border-outline-variant/30 py-4 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] relative z-30">
          <div className="flex items-center justify-between px-margin-mobile mb-4">
            <button
              onClick={goToPreviousWeek}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-headline-sm text-on-surface font-semibold">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextWeek}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar px-margin-mobile gap-2 items-center">
            {days.map((day) => {
              const isSelected = day.dateStr === selectedDate;
              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl transition-all duration-150 ${
                    isSelected
                      ? 'w-14 h-18 bg-primary text-on-primary shadow-[0px_4px_12px_rgba(0,88,188,0.25)]'
                      : 'w-12 h-16 text-on-surface-variant hover:bg-surface-variant/20'
                  }`}
                >
                  <span className={`font-caption text-caption mb-1 ${isSelected ? 'text-on-primary/80' : ''}`}>
                    {day.weekday}
                  </span>
                  <span className={`font-body-lg text-body-lg ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                    {day.dayNum}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-margin-mobile py-6 flex flex-col gap-stack-gap">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {formatSelectedDate(selectedDate)}
            </h2>
          </div>

          {/* Water Section */}
          <section>
            <div className="flex items-center gap-2 mb-3 pl-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                water_drop
              </span>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Water</h3>
            </div>
            <div className="bg-surface rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
              {waterLogs.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-body-sm">
                  No water logged for this day.
                </div>
              ) : (
                waterLogs.map((log, index) => (
                  <div key={log.id}>
                    {index > 0 && <div className="h-[0.5px] bg-[#C6C6C8] ml-4"></div>}
                    <div className="w-full flex flex-row items-center justify-between p-4 bg-surface active:bg-surface-variant/50 transition-colors group">
                      <div className="flex flex-col flex-1 pr-4">
                        <span className="font-body-lg text-body-lg font-semibold text-on-surface">{log.volume}ml</span>
                        <span className="font-caption text-caption text-on-surface-variant">{formatTime(log.updatedAt)}</span>
                      </div>
                      <div className="flex flex-row items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(log)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container/20 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Meals Section */}
          <section className="mt-4">
            <div className="flex items-center gap-2 mb-3 pl-2">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                restaurant
              </span>
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Meals</h3>
            </div>
            <div className="bg-surface rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
              {mealLogs.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant text-body-sm">
                  No meals logged for this day.
                </div>
              ) : (
                mealLogs.map((log, index) => (
                  <div key={log.id}>
                    {index > 0 && <div className="h-[0.5px] bg-[#C6C6C8] ml-4"></div>}
                    <div className="w-full flex flex-row items-center justify-between p-4 bg-surface active:bg-surface-variant/50 transition-colors group">
                      <div className="flex flex-col flex-1 gap-1 pr-4">
                        <span className="font-body-lg text-body-lg font-semibold text-on-surface">{log.name}</span>
                        <div className="flex items-center flex-wrap gap-2 font-caption text-caption text-on-surface-variant">
                          <span>{log.mealType}</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span>{log.calories} kcal</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span>{formatTime(log.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => startEdit(log)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/50 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container/20 active:scale-90 transition-transform"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Modal Overlay */}
      {editingLog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-6">
            <h3 className="font-headline-md text-on-surface">Edit Entry</h3>

            {editingLog.type === 'water' ? (
              <div className="space-y-1.5">
                <label htmlFor="edit-volume-input" className="font-label-caps text-on-surface-variant px-1">Volume (ml)</label>
                <input
                  id="edit-volume-input"
                  type="number"
                  className="w-full bg-[#E9E9EB]/50 border-none rounded-lg px-4 py-3 font-body-lg focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                  value={editVolume}
                  onChange={(e) => setEditVolume(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="edit-name-input" className="font-label-caps text-on-surface-variant px-1">Item Name</label>
                  <input
                    id="edit-name-input"
                    type="text"
                    className="w-full bg-[#E9E9EB]/50 border-none rounded-lg px-4 py-3 font-body-lg focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="edit-calories-input" className="font-label-caps text-on-surface-variant px-1">Calories (kcal)</label>
                  <input
                    id="edit-calories-input"
                    type="number"
                    className="w-full bg-[#E9E9EB]/50 border-none rounded-lg px-4 py-3 font-body-lg focus:ring-2 focus:ring-primary/20 transition-all focus:outline-none"
                    value={editCalories}
                    onChange={(e) => setEditCalories(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-caps text-on-surface-variant px-1">Meal Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-[#E9E9EB]/50 p-1 rounded-xl">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditMealType(type)}
                        className={`font-label-caps py-2 rounded-lg transition-all focus:outline-none ${
                          editMealType === type
                            ? 'bg-white text-primary shadow-sm border border-black/5'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelEdit}
                className="flex-1 h-12 border border-outline-variant rounded-xl font-semibold text-on-surface-variant hover:bg-surface-variant/50 active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 h-12 bg-primary text-white rounded-xl font-semibold hover:bg-primary-container active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="history" />
    </div>
  );
}
