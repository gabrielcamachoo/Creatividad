import React from 'react';
import { BatiMood, BatiEquipped } from '@/types';

interface BatiAvatarProps {
  mood: BatiMood;
  equipped?: BatiEquipped;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  photoUrl?: string;
  showAnimal?: boolean;
  className?: string;
}

const ANIMAL_EMOJI_MAP: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
};

export const BatiAvatar: React.FC<BatiAvatarProps> = ({
  mood,
  equipped = {},
  size = 'md',
  photoUrl,
  showAnimal = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const animalBadgeSize = {
    sm: 'text-xs -bottom-1 -right-1 w-4 h-4',
    md: 'text-sm -bottom-1 -right-1 w-6 h-6',
    lg: 'text-lg -bottom-1.5 -right-1.5 w-8 h-8',
    xl: 'text-2xl -bottom-2 -right-2 w-10 h-10',
  }[size];

  const companionEmoji = equipped.animal ? ANIMAL_EMOJI_MAP[equipped.animal] || '🦉' : '🦉';

  // Si tiene foto personalizada de perfil, la mostramos en un marco circular elegante con su mascota
  if (photoUrl) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
        <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-100 dark:bg-slate-800">
          <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        {showAnimal && (
          <div
            className={`absolute ${animalBadgeSize} rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center select-none animate-bounce-slow`}
            title={`Compañero animal: ${equipped.animal || 'owl'}`}
          >
            {companionEmoji}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {/* Aura si está equipada */}
      {equipped.aura === 'aura_electric' && (
        <div className="absolute inset-0 rounded-2xl bg-blue-500/25 blur-md animate-pulse" />
      )}
      {equipped.aura === 'aura_fire' && (
        <div className="absolute inset-0 rounded-2xl bg-orange-500/30 blur-md animate-pulse" />
      )}

      {/* Mascota animalito de compañía */}
      {showAnimal && (
        <div
          className={`absolute ${animalBadgeSize} rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center select-none z-10 animate-bounce-slow`}
          title={`Mascota de estudio: ${companionEmoji}`}
        >
          {companionEmoji}
        </div>
      )}

      {/* Cuerpo principal de Bati (Batería SVG) */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id={`batiGrad-${mood}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {mood === 'happy' && (
              <>
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </>
            )}
            {mood === 'neutral' && (
              <>
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </>
            )}
            {mood === 'tired' && (
              <>
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#e11d48" />
              </>
            )}
            {mood === 'sleeping' && (
              <>
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Terminal superior de la batería */}
        <rect x="42" y="6" width="16" height="8" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

        {/* Cuerpo de la batería con esquinas redondeadas */}
        <rect
          x="20"
          y="14"
          width="60"
          height="80"
          rx="14"
          fill={`url(#batiGrad-${mood})`}
          stroke="#1e293b"
          strokeWidth="3.5"
        />

        {/* Brillo de vidrio */}
        <path
          d="M 26 22 L 32 22 L 32 86 L 26 86 Z"
          fill="#ffffff"
          opacity="0.25"
          rx="3"
        />

        {/* Símbolo de rayo en el pecho */}
        <path
          d="M 52 48 L 44 60 L 50 60 L 46 72 L 56 58 L 50 58 Z"
          fill="#ffffff"
          opacity={mood === 'sleeping' ? 0.3 : 0.85}
        />

        {/* Ojos según emoción */}
        {mood === 'happy' && (
          <g>
            <circle cx="38" cy="36" r="5" fill="#0f172a" />
            <circle cx="39.5" cy="34.5" r="2" fill="#ffffff" />
            <circle cx="62" cy="36" r="5" fill="#0f172a" />
            <circle cx="63.5" cy="34.5" r="2" fill="#ffffff" />
            <path d="M 42 45 Q 50 52 58 45" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="31" cy="44" r="3" fill="#f43f5e" opacity="0.4" />
            <circle cx="69" cy="44" r="3" fill="#f43f5e" opacity="0.4" />
          </g>
        )}

        {mood === 'neutral' && (
          <g>
            <circle cx="38" cy="36" r="4.5" fill="#0f172a" />
            <circle cx="62" cy="36" r="4.5" fill="#0f172a" />
            <line x1="44" y1="46" x2="56" y2="46" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {mood === 'tired' && (
          <g>
            <path d="M 33 36 Q 38 33 43 36" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 57 36 Q 62 33 67 36" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 44 48 Q 50 44 56 48" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 69 26 Q 72 32 69 35 Q 66 32 69 26" fill="#38bdf8" />
          </g>
        )}

        {mood === 'sleeping' && (
          <g>
            <path d="M 34 38 Q 38 42 42 38" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 58 38 Q 62 42 66 38" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="48" r="3" fill="#334155" />
            <text x="68" y="24" fontSize="12" fill="#64748b" fontWeight="bold">Z</text>
            <text x="76" y="16" fontSize="9" fill="#94a3b8" fontWeight="bold">z</text>
          </g>
        )}

        {/* Accesorios para la cabeza */}
        {equipped.hat === 'hat_grad_cap' && (
          <g transform="translate(18, -4)">
            <polygon points="32,4 64,14 32,24 0,14" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" />
            <rect x="20" y="18" width="24" height="6" fill="#1e1b4b" />
            <line x1="56" y1="17" x2="60" y2="28" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="60" cy="28" r="2" fill="#fbbf24" />
          </g>
        )}

        {equipped.hat === 'hat_sunglasses' && (
          <g transform="translate(24, 28)">
            <rect x="2" y="2" width="22" height="12" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
            <rect x="28" y="2" width="22" height="12" rx="4" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
            <line x1="24" y1="6" x2="28" y2="6" stroke="#09090b" strokeWidth="2.5" />
            <line x1="6" y1="5" x2="18" y2="5" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          </g>
        )}

        {equipped.hat === 'hat_headband' && (
          <g transform="translate(19, 18)">
            <rect x="0" y="0" width="62" height="8" rx="2" fill="#dc2626" />
            <circle cx="31" cy="4" r="3" fill="#ffffff" />
          </g>
        )}

        {equipped.hat === 'hat_crown' && (
          <g transform="translate(24, -2)">
            <polygon points="4,18 10,4 26,12 42,4 48,18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="10" cy="4" r="2.5" fill="#f43f5e" />
            <circle cx="26" cy="12" r="2.5" fill="#3b82f6" />
            <circle cx="42" cy="4" r="2.5" fill="#10b981" />
          </g>
        )}

        {equipped.hat === 'hat_headphones' && (
          <g transform="translate(14, 20)">
            <path d="M 6 22 A 28 28 0 0 1 66 22" stroke="#64748b" strokeWidth="4" fill="none" />
            <rect x="0" y="14" width="10" height="20" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
            <rect x="62" y="14" width="10" height="20" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
