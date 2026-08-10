/**
 * Utility functions for Settings page class names generation and helper operations
 */

export function getSyncBtnClasses(syncState: 'idle' | 'syncing' | 'synced'): string {
  const baseClasses = "mt-4 w-full h-[50px] rounded-xl font-semibold text-body-lg active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2";

  if (syncState === 'syncing') {
    return `${baseClasses} bg-secondary-fixed text-on-secondary-fixed opacity-80 cursor-not-allowed`;
  }

  if (syncState === 'synced') {
    return `${baseClasses} bg-primary text-white`;
  }

  return `${baseClasses} bg-secondary-fixed text-on-secondary-fixed`;
}

export function getContainerClasses(focusedInput: string | null, inputId: string): string {
  const base = "relative flex items-center min-h-[44px] px-4 ios-list-item transition-colors duration-200";
  return focusedInput === inputId ? `${base} bg-surface-variant/5` : base;
}
