import React from 'react';
import { useSettingsStore, AppView } from '@/store/useSettingsStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useStudyStore } from '@/store/useStudyStore';
import { calculateRank } from '@/lib/rewardEngine';
import { CloudSyncStatusPill } from '@/components/common/CloudSyncStatusPill';
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
  Brain,
  Search,
} from 'lucide-react';

const ANIMAL_EMOJIS: Record<string, string> = {
  owl: '🦉',
  fox: '🦊',
  cat: '🐱',
  dog: '🐶',
  dragon: '🐲',
  axolotl: '🦎',
  robot: '🤖',
  condor: '🦅',
  bear: '🐻',
  capybara: '🦫',
  fenix: '🔥',
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

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
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
    { view: 'focus', label: 'Estudio', icon: Brain },
    { view: 'schedule', label: 'Horario', icon: Calendar },
    { view: 'rewards', label: 'Premios', icon: Gift },
    { view: 'profile', label: 'Perfil', icon: User },
  ];
  const extra: { view: AppView; label: string; icon: React.ElementType }[] = [
    { view: 'report', label: 'Plan', icon: FileText },
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
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0b1020]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/5 pt-safe print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation"
            aria-label="Inicio"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-emerald-400 via-amber-400 to-rose-500 grid place-items-center text-base sm:text-lg shadow-pop-sm">
              🚦
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
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
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200/70 dark:border-white/10 transition-colors"
                title="Buscar materia, tema o acción (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-emerald-500" />
                <span>Buscar</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">
                  Ctrl+K
                </kbd>
              </button>
            )}
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
            <CloudSyncStatusPill />
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
              className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
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
        className="btn-game fixed z-40 right-3.5 bottom-20 lg:bottom-8 w-12 h-12 lg:w-auto lg:px-5 bg-emerald-500 hover:bg-emerald-400 text-white shadow-glow print:hidden touch-manipulation"
        title="Subir Temas"
        aria-label="Subir Temas"
      >
        <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
        <span className="hidden lg:inline">Subir Temas</span>
      </button>

      {/* Tab bar móvil */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0b1020]/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 pt-1.5 pb-safe print:hidden shadow-2xl">
        <div className="grid grid-cols-5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const on = isActive(t.view);
            return (
              <button
                key={t.view}
                onClick={() => setActiveView(t.view)}
                className="flex flex-col items-center gap-0.5 py-1.5 touch-manipulation active:scale-90 transition-transform select-none"
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
