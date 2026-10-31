import React, { useState } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { api } from '@/lib/api';
import { Users, UserPlus, Flame, Zap, Check, Mail } from 'lucide-react';

const ANIMAL_EMOJIS: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
};

export const FriendsStudyCard: React.FC = () => {
  const { friends, addFriend, cheerFriend } = useStudyStore();
  const { addVolts } = useGamificationStore();

  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await api.addFriend(emailInput.trim());
      addFriend(emailInput.trim());
      setSuccessMsg(`¡${emailInput.trim()} añadido a tu grupo de estudio!`);
      setEmailInput('');
    } catch {
      addFriend(emailInput.trim());
      setSuccessMsg(`¡Compañero agregado con éxito!`);
      setEmailInput('');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleCheer = async (friendId: string, friendName: string) => {
    cheerFriend(friendId);
    addVolts(5);
    try {
      await api.cheerFriend(friendId);
    } catch {}
    setSuccessMsg(`¡Chocaste esos cinco con ${friendName}! (+5 Voltios ⚡)`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="card p-5 sm:p-6 text-left space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Users className="w-3.5 h-3.5" />
              <span>Red Social de Estudio</span>
            </span>
          </div>
          <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
            Compañeros de Estudio 👥
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Añade a tus amigos por correo para enviarse energía (+5 Voltios) y cuidar sus rachas.
          </p>
        </div>
      </div>

      {/* Input agregar amigo */}
      <form onSubmit={handleAddFriend} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="email"
            placeholder="correo-del-amigo@universidad.edu.co"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-game px-4 py-2.5 text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Añadir</span>
        </button>
      </form>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-scale-up">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Lista de Compañeros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {friends.map((friend) => {
          const petEmoji = ANIMAL_EMOJIS[friend.equippedAnimal || 'owl'] || '🦉';

          return (
            <div
              key={friend.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-heading font-black text-sm flex items-center justify-center shadow-xs">
                    {friend.name.charAt(0)}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 text-xs bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 w-5 h-5 flex items-center justify-center"
                    title={`Mascota: ${friend.equippedAnimal || 'owl'}`}
                  >
                    {petEmoji}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-heading font-black text-xs text-slate-900 dark:text-white truncate">
                    {friend.name}
                  </h4>
                  <div className="flex items-center gap-2 text-2.5xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-0.5 font-bold text-orange-500">
                      <Flame className="w-3 h-3 fill-orange-500" />
                      {friend.streakDays}d
                    </span>
                    <span>•</span>
                    <span>Nivel {friend.level}</span>
                  </div>
                </div>
              </div>

              {/* Botón Choca esos cinco */}
              <button
                type="button"
                onClick={() => handleCheer(friend.id, friend.name)}
                disabled={friend.cheeredToday}
                className={`btn-game px-2.5 py-1.5 rounded-xl text-xs font-heading font-black transition-all shrink-0 flex items-center gap-1 ${
                  friend.cheeredToday
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-default'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
                }`}
                title={friend.cheeredToday ? '¡Ya animado hoy!' : 'Enviar energía (+5 Voltios)'}
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                <span>{friend.cheeredToday ? '✓ Animado' : '¡Ánimo!'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
