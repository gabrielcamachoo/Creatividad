import React, { useState } from 'react';
import { MOTIVATIONAL_QUOTES } from '@/config/curriculum.config';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { BatiAvatar } from './BatiAvatar';
import { X, Sparkles, Flame, ArrowRight, BookOpen, Quote } from 'lucide-react';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MotivationModal: React.FC<MotivationModalProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useSettingsStore();
  const { subjects } = useStudyStore();
  const { streakDays, equippedBati } = useGamificationStore();

  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  );

  if (!isOpen) return null;

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  let redCount = 0;
  subjects.forEach((s) => {
    s.topics.forEach((t) => {
      if (t.status === 'red') redCount++;
    });
  });

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg overflow-hidden relative text-left animate-scale-up shadow-2xl p-0 border-0">
        {/* Cabecera con gradiente motivador */}
        <div className={`p-6 sm:p-7 bg-gradient-to-br ${currentQuote.imageBg} relative overflow-hidden border-b border-slate-200/50 dark:border-slate-800/50`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-amber-600 dark:text-amber-400 font-heading font-black text-2.5xs uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inspiración • {currentQuote.tag}</span>
          </div>

          <div className="flex items-center gap-4">
            <BatiAvatar
              mood="happy"
              equipped={equippedBati}
              photoUrl={userProfile.photoUrl}
              size="lg"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                ¡Hola, {userProfile.name.split(' ')[0]}! 🚀
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  Racha de {streakDays}d
                </span>
                <span>•</span>
                <span>{userProfile.careerOrGrade || 'Estudiante'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Frase */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 relative">
            <Quote className="w-7 h-7 text-slate-300 dark:text-slate-600 absolute top-3 right-4 opacity-30" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 italic leading-relaxed pr-6">
              "{currentQuote.text}"
            </p>
            <div className="mt-2.5 flex items-center justify-between text-2.5xs">
              <span className="font-heading font-black text-emerald-600 dark:text-emerald-400">
                — {currentQuote.author}
              </span>
              <button
                type="button"
                onClick={nextQuote}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline font-bold"
              >
                Otra frase ↻
              </button>
            </div>
          </div>

          {/* Foco del día */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h3 className="font-heading font-black text-slate-900 dark:text-white">
                Misión de Hoy:
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                {redCount > 0 ? (
                  <>
                    Tienes <strong className="text-rose-500 font-black">{redCount} tema(s) en ROJO</strong>. Atácalos primero con la Técnica Feynman (explicación simple).
                  </>
                ) : (
                  <>
                    ¡Sin vacíos rojos! Tu misión hoy es resolver ejercicios de temas amarillos y cuidar tus baterías.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Botón de acción */}
          <button
            onClick={onClose}
            className="btn-game w-full py-3 px-6 rounded-2xl font-heading font-black text-xs text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <span>¡Vamos a estudiar!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
