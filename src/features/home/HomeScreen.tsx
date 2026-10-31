import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { BatiAvatar } from '@/components/common/BatiAvatar';
import { Play, Sparkles, LogIn } from 'lucide-react';

const STEPS = [
  { emoji: '🚦', title: 'Clasifica', text: 'Rojo, amarillo o verde.', color: 'from-rose-500/15 to-amber-500/15' },
  { emoji: '🔋', title: 'Repasa', text: 'Recarga antes de 7 días.', color: 'from-amber-500/15 to-emerald-500/15' },
  { emoji: '🏆', title: 'Gana', text: 'XP, voltios y mascotas.', color: 'from-emerald-500/15 to-sky-500/15' },
];

export const HomeScreen: React.FC = () => {
  const { setActiveView, setIsAuthModalOpen } = useSettingsStore();
  const { loadDemoSubjects, resetAllSubjects } = useStudyStore();
  const { loadDemoProfile, resetGamification, equippedBati } = useGamificationStore();
  const { resetTime } = useTimeStore();

  const handleStartDemo = () => {
    loadDemoSubjects();
    loadDemoProfile();
    resetTime();
    setActiveView('dashboard');
  };

  const handleStartClean = () => {
    resetAllSubjects();
    resetGamification();
    resetTime();
    setActiveView('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Colegio · Universidad
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05] text-slate-900 dark:text-white">
            Estudia lo que <span className="shine-text">de verdad</span> importa.
          </h1>
          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto lg:mx-0">
            Tu semáforo te dice qué repasar hoy. Tú solo sube de nivel.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button onClick={handleStartDemo} className="btn-game px-7 py-4 text-base bg-emerald-500 hover:bg-emerald-400 text-white">
              <Play className="w-5 h-5 fill-white" /> Jugar con datos de ejemplo
            </button>
            <button onClick={() => setIsAuthModalOpen(true)} className="btn-game px-7 py-4 text-base bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10">
              <LogIn className="w-5 h-5" /> Crear cuenta
            </button>
          </div>
          <button onClick={handleStartClean} className="mt-4 text-sm font-semibold text-slate-400 hover:text-emerald-500">
            Empezar en blanco →
          </button>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-amber-400/20 to-rose-400/30 blur-3xl rounded-full" />
          <div className="card relative p-6 animate-float">
            <div className="flex items-center gap-3 mb-5">
              <BatiAvatar mood="happy" equipped={equippedBati} size="md" />
              <div>
                <p className="font-display font-bold text-lg">¡Hoy toca!</p>
                <p className="text-xs text-slate-400">3 temas · 15 min</p>
              </div>
              <span className="chip ml-auto bg-sky-500/10 text-sky-500">+45 XP</span>
            </div>
            {[
              { n: 'Identidades trigonométricas', c: 'bg-rose-500', b: 0 },
              { n: 'Ley del coseno', c: 'bg-amber-400', b: 1 },
              { n: 'Razones SohCahToa', c: 'bg-emerald-500', b: 3 },
            ].map((t) => (
              <div key={t.n} className="flex items-center gap-3 py-2.5 border-t border-slate-100 dark:border-white/5">
                <span className={`w-3 h-3 rounded-full ${t.c}`} />
                <span className="text-sm font-semibold flex-1 truncate">{t.n}</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`w-2 h-3.5 rounded-sm ${i < t.b ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 pasos */}
      <div className="mt-16 grid sm:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className={`card p-5 bg-gradient-to-br ${s.color}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <p className="text-[10px] font-black text-slate-400">PASO {i + 1}</p>
                <p className="font-display font-bold text-lg">{s.title}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-400">
        Proyecto Design Thinking ·{' '}
        <button onClick={() => setActiveView('methodology')} className="underline hover:text-emerald-500">cómo nació</button>
      </p>
    </div>
  );
};
