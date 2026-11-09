import React, { useState } from 'react';
import { Subject, Topic, MasteryLevel } from '@/types';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { triggerConfetti } from '@/lib/confetti';
import { soundEngine } from '@/lib/soundEffects';
import {
  X,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen,
  Zap,
} from 'lucide-react';

interface FlashcardStudyModalProps {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardStudyModal: React.FC<FlashcardStudyModalProps> = ({
  subject,
  isOpen,
  onClose,
}) => {
  const { updateTopic } = useStudyStore();
  const { addXP, addVolts } = useGamificationStore();

  const [filter, setFilter] = useState<'all' | 'red_yellow' | 'red'>('red_yellow');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    mastered: 0,
    xpEarned: 0,
    voltsEarned: 0,
  });

  if (!isOpen) return null;

  const filteredTopics = subject.topics.filter((t) => {
    if (filter === 'red') return t.status === 'red';
    if (filter === 'red_yellow') return t.status === 'red' || t.status === 'yellow';
    return true;
  });

  const currentTopic: Topic | undefined = filteredTopics[currentIndex];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRate = (status: MasteryLevel) => {
    if (!currentTopic) return;

    let xpBonus = 10;
    let voltsBonus = 2;
    let daysDiff = 1;

    if (status === 'green') {
      xpBonus = 35;
      voltsBonus = 8;
      daysDiff = 7;
      triggerConfetti(1800, 45);
      soundEngine.playSuccessChime();
    } else if (status === 'yellow') {
      xpBonus = 20;
      voltsBonus = 4;
      daysDiff = 4;
      soundEngine.playPop();
    } else {
      soundEngine.playPop();
    }

    // Actualizar tema
    const simulatedDate = new Date().toISOString().slice(0, 10);
    updateTopic(subject.id, currentTopic.id, {
      status,
      lastReviewedDate: simulatedDate,
    });

    addXP(xpBonus, `Repaso Flashcard: ${currentTopic.name}`);
    addVolts(voltsBonus);

    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      mastered: status === 'green' ? prev.mastered + 1 : prev.mastered,
      xpEarned: prev.xpEarned + xpBonus,
      voltsEarned: prev.voltsEarned + voltsBonus,
    }));

    if (currentIndex + 1 < filteredTopics.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      soundEngine.playSuccessChime();
      triggerConfetti(3000, 100);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, mastered: 0, xpEarned: 0, voltsEarned: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              🎴
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Repaso Activo · Flashcards</span>
              </h2>
              <p className="text-2.5xs text-slate-500 dark:text-slate-400">
                {subject.name} ({subject.code})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pantalla de Fin de Sesión */}
        {sessionCompleted ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                ¡Sesión Completada! 🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                La evocación activa fortaleció tu memoria de largo plazo según la curva de Ebbinghaus.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-2xs text-slate-400 font-bold uppercase">Repasadas</p>
                <p className="text-xl font-heading font-black text-slate-900 dark:text-white mt-0.5">
                  {sessionStats.reviewed}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-2xs text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  Dominadas
                </p>
                <p className="text-xl font-heading font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {sessionStats.mastered}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xs text-amber-600 dark:text-amber-400 font-bold uppercase">
                  XP Ganada
                </p>
                <p className="text-xl font-heading font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  +{sessionStats.xpEarned}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                <p className="text-2xs text-sky-600 dark:text-sky-400 font-bold uppercase">
                  Voltios
                </p>
                <p className="text-xl font-heading font-black text-sky-600 dark:text-sky-400 mt-0.5">
                  +{sessionStats.voltsEarned}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={resetSession}
                className="px-5 py-2.5 rounded-2xl font-heading font-black text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                Repasar Otra Vez
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl font-heading font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-glow"
              >
                Volver a la Materia
              </button>
            </div>
          </div>
        ) : filteredTopics.length === 0 ? (
          /* Sin temas en este filtro */
          <div className="p-8 text-center space-y-4">
            <p className="text-4xl">🌟</p>
            <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
              ¡No hay temas pendientes en este filtro!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Todos los temas seleccionados están en verde o no has agregado temas a esta materia.
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Ver todos los temas
            </button>
          </div>
        ) : (
          /* Sesión Activa de Flashcards */
          <div className="p-4 sm:p-6 space-y-4 flex-1">
            {/* Filtros y Progreso */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70">
                <button
                  type="button"
                  onClick={() => {
                    setFilter('red_yellow');
                    resetSession();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition ${
                    filter === 'red_yellow'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Rojos y Amarillos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('red');
                    resetSession();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition ${
                    filter === 'red'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Solo Rojos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('all');
                    resetSession();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition ${
                    filter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Todos
                </button>
              </div>

              <span className="font-heading font-black text-2xs text-slate-400">
                {currentIndex + 1} de {filteredTopics.length}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / filteredTopics.length) * 100}%`,
                }}
              />
            </div>

            {/* Tarjeta 3D */}
            <div
              onClick={handleFlip}
              className="cursor-pointer group relative min-h-[260px] sm:min-h-[290px] rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 border bg-gradient-to-br hover:shadow-xl select-none"
              style={{
                background: isFlipped
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(245, 158, 11, 0.08))'
                  : 'linear-gradient(135deg, rgba(30, 41, 59, 0.03), rgba(15, 23, 42, 0.07))',
                borderColor: isFlipped ? 'rgba(16, 185, 129, 0.3)' : 'rgba(226, 232, 240, 0.8)',
              }}
            >
              {/* Parte Superior de la Tarjeta */}
              <div className="flex items-center justify-between">
                <span
                  className={`chip text-2.5xs font-black uppercase ${
                    currentTopic?.status === 'red'
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      : currentTopic?.status === 'yellow'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}
                >
                  {currentTopic?.status === 'red'
                    ? '🔴 Requiere Refuerzo'
                    : currentTopic?.status === 'yellow'
                    ? '🟡 En Progreso'
                    : '🟢 Dominado'}
                </span>
                <span className="text-2.5xs text-slate-400 flex items-center gap-1 font-semibold group-hover:text-emerald-500 transition">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Voltear a pregunta' : 'Clic para revelar respuesta'}</span>
                </span>
              </div>

              {/* Centro de la Tarjeta (Frente vs Reverso) */}
              <div className="my-auto py-4 text-center space-y-3">
                {!isFlipped ? (
                  <>
                    <p className="text-2xs uppercase tracking-wider text-slate-400 font-bold">
                      Concepto / Pregunta de Evocación:
                    </p>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white leading-snug">
                      {currentTopic?.name}
                    </h3>
                    <p className="text-xs text-slate-500 italic max-w-sm mx-auto">
                      "Explícalo en tu mente o en voz alta antes de girar la tarjeta."
                    </p>
                  </>
                ) : (
                  <div className="text-left space-y-3 animate-fade-in">
                    <div>
                      <p className="text-2.5xs uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Resumen Feynman & Fórmulas:
                      </p>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line">
                        {currentTopic?.summary ||
                          'Tema clave del sílabo. La técnica Feynman sugiere explicarlo sin jerga técnica para comprobar la asimilación profunda.'}
                      </p>
                    </div>

                    {currentTopic?.summaryPhoto && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-36">
                        <img
                          src={currentTopic.summaryPhoto}
                          alt="Apunte o fórmula"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pie de la tarjeta */}
              <div className="pt-2 text-center text-2.5xs text-slate-400 font-medium">
                {isFlipped
                  ? '¿Cómo estuvo tu recuerdo de este tema?'
                  : 'Toca la tarjeta para ver la solución'}
              </div>
            </div>

            {/* Botones de Calificación Activa */}
            {isFlipped ? (
              <div className="grid grid-cols-3 gap-2.5 pt-1 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleRate('red')}
                  className="py-2.5 px-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-heading font-black flex flex-col items-center gap-1 transition"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Difícil (🔴)</span>
                  <span className="text-[10px] opacity-75 font-normal">+10 XP</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('yellow')}
                  className="py-2.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-heading font-black flex flex-col items-center gap-1 transition"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Dudoso (🟡)</span>
                  <span className="text-[10px] opacity-75 font-normal">+20 XP</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRate('green')}
                  className="py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-heading font-black flex flex-col items-center gap-1 transition shadow-glow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Dominado! (🟢)</span>
                  <span className="text-[10px] opacity-90 font-bold">+35 XP · +8 ⚡</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleFlip}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-heading font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <RotateCw className="w-4 h-4" />
                <span>Voltear Tarjeta para Calificar</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
