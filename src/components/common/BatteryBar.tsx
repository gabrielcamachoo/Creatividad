import React from 'react';
import { calculateBatteryBlocks } from '@/lib/studyEngine';

interface BatteryBarProps {
  lastReviewedDate?: string;
  currentDateStr?: string;
  blocks?: number;
  showDaysText?: boolean;
  size?: 'sm' | 'md';
}

export const BatteryBar: React.FC<BatteryBarProps> = ({
  lastReviewedDate,
  currentDateStr,
  blocks: directBlocks,
  showDaysText = true,
  size = 'md',
}) => {
  const calculated =
    lastReviewedDate && currentDateStr
      ? calculateBatteryBlocks(lastReviewedDate, currentDateStr)
      : { blocks: directBlocks ?? 3, daysSinceReview: 0, isAtRisk: (directBlocks ?? 3) === 0 };

  const blocks = directBlocks !== undefined ? directBlocks : calculated.blocks;
  const daysSinceReview = calculated.daysSinceReview;
  const isAtRisk = calculated.isAtRisk;

  const getBlockColor = () => {
    if (blocks === 3) return 'bg-emerald-500 border-emerald-600';
    if (blocks === 2) return 'bg-amber-500 border-amber-600';
    if (blocks === 1) return 'bg-rose-500 border-rose-600 animate-pulse';
    return 'bg-slate-400 border-slate-500';
  };

  const slotSize = size === 'sm' ? 'w-2.5 h-4' : 'w-3.5 h-5';
  const containerPadding = size === 'sm' ? 'p-0.5' : 'p-1';

  return (
    <div
      className="inline-flex items-center gap-2 select-none"
      title={`Último repaso hace ${daysSinceReview} días (${blocks}/3 bloques)${isAtRisk ? ' • ¡Tema en riesgo!' : ''}`}
      role="meter"
      aria-valuenow={blocks}
      aria-valuemin={0}
      aria-valuemax={3}
      aria-label={`Batería de frescura: ${blocks} de 3 bloques`}
    >
      <div className="flex items-center">
        {/* Carcasa exterior de la batería */}
        <div
          className={`flex items-center gap-1 ${containerPadding} rounded-md border-2 border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 shadow-inner`}
        >
          {[1, 2, 3].map((slot) => {
            const isFilled = slot <= blocks;
            return (
              <div
                key={slot}
                className={`${slotSize} rounded-xs border transition-all duration-300 ${
                  isFilled
                    ? getBlockColor()
                    : 'bg-transparent border-slate-300 dark:border-slate-700 opacity-30'
                }`}
              />
            );
          })}
        </div>
        {/* Terminal positivo de la pila */}
        <div className="w-1 h-2 rounded-r-xs bg-slate-400 dark:bg-slate-600" />
      </div>

      {showDaysText && (
        <span
          className={`text-xs font-mono font-bold ${
            isAtRisk
              ? 'text-rose-600 dark:text-rose-400 font-black animate-pulse'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {isAtRisk
            ? '¡En riesgo!'
            : daysSinceReview === 0
            ? 'Hoy'
            : `${daysSinceReview}d`}
        </span>
      )}
    </div>
  );
};
