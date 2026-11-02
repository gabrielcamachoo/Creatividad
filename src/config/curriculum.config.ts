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

/**
 * Helper para crear asignaturas del pensum de la Pontificia Universidad Javeriana
 * de forma compacta, limpia y con todos sus temas iniciales listos para estudiar.
 */
function pujSub(
  code: string,
  name: string,
  emoji: string,
  colorTheme: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose',
  summary: string,
  topicNames: string[],
  semester: number = 1,
  credits: number = 3
): SubjectTemplate {
  return {
    code,
    name,
    emoji,
    colorTheme,
    summary,
    semester,
    credits,
    topics: topicNames.map((t) => ({
      name: t,
      status: 'red',
      summary: `Tema oficial del pensum PUJ · ${name} (${credits} créditos).`,
    })),
  };
}

export const SCHOOL_TEMPLATES: GradeOption[] = [
  {
    id: 'school_10_11',
    name: 'Bachillerato (10° y 11° Grado)',
    emoji: '🎒',
    description: 'Preparación para el ICFES Saber 11° y admisión universitaria.',
    subjects: [
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
      pujSub(
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
 * Catálogo completo de los Pregrados Oficiales de la Pontificia Universidad Javeriana (PUJ)
 * organizados por sus 18 Facultades con las asignaturas troncales de cada Pensum.
 */
export const UNIVERSITY_TEMPLATES: CareerOption[] = [
  // ============================================================================
  // 1. FACULTAD DE INGENIERÍA (9 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_ing_sistemas',
    name: 'Ingeniería de Sistemas',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '💻',
    description: 'Desarrollo de software, estructuras de datos, arquitectura empresarial, IA y sistemas distribuidos.',
    subjects: [
      pujSub('MAT-1200', 'Cálculo Diferencial', '📐', 'blue', 'Funciones, límites, continuidad, derivadas y optimización.', [
        'Límites, Continuidad y Asíntotas',
        'Regla de la Cadena y Derivación Implícita',
        'Razones de Cambio Relacionadas',
        'Optimización y Criterio de la 1ra y 2da Derivada',
      ], 1, 3),
      pujSub('MAT-1202', 'Álgebra Lineal', '📊', 'amber', 'Sistemas lineales, matrices, espacios vectoriales y valores propios.', [
        'Eliminación de Gauss-Jordan y Matrices Inversas',
        'Determinantes y Regla de Cramer',
        'Espacios Vectoriales, Base y Dimensión',
        'Valores y Vectores Propios (Eigenvalues & Eigenvectors)',
      ], 1, 3),
      pujSub('ISI-1101', 'Introducción a la Programación', '💻', 'emerald', 'Algoritmia, estructuras de control, funciones, arreglos y flujo de datos.', [
        'Variables, Expresiones y Condicionales',
        'Ciclos (while, for) y Descomposición Funcional',
        'Arreglos, Matrices y Cadenas de Caracteres',
        'Manejo de Archivos y Estructuras en Memoria',
      ], 1, 3),
      pujSub('ISI-1202', 'Programación Avanzada (POO)', '🚀', 'purple', 'Programación orientada a objetos, herencia, polimorfismo, patrones y C++/Java.', [
        'Clases, Objetos, Encapsulamiento y Constructores',
        'Herencia, Polimorfismo y Clases Abstractas',
        'Manejo de Excepciones y Colecciones Genéricas',
        'Principios SOLID y Patrones de Diseño Básicos',
      ], 2, 3),
      pujSub('ISI-2103', 'Estructuras de Datos', '🌳', 'purple', 'Complejidad Big-O, listas enlazadas, pilas, colas, árboles AVL, tablas hash y grafos.', [
        'Análisis de Complejidad Asintótica (Big-O)',
        'Listas Enlazadas, Pilas (Stacks) y Colas (Queues)',
        'Árboles Binarios de Búsqueda (BST), AVL y Roji-Negros',
        'Grafos: Recorridos BFS, DFS y Algoritmo de Dijkstra',
      ], 3, 3),
      pujSub('ISI-2204', 'Bases de Datos', '🗄️', 'emerald', 'Diseño conceptual E-R, modelo relacional, normalización, SQL y transacciones ACID.', [
        'Modelo Entidad-Relación (MER) y Transformación Relacional',
        'Álgebra Relacional y Consultas SQL Avanzadas (JOIN, GROUP BY)',
        'Normalización (1FN, 2FN, 3FN y BCNF)',
        'Índices, Transacciones ACID y Control de Concurrencia',
      ], 3, 4),
      pujSub('ISI-3105', 'Ingeniería de Software y Arquitectura', '🏗️', 'blue', 'Requisitos, arquitectura limpia, microservicios, pruebas automatizadas y DevOps.', [
        'Ingeniería de Requerimientos e Historias de Usuario',
        'Estilos Arquitectónicos (Capas, Hexagonal, Microservicios)',
        'Pruebas Unitarias, Integración y CI/CD',
      ], 4, 3),
      pujSub('ISI-3206', 'Sistemas Operativos y Redes', '🌐', 'rose', 'Procesos, hilos, memoria virtual, concurrencia y pila de protocolos TCP/IP.', [
        'Planificación de Procesos, Hilos y Semáforos/Mutex',
        'Gestión de Memoria Virtual y Paginación',
        'Modelo OSI y Protocolos TCP/UDP, IP y HTTP/TLS',
      ], 5, 3),
    ],
  },
  {
    id: 'puj_ing_industrial',
    name: 'Ingeniería Industrial',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 147,
    emoji: '⚙️',
    description: 'Investigación de operaciones, logística, cadena de suministro, procesos estocásticos y calidad.',
    subjects: [
      pujSub('MAT-1201', 'Cálculo Integral y Ecuaciones Diferenciales', '📐', 'blue', 'Técnicas de integración, series y ecuaciones diferenciales ordinarias.', [
        'Integración por Sustitución y por Partes',
        'Fracciones Parciales e Integrales Impropias',
        'Ecuaciones Diferenciales de Primer y Segundo Orden',
      ], 2, 3),
      pujSub('IIN-2101', 'Probabilidad y Estadística Inferencial', '📊', 'purple', 'Variables aleatorias, distribuciones, intervalos de confianza y pruebas de hipótesis.', [
        'Teorema de Bayes y Variables Aleatorias Discretas/Continuas',
        'Distribuciones Normal, Binomial, Poisson y Exponencial',
        'Intervalos de Confianza y Pruebas de Hipótesis (t, Z, Chi²)',
        'Regresión Lineal Simple y Múltiple (ANOVA)',
      ], 3, 3),
      pujSub('IIN-2202', 'Investigación de Operaciones (Optimización)', '📈', 'emerald', 'Programación lineal, método Simplex, dualidad, sensibilidad y programación entera.', [
        'Formulación de Modelos de Programación Lineal',
        'Algoritmo Simplex y Método de las Dos Fases',
        'Teoría de Dualidad y Análisis de Sensibilidad',
        'Modelos de Transporte, Asignación y Flujo en Redes',
      ], 4, 3),
      pujSub('IIN-3103', 'Procesos Estocásticos', '🎲', 'amber', 'Cadenas de Markov en tiempo discreto y continuo, y teoría de colas.', [
        'Cadenas de Markov en Tiempo Discreto y Probabilidades de Estado Estable',
        'Cadenas Absorbentes y Tiempos de Primera Pasada',
        'Procesos de Poisson y Cadenas en Tiempo Continuo',
        'Teoría de Colas (M/M/1, M/M/s y Ley de Little)',
      ], 5, 3),
      pujSub('IIN-3204', 'Planeación y Control de Producción y Operaciones', '🏭', 'rose', 'Pronósticos de demanda, planeación agregada, MRP, inventarios y Lean Manufacturing.', [
        'Métodos de Pronóstico (Suavización Exponencial, Holt-Winters)',
        'Gestión de Inventarios (EOQ, Lote Económico e Inventario de Seguridad)',
        'Planeación Agregada, MPS y MRP',
      ], 5, 3),
      pujSub('IIN-4105', 'Ingeniería Económica y Financiera', '💰', 'emerald', 'Valor del dinero en el tiempo, VPN, TIR y evaluación financiera de proyectos.', [
        'Interés Compuesto, Tasas Nominales y Efectivas',
        'Anualidades, Gradientes y Tablas de Amortización',
        'Evaluación de Proyectos: VPN, TIR, CAUE y WACC',
      ], 4, 3),
    ],
  },
  {
    id: 'puj_ing_civil',
    name: 'Ingeniería Civil',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 146,
    emoji: '🏗️',
    description: 'Análisis estructural, geotecnia, hidráulica, vías y transporte, y gerencia de construcción.',
    subjects: [
      pujSub('ICI-1101', 'Estática y Mecánica de Materiales', '🔩', 'blue', 'Equilibrio de cuerpos rígidos, armaduras, esfuerzos, deformaciones y vigas.', [
        'Equilibrio de Partículas y Cuerpos Rígidos en 2D y 3D',
        'Análisis de Armaduras (Nodos y Secciones)',
        'Diagramas de Fuerza Cortante y Momento Flector en Vigas',
        'Esfuerzo Normal, Cortante, Torsión y Círculo de Mohr',
      ], 2, 3),
      pujSub('ICI-2102', 'Mecánica de Fluidos e Hidráulica', '💧', 'emerald', 'Hidrostática, ecuación de Bernoulli, flujo en tuberías y canales abiertos.', [
        'Presión Hidrostática y Fuerzas sobre Superficies Sumergidas',
        'Ecuación de Continuidad, Energía (Bernoulli) y Cantidad de Movimiento',
        'Pérdidas por Fricción (Darcy-Weisbach) y Redes de Tuberías',
        'Flujo en Canales Abiertos y Ecuación de Manning',
      ], 4, 3),
      pujSub('ICI-2203', 'Geotecnia y Mecánica de Suelos', '🪨', 'amber', 'Propiedades índice, clasificación de suelos, consolidación y resistencia al corte.', [
        'Relaciones Gravimétricas y Volumétricas del Suelo',
        'Granulometría, Límites de Atterberg y Clasificación USCS/AASHTO',
        'Esfuerzos Efectivos, Flujo de Agua y Consolidación de Terzaghi',
        'Criterio de Falla de Mohr-Coulomb y Capacidad Portante',
      ], 4, 4),
      pujSub('ICI-3104', 'Análisis Estructural y Diseño en Concreto', '🏢', 'rose', 'Métodos de energía, análisis matricial de estructuras y diseño NSR-10.', [
        'Deflexiones en Vigas y Métodos Energéticos (Trabajo Virtual)',
        'Método de la Rigidez para Pórticos y Cerchas',
        'Diseño de Vigas y Columnas en Concreto Reforzado (NSR-10)',
      ], 5, 4),
    ],
  },
  {
    id: 'puj_ing_electronica',
    name: 'Ingeniería Electrónica',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🔌',
    description: 'Circuitos eléctricos, sistemas digitales, procesamiento de señales, control y embebidos.',
    subjects: [
      pujSub('IEL-1101', 'Análisis de Circuitos Eléctricos', '⚡', 'amber', 'Leyes de Kirchhoff, teoremas de Thévenin/Norton, circuitos RC/RL/RLC y fasores.', [
        'Leyes de Kirchhoff (LVK y LCK), Análisis de Nodos y Mallas',
        'Teoremas de Superposición, Thévenin, Norton y Máxima Transferencia',
        'Respuesta Transitoria de Circuitos de 1er y 2do Orden (RC, RL, RLC)',
        'Análisis en Estado Estacionario Sinusoidal con Fasores',
      ], 2, 3),
      pujSub('IEL-2102', 'Electrónica Analógica y Semiconductores', '📟', 'purple', 'Diodos, transistores BJT y MOSFET, amplificadores operacionales y respuesta en frecuencia.', [
        'Diodos Semiconductores, Rectificadores y Reguladores Zener',
        'Polarización y Modelo de Pequeña Señal de Transistores BJT y MOSFET',
        'Amplificadores Operacionales Ideales y Reales',
      ], 3, 4),
      pujSub('IEL-2203', 'Diseño Digital y Microcontroladores', '🤖', 'blue', 'Álgebra booleana, máquinas de estados finitos (FSM), VHDL/FPGA y sistemas embebidos.', [
        'Compuertas Lógicas, Mapas de Karnaugh y Circuitos Combinacionales',
        'Flip-Flops, Registros, Contadores y Máquinas de Estados (Moore y Mealy)',
        'Arquitectura de Microcontroladores, Interrupciones, PWM y ADC',
      ], 4, 3),
      pujSub('IEL-3104', 'Señales, Sistemas y Control Automático', '📡', 'emerald', 'Transformada de Fourier, Laplace, transformada Z y controladores PID.', [
        'Convolución en Tiempo Continuo y Discreto',
        'Transformada de Laplace, Función de Transferencia y Polos/Ceros',
        'Lugar Geométrico de las Raíces (Root Locus), Diagramas de Bode y Control PID',
      ], 5, 3),
    ],
  },
  {
    id: 'puj_ing_mecanica',
    name: 'Ingeniería Mecánica',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🔧',
    description: 'Termodinámica, transferencia de calor, diseño de máquinas, manufactura y dinámica.',
    subjects: [
      pujSub('IME-1101', 'Termodinámica Aplicada', '🔥', 'rose', 'Sustancias puras, primera y segunda ley de la termodinámica, entropía y ciclos de potencia.', [
        'Propiedades de las Sustancias Puras y Tablas de Vapor',
        'Primera Ley en Sistemas Cerrados y Volúmenes de Control (Toberas, Turbinas)',
        'Segunda Ley, Entropía y Ciclos de Carnot, Rankine, Otto y Brayton',
      ], 3, 3),
      pujSub('IME-2102', 'Dinámica y Vibraciones Mecánicas', '⚙️', 'blue', 'Cinemática y cinética de cuerpos rígidos, mecanismos y sistemas vibratorios.', [
        'Cinemática Plana de Cuerpos Rígidos (Velocidad y Aceleración Relativa)',
        'Cinética: Fuerza-Aceleración, Trabajo-Energía e Impulso-Momentum',
        'Vibraciones Libres y Forzadas con Amortiguamiento',
      ], 4, 3),
      pujSub('IME-3103', 'Transferencia de Calor y Diseño de Máquinas', '🛠️', 'amber', 'Conducción, convección, radiación, fatiga de materiales y elementos mecánicos.', [
        'Conducción Estacionaria y Transitoria (Ley de Fourier)',
        'Convección Forzada y Natural e Intercambiadores de Calor',
        'Teorías de Falla Estática (Von Mises, Tresca) y Diseño a Fatiga (Goodman)',
      ], 5, 4),
    ],
  },
  {
    id: 'puj_ing_mecatronica',
    name: 'Ingeniería Mecatrónica',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 145,
    emoji: '🦾',
    description: 'Robótica industrial y móvil, automatización, sensores/actuadores y sistemas ciberfísicos.',
    subjects: [
      pujSub('IMT-2101', 'Sensores, Actuadores e Instrumentación', '🎛️', 'emerald', 'Acondicionamiento de señales, puentes de Wheatstone, motores DC/paso a paso y neumática.', [
        'Caracterización Estática y Dinámica de Sensores',
        'Puentes de Medición, Amplificadores de Instrumentación y Filtros Activos',
        'Actuadores Eléctricos, Neumáticos e Hidráulicos',
      ], 4, 3),
      pujSub('IMT-3102', 'Robótica y Cinemática de Manipuladores', '🦾', 'purple', 'Transformaciones homogéneas, Denavit-Hartenberg, cinemática directa/inversa y jacobiano.', [
        'Matrices de Rotación y Transformación Homogénea en 3D',
        'Algoritmo de Denavit-Hartenberg (Cinemática Directa)',
        'Cinemática Inversa Geométrica y Algebraica',
        'Jacobiano de Velocidades y Planificación de Trayectorias',
      ], 5, 4),
      pujSub('IMT-3203', 'Automatización Industrial y PLC', '🏭', 'blue', 'Redes industriales, GRAFCET, programación Ladder (IEC 61131-3) y sistemas SCADA.', [
        'Diseño Secuencial mediante GRAFCET y Redes de Petri',
        'Programación de PLC en Lenguaje Ladder y Texto Estructurado',
        'Comunicaciones Industriales (Modbus, Profibus, OPC-UA) y SCADA',
      ], 6, 3),
    ],
  },
  {
    id: 'puj_ing_biomedica',
    name: 'Ingeniería Biomédica',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 146,
    emoji: '🧬',
    description: 'Bioinstrumentación, procesamiento de señales e imágenes médicas, biomecánica y biomateriales.',
    subjects: [
      pujSub('IBM-1101', 'Morfofisiología para Ingenieros', '🫀', 'rose', 'Fisiología celular, biopotenciales, sistema cardiovascular, respiratorio y nervioso.', [
        'Potencial de Membrana en Reposo y Potencial de Acción',
        'Electrofisiología Cardíaca y Ciclo Mecánico del Corazón',
        'Biomecánica del Sistema Músculo-Esquelético',
      ], 2, 3),
      pujSub('IBM-2102', 'Bioinstrumentación y Equipos Médicos', '🩺', 'emerald', 'Adquisición de ECG, EEG, EMG, amplificadores de biopotenciales y seguridad eléctrica.', [
        'Electrodos Biopotenciales y Amplificadores con Alto CMRR',
        'Diseño de Electrocardiógrafo (ECG) y Filtrado de Ruido de 60 Hz',
        'Seguridad Eléctrica Hospitalaria (Microshock y Macroshock)',
      ], 4, 4),
      pujSub('IBM-3103', 'Procesamiento de Señales e Imágenes Biomédicas', '🧠', 'purple', 'Filtrado digital FIR/IIR, reconstrucción tomográfica, resonancia magnética y segmentación.', [
        'Diseño de Filtros Digitales FIR e IIR para Señales Fisiológicas',
        'Principios Físicos de Rayos X, TAC, Ultrasonido y Resonancia Magnética',
        'Segmentación y Extracción de Características en Imágenes Médicas',
      ], 5, 3),
    ],
  },
  {
    id: 'puj_ciencia_datos',
    name: 'Ciencia de Datos',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '📊',
    description: 'Machine Learning, Deep Learning, estadística computacional, minería de datos y Big Data.',
    subjects: [
      pujSub('CDA-1101', 'Fundamentos de Ciencia de Datos y Python', '🐍', 'blue', 'Análisis exploratorio de datos (EDA), limpieza, visualización y álgebra matricial.', [
        'Manipulación Vectorizada con NumPy y DataFrames en Pandas',
        'Limpieza de Datos, Imputación de Faltantes y Detección de Outliers',
        'Análisis Exploratorio (EDA) y Visualización Estadística',
      ], 1, 3),
      pujSub('CDA-2102', 'Inferencia Estadística y Modelos Lineales', '📈', 'amber', 'Estimadores de máxima verosimilitud, modelos lineales generalizados (GLM) y Bayes.', [
        'Estimación por Máxima Verosimilitud (MLE) e Intervalos de Confianza',
        'Regresión Lineal Múltiple, Regularización Ridge (L2) y Lasso (L1)',
        'Regresión Logística y Modelos Lineales Generalizados (GLM)',
      ], 3, 4),
      pujSub('CDA-3103', 'Aprendizaje Automático (Machine Learning)', '🤖', 'purple', 'Aprendizaje supervisado, no supervisado, árboles de ensamble, SVM y validación cruzada.', [
        'Compromiso Sesgo-Varianza, Validación Cruzada y Métricas (ROC-AUC, F1)',
        'Árboles de Decisión, Random Forest y Gradient Boosting (XGBoost)',
        'Clustering (K-Means, DBSCAN) y Reducción de Dimensionalidad (PCA, t-SNE)',
      ], 4, 4),
      pujSub('CDA-4104', 'Deep Learning e Inteligencia Artificial', '🧠', 'emerald', 'Redes neuronales profundas, CNN, Transformers, LLMs y despliegue de modelos.', [
        'Perceptrón Multicapa, Backpropagation y Optimizadores (Adam, SGD)',
        'Redes Convolucionales (CNN) y Mecanismo de Atención (Transformers)',
        'Ingeniería de Características y MLOps en Producción',
      ], 6, 3),
    ],
  },
  {
    id: 'puj_ing_redes',
    name: 'Ingeniería en Redes y Telecomunicaciones',
    faculty: 'Facultad de Ingeniería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 142,
    emoji: '📡',
    description: 'Comunicaciones inalámbricas, fibra óptica, ciberseguridad, enrutamiento y computación en la nube.',
    subjects: [
      pujSub('IRT-1101', 'Arquitectura de Redes y Enrutamiento', '🌐', 'blue', 'Subredes IPv4/IPv6, VLANs, OSPF, BGP y calidad de servicio (QoS).', [
        'Direccionamiento IPv4/IPv6, Subnetting VLSM y CIDR',
        'Conmutación Ethernet, VLANs (802.1Q) y Spanning Tree Protocol (STP)',
        'Protocolos de Enrutamiento Dinámico: OSPF y BGP',
      ], 3, 4),
      pujSub('IRT-2102', 'Comunicaciones Digitales e Inalámbricas', '📡', 'purple', 'Modulación QAM/OFDM, propagación electromagnética, antenas y redes celulares 5G.', [
        'Modulaciones Digitales (ASK, PSK, QAM y OFDM)',
        'Presupuesto de Enlace (Link Budget), Ecuación de Friis y Antenas',
        'Arquitectura de Redes Móviles 4G LTE y 5G NR',
      ], 4, 4),
      pujSub('IRT-3103', 'Seguridad en Redes y Cloud Computing', '🔒', 'emerald', 'Criptografía, firewalls, VPNs, Zero Trust y virtualización de funciones de red (SDN/NFV).', [
        'Criptografía Simétrica (AES), Asimétrica (RSA/ECC) y Certificados PKI',
        'Firewalls, IDS/IPS, Túneles IPSec/WireGuard y Seguridad Perimetral',
        'Redes Definidas por Software (SDN) y Arquitecturas Cloud',
      ], 5, 3),
    ],
  },

  // ============================================================================
  // 2. FACULTAD DE MEDICINA (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_medicina',
    name: 'Medicina',
    faculty: 'Facultad de Medicina · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 12,
    totalCredits: 274,
    emoji: '🩺',
    description: 'Formación médica integral con énfasis en morfofisiología, semiología, clínicas médicas y quirúrgicas.',
    subjects: [
      pujSub('MED-1101', 'Morfofisiología y Anatomía Humana', '🩺', 'rose', 'Osteología, miología, neuroanatomía, vascularización y correlación clínica.', [
        'Huesos del Cráneo, Fosas Craneales y Pares Craneales (I - XII)',
        'Plexo Braquial, Lumbosacro e Inervación de Miembros',
        'Anatomía Cardíaca, Circulación Coronaria y Mediastino',
        'Neuroanatomía: Vías Ascendentes (Sensitivas) y Descendentes (Piramidal)',
      ], 1, 6),
      pujSub('MED-1202', 'Fisiología Médica Integrada', '🫀', 'purple', 'Potencial de acción, fisiología cardiovascular, pulmonar, renal y endocrina.', [
        'Potencial de Acción Neuronal y Miocárdico (Fases 0 a 4)',
        'Ciclo Cardíaco, Gasto Cardíaco y Diagrama de Wiggers',
        'Mecánica Ventilatoria, Intercambio Gaseoso y Curva de Disociación de Hb',
        'Filtración Glomerular, Aclaramiento Renal y Sistema RAA',
      ], 2, 5),
      pujSub('MED-2103', 'Bioquímica, Biología Molecular y Genética', '🧪', 'blue', 'Metabolismo intermediario, bioenergética, enzimología y genética médica.', [
        'Cinética Enzimática (Michaelis-Menten) e Inhibición',
        'Glucólisis, Ciclo de Krebs y Fosforilación Oxidativa',
        'Metabolismo de Lípidos, Beta-Oxidación y Cuerpos Cetónicos',
      ], 2, 4),
      pujSub('MED-3104', 'Semiología Clínica y Propedéutica', '📋', 'emerald', 'Historia clínica, anamnesis, examen físico por sistemas y síndromes clínicos.', [
        'Estructura de la Historia Clínica y Caracterización del Dolor (ALICIA)',
        'Auscultación Cardíaca (Focos, Ruidos R1-R4 y Soplos)',
        'Semiología Respiratoria (Murmullo Vesicular, Estertores, Sibilancias)',
      ], 4, 6),
      pujSub('MED-3205', 'Farmacología y Terapéutica', '💊', 'amber', 'Farmacocinética, farmacodinamia, antibióticos, antihipertensivos y analgésicos.', [
        'Farmacocinética LADME, Volumen de Distribución y Vida Media',
        'Farmacología del Sistema Nervioso Autónomo (Adrenérgicos y Colinérgicos)',
        'Mecanismos de Acción de Antibióticos (Betalactámicos, Macrólidos, Quinolonas)',
      ], 5, 4),
      pujSub('MED-4106', 'Medicina Interna y Patología', '🏥', 'rose', 'Fisiopatología, diagnóstico y manejo de patologías prevalentes del adulto.', [
        'Síndrome Coronario Agudo y Lectura Sistemática del Electrocardiograma (ECG)',
        'Cetoacidosis Diabética, Estado Hiperosmolar y Manejo de Insulinas',
        'Insuficiencia Cardíaca, EPOC y Neumonía Adquirida en la Comunidad',
      ], 6, 8),
    ],
  },

  // ============================================================================
  // 3. FACULTAD DE ODONTOLOGÍA (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_odontologia',
    name: 'Odontología',
    faculty: 'Facultad de Odontología · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 10,
    totalCredits: 196,
    emoji: '🦷',
    description: 'Anatomía dental, biomateriales, periodoncia, endodoncia, rehabilitación oral y cirugía maxilofacial.',
    subjects: [
      pujSub('ODO-1101', 'Morfología Dental y Oclusión', '🦷', 'blue', 'Anatomía coronaria y radicular, nomenclatura FDI y biomecánica mandibular.', [
        'Nomenclatura Dental Internacional (FDI) y Cronología de Erupción',
        'Morfología de Incisivos, Caninos, Premolares y Molares',
        'Articulación Temporomandibular (ATM) y llaves de la Oclusión de Andrews',
      ], 1, 4),
      pujSub('ODO-2102', 'Biomateriales Odontológicos y Operatoria', '🔬', 'emerald', 'Resinas compuestas, adhesión amelodentinaria, ionómeros y preparaciones cavitarias.', [
        'Clasificación de Cavidades de Black y Principios de Preparación',
        'Sistemas Adhesivos, Grabado Ácido y Capa Híbrida',
        'Polimerización y Propiedades Mecánicas de Resinas Compuestas',
      ], 3, 4),
      pujSub('ODO-3103', 'Periodoncia, Endodoncia y Cirugía Oral', '🩺', 'rose', 'Patología pulpar y periapical, enfermedad periodontal y técnicas anestésicas.', [
        'Diagnóstico Pulpar (Pulpitis Reversible, Irreversible y Necrosis)',
        'Clasificación de Enfermedades Periodontales y Periodontograma',
        'Técnicas de Anestesia Troncular del Nervio Alveolar Inferior y Maxilar',
      ], 5, 5),
    ],
  },

  // ============================================================================
  // 4. FACULTAD DE ENFERMERÍA (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_enfermeria',
    name: 'Enfermería',
    faculty: 'Facultad de Enfermería · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 152,
    emoji: '💉',
    description: 'Cuidado integral de enfermería, proceso de atención (PAE), salud pública, materna y cuidado crítico.',
    subjects: [
      pujSub('ENF-1101', 'Fundamentos del Cuidado y Proceso de Enfermería', '💉', 'emerald', 'Teorías de enfermería, valoración semiológica y taxonomía NANDA-NIC-NOC.', [
        'Proceso de Atención de Enfermería (PAE): Valoración, Diagnóstico y Planificación',
        'Taxonomías Diagnósticas NANDA, Resultados NOC e Intervenciones NIC',
        'Valoración de Signos Vitales y Escalas Clínicas (Glasgow, Braden, Morse)',
      ], 2, 5),
      pujSub('ENF-2102', 'Farmacología Clínica y Administración Segura', '💊', 'blue', 'Dilución de medicamentos, cálculo de goteo, farmacovigilancia y los 10 correctos.', [
        'Cálculo de Dosis, Tasas de Infusión (cc/h) y Factores de Goteo',
        'Los 10 Correctos en la Administración Segura de Medicamentos',
        'Manejo de Electrolitos de Alto Riesgo y Vasoactivos',
      ], 3, 4),
      pujSub('ENF-3103', 'Cuidado de Enfermería al Adulto y Crítico', '🏥', 'rose', 'Monitoreo hemodinámico, soporte vital (BLS/ACLS), ventilación y urgencias.', [
        'Reanimación Cardiopulmonar Básica y Avanzada (BLS / ACLS)',
        'Cuidado del Paciente con Ventilación Mecánica y Gases Arteriales',
        'Manejo de Accesos Vasculares Centrales y Prevención de IAAS',
      ], 5, 6),
    ],
  },

  // ============================================================================
  // 5. FACULTAD DE CIENCIAS (6 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_biologia',
    name: 'Biología',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🌿',
    description: 'Biología celular y molecular, genética, evolución, botánica, zoología y conservación de biodiversidad.',
    subjects: [
      pujSub('BIO-1101', 'Biología Celular y Molecular', '🧬', 'emerald', 'Ultraestructura celular, señalización, ciclo celular y regulación génica.', [
        'Membrana Plasmática, Transporte Activo y Señalización Celular',
        'Respiración Celular Mitocondrial y Fotosíntesis en Cloroplastos',
        'Dogma Central: Replicación, Transcripción y Regulación Epigenética',
      ], 1, 4),
      pujSub('BIO-2102', 'Genética y Biología Evolutiva', '🦎', 'purple', 'Genética de poblaciones, equilibrio Hardy-Weinberg, filogenia y especiación.', [
        'Equilibrio de Hardy-Weinberg y Fuerzas Evolutivas (Deriva, Selección)',
        'Ligamiento Genético, Mapas Cromosómicos y Epistasis',
        'Sistemática Filogenética y Construcción de Cladogramas',
      ], 3, 4),
      pujSub('BIO-3103', 'Fisiología Animal y Vegetal', '🌱', 'blue', 'Homeostasis, osmorregulación, fitohormonas y transporte vascular en plantas.', [
        'Potencial Hídrico, Transporte por Xilema y Floema y Fotosíntesis C3/C4/CAM',
        'Termorregulación, Osmorregulación y Fisiología comparada en Vertebrados',
      ], 4, 4),
    ],
  },
  {
    id: 'puj_microbiologia',
    name: 'Microbiología Industrial',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 146,
    emoji: '🦠',
    description: 'Biotecnología, bioprocesos, fermentaciones industriales, microbiología de alimentos y ambiental.',
    subjects: [
      pujSub('MIC-1101', 'Microbiología General y Vi-rología', '🦠', 'emerald', 'Morfología bacteriana, cinética de crecimiento microbiano, hongos y virus.', [
        'Estructura de Pared Celular Gram Positiva vs Gram Negativa',
        'Curva de Crecimiento Microbiano (Latencia, Exponencial, Estacionaria)',
        'Ciclos de Replicación Viral (Lítico y Lisogénico)',
      ], 2, 4),
      pujSub('MIC-2102', 'Bioprocesos y Fermentaciones Industriales', '🧪', 'purple', 'Biorreactores, cinética de Monod, esterilización y escalamiento biotecnológico.', [
        'Cinética Enzimática y de Crecimiento Microbiano (Modelo de Monod)',
        'Diseño de Biorreactores (Batch, Fed-Batch y Continuo Quimiostato)',
        'Transferencia de Oxígeno (kLa) y Procesos Downstream',
      ], 5, 4),
      pujSub('MIC-3103', 'Control Microbiológico de Alimentos y Calidad', '🔬', 'amber', 'Inocuidad alimentaria, HACCP, microorganismos indicadores y normatividad.', [
        'Microorganismos Indicadores y Patógenos en Alimentos (Salmonella, Listeria)',
        'Sistema de Análisis de Peligros y Puntos Críticos de Control (HACCP)',
      ], 6, 3),
    ],
  },
  {
    id: 'puj_bacteriologia',
    name: 'Bacteriología',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 148,
    emoji: '🔬',
    description: 'Diagnóstico clínico de laboratorio, hematología, inmunología, banco de sangre y microbiología médica.',
    subjects: [
      pujSub('BAC-1101', 'Hematología Clínica y Coagulación', '🩸', 'rose', 'Hematopoyesis, anemias, leucemias, hemostasia y pruebas de coagulación.', [
        'Hematopoyesis e Interpretación del Cuadro Hemático Completo',
        'Clasificación Morfológica y Fisiopatológica de las Anemias',
        'Cascada de la Coagulación (Vía Intrínseca, Extrínseca, TP y TPT)',
      ], 3, 4),
      pujSub('BAC-2102', 'Inmunología Clínica y Banco de Sangre', '🛡️', 'purple', 'Inmunidad innata y adaptativa, complejo mayor de histocompatibilidad e inmunohematología.', [
        'Respuesta Humoral (Linfocitos B/Anticuerpos) y Celular (Linfocitos T)',
        'Sistemas de Grupos Sanguíneos ABO, Rh y Pruebas Cruzadas',
        'Técnicas Diagnósticas: ELISA, Citometría de Flujo e Inmunofluorescencia',
      ], 4, 4),
      pujSub('BAC-3103', 'Bacteriología, Micología y Parasitología Clínica', '🦠', 'emerald', 'Aislamiento diagnóstico, pruebas bioquímicas y mecanismos de resistencia antimicrobiana.', [
        'Identificación de Cocos Gram+ y Bacilos Gram- (Enterobacterias)',
        'Lectura Interpretada del Antibiograma (CLSI) y Betalactamasas (BLEE/KPC)',
      ], 5, 5),
    ],
  },
  {
    id: 'puj_nutricion',
    name: 'Nutrición y Dietética',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 145,
    emoji: '🥗',
    description: 'Nutrición clínica, valoración del estado nutricional, ciencia de alimentos y nutrición pública.',
    subjects: [
      pujSub('NUT-1101', 'Bioquímica de la Nutrición y Macronutrientes', '🥑', 'emerald', 'Digestión, absorción y metabolismo de proteínas, carbohidratos, lípidos y micronutrientes.', [
        'Gasto Energético Basal (Harris-Benedict / Mifflin-St Jeor) y Efecto Térmico',
        'Digestión, Absorción y Biodisponibilidad de Macro y Micronutrientes',
        'Balance Nitrogenado y Calidad Proteica',
      ], 2, 4),
      pujSub('NUT-2102', 'Valoración del Estado Nutricional', '📏', 'blue', 'Antropometría, indicadores bioquímicos, clínicos y dietéticos en el ciclo vital.', [
        'Indicadores Antropométricos (IMC, Pliegues Cutáneos y Patrones OMS)',
        'Evaluación Bioquímica y Tamizaje Nutricional (MNA, NRS-2002)',
      ], 3, 4),
      pujSub('NUT-3103', 'Dietoterapia y Nutrición Clínica', '🏥', 'rose', 'Soporte nutricional enteral/parenteral y manejo dietoterapéutico de patologías.', [
        'Prescripción Dietaria en Diabetes, Enfermedad Renal y Cardiovascular',
        'Cálculo de Soporte Nutricional Enteral y Parenteral Total',
      ], 5, 5),
    ],
  },
  {
    id: 'puj_matematicas',
    name: 'Matemáticas',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '♾️',
    description: 'Análisis matemático, álgebra abstracta, topología, ecuaciones diferenciales y matemática aplicada.',
    subjects: [
      pujSub('MAT-2101', 'Lógica, Conjuntos y Demostración Matemática', '♾️', 'blue', 'Lógica proposicional y de predicados, inducción matemática, relaciones y cardinalidad.', [
        'Métodos de Demostración: Directa, Contrarrecíproca y Reducción al Absurdo',
        'Principio de Inducción Matemática Fuerte y Débil',
        'Relaciones de Equivalencia, Clases de Equivalencia y Conjuntos Numerables',
      ], 1, 4),
      pujSub('MAT-3102', 'Análisis Real y Espacios Métricos', '📐', 'purple', 'Sucesiones de Cauchy, compacidad, conexidad, convergencia uniforme e integral de Riemann.', [
        'Axioma del Supremo, Sucesiones de Cauchy y Completitud en R',
        'Topología en Espacios Métricos: Conjuntos Abiertos, Cerrados y Compactos',
        'Continuidad Uniforme y Convergencia Puntual vs Uniforme de Sucesiones',
      ], 4, 4),
      pujSub('MAT-3203', 'Álgebra Abstracta (Grupos, Anillos y Cuerpos)', '🔷', 'amber', 'Teoría de grupos, subgrupos normales, teoremas de isomorfismo y teoría de Galois.', [
        'Grupos, Subgrupos, Teorema de Lagrange y Grupos Cíclicos',
        'Subgrupos Normales, Grupos Cociente y Teoremas de Isomorfismo',
        'Anillos Conmutativos, Ideales Maximales y Cuerpos',
      ], 5, 4),
    ],
  },
  {
    id: 'puj_quimica_farmaceutica',
    name: 'Química Farmacéutica',
    faculty: 'Facultad de Ciencias · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 9,
    totalCredits: 162,
    emoji: '💊',
    description: 'Diseño y síntesis de fármacos, farmacotecnia, análisis instrumental, biofarmacia y asuntos regulatorios.',
    subjects: [
      pujSub('QFA-1101', 'Química Orgánica Farmacéutica', '🧪', 'emerald', 'Estereoquímica, mecanismos de reacción (SN1, SN2, E1, E2) y síntesis orgánica.', [
        'Quiralidad, Enantiómeros, Diastereómeros y Configuración R/S',
        'Mecanismos de Sustitución Nucleofílica (SN1 vs SN2) y Eliminación',
        'Reactividad de Compuestos Carbonílicos y Aromáticos (SEAr)',
      ], 2, 4),
      pujSub('QFA-2102', 'Análisis Químico e Instrumental (HPLC / Espectroscopía)', '🔬', 'blue', 'Volumetría, cromatografía líquida/gaseosa, espectroscopía UV-Vis, IR y RMN.', [
        'Equilibrios Ácido-Base, Complejometría y Titulaciones Redox',
        'Cromatografía Líquida de Alta Eficiencia (HPLC) y Validación Analítica',
        'Elucidación Estructural mediante IR, Espectrometría de Masas y RMN',
      ], 4, 4),
      pujSub('QFA-3103', 'Farmacotecnia y Biofarmacia', '💊', 'purple', 'Diseño de formas farmacéuticas sólidas, líquidas y estériles, biodisponibilidad y bioequivalencia.', [
        'Preformulación, Reología y Sistemas Dispersos (Emulsiones y Suspensiones)',
        'Diseño de Tabletas, Recubrimiento y Perfiles de Disolución',
        'Biofarmacia: Clasificación Biofarmacéutica (BCS) y Bioequivalencia',
      ], 6, 4),
    ],
  },

  // ============================================================================
  // 6. FACULTAD DE CIENCIAS ECONÓMICAS Y ADMINISTRATIVAS (5 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_administracion',
    name: 'Administración de Empresas',
    faculty: 'Facultad de Ciencias Económicas y Administrativas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '📈',
    description: 'Estrategia corporativa, finanzas, mercadeo, talento humano, innovación y liderazgo organizacional.',
    subjects: [
      pujSub('ADM-1101', 'Fundamentos de Administración y Organizaciones', '🏢', 'blue', 'Proceso administrativo, planeación estratégica, estructura organizacional y gobierno.', [
        'Proceso Administrativo: Planeación, Organización, Dirección y Control',
        'Análisis del Entorno (PESTEL) y las 5 Fuerzas Competitivas de Porter',
        'Diseño Organizacional, Cultura y Liderazgo Transformacional',
      ], 1, 3),
      pujSub('ADM-2102', 'Contabilidad Financiera y Gerencial', '📊', 'emerald', 'Estados financieros NIIF, análisis de costos, punto de equilibrio y presupuestos.', [
        'Ecuación Patrimonial, Balance General y Estado de Resultados',
        'Relación Costo-Volumen-Utilidad y Punto de Equilibrio Multiproducto',
        'Indicadores Financieros de Liquidez, Endeudamiento y Rentabilidad (ROE/ROA)',
      ], 2, 3),
      pujSub('ADM-3103', 'Finanzas Corporativas y Valoración', '💰', 'amber', 'Costo de capital (WACC), estructura de capital, flujo de caja libre y valoración de empresas.', [
        'Flujo de Caja Libre (FCL), Capital de Trabajo Neto Operativo (KTNO) y EBITDA',
        'Modelo CAPM y Costo Promedio Ponderado de Capital (WACC)',
        'Valoración de Empresas por Flujos de Caja Descontados (DCF)',
      ], 4, 3),
      pujSub('ADM-3204', 'Gerencia de Mercadeo y Estrategia Digital', '🚀', 'purple', 'Segmentación, posicionamiento, comportamiento del consumidor, pricing y métricas.', [
        'Segmentación, Targeting, Posicionamiento (STP) y Propuesta de Valor',
        'Estrategia de Precios, Canales de Distribución y Marketing Mix',
        'Unit Economics: Costo de Adquisición (CAC) vs Lifetime Value (LTV)',
      ], 4, 3),
    ],
  },
  {
    id: 'puj_economia',
    name: 'Economía',
    faculty: 'Facultad de Ciencias Económicas y Administrativas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '📉',
    description: 'Teoría microeconómica, macroeconomía, econometría, política monetaria/fiscal y desarrollo económico.',
    subjects: [
      pujSub('ECO-1101', 'Microeconomía (Consumidor, Productor y Juegos)', '📉', 'blue', 'Preferencias, maximización de utilidad, minimización de costos y equilibrio general.', [
        'Maximización de Utilidad (Marshalliana) y Ecuación de Slutsky',
        'Función de Producción, Rendimientos a Escala y Minimización de Costos',
        'Competencia Perfecta, Monopolio, Oligopolio (Cournot/Stackelberg) y Equilibrio de Nash',
      ], 2, 4),
      pujSub('ECO-2102', 'Macroeconomía y Política Monetaria', '🏦', 'emerald', 'Cuentas nacionales, modelo IS-LM, modelo Mundell-Fleming, inflación y crecimiento.', [
        'Contabilidad Nacional (PIB Nominal, Real, Deflactor e IPC)',
        'Modelo IS-LM en Economía Cerrada y Mundell-Fleming en Economía Abierta',
        'Oferta y Demanda Agregada, Curva de Phillips y Regla de Taylor',
        'Modelo de Crecimiento Económico de Solow-Swan',
      ], 3, 4),
      pujSub('ECO-3103', 'Econometría y Series de Tiempo', '📊', 'purple', 'Mínimos cuadrados ordinarios (MCO), endogeneidad, variables instrumentales y ARIMA.', [
        'Supuestos de Gauss-Markov y Estimador de Mínimos Cuadrados Ordinarios (MCO)',
        'Heterocedasticidad, Autocorrelación, Multicolinealidad y Variables Instrumentales',
        'Series de Tiempo Estacionarias, Raíz Unitaria (Dickey-Fuller) y Modelos ARIMA',
      ], 5, 4),
    ],
  },
  {
    id: 'puj_contaduria',
    name: 'Contaduría Pública',
    faculty: 'Facultad de Ciencias Económicas y Administrativas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🧾',
    description: 'Normas Internacionales de Información Financiera (NIIF/IFRS), tributación, auditoría y aseguramiento.',
    subjects: [
      pujSub('CON-1101', 'Estándares Internacionales Contables (NIIF / IFRS)', '🧾', 'emerald', 'Reconocimiento, medición inicial y posterior de activos, pasivos e ingresos bajo NIIF.', [
        'Marco Conceptual NIIF y Medición a Valor Razonable vs Costo Amortizado',
        'NIC 16 Propiedades, Planta y Equipo, Deterioro (NIC 36) y Arrendamientos (NIIF 16)',
        'NIIF 15 Reconocimiento de Ingresos de Actividades Ordinarias',
      ], 2, 4),
      pujSub('CON-2102', 'Legislación Tributaria e Impuestos', '⚖️', 'amber', 'Impuesto sobre la renta, IVA, retención en la fuente y planeación tributaria.', [
        'Depuración de la Renta Líquida Ordinaria en Personas Jurídicas y Naturales',
        'Hecho Generador, Base Gravable y Tarifas del IVA y Retención en la Fuente',
        'Impuesto Diferido (NIC 12): Diferencias Temporarias Imponibles y Deducibles',
      ], 4, 4),
      pujSub('CON-3103', 'Auditoría Financiera, Control Interno y NIA', '🔍', 'blue', 'Normas Internacionales de Auditoría (NIA), matriz de riesgos COSO y dictamen.', [
        'Marco de Control Interno COSO y Evaluación de Riesgo Inherente y de Control',
        'Evidencia de Auditoría, Muestreo Estadístico y Tipos de Opinión en el Dictamen',
      ], 6, 3),
    ],
  },
  {
    id: 'puj_finanzas',
    name: 'Finanzas',
    faculty: 'Facultad de Ciencias Económicas y Administrativas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '💹',
    description: 'Mercados de capitales, renta fija y variable, derivados financieros, gestión de portafolios y riesgo.',
    subjects: [
      pujSub('FIN-1101', 'Matemáticas Financieras y Mercado de Capitales', '💹', 'emerald', 'Valoración de bonos, curva de rendimientos, duración, convexidad y acciones.', [
        'Valoración de Títulos de Renta Fija (Bonos), TIR (YTM), Duración de Macaulay y Modificada',
        'Valoración de Acciones por Dividendos Descontados (Modelo de Gordon) y Múltiplos',
      ], 2, 4),
      pujSub('FIN-2102', 'Teoría de Portafolios y Derivados Financieros', '📈', 'purple', 'Frontera eficiente de Markowitz, futuros, forwards, swaps y opciones (Black-Scholes).', [
        'Optimización Media-Varianza de Markowitz y Frontera Eficiente',
        'Valoración de Contratos Forward, Futuros y Swaps de Tasas/Divisas',
        'Opciones Financieras (Call/Put), Paridad Put-Call y Modelo de Black-Scholes',
      ], 4, 4),
      pujSub('FIN-3103', 'Gestión Cuantitativa de Riesgos Financieros', '🛡️', 'blue', 'Riesgo de mercado (VaR), riesgo de crédito, riesgo de liquidez y Basilea III.', [
        'Cálculo del Valor en Riesgo (VaR Paramétrico, Histórico y Simulación de Montecarlo)',
        'Modelos de Riesgo de Crédito (Scoring, Probabilidad de Default y Pérdida Esperada)',
      ], 6, 3),
    ],
  },
  {
    id: 'puj_negocios_internacionales',
    name: 'Negocios Internacionales',
    faculty: 'Facultad de Ciencias Económicas y Administrativas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '🌍',
    description: 'Comercio exterior, logística global, acuerdos comerciales, finanzas internacionales y negociación intercultural.',
    subjects: [
      pujSub('NIN-1101', 'Comercio Internacional, Aduanas e Incoterms', '🚢', 'blue', 'Teorías del comercio, régimen aduanero, clasificación arancelaria e Incoterms 2020.', [
        'Ventaja Comparativa, Modelo Heckscher-Ohlin y Nuevas Teorías del Comercio',
        'Aplicación Práctica de los Incoterms 2020 (EXW, FOB, CIF, DDP) y Costeo de Exportación',
        'Arancel de Aduanas, Reglas de Origen y Tratados de Libre Comercio (TLC)',
      ], 2, 3),
      pujSub('NIN-2102', 'Finanzas Internacionales y Mercado Cambiario', '💱', 'emerald', 'Balanza de pagos, tipo de cambio, paridad de tasas de interés y cobertura cambiaria.', [
        'Estructura de la Balanza de Pagos (Cuenta Corriente, Capital y Financiera)',
        'Paridad del Poder Adquisitivo (PPA) y Paridad de Tasas de Interés (PTI)',
        'Gestión de Exposición al Riesgo Cambiario con Forwards y Opciones de Divisas',
      ], 4, 3),
      pujSub('NIN-3103', 'Estrategia de Internacionalización y Logística Global', '🌐', 'purple', 'Modos de entrada a mercados globales, cadenas globales de valor y negociación.', [
        'Modos de Entrada Internacional: Exportación, Franquicias, Joint Ventures e IED',
        'Gestión de Cadenas de Suministro Globales y Transporte Multimodal',
      ], 5, 3),
    ],
  },

  // ============================================================================
  // 7. FACULTAD DE CIENCIAS JURÍDICAS (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_derecho',
    name: 'Derecho',
    faculty: 'Facultad de Ciencias Jurídicas · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 10,
    totalCredits: 170,
    emoji: '⚖️',
    description: 'Derecho constitucional, civil, penal, administrativo, laboral, comercial y litigio estratégico.',
    subjects: [
      pujSub('DER-1101', 'Derecho Constitucional Colombiano y Teoría del Estado', '⚖️', 'amber', 'Constitución de 1991, derechos fundamentales, acciones constitucionales y ramas del poder.', [
        'Principios Fundamentales, Estado Social de Derecho y Bloque de Constitucionalidad',
        'Acción de Tutela, Acción Popular, Acción de Grupo y Acción de Cumplimiento',
        'Control de Constitucionalidad (Concentrado y Difuso) y Estados de Excepción',
      ], 1, 4),
      pujSub('DER-1202', 'Derecho Civil: Personas, Bienes y Obligaciones', '🏛️', 'rose', 'Sujetos de derecho, derechos reales, negocio jurídico, responsabilidad civil y contratos.', [
        'Atributos de la Personalidad, Capacidad Legal y Régimen de Personas',
        'Modos de Adquirir el Dominio (Ocupación, Accesión, Tradición, Prescripción)',
        'Fuentes de las Obligaciones, Elementos de Existencia y Validez del Negocio Jurídico',
        'Responsabilidad Civil Contractual y Extracontractual (Daño, Culpa y Nexo Causal)',
      ], 2, 5),
      pujSub('DER-2103', 'Derecho Penal General y Especial', '📜', 'purple', 'Teoría del delito, tipicidad, antijuridicidad, culpabilidad, autoría y penas.', [
        'Principios Rectores del Derecho Penal (Legalidad, Lesividad, Culpabilidad)',
        'Estructura de la Conducta Punible: Tipicidad Objetiva/Subjetiva y Imputación Objetiva',
        'Causales de Ausencia de Responsabilidad (Legítima Defensa y Estado de Necesidad)',
      ], 3, 4),
      pujSub('DER-3104', 'Derecho Administrativo y Procesal General', '🏢', 'blue', 'Acto administrativo, contratación estatal, medios de control (CPACA) y código general del proceso.', [
        'Elementos, Validez, Eficacia y Nulidad del Acto Administrativo',
        'Medios de Control Contencioso Administrativos (Nulidad, Reparación Directa, Controversias)',
        'Jurisdicción, Competencia, Demanda, Pruebas y Recursos en el Código General del Proceso',
      ], 5, 4),
      pujSub('DER-4105', 'Derecho Comercial, Societario y Laboral', '💼', 'emerald', 'Sociedades mercantiles, títulos valores, contrato de trabajo y seguridad social.', [
        'Constitución y Régimen de Sociedades (S.A.S., S.A., Ltda.) y Deberes de Administradores',
        'Títulos Valores: Letra de Cambio, Pagaré, Cheque y Factura Cambiaria',
        'Elementos del Contrato de Trabajo, Prestaciones Sociales e Indemnizaciones',
      ], 6, 4),
    ],
  },

  // ============================================================================
  // 8. FACULTAD DE CIENCIAS POLÍTICAS Y RELACIONES INTERNACIONALES (2 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_ciencia_politica',
    name: 'Ciencia Política',
    faculty: 'Facultad de Ciencias Políticas y RR.II. · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '🏛️',
    description: 'Teoría política, políticas públicas, sistemas electorales, partidos políticos y análisis de conflicto.',
    subjects: [
      pujSub('CPO-1101', 'Teoría Política Clásica, Moderna y Contemporánea', '🏛️', 'amber', 'Maquiavelo, contractualismo (Hobbes, Locke, Rousseau), democracia y justicia (Rawls).', [
        'El Estado Moderno en Maquiavelo y el Contractualismo (Hobbes, Locke y Rousseau)',
        'Teorías de la Democracia (Schumpeter, Dahl, Habermas) y Justicia en John Rawls',
      ], 1, 3),
      pujSub('CPO-2102', 'Políticas Públicas y Gestión Pública', '📋', 'blue', 'Ciclo de las políticas públicas, diseño, implementación, evaluación de impacto y presupuesto.', [
        'El Ciclo de las Políticas Públicas: Agenda, Formulación, Implementación y Evaluación',
        'Estructura de la Administración Pública Territorial y Finanzas Públicas',
      ], 3, 3),
      pujSub('CPO-3103', 'Sistemas Políticos Comparados y Elecciones', '🗳️', 'purple', 'Presidencialismo vs parlamentarismo, sistemas de partidos y comportamiento electoral.', [
        'Regímenes Democráticos: Presidencialismo, Parlamentarismo y Semipresidencialismo',
        'Fórmulas Electorales (D\'Hondt, cifra repartidora), Umbral y Sistemas de Partidos',
      ], 4, 3),
    ],
  },
  {
    id: 'puj_relaciones_internacionales',
    name: 'Relaciones Internacionales',
    faculty: 'Facultad de Ciencias Políticas y RR.II. · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 138,
    emoji: '🌐',
    description: 'Geopolítica, derecho internacional público, diplomacia, seguridad global y cooperación internacional.',
    subjects: [
      pujSub('RII-1101', 'Teorías de las Relaciones Internacionales', '🌐', 'blue', 'Realismo, liberalismo institucional, constructivismo y economía política internacional.', [
        'Realismo Clásico y Neorrealismo Estructural (Equilibrio de Poder y Anarquía)',
        'Interdependencia Compleja, Institucionalismo Liberal y Constructivismo Social',
      ], 1, 3),
      pujSub('RII-2102', 'Derecho Internacional Público y Derechos Humanos', '⚖️', 'emerald', 'Tratados internacionales (Convención de Viena), ONU, Corte Internacional de Justicia y DIH.', [
        'Fuentes del Derecho Internacional (Art. 38 Estatuto CIJ) y Derecho de los Tratados',
        'Sistema Universal (ONU) e Interamericano de Derechos Humanos (CIDH / Corte IDH)',
      ], 3, 3),
      pujSub('RII-3103', 'Geopolítica, Seguridad Internacional y Política Exterior', '🧭', 'purple', 'Conflictos contemporáneos, estudios regionales, diplomacia y cooperación al desarrollo.', [
        'Seguridad Internacional, Gobernanza Global y Análisis de Política Exterior Colombiana',
      ], 5, 3),
    ],
  },

  // ============================================================================
  // 9. FACULTAD DE PSICOLOGÍA (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_psicologia',
    name: 'Psicología',
    faculty: 'Facultad de Psicología · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 10,
    totalCredits: 164,
    emoji: '🧠',
    description: 'Neuropsicología, procesos psicológicos básicos, psicopatología, psicología clínica, educativa y organizacional.',
    subjects: [
      pujSub('PSI-1101', 'Psicobiología y Neurociencias de la Conducta', '🧠', 'purple', 'Neuroanatomía funcional, sinapsis, neurotransmisores y bases biológicas de la emoción y memoria.', [
        'Comunicación Sináptica y Neurotransmisores (Dopamina, Serotonina, GABA, Glutamato)',
        'Organización Funcional de la Corteza Cerebral (Lóbulos Frontal, Parietal, Temporal, Occipital)',
        'Sistema Límbico (Amígdala, Hipocampo) y Consolidación de la Memoria',
      ], 1, 4),
      pujSub('PSI-2102', 'Procesos Psicológicos: Cognición, Aprendizaje y Desarrollo', '💡', 'blue', 'Atención, percepción, condicionamiento clásico/operante y desarrollo humano en el ciclo vital.', [
        'Condicionamiento Clásico (Pavlov), Operante (Skinner) y Aprendizaje Social (Bandura)',
        'Modelos de Memoria de Trabajo (Baddeley), Atención y Funciones Ejecutivas',
        'Desarrollo Cognitivo y Socioafectivo (Piaget, Vygotsky y Teoría del Apego de Bowlby)',
      ], 2, 4),
      pujSub('PSI-3103', 'Psicometría y Evaluación Psicológica', '📊', 'emerald', 'Validez, confiabilidad, pruebas psicométricas, entrevista clínica y evaluación neuropsicológica.', [
        'Teoría Clásica de los Tests: Confiabilidad (Alfa de Cronbach) y Validez de Constructo',
        'Entrevista Psicológica, Examen del Estado Mental y Ética Profesional (Ley 1090)',
      ], 4, 3),
      pujSub('PSI-4104', 'Psicopatología y Psicología Clínica', '🩺', 'rose', 'Semiología psiquiátrica, trastornos del estado de ánimo, ansiedad, personalidad e intervención.', [
        'Criterios Diagnósticos DSM-5 / CIE-11: Trastornos Depresivos, Bipolares y de Ansiedad',
        'Modelos de Intervención: Terapia Cognitivo-Conductual (TCC), Sistémica y Psicodinámica',
      ], 5, 4),
    ],
  },

  // ============================================================================
  // 10. FACULTAD DE ARQUITECTURA Y DISEÑO (3 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_arquitectura',
    name: 'Arquitectura',
    faculty: 'Facultad de Arquitectura y Diseño · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 10,
    totalCredits: 172,
    emoji: '🏛️',
    description: 'Proyectos arquitectónicos, urbanismo, sistemas estructurales, bioclimática, construcción e historia.',
    subjects: [
      pujSub('ARQ-1101', 'Proyecto Arquitectónico y Composición Espacial', '📐', 'blue', 'Espacio, forma, escala, proporción, implantación urbana y representación arquitectónica.', [
        'Principios Ordenadores del Espacio: Eje, Simetría, Jerarquía, Ritmo y Pauta',
        'Análisis de Lugar, Asoleación, Vientos, Topografía y Normativa Urbana (POT)',
      ], 1, 5),
      pujSub('ARQ-2102', 'Sistemas Estructurales y Procesos Constructivos', '🏗️', 'amber', 'Cimentaciones, estructuras en concreto/acero/madera, envolventes y presupuesto de obra.', [
        'Comportamiento Mecánico de Arcos, Bóvedas, Cerchas, Pórticos y Pantallas',
        'Cimentaciones Superficiales y Profundas, Mampostería y Detalles Constructivos',
      ], 3, 4),
      pujSub('ARQ-3103', 'Arquitectura Bioclimática y Urbanismo Sostenible', '🌿', 'emerald', 'Confort térmico, lumínico y acústico, eficiencia energética y diseño urbano.', [
        'Carta Solar, Ventilación Cruzada, Inercia Térmica y Certificaciones LEED/EDGE',
      ], 5, 3),
    ],
  },
  {
    id: 'puj_diseno_industrial',
    name: 'Diseño Industrial',
    faculty: 'Facultad de Arquitectura y Diseño · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🎨',
    description: 'Diseño de producto, ergonomía, materiales y procesos industriales, prototipado CAD/CAM y experiencia.',
    subjects: [
      pujSub('DIN-1101', 'Taller de Diseño de Producto y Metodología', '🎨', 'purple', 'Design Thinking, biónica, morfología del objeto, modelado 3D y validación con usuarios.', [
        'Proceso de Diseño Centrado en el Humano: Empatizar, Definir, Idear, Prototipar y Testear',
        'Semiótica del Objeto, Función Práctica, Estética y Simbólica',
      ], 1, 4),
      pujSub('DIN-2102', 'Ergonomía, Antropometría y Factores Humanos', '🪑', 'emerald', 'Biomecánica ocupacional, percentiles antropométricos, usabilidad y diseño universal.', [
        'Análisis Antropométrico (Percentiles 5, 50 y 95) y Diseño de Puestos de Trabajo',
        'Ergonomía Cognitiva, Evaluaciones RULA/REBA y Accesibilidad Universal',
      ], 3, 3),
      pujSub('DIN-3103', 'Materiales y Procesos de Manufactura Industrial', '⚙️', 'amber', 'Polímeros, metales, compuestos, inyección de plástico, CNC, impresión 3D y ecodiseño.', [
        'Selección de Materiales (Cartas de Ashby) y Procesos de Inyección, Termoformado y Fundición',
        'Análisis de Ciclo de Vida (ACV) y Ecodiseño Circular',
      ], 4, 4),
    ],
  },
  {
    id: 'puj_diseno_visual',
    name: 'Diseño de Comunicación Visual',
    faculty: 'Facultad de Arquitectura y Diseño · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 142,
    emoji: '✨',
    description: 'Tipografía, diseño editorial, identidad de marca (branding), diseño UI/UX, animación y medios interactivos.',
    subjects: [
      pujSub('DCV-1101', 'Fundamentos Visuales, Color y Tipografía', '✒️', 'rose', 'Leyes de la Gestalt, teoría del color, anatomía tipográfica y retículas editoriales.', [
        'Leyes de la Percepción Visual (Gestalt): Figura-Fondo, Proximidad, Cierre y Continuidad',
        'Clasificación Tipográfica, Interlineado, Kerning, Tracking y Sistemas de Retículas',
      ], 1, 4),
      pujSub('DCV-2102', 'Diseño de Interacción, UX/UI y Sistemas Digitales', '📱', 'blue', 'Arquitectura de información, wireframing, sistemas de diseño (Design Systems) y usabilidad.', [
        'Investigación de Usuarios, Flujos de Navegación y Heurísticas de Usabilidad de Nielsen',
        'Sistemas de Diseño (Tokens, Componentes Atómicos) y Accesibilidad Web (WCAG)',
      ], 4, 4),
    ],
  },

  // ============================================================================
  // 11. FACULTAD DE COMUNICACIÓN Y LENGUAJE (3 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_comunicacion_social',
    name: 'Comunicación Social',
    faculty: 'Facultad de Comunicación y Lenguaje · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🎙️',
    description: 'Periodismo, comunicación organizacional, producción audiovisual, publicidad y cultura digital.',
    subjects: [
      pujSub('COM-1101', 'Teorías de la Comunicación y Semiótica', '🎙️', 'purple', 'Escuelas de comunicación (Frankfurt, Birmingham, McLuhan), semiótica de Peirce/Barthes y medios.', [
        'Modelos Clásicos (Shannon-Weaver, Lasswell), Escuela de Frankfurt y Estudios Culturales',
        'Análisis Semiótico del Discurso y la Imagen (Significante, Significado, Denotación y Connotación)',
      ], 1, 3),
      pujSub('COM-2102', 'Narrativas Periodísticas, Audiovisuales y Transmedia', '🎬', 'rose', 'Crónica, reportaje investigativo, lenguaje cinematográfico y storytelling multiplataforma.', [
        'Géneros Periodísticos (Noticia, Crónica, Perfil y Reportaje de Investigación)',
        'Guion, Planimetría, Montaje Audiovisual y Narrativas Transmedia',
      ], 3, 4),
      pujSub('COM-3103', 'Comunicación Estratégica y Organizacional', '📢', 'blue', 'Reputación corporativa, manejo de crisis, comunicación interna y estrategia digital.', [
        'Auditoría de Comunicación, Gestión de Stakeholders y Manejo de Crisis Reputacional',
      ], 5, 3),
    ],
  },
  {
    id: 'puj_bibliotecologia',
    name: 'Ciencia de la Información, Bibliotecología y Archivística',
    faculty: 'Facultad de Comunicación y Lenguaje · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '📚',
    description: 'Gestión documental, arquitectura de información, preservación digital, metadatos y ciencia abierta.',
    subjects: [
      pujSub('CIB-1101', 'Organización del Conocimiento, Catalogación y Metadatos', '🗂️', 'blue', 'Estándares RDA, MARC21, Dublin Core, taxonomías, ontologías y web semántica.', [
        'Catalogación Descriptiva (RDA), Metadatos Dublin Core y Ontologías Web',
        'Sistemas de Clasificación Documental, Tesauros e Indización',
      ], 2, 3),
      pujSub('CIB-2102', 'Gestión Documental, Archivística y Preservación Digital', '🏛️', 'emerald', 'Tablas de retención documental (TRD), ciclo vital del documento y archivos electrónicos.', [
        'Principio de Procedencia y Orden Original, Ciclo Vital del Documento y Elaboración de TRD',
      ], 4, 4),
    ],
  },
  {
    id: 'puj_lenguas_modernas',
    name: 'Licenciatura en Lenguas Modernas (Inglés y Francés)',
    faculty: 'Facultad de Comunicación y Lenguaje · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 9,
    totalCredits: 150,
    emoji: '🗣️',
    description: 'Lingüística aplicada, fonética, didáctica de lenguas extranjeras, bilingüismo e interculturalidad.',
    subjects: [
      pujSub('LLM-1101', 'Lingüística General, Fonética y Morfosintaxis', '🗣️', 'amber', 'Fonología (AFI/IPA), morfología, sintaxis, semántica y pragmática del lenguaje.', [
        'Transcripción Fonética Internacional (IPA) y Puntos/Modos de Articulación',
        'Análisis Morfosintáctico, Actos de Habla y Pragmática Lingüística',
      ], 2, 3),
      pujSub('LLM-2102', 'Didáctica de las Lenguas y Adquisición de Segunda Lengua (SLA)', '🇬🇧', 'blue', 'Enfoques comunicativos, diseño curricular MCER (A1-C1) y evaluación de competencias.', [
        'Teorías de Adquisición de Segunda Lengua (Krashen, Interlengua y Enfoque por Tareas)',
        'Diseño de Sílabos y Evaluación alineada al Marco Común Europeo (MCER)',
      ], 4, 4),
    ],
  },

  // ============================================================================
  // 12. FACULTAD DE ARTES (3 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_artes_visuales',
    name: 'Artes Visuales',
    faculty: 'Facultad de Artes · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🖼️',
    description: 'Expresión plástica, pintura, escultura, fotografía, videoarte, curaduría e historia del arte.',
    subjects: [
      pujSub('ARV-1101', 'Taller de Imagen Plástica, Dibujo y Color', '🎨', 'rose', 'Anatomía artística, perspectiva, teoría cromática, composición y técnicas pictóricas.', [
        'Proporción, Perspectiva Espacial, Claroscuro y Contraste Cromático',
        'Materialidades Plásticas, Instalación y Arte Contemporáneo',
      ], 1, 4),
      pujSub('ARV-2102', 'Historia y Teoría del Arte Moderno y Latinoamericano', '🖼️', 'purple', 'Vanguardias artísticas, estética, crítica de arte, museología y curaduría.', [
        'Vanguardias del Siglo XX, Arte Conceptual y Prácticas Artísticas en América Latina',
      ], 3, 3),
    ],
  },
  {
    id: 'puj_estudios_musicales',
    name: 'Estudios Musicales',
    faculty: 'Facultad de Artes · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 10,
    totalCredits: 160,
    emoji: '🎵',
    description: 'Interpretación instrumental/vocal, composición, dirección, producción de audio, armonía y contrapunto.',
    subjects: [
      pujSub('MUS-1101', 'Teoría Musical, Armonía y Entrenamiento Auditivo', '🎼', 'amber', 'Armonía tonal y modal, conducción de voces, solfeo, rítmica y análisis musical.', [
        'Acordes Diatónicos, Dominantes Secundarias, Modulación y Conducción de Voces',
        'Dictado Melódico-Armónico, Solfeo Modal y Polirritmia',
      ], 1, 4),
      pujSub('MUS-2102', 'Contrapunto, Orquestación y Producción de Audio', '🎹', 'purple', 'Contrapunto por especies, instrumentación sinfónica, acústica y mezcla digital.', [
        'Contrapunto Modal y Tonal, Fuga y Técnicas de Orquestación',
        'Acústica Musical, Flujo de Señal, Microfonía y Mezcla en DAW',
      ], 4, 4),
    ],
  },
  {
    id: 'puj_artes_escenicas',
    name: 'Artes Escénicas',
    faculty: 'Facultad de Artes · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🎭',
    description: 'Actuación, danza contemporánea, movimiento, dramaturgia, dirección escénica y producción teatral.',
    subjects: [
      pujSub('AES-1101', 'Taller de Actuación, Cuerpo y Voz Escénica', '🎭', 'rose', 'Técnicas actorales (Stanislavski, Grotowski, Lecoq), expresión corporal y proyección vocal.', [
        'Acción Física, Memoria Emotiva y Construcción de Personaje (Stanislavski / Chejov)',
        'Biomecánica Escénica, Danza Contemporánea yResonadores Vocales',
      ], 1, 4),
      pujSub('AES-2102', 'Dramaturgia, Dirección y Puesta en Escena', '🎬', 'purple', 'Análisis dramatúrgico, estructura dramática, escenografía, iluminación y gestión cultural.', [
        'Conflicto Dramático, Arco de Transformación y Diseño Escenográfico/Lumínico',
      ], 4, 4),
    ],
  },

  // ============================================================================
  // 13. FACULTAD DE CIENCIAS SOCIALES (4 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_antropologia',
    name: 'Antropología',
    faculty: 'Facultad de Ciencias Sociales · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '🏺',
    description: 'Antropología sociocultural, etnografía, arqueología, bioantropología y patrimonio cultural.',
    subjects: [
      pujSub('ANT-1101', 'Teoría Antropológica y Método Etnográfico', '🏺', 'amber', 'Funcionalismo, estructuralismo (Lévi-Strauss), antropología simbólica y trabajo de campo.', [
        'Evolucionismo, Particularismo Histórico (Boas), Funcionalismo (Malinowski) y Estructuralismo',
        'Observación Participante, Diario de Campo y Descripción Densa (Clifford Geertz)',
      ], 1, 4),
      pujSub('ANT-2102', 'Arqueología, Bioantropología y Etnología Colombiana', '🌎', 'emerald', 'Poblamiento americano, sociedades prehispánicas y diversidad étnica en Colombia.', [
        'Arqueología Prehispánica de Colombia y Derechos de Comunidades Indígenas y Afrodescendientes',
      ], 3, 3),
    ],
  },
  {
    id: 'puj_historia',
    name: 'Historia',
    faculty: 'Facultad de Ciencias Sociales · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '📜',
    description: 'Historiografía, paleografía, historia de Colombia, América Latina y el mundo, y archivo histórico.',
    subjects: [
      pujSub('HIS-1101', 'Teoría de la Historia, Historiografía y Fuentes', '📜', 'amber', 'Escuela de los Annales, historia social, historia conceptual y crítica documental.', [
        'Positivismo, Materialismo Histórico, Escuela de los Annales (Braudel) y Microhistoria',
        'Heurística, Crítica de Fuentes Primarias y Paleografía Colonial',
      ], 1, 4),
      pujSub('HIS-2102', 'Historia de Colombia (Colonia, Siglo XIX y Contemporánea)', '🏛️', 'blue', 'Independencia, construcción del Estado-nación, violencia bipartidista y procesos de paz.', [
        'Reformas Borbónicas, Independencia, Federalismo vs Centralismo y Siglo XX en Colombia',
      ], 3, 4),
    ],
  },
  {
    id: 'puj_literatura',
    name: 'Estudios Literarios (Literatura)',
    faculty: 'Facultad de Ciencias Sociales · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '📖',
    description: 'Teoría y crítica literaria, literatura clásica, universal, latinoamericana y colombiana, y edición.',
    subjects: [
      pujSub('LIT-1101', 'Teoría Literaria, Poética y Narratología', '📖', 'purple', 'Formalismo ruso, estructuralismo, hermenéutica, estética de la recepción y métrica.', [
        'Narratología (Genette): Voz, Modo, Tiempo Narrativo y Focalización',
        'Figuras Retóricas, Métrica Poética y Crítica Literaria Contemporánea',
      ], 1, 4),
      pujSub('LIT-2102', 'Literatura Latinoamericana, Colombiana y Gestión Editorial', '✒️', 'rose', 'Modernismo, vanguardias, Boom latinoamericano, narrativa contemporánea y edición de libros.', [
        'Del Modernismo y las Vanguardias al Boom Latinoamericano (Borges, Rulfo, García Márquez)',
      ], 4, 4),
    ],
  },
  {
    id: 'puj_sociologia',
    name: 'Sociología',
    faculty: 'Facultad de Ciencias Sociales · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '👥',
    description: 'Teoría sociológica clásica y contemporánea, métodos cuantitativos/cualitativos y análisis social.',
    subjects: [
      pujSub('SOC-1101', 'Teoría Sociológica Clásica y Contemporánea', '👥', 'blue', 'Marx, Durkheim, Weber, Bourdieu, Habermas, Luhmann y estratificación social.', [
        'Hecho Social y Solidaridad (Durkheim), Acción Social y Burocracia (Weber), Lucha de Clases (Marx)',
        'Habitus y Campos Sociales en Pierre Bourdieu y Teoría de Sistemas en Luhmann',
      ], 1, 4),
      pujSub('SOC-2102', 'Metodología de Investigación Social Cuantitativa y Cualitativa', '📊', 'emerald', 'Diseño de encuestas, muestreo, estadística social, grupos focales y análisis de discurso.', [
        'Operacionalización de Variables, Diseño Muestral y Análisis Estadístico en Ciencias Sociales',
      ], 3, 4),
    ],
  },

  // ============================================================================
  // 14. FACULTAD DE FILOSOFÍA (2 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_filosofia',
    name: 'Filosofía',
    faculty: 'Facultad de Filosofía · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '🦉',
    description: 'Ontología, epistemología, lógica simbólica, ética, filosofía política, antigua, moderna y contemporánea.',
    subjects: [
      pujSub('FIL-1101', 'Lógica Formal, Argumentación y Epistemología', '🦉', 'purple', 'Lógica proposicional, cuantificacional, tablas de verdad, deducción natural y teoría del conocimiento.', [
        'Cálculo Proposicional, Reglas de Inferencia (Modus Ponens, Modus Tollens) y Cuantificadores',
        'Problema del Conocimiento (Platón, Descartes, Hume, Kant y Epistemología Analítica)',
      ], 1, 4),
      pujSub('FIL-2102', 'Historia de la Filosofía (Antigua, Moderna y Fenomenología)', '🏛️', 'amber', 'Platón, Aristóteles, Kant, Hegel, Nietzsche, Husserl, Heidegger y Wittgenstein.', [
        'Metafísica y Ética Nicomáquea en Aristóteles; Crítica de la Razón Pura en Kant',
        'Fenomenología, Hermenéutica (Heidegger/Gadamer) y Giro Lingüístico',
      ], 3, 4),
    ],
  },
  {
    id: 'puj_lic_filosofia',
    name: 'Licenciatura en Filosofía',
    faculty: 'Facultad de Filosofía · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🎓',
    description: 'Pedagogía filosófica, didáctica del pensamiento crítico, ética ciudadana y tradición filosófica.',
    subjects: [
      pujSub('LFI-1101', 'Didáctica de la Filosofía y Pensamiento Crítico', '🎓', 'blue', 'Comunidades de indagación, filosofía para niños y jóvenes, currículo y evaluación.', [
        'Metodología de Comunidad de Indagación Filosófica (Matthew Lipman) y Didáctica Crítica',
      ], 2, 4),
    ],
  },

  // ============================================================================
  // 15. FACULTAD DE EDUCACIÓN (4 PREGRADOS)
  // ============================================================================
  {
    id: 'puj_educacion_infantil',
    name: 'Licenciatura en Educación Infantil',
    faculty: 'Facultad de Educación · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🧸',
    description: 'Desarrollo infantil, pedagogía, didácticas de la primera infancia, juego, literatura y educación inclusiva.',
    subjects: [
      pujSub('EDI-1101', 'Desarrollo Integral en la Primera Infancia y Pedagogía', '🧸', 'rose', 'Neurodesarrollo infantil, teorías pedagógicas (Montessori, Reggio Emilia) y diseño de ambientes.', [
        'Actividades Rectoras de la Primera Infancia: El Juego, el Arte, la Literatura y la Exploración',
        'Diseño Universal para el Aprendizaje (DUA) y Educación Inclusiva',
      ], 1, 4),
    ],
  },
  {
    id: 'puj_lic_ciencias_naturales',
    name: 'Licenciatura en Ciencias Naturales y Educación Ambiental',
    faculty: 'Facultad de Educación · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🌱',
    description: 'Didáctica de la biología, física y química, proyectos ambientales escolares (PRAE) y sostenibilidad.',
    subjects: [
      pujSub('LCN-1101', 'Didáctica de las Ciencias Experimentales y PRAE', '🌱', 'emerald', 'Aprendizaje basado en indagación científica, prácticas de laboratorio y educación ambiental.', [
        'Modelización Científica Escolar, Cambio Conceptual y Diseño de Proyectos PRAE',
      ], 2, 4),
    ],
  },
  {
    id: 'puj_lic_educacion_fisica',
    name: 'Licenciatura en Educación Física',
    faculty: 'Facultad de Educación · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '🏃',
    description: 'Fisiología del ejercicio, motricidad humana, entrenamiento deportivo, recreación y pedagogía corporal.',
    subjects: [
      pujSub('LEF-1101', 'Fisiología del Ejercicio, Biomecánica y Motricidad', '🏃', 'blue', 'Sistemas energéticos (ATP-PC, glucolítico, oxidativo), desarrollo motor y prescripción del ejercicio.', [
        'Vías Metabólicas en el Ejercicio, Consumo Máximo de Oxígeno (VO2 máx) y Principios del Entrenamiento',
      ], 2, 4),
    ],
  },
  {
    id: 'puj_lic_literatura',
    name: 'Licenciatura en Literatura y Lengua Castellana',
    faculty: 'Facultad de Educación · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 144,
    emoji: '✍️',
    description: 'Didáctica de la lengua materna, promoción de lectura y escritura académica, lingüística y literatura.',
    subjects: [
      pujSub('LLL-1101', 'Lingüística Hispánica y Didáctica de la Lectoescritura', '✍️', 'purple', 'Gramática del español, sociolingüística, mediación lectora y producción textual.', [
        'Procesos de Comprensión Lectora (Literal, Inferencial y Crítico) y Didáctica de la Escritura',
      ], 2, 4),
    ],
  },

  // ============================================================================
  // 16. FACULTAD DE ESTUDIOS AMBIENTALES Y RURALES (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_ecologia',
    name: 'Ecología',
    faculty: 'Facultad de Estudios Ambientales y Rurales · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 140,
    emoji: '🌳',
    description: 'Ecología de poblaciones, comunidades y paisajes, sistemas socioecológicos, SIG y gestión ambiental.',
    subjects: [
      pujSub('ECL-1101', 'Ecología de Poblaciones, Comunidades y Ecosistemas', '🌳', 'emerald', 'Dinámica poblacional (crecimiento exponencial/logístico), nicho ecológico y ciclos biogeoquímicos.', [
        'Modelos de Crecimiento Poblacional (Lotka-Volterra: Competencia y Depredación)',
        'Sucesión Ecológica, Índices de Diversidad (Shannon/Simpson) y Servicios Ecosistémicos',
      ], 2, 4),
      pujSub('ECL-2102', 'Ecología del Paisaje, SIG y Gestión Ambiental', '🗺️', 'blue', 'Cartografía digital, teledetección, restauración ecológica y evaluación de impacto ambiental.', [
        'Sistemas de Información Geográfica (SIG), Conectividad Ecológica y Estudios de Impacto Ambiental (EIA)',
      ], 4, 4),
    ],
  },

  // ============================================================================
  // 17. FACULTAD DE TEOLOGÍA (1 PREGRADO)
  // ============================================================================
  {
    id: 'puj_teologia',
    name: 'Teología',
    faculty: 'Facultad de Teología · PUJ',
    university: 'Pontificia Universidad Javeriana',
    semesters: 8,
    totalCredits: 136,
    emoji: '🕊️',
    description: 'Sagrada Escritura (exégesis bíblica), teología sistemática, teología moral, pastoral y diálogo interreligioso.',
    subjects: [
      pujSub('TEO-1101', 'Introducción a la Sagrada Escritura y Hermenéutica Bíblica', '🕊️', 'amber', 'Pentateuco, literatura profética, evangelios sinópticos y métodos histórico-críticos.', [
        'Métodos Exegéticos (Histórico-Crítico, Narrativo y Contextual) en Antiguo y Nuevo Testamento',
      ], 1, 4),
      pujSub('TEO-2102', 'Teología Sistemática, Antropología Teológica y Ética Social', '✨', 'purple', 'Cristología, eclesiología, doctrina social y construcción de paz.', [
        'Antropología Teológica, Cristología y Compromiso Ético-Social Latinoamericano',
      ], 3, 4),
    ],
  },

  // ============================================================================
  // 18. PERSONALIZADA / OTRA CARRERA
  // ============================================================================
  {
    id: 'personalizada',
    name: 'Personalizada / Otra Carrera o Doble Programa',
    faculty: 'Plan de Estudio Abierto',
    university: 'Pontificia Universidad Javeriana / Otra Institución',
    emoji: '✨',
    description: 'Arma tus propias asignaturas desde cero según tus electivas, énfasis o doble programa.',
    subjects: [],
  },
];

