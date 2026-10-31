import React from 'react';
import { useSettingsStore, AppView } from '@/store/useSettingsStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { calculateRank } from '@/lib/rewardEngine';
import {
  Flame,
  Zap,
  Moon,
  Sun,
  Home,
  Calendar,
  FileText,
  Gift,
  User,
  Plus,
  Sparkles,
  HelpCircle,
  Settings,
  Target,
  BookOpen,
  LogOut,
} from 'lucide-react';

const ANIMAL_EMOJIS: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
};

/** Anillo circular de progreso de XP alrededor del avatar */
const XpRing: React.FC<{ percent: number; children: React.ReactNode }> = ({ percent, children }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-11 h-11">
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={r}
          strokeWidth="4"
          className="stroke-slate-200 dark:stroke-slate-700"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="stroke-emerald-500 transition-all duration-700"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, percent)) / 100}
        />
      </svg>
      <div className="absolute inset-[6px] rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
        {children}
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isDarkMode,
    toggleDarkMode,
    setIsBulkImportOpen,
    setIsMotivationOpen,
    setIsTutorialOpen,
    userProfile,
    logoutUser,
  } = useSettingsStore();
  const { xp, volts, streakDays, equippedBati, resetGamification } = useGamificationStore();
  const { resetAllSubjects } = useStudyStore();
  const rank = calculateRank(xp);

  const tabs: { view: AppView; label: string; icon: React.ElementType }[] = [
    { view: 'dashboard', label: 'Tablero', icon: Home },
    { view: 'schedule', label: 'Horario', icon: Calendar },
    { view: 'report', label: 'Plan', icon: FileText },
    { view: 'rewards', label: 'Premios', icon: Gift },
    { view: 'profile', label: 'Perfil', icon: User },
  ];
  const extra: { view: AppView; label: string; icon: React.ElementType }[] = [
    { view: 'prioritizer', label: 'Priorizador', icon: Target },
    { view: 'methodology', label: 'Cómo nació', icon: BookOpen },
  ];

  const pet = ANIMAL_EMOJIS[equippedBati.animal || userProfile.equippedAnimal || 'owl'] || '🦉';
  const isActive = (v: AppView) =>
    activeView === v || (v === 'dashboard' && activeView === 'subject');

  const handleLogout = () => {
    if (confirm('¿Deseas cerrar tu sesión actual?')) {
      resetAllSubjects();
      resetGamification();
      logoutUser();
    }
  };

  return (
    <>
      {/* Barra superior */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0b1020]/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/5 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 shrink-0"
            aria-label="Inicio"
          >
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-amber-400 to-rose-500 grid place-items-center text-lg shadow-pop-sm">
              🚦
            </span>
            <span className="hidden sm:block font-display font-bold text-lg text-slate-900 dark:text-white">
              Mi<span className="text-emerald-500">Semáforo</span>
            </span>
          </button>

          {/* Tabs escritorio */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto p-1 rounded-2xl bg-slate-100/80 dark:bg-white/5">
            {[...tabs, ...extra].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.view}
                  onClick={() => setActiveView(t.view)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive(t.view)
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto lg:ml-0">
            <span
              className="chip bg-orange-500/10 text-orange-600 dark:text-orange-400"
              title={`Racha de ${streakDays} días`}
            >
              <Flame className="w-4 h-4 fill-orange-500" /> {streakDays}
            </span>
            <button
              onClick={() => setActiveView('rewards')}
              className="chip bg-sky-500/10 text-sky-600 dark:text-sky-400"
              title="Voltios"
            >
              <Zap className="w-4 h-4 fill-sky-500" /> {volts}
            </button>
            <button
              onClick={() => setIsMotivationOpen(true)}
              className="hidden sm:grid p-2 rounded-xl text-amber-500 hover:bg-amber-500/10"
              title="Inspiración y motivación diaria"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="hidden sm:grid p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              title="Ver tutorial guiado"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              title="Cambiar tema"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className="hidden sm:grid p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              title="Ajustes"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('profile')}
              title={`${userProfile.name || 'Mi Perfil'} · Nivel ${rank.level} (${rank.rank})`}
            >
              <XpRing percent={rank.progressPercent}>
                {userProfile.photoUrl ? (
                  <img src={userProfile.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  pet
                )}
              </XpRing>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Botón flotante: añadir temas */}
      <button
        onClick={() => setIsBulkImportOpen(true)}
        className="btn-game fixed z-40 right-4 bottom-24 lg:bottom-8 w-14 h-14 lg:w-auto lg:px-5 bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow print:hidden"
        title="Subir Temas"
        aria-label="Subir Temas"
      >
        <Plus className="w-6 h-6" />
        <span className="hidden lg:inline">Subir Temas</span>
      </button>

      {/* Tab bar móvil */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-[#0b1020]/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 pb-[env(safe-area-inset-bottom)] print:hidden">
        <div className="grid grid-cols-5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = isActive(t.view);
            return (
              <button
                key={t.view}
                onClick={() => setActiveView(t.view)}
                className="flex flex-col items-center gap-0.5 py-2.5"
              >
                <span
                  className={`p-1.5 rounded-xl transition-all ${
                    on
                      ? 'bg-emerald-500 text-white scale-110 shadow-pop-sm'
                      : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    on ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
