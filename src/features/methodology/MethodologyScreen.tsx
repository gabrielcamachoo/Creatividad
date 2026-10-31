import React, { useEffect } from 'react';
import { METHODOLOGY_PHASES, TEAM_MEMBERS } from '@/data/methodologyData';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useStudyStore } from '@/store/useStudyStore';
import {
  Compass,
  Sparkles,
  Target,
  Lightbulb,
  LayoutTemplate,
  ArrowRight,
  Users,
  CheckCircle,
} from 'lucide-react';

export const MethodologyScreen: React.FC = () => {
  const { recordMethodologyViewed, checkAndAwardBadges } = useGamificationStore();
  const { subjects } = useStudyStore();
  const { getSimulatedDateStr } = useTimeStore();

  useEffect(() => {
    recordMethodologyViewed();
    checkAndAwardBadges(subjects, getSimulatedDateStr());
  }, []);

  const iconList = [Compass, Sparkles, Target, Lightbulb, LayoutTemplate];

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 animate-fade-in text-left">
      {/* Cabecera */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-heading font-black">
          Design Thinking · Desafío 2
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white leading-tight">
          Cómo Llegamos Aquí 💡
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          "Del Problema a la Solución Creativa. Continuidad del aprendizaje universitario y escolar fuera de clase."
        </p>
      </div>

      {/* Embudo Visual */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-purple-500/10 border-emerald-500/20 text-center">
        <p className="text-2.5xs font-heading font-black uppercase tracking-wider text-slate-400 mb-3">
          Embudo Visual del Proceso Creativo
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-heading font-black">
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs">
            4 Entrevistas
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300">
            100 Ideas
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300">
            6 Clusters
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300">
            3 Ideas WOW
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white shadow-md">
            1 Prototipo Final
          </span>
        </div>
      </div>

      {/* Stepper de 5 fases */}
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-8 space-y-8">
        {METHODOLOGY_PHASES.map((phase, idx) => {
          const Icon = iconList[idx] || Compass;
          return (
            <div key={phase.number} className="relative pl-7 sm:pl-9">
              {/* Nodo */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-heading font-black text-xs shadow-md">
                {phase.number}
              </div>

              {/* Tarjeta */}
              <div className="card p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900 dark:text-white">
                    {phase.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <strong className="text-slate-900 dark:text-slate-100">¿Qué es? </strong>
                  {phase.whatIs}
                </p>

                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-1">¿Qué hicimos nosotros?</p>
                  <p>{phase.whatWeDid}</p>

                  {/* Subherramientas fase 2 */}
                  {phase.subtools && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3">
                      {phase.subtools.map((st) => (
                        <div
                          key={st.name}
                          className="p-3 rounded-2xl bg-amber-500/5 dark:bg-slate-800/60 border border-amber-500/20 text-xs"
                        >
                          <span className="text-2.5xs font-mono font-bold text-amber-600 dark:text-amber-400 block">
                            {st.range}
                          </span>
                          <p className="font-heading font-black text-slate-900 dark:text-white mt-0.5">
                            {st.name}
                          </p>
                          <p className="text-2.5xs text-slate-500 dark:text-slate-400 mt-1">{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Evaluación fase 3 */}
                  {phase.evaluation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
                      {phase.evaluation.map((ev) => (
                        <div
                          key={ev.name}
                          className="p-3 rounded-2xl bg-purple-500/5 dark:bg-slate-800/60 border border-purple-500/20 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-black text-purple-700 dark:text-purple-300">
                              {ev.name}
                            </span>
                            <span className="font-heading font-black px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-300 text-2.5xs">
                              {ev.score}
                            </span>
                          </div>
                          <p className="text-2.5xs text-slate-500 dark:text-slate-400">{ev.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resultado */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <span className="font-heading font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-0.5 text-2.5xs">
                    Resultado concreto:
                  </span>
                  <p className="text-emerald-900 dark:text-emerald-200 font-medium">{phase.result}</p>
                </div>

                {/* Declaración de la idea final */}
                {phase.highlightBox && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm italic font-semibold text-slate-800 dark:text-amber-200 leading-relaxed">
                    {phase.highlightBox}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Equipo */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-5">
          <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-heading font-black">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Equipo de Autores</span>
          </span>
          <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Diseñadores de MiSemaforo
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEAM_MEMBERS.map((m) => (
            <div
              key={m.name}
              className="card p-4 text-center"
            >
              <div className="w-11 h-11 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-heading font-black text-emerald-600 dark:text-emerald-400 mb-2.5 text-xs">
                {m.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white">{m.name}</h3>
              <p className="text-2.5xs text-slate-500 mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
