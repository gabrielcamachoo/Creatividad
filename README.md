# SemáforoQuest: Semáforo + Batería de 7 Días 🚦🔋

> **Prototipo Demostrable de Design Thinking**  
> **Proyecto:** Desafío 2 – *"Del Problema a la Solución Creativa: Continuidad del aprendizaje universitario fuera de clase"*  
> **Equipo:** Santiago Echeverry, Gabriel Camacho, Alejandro Jimenez, Sebastian Galvis.

---

## 🌟 ¿Qué es SemáforoQuest?

**SemáforoQuest** es una aplicación web interactiva, responsive y gamificada éticamente, diseñada para estudiantes universitarios que cursan múltiples materias simultáneamente.

Resuelve el problema central detectado en 4 entrevistas a profundidad: **guardar apuntes no da continuidad**. Los estudiantes olvidan temas antiguos, descubren vacíos tarde (en parciales o quizzes) y les cuesta retomar el hilo tras semanas sin repasar.

La solución combina:
1. **Semáforo de Dominio:** Verde ✔ (sé explicarlo y resolver problemas), Amarillo ⚠ (entiendo teoría pero falta práctica), Rojo ✖ (vacío conceptual crítico).
2. **Batería de Frescura (7 días):** Cada 7 días sin repasar, el tema pierde 1 bloque (3/3 -> 2/3 -> 1/3 -> 0/3 "En riesgo").
3. **Priorizador Automático & Modo Parcial:** Ataca primero los rojos y las baterías bajas, planificando el estudio diario hacia la fecha del examen.
4. **Hook Model Ético:** Misión rápida de menos de 2 minutos, cofre diario con recompensas variables, mascota interactiva ("Bati"), insignias, tienda de accesorios con Voltios ⚡ y escudos que protegen tu racha sin estrés.

---

## 🔬 Metodología de Design Thinking (Resumen de las 5 Fases)

1. **Fase 1 – Detectives del Problema (Parcial 1):**  
   4 entrevistas a estudiantes universitarios con diferentes métodos de toma de notas.  
   *Resultado:* Reto HMW: *"¿Cómo podríamos ayudar a los estudiantes universitarios a identificar y hacer seguimiento oportuno de lo que dominan y necesitan reforzar fuera de clase?"*.
