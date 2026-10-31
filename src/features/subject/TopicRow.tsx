import React from 'react';
import { Topic, MasteryLevel } from '@/types';
import { calculateBatteryBlocks } from '@/lib/studyEngine';
import { Check, Timer, Trash2, FileText } from 'lucide-react';

interface TopicRowProps {
  topic: Topic;
  subjectName: string;
  currentDateStr: string;
  onUpdateStatus: (topicId: string, status: MasteryLevel) => void;
  onReviewToday: (topicId: string, wasLowBattery: boolean) => void;
  onOpenChallenge60s: (topic: Topic) => void;
  onOpenSummary: (topic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
}

const LIGHTS: { s: MasteryLevel; on: string; label: string }[] = [
  { s: 'red', on: 'bg-rose-500 ring-rose-300', label: 'No lo sé' },
  { s: 'yellow', on: 'bg-amber-400 ring-amber-200', label: 'Me falta práctica' },
  { s: 'green', on: 'bg-emerald-500 ring-emerald-300', label: 'Lo domino' },
];

const EDGE: Record<MasteryLevel, string> = {
  red: 'border-l-rose-500',
  yellow: 'border-l-amber-400',
  green: 'border-l-emerald-500',
};

export const TopicRow: React.FC<TopicRowProps> = ({
  topic,
  currentDateStr,
  onUpdateStatus,
  onReviewToday,
  onOpenChallenge60s,
  onOpenSummary,
  onDeleteTopic,
}) => {
  const { blocks } = calculateBatteryBlocks(topic.lastReviewedDate, currentDateStr);
  const low = blocks <= 1;
  const hasSummary = Boolean(topic.summary || topic.summaryPhoto);

  return (
    <div className={`card group border-l-[6px] ${EDGE[topic.status]} p-4 flex flex-col sm:flex-row sm:items-center gap-3`}>
      {/* Nombre + batería */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base truncate">{topic.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="flex gap-0.5" title={`Batería ${blocks}/3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`w-2.5 h-4 rounded-[3px] ${i < blocks ? (low ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </span>
          {low && <span className="chip bg-rose-500/10 text-rose-500 py-0.5">¡Recárgame!</span>}
          {topic.timesReviewed > 0 && <span className="text-[11px] font-bold text-slate-400">🔁 {topic.timesReviewed}</span>}
        </div>
      </div>

      {/* Semáforo: 1 toque */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-100 dark:bg-white/5 self-start sm:self-auto">
        {LIGHTS.map((l) => (
          <button
            key={l.s}
            onClick={() => onUpdateStatus(topic.id, l.s)}
            title={l.label}
            aria-label={l.label}
            className={`w-7 h-7 rounded-full transition-all ${
              topic.status === l.s ? `${l.on} ring-4 scale-110` : 'bg-slate-300 dark:bg-slate-600 opacity-40 hover:opacity-80'
            }`}
          />
        ))}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenSummary(topic)}
          title="Resumen"
          aria-label="Resumen"
          className={`btn-game w-10 h-10 ${hasSummary ? 'bg-violet-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-white/10'}`}
        >
          <FileText className="w-4 h-4" />
        </button>
        <button onClick={() => onOpenChallenge60s(topic)} title="Reto 60s" aria-label="Reto 60s" className="btn-game w-10 h-10 bg-amber-400 text-slate-900">
          <Timer className="w-4 h-4" />
        </button>
        <button onClick={() => onReviewToday(topic.id, low)} title="Repasé hoy" className="btn-game h-10 px-4 bg-emerald-500 text-white text-sm">
          <Check className="w-4 h-4" /> Repasé
        </button>
        <button
          onClick={() => onDeleteTopic(topic.id)}
          title="Eliminar tema"
          aria-label="Eliminar tema"
          className="p-2 text-slate-300 hover:text-rose-500 sm:opacity-0 group-hover:opacity-100 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
