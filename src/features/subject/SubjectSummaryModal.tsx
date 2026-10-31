import React, { useState } from 'react';
import { Subject } from '@/types';
import { SUBJECT_EMOJI_LIST } from '@/config/curriculum.config';
import { X, Image, Upload, Trash2, CheckCircle2, BookOpen, Calendar, Sparkles } from 'lucide-react';

interface SubjectSummaryModalProps {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Subject>) => void;
}

export const SubjectSummaryModal: React.FC<SubjectSummaryModalProps> = ({
  subject,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(subject.name);
  const [code, setCode] = useState(subject.code);
  const [emoji, setEmoji] = useState(subject.emoji || '📚');
  const [summary, setSummary] = useState(subject.summary || '');
  const [summaryPhoto, setSummaryPhoto] = useState(subject.summaryPhoto || '');
  const [examDate, setExamDate] = useState(subject.examDate || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La foto debe ser menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setSummaryPhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      emoji,
      summary,
      summaryPhoto,
      examDate: examDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="card w-full max-w-xl my-8 p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-2.5xs">
            Configuración
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>{emoji}</span>
          <span>Configurar Materia & Sílabo</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Personaliza el emoji, código y resumen general de esta materia.
        </p>

        {/* Selector de Emoji */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Selecciona un Emoji:
          </label>
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-32 overflow-y-auto">
            {SUBJECT_EMOJI_LIST.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`p-2 text-xl rounded-xl transition-transform hover:scale-110 flex items-center justify-center ${
                  emoji === em
                    ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* Nombre y Código */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nombre de la Materia:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Código / Sigla:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        {/* Fecha de Examen */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Fecha del Próximo Examen / Parcial (Opcional):</span>
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
          />
        </div>

        {/* Resumen del Sílabo */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Resumen del Sílabo / Objetivos del Curso:</span>
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Objetivos clave del semestre, temas a evaluar, porcentajes..."
            className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
          />
        </div>

        {/* Foto del Sílabo */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-purple-500" />
            <span>Foto del Sílabo / Cronograma Oficial:</span>
          </label>

          {summaryPhoto ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-slate-100 dark:bg-slate-800 group">
              <img src={summaryPhoto} alt="Sílabo de la materia" className="w-full h-full object-contain max-h-48 mx-auto" />
              <button
                type="button"
                onClick={() => setSummaryPhoto('')}
                className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 text-white hover:bg-rose-600 transition-colors"
                title="Eliminar foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 cursor-pointer bg-slate-50 dark:bg-slate-800/40 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Haz clic para subir foto del sílabo
              </span>
              <span className="text-2.5xs text-slate-400 mt-0.5">PNG, JPG o WEBP (Máx. 5MB)</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Botones */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-game px-6 py-2.5 text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
