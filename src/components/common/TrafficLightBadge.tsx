import React from 'react';
import { MasteryLevel } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';

interface TrafficLightBadgeProps {
  status: MasteryLevel;
  interactive?: boolean;
  onChange?: (newStatus: MasteryLevel) => void;
  size?: 'sm' | 'md';
}

export const TrafficLightBadge: React.FC<TrafficLightBadgeProps> = ({
  status,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  if (!interactive) {
    if (status === 'green') {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
          title="Verde: Sé explicarlo y aplicarlo sin mirar notas"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Dominado</span>
        </span>
      );
    }
    if (status === 'yellow') {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
          title="Amarillo: Entiendo la teoría pero me cuesta aplicar o resolver problemas"
        >
          <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
          <span>Falta práctica</span>
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
        title="Rojo: Tengo un vacío conceptual o duda crítica"
      >
        <X className="w-3.5 h-3.5 stroke-[3]" />
        <span>Vacío</span>
      </span>
    );
  }

  const btnPadding = size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs';

  return (
    <div
      role="radiogroup"
      aria-label="Selector de semáforo de dominio"
      className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 gap-1"
    >
      {/* Opción Verde */}
      <button
        type="button"
        role="radio"
        aria-checked={status === 'green'}
        onClick={() => onChange?.('green')}
        title="Verde: Sé explicarlo y aplicarlo"
        className={`flex items-center gap-1.5 ${btnPadding} rounded-lg font-bold transition-all ${
          status === 'green'
            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
            : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
        <span className="hidden sm:inline">Dominado</span>
      </button>

      {/* Opción Amarillo */}
      <button
        type="button"
        role="radio"
        aria-checked={status === 'yellow'}
        onClick={() => onChange?.('yellow')}
        title="Amarillo: Entiendo teoría pero falta práctica"
        className={`flex items-center gap-1.5 ${btnPadding} rounded-lg font-bold transition-all ${
          status === 'yellow'
            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/50'
            : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
        }`}
      >
        <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
        <span className="hidden sm:inline">Falta práctica</span>
      </button>

      {/* Opción Rojo */}
      <button
        type="button"
        role="radio"
        aria-checked={status === 'red'}
        onClick={() => onChange?.('red')}
        title="Rojo: Tengo un vacío conceptual o duda crítica"
        className={`flex items-center gap-1.5 ${btnPadding} rounded-lg font-bold transition-all ${
          status === 'red'
            ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50'
            : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
        }`}
      >
        <X className="w-3.5 h-3.5 stroke-[3]" />
        <span className="hidden sm:inline">Vacío</span>
      </button>
    </div>
  );
};
