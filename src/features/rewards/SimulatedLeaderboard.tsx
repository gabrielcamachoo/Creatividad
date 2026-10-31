import React from 'react';
import { DEMO_SIMULATED_PEERS } from '@/data/demoData';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Trophy, Flame, Sparkles } from 'lucide-react';

export const SimulatedLeaderboard: React.FC = () => {
  const { streakDays } = useGamificationStore();

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="card p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shrink-0">
            🥇
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Liga Semanal de Compañeros
              </h3>
              <span className="chip bg-amber-500/20 text-amber-700 dark:text-amber-300 text-2.5xs">
                Simulado
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compite amistosamente manteniendo rachas de estudio activas y ganando XP.
            </p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Estudiante</span>
          <div className="flex items-center gap-6 sm:gap-12">
            <span>Racha</span>
            <span>XP Semanal</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {DEMO_SIMULATED_PEERS.map((peer, idx) => {
            const isUser = peer.id === 'peer-2';
            const displayStreak = isUser ? streakDays : peer.streakDays;

            return (
              <div
                key={peer.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  isUser
                    ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${peer.dominantColor}`}
                  >
                    {peer.avatar}
                  </div>

                  <div>
                    <p className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {peer.name}
                      {isUser && (
                        <span className="text-2.5xs font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                          Tú
                        </span>
                      )}
                    </p>
                    <p className="text-2.5xs text-slate-500 font-medium">Nivel {peer.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-12 text-xs shrink-0">
                  <div className="flex items-center gap-1 font-bold text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span>{displayStreak}d</span>
                  </div>

                  <span className="font-mono font-black text-slate-900 dark:text-white min-w-[60px] text-right">
                    {peer.weeklyXP} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
