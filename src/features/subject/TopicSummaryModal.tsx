import React, { useState } from 'react';
import { Topic, MasteryLevel } from '@/types';
import { TrafficLightBadge } from '@/components/common/TrafficLightBadge';
import { X, Image, Upload, Trash2, CheckCircle2, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

interface TopicSummaryModalProps {
  topic: Topic | null;
  subjectName: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveSummary: (topicId: string, summary: string, photoUrl?: string) => void;
  onUpdateStatus?: (topicId: string, status: MasteryLevel) => void;
}

export const TopicSummaryModal: React.FC<TopicSummaryModalProps> = ({
  topic,
  subjectName,
  isOpen,
  onClose,
  onSaveSummary,
  onUpdateStatus,
}) => {
  if (!isOpen || !topic) return null;

  const [summary, setSummary] = useState(topic.summary || '');
  const [photoUrl, setPhotoUrl] = useState(topic.summaryPhoto || '');
  const [status, setStatus] = useState<MasteryLevel>(topic.status);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

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
      setPhotoUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveSummary(topic.id, summary, photoUrl);
    if (onUpdateStatus && status !== topic.status) {
      onUpdateStatus(topic.id, status);
    }
    setCopiedSuccess(true);
    setTimeout(() => {
      setCopiedSuccess(false);
      onClose();
    }, 350);
  };

  const isRed = status === 'red';
  const isYellow = status === 'yellow';

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

        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-1">
          <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-2.5xs">
            {subjectName}
          </span>
          <span className="text-2.5xs text-slate-400 font-bold">Ficha de Resumen & Fórmulas</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white pr-8">
          {topic.name}
        </h2>

        {/* Estado actual y recomendación pedagógica */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Semáforo:</span>
            <TrafficLightBadge
              status={status}
              interactive
              onChange={(newSt) => setStatus(newSt)}
            />
          </div>

          <div className="text-xs">
            {isRed && (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Vacío crítico: escribe la idea básica
              </span>
            )}
            {isYellow && (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Falta práctica: anota tus fórmulas
              </span>
            )}
            {status === 'green' && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tema dominado
              </span>
            )}
          </div>
        </div>

        {/* Guía Feynman si está en rojo */}
        {isRed && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
            <strong className="font-heading font-black block mb-0.5">💡 Técnica Feynman:</strong>
            Explícalo con palabras muy sencillas como a un compañero de clase. Si te trabas, anota exactamente esa duda aquí.
          </div>
        )}

        {/* Campo de notas / resúmenes / fórmulas */}
        <div className="mt-4">
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Resumen Conceptual, Fórmulas o Pasos Clave:</span>
          </label>
          <textarea
            rows={5}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ejemplo: Fórmula: a² + b² = c²&#10;Paso 1: Identificar la hipotenusa.&#10;Duda clave: Despejar cuando piden un cateto..."
            className="w-full p-3.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed font-medium"
          />
        </div>

        {/* Subida de Foto */}
        <div className="mt-4">
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-purple-500" />
            <span>Foto de Cuaderno / Pizarra / Diagrama:</span>
          </label>

          {photoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56 bg-slate-100 dark:bg-slate-800 group">
              <img src={photoUrl} alt="Apunte del tema" className="w-full h-full object-contain max-h-56 mx-auto" />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
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
                Haz clic para subir foto del apunte o pizarra
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
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-game px-6 py-2.5 text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar Resumen (+15 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
