import React from 'react';
import { Subject, SubjectAcademicStatus } from '@/types';
import { calculateBatteryBlocks } from '@/lib/studyEngine';
import { ChevronRight, Sparkles, RotateCcw, CheckCircle2, PauseCircle, XCircle } from 'lucide-react';

interface SubjectWorldCardProps {
  subject: Subject;
  currentDateStr: string;
  onOpenSubject: (subjectId: string) => void;
  onQuickStatusChange?: (
    subjectId: string,
    newStatus: SubjectAcademicStatus,
    finalGrade?: number
  ) => void;
  onRetakeSubject?: (subjectId: string) => void;
}

const ACCENT: Record<string, string> = {
  blue: 'from-sky-500/20 via-blue-500/10 to-transparent hover:border-blue-500/40',
  purple: 'from-violet-500/20 via-purple-500/10 to-transparent hover:border-purple-500/40',
  emerald: 'from-emerald-500/20 via-teal-500/10 to-transparent hover:border-emerald-500/40',
  amber: 'from-amber-400/20 via-orange-500/10 to-transparent hover:border-amber-500/40',
  rose: 'from-rose-500/20 via-pink-500/10 to-transparent hover:border-rose-500/40',
};

export const SubjectWorldCard: React.FC<SubjectWorldCardProps> = ({
  subject,
  currentDateStr,
  onOpenSubject,
  onQuickStatusChange,
  onRetakeSubject,
}) => {
  let g = 0,
    y = 0,
    r = 0,
    full = subject.topics.length > 0;
  subject.topics.forEach((t) => {
    if (t.status === 'green') g++;
    else if (t.status === 'yellow') y++;
    else r++;
    if (calculateBatteryBlocks(t.lastReviewedDate, currentDateStr).blocks < 3) full = false;
  });
  const total = subject.topics.length;
  const mastery = total > 0 ? Math.round((g / total) * 100) : 0;
  const status: SubjectAcademicStatus = subject.academicStatus || 'enrolled';
  const attemptCount = subject.attemptCount || 1;

  return (
    <div
      onClick={() => onOpenSubject(subject.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpenSubject(subject.id);
      }}
      className={`card group text-left p-5 bg-gradient-to-br ${
        ACCENT[subject.colorTheme] || ACCENT.blue
      } hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start gap-3.5">
          <span className="w-14 h-14 grid place-items-center text-3xl rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-white/10 shadow-pop-sm group-hover:rotate-6 transition-transform shrink-0">
            {subject.emoji || '📚'}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {subject.code}
              </span>
              {subject.semester && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-300">
                  Sem. {subject.semester}
                </span>
              )}
              {subject.credits && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-300">
                  {subject.credits} cr.
                </span>
              )}
              {attemptCount > 1 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  🔄 {attemptCount}ª vez
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-lg leading-tight truncate mt-1">
              {subject.name}
            </h3>

            {/* Píldora de estado académico */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {status === 'passed' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Aprobada {subject.finalGrade ? `· Nota ${subject.finalGrade.toFixed(1)}` : ''}
                  </span>
                </span>
              ) : status === 'withdrawn' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black text-amber-600 dark:text-amber-400">
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Retirada a mitad de semestre</span>
                </span>
              ) : status === 'failed' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-black text-rose-600 dark:text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>
                    Perdida {subject.finalGrade ? `(${subject.finalGrade.toFixed(1)})` : ''} · Por repetir
                  </span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {total === 0
                    ? 'Sin temas aún · Toca para añadir'
                    : `${total} tema${total === 1 ? '' : 's'} · Cursando`}
                </span>
              )}
            </div>
          </div>

          {full && status === 'enrolled' ? (
            <span className="chip bg-emerald-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              100%
            </span>
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex gap-1.5 text-xs font-extrabold">
            <span className="chip bg-rose-500/15 text-rose-600 dark:text-rose-400" title="En rojo">
              🔴 {r}
            </span>
            <span
              className="chip bg-amber-400/20 text-amber-600 dark:text-amber-400"
              title="En amarillo"
            >
              🟡 {y}
            </span>
            <span
              className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              title="En verde"
            >
              🟢 {g}
            </span>
          </div>
          <span className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            {mastery}%
          </span>
        </div>

        <div className="mt-2 h-2.5 rounded-full overflow-hidden flex bg-slate-200/70 dark:bg-slate-800 p-0.5 gap-0.5">
          {total > 0 && (
            <>
              <div
                className="bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(g / total) * 100}%` }}
              />
              <div
                className="bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${(y / total) * 100}%` }}
              />
              <div
                className="bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${(r / total) * 100}%` }}
              />
            </>
          )}
        </div>
      </div>

      {/* Acciones rápidas según el caso académico (Retirada/Perdida -> Volver a ver; Cursando -> Aprobar/Retirar) */}
      {(onRetakeSubject || onQuickStatusChange) && (
        <div
          className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {status === 'withdrawn' || status === 'failed' ? (
            <button
              type="button"
              onClick={() => onRetakeSubject && onRetakeSubject(subject.id)}
              className="btn-game w-full py-2 px-3 rounded-xl text-xs font-heading font-black bg-amber-500 hover:bg-amber-400 text-slate-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>¡Volver a ver este semestre! (Intento #{attemptCount + 1})</span>
            </button>
          ) : status === 'passed' ? (
            <button
              type="button"
              onClick={() => onQuickStatusChange && onQuickStatusChange(subject.id, 'enrolled')}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
            >
              Pasar de nuevo a &ldquo;Cursando&rdquo;
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  onQuickStatusChange && onQuickStatusChange(subject.id, 'passed', 4.2)
                }
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 transition-colors"
                title="Marcar materia como ya aprobada / pasada"
              >
                ✅ Ya la pasé
              </button>
              <button
                type="button"
                onClick={() =>
                  onQuickStatusChange && onQuickStatusChange(subject.id, 'withdrawn')
                }
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 transition-colors"
                title="Retirar materia a mitad de semestre"
              >
                ⏸️ Retirar
              </button>
              <button
                type="button"
                onClick={() =>
                  onQuickStatusChange && onQuickStatusChange(subject.id, 'failed', 2.5)
                }
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 transition-colors"
                title="Marcar como perdida para repetirla después"
              >
                ❌ Perdida
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
