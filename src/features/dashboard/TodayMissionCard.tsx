import React from 'react';
import { Subject, Topic } from '@/types';
import { calculatePrioritizedTopics } from '@/lib/studyEngine';
import { Check, Timer, Sparkles } from 'lucide-react';

interface TodayMissionCardProps {
  subjects: Subject[];
  currentDateStr: string;
  onReviewQuick: (subjectId: string, topicId: string, wasLowBattery: boolean) => void;
  onOpenChallenge60s: (topic: Topic, subjectName: string) => void;
}

const DOT: Record<string, string> = {
  red: 'bg-rose-500',
  yellow: 'bg-amber-400',
  green: 'bg-emerald-500',
};

export const TodayMissionCard: React.FC<TodayMissionCardProps> = ({
  subjects,
  currentDateStr,
  onReviewQuick,
  onOpenChallenge60s,
}) => {
  const urgent = calculatePrioritizedTopics(subjects, currentDateStr).slice(0, 3);

  if (urgent.length === 0) {
    return null;
  }

  return (
    <section className="card p-5 sm:p-6 border-emerald-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-emerald-500/15 grid place-items-center text-2xl">
            🎯
          </span>
          <div>
            <h2 className="text-xl font-bold">Misión de hoy</h2>
            <p className="text-xs font-bold text-slate-400">
              Top {urgent.length} temas priorizados por tu semáforo
            </p>
          </div>
        </div>
        <span className="chip bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Sparkles className="w-3 h-3" />+{urgent.length * 15} XP
        </span>
      </div>

      <div className="space-y-2.5">
        {urgent.map((item) => {
          const low = item.batteryBlocks <= 1;
          return (
            <div
              key={item.topic.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/90 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              <span className={`w-2.5 h-10 rounded-full shrink-0 ${DOT[item.topic.status]}`} />
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-sm truncate text-slate-900 dark:text-white">
                  {item.topic.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-slate-400 truncate">
                    {item.subjectName}
                  </span>
                  <span
                    className="flex gap-0.5 shrink-0"
                    title={`Batería ${item.batteryBlocks}/3`}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-2 h-3 rounded-sm ${
                          i < item.batteryBlocks
                            ? low
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onOpenChallenge60s(item.topic, item.subjectName)}
                className="btn-game w-10 h-10 bg-amber-400 hover:bg-amber-300 text-slate-900"
                title="Reto Explica en 60 segundos"
                aria-label="Reto 60 segundos"
              >
                <Timer className="w-5 h-5" />
              </button>
              <button
                onClick={() => onReviewQuick(item.topic.subjectId, item.topic.id, low)}
                className="btn-game h-10 px-4 bg-emerald-500 hover:bg-emerald-400 text-white text-xs sm:text-sm"
                title="Marcar como repasado hoy"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Repasé</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
