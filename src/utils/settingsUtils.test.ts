import { describe, it, expect } from 'vitest';
import { getSyncBtnClasses, getContainerClasses } from './settingsUtils';

describe('settingsUtils', () => {
  describe('getSyncBtnClasses', () => {
    it('returns classes for syncing state', () => {
      const classes = getSyncBtnClasses('syncing');
      expect(classes).toContain('bg-secondary-fixed');
      expect(classes).toContain('opacity-80');
      expect(classes).toContain('cursor-not-allowed');
    });

    it('returns classes for synced state', () => {
      const classes = getSyncBtnClasses('synced');
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-white');
    });

    it('returns classes for idle state', () => {
      const classes = getSyncBtnClasses('idle');
      expect(classes).toContain('bg-secondary-fixed');
      expect(classes).not.toContain('cursor-not-allowed');
    });
  });

  describe('getContainerClasses', () => {
    it('appends focused styling when focused input matches inputId', () => {
      const classes = getContainerClasses('water', 'water');
      expect(classes).toContain('bg-surface-variant/5');
    });

    it('does not append focused styling when focused input does not match inputId', () => {
      const classes = getContainerClasses('calories', 'water');
      expect(classes).not.toContain('bg-surface-variant/5');
    });

    it('does not append focused styling when focused input is null', () => {
      const classes = getContainerClasses(null, 'water');
      expect(classes).not.toContain('bg-surface-variant/5');
    });
  });
});
