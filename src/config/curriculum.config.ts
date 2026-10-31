export interface SubjectTemplate {
  name: string;
  code: string;
  colorTheme: string;
  emoji: string;
  topics: { name: string; status: 'green' | 'yellow' | 'red'; summary?: string }[];
  summary?: string;
}

export interface CareerOption {
  id: string;
  name: string;
  faculty: string;
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

export const SCHOOL_TEMPLATES: GradeOption[] = [
  {
    id: 'school_10_11',
    name: 'Bachillerato (10° y 11° Grado)',
    emoji: '🎒',
    description: 'Preparación para el ICFES / Pruebas de Estado y transición a la universidad.',
    subjects: [
      {
        name: 'Trigonometría y Cálculo',
        code: 'MAT-101',
        colorTheme: 'blue',
        emoji: '📐',
        summary: 'Identidades trigonométricas, funciones, razones trigonométricas y límites.',
        topics: [
          { name: 'Razones Trigonométricas (SohCahToa)', status: 'green', summary: 'sen = op/hip, cos = ady/hip, tan = op/ady' },
          { name: 'Ley del Seno y del Coseno', status: 'yellow', summary: 'Usar ley de senos para ángulos y lados opuestos; ley de cosenos cuando se conocen 2 lados y el ángulo comprendido.' },
          { name: 'Identidades Fundamentales', status: 'red', summary: 'sen²(x) + cos²(x) = 1; 1 + tan²(x) = sec²(x)' },
        ],
      },
      {
        name: 'Física Clásica',
        code: 'FIS-101',
        colorTheme: 'purple',
        emoji: '⚡',
        summary: 'Cinemática, Dinámica de Newton, Trabajo, Energía y Ondas.',
        topics: [
          { name: 'Leyes de Newton (Inercia y F=ma)', status: 'green', summary: 'Primera ley: inercia. Segunda ley: sumatoria de F = m*a.' },
          { name: 'Tiro Parabólico y Cinemática', status: 'yellow', summary: 'Movimiento horizontal uniforme (Vx cte) + caída libre vertical (g=9.8m/s²).' },
          { name: 'Conservación de la Energía Mecánica', status: 'red', summary: 'Em = Ec + Ep = constante si no hay fuerzas no conservativas.' },
        ],
      },
      {
        name: 'Química Orgánica e Inorgánica',
        code: 'QUI-101',
        colorTheme: 'emerald',
        emoji: '🔬',
        summary: 'Estequiometría, gases ideales, soluciones químicas y grupos funcionales.',
        topics: [
          { name: 'Balanceo de Ecuaciones Químicas', status: 'green', summary: 'Conservación de la masa en reactivos y productos.' },
          { name: 'Estequiometría y Mol', status: 'yellow', summary: '1 mol = 6.022x10²³ partículas. Conversión gramos a moles.' },
          { name: 'Nomenclatura de Hidrocarburos', status: 'red', summary: 'Alcanos (-ano), Alquenos (-eno), Alquinos (-ino).' },
        ],
      },
      {
        name: 'Lengua Castellana y Comprensión',
        code: 'ESP-101',
        colorTheme: 'rose',
        emoji: '📚',
        summary: 'Lectura crítica, tipologías textuales, ensayo argumentativo y semántica.',
        topics: [
          { name: 'Tesis y Argumentos en Ensayos', status: 'green', summary: 'La tesis es la postura central; los argumentos la defienden con evidencias.' },
          { name: 'Falacias Argumentativas', status: 'yellow', summary: 'Ad hominem, petición de principio, falso dilema.' },
        ],
      },
      {
        name: 'Biología y Genética',
        code: 'BIO-101',
        colorTheme: 'emerald',
        emoji: '🧬',
        summary: 'Célula, leyes de Mendel, ADN, transcripción y ecosistemas.',
        topics: [
          { name: 'Mitosis vs Meiosis', status: 'yellow', summary: 'Mitosis produce 2 células somáticas 2n; meiosis produce 4 gametos haploides n.' },
          { name: 'Leyes de Mendel y Cuadros de Punnett', status: 'green', summary: 'Segregación independiente y alelos dominantes/recesivos.' },
        ],
      },
      {
        name: 'Inglés Comunicativo',
        code: 'ING-101',
        colorTheme: 'amber',
        emoji: '🇬🇧',
        summary: 'Tiempos verbales, condicionales y comprensión de lectura B1/B2.',
        topics: [
          { name: 'Present Perfect vs Past Simple', status: 'green', summary: 'Have/has + past participle para experiencias pasadas sin fecha fija.' },
          { name: 'Second and Third Conditionals', status: 'red', summary: 'If I were... I would... / If I had known... I would have...' },
        ],
      },
    ],
  },
  {
    id: 'school_6_9',
    name: 'Secundaria Básica (6° a 9° Grado)',
    emoji: '🎒',
    description: 'Bases de matemáticas, lenguaje, ciencias naturales y ciencias sociales.',
    subjects: [
      {
        name: 'Álgebra y Aritmética',
        code: 'MAT-80',
        colorTheme: 'blue',
        emoji: '📐',
        summary: 'Operaciones con enteros, fracciones, monomios y factorización básica.',
        topics: [
          { name: 'Operaciones con Fracciones y Signos', status: 'green' },
          { name: 'Productos Notables y Factorización', status: 'yellow' },
          { name: 'Ecuaciones de Primer Grado con una Incógnita', status: 'red' },
        ],
      },
      {
        name: 'Ciencias Naturales',
        code: 'CNAT-80',
        colorTheme: 'emerald',
        emoji: '🌿',
        summary: 'Sistemas del cuerpo humano, la célula y reinos de la naturaleza.',
        topics: [
          { name: 'Organelos Celulares y sus Funciones', status: 'green' },
          { name: 'Sistema Circulatorio y Respiratorio', status: 'yellow' },
          { name: 'Ecosistemas y Redes Tróficas', status: 'green' },
        ],
      },
      {
        name: 'Ciencias Sociales e Historia',
        code: 'SOC-80',
        colorTheme: 'amber',
        emoji: '🏛️',
        summary: 'Geografía física, civilizaciones antiguas y derechos humanos.',
        topics: [
          { name: 'Civilizaciones de la Antigüedad (Grecia y Roma)', status: 'green' },
          { name: 'Geografía Universal y Líneas Imaginarias', status: 'yellow' },
        ],
      },
    ],
  },
];

export const UNIVERSITY_TEMPLATES: CareerOption[] = [
  {
    id: 'medicina',
    name: 'Medicina y Ciencias de la Salud',
    faculty: 'Facultad de Medicina',
    emoji: '🩺',
    description: 'Ciencias biomédicas, anatomía humana, fisiología y farmacología clínica.',
    subjects: [
      {
        name: 'Anatomía Humana Descriptiva',
        code: 'MED-101',
        colorTheme: 'rose',
        emoji: '🩺',
        summary: 'Osteología, miología, inervación vascular y topografía anatómica.',
        topics: [
          { name: 'Huesos del Cráneo y Fosas Craneales', status: 'yellow', summary: 'Fosa anterior (etmoides/frontal), media (esfenoides/temporal), posterior (occipital).' },
          { name: 'Plexo Braquial y Ramas Terminales', status: 'red', summary: 'Raíces C5-T1 -> Troncos -> Divisiones -> Fascículos -> Nervios radial, mediano, ulnar, axilar y musculocutáneo.' },
          { name: 'Vascularización del Miocardio (Coronarias)', status: 'green', summary: 'Coronaria derecha irriga nodo SA y AV en 90%; coronaria izquierda DA irriga tabique.' },
        ],
      },
      {
        name: 'Fisiología Médica',
        code: 'MED-102',
        colorTheme: 'purple',
        emoji: '🫀',
        summary: 'Potenciales de acción, ciclo cardíaco, filtración glomerular y control hormonal.',
        topics: [
          { name: 'Potencial de Acción Neuronal y Cardíaco', status: 'green', summary: 'Fase 0 (Na rápido), fase 1 (repolarización inicial), fase 2 (meseta Ca L), fase 3 (K).' },
          { name: 'Ciclo Cardíaco y Diagrama de Wiggers', status: 'yellow', summary: 'Sístole: contracción isovolumétrica y eyección; diástole: relajación y llenado.' },
          { name: 'Sistema Renina-Angiotensina-Aldosterona', status: 'red', summary: 'Aparato yuxtaglomerular -> Renina -> Angiotensinógeno a Angio I -> ECA (pulmón) -> Angio II (vasoconstricción) -> Aldosterona (retiene Na y agua).' },
        ],
      },
      {
        name: 'Bioquímica y Biología Molecular',
        code: 'MED-103',
        colorTheme: 'blue',
        emoji: '🧪',
        summary: 'Metabolismo de carbohidratos, lípidos, ciclo de Krebs y síntesis de proteínas.',
        topics: [
          { name: 'Glucólisis y Destinos del Piruvato', status: 'green', summary: 'Glucosa a 2 piruvatos rinde 2 ATP netos y 2 NADH.' },
          { name: 'Ciclo de Krebs y Fosforilación Oxidativa', status: 'yellow', summary: 'Cadena transportadora de electrones con complejos I a IV y ATP sintasa.' },
          { name: 'Vía de las Pentosas Fosfato', status: 'red', summary: 'Genera NADPH para defensas antioxidantes (glutatión) y ribosa-5-P para nucleótidos.' },
        ],
      },
      {
        name: 'Farmacología General',
        code: 'MED-104',
        colorTheme: 'emerald',
        emoji: '💊',
        summary: 'Farmacocinética (LADME), farmacodinamia, receptores e interacciones medicamentosas.',
        topics: [
          { name: 'Farmacocinética: Volumen de Distribución y Clearance', status: 'yellow', summary: 'Vd = Dosis / Concentración plasmática inicial.' },
          { name: 'Agonistas, Antagonistas e Índice Terapéutico', status: 'green', summary: 'IT = Dosis Tóxica 50 / Dosis Efectiva 50. Mayor IT = fármaco más seguro.' },
        ],
      },
    ],
  },
  {
    id: 'sistemas',
    name: 'Ingeniería de Sistemas y Computación',
    faculty: 'Facultad de Ingeniería',
    emoji: '💻',
    description: 'Algoritmos, estructuras de datos, cálculo diferencial, bases de datos y arquitectura.',
    subjects: [
      {
        name: 'Cálculo Diferencial e Integral',
        code: 'ING-101',
        colorTheme: 'blue',
        emoji: '📐',
        summary: 'Límites, derivadas, optimización, integrales definidas y teorema fundamental del cálculo.',
        topics: [
          { name: 'Regla de la Cadena y Derivación Implícita', status: 'green', summary: 'd/dx f(g(x)) = f\'(g(x)) * g\'(x).' },
          { name: 'Optimización y Criterio de la 2da Derivada', status: 'yellow', summary: 'f\'\'(x) > 0 -> Mínimo local (cóncava hacia arriba); f\'\'(x) < 0 -> Máximo local.' },
          { name: 'Integración por Partes y Sustitución', status: 'red', summary: 'Integral de u dv = u*v - integral de v du (Un Día Vi Una Vaca...).' },
        ],
      },
      {
        name: 'Estructuras de Datos y Algoritmos',
        code: 'SIS-201',
        colorTheme: 'purple',
        emoji: '💻',
        summary: 'Complejidad algorítmica Big-O, árboles binarios, grafos y algoritmos de búsqueda.',
        topics: [
          { name: 'Notación Big-O y Análisis Asintótico', status: 'green', summary: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²).' },
          { name: 'Árboles Binarios de Búsqueda (BST) y AVL', status: 'yellow', summary: 'Hijo izq < raíz < hijo der. Árboles balanceados con rotaciones simples y dobles.' },
          { name: 'Algoritmos Dijkstra y BFS/DFS en Grafos', status: 'red', summary: 'Dijkstra usa cola de prioridad para caminos más cortos con pesos no negativos.' },
        ],
      },
      {
        name: 'Álgebra Lineal',
        code: 'MAT-102',
        colorTheme: 'amber',
        emoji: '📊',
        summary: 'Matrices, determinantes, espacios vectoriales, autovalores y transformaciones lineales.',
        topics: [
          { name: 'Eliminación Gauss-Jordan y Sistemas NxN', status: 'green', summary: 'Operaciones elementales de fila para llegar a la matriz escalonada reducida.' },
          { name: 'Autovalores y Autovectores (Eigenvalues)', status: 'red', summary: 'det(A - lambda*I) = 0 da el polinomio característico.' },
        ],
      },
      {
        name: 'Bases de Datos Relacionales y NoSQL',
        code: 'SIS-203',
        colorTheme: 'emerald',
        emoji: '🗄️',
        summary: 'Modelo entidad-relación, SQL avanzado, normalización (1FN-3FN) e indexación.',
        topics: [
          { name: 'Joins y Subconsultas Complejas', status: 'green', summary: 'INNER JOIN, LEFT JOIN, agregaciones con GROUP BY y HAVING.' },
          { name: 'Formas Normales (1FN, 2FN, 3FN)', status: 'yellow', summary: 'Eliminar redundancias y dependencias transitivas.' },
        ],
      },
    ],
  },
  {
    id: 'derecho',
    name: 'Derecho y Ciencias Jurídicas',
    faculty: 'Facultad de Derecho',
    emoji: '⚖️',
    description: 'Derecho constitucional, argumentación jurídica, derecho penal y civil.',
    subjects: [
      {
        name: 'Derecho Constitucional Colombiano',
        code: 'DER-101',
        colorTheme: 'amber',
        emoji: '⚖️',
        summary: 'Estructura del Estado, derechos fundamentales, acción de tutela y control de constitucionalidad.',
        topics: [
          { name: 'Acción de Tutela y Requisitos de Procedibilidad', status: 'green', summary: 'Mecanismo preferente y sumario para proteger derechos fundamentales ante vulneración actual o inminente.' },
          { name: 'Bloque de Constitucionalidad', status: 'yellow', summary: 'Tratados internacionales de DDHH ratificados hacen parte del ordenamiento constitucional supremo.' },
          { name: 'Control Concentrado vs Control Difuso', status: 'red', summary: 'Corte Constitucional ejerce el concentrado; cualquier juez puede aplicar excepción de inconstitucionalidad.' },
        ],
      },
      {
        name: 'Teoría General del Derecho y Argumentación',
        code: 'DER-102',
        colorTheme: 'purple',
        emoji: '📜',
        summary: 'Fuentes del derecho, hermenéutica jurídica, ponderación y silogismo judicial.',
        topics: [
          { name: 'Criterios de Interpretación de Savigny', status: 'green', summary: 'Gramatical, histórico, lógico y sistemático.' },
          { name: 'Test de Proporcionalidad de Robert Alexy', status: 'red', summary: 'Idoneidad, necesidad y proporcionalidad en sentido estricto.' },
        ],
      },
      {
        name: 'Derecho Civil: Personas y Bienes',
        code: 'DER-103',
        colorTheme: 'rose',
        emoji: '🏛️',
        summary: 'Atributos de la personalidad, posesión, propiedad y derechos reales.',
        topics: [
          { name: 'Atributos de la Personalidad Jurídica', status: 'green', summary: 'Nombre, capacidad, domicilio, estado civil, nacionalidad y patrimonio.' },
          { name: 'Posesión vs Mera Tenencia vs Propiedad', status: 'yellow', summary: 'Posesión requiere animus y corpus; mera tenencia reconoce dominio ajeno.' },
        ],
      },
    ],
  },
  {
    id: 'administracion',
    name: 'Administración de Empresas y Negocios',
    faculty: 'Facultad de Ciencias Económicas',
    emoji: '📈',
    description: 'Gestión estratégica, finanzas corporativas, marketing y contabilidad gerencial.',
    subjects: [
      {
        name: 'Contabilidad Financiera y de Costos',
        code: 'ADM-101',
        colorTheme: 'emerald',
        emoji: '📊',
        summary: 'Balance general, estado de resultados, flujo de caja y punto de equilibrio.',
        topics: [
          { name: 'Ecuación Patrimonial Fundamental', status: 'green', summary: 'Activo = Pasivo + Patrimonio Neto.' },
          { name: 'Cálculo del Punto de Equilibrio en Unidades y Pesos', status: 'yellow', summary: 'PE = Costos Fijos / (Precio de Venta - Costo Variable Unitario).' },
          { name: 'Flujo de Caja Libre y EBITDA', status: 'red', summary: 'Earnings Before Interest, Taxes, Depreciation, and Amortization como indicador de caja operativa.' },
        ],
      },
      {
        name: 'Microeconomía y Teoría de Juegos',
        code: 'ECO-101',
        colorTheme: 'blue',
        emoji: '📉',
        summary: 'Oferta y demanda, elasticidades, estructuras de mercado y equilibrio de Nash.',
        topics: [
          { name: 'Elasticidad Precio de la Demanda', status: 'green', summary: 'Elástica (>1), Inelástica (<1), Unitaria (=1).' },
          { name: 'Equilibrio de Nash y Dilema del Prisionero', status: 'yellow', summary: 'Estrategia donde ningún jugador tiene incentivo para cambiar unilateralmente.' },
        ],
      },
      {
        name: 'Marketing Estratégico y Digital',
        code: 'MKT-201',
        colorTheme: 'purple',
        emoji: '🚀',
        summary: 'Las 4 P del Marketing, segmentación de mercado, embudos de conversión y CAC/LTV.',
        topics: [
          { name: 'Métricas CAC y LTV (Customer Lifetime Value)', status: 'yellow', summary: 'Relación saludable: LTV/CAC debe ser mayor a 3:1.' },
          { name: 'Buyer Persona y Propuesta de Valor', status: 'green', summary: 'Mapa de empatía y canvas de propuesta de valor de Osterwalder.' },
        ],
      },
    ],
  },
  {
    id: 'psicologia',
    name: 'Psicología y Ciencias de la Conducta',
    faculty: 'Facultad de Psicología',
    emoji: '🧠',
    description: 'Neuropsicología, psicología cognitiva, psicología clínica y psicometría.',
    subjects: [
      {
        name: 'Neuropsicología y Bases Biológicas',
        code: 'PSI-101',
        colorTheme: 'purple',
        emoji: '🧠',
        summary: 'Lóbulos cerebrales, neurotransmisores, memoria y sistema límbico.',
        topics: [
          { name: 'Lóbulos Cerebrales y sus Funciones', status: 'green', summary: 'Frontal (ejecutivas/motoras), Parietal (somatosensorial), Temporal (audición/memoria), Occipital (visión).' },
          { name: 'Neurotransmisores Clave (Dopamina, Serotonina, GABA)', status: 'yellow', summary: 'GABA es el principal inhibidor; Glutamato es el principal excitador.' },
          { name: 'Consolidación de la Memoria en el Hipocampo', status: 'red', summary: 'Conversión de memoria de corto plazo a largo plazo mediante potenciación a largo plazo (LTP).' },
        ],
      },
    ],
  },
  {
    id: 'personalizada',
    name: 'Personalizada / Otra Carrera',
    faculty: 'Crea tu Propio Plan de Estudio',
    emoji: '✨',
    description: 'Arma tus propias asignaturas según tu pensum académico específico.',
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
    author: 'Filosofía MiSemaforo',
    tag: 'Estrategia Universitaria',
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
    priceVolts: 0, // Mascota inicial gratuita
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
  '🚀', '🗄️', '📜', '💊', '🤖', '🎵', '📈', '💼', '🧭'
];
