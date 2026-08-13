/**
 * Utility functions for LogHistory page calculations and formatting
 */

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatSelectedDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return '';
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = d.getDate();
  return `${weekday}, ${dayNum}${getOrdinalSuffix(dayNum)} Log`;
}

export interface WeekDayInfo {
  dateStr: string;
  dayNum: number;
  weekday: string;
}

export function getDaysInWeek(dateStr: string): WeekDayInfo[] {
  let d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) {
    d = new Date();
  }

  const dayOfWeek = d.getDay(); // 0 (Sun) to 6 (Sat)
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dayOfWeek);

  const days: WeekDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(sunday);
    current.setDate(sunday.getDate() + i);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const date = String(current.getDate()).padStart(2, '0');
    const currentStr = `${year}-${month}-${date}`;

    days.push({
      dateStr: currentStr,
      dayNum: current.getDate(),
      weekday: current.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }

  return days;
}
