import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { soundEffects } from '@/lib/audio';
import { Gift, Zap, Sparkles, Shield, Check } from 'lucide-react';

export const ChestOpeningModal: React.FC = () => {
  const { recentChestDrop, clearChestModal } = useGamificationStore();
  const { soundEnabled } = useSettingsStore();

  useEffect(() => {
    if (recentChestDrop) {
      soundEffects.success(soundEnabled);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.5 },
          colors: ['#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (e) {}
    }
  }, [recentChestDrop, soundEnabled]);

  if (!recentChestDrop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/60 shadow-2xl text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
          🎁
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
          ¡Cofre Diario Reclamado!
        </span>

        <h3 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          {recentChestDrop.label}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {recentChestDrop.description}
        </p>

        <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          {recentChestDrop.type === 'volts' && <Zap className="w-4 h-4 text-blue-500" />}
          {recentChestDrop.type === 'xp' && <Sparkles className="w-4 h-4 text-emerald-500" />}
          {recentChestDrop.type === 'streak_shield' && <Shield className="w-4 h-4 text-rose-500" />}
          {recentChestDrop.type === 'cosmetic' && <Gift className="w-4 h-4 text-purple-500" />}
          <span>Recompensa añadida a tu perfil</span>
        </div>

        <button
          onClick={clearChestModal}
          className="mt-6 w-full py-3 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>¡Genial, gracias!</span>
        </button>
      </div>
    </div>
  );
};
