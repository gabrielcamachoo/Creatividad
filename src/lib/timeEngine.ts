/**
 * Motor de tiempo simulado (Virtual Clock).
 * Permite presentar la aplicación en 5 a 8 minutos simulando el paso de días (+1d, +7d)
 * sin depender ni alterar la hora del sistema operativo.
 */

export interface VirtualClockState {
  offsetDays: number; // Días añadidos artificialmente
  baseTimestamp: number; // Timestamp de inicio
}

export function getSimulatedDate(offsetDays: number = 0, baseTimestamp: number = Date.now()): Date {
  const date = new Date(baseTimestamp);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getDaysDifference(dateStrEarlier: string, dateStrLater: string): number {
  const d1 = new Date(dateStrEarlier + 'T00:00:00');
  const d2 = new Date(dateStrLater + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return formatISODate(d);
}

export function formatFriendlyDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthIdx = parseInt(month, 10) - 1;
  return `${day} ${months[monthIdx] || month} ${year}`;
}
