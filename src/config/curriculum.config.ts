import { PUJ_BOGOTA_CAREERS } from './pujBogotaPensumData';

export interface SubjectTemplate {
  name: string;
  code: string;
  credits?: number;
  semester?: number;
  colorTheme: string;
  emoji: string;
  topics: { name: string; status: 'green' | 'yellow' | 'red'; summary?: string }[];
  summary?: string;
}

export interface CareerOption {
  id: string;
  name: string;
  faculty: string;
  university?: string;
  snies?: string;
  semesters?: number;
  totalCredits?: number;
  emoji: string;
  description: string;
  subjects: SubjectTemplate[];
}

export interface GradeOption {
  id: string;
  name: string;
  emoji: string;
  description: string;
  subjects: SubjectTemplate[];
}

function schoolSub(
  code: string,
  name: string,
  emoji: string,
  colorTheme: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose',
  summary: string,
  topicNames: string[]
): SubjectTemplate {
  return {
    code,
    name,
    emoji,
    colorTheme,
    summary,
    topics: topicNames.map((t) => ({
      name: t,
      status: 'red',
      summary: `Tema de ${name}: ${summary}`,
    })),
  };
}

export const SCHOOL_TEMPLATES: GradeOption[] = [
  {
    id: 'school_10_11',
    name: 'Bachillerato (10° y 11° Grado · ICFES Saber 11°)',
    emoji: '🎒',
    description: 'Preparación para el ICFES Saber 11° y admisión a la Universidad Javeriana.',
    subjects: [
      schoolSub(
        'MAT-11',
        'Trigonometría y Cálculo',
        '📐',
        'blue',
        'Identidades trigonométricas, funciones, límites y derivadas.',
        [
          'Razones Trigonométricas (SohCahToa)',
          'Ley del Seno y del Coseno',
          'Identidades Trigonométricas Fundamentales',
          'Límites y Continuidad de Funciones',
        ]
      ),
      schoolSub(
        'FIS-11',
        'Física Clásica',
        '⚡',
        'purple',
        'Cinemática, leyes de Newton, conservación de energía, ondas y termodinámica.',
        [
          'Cinemática y Tiro Parabólico',
          'Leyes de Newton y Diagramas de Cuerpo Libre',
          'Trabajo, Potencia y Conservación de la Energía',
          'Movimiento Armónico Simple y Ondas',
        ]
      ),
      schoolSub(
        'QUI-11',
        'Química General y Orgánica',
        '🔬',
        'emerald',
        'Estequiometría, gases ideales, soluciones, pH y grupos funcionales orgánicos.',
        [
          'Balanceo de Ecuaciones y Estequiometría',
          'Leyes de los Gases Ideales (PV = nRT)',
          'Soluciones, Molaridad y Equilibrio Ácido-Base (pH)',
          'Nomenclatura de Hidrocarburos y Grupos Funcionales',
        ]
      ),
      schoolSub(
        'BIO-11',
        'Biología y Genética',
        '🧬',
        'emerald',
        'Biología celular, genética mendeliana, síntesis de proteínas y ecología.',
        [
          'Mitosis, Meiosis y Ciclo Celular',
          'Leyes de Mendel y Cuadros de Punnett',
          'Replicación, Transcripción y Traducción del ADN',
          'Dinámica de Ecosistemas y Flujo de Energía',
        ]
      ),
      schoolSub(
        'LEN-11',
        'Lectura Crítica y Lengua Castellana',
        '📚',
        'rose',
        'Comprensión lectora, argumentación, filosofía y análisis de textos.',
        [
          'Estructura del Ensayo Argumentativo (Tesis y Argumentos)',
          'Falacias Argumentativas e Inferencia Crítica',
          'Literatura Contemporánea y Análisis Intertextual',
        ]
      ),
      schoolSub(
        'ING-11',
        'Inglés B1/B2',
        '🇬🇧',
        'amber',
        'Gramática comunicativa, comprensión lectora y condicionales.',
        [
          'Present Perfect vs Past Simple',
          'First, Second and Third Conditionals',
          'Passive Voice & Reported Speech',
        ]
      ),
    ],
  },
  {
    id: 'school_6_9',
    name: 'Secundaria Básica (6° a 9° Grado)',
    emoji: '🎒',
    description: 'Bases de álgebra, geometría, ciencias naturales, historia y lenguaje.',
    subjects: [
      schoolSub(
        'MAT-09',
        'Álgebra y Geometría',
        '📐',
        'blue',
        'Operaciones algebraicas, casos de factorización y sistemas de ecuaciones.',
        [
          'Operaciones con Fracciones y Potenciación',
          'Productos Notables y Casos de Factorización',
          'Ecuaciones Lineales y Sistemas 2x2',
          'Teorema de Pitágoras y Áreas Sombradas',
        ]
      ),
      schoolSub(
        'CNA-09',
        'Ciencias Naturales',
        '🌿',
        'emerald',
        'La célula, sistemas del cuerpo humano, tabla periódica y materia.',
        [
          'Organelos Celulares y sus Funciones',
          'Sistemas Digestivo, Circulatorio y Respiratorio',
          'Tabla Periódica y Enlaces Químicos',
        ]
      ),
      schoolSub(
        'SOC-09',
        'Ciencias Sociales e Historia',
        '🏛️',
        'amber',
        'Geografía física, historia universal, historia de Colombia y Constitución.',
        [
          'Civilizaciones Antiguas y Edad Moderna',
          'Geografía de Colombia y Regiones Naturales',
          'Derechos Fundamentales y Ramas del Poder Público',
        ]
      ),
    ],
  },
];

