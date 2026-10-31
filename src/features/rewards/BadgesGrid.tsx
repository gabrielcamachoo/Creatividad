import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import {
  Award,
  Sparkles,
  ShieldCheck,
  BatteryCharging,
  Flame,
  Crown,
  Compass,
  CalendarCheck,
  Clock,
  CheckCircle2,
  ShoppingBag,
  ShieldAlert,
  Layers,
  Lock,
} from 'lucide-react';

export const BadgesGrid: React.FC = () => {
  const { badges } = useGamificationStore();
  const [filterRarity, setFilterRarity] = useState<'all' | 'common' | 'rare' | 'epic'>('all');

  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    ShieldCheck,
    BatteryCharging,
    Flame,
    Crown,
    Compass,
    CalendarCheck,
    Clock,
    CheckCircle2,
    ShoppingBag,
    ShieldAlert,
    Layers,
  };

  const filteredBadges = badges.filter((b) => {
    if (filterRarity === 'all') return true;
    return b.rarity === filterRarity;
  });

  const unlockedCount = badges.filter((b) => b.unlockedAt).length;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="card p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white">
              Vitrina de Insignias Académicas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desbloquea medallas al mantener rachas, recargar baterías y dominar temas.
            </p>
          </div>
        </div>

        <span className="chip bg-purple-600 text-white font-heading font-black text-xs shrink-0 self-start sm:self-auto shadow-xs">
          {unlockedCount} / {badges.length} desbloqueadas
        </span>
      </div>

      {/* Filtro de rareza */}
      <div className="flex items-center gap-2 text-xs font-bold">
        {(['all', 'common', 'rare', 'epic'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setFilterRarity(r)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              filterRarity === r
                ? 'bg-purple-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {r === 'all' ? 'Todas' : r === 'common' ? 'Común' : r === 'rare' ? 'Rara' : 'Épica'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBadges.map((badge) => {
          const Icon = iconMap[badge.icon] || Award;
          const isUnlocked = !!badge.unlockedAt;

          const rarityColor = {
            common: 'border-slate-300 dark:border-slate-700 text-slate-500',
            rare: 'border-blue-500/40 text-blue-500 bg-blue-500/5',
            epic: 'border-amber-500/40 text-amber-500 bg-amber-500/5',
          }[badge.rarity];

          return (
            <div
              key={badge.id}
              className={`card p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isUnlocked
                  ? 'border-purple-500/30 hover:border-purple-500/60 shadow-xs'
                  : 'opacity-50 grayscale hover:grayscale-0'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <span
                    className={`text-2.5xs font-heading font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${rarityColor}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h4 className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                  {badge.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-3">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-2.5xs">
                {isUnlocked ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>✓ Desbloqueada el {badge.unlockedAt}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 italic">
                    Pista: {badge.hint}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
