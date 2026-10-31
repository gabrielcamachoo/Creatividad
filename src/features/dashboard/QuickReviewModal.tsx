import React, { useState, useEffect } from 'react';
import { Topic, MasteryLevel } from '@/types';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { soundEffects } from '@/lib/audio';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface QuickReviewModalProps {
  topic: Topic | null;
  subjectName: string;
  onClose: () => void;
}

export const QuickReviewModal: React.FC<QuickReviewModalProps> = ({
  topic,
  subjectName,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinishedTime, setHasFinishedTime] = useState(false);

  const { reviewTopicToday, updateTopicStatus } = useStudyStore();
  const { recordTopicReview, recordStatusChange, record60sChallenge } =
    useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();
  const { soundEnabled } = useSettingsStore();

  const currentDateStr = getSimulatedDateStr();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      setHasFinishedTime(true);
      soundEffects.success(soundEnabled);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, soundEnabled]);

  if (!topic) return null;

  const handleToggleTimer = () => {
    setIsActive(!isActive);
    soundEffects.click(soundEnabled);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsLeft(60);
    setHasFinishedTime(false);
  };

  const handleFinishEarly = () => {
    setIsActive(false);
    setHasFinishedTime(true);
  };

  const handleSelectSelfEval = (suggestedStatus: MasteryLevel) => {
    reviewTopicToday(topic.subjectId, topic.id, currentDateStr);
    recordTopicReview(currentDateStr, topic.status === 'red');

    if (topic.status !== suggestedStatus) {
      updateTopicStatus(topic.subjectId, topic.id, suggestedStatus);
      recordStatusChange(topic.status, suggestedStatus);
    }

    record60sChallenge(currentDateStr);
    soundEffects.success(soundEnabled);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-lg my-8 p-6 sm:p-7 relative text-center animate-scale-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          aria-label="Cerrar reto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-heading font-black text-2.5xs uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reto: Explica en 60 Segundos</span>
        </div>

        <p className="text-2.5xs text-slate-400 font-bold uppercase tracking-wider">{subjectName}</p>
        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white mt-0.5">
          {topic.name}
        </h2>

        {!hasFinishedTime ? (
          <div className="mt-5 space-y-5">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Explica en voz alta este concepto sin mirar apuntes. ¡Comprueba si de verdad lo dominas!
            </p>

            {/* Círculo Temporizador */}
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center relative shadow-inner bg-slate-50 dark:bg-slate-800">
              <span className="text-4xl font-heading font-black font-mono text-slate-900 dark:text-white">
                {secondsLeft}s
              </span>
              <span className="text-2.5xs font-bold text-slate-400 uppercase tracking-widest">
                Tiempo
              </span>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={handleToggleTimer}
                className={`btn-game px-5 py-2.5 rounded-2xl font-heading font-black text-xs text-white flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isActive ? 'Pausar' : 'Iniciar 60s'}</span>
              </button>

              <button
                onClick={handleFinishEarly}
                className="btn-game px-4 py-2.5 rounded-2xl font-heading font-black text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                Listo, terminé
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Reiniciar a 60s"
                aria-label="Reiniciar temporizador"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Autoevaluación guiada */
          <div className="mt-5 animate-fade-in text-left space-y-3">
            <div className="text-center">
              <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white">
                ¿Cómo te sentiste explicando?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ajusta el semáforo y recarga tu batería a 3/3 bloques al instante:
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Opción Verde */}
              <button
                onClick={() => handleSelectSelfEval('green')}
                className="w-full p-3.5 rounded-2xl border border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/10 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-heading font-black text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 block">
                      ✔ ¡Fluido y sin dudas!
                    </span>
                    <span className="text-2.5xs text-slate-500">
                      Verde (Dominado)
                    </span>
                  </div>
                </div>
                <span className="chip bg-emerald-500 text-white text-2.5xs font-black">
                  +15 XP
                </span>
              </button>

              {/* Opción Amarillo */}
              <button
                onClick={() => handleSelectSelfEval('yellow')}
                className="w-full p-3.5 rounded-2xl border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-heading font-black text-xs sm:text-sm text-amber-700 dark:text-amber-300 block">
                      ⚠ A medias: dudé en detalles o fórmulas
                    </span>
                    <span className="text-2.5xs text-slate-500">
                      Amarillo (Falta práctica)
                    </span>
                  </div>
                </div>
                <span className="chip bg-amber-500 text-white text-2.5xs font-black">
                  +15 XP
                </span>
              </button>

              {/* Opción Rojo */}
              <button
                onClick={() => handleSelectSelfEval('red')}
                className="w-full p-3.5 rounded-2xl border border-rose-500/40 hover:border-rose-500 bg-rose-500/10 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-heading font-black text-xs sm:text-sm text-rose-700 dark:text-rose-300 block">
                      ✖ Me trabé o descubrí un vacío
                    </span>
                    <span className="text-2.5xs text-slate-500">
                      Rojo (Vacío crítico)
                    </span>
                  </div>
                </div>
                <span className="chip bg-rose-500 text-white text-2.5xs font-black">
                  +15 XP
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
