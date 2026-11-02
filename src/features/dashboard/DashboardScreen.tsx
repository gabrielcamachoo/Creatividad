import React, { useState, useMemo } from 'react';
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
import { JaverianaPensumModal } from '@/features/subject/JaverianaPensumModal';
import { SUBJECT_EMOJI_LIST } from '@/config/curriculum.config';
import { api } from '@/lib/api';
import { Topic } from '@/types';
import {
  Plus,
  FileText,
  GraduationCap,
  Calendar,
  X,
  UploadCloud,
  Sparkles,
  Building2,
} from 'lucide-react';

const COLOR_SWATCHES: Array<{ id: string; label: string; bgClass: string }> = [
  { id: 'blue', label: 'Azul', bgClass: 'bg-blue-500' },
  { id: 'purple', label: 'Violeta', bgClass: 'bg-purple-500' },
  { id: 'emerald', label: 'Esmeralda', bgClass: 'bg-emerald-500' },
  { id: 'amber', label: 'Ámbar', bgClass: 'bg-amber-500' },
  { id: 'rose', label: 'Coral', bgClass: 'bg-rose-500' },
];

export const DashboardScreen: React.FC = () => {
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isJaverianaModalOpen, setIsJaverianaModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmoji, setNewSubEmoji] = useState('📚');
  const [newSubColor, setNewSubColor] = useState('blue');
  const [active60sTopic, setActive60sTopic] = useState<{
    topic: Topic;
    subjectName: string;
  } | null>(null);

  const { subjects, addSubject, reviewTopicToday, schedule } = useStudyStore();
  const { xp, equippedBati, recordTopicReview, checkAndAwardBadges } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();
  const {
    setActiveView,
    setIsGraduationOpen,
    setIsBulkImportOpen,
    studentLevel,
    userProfile,
  } = useSettingsStore();

  const today = getSimulatedDateStr();
  const bati = useMemo(() => calculateBatiMood(subjects, today), [subjects, today]);
  const rank = useMemo(() => calculateRank(xp), [xp]);

  const { green, yellow, red, low, total } = useMemo(() => {
    let g = 0,
      y = 0,
      r = 0,
      l = 0;
    subjects.forEach((s) =>
      s.topics.forEach((t) => {
        if (t.status === 'green') g++;
        else if (t.status === 'yellow') y++;
        else r++;
        if (calculateBatteryBlocks(t.lastReviewedDate, today).blocks <= 1) l++;
      })
    );
    return { green: g, yellow: y, red: r, low: l, total: g + y + r };
  }, [subjects, today]);

  const pct = (n: number) => (total ? (n / total) * 100 : 0);

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayClasses = schedule.filter((c) => c.dayOfWeek === dayNames[new Date().getDay()]);
  const firstName = (userProfile.name || 'Estudiante').split(' ')[0];

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const code = newSubName.trim().slice(0, 3).toUpperCase();
    const id = addSubject(newSubName.trim(), code, newSubColor, newSubEmoji);
    try {
      await api.createSubject({
        id,
        name: newSubName.trim(),
        code,
        colorTheme: newSubColor,
        emoji: newSubEmoji,
      });
    } catch {
      // Guardado localmente
    }
    setNewSubName('');
    setIsAddingSubject(false);
    checkAndAwardBadges(subjects, today);
    setActiveView('subject', id);
  };

  const handleReviewQuick = async (subjectId: string, topicId: string, wasLow: boolean) => {
    reviewTopicToday(subjectId, topicId, today);
    recordTopicReview(today, wasLow);
    checkAndAwardBadges(subjects, today);
    try {
      await api.reviewTopic(topicId, today);
    } catch {}
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
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#0f172a] to-emerald-950 text-white shadow-xl border border-white/10">
        <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <BatiAvatar
            mood={bati.mood}
            equipped={equippedBati}
            photoUrl={userProfile.photoUrl}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-emerald-300 font-bold">¡Hola, {firstName}! 👋</p>
              {userProfile.careerOrGrade && (
                <span className="chip bg-white/10 text-slate-200 text-[11px]">
                  {userProfile.careerOrGrade}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1.5">
              {subjects.length === 0
                ? 'Empieza creando tu primera materia 🚀'
                : red > 0
                ? `${red} tema${red > 1 ? 's' : ''} en rojo por atacar`
                : '¡Vas al día con tu semáforo!'}
            </h1>
            {/* Nivel */}
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Nv. {rank.level} · {rank.rank}
                </span>
                <span>
                  {xp} / {rank.nextLevelXP} XP
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-700"
                  style={{ width: `${Math.max(4, rank.progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveView('report')}
            className="btn-game px-4 py-2.5 text-sm bg-rose-500 hover:bg-rose-400 text-white"
          >
            <FileText className="w-4 h-4" /> Mi plan de estudio
          </button>
          <button
            onClick={() => setActiveView('schedule')}
            className="btn-game px-4 py-2.5 text-sm bg-white/10 hover:bg-white/20 text-white shadow-none border border-white/10"
          >
            <Calendar className="w-4 h-4" /> Horario{' '}
            {todayClasses.length > 0 && (
              <span className="chip bg-sky-400 text-slate-900 py-0">{todayClasses.length} hoy</span>
            )}
          </button>
          <button
            onClick={() => setIsJaverianaModalOpen(true)}
            className="btn-game px-4 py-2.5 text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black"
          >
            <Building2 className="w-4 h-4" /> Pensums Javeriana (47)
          </button>
          {studentLevel === 'school' && (
            <button
              onClick={() => setIsGraduationOpen(true)}
              className="btn-game px-4 py-2.5 text-sm bg-violet-500 hover:bg-violet-400 text-white"
            >
              <GraduationCap className="w-4 h-4" /> Pasar a la U
            </button>
          )}
        </div>
      </section>

      {/* SEMÁFORO GLOBAL */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statTiles.map((s) => (
          <div
            key={s.label}
            className={`rounded-3xl p-4 sm:p-5 text-white bg-gradient-to-br ${s.cls} shadow-pop hover:-translate-y-0.5 transition-transform`}
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl font-display font-bold">{s.n}</span>
              <span className="text-2xl bg-white/20 w-10 h-10 rounded-2xl grid place-items-center">
                {s.emoji}
              </span>
            </div>
            <p className="text-xs font-bold text-white/90 mt-1.5">{s.label}</p>
          </div>
        ))}
      </section>

      {total > 0 && (
        <div
          className="h-3.5 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 p-0.5 gap-0.5"
          title="Tu dominio total"
        >
          <div
            className="bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct(green)}%` }}
          />
          <div
            className="bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${pct(yellow)}%` }}
          />
          <div
            className="bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${pct(red)}%` }}
          />
        </div>
      )}

      {/* MISIÓN */}
      {subjects.length > 0 && (
        <TodayMissionCard
          subjects={subjects}
          currentDateStr={today}
          onReviewQuick={handleReviewQuick}
          onOpenChallenge60s={(topic, subjectName) => setActive60sTopic({ topic, subjectName })}
        />
      )}

      {/* MATERIAS */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div>
            <h2 className="text-2xl font-bold">Mis materias</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Haz clic en cualquier materia para agregar y clasificar sus temas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsJaverianaModalOpen(true)}
              className="btn-game px-3.5 py-2 text-xs sm:text-sm bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-none"
            >
              <Building2 className="w-4 h-4" /> Catálogo PUJ (47 carreras)
            </button>
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="btn-game px-3.5 py-2 text-xs sm:text-sm bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-none"
            >
              <UploadCloud className="w-4 h-4" /> Subir con temas
            </button>
            <button
              onClick={() => setIsAddingSubject(!isAddingSubject)}
              className="btn-game px-3.5 py-2 text-xs sm:text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900"
            >
              {isAddingSubject ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAddingSubject ? 'Cerrar' : 'Nueva Materia'}
            </button>
          </div>
        </div>

        {isAddingSubject && (
          <form onSubmit={handleCreateSubject} className="card p-5 mb-5 space-y-3.5 animate-scale-up border-2 border-emerald-500/30">
            <div className="flex gap-2.5">
              <span className="w-12 h-12 grid place-items-center text-2xl rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {newSubEmoji}
              </span>
              <input
                autoFocus
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder={
                  studentLevel === 'school'
                    ? 'Ej. Trigonometría, Biología, Inglés...'
                    : 'Ej. Cálculo Diferencial, Anatomía, Programación...'
                }
                className="flex-1 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button type="submit" className="btn-game px-5 bg-emerald-500 text-white">
                Crear
              </button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SUBJECT_EMOJI_LIST.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setNewSubEmoji(em)}
                  className={`shrink-0 w-10 h-10 rounded-xl text-xl transition ${
                    newSubEmoji === em
                      ? 'bg-emerald-500 text-white scale-110 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:scale-105'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400">Color:</span>
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setNewSubColor(swatch.id)}
                  aria-label={swatch.label}
                  title={swatch.label}
                  className={`w-7 h-7 rounded-full transition-transform ${swatch.bgClass} ${
                    newSubColor === swatch.id
                      ? 'ring-4 ring-offset-2 ring-slate-300 dark:ring-offset-slate-900 scale-110'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </form>
        )}

        {subjects.length === 0 ? (
          <div className="card p-8 sm:p-12 text-center border-dashed border-2 border-slate-300 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-4xl mx-auto animate-float">
              📚
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Tu tablero está limpio y listo desde cero
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Agrega tus materias reales para clasificar tus temas en verde, amarillo o rojo y activar tu batería de 7 días.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsJaverianaModalOpen(true)}
                className="btn-game px-5 py-3 text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black"
              >
                <Building2 className="w-4 h-4" /> Cargar Pensum U. Javeriana
              </button>
              <button
                onClick={() => setIsAddingSubject(true)}
                className="btn-game px-5 py-3 text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                <Plus className="w-4 h-4" /> Crear mi primera materia
              </button>
              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="btn-game px-5 py-3 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                <UploadCloud className="w-4 h-4" /> Subir materia con lista de temas
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <SubjectWorldCard
                key={s.id}
                subject={s}
                currentDateStr={today}
                onOpenSubject={(id) => setActiveView('subject', id)}
              />
            ))}
          </div>
        )}
      </section>

      {active60sTopic && (
        <QuickReviewModal
          topic={active60sTopic.topic}
          subjectName={active60sTopic.subjectName}
          onClose={() => setActive60sTopic(null)}
        />
      )}

      <JaverianaPensumModal
        isOpen={isJaverianaModalOpen}
        onClose={() => setIsJaverianaModalOpen(false)}
      />
    </div>
  );
};
