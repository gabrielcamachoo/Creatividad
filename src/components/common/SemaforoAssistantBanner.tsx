import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

export const SemaforoAssistantBanner: React.FC = () => {
  const { setActiveView } = useSettingsStore();

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
          Asistente Pedagógico MiSemaforo
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-black text-white">
        ¿Cómo estudiar con tu Semáforo? Prioridad en 3 Pasos
      </h3>

      <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
        El error número uno de los estudiantes es releer pasivamente lo que ya saben. Nuestro algoritmo te ayuda a optimizar tu tiempo con esta regla de oro:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Paso 1: ROJO */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-rose-400">
              <XCircle className="w-4 h-4 shrink-0" />
              <span className="font-black text-xs uppercase tracking-wider">
                1° Ataca los Rojos (Vacíos)
              </span>
            </div>
            <p className="text-xs text-rose-100/90 font-medium leading-snug">
              Temas que <strong>no sabes o no entiendes nada</strong>. Aquí está el peligro de reprobar. Dedica el 60% de tu tiempo a entender la teoría con la Técnica Feynman.
            </p>
          </div>
          <span className="text-[10px] text-rose-300 font-mono mt-2 block">
            Urgencia Máxima
          </span>
        </div>

        {/* Paso 2: AMARILLO */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-black text-xs uppercase tracking-wider">
                2° Ejercita los Amarillos
              </span>
            </div>
            <p className="text-xs text-amber-100/90 font-medium leading-snug">
              Temas que <strong>sabes un poco pero te falta práctica</strong>. Resuelve de 3 a 5 problemas tipo examen sin mirar fórmulas (Active Recall) para pasarlos a verde.
            </p>
          </div>
          <span className="text-[10px] text-amber-300 font-mono mt-2 block">
            Consolidación Práctica
          </span>
        </div>

        {/* Paso 3: VERDE */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-black text-xs uppercase tracking-wider">
                3° Repaso Ágil de Verdes
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium leading-snug">
              Temas <strong>dominados</strong>. No gastes horas releyéndolos; haz una auto-pregunta de 5 min para recargar la batería de 7 días antes del examen.
            </p>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono mt-2 block">
            Mantenimiento de Frescura
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-400">
          ¿Quieres ver tu plan de ataque personalizado en PDF?
        </span>

        <button
          onClick={() => setActiveView('report')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors self-start sm:self-auto"
        >
          <span>Abrir Reporte de Priorización</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
