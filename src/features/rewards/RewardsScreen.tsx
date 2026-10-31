import React, { useState } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useTimeStore } from '@/store/useTimeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ShopTab } from './ShopTab';
import { BadgesGrid } from './BadgesGrid';
import { SimulatedLeaderboard } from './SimulatedLeaderboard';
import { ChestOpeningModal } from '@/components/common/ChestOpeningModal';
import {
  Gift,
  Award,
  ShoppingBag,
  Trophy,
  CheckCircle,
  Sparkles,
  Zap,
  Clock,
  Check,
  Flame,
} from 'lucide-react';

export const RewardsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'missions' | 'badges' | 'shop' | 'leaderboard'>('missions');

  const {
    volts,
    dailyMissions,
    weeklyMissions,
    lastChestOpenDate,
    openDailyChest,
    claimMission,
  } = useGamificationStore();
  const { getSimulatedDateStr } = useTimeStore();
  const currentDateStr = getSimulatedDateStr();

  const isChestAlreadyClaimedToday = lastChestOpenDate === currentDateStr;

  const handleOpenChest = () => {
    openDailyChest(currentDateStr);
  };

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="chip bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Gift className="w-3.5 h-3.5" />
              <span>Recompensas & Logros</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
            Premios & Mascotas 🏆
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gana Voltios ⚡ por cada repaso y desbloquea animalitos de compañía para tu perfil.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-heading font-black text-sm shrink-0 self-start sm:self-auto shadow-xs">
          <Zap className="w-4 h-4 fill-blue-500" />
          <span>{volts} Voltios ⚡</span>
        </div>
      </div>

      {/* Selector de Pestañas (Bento Tabs) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('missions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'missions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Cofre & Misiones</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'badges'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-purple-500" />
          <span>Insignias (12)</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'shop'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          <span>Tienda de Mascotas</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-black'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Ranking</span>
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      {activeTab === 'missions' && (
        <div className="space-y-6 animate-fade-in">
          {/* Banner Cofre Diario */}
          <div className="card p-6 sm:p-7 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-4xl shadow-inner shrink-0 transform hover:scale-105 transition-transform">
                🎁
              </div>
              <div>
                <span className="text-2.5xs uppercase font-black tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full inline-block">
                  Recompensa Diaria
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white mt-1">
                  Cofre de Frescura
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mt-1">
                  Ábrelo tras repasar para ganar Voltios ⚡, XP y accesorios para tu mascota.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenChest}
              disabled={isChestAlreadyClaimedToday}
              className={`btn-game px-6 py-3.5 rounded-2xl font-heading font-black text-sm transition-all flex items-center gap-2 shrink-0 ${
                isChestAlreadyClaimedToday
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-75'
                  : 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isChestAlreadyClaimedToday ? '✓ Ya abierto hoy' : 'Abrir Cofre 🎁'}</span>
            </button>
          </div>

          {/* Misiones Diarias */}
          <div className="space-y-3">
            <h2 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Misiones de Hoy</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dailyMissions.map((m) => (
                <div
                  key={m.id}
                  className={`card p-4 flex flex-col justify-between transition-all ${
                    m.completed && !m.claimed
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : m.claimed
                      ? 'opacity-60 bg-slate-50 dark:bg-slate-800/40'
                      : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {m.current}/{m.target}
                      </span>
                      <span className="chip bg-blue-500/10 text-blue-600 dark:text-blue-400 text-2.5xs">
                        +{m.rewardVolts} ⚡
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                      {m.title}
                    </h3>
                    <p className="text-2.5xs text-slate-500 dark:text-slate-400 mb-3 leading-snug">
                      {m.description}
                    </p>

                    {/* Barra de progreso */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    {m.claimed ? (
                      <div className="text-center py-1.5 text-2.5xs font-bold text-slate-400 flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Reclamada</span>
                      </div>
                    ) : m.completed ? (
                      <button
                        onClick={() => claimMission(m.id)}
                        className="btn-game w-full py-2 rounded-xl text-xs font-heading font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                      >
                        ¡Reclamar Recompensa! ⚡
                      </button>
                    ) : (
                      <div className="text-center py-1.5 text-2.5xs font-bold text-slate-400">
                        En progreso...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misiones Semanales */}
          <div className="space-y-3 pt-2">
            <h2 className="font-heading font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Desafíos de la Semana</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weeklyMissions.map((m) => (
                <div
                  key={m.id}
                  className={`card p-4 flex flex-col justify-between transition-all ${
                    m.completed && !m.claimed
                      ? 'border-purple-500/50 bg-purple-500/5'
                      : m.claimed
                      ? 'opacity-60 bg-slate-50 dark:bg-slate-800/40'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                        {m.title}
                      </h3>
                      <p className="text-2.5xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {m.description}
                      </p>
                    </div>
                    <span className="chip bg-purple-500/10 text-purple-600 dark:text-purple-400 text-2.5xs shrink-0">
                      +{m.rewardVolts} ⚡
                    </span>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between text-2.5xs font-bold text-slate-400">
                      <span>Progreso semanal</span>
                      <span>{m.current}/{m.target}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                      />
                    </div>

                    {m.claimed ? (
                      <div className="text-center py-1 text-2.5xs font-bold text-slate-400 flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completada</span>
                      </div>
                    ) : m.completed ? (
                      <button
                        onClick={() => claimMission(m.id)}
                        className="btn-game w-full py-1.5 rounded-xl text-xs font-heading font-black text-white bg-purple-600 hover:bg-purple-700 shadow-purple-500/30"
                      >
                        Reclamar bono ⚡
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña Tienda */}
      {activeTab === 'shop' && <ShopTab />}

      {/* Pestaña Insignias */}
      {activeTab === 'badges' && <BadgesGrid />}

      {/* Pestaña Ranking */}
      {activeTab === 'leaderboard' && <SimulatedLeaderboard />}

      {/* Modal Apertura de Cofre */}
      <ChestOpeningModal />
    </div>
  );
};
