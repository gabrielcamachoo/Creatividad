export interface MethodologyPhase {
  number: string;
  title: string;
  whatIs: string;
  whatWeDid: string;
  subtools?: { name: string; range: string; desc: string }[];
  evaluation?: { name: string; score: string; detail: string }[];
  result: string;
  highlightBox?: string;
}

export const TEAM_MEMBERS = [
  { name: 'Santiago Echeverry', role: 'Investigación & Ideación' },
  { name: 'Gabriel Camacho', role: 'Modelado & Metodología' },
  { name: 'Alejandro Jimenez', role: 'Arquitectura & Síntesis' },
  { name: 'Sebastian Galvis', role: 'Prototipado & Frontend' },
];

export const METHODOLOGY_PHASES: MethodologyPhase[] = [
  {
    number: '01',
    title: 'Fase 1: Detectives del Problema (Parcial 1)',
    whatIs: 'Investigar al usuario a profundidad con entrevistas empáticas para entender la raíz del dolor.',
    whatWeDid:
      'Realizamos 4 entrevistas reales a estudiantes universitarios con diferentes métodos de toma de notas (cuaderno, iPad, carpetas y grabaciones). Analizamos cómo estudian fuera del aula y descubrimos que guardar apuntes no da continuidad.',
    result:
      'Formulación del reto central (HMW): "¿Cómo podríamos ayudar a los estudiantes universitarios a identificar y hacer seguimiento oportuno de lo que dominan y necesitan reforzar fuera de clase?"',
  },
  {
    number: '02',
    title: 'Fase 2: Divergencia (Generación de 100 Ideas)',
    whatIs: 'Expandir el espacio de soluciones sin juzgar ninguna idea, buscando volumen y originalidad.',
    whatWeDid:
      'Desplegamos 3 herramientas de creatividad estructurada para alcanzar exactamente 100 propuestas:',
    subtools: [
      {
        name: 'Brainstorming Libre',
        range: 'Ideas #01 a #40',
        desc: 'Lluvia de ideas asociativa y fluida sobre notas, alertas y recordatorios.',
      },
      {
        name: 'Conexiones Visuales',
        range: 'Ideas #41 a #70',
        desc: 'Conexión con objetos cotidianos como el semáforo vial, la batería de celular, líneas de metro y pesas de gimnasio con la noción de "retomar el hilo".',
      },
      {
        name: 'SCAMPER',
        range: 'Ideas #71 a #100',
        desc: 'Sustituir, Combinar, Adaptar, Modificar, Usar para otros fines, Eliminar y Reordenar tableros de notas existentes.',
      },
    ],
    result: '100 ideas consignadas en pliegos de papel periódico, post-its y 4 tableros colaborativos de Jamboard.',
  },
  {
    number: '03',
    title: 'Fase 3: Convergencia (Selección Rigurosa)',
    whatIs: 'Filtrar, clasificar y priorizar las ideas más potentes mediante criterios de impacto y factibilidad.',
    whatWeDid:
      'Sometimos las 100 ideas a dos filtros sucesivos de diseño:',
    evaluation: [
      {
        name: 'Clusters y Votación con Hits',
        score: '12 / 12 puntos',
        detail:
          'Se agruparon las 100 ideas en 6 clusters temáticos. Cada integrante tuvo 3 votos. El cluster "Semáforo de dominio" obtuvo 12 puntos: unanimidad total.',
      },
      {
        name: 'Matriz "¿Cómo?, Ahora, ¡¡¡WOW!!!"',
        score: '4.8 / 4.8 / 5.0',
        detail:
          'Evaluación en Originalidad (4.8/5), Factibilidad (4.8/5) e Impacto (5.0/5). La fusión de ideas #22 + #38 + #42 (Semáforo + Batería de 7 días) quedó en el cuadrante ¡¡¡WOW!!!',
      },
    ],
    result: 'Selección unánime de la solución híbrida: Semáforo de Dominio + Batería de 7 Días.',
  },
  {
    number: '04',
    title: 'Fase 4: Definición de la Idea Final',
    whatIs: 'Redactar la declaración formal de valor mediante la fórmula estandarizada de Design Thinking.',
    whatWeDid:
      'Estructuramos la propuesta bajo el formato: "Desarrollaremos [idea] para [público] con el fin de [objetivo], utilizando [método]".',
    result: 'Declaración de valor consensuada y aprobada para construcción de prototipo.',
    highlightBox:
      '«Desarrollaremos un tablero híbrido de seguimiento por semáforo y batería de frescura para estudiantes universitarios con varias asignaturas, con el fin de identificar oportunamente qué temas dominan, cuáles olvidan y cuáles reforzar, utilizando una plantilla visual con alertas de 7 días.»',
  },
  {
    number: '05',
    title: 'Fase 5: Materialización (Del Boceto al Prototipo)',
    whatIs: 'Hacer tangible la solución para poder probarla de inmediato con usuarios reales.',
    whatWeDid:
      'Comenzamos con un boceto en papel (sketch) con encabezado por materia, semáforo de 3 estados, batería de 3 bloques y lista de ataque. Esta aplicación web es su evolución digital directa: interactiva, reactiva y con gamificación para retención saludable.',
    result: 'Prototipo funcional demostrable en 5-8 minutos con simulación de tiempo real y cálculo de prioridades.',
  },
];
