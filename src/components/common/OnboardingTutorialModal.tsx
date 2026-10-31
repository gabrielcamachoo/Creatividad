import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Battery, Users, BookOpen } from 'lucide-react';
import { BatiAvatar } from './BatiAvatar';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: '1. El Semáforo de 3 Estados',
      badge: 'Pedagogía Priorizada',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      description: 'Clasifica tus temas con honestidad según tu dominio real:',
      icon: '🚦',
      content: (
        <div className="space-y-2.5 text-xs text-left">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <span className="text-xl">🔴</span>
            <div>
              <strong className="text-rose-600 dark:text-rose-400 font-heading font-black">1° Prioridad: ROJO (Vacíos / No sé nada)</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Riesgo inminente. ¡Atácalos primero con la <strong>Técnica Feynman</strong>!
              </p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <span className="text-xl">🟡</span>
            <div>
              <strong className="text-amber-600 dark:text-amber-400 font-heading font-black">2° Prioridad: AMARILLO (Sabe un poco / Falta práctica)</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Entiendes la teoría pero dudas en ejercicios. Usa <strong>Active Recall</strong>.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <span className="text-xl">🟢</span>
            <div>
              <strong className="text-emerald-600 dark:text-emerald-400 font-heading font-black">3° Prioridad: VERDE (Dominado)</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Sabes resolver y explicar. Solo mantén la batería fresca.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2. Batería de Frescura (7 Días)',
      badge: 'Curva del Olvido',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description: 'Tus conocimientos pierden energía si no los repasas espaciadamente:',
      icon: '🔋',
      content: (
        <div className="space-y-3 text-xs text-left">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-black text-slate-800 dark:text-slate-200">Batería de 3 Bloques:</span>
              <span className="text-emerald-500 font-heading font-black">100% Fresco</span>
            </div>
            <div className="flex gap-1.5 h-3">
              <div className="flex-1 rounded-sm bg-emerald-500" />
              <div className="flex-1 rounded-sm bg-emerald-500" />
              <div className="flex-1 rounded-sm bg-emerald-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5">
              Cada <strong>7 días sin repasar</strong>, el tema pierde 1 bloque. Con 0 bloques entra en <strong className="text-rose-500">Riesgo de Olvido</strong>.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Con un solo clic en <strong>"Repasé hoy"</strong> o completando el reto <strong>"Explica en 60s"</strong>, recargas la batería a 3/3 bloques al instante.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '3. Mascotas y Recompensas',
      badge: 'Gamificación Saludable',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description: 'Estudiar debe ser un hábito motivador y gratificante:',
      icon: '🦊',
      content: (
        <div className="space-y-3 text-xs text-left">
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-2xl transform hover:scale-125 transition-transform">🦉</span>
              <span className="text-2xl transform hover:scale-125 transition-transform">🦊</span>
              <span className="text-2xl transform hover:scale-125 transition-transform">🐱</span>
              <span className="text-2xl transform hover:scale-125 transition-transform">🐶</span>
              <span className="text-2xl transform hover:scale-125 transition-transform">🐲</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Gana <strong>Voltios ⚡</strong> por cada repaso diario y abre cofres con recompensas sorpresa. Podrás <strong>adoptar animalitos de compañía</strong> que te otorgarán bonos de estudio en tu perfil.
          </p>
        </div>
      ),
    },
    {
      title: '4. Amigos y Horario',
      badge: 'Comunidad & Organización',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      description: 'Todo lo que necesitas para tu ciclo escolar o universitario:',
      icon: '📅',
      content: (
        <div className="space-y-2.5 text-xs text-left">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <strong className="text-blue-600 dark:text-blue-400 font-heading font-black">Horario Semanal</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Organiza tus clases de lunes a sábado y asocia tus aulas y horarios.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <span className="text-xl">👥</span>
            <div>
              <strong className="text-emerald-600 dark:text-emerald-400 font-heading font-black">Red de Amigos</strong>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                Añade a tus amigos por correo para enviarse energía (+5 Voltios) y comparar rachas.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[step];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg p-6 sm:p-7 relative text-left animate-scale-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Cerrar tutorial"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Slide */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`chip text-2.5xs font-heading font-black ${currentSlide.badgeColor}`}>
            {currentSlide.badge}
          </span>
          <span className="text-2.5xs font-bold text-slate-400">
            Paso {step + 1} de {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {currentSlide.icon}
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
            {currentSlide.title}
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {currentSlide.description}
        </p>

        {/* Contenido interactivo del slide */}
        <div className="min-h-[170px] mb-5">{currentSlide.content}</div>

        {/* Indicadores de bolitas y botones */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
                aria-label={`Ir al paso ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn-game px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Atrás</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="btn-game px-5 py-2 rounded-xl text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 flex items-center gap-1.5"
            >
              <span>{step === slides.length - 1 ? '¡Comenzar ahora!' : 'Siguiente'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
