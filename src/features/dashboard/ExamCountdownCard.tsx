import React, { useState } from 'react';
import { Subject, Topic } from '@/types';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { soundEngine } from '@/lib/soundEffects';
import { triggerConfetti } from '@/lib/confetti';
import {
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ExamCountdownCardProps {
  subjects: Subject[];
}

export const ExamCountdownCard: React.FC<ExamCountdownCardProps> = ({ subjects }) => {
  const { setActiveView } = useSettingsStore();

  // Buscar materias con examen programado o tomar la que tenga más temas rojos
  const subjectsWithExam = subjects
    .filter((s) => s.examDate)
    .sort((a, b) => (a.examDate || '').localeCompare(b.examDate || ''));

  // Materia prioritaria para el banner
  const targetSubject =
    subjectsWithExam[0] ||
    [...subjects].sort((a, b) => {
      const redA = a.topics.filter((t) => t.status === 'red').length;
      const redB = b.topics.filter((t) => t.status === 'red').length;
      return redB - redA;
    })[0];

  if (!targetSubject) return null;

  const totalTopics = targetSubject.topics.length;
  const redCount = targetSubject.topics.filter((t) => t.status === 'red').length;
  const greenCount = targetSubject.topics.filter((t) => t.status === 'green').length;
  const yellowCount = targetSubject.topics.filter((t) => t.status === 'yellow').length;

  // Calcular días restantes si tiene fecha de examen
  let daysRemaining: number | null = null;
  if (targetSubject.examDate) {
    const examTime = new Date(targetSubject.examDate).getTime();
    const nowTime = new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil((examTime - nowTime) / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="card p-4 sm:p-5 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border-rose-500/25 relative overflow-hidden text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 grid place-items-center text-2xl shrink-0">
            {targetSubject.emoji || '🎯'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="chip bg-rose-500/15 text-rose-600 dark:text-rose-400 text-2.5xs font-black uppercase">
                {targetSubject.examDate ? '📅 Modo Parcial Activo' : '🚨 Foco Académico Prioritario'}
              </span>
              {daysRemaining !== null && (
                <span className="text-2.5xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Faltan {daysRemaining} días
                </span>
              )}
            </div>
            <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
              {targetSubject.name} ({targetSubject.code})
            </h3>
            <p className="text-2.5xs text-slate-500 dark:text-slate-400 mt-0.5">
              {redCount > 0
                ? `Tienes ${redCount} tema${redCount > 1 ? 's' : ''} en rojo que requieren repaso antes de evaluar.`
                : '¡Excelente! No tienes temas en rojo en esta asignatura.'}
            </p>
          </div>
        </div>

        {/* Acciones Rápidas para el Parcial */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('subject', targetSubject.id)}
            className="btn-game px-3.5 py-2 rounded-2xl text-xs font-heading font-black bg-rose-500 hover:bg-rose-400 text-white flex items-center gap-1.5 shadow-glow"
          >
            <span>Ver Semáforo ({redCount} 🔴)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('focus', targetSubject.id)}
            className="btn-game px-3.5 py-2 rounded-2xl text-xs font-heading font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pomodoro 25m</span>
          </button>
        </div>
      </div>
    </div>
  );
};
