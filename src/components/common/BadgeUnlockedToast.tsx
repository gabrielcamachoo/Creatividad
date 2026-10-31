import React from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Award, X } from 'lucide-react';

export const BadgeUnlockedToast: React.FC = () => {
  const { newBadgesUnlocked, clearBadgeModal } = useGamificationStore();

  if (newBadgesUnlocked.length === 0) return null;

  const currentBadge = newBadgesUnlocked[0];

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-2xl border border-purple-400/40 animate-slide-up flex items-start gap-3">
      <div className="p-2.5 rounded-xl bg-purple-500/30 text-amber-300 shrink-0">
        <Award className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
            ¡Insignia Desbloqueada!
          </span>
          <button
            onClick={clearBadgeModal}
            className="text-purple-300 hover:text-white p-0.5 rounded"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="font-bold text-sm text-white truncate">{currentBadge.name}</p>
        <p className="text-xs text-purple-200 mt-0.5 leading-snug">{currentBadge.description}</p>
      </div>
    </div>
  );
};
