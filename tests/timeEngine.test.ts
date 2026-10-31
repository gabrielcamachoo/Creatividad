import { describe, it, expect } from 'vitest';
import {
  getDaysDifference,
  addDaysToDate,
  formatFriendlyDate,
} from '../src/lib/timeEngine';

describe('timeEngine', () => {
  it('calcula correctamente la diferencia en días', () => {
    expect(getDaysDifference('2026-10-01', '2026-10-08')).toBe(7);
    expect(getDaysDifference('2026-10-01', '2026-10-15')).toBe(14);
    expect(getDaysDifference('2026-10-08', '2026-10-01')).toBe(0); // No negativo
  });

  it('añade días a una fecha ISO', () => {
    expect(addDaysToDate('2026-10-10', 5)).toBe('2026-10-15');
    expect(addDaysToDate('2026-10-25', 7)).toBe('2026-11-01');
  });

  it('formatea fechas legibles', () => {
    expect(formatFriendlyDate('2026-10-29')).toContain('29');
    expect(formatFriendlyDate('2026-10-29')).toContain('Oct');
    expect(formatFriendlyDate('2026-10-29')).toContain('2026');
  });
});
