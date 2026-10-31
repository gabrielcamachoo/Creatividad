import { Subject, Topic, PrioritizedTopic, StudyPlanDay } from '@/types';
import { getDaysDifference, addDaysToDate, formatFriendlyDate } from './timeEngine';

/**
 * Calcula los bloques de la batería de 7 días.
 * - 0 a 6 días: 3 bloques (Fresco)
 * - 7 a 13 días: 2 bloques (Perdió 1 bloque por cada 7 días)
 * - 14 a 20 días: 1 bloque (Urgente)
 * - 21+ días: 0 bloques (En riesgo)
 */
export function calculateBatteryBlocks(lastReviewedDate: string, currentDate: string): {
  blocks: number;
  daysSinceReview: number;
  isAtRisk: boolean;
} {
  const daysSinceReview = getDaysDifference(lastReviewedDate, currentDate);
  let blocks = 3;
  let isAtRisk = false;

  if (daysSinceReview >= 21) {
    blocks = 0;
    isAtRisk = true;
  } else if (daysSinceReview >= 14) {
    blocks = 1;
  } else if (daysSinceReview >= 7) {
    blocks = 2;
  } else {
    blocks = 3;
  }

  return { blocks, daysSinceReview, isAtRisk };
}

/**
 * Priorizador de estudio automático:
 * Orden:
 * 1. Temas en Rojo (vacíos críticos) con batería baja
 * 2. Temas en Rojo con batería alta
 * 3. Temas en Amarillo con batería baja o en riesgo
 * 4. Temas en Amarillo con batería alta
 * 5. Temas en Verde con batería baja (evitar olvido de lo dominado)
 * 6. Temas en Verde con batería llena
 */
export function calculatePrioritizedTopics(subjects: Subject[], currentDate: string): PrioritizedTopic[] {
  const prioritized: PrioritizedTopic[] = [];

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const { blocks, daysSinceReview, isAtRisk } = calculateBatteryBlocks(topic.lastReviewedDate, currentDate);

      let score = 0;
      let urgencyLabel = 'Normal';
      let actionReason = '';

      // Peso por semáforo
      if (topic.status === 'red') {
        score += 300;
        urgencyLabel = 'Crítico';
        actionReason = 'Tienes un vacío conceptual urgente';
      } else if (topic.status === 'yellow') {
        score += 150;
        urgencyLabel = 'Prioritario';
        actionReason = 'Entiendes la teoría pero te falta práctica';
      } else {
        score += 30;
        urgencyLabel = 'Mantenimiento';
        actionReason = 'Tema dominado; conserva su frescura';
      }

      // Penalización por batería
      if (blocks === 0) {
        score += 120;
        actionReason += ' • ¡Batería agotada (>21 días en riesgo)!';
      } else if (blocks === 1) {
        score += 80;
        actionReason += ' • Batería baja (≥14 días sin repasar)';
      } else if (blocks === 2) {
        score += 40;
        actionReason += ' • Batería en descenso (≥7 días sin repasar)';
      }

      prioritized.push({
        topic,
        subjectName: subject.name,
        subjectCode: subject.code,
        subjectColor: subject.colorTheme,
        batteryBlocks: blocks,
        daysSinceReview,
        isAtRisk,
        priorityScore: score,
        urgencyLabel,
        actionReason,
      });
    }
  }

  // Ordenar de mayor a menor urgencia
  return prioritized.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Generador de Plan de Ataque para el Modo Parcial.
 * Divide los temas de la materia entre los días restantes hasta la fecha del examen.
 */
export function generateExamStudyPlan(
  subject: Subject,
  examDateStr: string,
  currentDateStr: string
): StudyPlanDay[] {
  const daysLeft = getDaysDifference(currentDateStr, examDateStr);
  if (daysLeft <= 0 || subject.topics.length === 0) {
    return [];
  }

  // Obtenemos los temas de la materia ordenados por prioridad
  const prioritized = calculatePrioritizedTopics([subject], currentDateStr);

  // Distribuimos los temas en los días disponibles (máximo 7 días para no saturar)
  const planningDays = Math.min(daysLeft, 7);
  const plan: StudyPlanDay[] = [];

  for (let i = 0; i < planningDays; i++) {
    const dayDate = addDaysToDate(currentDateStr, i);
    plan.push({
      dayNumber: i + 1,
      dateStr: formatFriendlyDate(dayDate),
      topics: [],
    });
  }

  // Asignación equitativa dando los temas más difíciles primero
  prioritized.forEach((topicItem, index) => {
    const targetDayIndex = index % planningDays;
    plan[targetDayIndex].topics.push(topicItem);
  });

  return plan;
}
