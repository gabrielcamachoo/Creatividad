import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useStudyStore } from '@/store/useStudyStore';
import { api } from '@/lib/api';
import { Navbar } from '@/components/common/Navbar';
import { LevelUpModal } from '@/components/common/LevelUpModal';
import { BadgeUnlockedToast } from '@/components/common/BadgeUnlockedToast';
import { CommandPaletteModal } from '@/components/common/CommandPaletteModal';
import { KeyboardShortcutsModal } from '@/components/common/KeyboardShortcutsModal';
import { OnboardingAuthScreen } from '@/features/onboarding/OnboardingAuthScreen';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy-loaded screens & modals for optimal bundle size & instant initial load
const HomeScreen = lazy(() =>
  import('@/features/home/HomeScreen').then((m) => ({ default: m.HomeScreen }))
);
const SubjectDetailScreen = lazy(() =>
  import('@/features/subject/SubjectDetailScreen').then((m) => ({ default: m.SubjectDetailScreen }))
);
const FocusArenaScreen = lazy(() =>
  import('@/features/focus/FocusArenaScreen').then((m) => ({ default: m.FocusArenaScreen }))
);
const ScheduleScreen = lazy(() =>
  import('@/features/schedule/ScheduleScreen').then((m) => ({ default: m.ScheduleScreen }))
);
const PrioritizerScreen = lazy(() =>
  import('@/features/prioritizer/PrioritizerScreen').then((m) => ({ default: m.PrioritizerScreen }))
);
const StudyReportScreen = lazy(() =>
  import('@/features/report/StudyReportScreen').then((m) => ({ default: m.StudyReportScreen }))
);
const RewardsScreen = lazy(() =>
  import('@/features/rewards/RewardsScreen').then((m) => ({ default: m.RewardsScreen }))
);
const ProfileScreen = lazy(() =>
  import('@/features/profile/ProfileScreen').then((m) => ({ default: m.ProfileScreen }))
);
const MethodologyScreen = lazy(() =>
  import('@/features/methodology/MethodologyScreen').then((m) => ({ default: m.MethodologyScreen }))
);
const SettingsScreen = lazy(() =>
  import('@/features/settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen }))
);
const BulkImportModal = lazy(() =>
  import('@/features/subject/BulkImportModal').then((m) => ({ default: m.BulkImportModal }))
);
const MotivationModal = lazy(() =>
  import('@/components/common/MotivationModal').then((m) => ({ default: m.MotivationModal }))
);
const OnboardingTutorialModal = lazy(() =>
  import('@/components/common/OnboardingTutorialModal').then((m) => ({
    default: m.OnboardingTutorialModal,
  }))
);
const GraduationModal = lazy(() =>
  import('@/components/common/GraduationModal').then((m) => ({ default: m.GraduationModal }))
);
const PresentationBar = lazy(() =>
  import('@/components/presentation/PresentationBar').then((m) => ({ default: m.PresentationBar }))
);

const ViewFallback: React.FC = () => (
  <div className="py-24 flex flex-col items-center justify-center gap-3 animate-fade-in">
    <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse [animation-delay:150ms]" />
      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:300ms]" />
    </div>
    <p className="text-xs font-bold text-slate-400">Cargando módulo...</p>
  </div>
);

export const App: React.FC = () => {
  const {
    isAuthenticated,
    activeView,
    isDarkMode,
    isMotivationOpen,
    setIsMotivationOpen,
    isTutorialOpen,
    setIsTutorialOpen,
    isGraduationOpen,
    setIsGraduationOpen,
    isBulkImportOpen,
    setActiveView,
    showPresentationDock,
  } = useSettingsStore();

  const { setSubjectsList, setSchedule, setFriends } = useStudyStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Atajos globales de teclado (Ctrl+K, ?, D, E, H, P, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Si el usuario está escribiendo en un input o textarea, no interceptar teclas normales
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sincronizar datos reales del usuario autenticado al recargar
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('misemaforo_token') : null;
    if (!isAuthenticated || !token) return;

    Promise.all([api.getSubjects(), api.getSchedule(), api.getFriends()])
      .then(([remoteSubjects, remoteSchedule, remoteFriends]) => {
        if (Array.isArray(remoteSubjects)) setSubjectsList(remoteSubjects);
        if (Array.isArray(remoteSchedule)) setSchedule(remoteSchedule);
        if (Array.isArray(remoteFriends)) setFriends(remoteFriends);
      })
      .catch(() => {});
  }, [isAuthenticated, setSubjectsList, setSchedule, setFriends]);

  // Si el usuario no ha iniciado sesión / registrado su cuenta, mostrar el flujo Tutorial -> Autenticación
  if (!isAuthenticated) {
    return <OnboardingAuthScreen />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'subject':
        return <SubjectDetailScreen />;
      case 'focus':
        return <FocusArenaScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'prioritizer':
        return <PrioritizerScreen />;
      case 'report':
        return <StudyReportScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'methodology':
        return <MethodologyScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        <main className="flex-1 pb-24">
          <Suspense fallback={<ViewFallback />}>{renderActiveView()}</Suspense>
        </main>

        <footer className="border-t border-slate-200/80 dark:border-slate-800/60 py-7 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 backdrop-blur print:hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>🚦</span>
              <span>MiSemáforo · Semáforo + Batería de 7 Días + Estudio Activo</span>
            </p>
            <p className="text-slate-400">
              Colegio & Pontificia Universidad Javeriana (47 Pregrados) · Ctrl+K para buscar
            </p>
          </div>
        </footer>

        {/* Modales globales cargados bajo demanda */}
        <LevelUpModal />
        <BadgeUnlockedToast />
        <CommandPaletteModal
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
        <Suspense fallback={null}>
          {isBulkImportOpen && <BulkImportModal />}
          {isMotivationOpen && (
            <MotivationModal isOpen={isMotivationOpen} onClose={() => setIsMotivationOpen(false)} />
          )}
          {isTutorialOpen && (
            <OnboardingTutorialModal
              isOpen={isTutorialOpen}
              onClose={() => setIsTutorialOpen(false)}
            />
          )}
          {isGraduationOpen && (
            <GraduationModal isOpen={isGraduationOpen} onClose={() => setIsGraduationOpen(false)} />
          )}
          {showPresentationDock && <PresentationBar />}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;
