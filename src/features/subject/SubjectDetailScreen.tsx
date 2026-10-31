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
import { MasteryLevel, Topic, Subject } from '@/types';
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
  Layers,
  Sparkles,
} from 'lucide-react';

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
  } = useStudyStore();
  const { recordTopicReview, recordStatusChange, checkAndAwardBadges, addXP } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [initialStatus, setInitialStatus] = useState<MasteryLevel>('yellow');
  const [initialSummary, setInitialSummary] = useState('');
  const [active60sTopic, setActive60sTopic] = useState<Topic | null>(null);
  const [summaryModalTopic, setSummaryModalTopic] = useState<Topic | null>(null);
  const [isSubjectConfigOpen, setIsSubjectConfigOpen] = useState(false);

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
    updateTopicSummary(subject.id, topicId, summaryText, photoUrl);
    addXP(15);
    try {
      await api.updateTopic(topicId, { summary: summaryText, summaryPhoto: photoUrl });
    } catch {}
  };

  const handleReview = async (topicId: string, wasLowBattery: boolean) => {
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
        <div className="space-y-3">
          {subject.topics.map((top) => (
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
    </div>
  );
};
