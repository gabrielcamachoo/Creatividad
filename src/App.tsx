import React, { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Navbar } from '@/components/common/Navbar';
import { PresentationBar } from '@/components/presentation/PresentationBar';
import { LevelUpModal } from '@/components/common/LevelUpModal';
import { BadgeUnlockedToast } from '@/components/common/BadgeUnlockedToast';
import { MotivationModal } from '@/components/common/MotivationModal';
import { OnboardingTutorialModal } from '@/components/common/OnboardingTutorialModal';
import { GraduationModal } from '@/components/common/GraduationModal';
import { BulkImportModal } from '@/features/subject/BulkImportModal';
import { HomeScreen } from '@/features/home/HomeScreen';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { SubjectDetailScreen } from '@/features/subject/SubjectDetailScreen';
import { ScheduleScreen } from '@/features/schedule/ScheduleScreen';
import { PrioritizerScreen } from '@/features/prioritizer/PrioritizerScreen';
import { RewardsScreen } from '@/features/rewards/RewardsScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { MethodologyScreen } from '@/features/methodology/MethodologyScreen';
import { StudyReportScreen } from '@/features/report/StudyReportScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';

export const App: React.FC = () => {
  const {
    activeView,
    isDarkMode,
    isMotivationOpen,
    setIsMotivationOpen,
    isTutorialOpen,
    setIsTutorialOpen,
    isGraduationOpen,
    setIsGraduationOpen,
  } = useSettingsStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'subject':
        return <SubjectDetailScreen />;
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 pb-24">
        {renderActiveView()}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/50 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            MiSemaforo: Semáforo + Batería de 7 Días (Colegio y Universidad)
          </p>
          <p>
            Design Thinking · Desafío 2: "Del Problema a la Solución Creativa". Prototipo demostrable.
          </p>
        </div>
      </footer>

      {/* Modales globales y Dock de demostración */}
      <LevelUpModal />
      <BadgeUnlockedToast />
      <BulkImportModal />
      <MotivationModal
        isOpen={isMotivationOpen}
        onClose={() => setIsMotivationOpen(false)}
      />
      <OnboardingTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
      <GraduationModal
        isOpen={isGraduationOpen}
        onClose={() => setIsGraduationOpen(false)}
      />
      <PresentationBar />
    </div>
  );
};

export default App;
