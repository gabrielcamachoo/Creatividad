import React from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateRank } from '@/lib/rewardEngine';
import { Flame, UserPlus } from 'lucide-react';

const ANIMAL_EMOJIS: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
};

export const SimulatedLeaderboard: React.FC = () => {
  const { xp, streakDays, equippedBati } = useGamificationStore();
  const { friends } = useStudyStore();
  const { userProfile, setActiveView } = useSettingsStore();

  const myRank = calculateRank(xp);
  const myPet = ANIMAL_EMOJIS[equippedBati.animal || userProfile.equippedAnimal || 'owl'] || '🦉';

  // Construir ranking real con el usuario actual + los compañeros que haya agregado
  const entries = [
    {
      id: userProfile.id || 'me',
      name: userProfile.name || 'Tú',
      avatar: myPet,
      level: myRank.level,
      streakDays,
      xp,
      isUser: true,
    },
    ...friends.map((f) => ({
      id: f.id,
      name: f.name,
      avatar: ANIMAL_EMOJIS[f.equippedAnimal || 'owl'] || '🦉',
      level: f.level || 1,
      streakDays: f.streakDays || 0,
      xp: f.xp || 0,
      isUser: false,
    })),
  ].sort((a, b) => b.xp - a.xp || b.streakDays - a.streakDays);

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="card p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shrink-0">
            🥇
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Liga de Compañeros de Estudio
              </h3>
              <span className="chip bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-2.5xs">
                En vivo
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compite sanamente con los amigos que agregues por correo en tu Perfil.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('profile')}
          className="btn-game px-4 py-2 rounded-2xl text-xs font-heading font-black bg-emerald-500 text-white shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Invitar / Añadir Amigos
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Estudiante</span>
          <div className="flex items-center gap-6 sm:gap-12">
            <span>Racha</span>
            <span>XP Total</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((peer, idx) => (
            <div
              key={peer.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                peer.isUser
                  ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                    idx === 0
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-800'
                      : idx === 2
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </span>

                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                  {peer.avatar}
                </div>

                <div>
                  <p className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    {peer.name}
                    {peer.isUser && (
                      <span className="text-2.5xs font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        Tú
                      </span>
                    )}
                  </p>
                  <p className="text-2.5xs text-slate-500 font-medium">Nivel {peer.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-12 text-xs shrink-0">
                <div className="flex items-center gap-1 font-bold text-orange-500">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>{peer.streakDays}d</span>
                </div>

                <span className="font-mono font-black text-slate-900 dark:text-white min-w-[60px] text-right">
                  {peer.xp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