2. **Fase 2 – Divergencia (100 Ideas):**  
   - Brainstorming libre (Ideas #01 a #40).
   - Conexiones Visuales (Ideas #41 a #70: semáforo vial, batería, metro, gimnasio).
   - SCAMPER (Ideas #71 a #100: sustituir, combinar, adaptar, modificar, etc.).  
   *Resultado:* 100 ideas documentadas en papel periódico, post-its y tableros Jamboard.
3. **Fase 3 – Convergencia (Selección Rigurosa):**  
   - Clusters y Hits: 6 clusters temáticos; el cluster "Semáforo de dominio" obtuvo 12/12 puntos posibles.
   - Matriz WOW (Originalidad, Factibilidad e Impacto): La idea Semáforo + Batería (#22+#38+#42) obtuvo 4.8 / 4.8 / 5.0, ubicándose en el cuadrante ¡¡¡WOW!!!
4. **Fase 4 – Definición de la Idea Final:**  
   *Declaración formal:* «Desarrollaremos un tablero híbrido de seguimiento por semáforo y batería de frescura para estudiantes universitarios con varias asignaturas, con el fin de identificar oportunamente qué temas dominan, cuáles olvidan y cuáles reforzar, utilizando una plantilla visual con alertas de 7 días.»
5. **Fase 5 – Materialización:**  
   Del sketch/boceto en papel a este prototipo digital funcional con React, Vite, Tailwind CSS, TypeScript y Zustand.

---

## ⚡ Tabla de Recompensas y Economía Ética

| Acción del Estudiante | Recompensa XP | Voltios Ganados ⚡ | Límite Anti-Grind Diario |
| :--- | :--- | :--- | :--- |
| **Registrar nuevo tema visto en clase** | `+10 XP` | `+1 ⚡` | Máx. 10 veces / día |
| **Repasar tema con batería baja (1 o 0 bloques)** | `+20 XP` | `+2 ⚡` | Máx. 15 veces / día |
| **Subir tema de Rojo a Amarillo** | `+30 XP` | `+3 ⚡` | Sin límite |
| **Subir tema a Verde ("Sello de Dominio")** | `+50 XP` | `+5 ⚡` | Sin límite |
| **Completar reto "Explica en 60s" con autoevaluación** | `+15 XP` | `+1 ⚡` | Máx. 8 veces / día |
| **Bono "Mundo Cargado" (materia 100% baterías llenas)** | `+100 XP` | `+10 ⚡` | 1 vez por materia / día |

### Rangos de Maestría:
- **Novato:** 0 a 199 XP (Nivel 1)
- **Explorador:** 200 a 499 XP (Nivel 2)
- **Estratega:** 500 a 999 XP (Nivel 3)
- **Maestro del Hilo:** 1000+ XP (Nivel 4)

### Probabilidades del Cofre Diario 🎁:
- **60%:** 15 a 40 Voltios ⚡
- **25%:** 50 a 100 XP Extra 🧠
- **10%:** Cosmético exclusivo para Bati (Gafas oscuras o Birrete)
- **5%:** Escudo de Racha 🛡️

---

## ⏱️ Guion de Demostración en Vivo (5 a 8 minutos)

Utiliza la **Barra de Modo Presentación** fijada en la parte inferior de la pantalla:

1. **Minuto 0:00 - 1:00 (Contexto y Problema):**  
   - Abre la pestaña **"Metodología DT"** o navega desde el Home.  
   - Muestra el embudo: *4 entrevistas → 100 ideas → 6 clusters → 3 ideas WOW → Prototipo*.  
   - Explica el dolor: los estudiantes olvidan temas antiguos porque sus apuntes son pasivos.
2. **Minuto 1:00 - 2:30 (El Tablero Principal y Bati):**  
   - Haz clic en **"Tablero"**.  
   - Señala a la mascota **Bati** (está en estado Feliz porque cargamos los datos de demo).  
   - Muestra los contadores de semáforo y las 3 materias (Física, Cálculo y Programación).  
   - Destaca la tarjeta **"Misión de Hoy (< 2 min)"**: sugiere los 3 temas más urgentes.
3. **Minuto 2:30 - 4:00 (Simulación del Paso del Tiempo):**  
   - En el dock inferior, haz clic en **"Simular +7 Días"**.  
   - **¡Momento WOW de la presentación!** Observa cómo bajan las barras de batería a 2/3 o 1/3 bloques y cómo la expresión de Bati cambia a *Cansada* con su mensaje de alerta.  
   - Entra a **Física Mecánica**, marca un tema en Rojo y pulsa **"Reto 60s"**. Muestra el temporizador y la autoevaluación guiada.
   - Pulsa **"Repasé hoy"**: la batería se recarga inmediatamente a 3/3 bloques, suben los XP y Voltios.
4. **Minuto 4:00 - 5:30 (Priorizador & Modo Parcial):**  
   - Haz clic en **"Priorizador"**.  
   - Muestra cómo los temas en Rojo y baterías bajas se ordenan automáticamente en primer lugar.  
   - Genera un plan en el **Modo Parcial** ingresando la fecha de examen.
5. **Minuto 5:30 - 7:00 (Gamificación Ética y Tienda):**  
   - Ve a **"Recompensas"**.  
   - Pulsa **"Abrir Cofre Diario"** y disfruta la animación con confeti discreto.  
   - Muestra las **12 insignias** con sus pistas y el **Ranking simulado** entre compañeros.  
   - Entra a la **Tienda de Bati**, compra un accesorio (ej. Birrete o Gafas) con los Voltios ganados y muéstralo equipado.
6. **Minuto 7:00 - 8:00 (Protección de Racha & Perfil):**  
   - En el dock inferior, haz clic en **"+1 Día"** sin repasar: muestra cómo el **Escudo de Racha** protege el fuego del estudiante evitando frustración.  
   - Abre el **"Perfil"** para ver la gráfica de constancia semanal con Recharts y el resumen automático verbalizado.

---

## 💻 Cómo Correr el Proyecto Localmente

Requisitos: Node.js 18+ y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. Correr pruebas unitarias (Vitest)
npm run test

# 3. Iniciar servidor de desarrollo local
npm run dev

# 4. Abrir en el navegador:
# http://localhost:5173
```

---

## 🚀 Cómo Desplegarlo Gratis

El proyecto está 100% libre de backend y base de datos (utiliza `localStorage` con arquitectura estática pura).

### Opción 1: Vercel / Netlify
1. Conecta tu repositorio de GitHub en [vercel.com](https://vercel.com) o [netlify.com](https://netlify.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. ¡Listo! Despliegue en 30 segundos.

### Opción 2: GitHub Pages
1. Ejecuta `npm run build`.
2. Sube el contenido de la carpeta `dist/` a la rama `gh-pages` de tu repositorio. Gracias a `base: './'` en `vite.config.ts`, funcionará sin problemas en cualquier ruta.

---

## 📋 Arquitectura de Carpetas

```text
src/
├── config/rewards.config.ts       # Configuración centralizada de economía y probabilidades
├── data/                          # Datos de ejemplo (3 materias, 13 temas) y metodología DT
├── lib/                           # Motores puros testeados con Vitest (tiempo, estudio, recompensas)
├── store/                         # Zustand persistente (Study, Gamification, Time, Settings)
├── types/                         # Interfaces TypeScript rigurosas
├── components/                    # Componentes atómicos (BatiAvatar, BatteryBar, TrafficLightBadge, etc.)
└── features/                      # Vistas principales (Home, Dashboard, Prioritizer, Rewards, Profile, etc.)
```
