import React from 'react';
import { Subject } from '@/types';
import { calculateBatteryBlocks } from '@/lib/studyEngine';
import { ChevronRight, Sparkles } from 'lucide-react';

interface SubjectWorldCardProps {
  subject: Subject;
  currentDateStr: string;
  onOpenSubject: (subjectId: string) => void;
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

  return (
    <button
      onClick={() => onOpenSubject(subject.id)}
      className={`card group text-left p-5 bg-gradient-to-br ${
        ACCENT[subject.colorTheme] || ACCENT.blue
      } hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
    >
      <div className="flex items-start gap-3.5">
        <span className="w-14 h-14 grid place-items-center text-3xl rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-white/10 shadow-pop-sm group-hover:rotate-6 transition-transform shrink-0">
          {subject.emoji || '📚'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              {subject.code}
            </span>
            {subject.examDate && (
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-300 truncate">
                📅 {subject.examDate.slice(5)}
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-lg leading-tight truncate mt-1">
            {subject.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            {total === 0 ? 'Sin temas aún · Toca para añadir' : `${total} tema${total === 1 ? '' : 's'}`}
          </p>
        </div>
        {full ? (
          <span className="chip bg-emerald-500 text-white shadow-xs">
            <Sparkles className="w-3 h-3" />
            100%
          </span>
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
        )}
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-1.5 text-xs font-extrabold">
          <span className="chip bg-rose-500/15 text-rose-600 dark:text-rose-400" title="En rojo">
            🔴 {r}
          </span>
          <span className="chip bg-amber-400/20 text-amber-600 dark:text-amber-400" title="En amarillo">
            🟡 {y}
          </span>
          <span className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" title="En verde">
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
    </button>
  );
};
