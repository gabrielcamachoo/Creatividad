import { Subject, SimulatedPeer, WeeklyHistoryPoint } from '@/types';

export const DEMO_SUBJECTS: Subject[] = [
  {
    id: 'sub-fisica',
    name: 'Física Mecánica',
    code: 'FIS-101',
    colorTheme: 'blue',
    icon: 'Atom',
    examDate: '2026-11-06',
    topics: [
      {
        id: 'top-fis-1',
        subjectId: 'sub-fisica',
        name: 'Cinemática en 1D y Gráficas de Movimiento',
        classDate: '2026-10-02',
        lastReviewedDate: '2026-10-27', // Fresco (2 días)
        status: 'green',
        timesReviewed: 3,
      },
      {
        id: 'top-fis-2',
        subjectId: 'sub-fisica',
        name: 'Leyes de Newton y Diagramas de Cuerpo Libre',
        classDate: '2026-10-10',
        lastReviewedDate: '2026-10-14', // 15 días (1 bloque / urgente)
        status: 'red',
        timesReviewed: 1,
      },
      {
        id: 'top-fis-3',
        subjectId: 'sub-fisica',
        name: 'Conservación de la Energía y Trabajo',
        classDate: '2026-10-16',
        lastReviewedDate: '2026-10-20', // 9 días (2 bloques)
        status: 'yellow',
        timesReviewed: 2,
      },
      {
        id: 'top-fis-4',
        subjectId: 'sub-fisica',
        name: 'Momento Lineal y Colisiones Elásticas',
        classDate: '2026-10-22',
        lastReviewedDate: '2026-10-24', // 5 días (3 bloques)
        status: 'yellow',
        timesReviewed: 1,
      },
    ],
  },
  {
    id: 'sub-calculo',
    name: 'Cálculo Diferencial',
    code: 'MAT-201',
    colorTheme: 'purple',
    icon: 'Sigma',
    examDate: '2026-11-12',
    topics: [
      {
        id: 'top-cal-1',
        subjectId: 'sub-calculo',
        name: 'Límites Indeterminados y Continuidad',
        classDate: '2026-10-04',
        lastReviewedDate: '2026-10-26', // 3 días (3 bloques)
        status: 'green',
        timesReviewed: 4,
      },
      {
        id: 'top-cal-2',
        subjectId: 'sub-calculo',
        name: 'Regla de la Cadena y Derivación Implícita',
        classDate: '2026-10-11',
        lastReviewedDate: '2026-10-13', // 16 días (1 bloque)
        status: 'yellow',
        timesReviewed: 2,
      },
      {
        id: 'top-cal-3',
        subjectId: 'sub-calculo',
        name: 'Optimización de Funciones y Máximos/Mínimos',
        classDate: '2026-10-18',
        lastReviewedDate: '2026-10-18', // 11 días (2 bloques)
        status: 'red',
        timesReviewed: 1,
      },
      {
        id: 'top-cal-4',
        subjectId: 'sub-calculo',
        name: 'Teorema del Valor Medio y Razones de Cambio',
        classDate: '2026-10-25',
        lastReviewedDate: '2026-10-28', // 1 día (3 bloques)
        status: 'green',
        timesReviewed: 2,
      },
    ],
  },
  {
    id: 'sub-programacion',
    name: 'Programación Orientada a Objetos',
    code: 'SIS-102',
    colorTheme: 'emerald',
    icon: 'Code2',
    examDate: '2026-11-18',
    topics: [
      {
        id: 'top-prog-1',
        subjectId: 'sub-programacion',
        name: 'Clases, Atributos y Métodos Constructores',
        classDate: '2026-10-03',
        lastReviewedDate: '2026-10-25', // 4 días (3 bloques)
        status: 'green',
        timesReviewed: 5,
      },
      {
        id: 'top-prog-2',
        subjectId: 'sub-programacion',
        name: 'Encapsulamiento y Modificadores de Acceso',
        classDate: '2026-10-09',
        lastReviewedDate: '2026-10-27', // 2 días (3 bloques)
        status: 'green',
        timesReviewed: 3,
      },
      {
        id: 'top-prog-3',
        subjectId: 'sub-programacion',
        name: 'Herencia y Sobrecarga de Métodos',
        classDate: '2026-10-17',
        lastReviewedDate: '2026-10-19', // 10 días (2 bloques)
        status: 'yellow',
        timesReviewed: 2,
      },
      {
        id: 'top-prog-4',
        subjectId: 'sub-programacion',
        name: 'Polimorfismo e Interfaces Abstractas',
        classDate: '2026-10-23',
        lastReviewedDate: '2026-10-23', // 6 días (3 bloques)
        status: 'red',
        timesReviewed: 1,
      },
      {
        id: 'top-prog-5',
        subjectId: 'sub-programacion',
        name: 'Manejo de Excepciones y Try-Catch-Finally',
        classDate: '2026-10-26',
        lastReviewedDate: '2026-10-28', // 1 día (3 bloques)
        status: 'yellow',
        timesReviewed: 1,
      },
    ],
  },
];

export const DEMO_SIMULATED_PEERS: SimulatedPeer[] = [
  {
    id: 'peer-1',
    name: 'Camila Ríos',
    avatar: 'CR',
    level: 3,
    weeklyXP: 420,
    streakDays: 12,
    dominantColor: 'text-purple-500 bg-purple-500/10',
  },
  {
    id: 'peer-2',
    name: 'Tú (Estudiante)',
    avatar: 'TU',
    level: 2,
    weeklyXP: 310,
    streakDays: 5,
    dominantColor: 'text-emerald-500 bg-emerald-500/10 border-2 border-emerald-500',
  },
  {
    id: 'peer-3',
    name: 'Mateo Gómez',
    avatar: 'MG',
    level: 2,
    weeklyXP: 290,
    streakDays: 8,
    dominantColor: 'text-blue-500 bg-blue-500/10',
  },
  {
    id: 'peer-4',
    name: 'Valentina Silva',
    avatar: 'VS',
    level: 2,
    weeklyXP: 240,
    streakDays: 4,
    dominantColor: 'text-amber-500 bg-amber-500/10',
  },
  {
    id: 'peer-5',
    name: 'Nicolás Torres',
    avatar: 'NT',
    level: 1,
    weeklyXP: 180,
    streakDays: 3,
    dominantColor: 'text-rose-500 bg-rose-500/10',
  },
];

export const DEMO_WEEKLY_HISTORY: WeeklyHistoryPoint[] = [
  { dayName: 'Lun', dateStr: '2026-10-23', reviewsCount: 3, xpEarned: 75, masteredCount: 1 },
  { dayName: 'Mar', dateStr: '2026-10-24', reviewsCount: 2, xpEarned: 50, masteredCount: 0 },
  { dayName: 'Mié', dateStr: '2026-10-25', reviewsCount: 4, xpEarned: 110, masteredCount: 2 },
  { dayName: 'Jue', dateStr: '2026-10-26', reviewsCount: 1, xpEarned: 25, masteredCount: 0 },
  { dayName: 'Vie', dateStr: '2026-10-27', reviewsCount: 3, xpEarned: 80, masteredCount: 1 },
  { dayName: 'Sáb', dateStr: '2026-10-28', reviewsCount: 2, xpEarned: 60, masteredCount: 1 },
  { dayName: 'Dom (Hoy)', dateStr: '2026-10-29', reviewsCount: 1, xpEarned: 30, masteredCount: 0 },
];
