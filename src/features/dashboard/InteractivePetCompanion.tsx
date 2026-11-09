import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { soundEngine } from '@/lib/soundEffects';
import { triggerConfetti } from '@/lib/confetti';
import { Sparkles, MessageCircle, RefreshCw, Zap } from 'lucide-react';

const PET_DATA: Record<
  string,
  { name: string; emoji: string; personality: string; phrases: string[] }
> = {
  condor: {
    name: 'Cóndor Andino',
    emoji: '🦅',
    personality: 'Estratega de las alturas',
    phrases: [
      '¡Desde las alturas veo tus parciales! Con 25 minutos de Pomodoro dominamos cualquier tema.',
      'La memoria a largo plazo se construye con repasos espaciados, no trasnochando el día antes.',
      '¡Ojo con los temas en rojo! Dales una pasada de 5 minutos y súbelos a amarillo hoy.',
      '¿Sabías que el Cóndor vuela con calma? Respira hondo y enfócate en una sola tarea.',
    ],
  },
  bear: {
    name: 'Oso de Anteojos',
    emoji: '🐻',
    personality: 'Fuerza tranquila y disciplina',
    phrases: [
      '¡Fuerza de páramo! Cada tema que pasas de rojo a verde te da el doble de voltios.',
      'Si una fórmula parece difícil, aplícale la técnica Feynman: explícala como a un niño.',
      'Un café de termo, concentración profunda y a romper ese corte con toda.',
      'No le temas al error: el semáforo en rojo no es una mala nota, es un mapa de qué estudiar hoy.',
    ],
  },
  capybara: {
    name: 'Chigüiro Filósofo',
    emoji: '🦫',
    personality: 'Paz mental y cero estrés',
    phrases: [
      'Cero estrés, puro semáforo. Si la batería baja de 7 días, un repaso de 10 minutos y listo.',
      'Estudiar con amigos en duelos activa la memoria social. ¡Rétalos en tu perfil!',
      'Un paso a la vez: domina un tema hoy y ya le ganaste al parcial.',
      'Tranquilidad absoluta. La curva del olvido de Ebbinghaus no puede contra nuestra racha.',
    ],
  },
  fenix: {
    name: 'Fénix Dorado',
    emoji: '🔥',
    personality: 'Resiliencia académica total',
    phrases: [
      '¡Si una materia se puso difícil, resurgimos con toda la furia en el segundo corte!',
      'Perder una batalla no es perder el semestre. Con el simulador de notas sabemos cuánto sacar.',
      'Cada repaso de hoy es una victoria asegurada para el examen final.',
      'El conocimiento no se pierde, se refuerza con evocación activa.',
    ],
  },
  owl: {
    name: 'Búho Sabio',
    emoji: '🦉',
    personality: 'Guía pedagógica',
    phrases: [
      'La evocación activa fija un 50% más de retención que simplemente releer diapositivas.',
      'Tu batería de 7 días te protege del olvido natural. ¡Aprovecha el aviso!',
      'Organiza tus entregas con el Priorizador de Eisenhower para no sentirte abrumado.',
      '¡Gran constancia! Estudiar 20 minutos diarios supera 6 horas el domingo por la noche.',
    ],
  },
};

export const InteractivePetCompanion: React.FC = () => {
  const { equippedBati, streakDays, addXP } = useGamificationStore();
  const { subjects } = useStudyStore();

  const petKey = equippedBati.animal || 'owl';
  const pet = PET_DATA[petKey] || PET_DATA.owl;

  // Encontrar el tema más urgente para dar un consejo contextual
  const redTopics = subjects
    .flatMap((s) => s.topics.map((t) => ({ ...t, subjectName: s.name })))
    .filter((t) => t.status === 'red');

  const defaultPhrase =
    redTopics.length > 0
      ? `¡Pilas con "${redTopics[0].name}" de ${redTopics[0].subjectName}! Está en rojo. Dale un repaso de 5 minutos hoy.`
      : pet.phrases[0];

  const [currentPhrase, setCurrentPhrase] = useState(defaultPhrase);
  const [isBouncing, setIsBouncing] = useState(false);
  const [petClicks, setPetClicks] = useState(0);

  const handlePetClick = () => {
    soundEngine.playPop();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    const allOptions = [
      ...pet.phrases,
      ...(redTopics.length > 0
        ? [
            `Te recomiendo revisar "${redTopics[0].name}" en Flashcards 3D.`,
            `¡Solo nos falta reforzar ${redTopics.length} tema${
              redTopics.length > 1 ? 's' : ''
            } en rojo!`,
          ]
        : ['¡Tienes todo tu semáforo impecable! Puedes descansar o avanzar temas futuros.']),
    ];

    const randomPhrase = allOptions[Math.floor(Math.random() * allOptions.length)];
    setCurrentPhrase(randomPhrase);

    setPetClicks((c) => {
      const next = c + 1;
      if (next === 5) {
        soundEngine.playSuccessChime();
        triggerConfetti(1500, 35);
        addXP(15, 'Mascota feliz (+15 XP)');
      }
      return next;
    });
  };

  return (
    <div className="card p-4 sm:p-5 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-indigo-500/10 border-emerald-500/25 relative overflow-hidden text-left">
      <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
        {/* Mascota Interactiva con toque */}
        <button
          type="button"
          onClick={handlePetClick}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-500/30 shadow-pop-sm flex items-center justify-center text-3xl sm:text-4xl shrink-0 transition-transform touch-manipulation hover:scale-105 active:scale-95 ${
            isBouncing ? 'animate-bounce' : ''
          }`}
          title="Toca a tu mascota para pedirle un consejo o mimarla (+XP)"
        >
          <span>{pet.emoji}</span>
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] shadow-xs">
            {petClicks > 0 ? `❤️ ${petClicks}` : '¡Tócame!'}
          </span>
        </button>

        {/* Globo de Diálogo de la Mascota */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{pet.name}</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                · {pet.personality}
              </span>
            </span>
            <span className="text-2.5xs font-mono font-bold text-amber-500 ml-auto hidden sm:inline">
              🔥 Racha {streakDays}d
            </span>
          </div>

          <div
            onClick={handlePetClick}
            className="cursor-pointer p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-xs hover:border-emerald-500/40 transition group"
          >
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug font-medium">
              "{currentPhrase}"
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 text-2.5xs text-slate-400">
            <button
              type="button"
              onClick={handlePetClick}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Cambiar consejo</span>
            </button>
            <span>•</span>
            <span>Toca 5 veces para ganar +15 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
