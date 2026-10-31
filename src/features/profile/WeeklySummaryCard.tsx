import React from 'react';
import { Sparkles, CheckCircle2, BatteryCharging, Trophy } from 'lucide-react';

interface WeeklySummaryCardProps {
  masteredCount: number;
  batteriesRechargedCount: number;
  totalXpThisWeek: number;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  masteredCount,
  batteriesRechargedCount,
  totalXpThisWeek,
}) => {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 border border-emerald-500/30 text-left shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          Resumen Semanal Automático
        </span>
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white">
        "Esta semana dominaste {masteredCount} conceptos clave y recuperaste {batteriesRechargedCount} baterías de frescura."
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{masteredCount} temas con Sello Verde</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <BatteryCharging className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{batteriesRechargedCount} recargas a 3/3 bloques</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span>+{totalXpThisWeek} XP acumulados</span>
        </div>
      </div>
    </div>
  );
};
