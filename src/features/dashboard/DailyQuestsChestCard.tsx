import React, { useState } from 'react';
import { Subject } from '@/types';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { soundEngine } from '@/lib/soundEffects';
import { CheckCircle2, Circle, Gift, Sparkles, Brain, Flame, Zap } from 'lucide-react';

interface DailyQuestsChestCardProps {
  subjects: Subject[];
  todayStr: string;
}

export const DailyQuestsChestCard: React.FC<DailyQuestsChestCardProps> = ({
  subjects,
  todayStr,
}) => {
  const { xp, addXP, addVolts, lastActiveDate } = useGamificationStore();
  const { setActiveView } = useSettingsStore();

  const storageKey = `misemaforo_daily_chest_${todayStr}`;
  const [chestClaimed, setChestClaimed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(storageKey) === 'true';
  });
  const [justOpened, setJustOpened] = useState(false);

  // Calcular misiones diarias reales según la actividad del estudiante
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const reviewedTodayCount = subjects.reduce(
    (acc, s) =>
      acc + s.topics.filter((t) => t.lastReviewedDate === todayStr && t.timesReviewed > 0).length,
    0
  );
  const greenOrSummariesCount = subjects.reduce(
    (acc, s) =>
      acc +
      s.topics.filter(
        (t) =>
          t.status === 'green' ||
          (t.summary &&
            t.summary.length > 15 &&
            !t.summary.startsWith('Tema oficial del pensum PUJ'))
      ).length,
    0
  );

  const quests = [
    {
      id: 'q1',
      title: 'Organiza tu Semáforo',
      desc: 'Tener al menos 1 materia con temas registrados en tu tablero',
      done: totalTopics > 0,
      reward: '+15 XP',
    },
    {
      id: 'q2',
      title: 'Recarga de Memoria Activa',
      desc: 'Repasar al menos 1 tema hoy (botón Repasé, Reto 60s o Flashcards)',
      done: reviewedTodayCount > 0 || lastActiveDate === todayStr,
      reward: '+25 XP',
    },
    {
      id: 'q3',
      title: 'Dominio o Síntesis Feynman',
      desc: 'Llevar al menos 1 tema a 🟢 Verde o escribir tu propio resumen',
      done: greenOrSummariesCount > 0 || xp >= 30,
      reward: '+30 XP',
    },
  ];

  const completedCount = quests.filter((q) => q.done).length;
  const canOpenChest = completedCount >= 2 && !chestClaimed;

  const handleOpenChest = () => {
    if (!canOpenChest) return;
    soundEngine.playChestFanfare();
    addXP(50);
    addVolts(20);
    setChestClaimed(true);
    setJustOpened(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }
  };

  return (
    <section className="card p-5 sm:p-6 relative overflow-hidden border-amber-500/25">
      <div className="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 grid place-items-center text-2xl shadow-pop-sm">
            🎁
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900 dark:text-white">
                Misiones Diarias & Cofre de Racha
              </h2>
              <span className="chip bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[11px] font-black">
                {completedCount}/3 completadas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completa al menos 2 misiones hoy para desbloquear el Cofre Diario (+50 XP y +20 ⚡).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('focus')}
            className="btn-game px-4 py-2.5 rounded-2xl text-xs font-heading font-black bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Brain className="w-4 h-4" />
            <span>Ir a Sala Pomodoro & Flashcards</span>
          </button>

          {chestClaimed ? (
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-heading font-black flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Cofre Reclamado Hoy</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canOpenChest}
              onClick={handleOpenChest}
              className={`btn-game px-4 py-2.5 rounded-2xl text-xs font-heading font-black ${
                canOpenChest
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 animate-pulse shadow-glow'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>{canOpenChest ? '¡Abrir Cofre (+50 XP)!' : 'Cofre Bloqueado'}</span>
            </button>
          )}
        </div>
      </div>

      {justOpened && (
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/15 to-teal-500/20 border border-amber-500/40 text-xs font-heading font-black text-amber-700 dark:text-amber-300 flex items-center justify-between animate-scale-up">
          <span className="flex items-center gap-2">
            🎉 ¡Abriste el Cofre Diario de Estudio! Recibiste <strong>+50 XP</strong> y{' '}
            <strong>+20 Voltios ⚡</strong> para la tienda de mascotas.
          </span>
          <Flame className="w-4 h-4 text-orange-500 shrink-0" />
        </div>
      )}

      {/* Lista de las 3 misiones */}
      <div className="grid sm:grid-cols-3 gap-3">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
              q.done
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800'
            }`}
          >
            {q.done ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="font-heading font-black text-xs text-slate-900 dark:text-white truncate">
                  {q.title}
                </p>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5">
                  <Zap className="w-3 h-3" />
                  {q.reward}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {q.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
