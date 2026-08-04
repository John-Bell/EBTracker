export function BottomNav({ activeTab }: { activeTab: 'dashboard' | 'log' | 'settings' }) {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-t-[0.5px] border-outline-variant/30">
      <div className="flex justify-around items-center h-[83px] px-6 w-full">
        <a
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'text-primary dark:text-secondary-fixed-dim font-semibold'
              : 'text-on-surface-variant/60 dark:text-surface-variant/60 active:bg-surface-variant/10'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined" style={activeTab === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            dashboard
          </span>
          <span className="font-caption text-caption mt-1">Dashboard</span>
        </a>

        <a
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            activeTab === 'log'
              ? 'text-primary dark:text-secondary-fixed-dim font-semibold'
              : 'text-on-surface-variant/60 dark:text-surface-variant/60 active:bg-surface-variant/10'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined" style={activeTab === 'log' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            add_circle
          </span>
          <span className="font-caption text-caption mt-1">Log Food</span>
        </a>

        <a
          className={`flex flex-col items-center justify-center transition-all duration-200 ${
            activeTab === 'settings'
              ? 'text-primary dark:text-secondary-fixed-dim font-semibold'
              : 'text-on-surface-variant/60 dark:text-surface-variant/60 active:bg-surface-variant/10'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined" style={activeTab === 'settings' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            settings
          </span>
          <span className="font-caption text-caption mt-1">Settings</span>
        </a>
      </div>
    </nav>
  )
}
