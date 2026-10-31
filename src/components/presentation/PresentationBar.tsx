import React, { useState } from 'react';
import { useTimeStore } from '@/store/useTimeStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatFriendlyDate } from '@/lib/timeEngine';
import {
  FastForward,
  PlusCircle,
  Gift,
  RotateCcw,
  Sparkles,
  Calendar,
  ChevronUp,
  ChevronDown,
  Clock,
  Play,
} from 'lucide-react';

export const PresentationBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { offsetDays, getSimulatedDateStr, advanceDays, resetTime } = useTimeStore();
  const { addXP, openDailyChest, loadDemoProfile, resetGamification, syncStreak } =
    useGamificationStore();
  const { loadDemoSubjects, resetAllSubjects } = useStudyStore();
  const { showPresentationDock, togglePresentationDock } = useSettingsStore();

  const currentDateStr = getSimulatedDateStr();

  const handleAdvanceDay = (days: number) => {
    advanceDays(days);
    const newDateStr = getSimulatedDateStr();
    syncStreak(newDateStr);
  };

  const handleForceChest = () => {
    openDailyChest(currentDateStr, true);
  };

  const handleLoadDemo = () => {
    loadDemoSubjects();
    loadDemoProfile();
    resetTime();
  };

  const handleResetAll = () => {
    if (confirm('¿Reiniciar absolutamente todo para comenzar desde cero?')) {
      resetAllSubjects();
      resetGamification();
      resetTime();
    }
  };

  if (!showPresentationDock) {
    return (
      <button
        onClick={togglePresentationDock}
        className="fixed bottom-4 left-4 z-40 p-2.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/40 shadow-xl hover:scale-105 transition-transform text-xs font-bold flex items-center gap-1.5"
        title="Abrir Dock de Modo Presentación"
      >
        <Play className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Modo Demo</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl transition-all">
      <div className="p-2 sm:p-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 px-2 pb-1 border-b border-slate-800 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Modo Presentación (5-8 min)
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Fecha Virtual: <strong>{formatFriendlyDate(currentDateStr)}</strong>
              {offsetDays > 0 && (
                <span className="text-amber-400 font-mono ml-1">(+{offsetDays}d)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 text-slate-400 hover:text-white rounded"
              title={collapsed ? 'Expandir dock' : 'Minimizar dock'}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Controles de Tiempo */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleAdvanceDay(1)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1 transition-colors"
                title="Avanza 1 día en el reloj virtual"
              >
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>+1 Día</span>
              </button>

              <button
                onClick={() => handleAdvanceDay(7)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 transition-colors shadow-sm"
                title="Simula el paso de 7 días: verás bajar 1 bloque a todas las baterías"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Simular +7 Días (Batería)</span>
              </button>
            </div>

            {/* Controles de Gamificación */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => addXP(100)}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-medium flex items-center gap-1 transition-colors"
                title="Suma 100 XP y 10 Voltios para probar subida de nivel"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+100 XP</span>
              </button>

              <button
                onClick={handleForceChest}
                className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-medium flex items-center gap-1 transition-colors"
                title="Abre el cofre diario inmediatamente sin esperar 24h"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Forzar Cofre</span>
              </button>
            </div>

            {/* Carga y Reset */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLoadDemo}
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                title="Restaura las 3 materias de ejemplo y el perfil de prueba"
              >
                Cargar Demo
              </button>

              <button
                onClick={handleResetAll}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Limpiar todo (cero datos)"
                aria-label="Reiniciar todo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
