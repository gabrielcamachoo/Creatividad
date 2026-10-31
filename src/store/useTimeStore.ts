import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { formatISODate, getSimulatedDate } from '@/lib/timeEngine';

interface TimeState {
  offsetDays: number;
  baseTimestamp: number;
  getSimulatedDateStr: () => string;
  advanceDays: (days: number) => void;
  resetTime: () => void;
}

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      offsetDays: 0,
      baseTimestamp: Date.now(),

      getSimulatedDateStr: () => {
        const { offsetDays, baseTimestamp } = get();
        const date = getSimulatedDate(offsetDays, baseTimestamp);
        return formatISODate(date);
      },

      advanceDays: (days: number) => {
        set((state) => ({ offsetDays: state.offsetDays + days }));
      },

      resetTime: () => {
        set({ offsetDays: 0, baseTimestamp: Date.now() });
      },
    }),
    {
      name: 'semaforo_time_storage',
    }
  )
);
