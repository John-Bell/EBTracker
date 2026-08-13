import { describe, it, expect } from 'vitest';
import { getOrdinalSuffix, formatSelectedDate, getDaysInWeek } from './logHistoryUtils';

describe('logHistoryUtils', () => {
  describe('getOrdinalSuffix', () => {
    it('returns correct suffix for various days', () => {
      expect(getOrdinalSuffix(1)).toBe('st');
      expect(getOrdinalSuffix(2)).toBe('nd');
      expect(getOrdinalSuffix(3)).toBe('rd');
      expect(getOrdinalSuffix(4)).toBe('th');
      expect(getOrdinalSuffix(11)).toBe('th');
      expect(getOrdinalSuffix(12)).toBe('th');
      expect(getOrdinalSuffix(13)).toBe('th');
      expect(getOrdinalSuffix(21)).toBe('st');
      expect(getOrdinalSuffix(22)).toBe('nd');
      expect(getOrdinalSuffix(23)).toBe('rd');
      expect(getOrdinalSuffix(31)).toBe('st');
    });
  });

  describe('formatSelectedDate', () => {
    it('formats valid ISO date strings correctly', () => {
      expect(formatSelectedDate('2024-08-14')).toBe('Wed, 14th Log');
      expect(formatSelectedDate('2024-08-01')).toBe('Thu, 1st Log');
      expect(formatSelectedDate('2024-08-22')).toBe('Thu, 22nd Log');
    });

    it('returns empty string for invalid date strings', () => {
      expect(formatSelectedDate('')).toBe('');
      expect(formatSelectedDate('invalid-date')).toBe('');
    });
  });

  describe('getDaysInWeek', () => {
    it('generates the 7 days of the week starting from Sunday', () => {
      const days = getDaysInWeek('2024-08-14'); // Wednesday
      expect(days).toHaveLength(7);

      // Sunday of that week should be 2024-08-11
      expect(days[0].dateStr).toBe('2024-08-11');
      expect(days[0].weekday).toBe('Sun');
      expect(days[0].dayNum).toBe(11);

      // Wednesday should be 2024-08-14
      expect(days[3].dateStr).toBe('2024-08-14');
      expect(days[3].weekday).toBe('Wed');
      expect(days[3].dayNum).toBe(14);

      // Saturday of that week should be 2024-08-17
      expect(days[6].dateStr).toBe('2024-08-17');
      expect(days[6].weekday).toBe('Sat');
      expect(days[6].dayNum).toBe(17);
    });
  });
});
