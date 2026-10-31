import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateBatiMood, calculateRank } from '@/lib/rewardEngine';
import { calculateBatteryBlocks } from '@/lib/studyEngine';
import { BatiAvatar } from '@/components/common/BatiAvatar';
import { TodayMissionCard } from './TodayMissionCard';
import { SubjectWorldCard } from './SubjectWorldCard';
import { QuickReviewModal } from './QuickReviewModal';
import { SUBJECT_EMOJI_LIST } from '@/config/curriculum.config';
import { Topic } from '@/types';
import { Plus, FileText, GraduationCap, Calendar, X } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmoji, setNewSubEmoji] = useState('📚');
  const [newSubColor, setNewSubColor] = useState('blue');
  const [active60sTopic, setActive60sTopic] = useState<{ topic: Topic; subjectName: string } | null>(null);

  const { subjects, addSubject, reviewTopicToday, schedule } = useStudyStore();
  const { xp, equippedBati, recordTopicReview, checkAndAwardBadges } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();
  const { setActiveView, setIsGraduationOpen, studentLevel, userProfile } = useSettingsStore();

  const today = getSimulatedDateStr();
  const bati = calculateBatiMood(subjects, today);
  const rank = calculateRank(xp);

  let green = 0, yellow = 0, red = 0, low = 0;
  subjects.forEach((s) =>
    s.topics.forEach((t) => {
      if (t.status === 'green') green++;
      else if (t.status === 'yellow') yellow++;
      else red++;
      if (calculateBatteryBlocks(t.lastReviewedDate, today).blocks <= 1) low++;
    })
  );
  const total = green + yellow + red;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayClasses = schedule.filter((c) => c.dayOfWeek === dayNames[new Date().getDay()]);
  const firstName = userProfile.name.split(' ')[0];

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const id = addSubject(newSubName.trim(), newSubName.trim().slice(0, 3), newSubColor, newSubEmoji);
    setNewSubName('');
    setIsAddingSubject(false);
    checkAndAwardBadges(subjects, today);
    setActiveView('subject', id);
  };

  const handleReviewQuick = (subjectId: string, topicId: string, wasLow: boolean) => {
    reviewTopicToday(subjectId, topicId, today);
    recordTopicReview(today, wasLow);
    checkAndAwardBadges(subjects, today);
  };

  const statTiles = [
    { n: red, label: 'Por aprender', emoji: '🔴', cls: 'from-rose-500 to-rose-600' },
    { n: yellow, label: 'Por practicar', emoji: '🟡', cls: 'from-amber-400 to-orange-500' },
    { n: green, label: 'Dominados', emoji: '🟢', cls: 'from-emerald-500 to-teal-600' },
    { n: low, label: 'Batería baja', emoji: '🪫', cls: 'from-violet-500 to-indigo-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <BatiAvatar mood={bati.mood} equipped={equippedBati} photoUrl={userProfile.photoUrl} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-emerald-300 font-bold">¡Hola, {firstName}! 👋</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">
              {red > 0 ? `${red} tema${red > 1 ? 's' : ''} en rojo` : '¡Vas excelente!'}
            </h1>
            {/* Nivel */}
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span>Nv. {rank.level} · {rank.rank}</span>
                <span>{xp} / {rank.nextLevelXP} XP</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-700" style={{ width: `${rank.progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          <button onClick={() => setActiveView('report')} className="btn-game px-4 py-2.5 text-sm bg-rose-500 hover:bg-rose-400 text-white">
            <FileText className="w-4 h-4" /> Mi plan
          </button>
          <button onClick={() => setActiveView('schedule')} className="btn-game px-4 py-2.5 text-sm bg-white/10 hover:bg-white/20 text-white shadow-none">
            <Calendar className="w-4 h-4" /> Horario {todayClasses.length > 0 && <span className="chip bg-sky-400 text-slate-900 py-0">{todayClasses.length} hoy</span>}
          </button>
          {studentLevel === 'school' && (
            <button onClick={() => setIsGraduationOpen(true)} className="btn-game px-4 py-2.5 text-sm bg-violet-500 hover:bg-violet-400 text-white">
              <GraduationCap className="w-4 h-4" /> Pasar a la U
            </button>
          )}
        </div>
      </section>

      {/* SEMÁFORO GLOBAL */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statTiles.map((s) => (
          <div key={s.label} className={`rounded-3xl p-4 text-white bg-gradient-to-br ${s.cls} shadow-pop`}>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-display font-bold">{s.n}</span>
              <span className="text-2xl">{s.emoji}</span>
            </div>
            <p className="text-xs font-bold text-white/85 mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      {total > 0 && (
        <div className="h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800" title="Tu dominio total">
          <div className="bg-emerald-500" style={{ width: `${pct(green)}%` }} />
          <div className="bg-amber-400" style={{ width: `${pct(yellow)}%` }} />
          <div className="bg-rose-500" style={{ width: `${pct(red)}%` }} />
        </div>
      )}

      {/* MISIÓN */}
      <TodayMissionCard
        subjects={subjects}
        currentDateStr={today}
        onReviewQuick={handleReviewQuick}
        onOpenChallenge60s={(topic, subjectName) => setActive60sTopic({ topic, subjectName })}
      />

      {/* MATERIAS */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Mis materias</h2>
          <button
            onClick={() => setIsAddingSubject(!isAddingSubject)}
            className="btn-game px-3.5 py-2 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            {isAddingSubject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAddingSubject ? 'Cerrar' : 'Materia'}
          </button>
        </div>

        {isAddingSubject && (
          <form onSubmit={handleCreateSubject} className="card p-4 mb-4 space-y-3 animate-fade-in">
            <div className="flex gap-2">
              <span className="w-12 h-12 grid place-items-center text-2xl rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">{newSubEmoji}</span>
              <input
                autoFocus
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder={studentLevel === 'school' ? 'Ej. Trigonometría' : 'Ej. Anatomía'}
                className="flex-1 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button type="submit" className="btn-game px-5 bg-emerald-500 text-white">Crear</button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SUBJECT_EMOJI_LIST.map((em) => (
                <button key={em} type="button" onClick={() => setNewSubEmoji(em)}
                  className={`shrink-0 w-10 h-10 rounded-xl text-xl transition ${newSubEmoji === em ? 'bg-emerald-500 scale-110' : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'}`}>
                  {em}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['blue', 'purple', 'emerald', 'amber', 'rose'].map((c) => (
                <button key={c} type="button" onClick={() => setNewSubColor(c)} aria-label={c}
                  className={`w-7 h-7 rounded-full bg-${c}-500 ${newSubColor === c ? 'ring-4 ring-offset-2 ring-slate-300 dark:ring-offset-slate-900' : ''}`} />
              ))}
            </div>
          </form>
        )}

        {subjects.length === 0 ? (
          <button onClick={() => setIsAddingSubject(true)} className="card w-full p-10 text-center border-dashed border-2 hover:border-emerald-500">
            <span className="text-5xl">📚</span>
            <p className="mt-3 font-display font-bold text-xl">Agrega tu primera materia</p>
          </button>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <SubjectWorldCard key={s.id} subject={s} currentDateStr={today} onOpenSubject={(id) => setActiveView('subject', id)} />
            ))}
          </div>
        )}
      </section>

      {active60sTopic && (
        <QuickReviewModal topic={active60sTopic.topic} subjectName={active60sTopic.subjectName} onClose={() => setActive60sTopic(null)} />
      )}
    </div>
  );
};
