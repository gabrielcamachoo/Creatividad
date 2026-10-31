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
  blue: 'from-sky-500/20 to-blue-600/10',
  purple: 'from-violet-500/20 to-purple-600/10',
  emerald: 'from-emerald-500/20 to-teal-600/10',
  amber: 'from-amber-400/25 to-orange-500/10',
  rose: 'from-rose-500/20 to-pink-600/10',
};

export const SubjectWorldCard: React.FC<SubjectWorldCardProps> = ({ subject, currentDateStr, onOpenSubject }) => {
  let g = 0, y = 0, r = 0, full = subject.topics.length > 0;
  subject.topics.forEach((t) => {
    if (t.status === 'green') g++;
    else if (t.status === 'yellow') y++;
    else r++;
    if (calculateBatteryBlocks(t.lastReviewedDate, currentDateStr).blocks < 3) full = false;
  });
  const total = subject.topics.length || 1;
  const mastery = Math.round((g / total) * 100);

  return (
    <button
      onClick={() => onOpenSubject(subject.id)}
      className={`card group text-left p-5 bg-gradient-to-br ${ACCENT[subject.colorTheme] || ACCENT.blue} hover:-translate-y-1 hover:shadow-xl transition-all`}
    >
      <div className="flex items-start gap-3">
        <span className="w-14 h-14 grid place-items-center text-3xl rounded-2xl bg-white dark:bg-slate-800 shadow-pop-sm group-hover:rotate-6 transition-transform">
          {subject.emoji || '📚'}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg leading-tight truncate">{subject.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {subject.topics.length} temas{subject.examDate ? ` · 📅 ${subject.examDate.slice(5)}` : ''}
          </p>
        </div>
        {full ? (
          <span className="chip bg-emerald-500 text-white"><Sparkles className="w-3 h-3" />100%</span>
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
        )}
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex gap-1.5 text-xs font-extrabold">
          <span className="chip bg-rose-500/15 text-rose-600 dark:text-rose-400">{r}</span>
          <span className="chip bg-amber-400/20 text-amber-600 dark:text-amber-400">{y}</span>
          <span className="chip bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">{g}</span>
        </div>
        <span className="font-display font-bold text-2xl">{mastery}%</span>
      </div>
      <div className="mt-2 h-2.5 rounded-full overflow-hidden flex bg-slate-200/70 dark:bg-slate-800">
        <div className="bg-emerald-500" style={{ width: `${(g / total) * 100}%` }} />
        <div className="bg-amber-400" style={{ width: `${(y / total) * 100}%` }} />
        <div className="bg-rose-500" style={{ width: `${(r / total) * 100}%` }} />
      </div>
    </button>
  );
};
