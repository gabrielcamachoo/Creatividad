import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTimeStore } from '@/store/useTimeStore';
import { api } from '@/lib/api';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const BulkImportModal: React.FC = () => {
  const { isBulkImportOpen, setIsBulkImportOpen, studentLevel, setActiveView } = useSettingsStore();
  const { addSubject, addTopic, subjects } = useStudyStore();
  const { checkAndAwardBadges } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();

  const [subjectName, setSubjectName] = useState('');
  const [code, setCode] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📚');
  const [colorTheme, setColorTheme] = useState('emerald');
  const [examDate, setExamDate] = useState('');

  // 3 listas de temas
  const [masteredTopics, setMasteredTopics] = useState<string[]>(['']);
  const [partialTopics, setPartialTopics] = useState<string[]>(['']);
  const [unknownTopics, setUnknownTopics] = useState<string[]>(['']);

  const [activeTab, setActiveTab] = useState<'green' | 'yellow' | 'red'>('green');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBulkImportOpen) return null;

  const handleAddRow = (listType: 'green' | 'yellow' | 'red') => {
    if (listType === 'green') setMasteredTopics([...masteredTopics, '']);
    if (listType === 'yellow') setPartialTopics([...partialTopics, '']);
    if (listType === 'red') setUnknownTopics([...unknownTopics, '']);
  };

  const handleRemoveRow = (listType: 'green' | 'yellow' | 'red', index: number) => {
    if (listType === 'green') setMasteredTopics(masteredTopics.filter((_, i) => i !== index));
    if (listType === 'yellow') setPartialTopics(partialTopics.filter((_, i) => i !== index));
    if (listType === 'red') setUnknownTopics(unknownTopics.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (listType: 'green' | 'yellow' | 'red', index: number, value: string) => {
    if (listType === 'green') {
      const copy = [...masteredTopics];
      copy[index] = value;
      setMasteredTopics(copy);
    }
    if (listType === 'yellow') {
      const copy = [...partialTopics];
      copy[index] = value;
      setPartialTopics(copy);
    }
    if (listType === 'red') {
      const copy = [...unknownTopics];
      copy[index] = value;
      setUnknownTopics(copy);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setIsSubmitting(true);
    const todayStr = getSimulatedDateStr();

    const cleanMastered = masteredTopics.map((t) => t.trim()).filter(Boolean);
    const cleanPartial = partialTopics.map((t) => t.trim()).filter(Boolean);
    const cleanUnknown = unknownTopics.map((t) => t.trim()).filter(Boolean);

    // 1. Crear materia en Zustand
    const newSubId = addSubject(
      subjectName.trim(),
      code.trim() || subjectName.trim().substring(0, 3).toUpperCase(),
      colorTheme,
      selectedEmoji,
      '',
      examDate || undefined
    );

    // 2. Insertar temas clasificados con su respectivo estado
    cleanMastered.forEach((name) => {
      addTopic(newSubId, name, todayStr, 'green');
    });

    cleanPartial.forEach((name) => {
      addTopic(newSubId, name, todayStr, 'yellow');
    });

    cleanUnknown.forEach((name) => {
      addTopic(newSubId, name, todayStr, 'red');
    });

    // 3. Sincronizar en segundo plano con el backend
    try {
      await api.bulkImport({
        subjectName: subjectName.trim(),
        code: code.trim(),
        colorTheme,
        examDate: examDate || undefined,
        masteredTopics: cleanMastered,
        partialTopics: cleanPartial,
        unknownTopics: cleanUnknown,
      });
    } catch (err) {
      console.warn('Guardado localmente', err);
    }

    checkAndAwardBadges(subjects, todayStr);
    setIsSubmitting(false);
    setIsBulkImportOpen(false);

    setActiveView('subject', newSubId);
  };

  const suggestions =
    studentLevel === 'school'
      ? ['Trigonometría', 'Biología', 'Química', 'Historia', 'Lengua Castellana', 'Inglés']
      : ['Cálculo Diferencial', 'Física Mecánica', 'Programación', 'Álgebra Lineal', 'Estadística'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-2xl my-8 p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl">
        {/* Cerrar */}
        <button
          onClick={() => setIsBulkImportOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          aria-label="Cerrar importador"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Asistente de Subida</span>
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
          Sube tu Materia y Clasifica tus Temas 🚦
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Separa lo que dominas, lo que dudas y lo que no entiendes para cuidarlo con el semáforo.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Datos de la materia */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emoji
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {selectedEmoji}
                  </span>
                  <select
                    value={selectedEmoji}
                    onChange={(e) => setSelectedEmoji(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {['📐', '🧬', '🩺', '⚖️', '💻', '🔬', '🎨', '🏛️', '📊', '🌍', '📚', '🇬🇧', '⚡', '🧪', '🫀', '🧠', '🚀', '🤖', '🎵'].map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Materia *
                </label>
                <input
                  type="text"
                  placeholder={studentLevel === 'school' ? 'Ej. Trigonometría' : 'Ej. Física Mecánica'}
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  placeholder="Ej. MAT-10"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Sugerencias rápidas */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-slate-500">
              <span className="font-bold text-2.5xs">Sugerencias:</span>
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setSubjectName(sug)}
                  className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/20 text-2.5xs font-bold"
                >
                  {sug}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha del Examen (Opcional)
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Color del Mundo
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {(['emerald', 'blue', 'purple', 'amber'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorTheme(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        c === 'emerald'
                          ? 'bg-emerald-500'
                          : c === 'blue'
                          ? 'bg-blue-500'
                          : c === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-amber-500'
                      } ${colorTheme === c ? 'scale-110 border-white ring-2 ring-slate-400' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Pestaña Semáforo */}
          <div className="space-y-3">
            <p className="font-heading font-black text-xs text-slate-700 dark:text-slate-300">
              Clasifica los temas vistos:
            </p>

            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('green')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'green'
                    ? 'bg-emerald-500 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="truncate">🟢 Dominas ({masteredTopics.filter((t) => t.trim()).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('yellow')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'yellow'
                    ? 'bg-amber-500 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="truncate">🟡 Sabes poco ({partialTopics.filter((t) => t.trim()).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('red')}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'red'
                    ? 'bg-rose-500 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="truncate">🔴 No sabes ({unknownTopics.filter((t) => t.trim()).length})</span>
              </button>
            </div>

            {/* Contenido según pestaña */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 max-h-56 overflow-y-auto space-y-2">
              {activeTab === 'green' && (
                <>
                  <p className="text-2.5xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    ✔ Temas que sabes explicar bien y resuelves sin dudar:
                  </p>
                  {masteredTopics.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Tema dominado #${idx + 1}`}
                        value={val}
                        onChange={(e) => handleUpdateRow('green', idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                      {masteredTopics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow('green', idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddRow('green')}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Agregar otro tema dominado
                  </button>
                </>
              )}

              {activeTab === 'yellow' && (
                <>
                  <p className="text-2.5xs text-amber-600 dark:text-amber-400 font-bold mb-2">
                    ⚠ Temas donde entiendes la teoría pero dudas en ejercicios:
                  </p>
                  {partialTopics.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Tema por pulir #${idx + 1}`}
                        value={val}
                        onChange={(e) => handleUpdateRow('yellow', idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                      {partialTopics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow('yellow', idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddRow('yellow')}
                    className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Agregar otro tema por pulir
                  </button>
                </>
              )}

              {activeTab === 'red' && (
                <>
                  <p className="text-2.5xs text-rose-600 dark:text-rose-400 font-bold mb-2">
                    ✖ Temas donde no entiendes nada o tienes dudas críticas:
                  </p>
                  {unknownTopics.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Vacío conceptual crítico #${idx + 1}`}
                        value={val}
                        onChange={(e) => handleUpdateRow('red', idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      />
                      {unknownTopics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow('red', idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddRow('red')}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Agregar otro vacío
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsBulkImportOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-game px-6 py-2.5 rounded-2xl text-xs font-heading font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en MiSemaforo...' : 'Guardar y Ver Tablero'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
