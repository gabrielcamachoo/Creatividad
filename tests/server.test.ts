import { describe, it, expect } from 'vitest';
import { calculatePrioritizedTopics } from '../src/lib/studyEngine';
import { Subject } from '../src/types';

describe('Backend Logic & Study Report Generation', () => {
  const sampleSubjects: Subject[] = [
    {
      id: 'sub-test',
      name: 'Matemáticas Bachillerato',
      code: 'MAT',
      colorTheme: 'blue',
      icon: 'Sigma',
      topics: [
        {
          id: 't-green',
          subjectId: 'sub-test',
          name: 'Operaciones Básicas',
          classDate: '2026-10-25',
          lastReviewedDate: '2026-10-28',
          status: 'green',
          timesReviewed: 3,
        },
        {
          id: 't-yellow',
          subjectId: 'sub-test',
          name: 'Fracciones y Porcentajes',
          classDate: '2026-10-15',
          lastReviewedDate: '2026-10-18', // 11 días = 2 bloques
          status: 'yellow',
          timesReviewed: 1,
        },
        {
          id: 't-red',
          subjectId: 'sub-test',
          name: 'Ecuaciones Cuadráticas',
          classDate: '2026-10-05',
          lastReviewedDate: '2026-10-08', // 21 días = 0 bloques (en riesgo)
          status: 'red',
          timesReviewed: 0,
        },
      ],
    },
  ];

  it('el plan de ataque prioriza primero los temas no dominados en orden de riesgo', () => {
    const prioritized = calculatePrioritizedTopics(sampleSubjects, '2026-10-29');
    const pending = prioritized.filter(
      (item) => item.topic.status === 'red' || item.topic.status === 'yellow' || item.batteryBlocks === 0
    );

    expect(pending.length).toBe(2);
    // El tema rojo debe ser el #1
    expect(pending[0].topic.id).toBe('t-red');
    expect(pending[0].urgencyLabel).toBe('Crítico');
    expect(pending[0].topic.status).toBe('red');

    // El tema amarillo debe ser el #2
    expect(pending[1].topic.id).toBe('t-yellow');
    expect(pending[1].topic.status).toBe('yellow');
  });

  it('calcula la carga horaria recomendada basada en la severidad del semáforo', () => {
    const redCount = 2; // 2 * 45 min = 90 min
    const yellowCount = 3; // 3 * 25 min = 75 min
    const totalMinutes = redCount * 45 + yellowCount * 25; // 165 min
    const estimatedHours = Math.ceil(totalMinutes / 60); // 3 horas

    expect(estimatedHours).toBe(3);
  });
});
