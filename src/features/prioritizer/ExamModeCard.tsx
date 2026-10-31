import React, { useState } from 'react';
import { Subject } from '@/types';
import { generateExamStudyPlan } from '@/lib/studyEngine';
import { useGamificationStore } from '@/store/useGamificationStore';
import { TrafficLightBadge } from '@/components/common/TrafficLightBadge';
import {
  CalendarCheck,
  Calendar,
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface ExamModeCardProps {
  subjects: Subject[];
  currentDateStr: string;
}

export const ExamModeCard: React.FC<ExamModeCardProps> = ({ subjects, currentDateStr }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [examDate, setExamDate] = useState<string>('2026-11-06');
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);

  const { recordExamModeUsed } = useGamificationStore();

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !examDate) return;
    setIsPlanGenerated(true);
    recordExamModeUsed();
  };

  const plan =
    selectedSubject && isPlanGenerated
      ? generateExamStudyPlan(selectedSubject, examDate, currentDateStr)
      : [];

  return (
    <div className="card p-6 sm:p-7 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-purple-500/30 relative overflow-hidden text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg text-white">Modo Parcial: Plan de Ataque</h3>
              <span className="chip bg-purple-500/20 text-purple-300 text-2.5xs font-black">
                Sin Trasnochar
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ingresa la fecha de tu examen y obtén un cronograma diario balanceado.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleGeneratePlan}
        className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs"
      >
        <div>
          <label className="block text-slate-300 mb-1 font-bold">Materia del Parcial:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setIsPlanGenerated(false);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji || '📚'} {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-300 mb-1 font-bold">Fecha del Examen:</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => {
              setExamDate(e.target.value);
              setIsPlanGenerated(false);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="sm:self-end">
          <button
            type="submit"
            className="btn-game w-full py-2.5 rounded-xl font-heading font-black text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar Plan de Ataque</span>
          </button>
        </div>
      </form>

      {/* Cronograma Resultante */}
      {isPlanGenerated && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold">
              Cronograma sugerido para {selectedSubject?.name} ({plan.length} días)
            </span>
            <span className="text-purple-400 font-bold">Ataca primero los vacíos 🔴</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {plan.map((day) => (
              <div
                key={day.dayNumber}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                    <span className="font-heading font-black text-xs text-purple-300">
                      Día {day.dayNumber}
                    </span>
                    <span className="text-2.5xs font-mono text-slate-400 font-bold">
                      {day.dateStr}
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {day.topics.map((tItem) => (
                      <div
                        key={tItem.topic.id}
                        className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-xs flex items-center justify-between gap-2"
                      >
                        <span className="font-semibold text-white truncate text-xs">
                          {tItem.topic.name}
                        </span>
                        <TrafficLightBadge status={tItem.topic.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-2.5xs text-slate-400 mt-3 pt-2 border-t border-white/10 font-medium">
                  {day.topics.length} conceptos clave programados hoy.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
