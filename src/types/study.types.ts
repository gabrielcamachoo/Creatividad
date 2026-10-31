export type MasteryLevel = 'green' | 'yellow' | 'red';

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  classDate: string;          // ISO Date YYYY-MM-DD
  lastReviewedDate: string;   // ISO Date YYYY-MM-DD
  status: MasteryLevel;       // green = sé explicarlo, yellow = falta práctica, red = vacío/duda
  timesReviewed: number;
  summary?: string;           // Ficha de resumen / apuntes / fórmulas
  summaryPhoto?: string;      // Foto del apunte / diagrama (Base64)
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  colorTheme: string;         // 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  emoji?: string;             // Emoji representativo (📐, 🧬, 🩺, etc.)
  icon: string;               // Nombre de ícono de Lucide
  summary?: string;           // Resumen del sílabo / objetivos de la materia
  summaryPhoto?: string;      // Foto de temario / mapa conceptual
  topics: Topic[];
  examDate?: string;          // Para el Modo Parcial
}

export interface ScheduleItem {
  id: string;
  subjectId?: string;
  subjectName: string;
  subjectEmoji?: string;
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
  startTime: string;          // HH:mm (e.g. "08:00")
  endTime: string;            // HH:mm (e.g. "10:00")
  room?: string;              // "Salón 301", "Laboratorio 2", "Aula Virtual"
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  streakDays: number;
  level: number;
  xp: number;
  equippedAnimal?: string;
  photoUrl?: string;
  cheeredToday?: boolean;
}

export interface PrioritizedTopic {
  topic: Topic;
  subjectName: string;
  subjectCode: string;
  subjectColor: string;
  batteryBlocks: number;
  daysSinceReview: number;
  isAtRisk: boolean;
  priorityScore: number;
  urgencyLabel: string;
  actionReason: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  dateStr: string;
  topics: PrioritizedTopic[];
}
