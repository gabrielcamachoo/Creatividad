import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TopicRow } from './TopicRow';
import { TopicSummaryModal } from './TopicSummaryModal';
import { SubjectSummaryModal } from './SubjectSummaryModal';
import { QuickReviewModal } from '../dashboard/QuickReviewModal';
import { SemaforoAssistantBanner } from '@/components/common/SemaforoAssistantBanner';
import { MasteryLevel, Topic, Subject, SubjectAcademicStatus } from '@/types';
import { UNIVERSITY_TEMPLATES, SubjectTemplate } from '@/config/curriculum.config';
import { soundEngine } from '@/lib/soundEffects';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Settings2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Brain,
  Search,
  Award,
  PauseCircle,
  RotateCcw,
  ArrowLeftRight,
  Calculator,
  Printer,
} from 'lucide-react';
import { GradeCalculatorModal } from './GradeCalculatorModal';
import { FlashcardStudyModal } from './FlashcardStudyModal';
import { printSubjectCheatsheet } from '@/lib/pdfExport';

export const SubjectDetailScreen: React.FC = () => {
  const { selectedSubjectId, setActiveView } = useSettingsStore();
  const {
    subjects,
    addTopic,
    deleteTopic,
    updateTopicStatus,
    updateTopicSummary,
    reviewTopicToday,
    deleteSubject,
    updateSubject,
    setSubjectAcademicStatus,
    retakeSubject,
    replaceSubjectWithTemplate,
    updateGradeCuts,
  } = useStudyStore();
  const { userProfile } = useSettingsStore();
  const { recordTopicReview, recordStatusChange, checkAndAwardBadges, addXP } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [initialStatus, setInitialStatus] = useState<MasteryLevel>('yellow');
  const [initialSummary, setInitialSummary] = useState('');
  const [active60sTopic, setActive60sTopic] = useState<Topic | null>(null);
  const [summaryModalTopic, setSummaryModalTopic] = useState<Topic | null>(null);
  const [isSubjectConfigOpen, setIsSubjectConfigOpen] = useState(false);
  const [isGradeCalcOpen, setIsGradeCalcOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | MasteryLevel>('ALL');
  const [topicSearch, setTopicSearch] = useState('');
  const [gradeInput, setGradeInput] = useState('4.2');
  const [isSwapPanelOpen, setIsSwapPanelOpen] = useState(false);
  const [swapSearch, setSwapSearch] = useState('');

  const currentDateStr = getSimulatedDateStr();
  const subject = subjects.find((s) => s.id === selectedSubjectId);

  if (!subject) {
    return (
      <div className="py-20 text-center max-w-sm mx-auto px-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-4">
          🔍
        </div>
        <h3 className="font-heading font-black text-xl text-slate-900 dark:text-white">Materia no encontrada</h3>
        <p className="text-xs text-slate-500 mt-1">Quizás fue eliminada o movida.</p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-5 btn-game px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-2xl"
        >
          Volver al Tablero
        </button>
      </div>
    );
  }

  const greenCount = subject.topics.filter((t) => t.status === 'green').length;
  const yellowCount = subject.topics.filter((t) => t.status === 'yellow').length;
  const redCount = subject.topics.filter((t) => t.status === 'red').length;
  const totalTopics = subject.topics.length;
  const masteryPct = totalTopics > 0 ? Math.round((greenCount / totalTopics) * 100) : 0;

  const handleAddTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const createdTopic = addTopic(
      subject.id,
      topicName.trim(),
      currentDateStr,
      initialStatus,
      currentDateStr,
      initialSummary.trim()
    );

    try {
      await api.addTopic(subject.id, {
        id: createdTopic.id,
        name: topicName.trim(),
        classDate: currentDateStr,
        status: initialStatus,
        summary: initialSummary.trim(),
      });
    } catch (err) {
      console.warn('Tema guardado localmente', err);
    }

    setTopicName('');
    setInitialSummary('');
    setInitialStatus('yellow');
    setShowAddForm(false);
    checkAndAwardBadges(subjects, currentDateStr);
  };

  const handleStatusChange = async (topicId: string, newStatus: MasteryLevel) => {
    if (newStatus === 'green') soundEngine.playSuccessChime();
    else soundEngine.playPop();
    const res = updateTopicStatus(subject.id, topicId, newStatus);
    if (res) {
      recordStatusChange(res.oldStatus, res.newStatus);
      checkAndAwardBadges(subjects, currentDateStr);
      try {
        await api.updateTopic(topicId, { status: newStatus });
      } catch {}
    }
  };

  const handleSaveSummary = async (topicId: string, summaryText: string, photoUrl?: string) => {
    soundEngine.playSuccessChime();
    updateTopicSummary(subject.id, topicId, summaryText, photoUrl);
    addXP(15);
    try {
      await api.updateTopic(topicId, { summary: summaryText, summaryPhoto: photoUrl });
    } catch {}
  };

  const handleReview = async (topicId: string, wasLowBattery: boolean) => {
    soundEngine.playSuccessChime();
    reviewTopicToday(subject.id, topicId, currentDateStr);
    recordTopicReview(currentDateStr, wasLowBattery);
    checkAndAwardBadges(subjects, currentDateStr);
    try {
      await api.reviewTopic(topicId, currentDateStr);
    } catch {}
  };

  const handleDeleteTopic = async (topicId: string) => {
    deleteTopic(subject.id, topicId);
    try {
      await api.deleteTopic(topicId);
    } catch {}
  };

  const handleDeleteSub = async () => {
    if (confirm(`¿Eliminar la materia "${subject.name}" y todos sus temas?`)) {
      deleteSubject(subject.id);
      try {
        await api.deleteSubject(subject.id);
      } catch {}
      setActiveView('dashboard');
    }
  };

  const handleUpdateSubject = async (updates: Partial<Subject>) => {
    updateSubject(subject.id, updates);
    try {
      await api.updateSubject(subject.id, updates);
    } catch {}
  };

  const currentAcademicStatus: SubjectAcademicStatus = subject.academicStatus || 'enrolled';

  const handleSetAcademicStatus = (
    status: SubjectAcademicStatus,
    grade?: number,
    note?: string,
    markGreen = false
  ) => {
    if (status === 'passed') {
      soundEngine.playSuccessChime();
      addXP(45);
    } else {
      soundEngine.playPop();
    }
    setSubjectAcademicStatus(subject.id, status, {
      finalGrade: grade,
      statusNote: note,
      markAllTopicsGreen: markGreen,
    });
  };

  const handleRetake = (mode: 'keep_green' | 'reset_all_red') => {
    soundEngine.playSuccessChime();
    retakeSubject(
      subject.id,
      mode,
      `Re-inscrita (Intento #${(subject.attemptCount || 1) + 1})`
    );
    addXP(20);
  };

  const handleSwapWithTemplate = (tpl: SubjectTemplate) => {
    soundEngine.playSuccessChime();
    replaceSubjectWithTemplate(subject.id, tpl, 'enrolled');
    setIsSwapPanelOpen(false);
    setSwapSearch('');
  };

  // Lista rápida de materias PUJ para reemplazo cuando se abre el panel de cambio
  const matchingPujTemplates: Array<{ careerName: string; subject: SubjectTemplate }> =
    isSwapPanelOpen
      ? UNIVERSITY_TEMPLATES.flatMap((c) =>
          c.subjects.map((s) => ({ careerName: c.name, subject: s }))
        )
          .filter((item, idx, arr) => {
            const q = swapSearch.trim().toLowerCase();
            const matchesQuery =
              !q ||
              item.subject.name.toLowerCase().includes(q) ||
              item.subject.code.toLowerCase().includes(q) ||
              item.careerName.toLowerCase().includes(q);
            const isUnique =
              arr.findIndex(
                (other) =>
                  other.subject.code === item.subject.code &&
                  other.subject.name === item.subject.name
              ) === idx;
            return matchesQuery && isUnique;
          })
          .slice(0, 12)
      : [];

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in text-left">
      {/* Botón Volver */}
      <button
        onClick={() => setActiveView('dashboard')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Tablero</span>
      </button>

      {/* Cabecera Bento de la Materia */}
      <div className="card p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-inner shrink-0 transform transition-transform hover:rotate-6">
              {subject.emoji || '📚'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {subject.code}
                </span>
                {subject.semester && (
                  <span className="chip bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Sem. {subject.semester} · {subject.credits || 3} cr.
                  </span>
                )}
                {(subject.attemptCount || 1) > 1 && (
                  <span className="chip bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    🔄 {subject.attemptCount}ª vez (Repetición)
                  </span>
                )}
                {subject.examDate && (
                  <span className="chip bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    <Calendar className="w-3 h-3" />
                    <span>Examen: {subject.examDate}</span>
                  </span>
                )}
                <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {masteryPct}% Dominado
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                {subject.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{totalTopics} tema{totalTopics === 1 ? '' : 's'}</span>
                <span>•</span>
                <span className="text-rose-500 font-bold">{redCount} vacíos</span>
                <span>•</span>
                <span className="text-amber-500 font-bold">{yellowCount} por pulir</span>
                <span>•</span>
                <span className="text-emerald-500 font-bold">{greenCount} listos</span>
              </div>
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFlashcardsOpen(true)}
              className="btn-game px-3.5 py-2 rounded-2xl text-xs font-heading font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-glow"
              title="Iniciar sesión de evocación activa con tarjetas 3D y resumen Feynman"
            >
              <span>🎴</span>
              <span>Repaso Flashcards 3D</span>
            </button>

            <button
              onClick={() => setIsGradeCalcOpen(true)}
              className="btn-game px-3.5 py-2 rounded-2xl text-xs font-heading font-black bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5"
              title="Calcular notas de cortes y nota necesaria para el examen final"
            >
              <Calculator className="w-4 h-4" />
              <span>Simular Cortes & Notas</span>
            </button>

            <button
              onClick={() => printSubjectCheatsheet(subject, userProfile?.name || 'Estudiante')}
              className="btn-game px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              title="Generar Ficha de Estudio / Hoja de Fórmulas imprimible en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Ficha PDF</span>
            </button>

            <button
              onClick={() => setActiveView('focus', subject.id)}
              className="btn-game px-3.5 py-2 rounded-2xl text-xs font-heading font-black bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
              title="Estudiar esta materia con Pomodoro, Flashcards 3D y Feynman"
            >
              <Brain className="w-4 h-4" />
              <span>Flashcards & Pomodoro</span>
            </button>

            <button
              onClick={() => setIsSubjectConfigOpen(true)}
              className="btn-game px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              title="Configurar sílabo y emoji"
            >
              <Settings2 className="w-4 h-4" />
              <span>Sílabo & Emoji</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-game px-4 py-2 rounded-2xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Agregar Tema</span>
            </button>

            <button
              onClick={handleDeleteSub}
              className="p-2.5 text-slate-400 hover:text-rose-500 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Eliminar materia"
              aria-label="Eliminar materia"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de progreso visual segmentada */}
        {totalTopics > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 gap-0.5">
              <div
                style={{ width: `${(greenCount / totalTopics) * 100}%` }}
                className="bg-emerald-500 rounded-full transition-all duration-500"
                title={`${greenCount} dominados`}
              />
              <div
                style={{ width: `${(yellowCount / totalTopics) * 100}%` }}
                className="bg-amber-400 rounded-full transition-all duration-500"
                title={`${yellowCount} por practicar`}
              />
              <div
                style={{ width: `${(redCount / totalTopics) * 100}%` }}
                className="bg-rose-500 rounded-full transition-all duration-500"
                title={`${redCount} vacíos`}
              />
            </div>
          </div>
        )}
      </div>

      {/* PANEL DE CICLO ACADÉMICO SEMESTRAL: Pasada, Retirada, Perdida, Volver a ver o Cambiar Materia */}
      <div className="card p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Estado Académico en tu Semestre
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {currentAcademicStatus === 'enrolled' &&
                '📘 Cursando actualmente. Si ya la aprobaste, la retiraste a mitad de semestre o la perdiste, cámbialo aquí:'}
              {currentAcademicStatus === 'passed' &&
                `✅ Materia Aprobada / Pasada${
                  typeof subject.finalGrade === 'number'
                    ? ` con nota definitiva ${subject.finalGrade.toFixed(1)}`
                    : ''
                }. Todos sus temas cuentan como dominados.`}
              {currentAcademicStatus === 'withdrawn' &&
                '⏸️ Materia retirada a mitad de semestre. No genera alertas diarias hasta que decidas volver a verla.'}
              {currentAcademicStatus === 'failed' &&
                '❌ Materia marcada como perdida. Puedes volver a inscribirla este semestre conservando tus temas verdes o desde cero.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSwapPanelOpen(!isSwapPanelOpen)}
            className="btn-game px-3.5 py-2 rounded-xl text-xs font-heading font-black bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{isSwapPanelOpen ? 'Cerrar cambio de materia' : 'Cambiar por otra materia del Pensum'}</span>
          </button>
        </div>

        {/* Botones de Estado Académico */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSetAcademicStatus('enrolled', undefined, 'Cursando en el semestre actual', false)}
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-black border transition-all ${
              currentAcademicStatus === 'enrolled'
                ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            📘 Cursando ahora
          </button>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-1 pr-2">
            <button
              type="button"
              onClick={() =>
                handleSetAcademicStatus(
                  'passed',
                  Number(gradeInput) || 4.2,
                  'Materia aprobada y homologada en historial',
                  true
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-black flex items-center gap-1 transition-all ${
                currentAcademicStatus === 'passed'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>✅ Marcar Ya Pasada</span>
            </button>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Nota:</span>
            <input
              type="number"
              min="3.0"
              max="5.0"
              step="0.1"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              className="w-14 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs font-black text-emerald-700 dark:text-emerald-300 text-center"
              aria-label="Nota definitiva"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              handleSetAcademicStatus(
                'withdrawn',
                undefined,
                'Retirada a mitad de semestre — pendiente por volver a ver',
                false
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-black border flex items-center gap-1.5 transition-all ${
              currentAcademicStatus === 'withdrawn'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25 hover:bg-amber-500/20'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>⏸️ Retirar (Mitad de semestre)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSetAcademicStatus(
                'failed',
                2.4,
                'Materia perdida — lista para repetir y desquitarse',
                false
              )
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-heading font-black border flex items-center gap-1.5 transition-all ${
              currentAcademicStatus === 'failed'
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/25 hover:bg-rose-500/20'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>❌ Marcar como Perdida</span>
          </button>
        </div>

        {/* Banner de Re-inscripción cuando está Retirada o Perdida */}
        {(currentAcademicStatus === 'withdrawn' || currentAcademicStatus === 'failed') && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-heading font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                <span>¿Vas a volver a ver {subject.name} este semestre?</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Elige si quieres conservar en 🟢 Verde los temas que ya habías aprendido antes de retirarla/perderla, o reiniciar todo desde 🔴 Rojo.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleRetake('keep_green')}
                className="btn-game px-3.5 py-2 rounded-xl text-xs font-heading font-black bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                🔄 Volver a ver (Conservar mis 🟢 Verdes)
              </button>
              <button
                type="button"
                onClick={() => handleRetake('reset_all_red')}
                className="btn-game px-3.5 py-2 rounded-xl text-xs font-heading font-black bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                Reiniciar todo en 🔴 Rojo
              </button>
            </div>
          </div>
        )}

        {/* Buscador para Cambiar / Reemplazar esta materia por otra del Pensum Javeriana */}
        {isSwapPanelOpen && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3 animate-scale-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-heading font-black text-amber-700 dark:text-amber-300">
                  🔀 Cambiar o reemplazar "{subject.name}" por otra asignatura del Pensum PUJ
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ideal si cambiaste de electiva o ajustaste tu horario después de importar el semestre.
                </p>
              </div>
              <input
                type="text"
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                placeholder="Buscar materia (ej. Cálculo, Énfasis, Constitución, Bioética)..."
                className="w-full sm:w-72 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {matchingPujTemplates.map((item) => (
                <button
                  key={`${item.careerName}-${item.subject.code}-${item.subject.name}`}
                  type="button"
                  onClick={() => handleSwapWithTemplate(item.subject)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-left transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-heading font-black text-slate-900 dark:text-white block truncate">
                      {item.subject.emoji} {item.subject.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {item.subject.code} · Sem. {item.subject.semester} · {item.careerName}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 shrink-0">
                    Reemplazar →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumen del Sílabo / Apunte general */}
      {(subject.summary || subject.summaryPhoto) && (
        <div className="card p-5 bg-blue-500/5 border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Sílabo & Objetivos</span>
            </h4>
            <button
              onClick={() => setIsSubjectConfigOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              Editar
            </button>
          </div>

          {subject.summary && (
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {subject.summary}
            </p>
          )}

          {subject.summaryPhoto && (
            <div className="rounded-2xl overflow-hidden border border-blue-200 dark:border-blue-900/50 max-h-48 bg-white dark:bg-slate-900">
              <img src={subject.summaryPhoto} alt="Sílabo" className="w-full h-full object-contain max-h-48" />
            </div>
          )}
        </div>
      )}

      {/* Asistente inteligente de priorización */}
      <SemaforoAssistantBanner />

      {/* Formulario rápido para agregar tema (Minimalist & Tactile) */}
      {showAddForm && (
        <form
          onSubmit={handleAddTopicSubmit}
          className="card p-5 border-2 border-emerald-500/40 space-y-4 animate-scale-up"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-black text-base text-slate-900 dark:text-white">
                Nuevo Tema en {subject.emoji || '📚'} {subject.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Clasifícalo con honestidad: el sistema cuidará que no se te olvide.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cerrar
            </button>
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="Nombre del tema (ej. Identidades Trigonométricas, Fotosíntesis, Ciclos...)"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              required
              autoFocus
            />

            <input
              type="text"
              placeholder="Apunte clave, duda puntual o fórmula (opcional)..."
              value={initialSummary}
              onChange={(e) => setInitialSummary(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Selector de Semáforo de 1 toque */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
              ¿Cuál es tu nivel hoy?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setInitialStatus('green')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  initialStatus === 'green'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/40'
                    : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-heading font-black text-xs block">🟢 Dominado</span>
                  <span className="text-2.5xs text-slate-500">Sé resolver y explicar</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInitialStatus('yellow')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  initialStatus === 'yellow'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 shadow-sm ring-2 ring-amber-500/40'
                    : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="font-heading font-black text-xs block">🟡 Falta práctica</span>
                  <span className="text-2.5xs text-slate-500">Dudas en ejercicios</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInitialStatus('red')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  initialStatus === 'red'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 shadow-sm ring-2 ring-rose-500/40'
                    : 'border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-heading font-black text-xs block">🔴 Vacío crítico</span>
                  <span className="text-2.5xs text-slate-500">No sé nada / confusión</span>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-game px-5 py-2.5 text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
            >
              Guardar en MiSemaforo
            </button>
          </div>
        </form>
      )}

      {/* Lista de Temas */}
      {subject.topics.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-3xl mx-auto mb-3">
            🌱
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
            Tu materia aún está en blanco
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Agrega los temas del próximo examen o tarea para que el semáforo y la batería los cuiden.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-game px-5 py-2.5 text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl"
          >
            + Agregar primer tema
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Barra de filtro por estado de Semáforo y buscador de temas */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: `Todos (${totalTopics})` },
                { id: 'red', label: `🔴 Rojos (${redCount})` },
                { id: 'yellow', label: `🟡 Amarillos (${yellowCount})` },
                { id: 'green', label: `🟢 Verdes (${greenCount})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setStatusFilter(pill.id as 'ALL' | MasteryLevel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-black border transition-all ${
                    statusFilter === pill.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="Buscar tema..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {subject.topics
              .filter((top) => {
                const matchesStatus = statusFilter === 'ALL' || top.status === statusFilter;
                const q = topicSearch.trim().toLowerCase();
                const matchesSearch =
                  !q ||
                  top.name.toLowerCase().includes(q) ||
                  (top.summary || '').toLowerCase().includes(q);
                return matchesStatus && matchesSearch;
              })
              .map((top) => (
                <TopicRow
                  key={top.id}
                  topic={top}
                  subjectName={subject.name}
                  currentDateStr={currentDateStr}
                  onUpdateStatus={handleStatusChange}
                  onReviewToday={handleReview}
                  onOpenChallenge60s={(t) => setActive60sTopic(t)}
                  onOpenSummary={(t) => setSummaryModalTopic(t)}
                  onDeleteTopic={handleDeleteTopic}
                />
              ))}
          </div>
        </div>
      )}

      {/* Modal 60s */}
      {active60sTopic && (
        <QuickReviewModal
          topic={active60sTopic}
          subjectName={subject.name}
          onClose={() => setActive60sTopic(null)}
        />
      )}

      {/* Modal Resumen del Tema */}
      {summaryModalTopic && (
        <TopicSummaryModal
          topic={summaryModalTopic}
          subjectName={subject.name}
          isOpen={Boolean(summaryModalTopic)}
          onClose={() => setSummaryModalTopic(null)}
          onSaveSummary={handleSaveSummary}
          onUpdateStatus={handleStatusChange}
        />
      )}

      {/* Modal Configuración de Materia / Sílabo */}
      {isSubjectConfigOpen && (
        <SubjectSummaryModal
          subject={subject}
          isOpen={isSubjectConfigOpen}
          onClose={() => setIsSubjectConfigOpen(false)}
          onSave={handleUpdateSubject}
        />
      )}

      {/* Modal Simulador de Cortes & Notas */}
      {isGradeCalcOpen && (
        <GradeCalculatorModal
          subject={subject}
          isOpen={isGradeCalcOpen}
          onClose={() => setIsGradeCalcOpen(false)}
          onSave={(cuts, target) => updateGradeCuts(subject.id, cuts, target)}
        />
      )}

      {/* Modal de Repaso con Flashcards 3D */}
      <FlashcardStudyModal
        subject={subject}
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
      />
    </div>
  );
};
