import React, { useState } from 'react';
import { Subject, GradeCut } from '@/types';
import { soundEngine } from '@/lib/soundEffects';
import {
  Calculator,
  X,
  Plus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';

interface GradeCalculatorModalProps {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cuts: GradeCut[], targetGrade: number) => void;
}

const DEFAULT_CUTS: GradeCut[] = [
  { id: 'cut-1', name: 'Corte 1 (Primer Parcial)', percentage: 30, grade: 3.8 },
  { id: 'cut-2', name: 'Corte 2 (Segundo Parcial)', percentage: 30, grade: 2.9 },
  { id: 'cut-3', name: 'Corte 3 (Examen Final)', percentage: 40, grade: undefined },
];

export const GradeCalculatorModal: React.FC<GradeCalculatorModalProps> = ({
  subject,
  isOpen,
  onClose,
  onSave,
}) => {
  const [cuts, setCuts] = useState<GradeCut[]>(() => {
    if (subject.gradeCuts && subject.gradeCuts.length > 0) {
      return subject.gradeCuts;
    }
    return DEFAULT_CUTS;
  });

  const [targetGrade, setTargetGrade] = useState<number>(subject.targetGrade ?? 3.0);

  if (!isOpen) return null;

  const totalPercentage = cuts.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0);

  // Calcular acumulado actual y peso evaluado
  let evaluatedWeight = 0;
  let accumulatedPoints = 0;

  cuts.forEach((c) => {
    if (c.grade !== undefined && c.grade !== null && !isNaN(c.grade)) {
      const weight = (Number(c.percentage) || 0) / 100;
      evaluatedWeight += weight;
      accumulatedPoints += c.grade * weight;
    }
  });

  const remainingWeight = Math.max(0, 1 - evaluatedWeight);
  const currentAverage = evaluatedWeight > 0 ? (accumulatedPoints / evaluatedWeight).toFixed(2) : '0.00';

  // ¿Cuánto necesita en lo que falta para llegar a targetGrade?
  // accumulatedPoints + neededGrade * remainingWeight = targetGrade
  let neededGrade: number | null = null;
  if (remainingWeight > 0.001) {
    const rawNeeded = (targetGrade - accumulatedPoints) / remainingWeight;
    neededGrade = Number(rawNeeded.toFixed(2));
  } else {
    neededGrade = null;
  }

  const handleGradeChange = (id: string, valStr: string) => {
    const num = valStr === '' ? undefined : Math.min(5.0, Math.max(0, parseFloat(valStr)));
    setCuts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, grade: num } : c))
    );
  };

  const handlePercentageChange = (id: string, valStr: string) => {
    const num = Math.max(1, Math.min(100, parseInt(valStr) || 0));
    setCuts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, percentage: num } : c))
    );
  };

  const handleNameChange = (id: string, val: string) => {
    setCuts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: val } : c))
    );
  };

  const handleAddCut = () => {
    const newId = `cut-${Date.now()}`;
    const nextNum = cuts.length + 1;
    setCuts((prev) => [
      ...prev,
      { id: newId, name: `Corte ${nextNum}`, percentage: 20, grade: undefined },
    ]);
  };

  const handleRemoveCut = (id: string) => {
    if (cuts.length <= 1) return;
    setCuts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleApplyPreset = (preset: '30_30_40' | '35_35_30' | '25_25_25_25') => {
    if (preset === '30_30_40') {
      setCuts([
        { id: 'cut-1', name: 'Corte 1 (30%)', percentage: 30, grade: cuts[0]?.grade },
        { id: 'cut-2', name: 'Corte 2 (30%)', percentage: 30, grade: cuts[1]?.grade },
        { id: 'cut-3', name: 'Examen Final (40%)', percentage: 40, grade: cuts[2]?.grade },
      ]);
    } else if (preset === '35_35_30') {
      setCuts([
        { id: 'cut-1', name: 'Primer Parcial (35%)', percentage: 35, grade: cuts[0]?.grade },
        { id: 'cut-2', name: 'Segundo Parcial (35%)', percentage: 35, grade: cuts[1]?.grade },
        { id: 'cut-3', name: 'Examen Final (30%)', percentage: 30, grade: cuts[2]?.grade },
      ]);
    } else {
      setCuts([
        { id: 'cut-1', name: 'Corte 1 (25%)', percentage: 25, grade: cuts[0]?.grade },
        { id: 'cut-2', name: 'Corte 2 (25%)', percentage: 25, grade: cuts[1]?.grade },
        { id: 'cut-3', name: 'Corte 3 (25%)', percentage: 25, grade: cuts[2]?.grade },
        { id: 'cut-4', name: 'Corte 4 (25%)', percentage: 25, grade: cuts[3]?.grade },
      ]);
    }
  };

  const handleSave = () => {
    soundEngine.playSuccessChime();
    onSave(cuts, targetGrade);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 grid place-items-center text-2xl shrink-0">
              <Calculator className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Simulador de Cortes & Notas Javeriana
              </span>
              <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                {subject.emoji} {subject.name} ({subject.code})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Tarjeta de Resumen Predictivo */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-white/10 grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-2">
              <span className="text-[10px] text-slate-400 font-bold block">Acumulado Actual</span>
              <span className="text-2xl font-mono font-black text-emerald-400">
                {currentAverage}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Evaluado: {Math.round(evaluatedWeight * 100)}%
              </span>
            </div>

            <div className="p-2 border-y sm:border-y-0 sm:border-x border-white/10">
              <span className="text-[10px] text-slate-400 font-bold block">Meta para Aprobar</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <input
                  type="number"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 3.0)}
                  className="w-16 px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-center font-mono font-black text-amber-300 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Escala 0.0 - 5.0</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] text-slate-400 font-bold block">
                Necesitas en lo restante ({Math.round(remainingWeight * 100)}%)
              </span>
              {neededGrade === null ? (
                <span className="text-sm font-bold text-slate-300 block mt-2">
                  ¡Semestre ya calificado al 100%!
                </span>
              ) : neededGrade <= 0 ? (
                <span className="text-xl font-heading font-black text-emerald-400 block mt-1">
                  🎉 ¡Ya pasaste!
                </span>
              ) : neededGrade > 5.0 ? (
                <span className="text-lg font-heading font-black text-rose-400 block mt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> No alcanza ({neededGrade})
                </span>
              ) : (
                <span
                  className={`text-2xl font-mono font-black block ${
                    neededGrade <= 3.5 ? 'text-sky-300' : 'text-amber-400'
                  }`}
                >
                  {neededGrade.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Plantillas de cortes rápidos */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-500">Distribución rápida:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('30_30_40')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold"
              >
                30% - 30% - 40%
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('35_35_30')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold"
              >
                35% - 35% - 30%
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('25_25_25_25')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-[11px] font-bold"
              >
                4 Cortes (25%)
              </button>
            </div>
          </div>

          {/* Lista de Cortes editables */}
          <div className="space-y-2.5">
            {cuts.map((cut, idx) => (
              <div
                key={cut.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-2.5"
              >
                <span className="text-xs font-black text-slate-400 w-6">#{idx + 1}</span>

                <input
                  type="text"
                  value={cut.name}
                  onChange={(e) => handleNameChange(cut.id, e.target.value)}
                  placeholder="Nombre de la evaluación..."
                  className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-bold">%:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={cut.percentage}
                    onChange={(e) => handlePercentageChange(cut.id, e.target.value)}
                    className="w-12 text-center text-xs font-black bg-transparent focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 font-bold">Nota:</span>
                  <input
                    type="number"
                    min="0"
                    max="5.0"
                    step="0.1"
                    placeholder="Pendiente"
                    value={cut.grade !== undefined ? cut.grade : ''}
                    onChange={(e) => handleGradeChange(cut.id, e.target.value)}
                    className="w-16 text-center text-xs font-black bg-transparent focus:outline-none text-emerald-600 dark:text-emerald-400 placeholder:text-slate-400"
                  />
                </div>

                {cuts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCut(cut.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    title="Eliminar corte"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleAddCut}
              className="btn-game px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar corte
            </button>

            <span
              className={`text-xs font-black ${
                totalPercentage === 100
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-500'
              }`}
            >
              Total porcentajes: {totalPercentage}% {totalPercentage !== 100 && '(Ajustar a 100%)'}
            </span>
          </div>
        </div>

        {/* Pie */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/70 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-game px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600"
          >
            Guardar y Calcular Notas
          </button>
        </div>
      </div>
    </div>
  );
};
