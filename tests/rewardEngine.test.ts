import { describe, it, expect } from 'vitest';
import {
  calculateRank,
  rollDailyChest,
  processDayStreak,
  calculateBatiMood,
} from '../src/lib/rewardEngine';
import { Subject } from '../src/types';

describe('rewardEngine', () => {
  describe('calculateRank', () => {
    it('asigna Novato para 0 a 199 XP', () => {
      const rank0 = calculateRank(0);
      expect(rank0.rank).toBe('Novato');
      expect(rank0.level).toBe(1);

      const rank150 = calculateRank(150);
      expect(rank150.rank).toBe('Novato');
    });

    it('asigna Explorador para 200 a 499 XP', () => {
      const rank250 = calculateRank(250);
      expect(rank250.rank).toBe('Explorador');
      expect(rank250.level).toBe(2);
    });

    it('asigna Estratega para 500 a 999 XP', () => {
      const rank600 = calculateRank(600);
      expect(rank600.rank).toBe('Estratega');
      expect(rank600.level).toBe(3);
    });

    it('asigna Maestro del Hilo para 1000+ XP', () => {
      const rank1200 = calculateRank(1200);
      expect(rank1200.rank).toBe('Maestro del Hilo');
      expect(rank1200.level).toBe(4);
    });
  });

  describe('rollDailyChest (Probabilidades configurables)', () => {
    it('otorga voltios con tirada de 0.0 a 0.60 (60% probabilidad)', () => {
      const drop = rollDailyChest(() => 0.25);
      expect(drop.type).toBe('volts');
      expect(drop.amount).toBeGreaterThanOrEqual(15);
    });

    it('otorga XP extra con tirada de 0.61 a 0.85 (25% probabilidad)', () => {
      const drop = rollDailyChest(() => 0.75);
      expect(drop.type).toBe('xp');
      expect(drop.amount).toBeGreaterThanOrEqual(50);
    });

    it('otorga cosmético con tirada de 0.86 a 0.95 (10% probabilidad)', () => {
      const drop = rollDailyChest(() => 0.90);
      expect(drop.type).toBe('cosmetic');
      expect(drop.itemKey).toBeDefined();
    });

    it('otorga escudo de racha con tirada de 0.96 a 1.00 (5% probabilidad)', () => {
      const drop = rollDailyChest(() => 0.98);
      expect(drop.type).toBe('streak_shield');
    });
  });

  describe('processDayStreak (Protección ética con escudo)', () => {
    it('mantiene la racha si la actividad es en el mismo día', () => {
      const res = processDayStreak('2026-10-20', '2026-10-20', 5, 1);
      expect(res.newStreak).toBe(5);
      expect(res.shieldConsumed).toBe(false);
      expect(res.streakBroken).toBe(false);
    });

    it('incrementa la racha en 1 si es el día inmediatamente siguiente', () => {
      const res = processDayStreak('2026-10-20', '2026-10-21', 5, 1);
      expect(res.newStreak).toBe(6);
      expect(res.shieldConsumed).toBe(false);
      expect(res.streakBroken).toBe(false);
    });

    it('consume el escudo de racha si se salta un día pero se tiene escudo guardado', () => {
      // Pasaron 2 días (del 20 al 22)
      const res = processDayStreak('2026-10-20', '2026-10-22', 5, 1);
      expect(res.newStreak).toBe(5); // Conserva la racha
      expect(res.newShields).toBe(0); // Gastó el escudo
      expect(res.shieldConsumed).toBe(true);
      expect(res.streakBroken).toBe(false);
    });

    it('reinicia la racha si se salta un día y NO tiene escudos', () => {
      const res = processDayStreak('2026-10-20', '2026-10-23', 5, 0);
      expect(res.newStreak).toBe(1);
      expect(res.streakBroken).toBe(true);
      expect(res.shieldConsumed).toBe(false);
    });

    it('respeta la pausa de vacaciones sin quebrar la racha', () => {
      const res = processDayStreak('2026-10-20', '2026-10-30', 10, 0, true);
      expect(res.newStreak).toBe(10);
      expect(res.streakBroken).toBe(false);
    });
  });

  describe('calculateBatiMood', () => {
    it('está feliz si las baterías están llenas', () => {
      const subjects: Subject[] = [
        {
          id: 's1',
          name: 'Física',
          code: 'FIS',
          colorTheme: 'blue',
          icon: 'Atom',
          topics: [
            { id: 't1', subjectId: 's1', name: 'T1', classDate: '2026-10-18', lastReviewedDate: '2026-10-20', status: 'green', timesReviewed: 2 },
            { id: 't2', subjectId: 's1', name: 'T2', classDate: '2026-10-19', lastReviewedDate: '2026-10-20', status: 'yellow', timesReviewed: 2 },
          ],
        },
      ];

      const res = calculateBatiMood(subjects, '2026-10-20');
      expect(res.mood).toBe('happy');
    });

    it('está cansada si el promedio de baterías decae a 1 bloque', () => {
      const subjects: Subject[] = [
        {
          id: 's1',
          name: 'Física',
          code: 'FIS',
          colorTheme: 'blue',
          icon: 'Atom',
          topics: [
            { id: 't1', subjectId: 's1', name: 'T1', classDate: '2026-10-01', lastReviewedDate: '2026-10-05', status: 'red', timesReviewed: 1 }, // 15 días = 1 bloque
            { id: 't2', subjectId: 's1', name: 'T2', classDate: '2026-10-02', lastReviewedDate: '2026-10-06', status: 'yellow', timesReviewed: 1 }, // 14 días = 1 bloque
          ],
        },
      ];

      const res = calculateBatiMood(subjects, '2026-10-20');
      expect(res.mood).toBe('tired');
    });
  });
});
