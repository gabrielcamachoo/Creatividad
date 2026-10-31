import React, { useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { BatiAvatar } from '@/components/common/BatiAvatar';
import { BatteryBar } from '@/components/common/BatteryBar';
import { TrafficLightBadge } from '@/components/common/TrafficLightBadge';
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

export const InteractiveTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isTutorialOpen, setIsTutorialOpen } = useSettingsStore();

  if (!isTutorialOpen) return null;

  const steps = [
    {
      title: '1. Tus Materias son Mundos 🌍',
      subtitle: 'Organiza tu semestre sin perder el hilo',
      desc: 'Cada materia que cursas agrupa sus temas vistos en clase como "niveles". Puedes agregar nuevas asignaturas o editar las actuales en cualquier momento.',
      preview: (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-left">
          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">Física Mecánica (FIS-101)</p>
          <p className="text-xs text-slate-500 mt-1">4 temas registrados • 1 tema en alerta</p>
        </div>
      ),
    },
    {
      title: '2. El Semáforo Honesto 🚦',
      subtitle: 'Autoevaluación rápida basada en evidencias',
      desc: 'Pregúntate: "¿Podría resolver o explicar este concepto sin mirar apuntes?". Marca Verde si dominas el tema, Amarillo si falta práctica, y Rojo si tienes un vacío crítico.',
      preview: (
        <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <TrafficLightBadge status="green" />
          <TrafficLightBadge status="yellow" />
          <TrafficLightBadge status="red" />
        </div>
      ),
    },
    {
      title: '3. La Batería de 7 Días 🔋',
      subtitle: 'La curva del olvido bajo control visual',
      desc: 'Cada 7 días continuos sin repasar, el tema pierde 1 bloque de batería. Si llega a 0 bloques entra "En riesgo". ¡Bati se pondrá triste o cansada si dejas acumular temas fríos!',
      preview: (
        <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <BatteryBar lastReviewedDate="2026-10-10" currentDateStr="2026-10-25" />
          <BatiAvatar mood="tired" size="sm" />
        </div>
      ),
    },
    {
      title: '4. Recompensas & Reto en 60s ⚡',
      subtitle: 'Enganche saludable sin culpas',
      desc: 'Haz el "Repaso rápido de hoy" (< 2 min) o el reto "Explica en 60s" para recargar baterías, ganar XP y Voltios ⚡, abrir tu Cofre Diario 🎁 y proteger tu racha con escudos.',
      preview: (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <span>+20 XP por repaso</span>
          <span>⚡ Voltios para la tienda</span>
          <span>🎁 Cofre diario</span>
        </div>
      ),
    },
  ];

  const active = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTutorialOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Cerrar */}
        <button
          onClick={() => setIsTutorialOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          aria-label="Cerrar tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Stepper Dots */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-emerald-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
          Paso {currentStep + 1} de {steps.length}
        </span>

        <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
          {active.title}
        </h3>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {active.subtitle}
        </p>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {active.desc}
        </p>

        <div className="mt-5">{active.preview}</div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsTutorialOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Saltar tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Paso anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? '¡Empezar a jugar!' : 'Siguiente'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