/**
 * Catálogo completo de los Pregrados Oficiales de la Pontificia Universidad Javeriana (Sede Bogotá)
 * con todas las asignaturas por semestre y los temas oficiales extraídos de los sílabos (Syllabus).
 */
export const UNIVERSITY_TEMPLATES: CareerOption[] = PUJ_BOGOTA_CAREERS;

export interface AnimalCompanion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bonus: string;
  priceVolts: number;
}

export const ANIMAL_COMPANIONS: AnimalCompanion[] = [
  {
    id: 'owl',
    name: 'Búho Sabio',
    emoji: '🦉',
    description: 'Siempre atento, te acompaña durante las noches de estudio profundo.',
    bonus: '+10% XP en sesiones de repaso',
    priceVolts: 0,
  },
  {
    id: 'fox',
    name: 'Zorro Astuto',
    emoji: '🦊',
    description: 'Rápido y observador, ideal para detectar temas que están por olvidar batería.',
    bonus: '+5 Voltios al rescatar baterías rojas',
    priceVolts: 25,
  },
  {
    id: 'cat',
    name: 'Michi Lector',
    emoji: '🐱',
    description: 'Ama los resúmenes bien hechos y el silencio para concentrarse.',
    bonus: '+15 XP al guardar resúmenes y fotos',
    priceVolts: 35,
  },
  {
    id: 'dog',
    name: 'Perrito Leal',
    emoji: '🐶',
    description: 'Compañero fiel que no te deja abandonar tu racha diaria.',
    bonus: 'Genera 1 escudo de racha cada 10 días',
    priceVolts: 45,
  },
  {
    id: 'dragon',
    name: 'Dragoncito Cósmico',
    emoji: '🐲',
    description: 'Furia de estudio legendaria para semanas de parciales y finales.',
    bonus: 'Multiplicador x1.5 de XP en modo parcial',
    priceVolts: 70,
  },
  {
    id: 'axolotl',
    name: 'Ajolote Zen',
    emoji: '🦎',
    description: 'Mantiene la calma bajo presión y regenera energía de estudio.',
    bonus: 'Las baterías duran 9 días en vez de 7',
    priceVolts: 55,
  },
  {
    id: 'robot',
    name: 'Robot Códex',
    emoji: '🤖',
    description: 'Lógica implacable, memorización de fórmulas y algoritmos exactos.',
    bonus: '+20% XP en retos Explica en 60s',
    priceVolts: 50,
  },
];

export const SUBJECT_EMOJI_LIST = [
  '📐', '🧬', '🩺', '⚖️', '💻', '🔬', '🎨', '🏛️',
  '📊', '🌍', '📚', '🇬🇧', '⚡', '🧪', '🫀', '🧠',
  '🚀', '🗄️', '📜', '💊', '🤖', '🎵', '📈', '💼', '🧭',
  '🦷', '💉', '🌿', '🦠', '🥗', '♾️', '💹', '🎙️', '🎭', '🏺', '🦉', '🌳', '🕊️',
];

/**
 * Las Facultades oficiales de la Pontificia Universidad Javeriana (Sede Bogotá)
 */
export const PUJ_FACULTIES: string[] = Array.from(
  new Set(
    UNIVERSITY_TEMPLATES.filter((c) => c.id !== 'personalizada').map((c) => c.faculty)
  )
);

export const MOTIVATIONAL_QUOTES = [
  {
    text: 'No se trata de estudiar más horas sin rumbo, sino de atacar primero tus puntos rojos con enfoque total.',
    author: 'Método MiSemáforo',
    tag: 'Enfoque Inteligente',
    imageBg: 'from-emerald-500/20 via-teal-500/10 to-sky-500/20',
  },
  {
    text: 'Si no puedes explicarlo de forma sencilla con tus propias palabras, todavía no lo has entendido lo suficiente.',
    author: 'Richard Feynman',
    tag: 'Técnica Feynman',
    imageBg: 'from-amber-500/20 via-orange-500/10 to-rose-500/20',
  },
  {
    text: 'La constancia diaria vence a los maratones de última hora antes del parcial. Cada repaso de 5 minutos cuenta.',
    author: 'Repetición Espaciada',
    tag: 'Hábito Ganador',
    imageBg: 'from-purple-500/20 via-indigo-500/10 to-blue-500/20',
  },
  {
    text: 'En el camino hacia el Más (Magis Javeriano), la excelencia nace de conocer con honestidad qué dominas y qué debes reforzar hoy.',
    author: 'Espíritu Javeriano',
    tag: 'Magis Académico',
    imageBg: 'from-blue-500/20 via-amber-500/10 to-emerald-500/20',
  },
];
