import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { calculatePrioritizedTopics } from '@/lib/studyEngine';
import { ExamModeCard } from './ExamModeCard';
import { TrafficLightBadge } from '@/components/common/TrafficLightBadge';
import { BatteryBar } from '@/components/common/BatteryBar';
import {
  Target,
  Flame,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const PrioritizerScreen: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'all' | 'reds' | 'low_battery'>('all');

  const { subjects, reviewTopicToday } = useStudyStore();
  const { recordTopicReview, checkAndAwardBadges } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();

  const currentDateStr = getSimulatedDateStr();
  const prioritized = calculatePrioritizedTopics(subjects, currentDateStr);

  const filteredTopics = prioritized.filter((item) => {
    if (filterMode === 'reds') return item.topic.status === 'red';
    if (filterMode === 'low_battery') return item.batteryBlocks <= 1;
    return true;
  });

  const handleReviewFromPrioritizer = (subjectId: string, topicId: string, wasLowBattery: boolean) => {
    reviewTopicToday(subjectId, topicId, currentDateStr);
    recordTopicReview(currentDateStr, wasLowBattery);
    checkAndAwardBadges(subjects, currentDateStr);
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in text-left">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Target className="w-3.5 h-3.5" />
              <span>Priorizador Automático</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
            Orden de Ataque y Modo Parcial 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Prioriza tus horas de estudio: vacíos conceptuales primero, baterías descargadas después.
          </p>
        </div>
      </div>

      {/* Tarjeta Modo Parcial */}
      <ExamModeCard subjects={subjects} currentDateStr={currentDateStr} />

      {/* Lista Principal del Priorizador */}
      <div className="card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h2 className="font-heading font-black text-base text-slate-900 dark:text-white">
              Sugerencia de Estudio ({filteredTopics.length} temas)
            </h2>
          </div>

          {/* Filtros táctiles */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMode('reds')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'reds'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Vacíos (Rojos)
            </button>
            <button
              onClick={() => setFilterMode('low_battery')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'low_battery'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Batería Baja
            </button>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 italic">
            No hay temas que coincidan con este filtro.
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTopics.map((item, index) => {
              const isFirst = index === 0;
              const isLowBattery = item.batteryBlocks <= 1;

              return (
                <div
                  key={item.topic.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isFirst
                      ? 'bg-rose-500/10 border-rose-500/30 ring-2 ring-rose-500/20'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                        isFirst
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-2.5xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {item.subjectCode}
                        </span>
                        <h3 className="font-heading font-black text-sm text-slate-900 dark:text-white truncate">
                          {item.topic.name}
                        </h3>
                      </div>
                      <p className="text-2.5xs text-slate-500 dark:text-slate-400">
                        {item.subjectName} · {item.daysSinceReview} días sin repasar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                    <TrafficLightBadge status={item.topic.status} size="sm" />
                    <BatteryBar blocks={item.batteryBlocks} size="sm" />

                    <button
                      type="button"
                      onClick={() => handleReviewFromPrioritizer(item.topic.subjectId, item.topic.id, isLowBattery)}
                      className="btn-game px-3.5 py-1.5 rounded-xl text-xs font-heading font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repasé</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
