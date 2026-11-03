import { CareerOption, SubjectTemplate } from './curriculum.config';

/**
 * Constructor de asignaturas oficiales de la Pontificia Universidad Javeriana (Sede Bogotá)
 * con sus unidades temáticas extraídas del sílabo (syllabus) oficial de cada curso.
 */
export function syl(
  code: string,
  name: string,
  emoji: string,
  colorTheme: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose',
  semester: number,
  credits: number,
  summary: string,
  syllabusTopics: string[]
): SubjectTemplate {
  return {
    code,
    name,
    emoji,
    colorTheme,
    semester,
    credits,
    summary,
    topics: syllabusTopics.map((topicName, index) => ({
      name: topicName,
      status: 'red',
      summary: `Unidad ${index + 1} del Syllabus PUJ Bogotá · ${name} (${code} · Semestre ${semester} · ${credits} créditos): ${summary}`,
    })),
  };
}

// ============================================================================
// BLOQUES TRANSVERSALES Y NÚCLEO DE FORMACIÓN FUNDAMENTAL (NFF) - PUJ BOGOTÁ
// ============================================================================

export const TRONCO_MATEMATICAS_ING: SubjectTemplate[] = [
  syl('MAT-1200', 'Cálculo Diferencial', '📐', 'blue', 1, 3, 'Funciones reales, límites, continuidad, derivada y optimización aplicada a ingeniería.', [
    'Funciones Reales, Dominio, Rango y Modelado Matemático',
    'Límites Laterales, al Infinito, Continuidad y Teorema del Valor Intermedio',
    'La Derivada: Regla de la Cadena, Derivación Implícita y Logarítmica',
    'Teorema de Rolle, Valor Medio y Regla de L’Hôpital',
    'Razones de Cambio Relacionadas y Problemas de Optimización',
  ]),
  syl('MAT-1202', 'Álgebra Lineal', '📊', 'amber', 1, 3, 'Sistemas de ecuaciones lineales, álgebra matricial, espacios vectoriales y autovalores.', [
    'Sistemas de Ecuaciones Lineales y Eliminación de Gauss-Jordan',
    'Álgebra de Matrices, Determinantes y Matriz Inversa',
    'Vectores en R2 y R3, Producto Punto y Producto Cruz',
    'Espacios y Subespacios Vectoriales, Base y Dimensión',
    'Transformaciones Lineales, Valores y Vectores Propios (Diagonalización)',
  ]),
  syl('MAT-1201', 'Cálculo Integral', '∫', 'blue', 2, 3, 'Antiderivadas, integral definida, técnicas de integración, sucesiones y series infinitas.', [
    'Sumas de Riemann, Integral Definida y Teorema Fundamental del Cálculo',
    'Técnicas de Integración: Sustitución, Por Partes, Trigonométricas y Fracciones Parciales',
    'Integrales Impropias y Criterios de Convergencia',
    'Aplicaciones: Áreas, Volúmenes de Revolución y Longitud de Arco',
    'Sucesiones, Series Infinitas, Series de Potencias y Polinomios de Taylor',
  ]),
  syl('FIS-1100', 'Física Mecánica', '⚙️', 'purple', 2, 3, 'Cinemática y dinámica traslacional y rotacional, trabajo, energía y conservación del momento.', [
    'Cinemática en 1D, 2D y 3D: Movimiento Parabólico y Circular',
    'Leyes de Newton, Fricción y Dinámica de la Partícula',
    'Trabajo, Energía Cinética, Energía Potencial y Conservación',
    'Impulso, Cantidad de Movimiento Lineal y Colisiones',
    'Dinámica del Cuerpo Rígido, Torque y Momento Angular',
  ]),
  syl('MAT-1203', 'Cálculo Vectorial', '🧭', 'blue', 3, 3, 'Funciones de varias variables, derivadas parciales, integrales múltiples y cálculo en campos vectoriales.', [
    ' Superficies Cuádricas, Curvas Paramétricas y Funciones Vectoriales',
    'Derivadas Parciales, Vector Gradiente y Derivada Direccional',
    'Optimización sin Restricciones y Multiplicadores de Lagrange',
    'Integrales Dobles y Triples en Coordenadas Polares, Cilíndricas y Esféricas',
    'Teoremas de Green, Stokes y Divergencia de Gauss',
  ]),
  syl('FIS-1101', 'Electricidad y Magnetismo', '⚡', 'amber', 3, 3, 'Electrostática, ley de Gauss, circuitos DC/AC, magnetostática y ecuaciones de Maxwell.', [
    'Ley de Coulomb, Campo Eléctrico y Ley de Gauss',
    'Potencial Eléctrico, Capacitancia y Dieléctricos',
    'Corriente Eléctrica, Ley de Ohm y Leyes de Kirchhoff',
    'Campo Magnético, Fuerza de Lorentz, Ley de Biot-Savart y Ampère',
    'Ley de Inducción de Faraday-Lenz y Ecuaciones de Maxwell',
  ]),
  syl('MAT-1204', 'Ecuaciones Diferenciales', '📈', 'purple', 4, 3, 'EDO de primer y orden superior, transformada de Laplace y sistemas dinámicos lineales.', [
    'EDO de Primer Orden: Variables Separables, Exactas y Factor Integrante',
    'EDO Lineales de Orden Superior con Coeficientes Constantes',
    'Método de Coeficientes Indeterminados y Variación de Parámetros',
    'Transformada de Laplace, Función Delta de Dirac y Convolución',
    'Sistemas de Ecuaciones Diferenciales Lineales y Estabilidad',
  ]),
  syl('IIN-2100', 'Probabilidad y Estadística', '🎲', 'emerald', 4, 3, 'Variables aleatorias, distribuciones de probabilidad, inferencia estadística y regresión.', [
    'Probabilidad Condicional, Independencia y Teorema de Bayes',
    'Variables Aleatorias Discretas y Continuas (Binomial, Poisson, Normal)',
    'Distribución Muestral y Teorema del Límite Central',
    'Intervalos de Confianza y Pruebas de Hipótesis Paramétricas',
    'Análisis de Varianza (ANOVA) y Regresión Lineal Simple y Múltiple',
  ]),
];

export const NFF_JAVERIANO: SubjectTemplate[] = [
  syl('FIL-1010', 'Filosofía y Sentido de la Vida (NFF)', '🦉', 'amber', 5, 2, 'Reflexión antropológica y ética del Núcleo de Formación Fundamental Javeriano.', [
    'Antropología Filosófica y Pregunta por el Sentido Humano',
    'Ética del Cuidado, Dignidad y Responsabilidad Ciudadana',
    'Diálogo entre Ciencia, Técnica y Humanismo',
  ]),
  syl('TEO-1010', 'Fe, Ecología Integral y Compromiso Social (NFF)', '🕊️', 'emerald', 6, 2, 'Ecología integral, doctrina social, construcción de paz y servicio javeriano.', [
    'Ecología Integral y Cuidado de la Casa Común (Laudato Si’)',
    'Justicia Social, Derechos Humanos y Construcción de Paz en Colombia',
    'Ética Profesional y Responsabilidad Social Universitaria',
  ]),
  syl('DER-1005', 'Constitución Política e Instituciones Colombianas', '⚖️', 'rose', 7, 2, 'Principios constitucionales, derechos fundamentales, acciones constitucionales y estructura del Estado.', [
    'Estado Social de Derecho y Principios Fundamentales de 1991',
    'Derechos Fundamentales, Acción de Tutela y Acciones Populares',
    'Ramas del Poder Público y Órganos de Control en Colombia',
  ]),
];

export const TRONCO_SALUD_BASICO: SubjectTemplate[] = [
  syl('MOR-1101', 'Morfofisiología Humana I (Celular y Tisular)', '🫀', 'rose', 1, 5, 'Histología, embriología general, fisiología de membranas y anatomía del aparato locomotor.', [
    'Fisiología de la Membrana Celular, Potencial de Acción y Sinapsis',
    'Histología de los Tejidos Epitelial, Conectivo, Muscular y Nervioso',
    'Embriología General: Gametogénesis, Disco Germinativo y Organogénesis',
    'Anatomía Funcional de Columna Vertebral, Miembro Superior e Inferior',
  ]),
  syl('BQM-1102', 'Bioquímica y Biología Molecular', '🧬', 'emerald', 1, 4, 'Estructura de biomoléculas, cinética enzimática, metabolismo energético y expresión génica.', [
    'Aminoácidos, Estructura Proteica, Cinética Enzimática e Inhibición',
    'Metabolismo de Carbohidratos: Glucólisis, Gluconeogénesis y Ciclo de Krebs',
    'Fosforilación Oxidativa, Cadena Respiratoria y Metabolismo de Lípidos',
    'Replicación del ADN, Transcripción, Traducción y Regulación Epigenética',
  ]),
  syl('SPU-1201', 'Salud Pública y Epidemiología Clínica', '🌍', 'blue', 3, 3, 'Determinantes sociales de la salud, vigilancia epidemiológica y diseños de investigación clínica.', [
    'Determinantes Sociales de la Salud y Sistema General de Seguridad Social (SGSSS)',
    'Medidas de Frecuencia (Incidencia, Prevalencia) y Asociación (RR, OR)',
    'Diseños Epidemiológicos: Cohortes, Casos y Controles y Ensayos Clínicos',
    'Validez Diagnóstica: Sensibilidad, Especificidad y Valores Predictivos',
  ]),
  syl('BET-2100', 'Bioética Clínica y Humanismo Médico', '🕊️', 'purple', 4, 2, 'Principios bioéticos, consentimiento informado, dilemas de inicio y final de la vida.', [
    'Principialismo Bioético: Autonomía, Beneficencia, No Maleficencia y Justicia',
    'Consentimiento Informado, Secreto Profesional y Relación Clínico-Paciente',
    'Dilemas Bioéticos en Genética, Reproducción y Cuidado Paliativo',
  ]),
];

export const TRONCO_CEA_BASICO: SubjectTemplate[] = [
  syl('ADM-1101', 'Fundamentos de Administración y Organizaciones', '🏢', 'blue', 1, 3, 'Evolución del pensamiento administrativo, proceso administrativo y gobierno corporativo.', [
    'Escuelas del Pensamiento Administrativo (Clásica, Relaciones Humanas, Sistémica)',
    'Planeación Estratégica: Misión, Visión, Objetivos y Análisis del Entorno',
    'Diseño Organizacional, Liderazgo, Cultura y Toma de Decisiones',
    'Control de Gestión, Indicadores (KPIs) y Sostenibilidad Empresarial',
  ]),
  syl('CON-1101', 'Contabilidad Financiera bajo NIIF', '📒', 'emerald', 1, 3, 'Ciclo contable, normas internacionales NIIF/IFRS y preparación de estados financieros.', [
    'Marco Conceptual de las NIIF y Ecuación Patrimonial (Activo = Pasivo + Patrimonio)',
    'Partida Doble, Devengo, Ajustes Contables y Cierre del Ciclo',
    'Estado de Situación Financiera y Estado de Resultados Integral',
    'Estado de Flujos de Efectivo y Análisis de Liquidez, Endeudamiento y Rentabilidad',
  ]),
  syl('ECO-1101', 'Principios de Microeconomía', '📉', 'amber', 2, 3, 'Teoría del consumidor, teoría del productor, equilibrio de mercado y estructuras competitivas.', [
    'Oferta, Demanda, Equilibrio de Mercado y Elasticidades',
    'Teoría del Consumidor: Curvas de Indiferencia y Restricción Presupuestaria',
    'Función de Producción, Rendimientos Marginales y Costos de Corto y Largo Plazo',
    'Competencia Perfecta, Monopolio y Competencia Monopolística',
  ]),
  syl('ECO-1201', 'Principios de Macroeconomía', '🌐', 'purple', 3, 3, 'Cuentas nacionales, inflación, desempleo, política fiscal, política monetaria y sector externo.', [
    'Agregados Macroeconómicos: PIB Real vs Nominal, Deflactor, IPC y Desempleo',
    'Modelo IS-LM: Mercado de Bienes y Mercado de Dinero',
    'Política Monetaria del Banco de la República y Tasas de Interés',
    'Balanza de Pagos, Tasa de Cambio y Modelo Mundell-Fleming',
  ]),
];

// ============================================================================
// CATÁLOGO COMPLETO DE CARRERAS DE PREGRADO - PUJ SEDE BOGOTÁ (SEMESTRE A SEMESTRE)
// ============================================================================