export const MOTIVATIONAL_QUOTES = [
  {
    id: 'quote_1',
    text: 'La educación no es llenar un balde de agua, sino encender un fuego inextinguible.',
    author: 'William Butler Yeats',
    tag: 'Pasión por Aprender',
    imageBg: 'from-amber-500/20 via-orange-500/10 to-rose-500/20',
    avatarPet: '🦉',
  },
  {
    id: 'quote_2',
    text: 'Nunca consideres el estudio como una obligación, sino como una oportunidad para penetrar en el bello mundo del saber.',
    author: 'Albert Einstein',
    tag: 'Curiosidad Científica',
    imageBg: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
    avatarPet: '🤖',
  },
  {
    id: 'quote_3',
    text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día, tema tras tema.',
    author: 'Robert Collier',
    tag: 'Constancia Diaria',
    imageBg: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    avatarPet: '🦊',
  },
  {
    id: 'quote_4',
    text: 'Lo que con esfuerzo se adquiere, más se ama y nunca se olvida.',
    author: 'Aristóteles',
    tag: 'Dominio Auténtico',
    imageBg: 'from-purple-500/20 via-pink-500/10 to-rose-500/20',
    avatarPet: '🐱',
  },
  {
    id: 'quote_5',
    text: 'No hay nada más poderoso que una mente decidida a dominar sus materias antes del parcial.',
    author: 'Filosofía MiSemáforo · PUJ',
    tag: 'Excelencia Javeriana',
    imageBg: 'from-rose-500/20 via-amber-500/10 to-yellow-500/20',
    avatarPet: '🐲',
  },
  {
    id: 'quote_6',
    text: 'Cada tema en Rojo que conviertes en Amarillo y Verde es un paso gigante hacia tu graduación.',
    author: 'Consejo Pedagógico',
    tag: 'Técnica Feynman',
    imageBg: 'from-emerald-500/20 via-sky-500/10 to-indigo-500/20',
    avatarPet: '🦎',
  },
];

export const ANIMAL_COMPANIONS = [
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
 * Las 17 Facultades oficiales de la Pontificia Universidad Javeriana (PUJ)
 */
export const PUJ_FACULTIES: string[] = Array.from(
  new Set(
    UNIVERSITY_TEMPLATES.filter((c) => c.id !== 'personalizada').map((c) => c.faculty)
  )
);
