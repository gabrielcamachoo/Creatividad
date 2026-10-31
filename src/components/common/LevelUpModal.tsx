import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateRank } from '@/lib/rewardEngine';
import { soundEffects } from '@/lib/audio';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { newLevelUnlocked, clearNewLevelModal, xp } = useGamificationStore();
  const { soundEnabled } = useSettingsStore();

  useEffect(() => {
    if (newLevelUnlocked !== null) {
      soundEffects.levelUp(soundEnabled);

      // Confeti controlado y no invasivo
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
        });
      } catch (e) {
        // Ignorar si en entorno headless
      }
    }
  }, [newLevelUnlocked, soundEnabled]);

  if (newLevelUnlocked === null) return null;

  const rankInfo = calculateRank(xp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/60 shadow-2xl text-center relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-lg">
          <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          ¡Subiste de Nivel!
        </span>

        <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          Nivel {newLevelUnlocked}: {rankInfo.rank}
        </h3>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Tu constancia y dominio están rindiendo frutos. ¡Has desbloqueado nuevas funciones!
        </p>

        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left">
          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Beneficio de rango:
          </p>
          <p className="text-slate-600 dark:text-slate-300">{rankInfo.perk}</p>
        </div>

        <button
          onClick={clearNewLevelModal}
          className="mt-6 w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <span>¡Continuar Estudiando!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
