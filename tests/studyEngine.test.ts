import { describe, it, expect } from 'vitest';
import {
  calculateBatteryBlocks,
  calculatePrioritizedTopics,
  generateExamStudyPlan,
} from '../src/lib/studyEngine';
import { Subject } from '../src/types';

describe('studyEngine', () => {
  describe('calculateBatteryBlocks (Regla de 7 días)', () => {
    it('mantiene 3 bloques de 0 a 6 días', () => {
      const res0 = calculateBatteryBlocks('2026-10-20', '2026-10-20');
      expect(res0.blocks).toBe(3);
      expect(res0.isAtRisk).toBe(false);

      const res6 = calculateBatteryBlocks('2026-10-14', '2026-10-20');
      expect(res6.blocks).toBe(3);
      expect(res6.isAtRisk).toBe(false);
    });

    it('baja a 2 bloques al cumplir 7 a 13 días', () => {
      const res7 = calculateBatteryBlocks('2026-10-13', '2026-10-20');
      expect(res7.blocks).toBe(2);
      expect(res7.isAtRisk).toBe(false);

      const res13 = calculateBatteryBlocks('2026-10-07', '2026-10-20');
      expect(res13.blocks).toBe(2);
    });

    it('baja a 1 bloque al cumplir 14 a 20 días', () => {
      const res14 = calculateBatteryBlocks('2026-10-06', '2026-10-20');
      expect(res14.blocks).toBe(1);
      expect(res14.isAtRisk).toBe(false);
    });

    it('queda en 0 bloques y estado "En riesgo" a partir de 21 días', () => {
      const res21 = calculateBatteryBlocks('2026-09-29', '2026-10-20');
      expect(res21.blocks).toBe(0);
      expect(res21.isAtRisk).toBe(true);
    });
  });

  describe('calculatePrioritizedTopics', () => {
    const mockSubjects: Subject[] = [
      {
        id: 's1',
        name: 'Materia A',
        code: 'MAT-A',
        colorTheme: 'blue',
        icon: 'Book',
        topics: [
          {
            id: 't-green-fresh',
            subjectId: 's1',
            name: 'Tema Verde Fresco',
            classDate: '2026-10-18',
            lastReviewedDate: '2026-10-20',
            status: 'green',
            timesReviewed: 2,
          },
          {
            id: 't-red-low-bat',
            subjectId: 's1',
            name: 'Tema Rojo Batería Baja',
            classDate: '2026-10-01',
            lastReviewedDate: '2026-10-05', // 15 días = 1 bloque
            status: 'red',
            timesReviewed: 1,
          },
          {
            id: 't-yellow',
            subjectId: 's1',
            name: 'Tema Amarillo',
            classDate: '2026-10-10',
            lastReviewedDate: '2026-10-15', // 5 días = 3 bloques
            status: 'yellow',
            timesReviewed: 1,
          },
        ],
      },
    ];

    it('pone primero los temas en Rojo con batería baja antes que amarillos o verdes', () => {
      const prioritized = calculatePrioritizedTopics(mockSubjects, '2026-10-20');
      expect(prioritized.length).toBe(3);
      expect(prioritized[0].topic.id).toBe('t-red-low-bat');
      expect(prioritized[0].topic.status).toBe('red');
      expect(prioritized[1].topic.id).toBe('t-yellow');
      expect(prioritized[2].topic.id).toBe('t-green-fresh');
    });
  });

  describe('generateExamStudyPlan', () => {
    it('crea un plan distribuido por días antes del examen', () => {
      const subject: Subject = {
        id: 's-exam',
        name: 'Física',
        code: 'FIS',
        colorTheme: 'blue',
        icon: 'Atom',
        topics: [
          { id: 't1', subjectId: 's-exam', name: 'Tema 1', classDate: '2026-10-01', lastReviewedDate: '2026-10-10', status: 'red', timesReviewed: 0 },
          { id: 't2', subjectId: 's-exam', name: 'Tema 2', classDate: '2026-10-02', lastReviewedDate: '2026-10-12', status: 'yellow', timesReviewed: 0 },
          { id: 't3', subjectId: 's-exam', name: 'Tema 3', classDate: '2026-10-03', lastReviewedDate: '2026-10-15', status: 'green', timesReviewed: 0 },
        ],
      };

      const plan = generateExamStudyPlan(subject, '2026-10-25', '2026-10-20');
      expect(plan.length).toBe(5); // 5 días entre el 20 y el 25
      expect(plan[0].topics.length).toBeGreaterThanOrEqual(1);
    });
  });
});
