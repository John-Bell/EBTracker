import { BottomNav } from '../components/BottomNav';
import { useDashboard } from '../hooks/useDashboard';

export function Dashboard() {
  const {
    calorieGoal,
    waterGoal,
    currentWater,
    consumedCalories,
    strokeDashoffset,
    caloriesLeft,
    caloriePercent,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-body-lg text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b-[0.5px] border-outline-variant/30 flex flex-col px-4 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">EBTracker</h1>
          </div>
          <button className="active:opacity-70 transition-opacity text-primary dark:text-primary-fixed-dim">
            <span className="material-symbols-outlined text-[28px]">calendar_today</span>
          </button>
        </div>
      </header>

      <main className="px-4 pt-5 pb-32 max-w-2xl mx-auto space-y-5">
        {/* Water Intake Section */}
        <section
          className="bg-surface-container-lowest rounded-xl p-4 ios-shadow flex flex-col items-center transition-all duration-600 ease-out"
          style={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background Circle */}
              <circle
                className="text-primary/10"
                cx="60"
                cy="60"
                fill="transparent"
                r="52"
                stroke="currentColor"
                strokeWidth="10"
              ></circle>
              {/* Progress Circle */}
              <circle
                className="text-primary progress-ring-circle"
                cx="60"
                cy="60"
                fill="transparent"
                r="52"
                stroke="currentColor"
                strokeDasharray="326.7"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="10"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-headline-lg text-on-surface">{currentWater}</span>
              <span className="font-caption text-caption text-on-surface-variant">/ {waterGoal} ml</span>
            </div>
          </div>
          <div className="mt-6 flex w-full gap-3">
            <button className="flex-1 h-[50px] bg-surface-container-high rounded-xl text-primary font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
              <span className="text-body-sm">+ Glass (250ml)</span>
            </button>
            <button className="flex-1 h-[50px] bg-surface-container-high rounded-xl text-primary font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">local_drink</span>
              <span className="text-body-sm">+ Bottle (500ml)</span>
            </button>
          </div>
        </section>

        {/* Calories Summary Card */}
        <section
          className="bg-surface-container-lowest rounded-xl p-4 ios-shadow transition-all duration-600 ease-out"
          style={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-tertiary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-[20px]">nutrition</span>
              </div>
              <h2 className="font-headline-md text-on-surface">Calories</h2>
            </div>
            <span className="font-label-caps text-on-surface-variant">Today</span>
          </div>
          <div className="flex items-end justify-between mb-2">
            <div className="space-y-1">
              <span className="font-display text-headline-lg text-on-surface">{consumedCalories.toLocaleString()}</span>
              <span className="block font-caption text-caption text-on-surface-variant">kcal consumed</span>
            </div>
            <div className="text-right">
              <span className="font-body-lg text-on-surface">
                {caloriesLeft.toLocaleString()} <span className="text-on-surface-variant text-body-sm">left</span>
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-tertiary rounded-full" style={{ width: `${caloriePercent}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between font-caption text-caption text-on-surface-variant/60">
            <span>0 kcal</span>
            <span>Goal: {calorieGoal.toLocaleString()} kcal</span>
          </div>
        </section>

        {/* Food Log Section */}
        <section
          className="space-y-4 transition-all duration-600 ease-out"
          style={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <h2 className="px-2 font-label-caps text-on-surface-variant/80 uppercase">Today's Log</h2>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden ios-shadow">
            {/* Breakfast */}
            <div className="px-4 py-3 flex items-center justify-between active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-label-caps text-primary text-caption uppercase mb-1">Breakfast</p>
                  <p className="font-body-lg font-semibold text-on-surface">Oatmeal with Berries</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-lg text-on-surface">
                  320 <span className="text-caption">kcal</span>
                </p>
              </div>
            </div>
            <div className="h-[0.5px] bg-outline-variant/30"></div>

            {/* Lunch */}
            <div className="px-4 py-3 flex items-center justify-between active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-label-caps text-primary text-caption uppercase mb-1">Lunch</p>
                  <p className="font-body-lg font-semibold text-on-surface">Grilled Chicken Salad</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-lg text-on-surface">
                  540 <span className="text-caption">kcal</span>
                </p>
              </div>
            </div>
            <div className="h-[0.5px] bg-outline-variant/30"></div>

            {/* Dinner */}
            <div className="px-4 py-3 flex items-center justify-between active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-label-caps text-primary text-caption uppercase mb-1">Dinner</p>
                  <p className="font-body-lg font-semibold text-on-surface">Salmon &amp; Asparagus</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-lg text-on-surface">
                  480 <span className="text-caption">kcal</span>
                </p>
              </div>
            </div>
            <div className="h-[0.5px] bg-outline-variant/30"></div>

            {/* Snacks */}
            <div className="px-4 py-3 flex items-center justify-between active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-label-caps text-primary text-caption uppercase mb-1">Snacks</p>
                  <p className="font-body-lg font-semibold text-on-surface">Green Apple</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-lg text-on-surface">
                  110 <span className="text-caption">kcal</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FAB for adding food */}
      <button
        onClick={() => {
          window.location.hash = '#/log';
        }}
        className="fixed bottom-28 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all duration-200 z-50"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* Navigation */}
      <BottomNav activeTab="dashboard" />
    </div>
  );
}
