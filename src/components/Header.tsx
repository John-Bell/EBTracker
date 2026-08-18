export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b-[0.5px] border-outline-variant/30">
      <div className="flex flex-col px-4 pt-6 pb-2 w-full">
        <div className="flex justify-between items-center mb-1">
          <h1 className="font-display text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">EBTracker</h1>
          <button
            onClick={() => { window.location.hash = '#/settings'; }}
            className="text-primary active:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="mt-2 pb-2">
          <h2 className="font-display text-headline-lg font-bold text-on-surface">{title}</h2>
        </div>
      </div>
    </header>
  )
}
