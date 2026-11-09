import React, { useState, useEffect, useMemo } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTimeStore } from '@/store/useTimeStore';
import { soundEngine } from '@/lib/soundEffects';
import { api } from '@/lib/api';
import { MasteryLevel } from '@/types';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Brain,
  Layers,
  Timer,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  BookOpen,
  Award,
} from 'lucide-react';

type ArenaMode = 'pomodoro' | 'flashcards' | 'feynman';

const PRESET_TIMERS = [
  { id: 'pomo25', label: 'Pomodoro 25m', minutes: 25, xp: 40, volts: 12, badge: '🍅 Clásico' },
  { id: 'deep45', label: 'Deep Work 45m', minutes: 45, xp: 70, volts: 20, badge: '🏛️ Bloque U' },
  { id: 'sprint15', label: 'Sprint 15m', minutes: 15, xp: 25, volts: 8, badge: '⚡ Repaso' },
  { id: 'break5', label: 'Descanso 5m', minutes: 5, xp: 10, volts: 2, badge: '☕ Pausa' },
];

const ANIMAL_EMOJIS: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
  condor: '🦅',
  bear: '🐻',
  capybara: '🦫',
  fenix: '🔥',
};

export const FocusArenaScreen: React.FC = () => {
  const { subjects, updateTopicStatus, updateTopicSummary, reviewTopicToday } = useStudyStore();
  const {
    addXP,
    addVolts,
    recordTopicReview,
    recordStatusChange,
    checkAndAwardBadges,
    equippedBati,
  } = useGamificationStore();
  const { selectedSubjectId, setActiveView, userProfile } = useSettingsStore();
  const { getSimulatedDateStr } = useTimeStore();
  const today = getSimulatedDateStr();

  const [mode, setMode] = useState<ArenaMode>('pomodoro');
  const [filterSubjectId, setFilterSubjectId] = useState<string>(selectedSubjectId || 'ALL');
  const [onlyUrgent, setOnlyUrgent] = useState<boolean>(false);

  // Estado Pomodoro
  const [selectedPreset, setSelectedPreset] = useState(PRESET_TIMERS[0]);
  const [secondsLeft, setSecondsLeft] = useState(PRESET_TIMERS[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientMode, setAmbientMode] = useState<'off' | 'brown' | 'rain' | 'library'>('off');
  const [pomodoroTargetTopicId, setPomodoroTargetTopicId] = useState<string>('');
  const [sessionBanner, setSessionBanner] = useState<string>('');

  // Estado Flashcards
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCountInSession, setReviewedCountInSession] = useState(0);

  // Estado Feynman
  const [feynmanText, setFeynmanText] = useState('');

  // Lista plana de temas filtrados
  const deck = useMemo(() => {
    const list: Array<{
      subjectId: string;
      subjectName: string;
      subjectEmoji: string;
      subjectCode: string;
      id: string;
      name: string;
      status: MasteryLevel;
      summary?: string;
    }> = [];

    subjects.forEach((sub) => {
      if (filterSubjectId !== 'ALL' && sub.id !== filterSubjectId) return;
      sub.topics.forEach((t) => {
        if (onlyUrgent && t.status === 'green') return;
        list.push({
          subjectId: sub.id,
          subjectName: sub.name,
          subjectEmoji: sub.emoji || '📚',
          subjectCode: sub.code,
          id: t.id,
          name: t.name,
          status: t.status,
          summary: t.summary,
        });
      });
    });

    // Ordenar primero Rojos, luego Amarillos, luego Verdes
    const order: Record<MasteryLevel, number> = { red: 0, yellow: 1, green: 2 };
    return list.sort((a, b) => order[a.status] - order[b.status]);
  }, [subjects, filterSubjectId, onlyUrgent]);

  const currentCard = deck[cardIndex] || deck[0] || null;
  const activePomodoroTopic =
    deck.find((d) => d.id === pomodoroTargetTopicId) || deck[0] || null;

  // Limpiar audio ambiental al salir de la pantalla
  useEffect(() => {
    return () => {
      soundEngine.stopAmbientFocus();
    };
  }, []);

  // Temporizador en tiempo real
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          soundEngine.stopAmbientFocus();
          setAmbientMode('off');
          soundEngine.playChestFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Sincronizar texto de Feynman con la tarjeta actual
  useEffect(() => {
    if (currentCard) {
      setFeynmanText(currentCard.summary || '');
    }
  }, [currentCard?.id]);

  const handleSelectPreset = (preset: (typeof PRESET_TIMERS)[0]) => {
    setIsRunning(false);
    setSelectedPreset(preset);
    setSecondsLeft(preset.minutes * 60);
  };

  const toggleAmbient = (newAmbient: 'off' | 'brown' | 'rain') => {
    setAmbientMode(newAmbient);
    soundEngine.startAmbientFocus(newAmbient);
  };

  const handleCompletePomodoroSession = async (upgradeStatus?: MasteryLevel) => {
    soundEngine.playChestFanfare();
    addXP(selectedPreset.xp);
    addVolts(selectedPreset.volts);

    if (activePomodoroTopic) {
      reviewTopicToday(activePomodoroTopic.subjectId, activePomodoroTopic.id, today);
      recordTopicReview(today, true);
      try {
        await api.reviewTopic(activePomodoroTopic.id, today);
      } catch {}

      if (upgradeStatus && upgradeStatus !== activePomodoroTopic.status) {
        const res = updateTopicStatus(
          activePomodoroTopic.subjectId,
          activePomodoroTopic.id,
          upgradeStatus
        );
        if (res) recordStatusChange(res.oldStatus, res.newStatus);
        try {
          await api.updateTopic(activePomodoroTopic.id, { status: upgradeStatus });
        } catch {}
      }
    }

    checkAndAwardBadges(subjects, today);
    setIsRunning(false);
    setSecondsLeft(selectedPreset.minutes * 60);
    setSessionBanner(
      `🎉 ¡Sesión completada! Ganaste +${selectedPreset.xp} XP y +${selectedPreset.volts} Voltios ⚡.`
    );
    setTimeout(() => setSessionBanner(''), 4500);
  };

  const handleFlashcardGrade = async (newStatus: MasteryLevel) => {
    if (!currentCard) return;
    soundEngine.playSuccessChime();

    reviewTopicToday(currentCard.subjectId, currentCard.id, today);
    recordTopicReview(today, currentCard.status === 'red');

    if (newStatus !== currentCard.status) {
      const res = updateTopicStatus(currentCard.subjectId, currentCard.id, newStatus);
      if (res) recordStatusChange(res.oldStatus, res.newStatus);
      try {
        await api.updateTopic(currentCard.id, { status: newStatus });
      } catch {}
    }

    try {
      await api.reviewTopic(currentCard.id, today);
    } catch {}

    const bonusXp = newStatus === 'green' ? 30 : newStatus === 'yellow' ? 15 : 8;
    const bonusVolts = newStatus === 'green' ? 5 : 2;
    addXP(bonusXp);
    addVolts(bonusVolts);
    setReviewedCountInSession((c) => c + 1);
    checkAndAwardBadges(subjects, today);

    setIsFlipped(false);
    setCardIndex((idx) => (idx + 1 < deck.length ? idx + 1 : 0));
  };

  const handleSaveFeynman = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard || !feynmanText.trim()) return;

    soundEngine.playSuccessChime();
    updateTopicSummary(currentCard.subjectId, currentCard.id, feynmanText.trim());
    reviewTopicToday(currentCard.subjectId, currentCard.id, today);
    recordTopicReview(today, false);
    addXP(35);
    addVolts(10);

    try {
      await api.updateTopic(currentCard.id, { summary: feynmanText.trim() });
      await api.reviewTopic(currentCard.id, today);
    } catch {}

    setSessionBanner(
      `🧠 ¡Explicación Feynman guardada en "${currentCard.name}"! +35 XP y +10 Voltios ⚡`
    );
    setTimeout(() => setSessionBanner(''), 4000);
  };

  const totalSecs = selectedPreset.minutes * 60;
  const progressPct = totalSecs > 0 ? ((totalSecs - secondsLeft) / totalSecs) * 100 : 0;
  const mins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');
  const petEmoji =
    ANIMAL_EMOJIS[equippedBati.animal || userProfile.equippedAnimal || 'owl'] || '🦉';

  const wordCount = feynmanText.trim() ? feynmanText.trim().split(/\s+/).length : 0;
  const clarityScore = Math.min(100, Math.round((wordCount / 25) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in text-left">
      {/* Encabezado de alto impacto */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-white/10">
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="chip bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                <Brain className="w-3.5 h-3.5" />
                <span>Laboratorio de Aprendizaje Activo</span>
              </span>
              <span className="chip bg-white/10 text-slate-200 text-xs">
                Pomodoro · Flashcards 3D · Método Feynman
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black">
              Sala de Enfoque & Dominio Académico 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Convierte tus temas en 🔴 Rojo y 🟡 Amarillo en conocimiento sólido con sesiones de estudio profundo, tarjetas de recuerdo activo y sonido ambiental de biblioteca.
            </p>
          </div>

          {/* Selector de Modo */}
          <div className="flex p-1.5 rounded-2xl bg-white/10 backdrop-blur border border-white/10 shrink-0 self-start">
            {[
              { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
              { id: 'flashcards', label: 'Flashcards 3D', icon: Layers },
              { id: 'feynman', label: 'Feynman', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    setMode(tab.id as ArenaMode);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-heading font-black transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de filtros por materia */}
        <div className="relative mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Materia objetivo:</span>
            <select
              value={filterSubjectId}
              onChange={(e) => {
                setFilterSubjectId(e.target.value);
                setCardIndex(0);
                setIsFlipped(false);
              }}
              aria-label="Seleccionar materia para estudiar"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/15 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="ALL">📚 Todas mis materias ({deck.length} temas)</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name} ({s.topics.length} temas)
                </option>
              ))}
            </select>

            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 cursor-pointer ml-1">
              <input
                type="checkbox"
                checked={onlyUrgent}
                onChange={(e) => {
                  setOnlyUrgent(e.target.checked);
                  setCardIndex(0);
                }}
                className="rounded border-white/30 text-emerald-500 focus:ring-emerald-400"
              />
              <span>Solo temas 🔴 Rojos y 🟡 Amarillos</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
            <Award className="w-4 h-4" />
            <span>{reviewedCountInSession} temas repasados en esta sesión</span>
          </div>
        </div>
      </section>

      {sessionBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-scale-up">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{sessionBanner}</span>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="card p-10 text-center space-y-4">
          <div className="text-5xl">📚</div>
          <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
            Aún no tienes materias en tu tablero
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Agrega tu primera materia o importa el pensum de tu carrera de la Pontificia Universidad Javeriana para activar las Flashcards 3D y el Temporizador Pomodoro.
          </p>
          <button
            onClick={() => setActiveView('dashboard')}
            className="btn-game px-5 py-3 bg-emerald-500 text-white text-xs sm:text-sm"
          >
            Ir a mi Tablero Principal
          </button>
        </div>
      ) : mode === 'pomodoro' ? (
        /* MODO 1: POMODORO DEEP FOCUS + AUDIO AMBIENTAL */
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Reloj Circular */}
          <div className="lg:col-span-7 card p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {PRESET_TIMERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-heading font-black border transition-all ${
                    selectedPreset.id === p.id
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm scale-105'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span>{p.badge} · {p.label}</span>
                </button>
              ))}
            </div>

            {/* Anillo SVG del Temporizador */}
            <div className="relative w-60 h-60 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
              <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  strokeWidth="12"
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-800"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="stroke-emerald-500 transition-all duration-500"
                  strokeDasharray={2 * Math.PI * 96}
                  strokeDashoffset={
                    2 * Math.PI * 96 - ((2 * Math.PI * 96) * Math.min(100, progressPct)) / 100
                  }
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl mb-1 animate-float">{petEmoji}</span>
                <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {mins}:{secs}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  +{selectedPreset.xp} XP · +{selectedPreset.volts} ⚡
                </span>
              </div>
            </div>

            {/* Controles Play / Pause / Reset */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setIsRunning(!isRunning);
                }}
                className={`btn-game px-7 py-3.5 rounded-2xl text-sm font-heading font-black text-white ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-glow'
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isRunning ? 'Pausar bloque' : 'Iniciar Enfoque'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(selectedPreset.minutes * 60);
                }}
                className="btn-game p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Reiniciar reloj"
                aria-label="Reiniciar reloj"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Ambiental Web Audio API */}
            <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-center gap-1.5">
                {ambientMode === 'off' ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
                )}
                <span>Sonido Ambiental de Concentración (Generador Nativo):</span>
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { id: 'off', label: '🔇 Silencio' },
                  { id: 'brown', label: '📚 Ruido Marrón Profundo' },
                  { id: 'library', label: '🏛️ Biblioteca Universitaria' },
                  { id: 'rain', label: '🌧️ Lluvia Suave' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      const target = s.id as 'off' | 'brown' | 'rain' | 'library';
                      if (ambientMode === target || target === 'off') {
                        soundEngine.stopAmbientFocus();
                        setAmbientMode('off');
                      } else {
                        soundEngine.startAmbientFocus(target);
                        setAmbientMode(target);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      ambientMode === s.id
                        ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral: Tema Objetivo + Cierre con Recompensa */}
          <div className="lg:col-span-5 card p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 grid place-items-center text-xl">
                🎯
              </span>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900 dark:text-white">
                  Tema que estás atacando hoy
                </h3>
                <p className="text-xs text-slate-500">
                  Al terminar tu bloque, recarga su batería de 7 días
                </p>
              </div>
            </div>

            {deck.length > 0 ? (
              <>
                <select
                  value={activePomodoroTopic?.id || ''}
                  onChange={(e) => setPomodoroTargetTopicId(e.target.value)}
                  aria-label="Seleccionar tema objetivo para Pomodoro"
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {deck.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.status === 'red' ? '🔴' : item.status === 'yellow' ? '🟡' : '🟢'}{' '}
                      {item.subjectName} · {item.name}
                    </option>
                  ))}
                </select>

                {activePomodoroTopic && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="chip bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px]">
                        {activePomodoroTopic.subjectEmoji} {activePomodoroTopic.subjectName}
                      </span>
                      <span className="text-xs font-bold">
                        Estado actual:{' '}
                        {activePomodoroTopic.status === 'red'
                          ? '🔴 Rojo'
                          : activePomodoroTopic.status === 'yellow'
                          ? '🟡 Amarillo'
                          : '🟢 Verde'}
                      </span>
                    </div>
                    <p className="font-heading font-black text-sm text-slate-900 dark:text-white">
                      {activePomodoroTopic.name}
                    </p>
                    {activePomodoroTopic.summary && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activePomodoroTopic.summary}
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    ¿Terminaste de estudiar este bloque? Registra tu logro:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCompletePomodoroSession()}
                    className="btn-game w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-heading font-black"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Completar bloque y recargar batería (+{selectedPreset.xp} XP)
                    </span>
                  </button>

                  {activePomodoroTopic && activePomodoroTopic.status !== 'green' && (
                    <button
                      type="button"
                      onClick={() => handleCompletePomodoroSession('green')}
                      className="btn-game w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 text-white text-xs font-heading font-black"
                    >
                      <Flame className="w-4 h-4" />
                      <span>¡Ya lo dominé! Pasar tema a 🟢 Verde (+XP Extra)</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                No hay temas en este filtro. Desmarca el filtro o agrega temas a tu materia.
              </p>
            )}
          </div>
        </div>
      ) : mode === 'flashcards' ? (
        /* MODO 2: FLASHCARDS 3D DE RECUERDO ACTIVO */
        <div className="max-w-2xl mx-auto space-y-4">
          {!currentCard ? (
            <div className="card p-8 text-center text-xs text-slate-500">
              No hay temas para mostrar con el filtro actual.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Tarjeta {cardIndex + 1} de {deck.length}
                </span>
                <span>Haz clic en la tarjeta para girar 360°</span>
              </div>

              {/* Tarjeta Interactiva */}
              <div
                onClick={() => {
                  soundEngine.playPop();
                  setIsFlipped(!isFlipped);
                }}
                className="card p-7 sm:p-10 min-h-[290px] flex flex-col justify-between cursor-pointer select-none border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs">
                    {currentCard.subjectEmoji} {currentCard.subjectName} ({currentCard.subjectCode})
                  </span>
                  <span
                    className={`chip text-xs ${
                      currentCard.status === 'red'
                        ? 'bg-rose-500/15 text-rose-500'
                        : currentCard.status === 'yellow'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-emerald-500/15 text-emerald-500'
                    }`}
                  >
                    {currentCard.status === 'red'
                      ? '🔴 Por aprender'
                      : currentCard.status === 'yellow'
                      ? '🟡 Por practicar'
                      : '🟢 Dominado'}
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="my-8 text-center space-y-3 animate-fade-in">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-500 block">
                      PREGUNTA DE RECUERDO ACTIVO
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                      {currentCard.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Intenta explicar en voz alta la definición, fórmulas o casos clave de este tema antes de voltear la tarjeta.
                    </p>
                  </div>
                ) : (
                  <div className="my-6 text-left space-y-3 animate-scale-up bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                      APUNTES Y PUNTOS CLAVE DEL TEMA
                    </span>
                    <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                      {currentCard.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {currentCard.summary ||
                        'Aún no has escrito un resumen personalizado para este tema. Usa la pestaña "Feynman" arriba para guardar tus propios apuntes clave.'}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{isFlipped ? '↩ Toca para volver al frente' : '↪ Toca para ver respuesta / apuntes'}</span>
                  <span>Batería se recarga al calificar</span>
                </div>
              </div>

              {/* Botones de autocalificación Semáforo */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleFlashcardGrade('red')}
                  className="btn-game p-3.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 border border-rose-500/30 flex flex-col items-center gap-1"
                >
                  <span className="text-lg">🔴</span>
                  <span className="text-xs font-heading font-black">Me costó recordar</span>
                  <span className="text-[10px] opacity-80">+8 XP · Prioridad #1</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFlashcardGrade('yellow')}
                  className="btn-game p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex flex-col items-center gap-1"
                >
                  <span className="text-lg">🟡</span>
                  <span className="text-xs font-heading font-black">Recordé a medias</span>
                  <span className="text-[10px] opacity-80">+15 XP · Practicar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFlashcardGrade('green')}
                  className="btn-game p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white flex flex-col items-center gap-1"
                >
                  <span className="text-lg">🟢</span>
                  <span className="text-xs font-heading font-black">¡Lo dominé!</span>
                  <span className="text-[10px] opacity-90">+30 XP · +5 ⚡</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((i) => (i > 0 ? i - 1 : deck.length - 1));
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* MODO 3: MÉTODO FEYNMAN (SÍNTESIS CON TUS PROPIAS PALABRAS) */
        <div className="max-w-2xl mx-auto card p-6 sm:p-8 space-y-4">
          {!currentCard ? (
            <p className="text-xs text-slate-500 text-center">
              Selecciona una materia con temas para usar el Método Feynman.
            </p>
          ) : (
            <form onSubmit={handleSaveFeynman} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="chip bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs">
                  🧠 Técnica de Richard Feynman
                </span>
                <select
                  value={currentCard.id}
                  onChange={(e) => {
                    const idx = deck.findIndex((d) => d.id === e.target.value);
                    if (idx >= 0) setCardIndex(idx);
                  }}
                  aria-label="Seleccionar tema para técnica Feynman"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  {deck.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.subjectName} · {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                  Explica &ldquo;{currentCard.name}&rdquo; con tus propias palabras
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Si puedes explicarlo de forma sencilla sin copiar definiciones de memoria, realmente lo entiendes. Lo que escribas quedará guardado como tu resumen oficial del tema.
                </p>
              </div>

              <textarea
                rows={5}
                value={feynmanText}
                onChange={(e) => setFeynmanText(e.target.value)}
                placeholder="Escribe aquí cómo funciona este tema, su fórmula clave o un ejemplo práctico..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />

              {/* Medidor de profundidad de síntesis */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500">
                    Nivel de síntesis ({wordCount} palabras)
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {clarityScore}% completitud recomendada
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.max(5, clarityScore)}%` }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-game w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs sm:text-sm font-heading font-black"
              >
                <Zap className="w-4 h-4" />
                <span>Guardar Síntesis Feynman y Reclamar +35 XP + 10 ⚡</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