export const PUJ_BOGOTA_CAREERS: CareerOption[] = [
  // --------------------------------------------------------------------------
  // 1. FACULTAD DE INGENIERÍA (10 PREGRADOS EN SEDE BOGOTÁ)
  // --------------------------------------------------------------------------
  {
    id: 'puj_ing_sistemas',
    name: 'Ingeniería de Sistemas',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '💻',
    description: 'Pensum completo PUJ Bogotá: algoritmos, estructuras de datos, arquitectura de software, bases de datos, redes, sistemas operativos, seguridad e IA.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('ISIS-1101', 'Introducción a la Programación', '💻', 'emerald', 1, 3, 'Algoritmia, estructuras de control, funciones, arreglos, matrices y manejo de archivos en C++/Python.', [
        'Pensamiento Algorítmico, Variables, Tipos de Datos y Expresiones',
        'Estructuras Condicionales y Ciclos Iterativos (for, while, do-while)',
        'Modularidad, Funciones, Paso por Valor y por Referencia',
        'Arreglos Unidimensionales, Matrices, Cadenas y Flujos de Archivos',
      ]),
      syl('ISIS-1105', 'Matemáticas Discretas y Lógica Formal', '🔢', 'purple', 1, 3, 'Lógica proposicional, predicados, teoría de conjuntos, inducción matemática, relaciones y grafos.', [
        'Lógica Proposicional, Tablas de Verdad, Equivalencias e Inferencia',
        'Lógica de Predicados, Cuantificadores y Métodos de Demostración',
        'Inducción Matemática, Recursión y Relaciones de Recurrencia',
        'Teoría de Conjuntos, Relaciones de Equivalencia, Órdenes Parciales y Grafos',
      ]),
      syl('ISIS-1204', 'Programación Avanzada y Orientada a Objetos', '🧱', 'purple', 2, 3, 'Punteros, memoria dinámica, encapsulamiento, herencia, polimorfismo, excepciones y patrones en C++/Java.', [
        'Aritmética de Punteros y Gestión de Memoria Dinámica (Stack vs Heap)',
        'Clases, Objetos, Constructores, Destructores y Encapsulamiento',
        'Herencia, Polimorfismo, Clases Abstractas e Interfaces',
        'Manejo de Excepciones, Plantillas (Templates/Generics) y Persistencia',
      ]),
      syl('ISIS-1304', 'Estructuras de Datos', '🌳', 'emerald', 3, 3, 'Complejidad Big-O, listas enlazadas, pilas, colas, árboles AVL, B-Trees, tablas hash y grafos.', [
        'Notación Asintótica (Big-O, Omega, Theta) y Análisis de Complejidad',
        'Listas Enlazadas Simples, Dobles, Pilas (LIFO) y Colas de Prioridad (Heaps)',
        'Árboles Binarios de Búsqueda (BST), Árboles Balanceados AVL y Rojinegros',
        'Tablas de Hash, Manejo de Colisiones y Algoritmos de Grafos (BFS, DFS, Dijkstra, Kruskal)',
      ]),
      syl('ISIS-1404', 'Bases de Datos', '🗄️', 'blue', 4, 3, 'Modelo entidad-relación, modelo relacional, álgebra relacional, SQL avanzado, normalización y transacciones ACID.', [
        'Modelado Conceptual Entidad-Relación (MER) y Modelo Relacional',
        'Álgebra Relacional y Cálculo Relacional',
        'SQL Estándar y Avanzado: Joins, Subconsultas, Vistas, Triggers y Procedimientos',
        'Formas Normales (1FN, 2FN, 3FN, BCNF), Índices B+ y Transacciones ACID',
      ]),
      syl('ISIS-1405', 'Arquitectura del Computador y Ensamblador', '🖥️', 'amber', 4, 3, 'Representación binaria, compuertas lógicas, procesador MIPS/x86, jerarquía de memoria y caché.', [
        'Sistemas Numéricos, Complemento a 2 y Punto Flotante IEEE 754',
        'Álgebra de Boole, Circuitos Combinacionales, ALU y Circuitos Secuenciales',
        'Conjunto de Instrucciones (ISA), Lenguaje Ensamblador y Datapath',
        'Segmentación (Pipelining), Riesgos (Hazards) y Jerarquía de Memoria Caché',
      ]),
      syl('ISIS-2402', 'Análisis y Diseño de Algoritmos', '⚡', 'rose', 5, 3, 'Divide y vencerás, programación dinámica, algoritmos voraces (greedy), backtracking y NP-completitud.', [
        'Teorema Maestro y Paradigma Divide y Vencerás (MergeSort, QuickSort, FFT)',
        'Programación Dinámica: Subestructura Óptima y Memoización',
        'Algoritmos Voraces (Greedy), Flujo Máximo en Redes (Ford-Fulkerson)',
        'Clases de Complejidad P, NP, NP-Hard y Reducciones Polinomiales',
      ]),
      syl('ISIS-2501', 'Ingeniería de Software y Requisitos', '🛠️', 'blue', 5, 3, 'Ciclo de vida del software, Scrum, historias de usuario, modelado UML, pruebas automatizadas y DevOps.', [
        'Ingeniería de Requisitos: Historias de Usuario, Casos de Uso y Criterios de Aceptación',
        'Modelado con UML: Diagramas de Clases, Secuencia, Componentes y Estados',
        'Principios SOLID, Clean Architecture y Patrones de Diseño GoF',
        'Pruebas Unitarias, Integración Continua (CI/CD) y Gestión Ágil (Scrum)',
      ]),
      syl('ISIS-2503', 'Sistemas Operativos', '⚙️', 'purple', 5, 3, 'Procesos, hilos, planificación de CPU, concurrencia, semáforos, interbloqueos, memoria virtual y sistemas de archivos.', [
        'Llamadas al Sistema (Syscalls), Procesos, PCB e Hilos (POSIX Threads)',
        'Algoritmos de Planificación de CPU (FIFO, SJF, Round Robin, Multinivel)',
        'Sincronización y Concurrencia: Exclusión Mutua, Semáforos, Monitores y Deadlocks',
        'Memoria Virtual, Paginación, Reemplazo de Páginas (LRU) y Sistemas de Archivos',
      ]),
      syl('ISIS-2603', 'Comunicaciones y Redes de Computadores', '🌐', 'emerald', 6, 3, 'Modelo OSI y TCP/IP, direccionamiento IPv4/IPv6, subredes, enrutamiento OSPF/BGP, TCP/UDP y DNS/HTTP.', [
        'Arquitectura de Redes: Capas del Modelo OSI y Pila TCP/IP',
        'Capa de Aplicación y Transporte: HTTP/TLS, DNS, Sockets, UDP y Control de Congestión TCP',
        'Capa de Red: Subredes CIDR, IPv4, IPv6, NAT y Enrutamiento (OSPF, BGP)',
        'Capa de Enlace: Ethernet, VLANs, ARP y Redes Inalámbricas IEEE 802.11',
      ]),
      syl('ISIS-2605', 'Arquitectura de Software y Sistemas Distribuidos', '☁️', 'blue', 6, 3, 'Atributos de calidad, microservicios, REST/gRPC, colas de mensajería, contenedores Docker/Kubernetes y Cloud.', [
        'Atributos de Calidad (Escalabilidad, Disponibilidad, Latencia, Seguridad) y Tácticas',
        'Estilos Arquitectónicos: Capas, Hexagonal, Microservicios y Event-Driven',
        'Comunicación Distribuida: REST, GraphQL, gRPC y Brokers de Mensajes (Kafka/RabbitMQ)',
        'Contenedores Docker, Orquestación en Cloud y Tolerancia a Fallos',
      ]),
      syl('ISIS-3302', 'Inteligencia Artificial y Machine Learning', '🤖', 'amber', 7, 3, 'Búsqueda heurística, aprendizaje supervisado y no supervisado, redes neuronales y procesamiento de lenguaje natural.', [
        'Agentes Inteligentes y Búsqueda Informada (A*, Minimax, Alfa-Beta)',
        'Aprendizaje Supervisado: Regresión, Árboles de Decisión, SVM y Random Forest',
        'Aprendizaje No Supervisado (K-Means, PCA) y Métricas de Evaluación (F1, ROC-AUC)',
        'Redes Neuronales Profundas (Deep Learning), Backpropagation y LLMs',
      ]),
      syl('ISIS-3401', 'Seguridad de la Información y Criptografía', '🔐', 'rose', 7, 3, 'Criptografía simétrica y asimétrica, firmas digitales, PKI, seguridad en redes y OWASP Top 10.', [
        'Criptografía Simétrica (AES), Asimétrica (RSA, ECC) y Funciones Hash (SHA-256)',
        'Infraestructura de Llave Pública (PKI), Certificados X.509 y TLS/SSL',
        'Seguridad en Aplicaciones Web (OWASP Top 10: SQLi, XSS, CSRF) y Autenticación JWT/OAuth2',
      ]),
      syl('ISIS-3900', 'Proyecto de Grado en Ingeniería de Sistemas', '🎓', 'emerald', 8, 6, 'Formulación, diseño, implementación y validación de un proyecto integrador de ingeniería de software o investigación.', [
        'Definición del Problema, Estado del Arte y Objetivos de Ingeniería',
        'Diseño Arquitectónico, Construcción del Prototipo Funcional y Pruebas',
        'Validación de Métricas de Desempeño y Sustentación ante Jurado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_industrial',
    name: 'Ingeniería Industrial',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🏭',
    description: 'Pensum completo PUJ Bogotá: investigación de operaciones, logística, cadena de suministro, procesos de manufactura, calidad Six Sigma y finanzas.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IIN-1102', 'Introducción a la Ingeniería Industrial y Sistemas Productivos', '🏭', 'amber', 1, 3, 'Pensamiento sistémico, historia de la ingeniería industrial, productividad y diseño de procesos.', [
        'Evolución de la Ingeniería Industrial, Productividad y Eficiencia Operativa',
        'Enfoque de Sistemas, Diagramas SIPOC y Mapeo de Procesos (BPMN)',
        'Sostenibilidad Industrial y Economía Circular',
      ]),
      syl('IIN-2201', 'Ingeniería de Métodos, Tiempos y Ergonomía', '⏱️', 'blue', 3, 3, 'Estudio del trabajo, estandarización de tiempos, muestreo del trabajo, antropometría y ergonomía ocupacional.', [
        'Diagramas de Operaciones, Flujo y Recorrido para Mejora de Métodos',
        'Estudio de Tiempos con Cronómetro, Suplementos y Tiempo Estándar',
        'Biomecánica Ocupacional, Ergonomía Física, Cognitiva y Seguridad Industrial',
      ]),
      syl('IIN-2301', 'Investigación de Operaciones I (Optimización Determinística)', '📊', 'emerald', 4, 3, 'Programación lineal, método Simplex, dualidad, análisis de sensibilidad y programación entera.', [
        'Formulación de Modelos de Programación Lineal y Solución Gráfica',
        'Algoritmo Simplex, Método de las Dos Fases y Gran M',
        'Teoría de Dualidad, Precios Sombra y Análisis de Sensibilidad',
        'Problemas de Transporte, Asignación, Flujo en Redes y Programación Entera Mixta (MILP)',
      ]),
      syl('IIN-2302', 'Procesos de Manufactura y Materiales', '🔩', 'purple', 4, 3, 'Propiedades mecánicas de materiales, fundición, conformado, mecanizado CNC y manufactura aditiva.', [
        'Estructura Cristalina, Ensayo de Tracción y Diagramas Esfuerzo-Deformación',
        'Procesos de Fundición, Conformado Plástico y Soldadura Industrial',
        'Mecanizado por Arranque de Viruta, Control Numérico (CNC) e Impresión 3D',
      ]),
      syl('IIN-2401', 'Investigación de Operaciones II (Procesos Estocásticos)', '🎲', 'rose', 5, 3, 'Cadenas de Markov, teoría de colas, programación dinámica estocástica y análisis de decisiones.', [
        'Cadenas de Markov en Tiempo Discreto y Continuo y Estado Estable',
        'Teoría de Colas: Modelos M/M/1, M/M/s y Redes de Jackson',
        'Árboles de Decisión bajo Incertidumbre y Programación Dinámica Estocástica',
      ]),
      syl('IIN-2405', 'Ingeniería Económica y Evaluación de Proyectos', '💰', 'amber', 5, 3, 'Valor del dinero en el tiempo, tasas de interés, VPN, TIR, flujo de caja libre y riesgo.', [
        'Interés Simple, Compuesto, Tasas Nominales, Efectivas y Anualidades',
        'Criterios de Decisión: Valor Presente Neto (VPN), TIR, B/C y CAUE',
        'Construcción del Flujo de Caja Libre, Depreciación, Impuestos y WACC',
      ]),
      syl('IIN-2501', 'Planeación y Control de la Producción y Operaciones', '📦', 'blue', 6, 3, 'Pronósticos de demanda, planeación agregada, MPS, MRP, programación de planta y Lean Manufacturing.', [
        'Métodos de Pronóstico de Series de Tiempo (Holt-Winters, ARIMA)',
        'Planeación Agregada (S&OP), Plan Maestro de Producción (MPS) y MRP',
        'Gestión de Inventarios (EOQ, (Q,R), Newsvendor) y Just-in-Time / Lean',
        'Secuenciación de Operaciones (Scheduling) y Teoría de Restricciones (TOC)',
      ]),
      syl('IIN-2504', 'Control Estadístico de Calidad y Six Sigma', '🎯', 'emerald', 6, 3, 'Cartas de control por variables y atributos, capacidad de proceso, muestreo de aceptación y DMAIC.', [
        'Filosofía de Calidad Total, Metodología DMAIC y Herramientas de Ishikawa/Pareto',
        'Cartas de Control de Shewhart por Variables (X-R, X-S) y Atributos (p, np, c, u)',
        'Índices de Capacidad de Proceso (Cp, Cpk, Pp, Ppk) y Diseño de Experimentos (DOE)',
      ]),
      syl('IIN-3601', 'Simulación de Eventos Discretos', '🖥️', 'purple', 7, 3, 'Generación de variables aleatorias, ajuste de distribuciones, modelado de sistemas y análisis estadístico de salidas.', [
        'Generación de Números Pseudoaleatorios y Transformada Inversa',
        'Pruebas de Bondad de Ajuste (Chi-Cuadrado, Kolmogorov-Smirnov)',
        'Verificación, Validación de Modelos de Simulación y Diseño de Escenarios',
      ]),
      syl('IIN-3602', 'Logística Integral y Cadena de Suministro (Supply Chain)', '🚚', 'blue', 7, 3, 'Diseño de redes logísticas, gestión de almacenes, transporte multimodal, compras y logística inversa.', [
        'Estrategia de Supply Chain, Efecto Látigo (Bullwhip Effect) y Coordinación',
        'Diseño de Centros de Distribución (WMS), Picking y Ruteo de Vehículos (VRP)',
        'Comercio Internacional, Incoterms y Logística Verde / Inversa',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_civil',
    name: 'Ingeniería Civil',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🏗️',
    description: 'Pensum completo PUJ Bogotá: estática, mecánica de sólidos, geotecnia, hidráulica, análisis estructural, diseño en concreto reforzado, vías y gerencia de construcción.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('ICV-1101', 'Geomática y Topografía Aplicada', '🗺️', 'emerald', 2, 3, 'Levantamientos planimétricos y altimétricos, sistemas GNSS/GPS, fotogrametría y sistemas de información geográfica (SIG).', [
        'Planimetría, Poligonales, Azimuts, Rumbos y Ajuste de Errores',
        'Altimetría, Nivelación Geométrica, Curvas de Nivel y Perfiles Longitudinales',
        'Sistemas de Posicionamiento Global (GNSS) y Modelado Digital del Terreno en SIG',
      ]),
      syl('ICV-1202', 'Estática', '⚖️', 'blue', 3, 3, 'Equilibrio de partículas y cuerpos rígidos en 2D y 3D, armaduras, marcos, centroides y momentos de inercia.', [
        'Equilibrio de Partículas y Sistemas Equivalentes Fuerza-Par en 3D',
        'Análisis de Armaduras (Nodos y Secciones), Marcos y Máquinas',
        'Diagramas de Fuerza Cortante y Momento Flector en Vigas',
        'Centroides, Momentos de Inercia y Teorema de los Ejes Paralelos (Steiner)',
      ]),
      syl('ICV-1301', 'Mecánica de Sólidos y Resistencia de Materiales', '🧱', 'rose', 4, 3, 'Esfuerzo y deformación axial, torsión, flexión pura, esfuerzos combinados, círculo de Mohr y pandeo de columnas.', [
        'Esfuerzo Axial, Cortante, Ley de Hooke Generalizada y Esfuerzos Térmicos',
        'Torsión en Ejes Circulares y Esfuerzos por Flexión y Cortante en Vigas (Fórmula de Navier y Jourawski)',
        'Transformación de Esfuerzos Planos, Círculo de Mohr y Criterios de Falla',
        'Deflexión en Vigas y Estabilidad de Columnas (Pandeo Crítico de Euler)',
      ]),
      syl('ICV-1302', 'Materiales de Construcción y Tecnología del Concreto', '🪨', 'amber', 4, 3, 'Agregados, cemento Portland, diseño de mezclas de concreto, acero estructural, mampostería y asfaltos.', [
        'Granulometría de Agregados, Propiedades Físicas y Normativa Técnica (NTC / INVÍAS)',
        'Química del Cemento, Diseño de Mezclas de Concreto y Ensayos en Estado Fresco y Endurecido',
        'Comportamiento Mecánico del Acero de Refuerzo y Materiales Bituminosos',
      ]),
      syl('ICV-2401', 'Mecánica de Fluidos', '💧', 'blue', 4, 3, 'Hidrostática, cinemática de fluidos, ecuación de Bernoulli, cantidad de movimiento y flujo viscoso en tuberías.', [
        'Propiedades de los Fluidos, Manometría y Fuerzas Hidrostáticas sobre Superficies Sumergidas',
        'Ecuaciones de Conservación de Masa, Bernoulli y Cantidad de Movimiento (Volumen de Control)',
        'Análisis Dimensional (Teorema Pi de Buckingham), Flujo Laminar/Turbulento y Diagrama de Moody',
      ]),
      syl('ICV-2402', 'Mecánica de Suelos y Geotecnia Básica', '⛰️', 'amber', 5, 3, 'Origen y clasificación de suelos, flujo de agua en medios porosos, esfuerzos efectivos, consolidación y resistencia al corte.', [
        'Relaciones Gravimétricas y Volumétricas, Límites de Atterberg y Clasificación USCS/AASHTO',
        'Compactación Proctor, Ley de Darcy, Redes de Flujo y Principio de Esfuerzos Efectivos de Terzaghi',
        'Consolidación Unidimensional, Ensayo Triaxial, Corte Directo y Criterio de Mohr-Coulomb',
      ]),
      syl('ICV-2501', 'Hidráulica de Tuberías y Canales Abiertos', '🌊', 'blue', 5, 3, 'Redes de tuberías a presión, golpe de ariete, bombas, flujo uniforme y gradualmente variado en canales.', [
        'Sistemas de Tuberías en Serie, Paralelo, Redes Cerradas (Hardy-Cross) y Bombas Centrífugas',
        'Flujo Uniforme en Canales Abiertos (Ecuación de Manning) y Energía Específica',
        'Resalto Hidráulico, Flujo Gradualmente Variado y Estructuras de Vertimiento',
      ]),
      syl('ICV-2502', 'Análisis Estructural', '🏢', 'purple', 5, 3, 'Estructuras estáticamente determinadas e indeterminadas, trabajo virtual, método de rigidez matricial y cargas sísmicas NSR-10.', [
        'Líneas de Influencia y Deflexiones por Trabajo Virtual y Teorema de Castigliano',
        'Métodos Clásicos: Fuerza/Flexibilidad, Slope-Deflection y Cross',
        'Método Matricial de la Rigidez Directa para Armaduras y Pórticos Planos/Espaciales',
      ]),
      syl('ICV-2601', 'Diseño de Estructuras de Concreto Reforzado (NSR-10)', '🏗️', 'rose', 6, 3, 'Diseño por resistencia última de vigas a flexión y cortante, losas, columnas biaxiales y muros estructurales.', [
        'Filosofía de Diseño por Estados Límites (NSR-10) y Vigas Simple y Doblemente Reforzadas',
        'Diseño a Cortante, Torsión, Adherencia y Longitud de Desarrollo del Refuerzo',
        'Diseño de Losas en Una y Dos Direcciones y Columnas Sometidas a Flexo-Compresión (Diagramas de Interacción)',
      ]),
      syl('ICV-2602', 'Ingeniería de Cimentaciones y Estabilidad de Taludes', '🪨', 'amber', 6, 3, 'Capacidad portante, zapatas aisladas y combinadas, losas de cimentación, pilotes y muros de contención.', [
        'Teoría de Capacidad Portante de Terzaghi, Meyerhof y Cálculo de Asentamientos',
        'Diseño Geotécnico de Cimentaciones Superficiales (Zapatas) y Profundas (Pilotes y Caissons)',
        'Empujes de Tierra de Rankine y Coulomb, Muros de Contención y Estabilidad de Taludes',
      ]),
      syl('ICV-3701', 'Diseño Geométrico de Vías y Pavimentos', '🛣️', 'emerald', 7, 3, 'Alineamiento horizontal y vertical, peraltes, movimiento de tierras y diseño de pavimentos flexibles y rígidos.', [
        'Alineamiento Horizontal (Curvas Circulares y Espirales de Euler), Vertical y Cartera de Chaflanes',
        'Caracterización de Subrasantes (CBR, Módulo Resiliente) y Tránsito (ESALs)',
        'Diseño de Pavimentos Flexibles (AASHTO / Racional) y Rígidos (PCA)',
      ]),
      syl('ICV-3702', 'Acueductos, Alcantarillados e Hidrología (RAS)', '🚰', 'blue', 7, 3, 'Ciclo hidrológico, caudales máximos, captación, redes de distribución de agua potable y alcantarillado pluvial/sanitario.', [
        'Cuencas Hidrográficas, Precipitación, Hietogramas, Hidrograma Unitario y Caudales de Diseño',
        'Sistemas de Captación, Aducción, Desarenadores y Redes de Distribución de Agua Potable (RAS)',
        'Diseño Hidráulico de Alcantarillado Sanitario, Pluvial y Sistemas Urbanos de Drenaje Sostenible (SUDS)',
      ]),
      syl('ICV-3801', 'Gerencia, Programación y Presupuestos de Obra (BIM)', '📋', 'purple', 8, 3, 'APU, cantidades de obra, programación CPM/PERT, control de costos (Valor Ganado) y modelado BIM.', [
        'Análisis de Precios Unitarios (APU), Costos Directos, AIU y Presupuesto de Construcción',
        'Programación de Obra: Ruta Crítica (CPM), Diagramas Gantt y Nivelación de Recursos',
        'Metodología BIM (Building Information Modeling) y Control de Proyectos con Valor Ganado (EVM)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_electronica',
    name: 'Ingeniería Electrónica',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🔌',
    description: 'Pensum completo PUJ Bogotá: circuitos eléctricos, electrónica analógica y digital, señales y sistemas, control automático, microcontroladores, telecomunicaciones y VLSI.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IEL-1101', 'Análisis de Circuitos Eléctricos I (DC y Transitorios)', '🔋', 'amber', 2, 3, 'Leyes de Kirchhoff, nodos y mallas, teoremas de Thévenin/Norton, amplificadores operacionales y circuitos RC, RL y RLC.', [
        'Leyes de Ohm y Kirchhoff, Análisis Nodal y Análisis de Mallas con Fuentes Dependientes',
        'Superposición, Transformación de Fuentes y Teoremas de Thévenin, Norton y Máxima Transferencia',
        'Amplificadores Operacionales Ideales (Inversor, No Inversor, Sumador, Integrador)',
        'Respuesta Transitoria de Primer y Segundo Orden en Circuitos RC, RL y RLC',
      ]),
      syl('IEL-1201', 'Sistemas Digitales y Diseño Lógico (VHDL/FPGA)', '📟', 'emerald', 2, 3, 'Álgebra booleana, mapas de Karnaugh, circuitos combinacionales, flip-flops, máquinas de estados finitos (FSM) y VHDL.', [
        'Simplificación con Mapas de Karnaugh, Decodificadores, Multiplexores y Sumadores Binarios',
        'Latches, Flip-Flops (SR, D, JK, T), Registros de Desplazamiento y Contadores Síncronos',
        'Diseño de Máquinas de Estados Finitos (Mealy y Moore) y Síntesis en FPGAs con VHDL/Verilog',
      ]),
      syl('IEL-2301', 'Análisis de Circuitos Eléctricos II (AC, Fasores y Frecuencia)', '⚡', 'blue', 3, 3, 'Estado estacionario sinusoidal, fasores, potencia compleja, sistemas trifásicos, respuesta en frecuencia y diagramas de Bode.', [
        'Análisis Fasorial en Dominio de la Frecuencia e Impedancia Compleja',
        'Potencia Instantánea, Activa, Reactiva, Aparente, Factor de Potencia y Sistemas Trifásicos',
        'Funciones de Transferencia, Polos, Ceros, Resonancia, Diagramas de Bode y Filtros Pasivos',
      ]),
      syl('IEL-2401', 'Electrónica Analógica y Dispositivos Semiconductores', '🔌', 'purple', 4, 3, 'Física de semiconductores, diodos PN/Zener, transistores BJT y MOSFET, polarización y amplificadores de pequeña señal.', [
        'Unión PN, Curva Característica del Diodo, Rectificadores y Reguladores Zener',
        'Transistores Bipolares (BJT) y Efecto de Campo (MOSFET): Regiones de Operación y Polarización DC',
        'Modelos de Pequeña Señal (Híbrido-Pi), Configuraciones Emisor/Fuente Común y Amplificadores Diferenciales',
      ]),
      syl('IEL-2402', 'Señales y Sistemas', '📡', 'rose', 4, 3, 'Señales continuas y discretas, sistemas LTI, convolución, series y transformada de Fourier, Laplace y Transformada Z.', [
        'Clasificación de Señales y Sistemas Lineales e Invariantes en el Tiempo (LTI) y Convolución',
        'Series de Fourier y Transformada de Fourier en Tiempo Continuo y Discreto',
        'Teorema de Muestreo de Nyquist-Shannon y Transformada Z',
      ]),
      syl('IEL-2501', 'Arquitectura de Microprocesadores y Sistemas Embebidos', '🤖', 'emerald', 5, 3, 'Arquitectura ARM Cortex-M, programación en C embebido, interrupciones, timers, PWM, ADC/DAC y protocolos I2C, SPI y UART.', [
        'Arquitectura ARM, Mapa de Memoria, GPIO y Manejo de Interrupciones (NVIC)',
        'Temporizadores, Modulación por Ancho de Pulso (PWM) y Conversión Analógico-Digital (ADC)',
        'Buses de Comunicación Serial (UART, SPI, I2C, CAN) y Sistemas Operativos en Tiempo Real (FreeRTOS)',
      ]),
      syl('IEL-2502', 'Sistemas de Control Automático', '🎛️', 'blue', 5, 3, 'Modelado de sistemas dinámicos, estabilidad de Routh-Hurwitz, lugar geométrico de las raíces (Root Locus) y controladores PID.', [
        'Modelado en Funciones de Transferencia y Espacio de Estados de Sistemas Físicos',
        'Respuesta Temporal de Sistemas de 1° y 2° Orden y Criterio de Estabilidad de Routh-Hurwitz',
        'Lugar Geométrico de las Raíces (LGR), Margen de Ganancia/Fase y Sintonización de Controladores PID',
      ]),
      syl('IEL-2601', 'Procesamiento Digital de Señales (DSP)', '🎚️', 'amber', 6, 3, 'Transformada Discreta de Fourier (DFT/FFT), diseño de filtros digitales FIR e IIR y procesamiento en tiempo real.', [
        'Transformada Rápida de Fourier (FFT) y Análisis Espectral de Señales Discretas',
        'Diseño de Filtros Digitales IIR (Butterworth, Chebyshev) y FIR (Ventanas)',
        'Implementación en Punto Fijo y Procesamiento de Señales en Tiempo Real',
      ]),
      syl('IEL-2602', 'Sistemas de Telecomunicaciones y Modulación', '📶', 'purple', 6, 3, 'Modulación analógica (AM, FM) y digital (ASK, PSK, QAM, OFDM), ruido térmico AWGN y presupuesto de enlace.', [
        'Modulación de Amplitud (AM, DSB-SC) y Modulación Angular (FM, PM)',
        'Modulación Digital: BPSK, QPSK, M-QAM, Constelaciones y Tasa de Error de Bit (BER)',
        'Líneas de Transmisión, Carta de Smith, Antenas y Propagación Electromagnética',
      ]),
      syl('IEL-3701', 'Electrónica de Potencia y Energías Renovables', '☀️', 'rose', 7, 3, 'Convertidores DC-DC (Buck, Boost), rectificadores controlados, inversores PWM y sistemas solares fotovoltaicos.', [
        'Semiconductores de Potencia (IGBT, SiC MOSFET) y Rectificadores No Controlados y Controlados',
        'Convertidores Conmutados DC-DC: Topologías Buck, Boost y Buck-Boost',
        'Inversores Monofásicos y Trifásicos modulados por SPWM e Integración de Energías Renovables',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_mecanica',
    name: 'Ingeniería Mecánica',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '⚙️',
    description: 'Pensum completo PUJ Bogotá: termodinámica, transferencia de calor, mecánica de fluidos, diseño de máquinas, elementos finitos (FEA), vibraciones y manufactura CAD/CAM.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IME-1201', 'Dibujo de Ingeniería y Diseño Asistido (CAD 3D)', '📐', 'blue', 1, 3, 'Geometría descriptiva, vistas ortogonales, cortes, tolerancias dimensionales y geométricas (GD&T) y modelado paramétrico.', [
        'Proyecciones Ortogonales, Vistas Auxiliares y Cortes bajo Norma ISO/ASME',
        'Modelado Paramétrico de Piezas y Ensambles 3D en SolidWorks / Inventor',
        'Ajustes, Tolerancias Dimensionales y Tolerancias Geométricas (GD&T)',
      ]),
      syl('IME-2301', 'Termodinámica Técnica', '🔥', 'rose', 3, 3, 'Sustancias puras, primera y segunda ley de la termodinámica, entropía, exergía y ciclos de potencia (Rankine, Otto, Diesel, Brayton).', [
        'Propiedades de las Sustancias Puras, Diagramas P-v, T-v y Ecuaciones de Estado',
        'Primera Ley en Sistemas Cerrados y Volúmenes de Control (Toberas, Turbinas, Compresores)',
        'Segunda Ley, Máquina de Carnot, Entropía y Balance de Exergía',
        'Ciclos de Potencia de Vapor (Rankine), Gas (Otto, Diesel, Brayton) y Refrigeración',
      ]),
      syl('IME-2302', 'Ciencia e Ingeniería de Materiales Metálicos y Poliméricos', '🔬', 'amber', 3, 3, 'Estructura cristalina, defectos, difusión, diagramas de fases Fe-C, tratamientos térmicos de aceros y polímeros.', [
        'Celdas Unitarias (BCC, FCC, HCP), Dislocaciones y Mecanismos de Endurecimiento',
        'Diagramas de Equilibrio de Fases y Diagrama Hierro-Carburo de Hierro (Fe-Fe3C)',
        'Curvas TTT, Tratamientos Térmicos (Temple, Revenido, Recocido) y Materiales Compuestos',
      ]),
      syl('IME-2401', 'Cinemática y Dinámica de Maquinaria (Mecanismos)', '⚙️', 'purple', 4, 3, 'Síntesis de mecanismos de barras articuladas, análisis de posición, velocidad y aceleración, levas, trenes de engranajes y balanceo.', [
        'Grados de Libertad (Criterio de Gruebler), Inversión Cinemática y Condición de Grashof',
        'Análisis Vectorial de Velocidades y Aceleraciones (Coriolis) en Mecanismos Planos',
        'Diseño de Levas, Engranajes Rectos, Helicoidales y Trenes Planetarios Epicicloidales',
      ]),
      syl('IME-2501', 'Diseño de Elementos de Máquinas y Fatiga', '🔩', 'blue', 5, 3, 'Criterios de falla estática (Von Mises, Tresca), diseño a fatiga (Goodman, Soderberg), ejes, rodamientos, tornillos y soldaduras.', [
        'Teorías de Falla Estática para Materiales Dúctiles (Von Mises) y Frágiles (Mohr Modificado)',
        'Resistencia a la Fatiga, Límite de Endurancia de Marin y Diagramas de Vida Infinita (Goodman)',
        'Diseño de Ejes de Transmisión, Selección de Rodamientos, Tornillos de Potencia y Uniones Soldadas',
      ]),
      syl('IME-2502', 'Transferencia de Calor y Masa', '🌡️', 'rose', 5, 3, 'Conducción estacionaria y transitoria, aletas, convección forzada y natural, radiación térmica e intercambiadores de calor.', [
        'Ley de Fourier, Resistencia Térmica, Aletas Disipadoras y Conducción Transitoria (Número de Biot)',
        'Convección Externa e Interna: Números de Reynolds, Prandtl y Nusselt',
        'Intercambiadores de Calor (Método LMTD y Efectividad-NTU) y Radiación de Cuerpo Negro/Gris',
      ]),
      syl('IME-2601', 'Vibraciones Mecánicas y Mantenimiento Predictivo', '〰️', 'emerald', 6, 3, 'Vibraciones libres y forzadas de 1 y varios grados de libertad, resonancia, aislamiento vibratorio y análisis modal.', [
        'Vibración Libre y Amortiguada de Sistemas de 1 GDL (Subamortiguado, Crítico)',
        'Vibración Forzada Armónica, Desbalance Rotatorio y Transmisibilidad / Aislamiento',
        'Sistemas de Múltiples Grados de Libertad, Frecuencias Naturales y Modos de Vibración',
      ]),
      syl('IME-3701', 'Método de los Elementos Finitos (FEA) y CFD', '💻', 'purple', 7, 3, 'Formulación matricial de elementos barra, viga y sólidos 2D/3D, mallado, condiciones de frontera y simulación computacional.', [
        'Principio de Energía Potencial Mínima y Formulación de la Matriz de Rigidez Elemental',
        'Elementos Isoparamétricos 2D/3D, Calidad de Malla y Convergencia en ANSYS/SolidWorks',
        'Introducción a la Dinámica de Fluidos Computacional (CFD) y Volúmenes Finitos',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_mecatronica',
    name: 'Ingeniería Mecatrónica',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🦾',
    description: 'Pensum completo PUJ Bogotá: integración sinérgica de mecánica, electrónica, control inteligente, robótica industrial y móvil, PLC y visión artificial.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IMT-1201', 'Sensores, Actuadores e Instrumentación Mecatrónica', '📡', 'amber', 3, 3, 'Acondicionamiento de señal, puentes de Wheatstone, encoders, galgas extensiométricas, motores DC, paso a paso y servomotores.', [
        'Características Estáticas y Dinámicas de Sensores, Linealización y Puentes de Medición',
        'Amplificadores de Instrumentación, Filtros Activos y Adquisición de Datos (DAQ)',
        'Modelado y Dimensionamiento de Actuadores Eléctricos (BLDC, Servos), Neumáticos e Hidráulicos',
      ]),
      syl('IMT-2401', 'Automatización Industrial, Neumática y PLC', '🏭', 'blue', 4, 3, 'Sistemas electroneumáticos, GRAFCET, programación de PLC bajo norma IEC 61131-3 (Ladder, FBD, Texto Estructurado) y redes SCADA.', [
        'Diseño de Circuitos Electroneumáticos e Hidráulicos Secuenciales',
        'Modelado de Procesos Discretos con Redes de Petri y GRAFCET',
        'Programación de PLCs (IEC 61131-3), Pantallas HMI, Sistemas SCADA e Industria 4.0 (OPC-UA)',
      ]),
      syl('IMT-2501', 'Cinemática y Dinámica de Robots Manipuladores', '🦾', 'purple', 5, 3, 'Transformaciones homogéneas, convención Denavit-Hartenberg (D-H), cinemática directa e inversa, Jacobiano y dinámica Euler-Lagrange.', [
        'Matrices de Rotación, Cuaterniones y Transformaciones Homogéneas en SE(3)',
        'Cinemática Directa con Parámetros de Denavit-Hartenberg (D-H) y Cinemática Inversa Geométrica/Numérica',
        'Matriz Jacobiana de Velocidades, Singularidades y Dinámica por formulación de Euler-Lagrange',
        'Generación de Trayectorias Articulares y Cartesianas y Control de Fuerza/Impedancia',
      ]),
      syl('IMT-2601', 'Sistemas de Control Digital y en Espacio de Estados', '🎛️', 'emerald', 6, 3, 'Discretización de sistemas, estabilidad en el plano Z, realimentación de estados, observadores de Luenberger y Filtro de Kalman.', [
        'Muestreo, Retenedor de Orden Cero (ZOH) y Función de Transferencia en Tiempo Discreto',
        'Controlabilidad, Observabilidad y Ubicación de Polos por Realimentación de Estados',
        'Diseño de Observadores de Estado, Regulador Lineal Cuadrático (LQR) y Filtro de Kalman',
      ]),
      syl('IMT-3701', 'Robótica Móvil Autónoma y Visión por Computador (ROS 2)', '🤖', 'rose', 7, 3, 'Locomoción diferencial y omnidireccional, procesamiento de imágenes OpenCV, odometría, SLAM y navegación en ROS 2.', [
        'Modelos Cinemáticos de Robots Móviles (Diferencial, Ackermann, Omnidireccional Mecanum)',
        'Visión Artificial: Calibración de Cámara, Filtrado, Segmentación y Detección de Objetos (YOLO/OpenCV)',
        'Localización y Mapeo Simultáneo (SLAM con LiDAR) y Planificación de Rutas (A*, RRT) en ROS 2',
      ]),
      syl('IMT-3801', 'Diseño Mecatrónico Integrado (Proyecto Capstone)', '🚀', 'amber', 8, 4, 'Metodología en V (VDI 2206) para el diseño concurrente mecánico, electrónico y de software de un prototipo funcional.', [
        'Diseño Conceptual bajo Norma VDI 2206 y Simulación Hardware-in-the-Loop (HIL)',
        'Integración de PCB, Estructura Mecánica, Firmware Embebido y Pruebas de Validación',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_biomedica',
    name: 'Ingeniería Biomédica / Bioingeniería',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🫀',
    description: 'Pensum completo PUJ Bogotá: fisiología cuantitativa, instrumentación médica, procesamiento de bioseñales (ECG/EEG), imágenes médicas, biomecánica y biomateriales.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IBM-1201', 'Anatomía y Fisiología Cuantitativa para Ingenieros', '🫀', 'rose', 2, 4, 'Modelado matemático de potenciales de membrana, sistema cardiovascular, respiratorio, renal y neuromuscular.', [
        'Ecuación de Nernst, Goldman-Hodgkin-Katz y Modelo de Hodgkin-Huxley del Potencial de Acción',
        'Hemodinámica Cardiovascular: Ciclo Cardíaco, Relación Presión-Volumen y Ley de Poiseuille',
        'Mecánica Ventilatoria Pulmonar, Intercambio Gaseoso Alveolar y Filtración Glomerular',
      ]),
      syl('IBM-2401', 'Biomateriales e Ingeniería de Tejidos', '🧬', 'emerald', 4, 3, 'Biocompatibilidad, metales de uso médico, biocerámicos, polímeros biodegradables, hidrogeles y cultivo celular en scaffolds.', [
        'Propiedades Superficiales y Volumétricas de Biomateriales Metálicos (Titanio, Co-Cr), Cerámicos y Poliméricos',
        'Respuesta Inmune al Cuerpo Extraño, Hemocompatibilidad y Ensayos de Citotoxicidad (ISO 10993)',
        'Diseño de Andamios (Scaffolds), Bioimpresión 3D y Liberación Controlada de Fármacos',
      ]),
      syl('IBM-2501', 'Instrumentación Biomédica y Seguridad Eléctrica Hospitalaria', '🩺', 'blue', 5, 3, 'Electrodos de biopotenciales, amplificadores de ECG, EEG y EMG, pletismografía (SpO2) y seguridad eléctrica IEC 60601.', [
        'Interfaz Electrodo-Piel, Amplificadores de Biopotenciales y Rechazo en Modo Común (CMRR)',
        'Diseño de Electrocardiógrafos (ECG), Electroencefalógrafos (EEG) y Electromiógrafos (EMG)',
        'Sensores Ópticos (Oximetría de Pulso), Presión Arterial y Normativa de Seguridad Eléctrica IEC 60601-1',
      ]),
      syl('IBM-2601', 'Biomecánica, Prótesis, Órtesis y Rehabilitación', '🦿', 'amber', 6, 3, 'Biomecánica del tejido óseo y muscular, análisis cinemático y cinético de la marcha humana y diseño de prótesis mioeléctricas.', [
        'Viscoelasticidad de Tejidos Biológicos (Hueso, Cartílago, Tendón y Ligamento)',
        'Laboratorio de Análisis de Movimiento: Fotogrametría 3D, Plataformas de Fuerza y Ciclo de la Marcha',
        'Diseño Biomecánico de Implantes Ortopédicos, Órtesis y Prótesis Bionicas / Exoesqueletos',
      ]),
      syl('IBM-3701', 'Procesamiento de Señales e Imágenes Médicas (DICOM)', '🧠', 'purple', 7, 3, 'Filtrado de ECG/EEG, principios físicos de Rayos X, Tomografía Computarizada (TC), Resonancia Magnética (RM), Ultrasonido y segmentación.', [
        'Eliminación de Ruido e Interferencia de 60 Hz en Bioseñales y Detección del Complejo QRS',
        'Física y Reconstrucción Tomográfica (Transformada de Radon) en Rayos X, TC, RM y Ecografía',
        'Segmentación de Órganos y Clasificación de Patologías con Visión Artificial y Deep Learning (U-Net)',
      ]),
      syl('IBM-3801', 'Ingeniería Clínica, Gestión Tecnológica y Tecnovigilancia', '🏥', 'emerald', 8, 3, 'Gestión de equipamiento hospitalario, mantenimiento biomédico, habilitación en salud y regulación INVIMA/FDA.', [
        'Ciclo de Vida de la Tecnología Biomédica: Adquisición, Cronogramas de Mantenimiento y Metrología',
        'Programa Institucional de Tecnovigilancia, Gestión de Riesgo Clínico (ISO 14971) y Regulación INVIMA',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ciencia_datos',
    name: 'Ciencia de Datos',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '📊',
    description: 'Pensum completo PUJ Bogotá: inferencia estadística, optimización, ingeniería de datos, aprendizaje automático (ML), Deep Learning, Big Data y visualización.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('CDAT-1101', 'Fundamentos de Ciencia de Datos y Programación en Python/R', '🐍', 'blue', 1, 3, 'Estructuras de datos científicas con NumPy, Pandas, limpieza de datos (Data Wrangling) y análisis exploratorio (EDA).', [
        'Ecosistema Científico en Python: Vectorización con NumPy y Manipulación Tabular con Pandas',
        'Limpieza de Datos: Imputación de Faltantes, Detección de Outliers y Transformación de Variables',
        'Análisis Exploratorio de Datos (EDA) y Storytelling Visual con Matplotlib, Seaborn y Plotly',
      ]),
      syl('CDAT-2301', 'Inferencia Estadística y Modelos Lineales Generalizados', '📈', 'emerald', 3, 3, 'Estimación por máxima verosimilitud (MLE), inferencia bayesiana, regresión lineal, logística y Poisson.', [
        'Estimadores Puntuales, Propiedades Asintóticas y Máxima Verosimilitud (MLE)',
        'Regresión Lineal Múltiple, Multicolinealidad, Regularización (Ridge, Lasso, ElasticNet)',
        'Modelos Lineales Generalizados (GLM): Regresión Logística, Poisson y Estadística Bayesiana',
      ]),
      syl('CDAT-2401', 'Optimización Matemática para Ciencia de Datos', '🎯', 'amber', 4, 3, 'Conjuntos y funciones convexas, descenso de gradiente estocástico (SGD), dualidad de Lagrange y condiciones KKT.', [
        'Análisis Convexo: Conjuntos Convexos, Funciones Convexas y Condiciones de Optimalidad',
        'Algoritmos de Primer y Segundo Orden: Descenso de Gradiente, Momentum, Adam y Método de Newton',
        'Dualidad Lagrangiana, Condiciones de Karush-Kuhn-Tucker (KKT) y Optimización con Restricciones',
      ]),
      syl('CDAT-2501', 'Aprendizaje Automático (Machine Learning)', '🤖', 'purple', 5, 3, 'Aprendizaje supervisado, ensambles (XGBoost, LightGBM), validación cruzada, clustering, reducción de dimensionalidad y MLOps.', [
        'Compromiso Sesgo-Varianza, Validación Cruzada Estratificada y Selección de Características',
        'Máquinas de Soporte Vectorial (Kernels), Random Forest y Gradient Boosting (XGBoost / LightGBM)',
        'Clustering (K-Means, DBSCAN, Jerárquico) y Reducción de Dimensionalidad (PCA, t-SNE, UMAP)',
      ]),
      syl('CDAT-2601', 'Ingeniería de Datos, Arquitecturas Big Data y Cloud', '☁️', 'blue', 6, 3, 'Bases de datos NoSQL, Data Warehousing, pipelines ETL/ELT, procesamiento distribuido en Apache Spark y streaming.', [
        'Modelado Dimensional (Estrella/Copo de Nieve), Data Warehouses y Data Lakes (Medallion Architecture)',
        'Bases de Datos NoSQL (MongoDB, Cassandra, Neo4j) y Motores Columnar Parquet',
        'Procesamiento Distribuido con PySpark, Orquestación con Airflow y Streaming con Kafka',
      ]),
      syl('CDAT-3701', 'Deep Learning, Visión Artificial y Modelos de Lenguaje (NLP/LLMs)', '🧠', 'rose', 7, 3, 'Redes convolucionales (CNN), recurrentes, arquitectura Transformer, mecanismos de atención, RAG y ajuste fino de LLMs.', [
        'Perceptrón Multicapa, Backpropagation, Batch Normalization, Dropout y Optimizadores en PyTorch',
        'Redes Convolucionales (CNN) para Visión por Computador y Transfer Learning',
        'Arquitectura Transformer, Self-Attention, Embeddings, Fine-Tuning (LoRA) y Sistemas RAG',
      ]),
      syl('CDAT-3801', 'Ética en Inteligencia Artificial, Gobernanza y Explicabilidad (XAI)', '⚖️', 'emerald', 8, 3, 'Sesgos algorítmicos, equidad (Fairness), privacidad diferencial, interpretabilidad con SHAP/LIME y regulación de IA.', [
        'Métricas de Equidad Algorítmica (Demographic Parity, Equalized Odds) y Mitigación de Sesgos',
        'Explicabilidad de Modelos de Caja Negra con Valores de Shapley (SHAP) y LIME',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_redes',
    name: 'Ingeniería en Redes y Telecomunicaciones',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '📡',
    description: 'Pensum completo PUJ Bogotá: conmutación y enrutamiento avanzado, fibra óptica, comunicaciones móviles 5G, IoT, arquitecturas Cloud y ciberseguridad.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IRT-2301', 'Teoría Electromagnética, Medios de Transmisión y Antenas', '📡', 'purple', 3, 3, 'Ondas electromagnéticas guiadas, guías de onda, fibra óptica, parámetros S y diseño de antenas.', [
        'Propagación de Ondas Planas, Líneas de Transmisión y Acoplamiento de Impedancias',
        'Comunicaciones Ópticas: Fibra Monomodo/Multimodo, Atenuación, Dispersión y Redes GPON/DWDM',
        'Parámetros de Antenas (Ganancia, Directividad, Patrón de Radiación, Polarización) y Arreglos',
      ]),
      syl('IRT-2401', 'Conmutación, Enrutamiento Avanzado y Redes Definidas por Software (SDN)', '🌐', 'blue', 4, 3, 'VLANs, Spanning Tree, OSPF multiárea, BGP, MPLS, calidad de servicio (QoS) y controladores SDN.', [
        'Conmutación Capa 2: IEEE 802.1Q VLANs, RSTP, EtherChannel y Seguridad de Puerto',
        'Protocolos de Enrutamiento Interior y Exterior: OSPFv2/v3 Multiárea, IS-IS y BGP4',
        'Ingeniería de Tráfico con MPLS, Calidad de Servicio (DiffServ) y Redes Definidas por Software (SDN)',
      ]),
      syl('IRT-2501', 'Comunicaciones Inalámbricas y Redes Móviles (4G LTE / 5G NR)', '📶', 'emerald', 5, 3, 'Canales con desvanecimiento (Rayleigh/Rician), MIMO masivo, OFDMA, arquitectura 5G Core y planificación celular.', [
        'Modelos de Propagación Radioeléctrica (Okumura-Hata, COST-231) y Desvanecimiento Multipath',
        'Técnicas Multiportadora OFDM/OFDMA, Sistemas MIMO y Beamforming',
        'Arquitectura de Redes Móviles 4G EPC y 5G New Radio (eMBB, URLLC, mMTC) y Network Slicing',
      ]),
      syl('IRT-2601', 'Internet de las Cosas (IoT) y Redes de Sensores (LPWAN)', '🛰️', 'amber', 6, 3, 'Protocolos ligeros MQTT/CoAP, tecnologías LoRaWAN, Sigfox, NB-IoT, Zigbee y plataformas Edge Computing.', [
        'Arquitectura de Soluciones IoT de Extremo a Extremo y Nodos Sensores de Bajo Consumo',
        'Redes LPWAN (LoRaWAN, NB-IoT) y Protocolos de Mensajería (MQTT, CoAP, AMQP)',
      ]),
      syl('IRT-3701', 'Seguridad en Redes, Hacking Ético y Ciberdefensa', '🛡️', 'rose', 7, 3, 'Firewalls de próxima generación, IDS/IPS, VPNs IPsec, pruebas de penetración (Pentesting) y operación de un SOC/SIEM.', [
        'Arquitecturas Zero-Trust, Segmentación de Red, Firewalls NGFW y Sistemas IDS/IPS (Snort/Suricata)',
        'Túneles Criptográficos IPsec / WireGuard, Pentesting de Infraestructura y Monitoreo SIEM',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_ing_civil_industrial_doble',
    name: 'Ingeniería Mecatrónica / Electrónica / Sistemas (Énfasis Robótica e IA)',
    faculty: 'Ingeniería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🤖',
    description: 'Ruta interdisciplinaria de la Facultad de Ingeniería PUJ Bogotá en Sistemas Ciberfísicos, Robótica e Inteligencia Artificial.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('IRIA-2101', 'Programación de Sistemas Ciberfísicos y Tiempo Real', '⚡', 'blue', 3, 3, 'Sistemas embebidos concurrentes, RTOS, protocolos industriales y control distribuido.', [
        'Concurrencia en Tiempo Real, Planificación Rate-Monotonic y EDF',
        'Integración de Sensores Inteligentes, Edge AI y Comunicaciones Determinísticas',
      ]),
      syl('IRIA-3101', 'Aprendizaje por Refuerzo y Control Inteligente', '🧠', 'purple', 6, 3, 'Procesos de decisión de Markov (MDP), Q-Learning, Deep Q-Networks (DQN) y control adaptativo.', [
        'Procesos de Decisión de Markov (MDP), Ecuación de Bellman y Programación Dinámica',
        'Q-Learning, Policy Gradient y Aprendizaje por Refuerzo Profundo aplicado a Robótica',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 2. FACULTAD DE MEDICINA (1 PREGRADO - 12 SEMESTRES)
  // --------------------------------------------------------------------------
  {
    id: 'puj_medicina',
    name: 'Medicina',
    faculty: 'Medicina',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá (Hospital Universitario San Ignacio)',
    semesters: 12,
    totalCredits: 268,
    emoji: '🩺',
    description: 'Pensum completo PUJ Bogotá (Semestres 1 a 12): ciencias básicas biomédicas, semiología, farmacología, patología, medicina interna, cirugía, pediatría, ginecobstetricia, psiquiatría e internado rotatorio.',
    subjects: [
      ...TRONCO_SALUD_BASICO,
      syl('MED-1201', 'Morfofisiología Humana II (Cardiorrespiratorio, Renal y Digestivo)', '🫁', 'blue', 2, 7, 'Anatomía macroscópica, histología y fisiología integrada del corazón, pulmón, riñón y tracto gastrointestinal.', [
        'Anatomía del Tórax, Electrofisiología Cardíaca, Ciclo Cardíaco y Regulación de la Presión Arterial',
        'Fisiología Respiratoria: Relación Ventilación/Perfusión (V/Q), Transporte de O2/CO2 y Equilibrio Ácido-Base',
        'Fisiología Renal: Filtración Glomerular, Reabsorción Tubular, Mecanismo Contracorriente y RAA',
        'Fisiología Gastrointestinal: Motilidad, Secreción Enzimática, Absorción y Fisiología Hepática',
      ]),
      syl('MED-1301', 'Neurociencias y Morfofisiología Neuroendocrina', '🧠', 'purple', 3, 6, 'Neuroanatomía funcional, vías sensoriales y motoras, pares craneales, corteza cerebral y eje hipotálamo-hipófisis.', [
        'Neuroanatomía de Médula Espinal, Tallo Cerebral, Cerebelo, Diencéfalo y Ganglios Basales',
        'Vías Somatosensoriales (Dolor, Temperatura, Propiocepción) y Vía Piramidal / Extrapiramidal',
        'Pares Craneales (I a XII), Irrigación Cerebral (Polígono de Willis) y Ejes Endocrinos',
      ]),
      syl('MED-1302', 'Microbiología, Parasitología e Inmunología Médica', '🦠', 'emerald', 3, 5, 'Inmunidad innata y adaptativa, bacteriología clínica, virología, micología y parasitología tropical.', [
        'Respuesta Inmune Innata, Presentación Antigénica (MHC I/II), Linfocitos T/B y Anticuerpos',
        'Bacteriología Médica: Cocos Gram+, Bacilos Gram-, Micobacterias y Mecanismos de Resistencia Antibiótica',
        'Virología Clínica (VIH, Hepatitis, Dengue, Influenza) y Parasitología (Malaria, Chagas, Leishmania)',
      ]),
      syl('MED-1401', 'Patología General y Sistémica', '🔬', 'rose', 4, 5, 'Lesión y muerte celular, inflamación aguda y crónica, reparación tisular, trastornos hemodinámicos y neoplasias.', [
        'Adaptación Celular (Hipertrofia, Metaplasia), Necrosis, Apoptosis e Inflamación Aguda y Crónica',
        'Trastornos Hemodinámicos: Edema, Trombosis, Embolia, Infarto y Fisiopatología del Shock',
        'Biología Molecular del Cáncer: Oncogenes, Genes Supresores (p53, RB) y Estadificación TNM',
      ]),
      syl('MED-1402', 'Farmacología Básica y Clínica', '💊', 'amber', 4, 5, 'Farmacocinética, farmacodinamia, sistema nervioso autónomo, farmacología cardiovascular, antimicrobianos y analgesia.', [
        'Farmacocinética (LADME, Volumen de Distribución, Clearance, Vida Media) y Receptores Farmacológicos',
        'Farmacología Adrenérgica, Colinérgica, Antihipertensivos, Antiarrítmicos y Anticoagulantes',
        'Espectro y Mecanismo de Acción de Betalactámicos, Macrólidos, Quinolonas, AINEs y Opioides',
      ]),
      syl('MED-2501', 'Semiología Clínica y Propedéutica Médica (HUSI)', '🩺', 'blue', 5, 8, 'Historia clínica completa, anamnesis, examen físico por sistemas, síndromes clínicos y paraclinicos iniciales.', [
        'Estructura de la Historia Clínica: Anamnesis, Enfermedad Actual y Revisión por Sistemas',
        'Semiología Cardiovascular (Focos Auscultatorios, Soplos) y Pulmonar (Estertores, Sibilancias, Derrame)',
        'Semiología Abdominal (Abdomen Agudo), Neurológica y Enfoque de Síndromes Febril, Anémico e Ictérico',
      ]),
      syl('MED-2601', 'Medicina Interna I y II (Cardiología, Neumología, Nefrología, Infectología)', '🏥', 'rose', 6, 10, 'Diagnóstico y manejo integral de patologías prevalentes del adulto en hospitalización y urgencias.', [
        'Síndrome Coronario Agudo (IAMCEST/IAMSEST), Falla Cardíaca, Fibrilación Auricular y Crisis Hipertensiva',
        'EPOC, Asma, Neumonía Adquirida en la Comunidad, Tromboembolismo Pulmonar (TEP) y Sepsis',
        'Lesión Renal Aguda (AKIN), Enfermedad Renal Crónica, Cetoacidosis Diabética y Estado Hiperosmolar',
      ]),
      syl('MED-2701', 'Cirugía General, Anestesiología y Especialidades Quirúrgicas', '🔪', 'purple', 7, 9, 'Respuesta metabólica al trauma, ATLS, abdomen agudo quirúrgico, hernias, patología biliar, ortopedia y urología.', [
        'Valoración Preanestésica (ASA), Vía Aérea, Líquidos y Electrolitos y Manejo Inicial del Politraumatizado (ATLS)',
        'Apendicitis Aguda, Colecistitis, Coledocolitiasis, Pancreatitis Aguda y Obstrucción Intestinal',
        'Principios de Ortopedia (Fracturas, Luxaciones), Urología, Otorrinolaringología y Oftalmología',
      ]),
      syl('MED-2801', 'Pediatría y Puericultura', '👶', 'emerald', 8, 8, 'Crecimiento y desarrollo, vacunación PAI, neonatología, enfermedades respiratorias (IRA) y diarreicas (EDA) infantiles.', [
        'Adaptación Neonatal, Reanimación Neonatal, Ictericia y Sepsis Neonatal',
        'Crecimiento y Desarrollo, Esquema Nacional de Vacunación (PAI) y Desnutrición Infantil',
        'Enfoque AIEPI: Bronquiolitis, Crup, Neumonía Pediátrica, Enfermedad Diarreica Aguda y Deshidratación',
      ]),
      syl('MED-2901', 'Ginecología, Obstetricia y Reproducción Humana', '🤰', 'rose', 9, 8, 'Control prenatal, trabajo de parto, trastornos hipertensivos del embarazo, hemorragia posparto y patología ginecológica.', [
        'Control Prenatal de Bajo y Alto Riesgo, Partograma y Atención del Trabajo de Parto y Puerperio',
        'Preeclampsia/Eclampsia, Síndrome HELLP, Diabetes Gestacional y Código Rojo Obstétrico (Hemorragia)',
        'Hemorragia Uterina Anormal (PALM-COEIN), Tamizaje de Cáncer de Cuello Uterino y Patología Mamaria',
      ]),
      syl('MED-3001', 'Psiquiatría, Salud Mental y Medicina Legal', '🧠', 'amber', 10, 6, 'Psicopatología, trastornos del ánimo, psicosis, urgencias psiquiátricas, toxicología y clínica forense.', [
        'Examen Mental, Trastorno Depresivo Mayor, Trastorno Bipolar y Trastornos de Ansiedad',
        'Esquizofrenia, Delirium, Riesgo Suicida, Psicofarmacología y Dictamen Médico-Legal',
      ]),
      syl('MED-3101', 'Internado Rotatorio I y II (Práctica Hospitalaria HUSI)', '🎓', 'blue', 11, 24, 'Año de internado médico rotatorio con guardias clínicas, toma de decisiones supervisada y preparación Saber Pro.', [
        'Rotaciones Clínicas de Internado en Urgencias, Medicina Interna, Cirugía, Pediatría y Ginecobstetricia',
        'Atención Primaria en Salud, Razonamiento Clínico Basado en la Evidencia y Seguridad del Paciente',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 3. FACULTAD DE ODONTOLOGÍA (1 PREGRADO - 10 SEMESTRES)
  // --------------------------------------------------------------------------
  {
    id: 'puj_odontologia',
    name: 'Odontología',
    faculty: 'Odontología',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 189,
    emoji: '🦷',
    description: 'Pensum completo PUJ Bogotá: anatomía cabeza y cuello, cariología, biomateriales dentales, periodoncia, endodoncia, rehabilitación oral, ortodoncia y cirugía maxilofacial.',
    subjects: [
      ...TRONCO_SALUD_BASICO,
      syl('ODO-1201', 'Anatomía de Cabeza, Cuello y Morfología Dental', '🦷', 'blue', 2, 4, 'Osteología craneofacial, músculos masticatorios, nervio trigémino y facial, ATM y anatomía dentaria.', [
        'Osteología del Cráneo, Articulación Temporomandibular (ATM) y Músculos de la Masticación',
        'Recorrido y Ramas del Nervio Trigémino (V Par), Nervio Facial (VII Par) e Irrigación Carotídea',
        'Morfología Coronaria y Radicular de la Dentición Temporal y Permanente y Oclusión Dental',
      ]),
      syl('ODO-1301', 'Biomateriales Odontológicos y Operatoria Preclínica', '🔬', 'emerald', 3, 4, 'Adhesión amelodentinaria, resinas compuestas, ionómeros de vidrio, elastómeros de impresión y cerámicas.', [
        'Sistemas Adhesivos Dentales: Grabado Ácido Total vs Autograbado y Capa Híbrida',
        'Resinas Compuestas Fotopolimerizables, Contracción de Polimerización y Ionómeros de Vidrio',
        'Materiales de Impresión (Alginatos, Siliconas por Adición) y Aleaciones / Cerámicas libres de metal',
      ]),
      syl('ODO-2401', 'Cariología, Patología Oral y Radiología Maxilofacial', '🔎', 'amber', 4, 4, 'Biofilm dental, sistema ICDAS, quistes y tumores odontogénicos, lesiones potencialmente malignas e imagenología CBCT.', [
        'Etiopatogenia de la Caries Dental, Desmineralización/Remineralización y Clasificación ICDAS',
        'Patología de Glándulas Salivales, Quistes Odontogénicos y Lesiones de la Mucosa Oral',
        'Radiología Periapical, Panorámica y Tomografía Computarizada de Haz Cónico (CBCT)',
      ]),
      syl('ODO-2501', 'Periodoncia y Medicina Periodontal', '🩺', 'rose', 5, 4, 'Biología del periodonto, clasificación de enfermedades periodontales y periimplantares, raspaje y cirugía periodontal.', [
        'Anatomía del Periodonto de Protección e Inserción y Microbiología del Biofilm Subgingival',
        'Clasificación Mundial de Gingivitis, Periodontitis (Estadios y Grados) y Terapia Básica Periodontal',
        'Cirugía Periodontal Regenerativa, Colgajos e Implantología Oseointegrada',
      ]),
      syl('ODO-2601', 'Endodoncia Preclínica y Clínica', '⚡', 'purple', 6, 4, 'Diagnóstico pulpar y periapical, apertura cameral, instrumentación biomecánica rotatoria y obturación tridimensional.', [
        'Clasificación Clínica de Patología Pulpar (Pulpitis Reversible/Irreversible, Necrosis) y Periapical',
        'Anatomía de Conductos Radiculares, Determinación de Longitud de Trabajo y Preparación Rotatoria NiTi',
        'Protocolos de Irrigación (Hipoclorito de Sodio, EDTA), Obturación Termoplastificada y Microcirugía Apical',
      ]),
      syl('ODO-2701', 'Rehabilitación Oral y Prostodoncia (Fija, Removible y sobre Implantes)', '👑', 'blue', 7, 5, 'Principios biomecánicos de tallado, coronas, puentes fijos, prótesis parcial removible y prótesis total.', [
        'Principios Biomecánicos de Preparación Dentaria, Retención, Estabilidad y Ferulización (Efecto Férula)',
        'Diseño de Prótesis Parcial Removible (Clasificación de Kennedy) y Rehabilitación de Paciente Edéntulo Total',
        'Flujo Digital CAD/CAM, Carillas Cerámicas e Incrustaciones (Inlays/Onlays)',
      ]),
      syl('ODO-2801', 'Ortodoncia, Ortopedia Maxilar y Odontopediatría', '👶', 'emerald', 8, 5, 'Crecimiento craneofacial, análisis cefalométrico, maloclusiones de Angle, manejo de conducta y trauma dentoalveolar infantil.', [
        'Crecimiento y Desarrollo Craneofacial, Análisis Cefalométrico de Steiner/Ricketts y Clasificación de Angle',
        'Biomecánica del Movimiento Dental Ortodóncico y Ortopedia Funcional de los Maxilares',
        'Terapia Pulpar en Dientes Deciduos (Pulpotomía/Pulpectomía) y Trauma Dentoalveolar en Niños',
      ]),
      syl('ODO-3901', 'Cirugía Oral y Maxilofacial y Clínicas Integrales del Adulto', '🏥', 'rose', 9, 8, 'Anestesia local troncular, exodoncia simple y quirúrgica de terceros molares incluidos, infecciones odontogénicas y trauma facial.', [
        'Técnicas de Anestesia Local en Maxilar y Mandíbula y Manejo de Complicaciones',
        'Exodoncia Quirúrgica de Terceros Molares Retenidos (Clasificación de Pell & Gregory y Winter)',
        'Manejo de Infecciones Odontogénicas Severas (Angina de Ludwig) y Fracturas Mandibulares/Le Fort',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 4. FACULTAD DE ENFERMERÍA (1 PREGRADO - 8 SEMESTRES)
  // --------------------------------------------------------------------------
  {
    id: 'puj_enfermeria',
    name: 'Enfermería',
    faculty: 'Enfermería',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 152,
    emoji: '💉',
    description: 'Pensum completo PUJ Bogotá: fundamentos del cuidado, proceso de atención de enfermería (PAE: NANDA-NOC-NIC), farmacología clínica, cuidado crítico UCI, materno-perinatal y salud comunitaria.',
    subjects: [
      ...TRONCO_SALUD_BASICO,
      syl('ENF-1101', 'Epistemología y Fundamentos del Cuidado de Enfermería', '💙', 'blue', 1, 4, 'Teorías y modelos de enfermería (Nightingale, Orem, Roy, Watson) y Proceso de Atención de Enfermería (PAE).', [
        'Metaparadigma de Enfermería (Persona, Entorno, Salud, Cuidado) y Teorías de Rango Medio',
        'Etapas del Proceso de Enfermería: Valoración por Dominios, Diagnóstico NANDA, Resultados NOC e Intervenciones NIC',
        'Técnicas de Asepsia, Bioseguridad, Signos Vitales y Seguridad en la Administración de Medicamentos',
      ]),
      syl('ENF-1201', 'Semiología y Valoración del Estado de Salud', '🩺', 'emerald', 2, 4, 'Entrevista clínica de enfermería, examen físico céfalo-caudal y valoración integral por ciclos vitales.', [
        'Entrevista Terapéutica, Valoración Neurológica (Escala de Glasgow) y Cardiorrespiratoria',
        'Valoración Nutricional, Integridad Cutánea (Escalas de Braden y Norton) y Riesgo de Caídas',
      ]),
      syl('ENF-2301', 'Farmacología Clínica para Enfermería', '💊', 'amber', 3, 3, 'Cálculo de dosis, diluciones, velocidades de infusión, farmacovigilancia e interacciones medicamentosas.', [
        'Los 10 Correctos en la Administración de Medicamentos, Cálculo de Goteo y Bombas de Infusión',
        'Manejo Seguro de Inotrópicos, Vasopresores, Sedoanalgesia, Insulinas y Anticoagulantes',
      ]),
      syl('ENF-2401', 'Cuidado de Enfermería al Adulto y Adulto Mayor (Médico-Quirúrgico)', '🏥', 'rose', 4, 8, 'Cuidado pre, trans y posoperatorio, heridas y ostomías, patologías crónicas y cuidado paliativo.', [
        'Cuidado Integral en el Paciente Quirúrgico, Manejo de Drenajes, Heridas Complejas y Ostomías',
        'Cuidado de Enfermería en Falla Cardíaca, EPOC, Diabetes Mellitus y Enfermedad Renal Crónica',
      ]),
      syl('ENF-2501', 'Cuidado de Enfermería Materno-Perinatal, Niño y Adolescente', '👶', 'purple', 5, 8, 'Cuidado prenatal, trabajo de parto humanizado, lactancia materna, adaptación neonatal y hospitalización pediátrica.', [
        'Valoración Obstétrica (Maniobras de Leopold, Monitoreo Fetal), Parto Seguro y Emergencias Obstétricas',
        'Cuidado en Unidad de Recién Nacidos, Programa Canguro, Vacunación PAI y AIEPI Clínico',
      ]),
      syl('ENF-2601', 'Cuidado de Enfermería en Salud Mental y Psiquiatría', '🧠', 'amber', 6, 5, 'Relación terapéutica, intervención en crisis, primeros auxilios psicológicos y cuidado en trastornos mentales.', [
        'Comunicación Terapéutica, Intervención en Crisis y Prevención de la Conducta Suicida',
        'Cuidado de Enfermería en Trastornos Afectivos, Psicóticos y Consumo de Sustancias Psicoactivas',
      ]),
      syl('ENF-3701', 'Cuidado de Enfermería al Paciente en Estado Crítico (UCI y Urgencias)', '⚡', 'rose', 7, 8, 'Reanimación cardiopulmonar (BLS/ACLS), ventilación mecánica, monitoreo hemodinámico invasivo y triaje.', [
        'Clasificación de Triaje en Urgencias, Reanimación Cardiopulmonar Avanzada (ACLS) y Código Azul',
        'Cuidado del Paciente con Ventilación Mecánica Invasiva, Gasometría Arterial y Monitoreo en UCI',
      ]),
      syl('ENF-3801', 'Gerencia de Servicios de Enfermería y Salud Familiar / Comunitaria', '🌍', 'emerald', 8, 8, 'Liderazgo hospitalario, auditoría de calidad, gestión de turnos, indicadores de seguridad del paciente y APS.', [
        'Gestión del Talento Humano en Enfermería, Indicadores de Calidad y Eventos Adversos (Protocolo de Londres)',
        'Atención Primaria en Salud (APS), Cartografía Social y Proyectos Comunitarios',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 5. FACULTAD DE CIENCIAS (8 PREGRADOS EN SEDE BOGOTÁ)
  // --------------------------------------------------------------------------
  {
    id: 'puj_biologia',
    name: 'Biología',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🦎',
    description: 'Pensum completo PUJ Bogotá: biología celular y molecular, botánica, zoología de invertebrados y vertebrados, genética, evolución, fisiología animal y vegetal, ecología y conservación.',
    subjects: [
      syl('BIO-1101', 'Biología Celular y Molecular', '🧬', 'emerald', 1, 4, 'Organización supramolecular, tráfico vesicular, citoesqueleto, señalización celular y regulación del ciclo celular.', [
        'Membranas Biológicas, Transporte Activo/Pasivo y Sistema de Endomembranas',
        'Respiración Celular Mitocondrial, Fotosíntesis en Cloroplastos y Citoesqueleto',
        'Ciclo Celular (Ciclinas y CDKs), Mitosis, Meiosis y Muerte Celular Programada',
      ]),
      syl('BIO-1201', 'Biología y Sistemática de Plantas (Botánica)', '🌿', 'emerald', 2, 4, 'Evolución de embriofitas, briofitos, helechos, gimnospermas y angiospermas, histología vegetal y taxonomía.', [
        'Tejidos Vegetales (Meristemos, Xilema, Floema) y Morfología de Raíz, Tallo, Hoja y Flor',
        'Filogenia de Briofitos, Pteridofitos, Gimnospermas y Familias de Angiospermas Neotropicales',
      ]),
      syl('BIO-1301', 'Zoología de Invertebrados y Cordados', '🦋', 'amber', 3, 4, 'Planes corporales, simetría, embriología comparada y evolución de artrópodos, moluscos, peces, anfibios, reptiles, aves y mamíferos.', [
        'Protostomados (Cnidarios, Platelmintos, Moluscos, Anélidos, Artrópodos) y Deuterostomados',
        'Evolución y Anatomía Comparada de Peces, Anfibios, Reptiles, Aves y Mamíferos de Colombia',
      ]),
      syl('BIO-2401', 'Genética General y Genética de Poblaciones', '🧬', 'purple', 4, 4, 'Herencia mendeliana y no mendeliana, ligamiento, mapeo cromosómico, equilibrio de Hardy-Weinberg y deriva génica.', [
        'Epistasis, Herencia Ligada al Sexo, Recombinación y Mapas Genéticos',
        'Equilibrio de Hardy-Weinberg, Selección Natural, Deriva Génica, Flujo Génico y Endogamia',
      ]),
      syl('BIO-2501', 'Fisiología Animal y Vegetal Comparada', '🫀', 'rose', 5, 4, 'Adaptaciones fisiológicas animales (osmorregulación, termorregulación) y relaciones hídricas y fitohormonas en plantas.', [
        'Potencial Hídrico, Transporte en Xilema/Floema, Fotosíntesis C3, C4 y CAM y Fitohormonas',
        'Osmorregulación, Termorregulación, Endocrinología y Neurofisiología Animal Comparada',
      ]),
      syl('BIO-2601', 'Biología Evolutiva y Filogenética Sistemática', '🦕', 'amber', 6, 4, 'Teoría evolutiva moderna, especiación, reconstrucción filogenética (parsimonia, máxima verosimilitud, bayesiana) y biogeografía.', [
        'Mecanismos de Especiación Alopátrica y Simpátrica, Co-evolución y Radiación Adaptativa',
        'Cladística, Alineamiento de Secuencias, Árboles Filogenéticos y Biogeografía Histórica',
      ]),
      syl('BIO-3701', 'Ecología de Poblaciones, Comunidades y Ecosistemas', '🌳', 'blue', 7, 4, 'Crecimiento poblacional exponencial y logístico, matrices de Leslie, competencia de Lotka-Volterra, diversidad alfa/beta/gamma y ciclos biogeoquímicos.', [
        'Dinámica Poblacional, Tablas de Vida, Matrices de Transición y Modelos Depredador-Presa',
        'Estructura de Comunidades, Sucesión Ecológica, Redes Tróficas y Biología de la Conservación',
      ]),
      syl('BIO-3801', 'Bioinformática y Genómica Funcional', '💻', 'purple', 8, 3, 'Secuenciación NGS, ensamblaje de genomas, BLAST, transcriptómica (RNA-Seq) y modelado estructural de proteínas.', [
        'Bases de Datos Genómicas (GenBank, UniProt), Alineamiento BLAST y Ensamblaje de Lecturas NGS',
        'Análisis de Expresión Diferencial (RNA-Seq), Metagenómica y Filogenómica',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_microbiologia',
    name: 'Microbiología Industrial',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🦠',
    description: 'Pensum completo PUJ Bogotá: fisiología y genética microbiana, virología, micología, bioprocesos, fermentaciones industriales, microbiología de alimentos, ambiental y farmacéutica.',
    subjects: [
      syl('MIC-1101', 'Microbiología General y Laboratorio de Cultivo', '🦠', 'emerald', 1, 4, 'Estructura procariota, pared celular Gram+ y Gram-, nutrición microbiana, esterilización y microscopía.', [
        'Ultraestructura Bacteriana, Tinción de Gram, Esporas y Curva de Crecimiento Microbiano',
        'Medios de Cultivo, Cinética de Muerte Térmica, Esterilización y Aislamiento de Cepas',
      ]),
      syl('MIC-1301', 'Fisiología y Genética Microbiana', '🧬', 'purple', 3, 4, 'Metabolismo bacteriano aerobio/anaerobio, fermentaciones, operones (Lac, Trp), plásmidos, conjugación, transducción y CRISPR.', [
        'Diversidad Metabólica: Quimiolitotrofía, Respiración Anaerobia y Rutas Fermentativas',
        'Regulación Génica en Procariotas (Operón Lac/Trp) y Transferencia Horizontal de Genes',
      ]),
      syl('MIC-2401', 'Micología y Virología Aplicada', '🍄', 'amber', 4, 4, 'Hongos filamentosos y levaduras de interés industrial, metabolismo secundario, bacteriófagos y cultivos virales.', [
        'Morfología y Taxonomía de Ascomicetos, Basidiomicetos, Zigomicetos y Levaduras Industriales',
        'Ciclos Lítico y Lisogénico de Bacteriófagos, Producción de Vacunas Virales y Vectores Biotecnológicos',
      ]),
      syl('MIC-2501', 'Microbiología de Alimentos y Control de Calidad (HACCP)', '🧀', 'blue', 5, 4, 'Microorganismos indicadores, patógenos transmitidos por alimentos (ETA), fermentaciones lácticas/alcohólicas y sistema HACCP.', [
        'Factores Intrínsecos y Extrínsecos del Deterioro de Alimentos y Patógenos (Salmonella, Listeria, E. coli)',
        'Cultivos Iniciadores (Starters) en Lácteos, Cervecería y Panificación y Sistema de Inocuidad HACCP / ISO 22000',
      ]),
      syl('MIC-2601', 'Biotecnología de Procesos, Biorreactores y Fermentaciones Industriales', '⚗️', 'rose', 6, 4, 'Cinética de Monod, diseño de biorreactores (Batch, Fed-Batch, Quimiostato), transferencia de oxígeno (kLa) y Downstream Processing.', [
        'Cinética de Crecimiento de Monod, Rendimientos Estequiométricos y Balance de Materia en Biorreactores',
        'Agitación, Aireación (Coeficiente Volumétrico kLa), Escalamiento Industrial y Purificación (Downstream)',
      ]),
      syl('MIC-3701', 'Microbiología Ambiental, Biorremediación y Microbiología Farmacéutica', '🌱', 'emerald', 7, 4, 'Tratamiento biológico de aguas residuales (lodos activados), biodegradación de hidrocarburos, bioinsumos agrícolas y validación USP.', [
        'Microbiología del Suelo, Fijación Biológica de Nitrógeno, Biofertilizantes y Control Biológico (Trichoderma, Bacillus)',
        'Biorremediación de Suelos/Aguas y Control Microbiológico de Productos Farmacéuticos Estériles (Buenas Prácticas BPM)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_bacteriologia',
    name: 'Bacteriología',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 146,
    emoji: '🔬',
    description: 'Pensum completo PUJ Bogotá: hematología clínica, banco de sangre y medicina transfusional, química clínica, inmunología diagnóstica, microbiología clínica y aseguramiento de calidad en el laboratorio.',
    subjects: [
      ...TRONCO_SALUD_BASICO,
      syl('BAC-1301', 'Química Clínica y Endocrinología Diagnóstica', '🧪', 'blue', 3, 4, 'Espectrofotometría, perfil lipídico, renal, hepático, marcadores cardíacos, gases arteriales y pruebas hormonales.', [
        'Principios Analíticos (Espectrofotometría, Quimioluminiscencia) y Control de Calidad Interno (Reglas de Westgard)',
        'Biomarcadores de Función Renal (Creatinina, TFG), Hepática (Transaminasas, Bilirrubinas) y Cardíaca (Troponinas)',
        'Diagnóstico de Diabetes Mellitus (HbA1c, Curva de Tolerancia) y Perfiles Tiroideo y Suprarrenal',
      ]),
      syl('BAC-2401', 'Hematología Clínica y Coagulación', '🩸', 'rose', 4, 5, 'Hematopoyesis, cuadro hemático automatizado, anemias, leucemias agudas y crónicas, citometría de flujo y hemostasia.', [
        'Hematopoyesis, Interpretación del Hemograma, Histogramas y Morfología de Serie Roja (Anemias Carenciales y Hemolíticas)',
        'Fisiopatología y Diagnóstico Morfológico/Inmunofenotípico de Leucemias (LLA, LMA, LLC, LMC) y Linfomas',
        'Hemostasia Primaria y Secundaria: PT, PTT, Fibrinógeno, Dímero D y Trombofilias',
      ]),
      syl('BAC-2501', 'Microbiología Clínica y Resistencia Antimicrobiana', '🦠', 'emerald', 5, 5, 'Aislamiento e identificación de patógenos en hemocultivos, urocultivos, LCR, antibiograma CLSI/EUCAST y biología molecular.', [
        'Diagnóstico Microbiológico de Infecciones del Tracto Urinario, Respiratorio, Torrente Sanguíneo y Meningitis',
        'Pruebas de Susceptibilidad Antimicrobiana (Kirby-Bauer, CIM) y Detección de BLEE, Carbapenemasas (KPC, NDM) y MRSA',
      ]),
      syl('BAC-2601', 'Inmunohematología, Banco de Sangre y Medicina Transfusional', '🏥', 'purple', 6, 4, 'Sistemas de grupos sanguíneos ABO, Rh y Kell, pruebas cruzadas, test de Coombs, fraccionamiento de hemocomponentes y hemovigilancia.', [
        'Genética e Inmunología de los Sistemas ABO, Rh y Sistemas Menores (Kell, Duffy, Kidd)',
        'Rastreo de Anticuerpos Irregulares (RAI), Prueba de Antiglobulina Directa e Indirecta (Coombs) y Pruebas de Compatibilidad',
        'Indicaciones Transfusionales de Glóbulos Rojos, Plaquetas, Plasma y Crioprecipitado y Reacciones Postransfusionales',
      ]),
      syl('BAC-3701', 'Parasitología, Micología Clínica y Diagnóstico Molecular (PCR)', '🔬', 'amber', 7, 4, 'Diagnóstico de hemoparásitos y parásitos intestinales, micosis superficiales y sistémicas, PCR en tiempo real y secuenciación.', [
        'Identificación Microscópica e Inmunológica de Plasmodium, Trypanosoma, Leishmania y Helmintos',
        'Micosis Oportunistas (Candida, Cryptococcus, Aspergillus, Histoplasma) y Diagnóstico por qPCR y MALDI-TOF',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_nutricion',
    name: 'Nutrición y Dietética',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 9,
    totalCredits: 162,
    emoji: '🥗',
    description: 'Pensum completo PUJ Bogotá: bioquímica nutricional, ciencia de alimentos, valoración del estado nutricional, dietoterapia del adulto y pediátrica, soporte metabólico enteral/parenteral y nutrición pública.',
    subjects: [
      ...TRONCO_SALUD_BASICO,
      syl('NUT-1201', 'Ciencia y Química de los Alimentos', '🍎', 'emerald', 2, 4, 'Composición bromatológica, propiedades funcionales de carbohidratos, lípidos y proteínas, pardeamiento y conservación.', [
        'Actividad de Agua (Aw), Gelatinización del Almidón, Emulsiones Lipídicas y Desnaturalización Proteica',
        'Reacción de Maillard, Caramelización, Vitaminas, Minerales y Compuestos Bioactivos Antioxidantes',
      ]),
      syl('NUT-2301', 'Valoración del Estado Nutricional por Ciclos de Vida', '📏', 'blue', 3, 4, 'Antropometría (estándares OMS), composición corporal (bioimpedancia, DEXA), indicadores bioquímicos, clínicos y dietéticos (ABCD).', [
        'Técnica Antropométrica ISAK, Índices Z-Score OMS en Pediatría e IMC / Circunferencias en Adultos',
        'Anamnesis Alimentaria (Recordatorio 24h, Frecuencia de Consumo) y Requerimientos Energéticos (TMB, GET, RIEN)',
      ]),
      syl('NUT-2501', 'Nutrición Clínica y Dietoterapia del Adulto', '🏥', 'rose', 5, 5, 'Terapia médica nutricional en obesidad, síndrome metabólico, diabetes, enfermedad renal, patología gastrointestinal y cáncer.', [
        'Prescripción Dietoterapéutica en Diabetes Mellitus (Conteo de Carbohidratos), Dislipidemias e Hipertensión (Dieta DASH)',
        'Manejo Nutricional en Enfermedad Renal Crónica, Cirrosis Hepática, Enfermedad Inflamatoria Intestinal y Oncología',
      ]),
      syl('NUT-2601', 'Nutrición Materno-Infantil y Dietoterapia Pediátrica', '👶', 'purple', 6, 5, 'Fisiología de la gestación y lactancia, alimentación complementaria, recuperación nutricional en desnutrición aguda y errores innatos del metabolismo.', [
        'Ganancia de Peso Gestacional, Consejería en Lactancia Materna y Alimentación Complementaria (6 a 24 meses)',
        'Tratamiento de la Desnutrición Aguda Moderada y Severa (Fórmula F-75 y FTLC) y Alergias Alimentarias',
      ]),
      syl('NUT-3701', 'Soporte Nutricional Especializado (Enteral y Parenteral)', '💧', 'amber', 7, 4, 'Nutrición en paciente crítico, vías de acceso por sonda/ostomía, fórmulas poliméricas y oligoméricas y cálculo de nutrición parenteral.', [
        'Tamizaje de Riesgo Nutricional Hospitalario (NRS-2002, MUST) y Síndrome de Realimentación',
        'Diseño y Cálculo de Nutrición Enteral y Nutrición Parenteral Total (NPT) en Cuidado Intensivo',
      ]),
      syl('NUT-3801', 'Gerencia de Servicios de Alimentación y Seguridad Alimentaria', '🍽️', 'emerald', 8, 4, 'Planeación de menús institucionales, costos, compras, planta física, BPM y políticas de seguridad alimentaria y nutricional.', [
        'Estandarización de Recetas, Factor de Corrección, Costeo de Menús y Gestión de Servicios de Alimentación',
        'Seguridad Alimentaria y Nutricional (SAN), Guías Alimentarias Basadas en Alimentos (GABA) y Políticas Públicas',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_matematicas',
    name: 'Matemáticas',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '♾️',
    description: 'Pensum completo PUJ Bogotá: teoría de conjuntos, álgebra abstracta (grupos, anillos, cuerpos), análisis real y funcional, topología, geometría diferencial, ecuaciones en derivadas parciales y probabilidad.',
    subjects: [
      ...TRONCO_MATEMATICAS_ING,
      syl('MAT-1305', 'Lógica Matemática y Teoría Axiomática de Conjuntos (ZFC)', '♾️', 'purple', 2, 4, 'Axiomas de Zermelo-Fraenkel, lema de Zorn, axioma de elección, números ordinales y cardinales transfinitos.', [
        'Axiomática de Zermelo-Fraenkel (ZFC), Relaciones de Orden, Retículos y Lema de Zorn',
        'Construcción de los Sistemas Numéricos (N, Z, Q, R), Equipolencia, Teorema de Cantor-Bernstein y Cardinales',
      ]),
      syl('MAT-2401', 'Álgebra Abstracta I: Teoría de Grupos', '🔷', 'blue', 4, 4, 'Grupos, subgrupos normales, grupo cociente, teoremas de isomorfía de Noether, acciones de grupo y teoremas de Sylow.', [
        'Grupos Cíclicos, Grupos de Permutaciones (Sn), Subgrupos Normales y Homomorfismos de Grupos',
        'Teoremas de Isomorfía, Producto Directo/Semidirecto, Ecuación de Clases y Teoremas de Sylow',
      ]),
      syl('MAT-2501', 'Álgebra Abstracta II: Anillos, Cuerpos y Teoría de Galois', '🔶', 'amber', 5, 4, 'Anillos conmutativos, ideales primos y maximales, dominios de factorización única, extensiones de cuerpos y correspondencia de Galois.', [
        'Anillos, Ideales, Anillos Cociente, Dominios Euclidianos, DIP y Dominios de Factorización Única (DFU)',
        'Extensiones Algebraicas y Trascendentes, Cuerpos de Descomposición y Teorema Fundamental de la Teoría de Galois',
      ]),
      syl('MAT-2502', 'Análisis Matemático Real I y II (Medida e Integración de Lebesgue)', '📐', 'emerald', 5, 4, 'Topología de la recta real, sucesiones de Cauchy, convergencia uniforme, espacios métricos y medida e integral de Lebesgue.', [
        'Completitud de R, Compacidad (Heine-Borel), Conexidad y Sucesiones y Series de Funciones (Weierstrass)',
        'Sigma-Álgebras, Medida de Lebesgue, Funciones Medibles y Teoremas de Convergencia Monótona y Dominada',
      ]),
      syl('MAT-2601', 'Topología General y Algebraica', '🍩', 'rose', 6, 4, 'Espacios topológicos, bases, continuidad, compacidad de Tychonoff, axiomas de separación, homotopía y grupo fundamental.', [
        'Espacios Topológicos, Topología Producto y Cociente, Conexidad por Caminos y Compacidad',
        'Axiomas de Separación (Hausdorff, Normal, Lema de Urysohn) y Grupo Fundamental de Poincaré',
      ]),
      syl('MAT-3701', 'Variable Compleja y Análisis Funcional', '🌀', 'blue', 7, 4, 'Funciones holomorfas, ecuaciones de Cauchy-Riemann, teorema de los residuos, espacios de Banach y espacios de Hilbert.', [
        'Funciones Analíticas, Fórmula Integral de Cauchy, Series de Laurent y Cálculo de Residuos',
        'Espacios Normados de Banach, Espacios de Hilbert y Teoremas de Hahn-Banach y Acotación Uniforme',
      ]),
      syl('MAT-3801', 'Geometría Diferencial y Ecuaciones en Derivadas Parciales (EDP)', '🌐', 'purple', 8, 4, 'Curvas y superficies en R3, variedades diferenciables, curvatura gaussiana y ecuaciones de onda, calor y Laplace.', [
        'Teoría Local de Curvas (Frenet-Serret), Primera y Segunda Forma Fundamental y Teorema Egregium de Gauss',
        'EDP Elípticas, Parabólicas e Hiperbólicas, Series de Fourier y Espacios de Sobolev',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_quimica_farmaceutica',
    name: 'Química Farmacéutica',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 170,
    emoji: '💊',
    description: 'Pensum completo PUJ Bogotá: química orgánica y analítica, físico-química farmacéutica, farmacognosia, química medicinal, farmacotécnia industrial, biofarmacia, farmacología y farmacia hospitalaria.',
    subjects: [
      syl('QFA-1101', 'Química General e Inorgánica Farmacéutica', '🧪', 'blue', 1, 4, 'Estructura atómica, enlace químico, estequiometría, equilibrio iónico, complejos de coordinación y bioinorgánica.', [
        'Termodinámica Química, Cinética y Equilibrio Ácido-Base, Precipitación y Oxidorreducción',
        'Química de Coordinación y Compuestos Inorgánicos de Uso Farmacéutico y Diagnóstico',
      ]),
      syl('QFA-1201', 'Química Orgánica I y II (Síntesis y Mecanismos)', '⚗️', 'emerald', 2, 5, 'Estereoquímica, sustitución nucleofílica (SN1/SN2), eliminación, compuestos aromáticos, carbonilos y heterociclos.', [
        'Quiralidad, Enantiómeros, Diastereómeros y Mecanismos de Sustitución (SN1, SN2) y Eliminación (E1, E2)',
        'Sustitución Electrofílica Aromática, Química del Grupo Carbonilo y Heterociclos Farmacológicos',
      ]),
      syl('QFA-2301', 'Química Analítica e Instrumental (HPLC, GC-MS, IR, RMN)', '📊', 'amber', 3, 4, 'Volumetrías, validación de métodos analíticos, espectroscopía UV-Vis, infrarrojo, resonancia magnética nuclear y cromatografía líquida HPLC.', [
        'Equilibrios Químicos Simultáneos, Titulaciones Ácido-Base, Complejométricas y Redox',
        'Cromatografía Líquida de Alta Eficiencia (HPLC), Cromatografía de Gases y Espectrometría de Masas',
        'Elucidación Estructural de Principios Activos mediante FTIR, RMN 1H/13C y Validación Analítica ICH Q2',
      ]),
      syl('QFA-2401', 'Fisicoquímica Farmacéutica y Operaciones Unitarias', '🌡️', 'purple', 4, 4, 'Solubilidad, fenómenos interfaciales, reología, estabilidad cinética de medicamentos (vida útil) y secado/mezclado.', [
        'Solubilidad de Fármacos, Coeficiente de Reparto (Log P), Tensión Superficial y Sistemas Dispersos (Emulsiones, Suspensiones)',
        'Cinética de Degradación Química de Fármacos y Estudios de Estabilidad Acelerada y Natural (ICH Q1A)',
      ]),
      syl('QFA-2501', 'Farmacognosia y Fitoquímica', '🌿', 'emerald', 5, 4, 'Metabolitos secundarios vegetales (alcaloides, flavonoides, terpenos, glicósidos), extracción y control de fitoterapéuticos.', [
        'Rutas Biosintéticas del Ácido Shikímico, Acetato-Malonato y Mevalonato',
        'Extracción, Aislamiento y Estandarización de Alcaloides, Terpenoides y Compuestos Fenólicos Medicinales',
      ]),
      syl('QFA-2601', 'Farmacotécnia y Tecnología Farmacéutica Industrial (Sólidos, Líquidos y Estériles)', '🏭', 'blue', 6, 5, 'Diseño y manufactura bajo BPM de tabletas, cápsulas, recubrimiento, formas líquidas, semisólidas e inyectables liofilizados.', [
        'Preformulación, Granulación Húmeda/Seca, Compresión de Tabletas, Disolución y Recubrimiento Farmacéutico',
        'Formulación de Parenterales de Pequeño y Gran Volumen, Áreas Limpias ISO, Liofilización y Buenas Prácticas de Manufactura (BPM)',
      ]),
      syl('QFA-2701', 'Química Medicinal y Diseño Racional de Fármacos', '🧬', 'rose', 7, 4, 'Relación estructura-actividad (SAR/QSAR), bioisosterismo, acoplamiento molecular (Docking), profármacos y blancos terapéuticos.', [
        'Interacciones Fármaco-Receptor, Regla de Cinco de Lipinski, Optimización de Líderes y Bioisosterismo',
        'Diseño de Fármacos Asistido por Computador (Docking Molecular, Farmacóforos) y Síntesis de Profármacos',
      ]),
      syl('QFA-3801', 'Biofarmacia, Farmacocinética Clínica y Biodisponibilidad', '📈', 'amber', 8, 4, 'Sistema de clasificación biofarmacéutica (BCS), modelos compartimentales, bioequivalencia y monitoreo terapéutico de fármacos.', [
        'Sistema de Clasificación Biofarmacéutica (BCS), Permeabilidad, Disolución In Vitro y Correlación IVIVC',
        'Modelos Farmacocinéticos Monocompartimentales y Bicompartimentales y Estudios de Biodisponibilidad / Bioequivalencia',
      ]),
      syl('QFA-3901', 'Farmacia Clínica, Atención Farmacéutica y Asuntos Regulatorios (INVIMA)', '🏥', 'purple', 9, 5, 'Seguimiento farmacoterapéutico (Método Dáder), farmacovigilancia, tecnovigilancia y registros sanitarios.', [
        'Atención Farmacéutica, Problemas Relacionados con Medicamentos (PRM), Conciliación Medicamentosa y Farmacovigilancia',
        'Legislación Farmacéutica Colombiana, Dossier CTD y Obtención de Registros Sanitarios ante el INVIMA',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_quimica',
    name: 'Química',
    faculty: 'Ciencias',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '⚗️',
    description: 'Pensum completo PUJ Bogotá: química inorgánica avanzada, síntesis orgánica, termodinámica y mecánica cuántica molecular, análisis instrumental, catálisis y química verde.',
    subjects: [
      syl('QUI-1101', 'Química Fundamental y Estequiometría de Precisión', '🧪', 'blue', 1, 4, 'Estructura electrónica, periodicidad, enlace químico (TRPEV, TOM) y equilibrio en solución acuosa.', [
        'Mecánica Cuántica del Átomo, Números Cuánticos y Teoría de Orbitales Moleculares (TOM)',
        'Equilibrios simultáneos en solución, Gravimetría y Volumetría Analítica',
      ]),
      syl('QUI-2301', 'Fisicoquímica I y II (Termodinámica Estadística y Química Cuántica)', '⚛️', 'purple', 4, 4, 'Potenciales termodinámicos, fugacidad, equilibrio de fases, ecuación de Schrödinger molecular y espectroscopía.', [
        'Potencial Químico, Equilibrio de Fases Multicomponente y Termodinámica de Soluciones Reales',
        'Postulados de la Mecánica Cuántica, Aproximación de Born-Oppenheimer y Química Computacional (DFT)',
      ]),
      syl('QUI-2501', 'Síntesis Orgánica Avanzada y Espectroscopía Estructural', '🔬', 'emerald', 5, 4, 'Análisis retrosintético de Corey, reacciones pericíclicas, catálisis organometálica (acoplamientos de Suzuki/Heck) y RMN 2D.', [
        'Desconexiones C-C, Grupos Protectores, Síntesis Asimétrica y Reacciones de Diels-Alder',
        'Espectroscopía RMN Bidimensional (COSY, HSQC, HMBC) y Espectrometría de Masas de Alta Resolución',
      ]),
      syl('QUI-3701', 'Química Inorgánica Avanzada, Catálisis y Materiales', '💎', 'amber', 7, 4, 'Teoría del campo cristalino y de ligantes, organometálicos, catálisis heterogénea y nanotecnología.', [
        'Simetría Molecular, Grupos Puntuales, Teoría del Campo Ligante y Espectros Electrónicos de Complejos d',
        'Química Verde, Catálisis Heterogénea y Síntesis de Nanomateriales Funcionales',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 6. FACULTAD DE CIENCIAS ECONÓMICAS Y ADMINISTRATIVAS (5 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_administracion',
    name: 'Administración de Empresas',
    faculty: 'Ciencias Económicas y Administrativas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '💼',
    description: 'Pensum completo PUJ Bogotá: estrategia corporativa, mercadeo estratégico, finanzas corporativas, gestión del talento humano, operaciones, innovación, emprendimiento y sostenibilidad.',
    subjects: [
      ...TRONCO_CEA_BASICO,
      syl('MAT-1110', 'Cálculo y Álgebra Lineal para Ciencias Económicas', '📐', 'blue', 1, 3, 'Optimización marginal, derivadas parciales, multiplicadores de Lagrange e integrales aplicadas a negocios.', [
        'Ingreso Marginal, Costo Marginal, Elasticidad Puntual y Optimización de Utilidades',
        'Funciones Multivariables, Multiplicadores de Lagrange y Álgebra Matricial de Insumo-Producto',
      ]),
      syl('ADM-1301', 'Costos y Presupuestos Gerenciales', '📊', 'emerald', 3, 3, 'Costeo por órdenes y por procesos, costeo basado en actividades (ABC), punto de equilibrio CVU y presupuesto maestro.', [
        'Elementos del Costo (Materia Prima, Mano de Obra, CIF), Costeo Absorbente vs Variable',
        'Relación Costo-Volumen-Utilidad (Punto de Equilibrio, Margen de Seguridad y Apalancamiento Operativo)',
        'Costeo Basado en Actividades (ABC) y Elaboración del Presupuesto Maestro y de Efectivo',
      ]),
      syl('ADM-2401', 'Gestión del Talento Humano y Comportamiento Organizacional', '👥', 'purple', 4, 3, 'Motivación, liderazgo, clima organizacional, selección por competencias, evaluación de desempeño y legislación laboral.', [
        'Comportamiento Individual y Grupal, Motivación, Liderazgo Transformacional y Cultura Organizacional',
        'Atracción y Selección por Competencias, Compensación Salarial, Evaluación 360° y Derecho Laboral',
      ]),
      syl('ADM-2402', 'Fundamentos y Dirección de Mercadeo (Marketing)', '📣', 'rose', 4, 3, 'Investigación de mercados, comportamiento del consumidor, segmentación, posicionamiento y Marketing Mix (4Ps / 7Ps).', [
        'Comportamiento del Consumidor, Investigación de Mercados Cualitativa y Cuantitativa',
        'Segmentación, Targeting, Posicionamiento (STP) y Propuesta de Valor',
        'Estrategia de Producto, Fijación de Precios (Pricing), Canales Omnicanal y Marketing Digital',
      ]),
      syl('ADM-2501', 'Finanzas Corporativas y Creación de Valor (EVA)', '💰', 'amber', 5, 3, 'Matemáticas financieras, capital de trabajo, estructura de capital (Modigliani-Miller), costo de capital (WACC) y valoración.', [
        'Administración del Capital de Trabajo, Ciclo de Conversión de Efectivo y Análisis Financiero',
        'Riesgo y Rendimiento (CAPM), Costo Promedio Ponderado de Capital (WACC) y Estructura de Capital',
        'Flujo de Caja Libre Descontado (DCF), Valor Económico Agregado (EVA) y Política de Dividendos',
      ]),
      syl('ADM-2601', 'Gerencia de Operaciones y Logística de Servicios', '⚙️', 'blue', 6, 3, 'Capacidad, localización, calidad en servicios (SERVQUAL), cadena de suministro y transformación digital operativa.', [
        'Diseño de Procesos de Manufactura y Servicios, Capacidad, Teoría de Colas y Lean Six Sigma',
        'Planeación de la Demanda, Gestión de Inventarios y Sostenibilidad en la Cadena de Suministro',
      ]),
      syl('ADM-3701', 'Estrategia Competitiva y Gobierno Corporativo', '♟️', 'purple', 7, 3, 'Análisis competitivo de Porter, recursos y capacidades (VRIO), océanos azules, fusiones y adquisiciones y cuadros de mando (Balanced Scorecard).', [
        'Las 5 Fuerzas de Porter, Análisis PESTEL, Cadena de Valor y Ventaja Competitiva Sostenible (VRIO)',
        'Estrategias Corporativas: Integración, Diversificación, Alianzas e Internacionalización',
        'Ejecución Estratégica con Balanced Scorecard (OKRs / KPIs) y Gobierno Corporativo',
      ]),
      syl('ADM-3801', 'Emprendimiento, Innovación y Modelos de Negocio (Lean Startup)', '🚀', 'emerald', 8, 3, 'Design Thinking, Business Model Canvas, validación de hipótesis (MVP), unit economics (CAC/LTV) y levantamiento de capital (Venture Capital).', [
        'Descubrimiento de Clientes, Propuesta de Valor, Business Model Canvas y Producto Mínimo Viable (MVP)',
        'Unit Economics (CAC, LTV, Churn, Burn Rate) y Pitch ante Inversionistas Ángeles y Fondos VC',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_economia',
    name: 'Economía',
    faculty: 'Ciencias Económicas y Administrativas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '📈',
    description: 'Pensum completo PUJ Bogotá: teoría microeconómica y equilibrio general, teoría de juegos, macroeconomía dinámica, econometría de corte transversal y series de tiempo, historia económica y desarrollo.',
    subjects: [
      ...TRONCO_CEA_BASICO,
      syl('ECO-2301', 'Microeconomía Intermedia: Equilibrio General y Bienestar', '⚖️', 'blue', 3, 4, 'Dualidad del consumidor (Slutsky, Hicks, Marshall), incertidumbre (Von Neumann-Morgenstern), caja de Edgeworth y fallas de mercado.', [
        'Demandas Marshallianas y Hicksianas, Ecuación de Slutsky y Variación Compensatoria/Equivalente',
        'Elección bajo Incertidumbre, Aversión al Riesgo (Arrow-Pratt) y Mercados de Seguros',
        'Equilibrio General Walrasiano (Caja de Edgeworth), Primer y Segundo Teorema del Bienestar y Externalidades / Bienes Públicos',
      ]),
      syl('ECO-2401', 'Teoría de Juegos y Economía de la Información (Organización Industrial)', '♟️', 'purple', 4, 4, 'Equilibrio de Nash en estrategias puras y mixtas, juegos dinámicos (perfección en subjuegos), juegos bayesianos, riesgo moral y selección adversa.', [
        'Juegos Estáticos con Información Completa, Equilibrio de Nash y Oligopolio (Cournot, Bertrand, Stackelberg)',
        'Juegos Dinámicos, Inducción hacia Atrás, Juegos Repetidos (Teorema Folk) y Colusión Tácita',
        'Información Asimétrica: Equilibrio Bayesiano de Nash, Selección Adversa (Akerlof), Señalización (Spence) y Problema Principal-Agente',
      ]),
      syl('ECO-2402', 'Macroeconomía Intermedia y Crecimiento Económico', '🌐', 'amber', 4, 4, 'Expectativas racionales, curva de Phillips Novo-Keynesiana, consumo intertemporal y modelos de crecimiento de Solow-Swan y Romer.', [
        'Microfundamentos del Consumo (Hipótesis del Ingreso Permanente de Friedman y Ciclo de Vida de Modigliani) e Inversión (Q de Tobin)',
        'Oferta Agregada, Expectativas Racionales (Lucas) y Modelo Nuevo Keynesiano de 3 Ecuaciones (IS Dinámica, Curva de Phillips, Regla de Taylor)',
        'Modelos de Crecimiento Económico Exógeno (Solow-Swan, Regla de Oro) y Endógeno (AK, Romer, Capital Humano)',
      ]),
      syl('ECO-2501', 'Econometría I (Corte Transversal y Datos Panel)', '📊', 'emerald', 5, 4, 'Mínimos cuadrados ordinarios (MCO), teorema de Gauss-Markov, heterocedasticidad, endogeneidad, variables instrumentales (MC2E) y datos panel.', [
        'Modelo Lineal Clásico, Álgebra de MCO, Teorema de Gauss-Markov y Pruebas de Hipótesis (t, F, Wald)',
        'Violación de Supuestos: Multicolinealidad, Heterocedasticidad (White, Breusch-Pagan) y Errores Estándar Robustos',
        'Endogeneidad, Variables Instrumentales (MC2E), Efectos Fijos, Efectos Aleatorios (Test de Hausman) y Modelos Logit/Probit',
      ]),
      syl('ECO-2601', 'Econometría II (Series de Tiempo y Evaluación de Impacto)', '📉', 'rose', 6, 4, 'Procesos estacionarios ARMA/ARIMA, raíces unitarias (Dickey-Fuller), vectores autorregresivos (VAR), cointegración e inferencia causal.', [
        'Estacionariedad, Función de Autocorrelación, Modelos ARIMA, Volatilidad ARCH/GARCH y Pronóstico',
        'Raíz Unitaria (ADF), Cointegración de Engle-Granger/Johansen y Vectores Autorregresivos (VAR / Impulso-Respuesta)',
        'Inferencia Causal y Evaluación de Impacto: Diferencias en Diferencias (DiD), Regresión Discontinua (RDD) y Propensity Score Matching',
      ]),
      syl('ECO-3701', 'Comercio Internacional y Finanzas Internacionales', '🚢', 'blue', 7, 3, 'Ventaja comparativa (Ricardo), modelo Heckscher-Ohlin, nueva teoría del comercio (Krugman), aranceles y regímenes cambiarios.', [
        'Modelos Ricardiano, Factores Específicos y Heckscher-Ohlin-Samuelson (Teorema de Stolper-Samuelson)',
        'Economías de Escala, Firmas Heterogéneas (Melitz), Política Comercial y Paridad del Poder Adquisitivo / Tasas de Interés (UIP)',
      ]),
      syl('ECO-3801', 'Historia Económica de Colombia, Economía Pública y Desarrollo', '🏛️', 'amber', 8, 4, 'Hacienda pública, tributación óptima, descentralización fiscal, pobreza multidimensional, desigualdad (Gini) y desarrollo económico colombiano.', [
        'Economía del Sector Público: Tributación Óptima (Ramsey), Gasto Público Social, Regla Fiscal y Sistema General de Participaciones',
        'Historia Económica de Colombia (Siglos XIX-XXI), Café, Industrialización, Apertura y Pobreza / Desigualdad',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_contaduria',
    name: 'Contaduría Pública',
    faculty: 'Ciencias Económicas y Administrativas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 142,
    emoji: '🧾',
    description: 'Pensum completo PUJ Bogotá: estándares internacionales NIIF/IFRS plenas, contabilidad de grupos empresariales, costos estratégicos, tributación colombiana e internacional, auditoría NIA y revisoría fiscal.',
    subjects: [
      ...TRONCO_CEA_BASICO,
      syl('CON-1201', 'Contabilidad Intermedia: Activos y Pasivos bajo NIIF/IFRS', '📘', 'blue', 2, 3, 'Reconocimiento, medición inicial y posterior de inventarios (NIC 2), propiedad planta y equipo (NIC 16), intangibles (NIC 38), arrendamientos (NIIF 16) e instrumentos financieros (NIIF 9).', [
        'Valor Razonable (NIIF 13), Inventarios (NIC 2), Propiedades, Planta y Equipo (NIC 16) y Deterioro del Valor (NIC 36)',
        'Arrendamientos (NIIF 16), Activos Intangibles (NIC 38), Provisiones y Contingencias (NIC 37) e Ingresos de Actividades Ordinarias (NIIF 15)',
      ]),
      syl('CON-2301', 'Contabilidad Avanzada: Grupos Empresariales, Consolidación y Fusiones', '🏢', 'purple', 3, 3, 'Combinaciones de negocios (NIIF 3), método de participación patrimonial, consolidación de estados financieros (NIIF 10) y conversión en moneda extranjera (NIC 21).', [
        'Inversiones en Asociadas (NIC 28), Negocios Conjuntos (NIIF 11) y Combinaciones de Negocios / Plusvalía (NIIF 3)',
        'Consolidación de Estados Financieros Matriz-Subordinadas (NIIF 10) y Eliminación de Operaciones Intercompañía',
      ]),
      syl('CON-2401', 'Tributación I: Impuesto sobre la Renta y Complementarios (Personas Jurídicas y Naturales)', '🏛️', 'amber', 4, 3, 'Derecho tributario sustancial, depuración de la renta ordinaria, sistema cedular, ganancias ocasionales e impuesto diferido (NIC 12).', [
        'Principios Constitucionales Tributarios, Residencia Fiscal, Ingresos, Costos y Deducciones Fiscales en Colombia',
        'Renta Líquida, Descuentos Tributarios, Sistema Cedular de Personas Naturales y Conciliación Contable-Fiscal (Impuesto Diferido NIC 12)',
      ]),
      syl('CON-2501', 'Tributación II: IVA, Retención en la Fuente, ICA, Procedimiento Tributario y Precios de Transferencia', '⚖️', 'rose', 5, 3, 'Impuesto a las ventas (IVA), impoconsumo, tributos territoriales, actuaciones ante la DIAN, régimen sancionatorio y convenios de doble imposición.', [
        'Hecho Generador y Liquidación de IVA, Retención en la Fuente e Impuesto de Industria y Comercio (ICA)',
        'Procedimiento Tributario ante la DIAN, Sanciones, Fiscalización y Tributación Internacional (OCDE / BEPS)',
      ]),
      syl('CON-2601', 'Auditoría Financiera y Aseguramiento de la Información (Normas NIA/ISA)', '🔍', 'emerald', 6, 3, 'Planeación de auditoría basada en riesgos (NIA 315), control interno (COSO), muestreo de auditoría, evidencia y dictamen del auditor independiente (NIA 700).', [
        'Código de Ética IFAC, Independencia, Escepticismo Profesional y Evaluación del Control Interno bajo Marco COSO',
        'Materialidad (NIA 320), Procedimientos Sustantivos, Pruebas de Controles y Opinión del Auditor (Limpia, Con Salvedades, Adversa, Abstención)',
      ]),
      syl('CON-3701', 'Revisoría Fiscal, Gobierno Corporativo y Auditoría Forense', '🛡️', 'blue', 7, 3, 'Institución de la revisoría fiscal en Colombia, fe pública, detección de lavado de activos (SARLAFT), fraude corporativo e informes integrados ESG.', [
        'Funciones Legales del Revisor Fiscal (Código de Comercio y Ley 43 de 1990), Fiscalización Integral y Dictamen',
        'Auditoría Forense, Triángulo del Fraude, Prevención de Lavado de Activos (SARLAFT/SAGRILAFT) y Reportes de Sostenibilidad (NIIF S1/S2)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_finanzas',
    name: 'Finanzas',
    faculty: 'Ciencias Económicas y Administrativas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '💹',
    description: 'Pensum completo PUJ Bogotá: mercado de capitales, renta fija, renta variable, derivados financieros, gestión de portafolios, banca de inversión, valoración de empresas, riesgos (VaR) y Fintech.',
    subjects: [
      ...TRONCO_CEA_BASICO,
      syl('FIN-1201', 'Matemáticas Financieras y Análisis de Inversión', '🧮', 'emerald', 2, 3, 'Equivalencia financiera, amortización de créditos, bonos, estructura temporal de tasas de interés y evaluación financiera de proyectos.', [
        'Tasas de Interés Equivalentes, Sistemas de Amortización (Francés, Alemán, UVR) y Gradientes',
        'Modelado Financiero en Excel/Python de Flujos de Caja y Sensibilidad Monte Carlo',
      ]),
      syl('FIN-2301', 'Mercados Financieros, Renta Fija y Renta Variable', '🏛️', 'blue', 3, 3, 'BVC y mercados globales, valoración de bonos (TES), duración y convexidad de Macaulay, valoración de acciones por múltiplos y dividendos.', [
        'Valoración de Títulos de Renta Fija, Curva Cero Cupón, Duración Modificada, Convexidad e Inmunización',
        'Mercado Accionario, Índices Bursátiles (MSCI COLCAP, S&P 500), Modelo de Gordon-Shapiro y Múltiplos (EV/EBITDA, P/E)',
      ]),
      syl('FIN-2401', 'Teoría de Portafolios y Valoración de Activos (Asset Pricing)', '📊', 'purple', 4, 3, 'Frontera eficiente de Markowitz, modelo CAPM, modelo multifactorial de Fama-French, arbitraje APT y atribución de desempeño (Sharpe, Treynor, Alfa de Jensen).', [
        'Optimización Media-Varianza de Markowitz, Diversificación y Línea del Mercado de Capitales (CML)',
        'Equilibrio CAPM, Beta Apalancada/Desapalancada, Factores de Fama-French y Evaluación de Fondos de Inversión',
      ]),
      syl('FIN-2501', 'Derivados Financieros e Ingeniería Financiera (Futuros, Swaps y Opciones)', '⚡', 'amber', 5, 4, 'Contratos Forward y Futuros, cobertura con TRM y tasas, Swaps de tasas de interés (IRS) y monedas, árboles binomiales y modelo de Black-Scholes-Merton.', [
        'Valoración y Estrategias de Cobertura (Hedging) con Forwards y Futuros sobre Divisas, Índices y Commodities',
        'Estructuración y Valoración de Swaps de Tasa de Interés (IBR/SOFR) y Cross-Currency Swaps',
        'Opciones Financieras (Call/Put), Paridad Put-Call, Modelo de Black-Scholes-Merton y Letras Griegas (Delta, Gamma, Vega, Theta)',
      ]),
      syl('FIN-2601', 'Valoración de Empresas, Fusiones y Adquisiciones (Banca de Inversión)', '🏢', 'rose', 6, 4, 'Modelado financiero avanzado de 3 estados, DCF, APV, transacciones comparables, LBOs y procesos de M&A.', [
        'Proyección Integrada de Estados Financieros, WACC Dinámico, Valor Terminal y Valoración por Flujo de Caja Descontado (DCF)',
        'Estructuración de Fusiones y Adquisiciones (M&A), Sinergias, Compras Apalancadas (LBO) y Project Finance',
      ]),
      syl('FIN-3701', 'Gestión Cuantitativa de Riesgos Financieros (Mercado, Crédito y Liquidez)', '🛡️', 'blue', 7, 4, 'Valor en Riesgo (VaR paramétrico, histórico y Monte Carlo), Expected Shortfall, scoring de crédito (PD, LGD, EAD) y Basilea III.', [
        'Riesgo de Mercado: Valor en Riesgo (VaR), Expected Shortfall (CVaR), Backtesting y Pruebas de Estrés (Stress Testing)',
        'Riesgo de Crédito (Modelos Logit, Merton, Matriz de Transición, Pérdida Esperada) y Acuerdos de Capital de Basilea III',
      ]),
      syl('FIN-3801', 'Finanzas Cuantitativas, Trading Algorítmico y Fintech', '🤖', 'emerald', 8, 3, 'Cálculo estocástico (movimiento browniano, Lema de Itô), trading algorítmico en Python, blockchain y finanzas sostenibles (Bonos Verdes).', [
        'Procesos de Wiener, Lema de Itô y Simulación Estocástica de Precios de Activos',
        'Estrategias de Trading Cuantitativo, Backtesting en Python, DeFi y Finanzas Sostenibles (ESG)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_negocios_internacionales',
    name: 'Negocios Internacionales',
    faculty: 'Ciencias Económicas y Administrativas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🌍',
    description: 'Pensum completo PUJ Bogotá: comercio exterior, régimen aduanero, logística global e Incoterms, estrategia de internacionalización, negociación intercultural, finanzas internacionales e integración económica.',
    subjects: [
      ...TRONCO_CEA_BASICO,
      syl('NIN-1201', 'Entorno Global de los Negocios y Geopolítica Económica', '🌐', 'blue', 2, 3, 'Globalización, instituciones multilaterales (OMC, FMI, Banco Mundial, OCDE), bloques regionales y riesgo país.', [
        'Sistema Multilateral de Comercio (OMC), Acuerdos Comerciales (TLCs de Colombia) e Integración Regional',
        'Análisis de Riesgo Político, Económico y Cultural en Mercados Internacionales',
      ]),
      syl('NIN-2301', 'Operaciones de Comercio Exterior, Aduanas y Aranceles', '🚢', 'amber', 3, 3, 'Clasificación arancelaria (Sistema Armonizado), valoración en aduana, regímenes de importación/exportación, zonas francas y medios de pago internacional.', [
        'Nomenclatura Arancelaria Nandina, Reglas de Origen y Liquidación de Tributos Aduaneros',
        'Procedimientos de Importación, Exportación, Zonas Francas y Medios de Pago (Cartas de Crédito UCP 600, Cobranzas Documentarias)',
      ]),
      syl('NIN-2401', 'Logística Internacional, Transporte Multimodal e Incoterms 2020', '✈️', 'emerald', 4, 3, 'Términos Incoterms 2020 (ICC), fletes marítimos y aéreos, cubicaje, contenedores, seguros de carga y distribución física internacional (DFI).', [
        'Aplicación Práctica y Matriz de Costos/Riesgos de los 11 Incoterms® 2020',
        'Cubicaje de Carga, Contenedorización, Tarifas Marítimas/Aéreas y Costeo de la Distribución Física Internacional (DFI)',
      ]),
      syl('NIN-2501', 'Estrategia de Internacionalización de Empresas y Multinacionales', '🏢', 'purple', 5, 3, 'Paradigma ecléctico OLI de Dunning, modelo Uppsala, modos de entrada (exportación, franquicias, Joint Ventures, IED) y cadenas globales de valor.', [
        'Teorías de Internacionalización (Dunning OLI, Uppsala, Born Globals) y Selección de Mercados Internacionales',
        'Modos de Entrada: Licencias, Franquicias, Alianzas Estratégicas, Joint Ventures e Inversión Extranjera Directa (Greenfield vs M&A)',
      ]),
      syl('NIN-2601', 'Marketing Internacional y Negociación Intercultural', '🤝', 'rose', 6, 3, 'Adaptación vs estandarización global, dimensiones culturales de Hofstede y Trompenaars, protocolo de negociación internacional (Método Harvard).', [
        'Dimensiones Culturales (Hofstede, Hall, Meyer) e Inteligencia Cultural (CQ) en Negocios Globales',
        'Estrategia de Producto, Marca y Precio Internacional y Negociación Integrativa Multicultural',
      ]),
      syl('NIN-3701', 'Finanzas Internacionales y Gestión del Riesgo Cambiario', '💱', 'blue', 7, 3, 'Mercado Forex, arbitraje triangular, paridad descubierta y cubierta de tasas de interés y cobertura de exposición cambiaria.', [
        'Mercado de Divisas (Spot y Forward), Paridad de Tasas de Interés y Paridad del Poder Adquisitivo',
        'Gestión de la Exposición Transaccional, Operativa y Contable mediante Derivados Cambiarios',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 7. FACULTAD DE CIENCIAS JURÍDICAS (1 PREGRADO - 10 SEMESTRES)
  // --------------------------------------------------------------------------
  {
    id: 'puj_derecho',
    name: 'Derecho',
    faculty: 'Ciencias Jurídicas',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 174,
    emoji: '⚖️',
    description: 'Pensum completo PUJ Bogotá (Semestres 1 a 10): derecho romano, constitucional, civil (personas, bienes, obligaciones, contratos, familia, sucesiones), penal, administrativo, laboral, comercial, procesal, internacional y consultorio jurídico.',
    subjects: [
      syl('DER-1101', 'Teoría General del Derecho, Introducción al Derecho y Derecho Romano', '🏛️', 'amber', 1, 5, 'Fuentes del derecho, norma jurídica (Kelsen, Hart, Dworkin), interpretación jurídica e instituciones del Derecho Romano clásico.', [
        'Validez, Vigencia y Eficacia de la Norma Jurídica, Positivismo vs Iusnaturalismo y Ponderación (Alexy)',
        'Instituciones de Derecho Romano: Personas, Derechos Reales, Obligaciones y Acciones de la Ley',
      ]),
      syl('DER-1102', 'Derecho Constitucional Colombiano I y II (Orgánico y Dogmático)', '📜', 'blue', 1, 5, 'Teoría de la Constitución, bloque de constitucionalidad, derechos fundamentales, control de constitucionalidad y acción de tutela.', [
        'Poder Constituyente, Estado Social de Derecho, Bloque de Constitucionalidad y Precedente Judicial',
        'Ramas del Poder Público, Trámite Legislativo y Control Abstracto y Concreto de Constitucionalidad (Tutela)',
      ]),
      syl('DER-1201', 'Derecho Civil I y II: Personas, Familia y Bienes (Derechos Reales)', '👨‍👩‍👧', 'emerald', 2, 5, 'Atributos de la personalidad, negocio jurídico, matrimonio, unión marital de hecho, patrimonio, posesión, dominio, servidumbres y prescripción.', [
        'Atributos de la Personalidad, Capacidad Legal (Ley 1996 de 2019), Matrimonio y Sociedad Conyugal / Patrimonial',
        'Bienes Muebles e Inmuebles, Título y Modo, Tradición, Posesión, Usucapión (Prescripción Adquisitiva) y Acciones Reales',
      ]),
      syl('DER-2301', 'Derecho Penal General y Especial (Teoría del Delito)', '🚔', 'rose', 3, 5, 'Principios rectores del derecho penal, acción, tipicidad, antijuridicidad, culpabilidad, autoría y participación, y delitos en particular.', [
        'Imputación Objetiva, Dolo, Culpa, Preterintención, Causales de Ausencia de Responsabilidad (Artículo 32 CP) y Tentativa',
        'Delitos contra la Vida, el Patrimonio Económico, la Administración Pública y el Orden Económico y Social',
      ]),
      syl('DER-2401', 'Derecho Civil III: Teoría General de las Obligaciones y Responsabilidad Civil', '📑', 'purple', 4, 5, 'Fuentes de las obligaciones, clasificación, efectos, transmisión, modos de extinguirse las obligaciones y responsabilidad civil contractual y extracontractual.', [
        'Obligaciones Civiles y Naturales, Solidarias, Divisibles/Indivisibles, Mora, Pago, Novación, Compensación y Prescripción',
        'Elementos de la Responsabilidad Civil: Daño Indemnizable (Patrimonial y Extrapatrimonial), Culpa/Riesgo y Nexo Causal',
      ]),
      syl('DER-2501', 'Derecho Civil IV y Comercial: Contratos Civiles, Mercantiles y Sociedades', '🤝', 'blue', 5, 5, 'Compraventa, arrendamiento, mandato, mutuo, prenda, hipoteca, actos de comercio, títulos valores y derecho societario (SAS, S.A.).', [
        'Contratos Civiles y Mercantiles: Compraventa, Permuta, Arrendamiento, Mandato, Fiducia, Leasing y Factoring',
        'Derecho Societario: Constitución, Órganos Sociales, Responsabilidad de Administradores (SAS, S.A.) y Títulos Valores (Letra, Pagaré, Cheque)',
      ]),
      syl('DER-2601', 'Derecho Administrativo General, Colombiano y Contratación Estatal', '🏢', 'amber', 6, 5, 'Acto administrativo, silencio administrativo, función pública, medios de control (CPACA - Ley 1437) y Estatuto de Contratación Estatal (Ley 80 / Ley 1150).', [
        'Teoría del Acto Administrativo: Elementos, Presunción de Legalidad, Revocatoria Directa y Vía Gubernativa',
        'Medios de Control Contencioso Administrativos (Nulidad, Nulidad y Restablecimiento, Reparación Directa) y Licitación Pública',
      ]),
      syl('DER-2701', 'Derecho Laboral Individual, Colectivo y de la Seguridad Social', '👷', 'emerald', 7, 5, 'Contrato de trabajo (primacía de la realidad), salarios, prestaciones sociales, indemnizaciones, sindicatos, negociación colectiva y pensiones/salud.', [
        'Elementos del Contrato de Trabajo, Modalidades, Jornada, Liquidación de Prestaciones Sociales y Despido sin Justa Causa',
        'Derecho Colectivo (Fuero Sindical, Huelga, Convención Colectiva) y Sistema Integral de Seguridad Social (Pensiones, Salud y ARL)',
      ]),
      syl('DER-2801', 'Teoría General del Proceso, Código General del Proceso (CGP) y Procesal Penal (SPOA)', '🔨', 'purple', 8, 6, 'Jurisdicción, competencia, derecho de acción, pruebas judiciales, procesos declarativos, ejecutivos y sistema penal oral acusatorio (Ley 906).', [
        'Principios del Código General del Proceso (CGP), Demanda, Contestación, Excepciones, Régimen Probatorio y Recursos',
        'Procesos Declarativos, Ejecutivos y Etapas del Sistema Penal Acusatorio (Imputación, Acusación, Preparatoria y Juicio Oral)',
      ]),
      syl('DER-3901', 'Derecho Internacional Público, Derechos Humanos (SIDH), Sucesiones y Consultorio Jurídico I y II', '🌎', 'rose', 9, 8, 'Tratados internacionales, Sistema Interamericano de Derechos Humanos, DIH, sucesión por causa de muerte y práctica litigiosa en Consultorio Jurídico.', [
        'Fuentes del Derecho Internacional (Convención de Viena), Responsabilidad Internacional del Estado y Corte IDH',
        'Sucesión Testada e Intestada, Asignaciones Forzosas (Legítimas y Mejoras) y Práctica Forense en Consultorio Jurídico y Centro de Conciliación',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 8. FACULTAD DE CIENCIAS POLÍTICAS Y RELACIONES INTERNACIONALES (2 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_ciencia_politica',
    name: 'Ciencia Política',
    faculty: 'Ciencias Políticas y Relaciones Internacionales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🗳️',
    description: 'Pensum completo PUJ Bogotá: teoría y filosofía política, sistemas políticos comparados, partidos y elecciones, políticas públicas, gobierno y gestión pública, conflicto armado y construcción de paz.',
    subjects: [
      syl('CPO-1101', 'Teoría Política Clásica, Moderna y Contemporánea', '🏛️', 'blue', 1, 3, 'Platón, Aristóteles, Maquiavelo, contractualismo (Hobbes, Locke, Rousseau), Marx, Rawls, Habermas y teorías de la democracia.', [
        'Pensamiento Político Antiguo y Moderno: Soberanía, Estado Moderno y Contrato Social',
        'Teorías de la Justicia (John Rawls), Democracia Deliberativa (Habermas), Republicanismo y Biopolítica',
      ]),
      syl('CPO-1201', 'Sistema Político Colombiano e Instituciones', '🇨🇴', 'amber', 2, 3, 'Régimen presidencialista en Colombia, Congreso, relaciones ejecutivo-legislativo, descentralización territorial y clientelismo.', [
        'Formación del Estado Colombiano, Bipartidismo, Frente Nacional y Constitución de 1991',
        'Diseño Institucional, Trámite Legislativo, Corte Constitucional y Gobernanza Territorial (Departamentos y Municipios)',
      ]),
      syl('CPO-2301', 'Política Comparada y Regímenes Políticos', '🌍', 'purple', 3, 3, 'Método comparado, parlamentarismo vs presidencialismo, democratización, autoritarismos competitivos y sistemas políticos en América Latina.', [
        'Institucionalismo (Histórico, Elección Racional, Sociológico) y Tipologías de Regímenes Democráticos y Autoritarios',
        'Transiciones a la Democracia, Calidad de la Democracia y Populismos en América Latina y Europa',
      ]),
      syl('CPO-2401', 'Partidos Políticos, Sistemas Electorales y Comportamiento Electoral', '🗳️', 'emerald', 4, 3, 'Leyes de Duverger, fórmulas electorales (D’Hondt, cifra repartidora), financiación de campañas, opinión pública y comunicación política.', [
        'Sistemas de Partidos (Sartori), Sistemas Electorales Mayoritarios y Proporcionales y Reforma Política',
        'Comportamiento del Votante, Encuestas de Opinión Pública, Marketing Político y Campañas Electorales',
      ]),
      syl('CPO-2501', 'Análisis, Diseño y Evaluación de Políticas Públicas', '📋', 'blue', 5, 4, 'Ciclo de las políticas públicas (agenda, formulación, implementación, evaluación), enfoque de marcos (Advocacy Coalitions) y presupuestos públicos.', [
        'Estructuración de Problemas Públicos, Agendamiento (Kingdon) y Diseño de Instrumentos de Política Pública',
        'Modelos de Implementación (Top-Down, Bottom-Up) y Evaluación de Resultados e Impacto de Políticas Públicas',
      ]),
      syl('CPO-2601', 'Estudios de Paz, Conflicto Armado y Justicia Transicional', '🕊️', 'rose', 6, 3, 'Sociología de la violencia en Colombia, actores del conflicto, negociaciones de paz, DDR, JEP y construcción de paz territorial.', [
        'Orígenes y Dinámicas del Conflicto Armado en Colombia, Economía Política de la Guerra y Víctimas',
        'Negociación de Conflictos, Acuerdo Final de Paz, Justicia Transicional (Verdad, Justicia, Reparación y No Repetición)',
      ]),
      syl('CPO-3701', 'Métodos Cuantitativos y Cualitativos para la Investigación Política', '📊', 'amber', 7, 3, 'Diseño de investigación en ciencia política, econometría aplicada en R, análisis de redes políticas, etnografía política y QCA.', [
        'Inferencia Causal en Ciencia Política, Modelos de Regresión Logística/Multinomial y Análisis de Texto Automatizado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_relaciones_internacionales',
    name: 'Relaciones Internacionales',
    faculty: 'Ciencias Políticas y Relaciones Internacionales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🌐',
    description: 'Pensum completo PUJ Bogotá: teorías de las RR.II., historia internacional, seguridad y defensa global, economía política internacional, política exterior colombiana, diplomacia, cooperación y estudios regionales.',
    subjects: [
      syl('RII-1101', 'Teorías de las Relaciones Internacionales (Clásicas y Críticas)', '🌐', 'blue', 1, 3, 'Realismo clásico y estructural (Morgenthau, Waltz), liberalismo institucional (Keohane, Nye), constructivismo (Wendt), escuela inglesa y poscolonialismo.', [
        'Anarquía Internacional, Equilibrio de Poder y Dilema de Seguridad en el Realismo y Neorrealismo',
        'Interdependencia Compleja, Regímenes Internacionales, Constructivismo Social y Teorías del Sur Global',
      ]),
      syl('RII-1201', 'Historia de las Relaciones Internacionales (Westfalia al Siglo XXI)', '📜', 'amber', 2, 3, 'Paz de Westfalia, concierto europeo, guerras mundiales, Guerra Fría, orden unipolar y transición hacia la multipolaridad.', [
        'Orden Westfaliano, Imperialismo, Primera y Segunda Guerra Mundial y Sistema de Bretton Woods / ONU',
        'Guerra Fría, Descolonización de Asia y África y Reconfiguración Geopolítica del Siglo XXI',
      ]),
      syl('RII-2301', 'Economía Política Internacional (EPI)', '💹', 'emerald', 3, 3, 'Comercio global, arquitectura financiera internacional, deuda soberana, cadenas globales de suministro y transición energética.', [
        'Mercantilismo, Liberalismo Económico y Estructuralismo en la Economía Política Global',
        'Gobernanza Financiera (FMI, Banco Mundial), Guerra Tecnológica y Geoeconomía de los Recursos Estratégicos',
      ]),
      syl('RII-2401', 'Seguridad Internacional, Geopolítica y Estudios Estratégicos', '🛡️', 'rose', 4, 3, 'Escuela de Copenhague (securitización), guerras híbridas, ciberseguridad, terrorismo transnacional, crimen organizado y proliferación nuclear.', [
        'Estudios Críticos de Seguridad, Teoría de la Securitización (Buzan & Wæver) y Seguridad Humana',
        'Conflictos Asimétricos, Guerra Híbrida, Ciberdefensa y Crimen Transnacional Organizado',
      ]),
      syl('RII-2501', 'Política Exterior Colombiana y Diplomacia / Negociación Internacional', '🇨🇴', 'purple', 5, 3, 'Doctrinas de política exterior de Colombia (Respice Polum / Respice Similia), servicio exterior, protocolo diplomático y negociación multilateral.', [
        'Evolución Histórica y Toma de Decisiones en la Política Exterior de Colombia (Relaciones con EE. UU., Vecinos y Cuenca del Pacífico)',
        'Derecho Diplomático y Consular (Convenciones de Viena), Negociación Multilateral y Diplomacia Pública',
      ]),
      syl('RII-2601', 'Organizaciones Internacionales, Derecho Internacional y Cooperación al Desarrollo', '🤝', 'blue', 6, 3, 'Sistema de Naciones Unidas, Consejo de Seguridad, OEA, formulación de proyectos de cooperación internacional (Marco Lógico) y Agenda 2030 (ODS).', [
        'Arquitectura Institucional de la ONU, OEA, Unión Europea y Gobernanza Ambiental Global (COP)',
        'Cooperación Internacional para el Desarrollo (Ayuda Oficial, Cooperación Sur-Sur) y Metodología de Marco Lógico',
      ]),
      syl('RII-3701', 'Estudios Regionales: Asia-Pacífico, Medio Oriente, Europa, Norteamérica y América Latina', '🗺️', 'emerald', 7, 4, 'Ascenso de China e Indo-Pacífico, dinámicas geopolíticas de Medio Oriente, integración europea y regionalismo latinoamericano.', [
        'Geopolítica del Indo-Pacífico (China, India, ASEAN), Medio Oriente Contemporáneo y Relaciones Transatlánticas',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 9. FACULTAD DE PSICOLOGÍA (1 PREGRADO - 10 SEMESTRES)
  // --------------------------------------------------------------------------
  {
    id: 'puj_psicologia',
    name: 'Psicología',
    faculty: 'Psicología',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 166,
    emoji: '🧠',
    description: 'Pensum completo PUJ Bogotá: neuropsicología, procesos psicológicos básicos, desarrollo del ciclo vital, psicometría, psicopatología, psicología clínica (cognitivo-conductual, sistémica, psicoanalítica), educativa, organizacional y social.',
    subjects: [
      syl('PSI-1101', 'Historia y Epistemología de la Psicología', '🏛️', 'purple', 1, 3, 'Orígenes filosóficos y fisiológicos, estructuralismo, funcionalismo, conductismo, Gestalt, psicoanálisis, humanismo y revolución cognitiva.', [
        'Fundación de la Psicología Experimental (Wundt, James) y Debate Epistemológico Explicación vs Comprensión',
        'Paradigmas Contemporáneos: Conductismo Radical, Psicología Cognitiva, Psicoanálisis y Enfoque Sistémico-Relacional',
      ]),
      syl('PSI-1102', 'Psicobiología y Neurociencias del Comportamiento', '🧬', 'emerald', 1, 4, 'Neurofisiología sináptica, neurotransmisores, neuroanatomía funcional de la emoción, memoria, lenguaje y funciones ejecutivas.', [
        'Transmisión Sináptica (Dopamina, Serotonina, GABA, Glutamato) y Plasticidad Neural',
        'Circuitos Cortico-Subcorticales de la Atención, Memoria (Hipocampo), Emoción (Amígdala) y Corteza Prefrontal',
      ]),
      syl('PSI-1201', 'Procesos Psicológicos Básicos y Superiores (Sensación, Percepción, Aprendizaje, Cognición)', '👁️', 'blue', 2, 4, 'Psicofísica, condicionamiento clásico y operante, memoria de trabajo y episódica, pensamiento, lenguaje, motivación y emoción.', [
        'Condicionamiento Clásico (Pavlov) y Operante (Skinner: Programas de Reforzamiento y Control de Estímulos)',
        'Modelos de Atención, Memoria (Baddeley, Tulving), Toma de Decisiones (Heurísticos de Kahneman) y Regulación Emocional',
      ]),
      syl('PSI-2301', 'Psicología del Desarrollo Humano (Infancia, Adolescencia, Adultez y Vejez)', '👶', 'amber', 3, 4, 'Teorías de Piaget, Vygotsky, Bowlby (apego) y Erikson; desarrollo cognitivo, socioafectivo y moral a lo largo del ciclo vital.', [
        'Desarrollo Prenatal y Primera Infancia: Teoría del Apego (Bowlby/Ainsworth), Desarrollo Sensoriomotor y Adquisición del Lenguaje',
        'Operaciones Concretas y Formales (Piaget), Mediación Sociocultural (Vygotsky), Identidad en la Adolescencia y Envejecimiento',
      ]),
      syl('PSI-2401', 'Psicometría, Medición y Evaluación Psicológica', '📏', 'blue', 4, 4, 'Teoría Clásica de los Tests (TCT), Teoría de Respuesta al Ítem (TRI), confiabilidad, validez, baremación y aplicación ética de pruebas.', [
        'Confiabilidad (Alfa de Cronbach, Omega de McDonald) y Evidencias de Validez (Contenido, Criterio y Constructo / Análisis Factorial)',
        'Administración, Calificación e Interpretación de Escalas de Inteligencia (WISC/WAIS), Personalidad y Pruebas Neuropsicológicas',
      ]),
      syl('PSI-2501', 'Psicopatología y Semiología Psiquiátrica (DSM-5-TR / CIE-11)', '🩺', 'rose', 5, 4, 'Examen mental, trastornos del neurodesarrollo, afectivos, de ansiedad, trauma, espectro de la esquizofrenia y trastornos de la personalidad.', [
        'Semiología de las Funciones Mentales y Formulación Transdiagnóstica vs Categorial (DSM-5-TR / CIE-11)',
        'Criterios Diagnósticos y Etiología de Trastornos Depresivos, Bipolares, Ansiedad, TOC, TEPT y Trastornos de la Personalidad',
      ]),
      syl('PSI-2601', 'Psicología Clínica y de la Salud (Modelos de Intervención Psicoterapéutica)', '🛋️', 'purple', 6, 5, 'Entrevista clínica, formulación de caso, terapias cognitivo-conductuales (TCC y tercera generación ACT/DBT), terapia sistémica familiar y psicodinámica.', [
        'Habilidades Terapéuticas, Alianza de Trabajo y Formulación Clínica de Caso (Análisis Funcional y Cognitivo)',
        'Técnicas de Reestructuración Cognitiva, Exposición, Terapia de Aceptación y Compromiso (ACT) e Intervención Sistémica',
      ]),
      syl('PSI-2701', 'Psicología Social, Comunitaria y Política', '🤝', 'emerald', 7, 4, 'Cognición social, actitudes, prejuicio, identidad social (Tajfel), influencia social, intervención comunitaria (Fals Borda, Martín-Baró) y acompañamiento psicosocial.', [
        'Representaciones Sociales, Influencia Social, Conformidad, Polarización y Psicología de la Liberación (Martín-Baró)',
        'Investigación-Acción Participativa (IAP), Redes de Apoyo y Atención Psicosocial a Víctimas del Conflicto',
      ]),
      syl('PSI-2801', 'Psicología Educativa y Psicología Organizacional / del Trabajo', '🏫', 'amber', 8, 5, 'Procesos de enseñanza-aprendizaje, inclusión educativa, orientación vocacional, selección por competencias, clima laboral y riesgos psicosociales.', [
        'Diseño Universal para el Aprendizaje (DUA), Dificultades del Aprendizaje y Convivencia Escolar',
        'Atracción del Talento, Assessment Center, Batería de Riesgo Psicosocial y Bienestar Organizacional',
      ]),
      syl('PSI-3901', 'Prácticas Profesionales en Psicología I y II y Deontología (Ley 1090 de 2006)', '🎓', 'blue', 9, 12, 'Práctica clínica, educativa, social u organizacional supervisada, código bioético y deontológico del psicólogo en Colombia.', [
        'Código Deontológico y Bioético del Psicólogo (Ley 1090 de 2006), Consentimiento Informado y Secreto Profesional',
        'Intervención Psicológica Supervisada, Elaboración de Informes Psicológicos y Trabajo de Grado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 10. FACULTAD DE ARQUITECTURA Y DISEÑO (3 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_arquitectura',
    name: 'Arquitectura',
    faculty: 'Arquitectura y Diseño',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 170,
    emoji: '🏛️',
    description: 'Pensum completo PUJ Bogotá: proyectos arquitectónicos I a X, expresión gráfica y BIM, sistemas estructurales y constructivos, bioclimática, historia y teoría de la arquitectura, urbanismo y paisaje.',
    subjects: [
      syl('ARQ-1101', 'Proyecto Arquitectónico I y II: Espacio, Lugar y Habitar Básico', '📐', 'amber', 1, 5, 'Composición espacial, escala humana, proporción, luz, tectónica y estereotomía e implantación en el lugar.', [
        'Operaciones Formales y Espaciales, Escala Humana, Recorrido Arquitectónico y Relación Interior-Exterior',
        'Análisis del Lugar (Topografía, Asoleación, Vientos) y Proyecto de Habitar elemental',
      ]),
      syl('ARQ-1201', 'Expresión Arquitectónica, Geometría Descriptiva y Modelado BIM (Revit/Rhino)', '✏️', 'blue', 2, 3, 'Bocetación a mano alzada, sistemas de representación (plantas, cortes, fachadas, axonometrías) y modelado paramétrico BIM.', [
        'Geometría Descriptiva, Sombras, Perspectiva Cónica y Dibujo Técnico Arquitectónico',
        'Modelado de Información para la Construcción (BIM en Autodesk Revit) y Modelado 3D en Rhinoceros / Grasshopper',
      ]),
      syl('ARQ-2301', 'Historia y Teoría de la Arquitectura (Antigüedad, Clásica, Moderna y Latinoamericana)', '🏺', 'purple', 3, 3, 'Tratadística clásica (Vitruvio, Palladio), Movimiento Moderno (Le Corbusier, Mies, Wright), arquitectura en Colombia (Rogelio Salmona).', [
        'Arquitectura Clásica, Gótica, Renacentista y Barroca: Espacio, Orden y Simbolismo',
        'Vanguardias del Siglo XX (Bauhaus, Estilo Internacional) y Modernidad Apropiada en América Latina y Colombia',
      ]),
      syl('ARQ-2401', 'Sistemas Estructurales y Construcción I a IV (Cimentaciones, Concreto, Acero y Madera)', '🏗️', 'rose', 4, 4, 'Morfología estructural, predimensionamiento bajo NSR-10, detalles constructivos, envolventes arquitectónicas, instalaciones hidrosanitarias y eléctricas.', [
        'Comportamiento de Pórticos, Muros Portantes, Cerchas, Cáscaras y Tensoestructuras y Predimensionamiento NSR-10',
        'Procesos Constructivos: Cimentación, Estructura, Mampostería, Cubiertas, Fachadas Ventiladas y Redes Técnicas',
      ]),
      syl('ARQ-2501', 'Proyecto Arquitectónico III a VI: Vivienda Colectiva, Equipamientos y Patrimonio', '🏢', 'emerald', 5, 6, 'Tipologías de vivienda multifamiliar de alta densidad, espacio comunal, equipamientos educativos/culturales e intervención en patrimonio.', [
        'Tipologías de Vivienda Colectiva (Duplex, Barra, Torre, Claustro), Flexibilidad Espacial y Sostenibilidad',
        'Diseño de Equipamientos Urbanos (Bibliotecas, Centros Culturales, Salud) y Normativa de Accesibilidad Universal',
      ]),
      syl('ARQ-2601', 'Arquitectura Bioclimática y Sostenibilidad Ambiental (LEED / EDGE)', '☀️', 'amber', 6, 3, 'Carta solar estereográfica, confort higrotérmico, ventilación natural (efecto chimenea y cruzada), iluminación natural y acústica.', [
        'Geometría Solar, Diseño de Cortasoles, Carta Psicrométrica de Givoni y Estrategias Pasivas de Climatización',
        'Eficiencia Energética, Huella de Carbono Incorporado (LCA) y Certificaciones Sostenibles (EDGE / LEED)',
      ]),
      syl('ARQ-3701', 'Urbanismo, Ordenamiento Territorial (POT) y Paisajismo', '🌆', 'blue', 7, 5, 'Morfología urbana, planes parciales, Ley 388 de 1997, estructura ecológica principal, espacio público y diseño urbano.', [
        'Instrumentos de Planificación Urbana en Colombia: POT, Planes Parciales, Cargas y Beneficios y Plusvalía',
        'Diseño de Espacio Público, Movilidad Sostenible (TOD) e Infraestructura Verde / Paisaje Urbano',
      ]),
      syl('ARQ-3901', 'Proyecto de Grado en Arquitectura y Gerencia de Proyectos Inmobiliarios', '🎓', 'purple', 9, 8, 'Factibilidad técnica y financiera (Cabida normativa y modelo inmobiliario) y desarrollo integral del proyecto arquitectónico o urbano de grado.', [
        'Estudio de Cabida Normativa, Factibilidad Financiera Inmobiliaria y Desarrollo Técnico Detallado del Proyecto de Grado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_diseno_industrial',
    name: 'Diseño Industrial',
    faculty: 'Arquitectura y Diseño',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🛋️',
    description: 'Pensum completo PUJ Bogotá: estudios de diseño de producto, factores humanos y ergonomía, materiales y procesos industriales, prototipado rápido, diseño de servicios, empaques, biónica y sostenibilidad.',
    subjects: [
      syl('DIN-1101', 'Estudio de Diseño I y II: Forma, Función, Morfología y Semiótica del Objeto', '✏️', 'amber', 1, 5, 'Leyes de la percepción formal, biónica, semántica de producto, bocetación rápida (Sketching) y maquetación.', [
        'Sintaxis Tridimensional de la Forma, Proporción, Simetría, Transiciones y Biónica Aplicada',
        'Semiótica del Objeto: Función Práctica, Estética y Simbólica e Interacción Usuario-Producto',
      ]),
      syl('DIN-1201', 'Factores Humanos, Antropometría, Ergonomía y Usabilidad', '🖐️', 'blue', 2, 3, 'Percentiles antropométricos, biomecánica postural (RULA/REBA), ergonomía cognitiva, diseño inclusivo y pruebas de usabilidad.', [
        'Diseño Antropométrico por Percentiles (P5, P50, P95), Alcances, Holguras y Puestos de Trabajo',
        'Ergonomía Cognitiva, Affordances (Don Norman), Carga Mental y Evaluación de Usabilidad con Usuarios',
      ]),
      syl('DIN-2301', 'Materiales y Procesos de Transformación Industrial (Polímeros, Metales, Maderas y Cerámicos)', '🏭', 'emerald', 3, 4, 'Inyección de termoplásticos, soplado, termoformado, fundición, doblado de lámina metálica, ensambles y selección con cartas de Ashby.', [
        'Selección de Materiales mediante Cartas de Ashby y Diseño para la Manufactura y el Ensamble (DFMA)',
        'Diseño de Piezas Plásticas para Moldeo por Inyección (Ángulos de Desmoldeo, Costillas, Chupados y Líneas de Partición)',
      ]),
      syl('DIN-2401', 'Modelado Avanzado de Superficies (NURBS / CAD) y Prototipado Digital (CAM / Impresión 3D)', '💻', 'purple', 4, 3, 'Superficies Clase A en Rhinoceros/Alias, renderizado fotorrealista (KeyShot) y fabricación digital (FDM, SLA, Corte Láser, CNC).', [
        'Modelado de Superficies Complejas NURBS con Continuidad G2/G3 y Renderizado de Producto en KeyShot',
        'Prototipado Rápido: Manufactura Aditiva (FDM, Estereolitografía SLA) y Mecanizado Sustractivo CNC',
      ]),
      syl('DIN-2501', 'Estudio de Diseño III y IV: Diseño de Producto, Empaques (Packaging) y Ecodiseño', '📦', 'rose', 5, 5, 'Diseño estructural y gráfico de envases y embalajes, análisis de ciclo de vida (ACV) y economía circular.', [
        'Diseño Estructural de Envases, Empaques y Embalajes, Protección Logística y Sostenibilidad',
        'Ecodiseño, Análisis de Ciclo de Vida (ISO 14040), Biomateriales y Estrategias de Economía Circular',
      ]),
      syl('DIN-3701', 'Diseño de Experiencias, Servicios (Service Design) e Innovación Estratégica', '🚀', 'blue', 7, 5, 'Design Thinking, Customer Journey Maps, Service Blueprints, diseño de productos interactivos (IoT) y gestión del diseño.', [
        'Investigación Etnográfica de Usuarios, Arquetipos (Personas), Mapas de Experiencia y Service Blueprints',
        'Propiedad Industrial (Patentes de Invención, Modelos de Utilidad y Diseños Industriales ante la SIC)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_diseno_visual',
    name: 'Diseño de Comunicación Visual',
    faculty: 'Arquitectura y Diseño',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🎨',
    description: 'Pensum completo PUJ Bogotá: tipografía, diseño editorial, identidad visual y branding, ilustración, diseño de información (infografía), diseño de interacción UX/UI, motion graphics y narrativas transmedia.',
    subjects: [
      syl('DCV-1101', 'Fundamentos de la Imagen, Color, Composición y Cultura Visual', '🎨', 'rose', 1, 4, 'Teoría del color (aditivo CMYK y sustractivo RGB), leyes de la Gestalt, retórica visual y semiótica de la imagen.', [
        'Psicología y Armonías del Color, Contraste Simultáneo (Itten) y Gestión de Color Digital e Impreso',
        'Retórica de la Imagen, Semiótica Peirceana (Ícono, Índice, Símbolo) y Jerarquía Compositiva',
      ]),
      syl('DCV-1201', 'Tipografía I y II y Diseño Editorial (Impreso y Digital)', '🔤', 'amber', 2, 4, 'Anatomía tipográfica, clasificación histórica, micro y macrotipografía, retículas modulares (Müller-Brockmann) y producción editorial.', [
        'Anatomía del Tipo, Kerning, Tracking, Interlineado, Legibilidad y Diseño de Fuentes Tipográficas',
        'Sistemas de Retículas Editoriales, Maquetación en InDesign, Preprensa Digital y Artes Finales',
      ]),
      syl('DCV-2301', 'Identidad Visual Corporativa, Branding y Sistemas Gráficos', '✨', 'purple', 3, 4, 'Estrategia de marca, naming, arquitectura de marca, diseño de signos identificadores (logotipo, imagotipo), manual de identidad y señalética.', [
        'Auditoría Visual, Plataforma Estratégica de Marca, Tono de Voz y Universo Gráfico Dinámico',
        'Manual de Identidad Visual, Aplicaciones Multicanal y Diseño de Sistemas de Señalética y Wayfinding',
      ]),
      syl('DCV-2401', 'Diseño de Información, Infografía y Visualización de Datos', '📊', 'blue', 4, 4, 'Arquitectura de la información, cartografía informativa, periodismo visual y visualización interactiva de datos complejos.', [
        'Principios de Edward Tufte y Alberto Cairo para la Codificación Visual de Datos Cuantitativos y Cualitativos',
        'Diseño de Infografías Editoriales, Dashboards Interactivos y Narrativa con Datos (Data Storytelling)',
      ]),
      syl('DCV-2501', 'Diseño de Interacción (IxD), Experiencia de Usuario (UX) e Interfaces (UI)', '📱', 'emerald', 5, 4, 'Investigación de usuarios, arquitectura de información, wireframing, sistemas de diseño (Design Systems en Figma), prototipado y pruebas de usabilidad.', [
        'User Research, Card Sorting, Flujos de Usuario (User Flows) y Heurísticas de Usabilidad de Nielsen',
        'Atomic Design, Tokens de Diseño, Componentes Auto-Layout en Figma, Accesibilidad Web (WCAG) y Handoff a Desarrollo',
      ]),
      syl('DCV-3701', 'Animación Digital, Motion Graphics y Narrativas Audiovisuales / Transmedia', '🎬', 'rose', 7, 4, 'Principios de animación (12 principios), storyboard, dirección de arte audiovisual, composición en After Effects y experiencias inmersivas.', [
        'Guion Gráfico (Storyboard), Animatic, Curvas de Velocidad (Easing) y Tipografía Cinética en Motion Graphics',
        'Narrativas Transmedia, Dirección de Arte y Producción de Experiencias Interactivas',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 11. FACULTAD DE COMUNICACIÓN Y LENGUAJE (3 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_comunicacion_social',
    name: 'Comunicación Social',
    faculty: 'Comunicación y Lenguaje',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🎙️',
    description: 'Pensum completo PUJ Bogotá (con los 6 campos profesionales: Periodismo, Producción Audiovisual, Comunicación Organizacional, Publicidad, Editorial y Radio/Sonoro).',
    subjects: [
      syl('COM-1101', 'Teorías de la Comunicación I y II (Funcionalismo, Escuela de Frankfurt, Estudios Culturales y Ecología de Medios)', '📡', 'blue', 1, 3, 'Aguja hipodérmica, Agenda Setting, industria cultural (Adorno/Horkheimer), Jesús Martín-Barbero (De los medios a las mediaciones) y convergencia digital.', [
        'Mass Communication Research, Teoría de la Agenda-Setting, Framing y Espiral del Silencio',
        'Teoría Crítica (Escuela de Frankfurt), Estudios Culturales de Birmingham y Mediaciones en América Latina (Martín-Barbero)',
      ]),
      syl('COM-1201', 'Lenguajes, Semiótica y Narrativas Escritas / Sonoras / Visuales', '✍️', 'amber', 2, 4, 'Semiótica narrativa (Greimas, Barthes, Eco), redacción y estilo, estética sonora y lenguaje cinematográfico.', [
        'Semiótica de la Cultura, Análisis del Discurso, Crónica, Perfil y Ensayo Periodístico',
        'Paisaje Sonoro, Guion Radial, Podcasting y Gramática del Plano Audiovisual',
      ]),
      syl('COM-2301', 'Énfasis en Periodismo: Reportería, Periodismo Investigativo y Periodismo de Datos', '📰', 'rose', 4, 4, 'Contrastación de fuentes, géneros informativos y de opinión, derecho a la información, fact-checking y periodismo de datos.', [
        'Géneros Periodísticos (Noticia, Reportaje, Crónica, Entrevista), Reportería de Campo y Ética Periodística',
        'Periodismo de Investigación, Solicitudes de Acceso a Información Pública y Periodismo de Datos',
      ]),
      syl('COM-2401', 'Énfasis en Producción Audiovisual: Guion, Dirección, Fotografía y Montaje', '🎬', 'purple', 5, 4, 'Escritura de guion de ficción y documental, dirección de fotografía e iluminación, sonido directo y edición no lineal.', [
        'Estructura Dramática del Guion, Desarrollo de Personajes, Escaleta y Realización Documental',
        'Dirección de Fotografía, Óptica, Iluminación, Diseño Sonoro y Montaje Cinematográfico',
      ]),
      syl('COM-2501', 'Énfasis en Comunicación Organizacional y Estratégica / Reputación Corporativa', '🏢', 'emerald', 5, 4, 'Comunicación interna y externa, cultura organizacional, relaciones públicas, gestión de crisis de reputación y sostenibilidad.', [
        'Diagnóstico y Auditoría de Comunicación Interna, Clima Organizacional y Endomarketing',
        'Comunicación Externa, Relacionamiento con Stakeholders, Vocería y Manejo de Crisis Reputacionales',
      ]),
      syl('COM-2601', 'Énfasis en Publicidad y Estrategia Creativa / Digital', '💡', 'amber', 6, 4, 'Planeación estratégica publicitaria (Account Planning), insights del consumidor, copywriting, dirección de arte y pauta digital.', [
        'Brief Publicitario, Hallazgo de Insights Culturales, Concepto Creativo y Campañas 360°',
        'Estrategia de Contenidos Digitales, Social Media, SEO/SEM y Métricas de Conversión',
      ]),
      syl('COM-3701', 'Énfasis en Producción Editorial y Multimedia', '📚', 'blue', 7, 4, 'Cadena del libro, edición de textos, corrección de estilo, derechos de autor, diseño de colecciones y publicaciones digitales.', [
        'Curaduría Editorial, Evaluación de Manuscritos, Corrección Ortotipográfica y de Estilo y Propiedad Intelectual',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_bibliotecologia',
    name: 'Ciencia de la Información, Bibliotecología y Archivística',
    faculty: 'Comunicación y Lenguaje',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🗂️',
    description: 'Pensum completo PUJ Bogotá: organización del conocimiento, catalogación RDA/MARC21, gestión documental y tablas de retención (AGN), preservación digital, arquitectura de información y cienciometría.',
    subjects: [
      syl('CIB-1101', 'Epistemología de la Ciencia de la Información y Unidades de Información', '📚', 'blue', 1, 3, 'Concepto de dato, información, documento y conocimiento; historia del libro, bibliotecas, archivos y centros de documentación.', [
        'Teoría Matemática de la Información vs Enfoque Cognitivo y Social de la Ciencia de la Información',
        'Tipología y Gestión de Bibliotecas Públicas, Universitarias, Nacionales y Archivos Históricos',
      ]),
      syl('CIB-2301', 'Organización y Representación del Conocimiento (Catalogación RDA, MARC21 y Metadatos)', '🏷️', 'emerald', 3, 4, 'Control bibliográfico, norma RDA, formato MARC 21, sistemas de clasificación Dewey (CDD), tesauros, ontologías y Dublin Core.', [
        'Catalogación Descriptiva bajo Estándar RDA, Formato MARC 21 y Control de Autoridades',
        'Indización, Construcción de Tesauros, Taxonomías, Ontologías Web Semántica y Esquemas de Metadatos (Dublin Core, MODS)',
      ]),
      syl('CIB-2401', 'Archivística y Gestión Documental Electrónica (Normativa AGN)', '🗂️', 'amber', 4, 4, 'Principio de procedencia y orden original, ciclo vital del documento, Tablas de Retención Documental (TRD), Tablas de Valoración (TVD) y SGDEA.', [
        'Principios Archivísticos (Procedencia y Orden Original), Cuadros de Clasificación Documental (CCD) y Descripción ISAD(G)',
        'Elaboración de Tablas de Retención Documental (TRD), Gestión de Documentos Electrónicos (SGDEA) y Preservación Digital a Largo Plazo (OAIS)',
      ]),
      syl('CIB-2501', 'Arquitectura de la Información, Recuperación de Información y Repositorios Digitales', '💻', 'purple', 5, 4, 'Motores de búsqueda, modelos booleano y vectorial, DSpace/OJS, ciencia abierta y experiencia de usuario en portales.', [
        'Modelos de Recuperación de Información (Booleano, Vectorial TF-IDF, Probabilístico) y Precisión/Exhaustividad',
        'Implementación de Repositorios Institucionales (DSpace), Protocolo OAI-PMH y Ciencia Abierta',
      ]),
      syl('CIB-3701', 'Bibliometría, Cienciometría, Vigilancia Tecnológica e Inteligencia Competitiva', '📊', 'rose', 7, 4, 'Leyes de Lotka, Bradford y Zipf, índice H, factor de impacto (Scopus/WoS), mapas de co-citación y vigilancia estratégica.', [
        'Indicadores Bibliométricos de Producción, Impacto y Colaboración Científica (Leyes de Lotka, Bradford y Price)',
        'Vigilancia Tecnológica, Análisis de Patentes y Gestión del Conocimiento Organizacional',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_lenguas_modernas',
    name: 'Licenciatura en Lenguas Modernas con énfasis en Inglés y Francés',
    faculty: 'Comunicación y Lenguaje',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 164,
    emoji: '🗣️',
    description: 'Pensum completo PUJ Bogotá: competencia comunicativa C1 en inglés y francés, fonética y fonología, morfología y sintaxis, sociolingüística, adquisición de segundas lenguas (SLA), didáctica de lenguas y práctica docente.',
    subjects: [
      syl('LLM-1101', 'Inglés Comunicativo y Académico I a VII (Niveles A2 a C1 MCER)', '🇬🇧', 'blue', 1, 6, 'Desarrollo integrado de comprensión auditiva, lectura crítica, producción oral y escritura académica en inglés hasta nivel C1.', [
        'Gramática Avanzada del Inglés, Escritura de Ensayos Académicos (Academic Writing) y Argumentación Oral',
        'Preparación para Exámenes Internacionales (IELTS / TOEFL / Cambridge C1 Advanced)',
      ]),
      syl('LLM-1201', 'Francés Comunicativo y Académico I a VI (Niveles A1 a B2/C1 DELF/DALF)', '🇫🇷', 'purple', 2, 5, 'Competencia lingüística, pragmática y sociocultural en lengua francesa y culturas francófonas.', [
        'Morfosintaxis del Francés, Comprensión Auditiva, Producción Escrita (Synthèse y Essai Argumenté) y Preparación DELF B2 / DALF C1',
      ]),
      syl('LLM-2301', 'Lingüística General: Fonética, Fonología, Morfología, Sintaxis y Semántica', '🔤', 'emerald', 3, 4, 'Alfabeto Fonético Internacional (IPA), procesos fonológicos, formación de palabras, sintaxis generativa y pragmática (actos de habla).', [
        'Fonética Articulatoria y Acústica, Transcripción en AFI (IPA) y Rasgos Suprasegmentales (Inglés, Francés y Español)',
        'Morfología Derivativa/Flexiva, Árboles Sintácticos, Semántica Léxica y Pragmática (Grice, Austin, Searle)',
      ]),
      syl('LLM-2501', 'Adquisición de Segundas Lenguas (SLA), Bilingüismo y Sociolingüística', '🧠', 'amber', 5, 4, 'Hipótesis de Krashen, interlengua (Selinker), hipótesis de la interacción, variación lingüística, políticas lingüísticas y educación bilingüe.', [
        'Teorías de Adquisición de L2: Innatismo (Chomsky), Input Comprensible (Krashen), Sociocultural (Vygotsky) e Interlengua',
        'Sociolingüística, Variación Dialectal, Contacto de Lenguas, Interculturalidad y Políticas de Bilingüismo en Colombia',
      ]),
      syl('LLM-2701', 'Didáctica de las Lenguas Extranjeras, Diseño Curricular, Evaluación y Práctica Pedagógica', '🏫', 'rose', 7, 6, 'Enfoque comunicativo, aprendizaje basado en tareas (TBLT), CLIL/AICLE, diseño de sílabos, evaluación auténtica y práctica docente en aula.', [
        'Metodologías de Enseñanza (Communicative Approach, Task-Based Learning, CLIL) y Diseño de Materiales Didácticos',
        'Evaluación del Aprendizaje de Lenguas (Rúbricas, Validez, Retroalimentación) y Investigación-Acción en el Aula',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 12. FACULTAD DE ARTES (3 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_artes_visuales',
    name: 'Artes Visuales',
    faculty: 'Artes',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🖼️',
    description: 'Pensum completo PUJ Bogotá (Énfasis Plástico, Gráfico y Audiovisual): dibujo, pintura, escultura, grabado, fotografía analógica y digital, videoarte, instalación, historia y teoría del arte y curaduría.',
    subjects: [
      syl('ARV-1101', 'Talleres de Dibujo, Pintura y Experimentación Pictórica I a IV', '🎨', 'amber', 1, 4, 'Dibujo de observación, figura humana, teoría del color pictórico, óleo, acrílico, técnicas mixtas y pensamiento visual.', [
        'Dibujo Anatómico, Proporción, Claroscuro, Gesto y Exploración de Soportes Contemporáneos',
        'Teoría de Pigmentos, Veladuras, Empastes, Composición Pictórica y Poéticas de la Imagen',
      ]),
      syl('ARV-1201', 'Escultura, Cerámica, Ensamblaje e Instalación en el Espacio', '🗿', 'rose', 2, 4, 'Modelado, talla, vaciado y moldes, soldadura, cerámica artística, arte objeto e intervención site-specific en el espacio público.', [
        'Procesos Aditivos y Sustractivos Tridimensionales, Moldes Rígidos/Flexibles y Fundición',
        'Escultura Expandida (Rosalind Krauss), Instalación Artística, Arte Público y Relación Cuerpo-Espacio',
      ]),
      syl('ARV-2301', 'Grabado, Artes Gráficas y Publicaciones de Artista', '🖨️', 'purple', 3, 4, 'Xilografía, linóleo, calcografía (aguafuerte, aguatinta), litografía, serigrafía artística y libros de artista.', [
        'Grabado en Relieve (Xilografía), Huecograbado en Metal (Aguafuerte y Punta Seca) y Serigrafía',
      ]),
      syl('ARV-2401', 'Fotografía Analógica y Digital, Videoarte y Medios Electrónicos', '📷', 'blue', 4, 4, 'Cámara estenopeica, laboratorio de cuarto oscuro (blanco y negro), iluminación de estudio, ensayo fotográfico, videoarte y arte sonoro/interactivo.', [
        'Química Fotográfica en Cuarto Oscuro, Sistema de Zonas de Ansel Adams e Iluminación Fotográfica',
        'Videoarte, Imagen en Movimiento, Arte Algorítmico / Generativo y Nuevos Medios',
      ]),
      syl('ARV-2601', 'Historia y Teoría del Arte Moderno, Contemporáneo y Arte Colombiano / Curaduría', '🏛️', 'emerald', 6, 4, 'Vanguardias históricas, arte conceptual, arte moderno y contemporáneo en Colombia (Obregón, Botero, Doris Salcedo, Beatriz González), museografía y curaduría.', [
        'Vanguardias del Siglo XX, Giro Conceptual, Performance e Historia del Arte en Colombia y América Latina',
        'Investigación-Creación en Artes, Guion Curatorial, Museografía y Gestión de Exposiciones',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_estudios_musicales',
    name: 'Estudios Musicales',
    faculty: 'Artes',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 10,
    totalCredits: 162,
    emoji: '🎵',
    description: 'Pensum completo PUJ Bogotá (Énfasis en Interpretación Clásica/Jazz, Composición, Dirección, Ingeniería de Sonido y Producción Musical).',
    subjects: [
      syl('MUS-1101', 'Instrumento Principal / Canto Lírico o Popular y Ensambles I a X', '🎻', 'amber', 1, 5, 'Técnica instrumental o vocal avanzada, repertorio solista, música de cámara, orquesta sinfónica, banda o ensambles de jazz y músicas colombianas.', [
        'Técnica Instrumental/Vocal, Lectura a Primera Vista, Interpretación Estilística y Práctica de Conjunto (Orquesta / Big Band / Coro)',
      ]),
      syl('MUS-1201', 'Teoría de la Música, Entrenamiento Auditivo (Solfeo) y Armonía Tonal / Contemporánea I a VI', '🎼', 'blue', 2, 4, 'Solfeo entonado y rítmico, dictado musical a 4 voces, conducción de voces, armonía cromática, modal y armonía de jazz.', [
        'Solfeo Rítmico Polimétrico, Entonación Modal/Atonal y Dictado Armónico y Contrapuntístico',
        'Armonía Diatónica y Cromática, Dominantes Secundarias, Modulación, Armonía de Jazz y Sustitución Tritonal',
      ]),
      syl('MUS-2401', 'Contrapunto, Morfología (Análisis Musical), Instrumentación y Orquestación', '🎹', 'purple', 4, 4, 'Contrapunto modal (Palestrina) y tonal (invenciones y fugas de Bach), formas sonata y rondó, y orquestación sinfónica.', [
        'Contrapunto de Especies, Invención a 2 y 3 Voces, Fuga y Análisis Formal (Forma Sonata, Variaciones)',
        'Acústica de los Instrumentos Orquestales (Cuerdas, Maderas, Metales, Percusión) y Técnicas de Orquestación',
      ]),
      syl('MUS-2501', 'Historia de la Música Occidental, Músicas Tradicionales de Colombia y Etnomusicología', '🌎', 'emerald', 5, 3, 'Edad Media, Renacimiento, Barroco, Clasicismo, Romanticismo, Siglo XX y músicas de las regiones Andina, Caribe, Pacífico, Llanos y Amazonía.', [
        'Evolución Estilística del Renacimiento al Siglo XXI (Serialismo, Minimalismo, Espectralismo)',
        'Organología y Estructuras Rítmicas de las Músicas Tradicionales Colombianas (Bambuco, Pasillo, Cumbia, Currulao, Joropo)',
      ]),
      syl('MUS-2601', 'Acústica, Grabación, Mezcla, Masterización y Producción Musical (DAW)', '🎚️', 'rose', 6, 4, 'Acústica arquitectónica, electroacústica, técnicas de microfonía estéreo, consolas, flujo de señal en Pro Tools / Logic y diseño sonoro.', [
        'Acústica de Salas (Tiempo de Reverberación RT60), Patrones Polares de Micrófonos y Técnicas Estéreo (XY, ORTF, Mid-Side)',
        'Procesamiento Dinámico (Compresión, EQ), Mezcla Multicanal, Audio Inmersivo (Dolby Atmos) y Masterización',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_artes_escenicas',
    name: 'Artes Escénicas',
    faculty: 'Artes',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🎭',
    description: 'Pensum completo PUJ Bogotá (Énfasis en Actuación, Danza y Somática, y Creación / Dirección Escénica): entrenamiento corporal y vocal, dramaturgia, historia del teatro y montaje escénico.',
    subjects: [
      syl('ESC-1101', 'Actuación I a VI (Stanislavski, Meyerhold, Grotowski, Brecht y Lecoq)', '🎭', 'rose', 1, 4, 'Presencia escénica, acción física, memoria emotiva, biomecánica teatral, distanciamiento épico, máscara neutra y actuación para cámara.', [
        'Sistema Stanislavski (Objetivo, Superobjetivo, Acciones Físicas, Circunstancias Dadas) y Biomecánica de Meyerhold',
        'Teatro Pobre de Grotowski, Teatro Épico de Brecht, Pedagogía de Jacques Lecoq y Actuación frente a Cámara',
      ]),
      syl('ESC-1201', 'Entrenamiento Corporal, Danza Contemporánea, Ballet y Educación Somática', '🩰', 'purple', 2, 4, 'Conciencia corporal (Feldenkrais, Alexander, Bartenieff), análisis del movimiento de Laban, danza contemporánea, contact improvisation y acrobacia escénica.', [
        'Análisis del Movimiento de Rudolf Laban (Espacio, Tiempo, Peso, Flujo) y Técnicas de Danza Contemporánea (Release, Flying Low)',
        'Educación Somática, Alineación Corporal, Improvisación de Contacto y Composición Coreográfica',
      ]),
      syl('ESC-2301', 'Voz Escénica, Dicción, Canto Teatral y Expresión Oral', '🎙️', 'amber', 3, 3, 'Respiración costo-diafragmática, resonadores vocales (Linklater, Roy Hart), proyección en escena, verso clásico y teatro musical.', [
        'Fisiología de la Voz, Apoyo Respiratorio, Articulación, Proyección Escénica e Interpretación del Verso Clásico (Siglo de Oro / Shakespeare)',
      ]),
      syl('ESC-2501', 'Dramaturgia, Historia del Teatro Universal y Latinoamericano y Puesta en Escena', '📜', 'blue', 5, 4, 'Tragedia griega, teatro isabelino, drama moderno (Ibsen, Chéjov), creación colectiva en Colombia (TEC, La Candelaria), dirección e iluminación escénica.', [
        'Análisis Dramatúrgico (Conflicto, Estructura Aristotélica y Posdramática) y Teatro Colombiano Contemporáneo',
        'Dirección Escénica, Escenografía, Diseño de Iluminación, Vestuario y Producción de Montajes de Grado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 13. FACULTAD DE CIENCIAS SOCIALES (4 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_antropologia',
    name: 'Antropología',
    faculty: 'Ciencias Sociales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🏺',
    description: 'Pensum completo PUJ Bogotá: teorías antropológicas clásicas y contemporáneas, etnografía y trabajo de campo, arqueología y bioantropología, antropología colombiana, del parentesco, simbólica, médica y del desarrollo.',
    subjects: [
      syl('ANT-1101', 'Teoría Antropológica Clásica y Contemporánea (Evolucionismo, Particularismo, Funcionalismo, Estructuralismo y Giro Ontológico)', '🌍', 'amber', 1, 4, 'Boas, Malinowski, Mauss, Radcliffe-Brown, Lévi-Strauss, Geertz (antropología interpretativa), Viveiros de Castro y Descola.', [
        'Particularismo Histórico (Franz Boas), Funcionalismo Etnográfico (Malinowski) y Ensayo sobre el Don (Marcel Mauss)',
        'Antropología Estructural (Lévi-Strauss), Descripción Densa (Clifford Geertz) y Perspectivismo Amerindio / Giro Ontológico',
      ]),
      syl('ANT-1201', 'Arqueología General, Prehispánica de Colombia y Antropología Biológica / Forense', '🦴', 'rose', 2, 4, 'Hominización, osteología humana, sociedades prehispánicas de Colombia (San Agustín, Tierradentro, Muiscas, Tairona, Zenú) y antropología forense.', [
        'Evolución Humana, Poblamiento de América y Desarrollos Regionales Prehispánicos en Colombia',
        'Prospección y Excavación Arqueológica, Bioarqueología y Antropología Forense en Contextos de Derechos Humanos',
      ]),
      syl('ANT-2301', 'Método Etnográfico, Escritura Etnográfica y Trabajo de Campo', '📓', 'emerald', 3, 4, 'Observación participante, diario de campo, historias de vida, genealogías, cartografía social, reflexividad y ética en la investigación antropológica.', [
        'Observación Participante, Diario de Campo, Entrevista Etnográfica e Historias de Vida',
        'Políticas de la Representación, Etnografía Multisituada, Etnografía Digital y Ética Colaborativa',
      ]),
      syl('ANT-2501', 'Etnología de Colombia: Pueblos Indígenas (Tierras Bajas y Altas), Comunidades Afrodescendientes y Campesinas', '🌿', 'blue', 5, 4, 'Cosmologías amazónicas y andinas, chamanismo, territorialidades colectivas (Ley 70 y Resguardos), consulta previa y movimientos étnicos.', [
        'Etnología Amazónica, Orinoquense y Andina en Colombia: Mitología, Chamanismo, Parentesco y Manejo Ecológico',
        'Estudios Afrocolombianos, Campesinado, Patrimonio Cultural Inmaterial y Antropología Jurídica / del Estado',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_historia',
    name: 'Historia',
    faculty: 'Ciencias Sociales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '📜',
    description: 'Pensum completo PUJ Bogotá: historiografía y teoría de la historia, paleografía y archivo, historia antigua, medieval, moderna y contemporánea, historia de América Latina e historia de Colombia (Colonia y Siglos XIX-XXI).',
    subjects: [
      syl('HIS-1101', 'Teoría de la Historia e Historiografía (Escuela de los Annales, Marxismo Británico, Microhistoria e Historia Conceptual)', '📚', 'amber', 1, 4, 'Bloch, Braudel (larga duración), E.P. Thompson, Carlo Ginzburg, Reinhart Koselleck, historia cultural e historia subalterna.', [
        'El Oficio del Historiador, Tiempo Histórico (Corta, Media y Larga Duración de Braudel) y Crítica de Fuentes Primarias',
        'Historia Social desde Abajo (Thompson), Microhistoria Italiana (Ginzburg), Historia de los Conceptos (Koselleck) y Memoria Histórica',
      ]),
      syl('HIS-1201', 'Historia de Colombia I y II: Mundo Prehispánico, Conquista, Sociedad Colonial e Independencia', '🏛️', 'rose', 2, 4, 'Instituciones coloniales (encomienda, mita, resguardo, esclavitud), Nuevo Reino de Granada, Reformas Borbónicas, Rebelión de los Comuneros e Independencia.', [
        'Economía Minera y Agraria, Mestizaje, Iglesia y Sociedad de Castas en el Nuevo Reino de Granada (Siglos XVI-XVIII)',
        'Ilustración Neogranadina (Expedición Botánica), Crisis de la Monarquía Hispánica y Proceso de Independencia (1808-1830)',
      ]),
      syl('HIS-2401', 'Historia de Colombia III y IV: Siglo XIX (Construcción del Estado-Nación) y Siglo XX-XXI', '🇨🇴', 'blue', 4, 4, 'Federalismo vs centralismo, Regeneración, Guerra de los Mil Días, hegemonía conservadora, República Liberal, La Violencia, Frente Nacional y conflicto reciente.', [
        'Reformas Liberales de Medio Siglo, Olimpo Radical, Regeneración de 1886 y Economía Cafetera',
        'Movimientos Sociales del Siglo XX, El Bogotazo y La Violencia, Frente Nacional, Narcotráfico y Constitución de 1991',
      ]),
      syl('HIS-2501', 'Historia Universal (Antigua, Medieval, Moderna y Contemporánea) e Historia de América Latina', '🌎', 'purple', 5, 4, 'Mundo mediterráneo antiguo, feudalismo, Renacimiento, revoluciones atlánticas, caudillismo, populismos y dictaduras del Cono Sur.', [
        'Transición del Feudalismo al Capitalismo, Era de las Revoluciones (Hobsbawm) y Corto Siglo XX',
        'Revolución Mexicana, Revoluciones y Dictaduras en América Latina y Guerra Fría Interamericana',
      ]),
      syl('HIS-3701', 'Paleografía, Diplomática, Investigación en Archivos Históricos (AGN) e Historia Pública / Digital', '🖋️', 'emerald', 7, 4, 'Lectura y transcripción de manuscritos coloniales (siglos XVI-XVIII), trabajo en el Archivo General de la Nación y humanidades digitales.', [
        'Transcripción Paleográfica de Escritura Procesal, Encadenada y Cortesana en Fondos Coloniales del AGN',
        'Diseño del Trabajo de Grado Monográfico, Museología Histórica y Humanidades Digitales',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_literatura',
    name: 'Estudios Literarios (Literatura)',
    faculty: 'Ciencias Sociales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '📖',
    description: 'Pensum completo PUJ Bogotá: teoría y crítica literaria, literaturas clásicas, medieval y Siglo de Oro, modernidad europea, literatura latinoamericana, literatura colombiana, edición y escritura creativa.',
    subjects: [
      syl('LIT-1101', 'Teoría Literaria I y II (Poética Aristotélica, Formalismo Ruso, Estructuralismo, Hermenéutica y Posestructuralismo)', '🧐', 'purple', 1, 4, 'Mímesis y catarsis, extrañamiento (Shklovski), dialogismo y carnaval (Bajtín), narratología (Genette), Barthes, Derrida y estudios poscoloniales.', [
        'Formalismo Ruso, Narratología Estructural (Voz, Modo, Tiempo en Genette) y Polifonía Novelesca (Bajtín)',
        'Estética de la Recepción (Iser, Jauss), Deconstrucción, Crítica Feminista y Sociología de la Literatura (Bourdieu)',
      ]),
      syl('LIT-1201', 'Literatura Clásica Grecolatina, Medieval y del Siglo de Oro Español (Cervantes)', '🏛️', 'amber', 2, 4, 'Homero, tragedia griega, Virgilio, Dante, lírica petrarquista, picaresca, teatro barroco (Lope, Calderón), Góngora, Quevedo y El Quijote.', [
        'Épica Homérica (Ilíada, Odisea), Tragedia Ática (Sófocles, Eurípides) y Divina Comedia de Dante',
        'Poética del Siglo de Oro, Invención de la Novela Moderna en Don Quijote de la Mancha y Barroco de Indias (Sor Juana)',
      ]),
      syl('LIT-2401', 'Literatura Moderna y Contemporánea Universal (Romanticismo, Simbolismo, Vanguardias y Siglo XX)', '🌍', 'blue', 4, 4, 'Goethe, Baudelaire, Flaubert, Dostoievski, Proust, Joyce, Kafka, Virginia Woolf y poéticas contemporáneas.', [
        'Romanticismo Alemán e Inglés, Realismo Ruso y Francés y Modernismo Estético / Spleen (Baudelaire, Rimbaud, Mallarmé)',
        'Transformaciones de la Novela en el Siglo XX: Flujo de Conciencia (Joyce, Woolf), Absurdo (Kafka, Beckett) y Posmodernidad',
      ]),
      syl('LIT-2501', 'Literatura Latinoamericana (Crónicas de Indias, Modernismo, Vanguardias, Boom y Posboom)', '🌎', 'emerald', 5, 4, 'Rubén Darío, Vallejo, Huidobro, Neruda, Borges, Rulfo, Cortázar, García Márquez, Bolaño y escritoras latinoamericanas contemporáneas.', [
        'Modernismo Hispanoamericano, Vanguardias Poéticas (Vallejo, Huidobro, Girondo) y Ficciones de Jorge Luis Borges',
        'Transculturación Narrativa (Rulfo, Arguedas), el Boom Latinoamericano y Narrativa Contemporánea del Siglo XXI',
      ]),
      syl('LIT-2601', 'Literatura Colombiana (Siglos XIX al XXI) y Talleres de Escritura Creativa / Edición', '🇨🇴', 'rose', 6, 4, 'Costumbrismo, María (Isaacs), José Asunción Silva, La Vorágine (Rivera), Grupo de Barranquilla, Cien años de soledad, Mutis y poesía colombiana.', [
        'Fundación de la Narrativa y Poesía Nacional (Isaacs, Carrasquilla, Silva, Rivera, León de Greiff, Aurelio Arturo)',
        'Gabriel García Márquez, Álvaro Mutis, Andrés Caicedo, Marvel Moreno, Novela de la Violencia y Taller de Creación Literaria',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_sociologia',
    name: 'Sociología',
    faculty: 'Ciencias Sociales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '👥',
    description: 'Pensum completo PUJ Bogotá: teorías sociológicas clásicas (Marx, Durkheim, Weber) y contemporáneas (Bourdieu, Luhmann, Foucault), métodos cuantitativos y cualitativos, sociología urbana, rural, de la cultura y de Colombia.',
    subjects: [
      syl('SOC-1101', 'Teoría Sociológica Clásica (Karl Marx, Émile Durkheim, Max Weber y Georg Simmel)', '🏛️', 'blue', 1, 4, 'Materialismo histórico y lucha de clases, hecho social y solidaridad orgánica/mecánica, acción social, racionalización y burocracia.', [
        'Karl Marx (Modo de Producción, Alienación y Plusvalía) y Émile Durkheim (Hecho Social, División del Trabajo y El Suicidio)',
        'Max Weber (Tipos Ideales de Acción Social, Ética Protestante y Tipos de Dominación Legítima) y Sociología Formal de Simmel',
      ]),
      syl('SOC-2301', 'Teoría Sociológica Contemporánea (Funcionalismo, Teoría Crítica, Bourdieu, Giddens y Luhmann)', '🌐', 'purple', 3, 4, 'Parsons y Merton, interaccionismo simbólico (Goffman), estructuralismo constructivista (Bourdieu: habitus, campo, capital) y teoría de sistemas.', [
        'Sociología de la Vida Cotidiana (Schütz, Berger & Luckmann, Erving Goffman) y Teoría de la Estructuración (Anthony Giddens)',
        'Pierre Bourdieu (Habitus, Campos Sociales, Violencia Simbólica y Distinción) y Sistemas Autopoiéticos de Niklas Luhmann',
      ]),
      syl('SOC-2401', 'Metodologías de Investigación Sociológica Cuantitativa (Estadística Social) y Cualitativa', '📊', 'emerald', 4, 4, 'Diseño de encuestas, muestreo probabilístico, análisis multivariado en R/SPSS, grupos focales, entrevistas en profundidad y análisis de discurso.', [
        'Operacionalización de Variables, Diseño Muestral, Regresión Lineal/Logística y Análisis de Correspondencias Múltiples',
        'Investigación Cualitativa, Teoría Fundamentada (Grounded Theory), Análisis de Redes Sociales y Cartografía Participativa',
      ]),
      syl('SOC-2601', 'Sociología Colombiana, Sociología Urbana, Rural y de las Desigualdades Sociales', '🇨🇴', 'amber', 6, 4, 'Camilo Torres y Orlando Fals Borda, cuestión agraria, urbanización, estratificación, movilidad social, género y movimientos sociales.', [
        'Historia de la Sociología en Colombia (Fals Borda y la IAP), Estructura Agraria, Conflicto Territorial y Movimientos Campesinos',
        'Sociología Urbana, Segregación Socioespacial, Sociología del Trabajo, Género e Interseccionalidad',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 14. FACULTAD DE FILOSOFÍA (2 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_filosofia',
    name: 'Filosofía',
    faculty: 'Filosofía',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '🦉',
    description: 'Pensum completo PUJ Bogotá: historia de la filosofía (antigua, medieval, moderna, contemporánea), lógica simbólica, metafísica y ontología, epistemología, filosofía del lenguaje, ética, estética y filosofía política.',
    subjects: [
      syl('FIL-1101', 'Filosofía Antigua (Presocráticos, Platón, Aristóteles y Escuelas Helenísticas)', '🏛️', 'amber', 1, 4, 'Problema del arché, teoría de las Ideas en Platón, física, metafísica (sustancia, acto y potencia) y ética nicomáquea en Aristóteles.', [
        'Parménides, Heráclito, Sócrates y Diálogos Platónicos (República, Fedón, Banquete, Teeteto)',
        'Aristóteles (Órganon, Física, Metafísica, De Anima, Ética a Nicómaco) y Estoicismo / Epicureísmo / Escepticismo',
      ]),
      syl('FIL-1201', 'Lógica Formal y Filosofía del Lenguaje / Mente (Tradición Analítica)', '🔣', 'blue', 2, 4, 'Lógica de predicados de primer orden, lógicas modales, Frege (sentido y referencia), Russell, Wittgenstein (Tractatus e Investigaciones) y Quine.', [
        'Cálculo de Deducción Natural en Lógica Proposicional y Cuantificacional y Metalógica (Completitud y Teorema de Gödel)',
        'Giro Lingüístico: Frege, Russell, Primer y Segundo Wittgenstein, Actos de Habla y Filosofía de la Mente',
      ]),
      syl('FIL-2301', 'Filosofía Medieval y Filosofía Moderna (Descartes, Spinoza, Hume y Kant)', '📜', 'purple', 3, 4, 'San Agustín, Santo Tomás de Aquino, racionalismo continental, empirismo británico e idealismo trascendental en la Crítica de la Razón Pura.', [
        'Patrística y Escolástica Medieval (Agustín de Hipona, Anselmo, Tomás de Aquino, Duns Escoto y Ockham)',
        'Racionalismo (Descartes, Spinoza, Leibniz), Empirismo (Locke, Hume) y Giro Copernicano de Immanuel Kant (Tres Críticas)',
      ]),
      syl('FIL-2501', 'Filosofía Contemporánea Continental: Hegel, Nietzsche, Fenomenología (Husserl, Heidegger) y Hermenéutica (Gadamer)', '🌌', 'rose', 5, 4, 'Dialéctica en la Fenomenología del Espíritu de Hegel, genealogía de la moral en Nietzsche, intencionalidad en Husserl y analítica del Dasein en Ser y Tiempo.', [
        'Idealismo Alemán (Hegel), Sospecha Genealógica (Marx, Nietzsche) y Fenomenología Trascendental de Edmund Husserl',
        'Ontología Fundamental en Ser y Tiempo de Martin Heidegger, Hermenéutica Filosófica (Gadamer, Ricoeur) y Posestructuralismo (Foucault, Deleuze)',
      ]),
      syl('FIL-2601', 'Metafísica, Epistemología, Ética, Estética y Filosofía Política', '⚖️', 'emerald', 6, 4, 'Teorías de la verdad y la justificación epistémica, deontología vs utilitarismo vs ética de las virtudes, juicio estético y filosofía latinoamericana.', [
        'Epistemología Contemporánea (Problema de Gettier, Fundacionalismo, Coherentismo, Epistemología de las Virtudes)',
        'Debates Metaéticos y Normativos, Estética Filosófica y Pensamiento Filosófico en Colombia y América Latina',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_lic_filosofia',
    name: 'Licenciatura en Filosofía',
    faculty: 'Filosofía',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🎓',
    description: 'Pensum completo PUJ Bogotá: formación filosófica rigurosa integrada con pedagogía, didáctica de la filosofía, filosofía para niños y jóvenes, diseño curricular y práctica docente.',
    subjects: [
      syl('LFI-1101', 'Tradición Filosófica Occidental (Antigua, Medieval, Moderna y Contemporánea)', '🦉', 'amber', 1, 5, 'Seminarios de autor sobre Platón, Aristóteles, Tomás de Aquino, Descartes, Kant, Hegel, Nietzsche, Heidegger y Wittgenstein.', [
        'Lectura Hermenéutica y Comentario de Textos Filosóficos Clásicos, Modernos y Contemporáneos',
      ]),
      syl('LFI-2301', 'Pedagogía, Didáctica de la Filosofía y Filosofía para Niños (Matthew Lipman)', '🏫', 'blue', 3, 4, 'Enseñabilidad de la filosofía, comunidades de indagación filosófica, enseñanza del pensamiento crítico y argumentación en el aula.', [
        'Didáctica Problematizadora de la Filosofía, Comunidades de Diálogo (Lipman) y Desarrollo del Pensamiento Crítico y Ético',
      ]),
      syl('LFI-2601', 'Currículo, Evaluación Educativa, Educación para la Paz y Práctica Docente en Filosofía', '🕊️', 'emerald', 6, 5, 'Orientaciones pedagógicas del MEN para Filosofía en educación media, formación ciudadana y práctica pedagógica investigativa.', [
        'Diseño de Planes de Área de Filosofía, Ética y Cátedra de la Paz y Práctica Pedagógica en Instituciones Educativas',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 15. FACULTAD DE EDUCACIÓN (4 PREGRADOS)
  // --------------------------------------------------------------------------
  {
    id: 'puj_educacion_infantil',
    name: 'Licenciatura en Educación Infantil',
    faculty: 'Educación',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🧸',
    description: 'Pensum completo PUJ Bogotá: desarrollo integral en primera infancia, actividades rectoras (juego, arte, literatura, exploración del medio), procesos de lectura y escritura inicial, pensamiento matemático infantil, inclusión y práctica pedagógica.',
    subjects: [
      syl('LEI-1101', 'Infancias, Desarrollo Integral Infantil y Neurodesarrollo (0 a 8 años)', '👶', 'rose', 1, 4, 'Historia social de la infancia, desarrollo psicomotor, cognitivo, lingüístico y socioafectivo y políticas públicas de primera infancia (De Cero a Siempre).', [
        'Hitos del Neurodesarrollo en la Primera Infancia, Vínculo Afectivo y Políticas de Atención Integral',
      ]),
      syl('LEI-2301', 'Pedagogía Infantil y Actividades Rectoras: Juego, Arte, Literatura y Exploración del Medio', '🎨', 'amber', 3, 4, 'Modelos pedagógicos (Montessori, Reggio Emilia, Freinet, Decroly), diseño de ambientes de aprendizaje y experiencias pedagógicas.', [
        'Pedagogías Activas (Montessori, Reggio Emilia) y Diseño de Ambientes Provocadores basados en el Juego y el Arte',
      ]),
      syl('LEI-2501', 'Didáctica de la Lengua Materna (Lectoescritura Inicial) y del Pensamiento Lógico-Matemático Infantil', '🔢', 'blue', 5, 4, 'Psicogénesis de la lengua escrita (Emilia Ferreiro), literatura infantil, noción de número, espacio, medida y resolución de problemas.', [
        'Psicogénesis de la Escritura (Ferreiro & Teberosky), Conciencia Fonológica y Construcción del Concepto de Número en el Niño',
      ]),
      syl('LEI-2701', 'Educación Inclusiva (DUA), Familia, Escuela y Práctica Pedagógica Investigativa', '🏫', 'emerald', 7, 6, 'Diseño Universal para el Aprendizaje (DUA), Planes Individuales de Ajustes Razonables (PIAR) y sistematización de experiencias docentes.', [
        'Atención a la Diversidad, Elaboración de PIAR (Decreto 1421) y Sistematización de la Práctica Pedagógica',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_lic_ciencias_naturales',
    name: 'Licenciatura en Ciencias Naturales y Educación Ambiental',
    faculty: 'Educación',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🌱',
    description: 'Pensum completo PUJ Bogotá: biología, química y física escolar integrada, epistemología e historia de las ciencias, didáctica de las ciencias experimentales, educación ambiental (PRAE) y práctica docente.',
    subjects: [
      syl('LCN-1101', 'Fundamentos Disciplinares Integrados de Biología, Química y Física para Educadores', '🔬', 'emerald', 1, 5, 'Sistemas vivos, estructura de la materia, reacciones químicas, mecánica, energía y trabajo experimental en laboratorio escolar.', [
        'Integración de Conceptos Estructurantes de la Biología, la Química y la Física mediante Indagación Científica',
      ]),
      syl('LCN-2401', 'Didáctica de las Ciencias Naturales, Cambio Conceptual y Aprendizaje por Indagación (STEM)', '🧪', 'blue', 4, 4, 'Ideas previas / concepciones alternativas de los estudiantes, modelización científica escolar, trabajo práctico de laboratorio y enfoque CTSA / STEM.', [
        'Transposición Didáctica (Chevallard), Cambio Conceptual, Aprendizaje Basado en Indagación y Proyectos STEM',
      ]),
      syl('LCN-2601', 'Educación Ambiental, Proyectos Ambientales Escolares (PRAE), Cambio Climático y Práctica Docente', '🌍', 'amber', 6, 5, 'Política Nacional de Educación Ambiental, formulación de PRAE y PROCEDA, sustentabilidad territorial y práctica en colegios.', [
        'Diseño e Implementación de Proyectos Ambientales Escolares (PRAE), Ciudadanía Ambiental y Práctica Pedagógica',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_lic_educacion_fisica',
    name: 'Licenciatura en Educación Física',
    faculty: 'Educación',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🏃',
    description: 'Pensum completo PUJ Bogotá: morfofisiología del ejercicio, biomecánica deportiva, motricidad humana, didáctica de los deportes individuales y de conjunto, prescripción del ejercicio para la salud y recreación.',
    subjects: [
      syl('LEF-1101', 'Anatomía Funcional, Fisiología del Ejercicio y Biomecánica del Movimiento Humano', '🫀', 'rose', 1, 4, 'Sistemas energéticos (ATP-PC, glucólisis anaerobia, oxidativo), consumo máximo de oxígeno (VO2 máx), adaptaciones cardiovasculares y análisis cinemático.', [
        'Bioenergética Muscular, Respuestas Agudas y Adaptaciones Crónicas al Ejercicio Aeróbico y de Fuerza',
      ]),
      syl('LEF-2301', 'Desarrollo Motor, Psicomotricidad y Expresión Corporal', '🤸', 'amber', 3, 4, 'Habilidades motrices básicas y específicas, capacidades coordinativas y condicionales, esquema corporal y lúdica.', [
        'Fases del Desarrollo Motor, Coordinación Visomotriz, Equilibrio, Lateralidad y Pedagogía de la Motricidad',
      ]),
      syl('LEF-2501', 'Teoría y Metodología del Entrenamiento Deportivo y Didáctica de los Deportes', '⚽', 'emerald', 5, 4, 'Principios del entrenamiento (supercompensación, sobrecarga), periodización (macrociclo, mesociclo, microciclo) y didáctica de deportes individuales y colectivos.', [
        'Planificación y Periodización del Entrenamiento Deportivo y Enseñanza Comprensiva del Deporte (TGfU)',
      ]),
      syl('LEF-2701', 'Actividad Física para la Salud, Deporte Adaptado / Inclusivo y Gestión Deportiva', '🏅', 'blue', 7, 4, 'Prescripción del ejercicio en poblaciones especiales, deporte paralímpico, recreación comunitaria y administración de organizaciones deportivas.', [
        'Prescripción del Ejercicio para la Salud Pública, Educación Física Adaptada y Práctica Pedagógica Escolar',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  {
    id: 'puj_lic_literatura',
    name: 'Licenciatura en Literatura y Lengua Castellana',
    faculty: 'Educación',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '✍️',
    description: 'Pensum completo PUJ Bogotá: lingüística hispánica, gramática y análisis del discurso, literatura universal, latinoamericana y colombiana, promoción de lectura, didáctica de la lengua y la literatura y práctica docente.',
    subjects: [
      syl('LLL-1101', 'Lingüística del Español: Fonología, Morfosintaxis, Semántica y Análisis del Discurso', '🗣️', 'blue', 1, 4, 'Gramática descriptiva de la lengua española, variedades del español de América y de Colombia, lingüística textual y lectura crítica.', [
        'Estructura Morfosintáctica del Español, Cohesión, Coherencia, Tipologías Textuales y Análisis Crítico del Discurso (Van Dijk)',
      ]),
      syl('LLL-2301', 'Tradición Literaria Universal, Hispanoamericana, Colombiana y Literatura Infantil y Juvenil (LIJ)', '📚', 'purple', 3, 4, 'Canon literario, poesía, narrativa, dramaturgia, ensayo y mediación estética de la literatura infantil y juvenil en la escuela.', [
        'Historia y Crítica de la Literatura Hispanoamericana y Colombiana y Canon Escolar de Literatura Infantil y Juvenil',
      ]),
      syl('LLL-2601', 'Didáctica de la Lectura, la Escritura y la Oralidad, Mediación Lectora y Práctica Pedagógica', '🏫', 'emerald', 6, 5, 'Enfoque comunicativo y sociocultural (Cassany, Delia Lerner), talleres de escritura académica y creativa, clubes de lectura y práctica en aula.', [
        'Procesos de Comprensión y Producción Textual en el Aula, Alfabetización Multimodal y Práctica Docente Investigativa',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 16. FACULTAD DE ESTUDIOS AMBIENTALES Y RURALES (1 PREGRADO)
  // --------------------------------------------------------------------------
  {
    id: 'puj_ecologia',
    name: 'Ecología',
    faculty: 'Estudios Ambientales y Rurales',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🌳',
    description: 'Pensum completo PUJ Bogotá: sistemas socioecológicos, climatología y edafología, ecología de poblaciones, comunidades y del paisaje (SIG y teledetección), restauración ecológica, gestión ambiental, servicios ecosistémicos y salidas de campo.',
    subjects: [
      syl('ECOG-1101', 'Ecología Fundamental, Climatología, Geomorfológía y Edafología (Suelos)', '🌍', 'emerald', 1, 4, 'Factores bióticos y abióticos, circulación atmosférica, zonas de vida de Holdridge, génesis de suelos y biomas de Colombia (páramos, bosques andinos, humedales, selvas).', [
        'Climatología Tropical, Cuencas Hidrográficas, Propiedades Físico-Químicas del Suelo y Ecosistemas Estratégicos de Colombia',
      ]),
      syl('ECOG-2301', 'Ecología de Poblaciones y Comunidades (Modelado Cuantitativo en R y Salidas de Campo)', '🦎', 'blue', 3, 4, 'Muestreo de flora y fauna en campo, demografía ecológica, nicho ecológico (Hutchinson), competencia, depredación, mutualismo y diversidad biológica.', [
        'Diseño de Muestreo Ecológico en Campo, Índices de Diversidad (Shannon, Simpson, Números de Hill) y Estadística Multivariada en R',
      ]),
      syl('ECOG-2501', 'Ecología del Paisaje, Sistemas de Información Geográfica (SIG) y Teledetección Satelital', '🛰️', 'purple', 5, 4, 'Fragmentación de hábitats, conectividad ecológica, métricas del paisaje (Fragstats), procesamiento de imágenes satelitales (Landsat, Sentinel) y cartografía en QGIS/ArcGIS.', [
        'Matriz-Parche-Corredor, Efecto de Borde, Conectividad Funcional y Clasificación de Coberturas de la Tierra (Corine Land Cover)',
      ]),
      syl('ECOG-2601', 'Sistemas Socioecológicos, Gobernanza Ambiental, Desarrollo Rural y Servicios Ecosistémicos', '🤝', 'amber', 6, 4, 'Marco de Elinor Ostrom (bienes comunes), valoración integral de la biodiversidad y los servicios ecosistémicos, agroecología y conflictos socioambientales.', [
        'Gobernanza de Bienes Comunes (Elinor Ostrom), Agroecología Campesina, Ordenamiento Ambiental del Territorio (POMCA) y Cambio Climático',
      ]),
      syl('ECOG-3701', 'Restauración Ecológica, Biología de la Conservación y Evaluación de Impacto Ambiental (EIA)', '🌱', 'emerald', 7, 4, 'Sucesión ecológica asistida, áreas protegidas (SINAP), especies amenazadas (UICN), estudios de impacto ambiental, licenciamiento ANLA y compensaciones por pérdida de biodiversidad.', [
        'Diseño de Proyectos de Restauración Ecológica Activa y Pasiva, Estudios de Impacto Ambiental (EIA) y Planes de Manejo Ambiental (PMA)',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 17. FACULTAD DE TEOLOGÍA (1 PREGRADO)
  // --------------------------------------------------------------------------
  {
    id: 'puj_teologia',
    name: 'Teología',
    faculty: 'Teología',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 144,
    emoji: '🕊️',
    description: 'Pensum completo PUJ Bogotá: Sagrada Escritura (Antiguo y Nuevo Testamento, hebreo y griego bíblico), teología sistemática (Cristología, Trinidad, Eclesiología, Antropología Teológica), teología moral, pastoral y ecumenismo.',
    subjects: [
      syl('TEO-1101', 'Introducción a la Sagrada Escritura, Pentateuco, Libros Históricos, Proféticos y Sapienciales (Antiguo Testamento)', '📜', 'amber', 1, 4, 'Inspiración y canon bíblico, hermenéutica bíblica (Dei Verbum), historia de Israel, tradición yahvista/sacerdotal, profetismo y literatura sapiencial.', [
        'Métodos Exegéticos (Histórico-Crítico, Narrativo, Contextual), Teología de la Alianza en el Pentateuco y Mensaje de los Profetas',
      ]),
      syl('TEO-1201', 'Evangelios Sinópticos, Escritos Joánicos y Corpus Paulino (Nuevo Testamento) + Griego y Hebreo Bíblico', '📖', 'blue', 2, 4, 'El Jesús histórico y el Cristo de la fe, problema sinóptico (Marcos, Mateo, Lucas-Hechos), teología de Pablo y cristología de Juan.', [
        'Exégesis de los Evangelios Sinópticos (Parábolas del Reino), Cartas Paulinas (Justificación y Gracia) y Literatura Joánica',
      ]),
      syl('TEO-2401', 'Teología Sistemática: Revelación, Cristología, Misterio de Dios Uno y Trino, Antropología Teológica y Eclesiología', '🕊️', 'purple', 4, 5, 'Concilios ecuménicos (Nicea, Calcedonia, Vaticano II), teología de la gracia, sacramentos y misión de la Iglesia en el mundo contemporáneo.', [
        'Desarrollo Dogmático de la Cristología y la Trinidad, Eclesiología de Comunión (Lumen Gentium) y Teología Sacramental',
      ]),
      syl('TEO-2601', 'Teología Moral Fundamental, Bioética Teológica, Doctrina Social de la Iglesia y Teología Latinoamericana', '🤝', 'emerald', 6, 4, 'Conciencia moral, discernimiento ignaciano, opción preferencial por los pobres (Medellín, Puebla, Aparecida), ecología integral y diálogo interreligioso.', [
        'Teología de la Acción Humana, Doctrina Social de la Iglesia, Método Ver-Juzgar-Actuar en América Latina y Diálogo Ecuménico e Interreligioso',
      ]),
      ...NFF_JAVERIANO,
    ],
  },

  // --------------------------------------------------------------------------
  // 18. PLAN ABIERTO / DOBLE PROGRAMA / OTRA CARRERA
  // --------------------------------------------------------------------------
  {
    id: 'personalizada',
    name: 'Personalizada / Doble Programa / Otra Carrera',
    faculty: 'Plan Abierto',
    university: 'Pontificia Universidad Javeriana · Sede Bogotá',
    semesters: 8,
    totalCredits: 140,
    emoji: '✨',
    description: 'Crea tu propio plan de estudios desde cero o combina asignaturas de múltiples carreras de la Javeriana (Doble Programa o Énfasis).',
    subjects: [],
  },
];
