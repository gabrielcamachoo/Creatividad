import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'subject'
  | 'schedule'
  | 'prioritizer'
  | 'rewards'
  | 'profile'
  | 'methodology'
  | 'report'
  | 'settings';

export type StudentLevel = 'school' | 'university';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  studentLevel: StudentLevel;
  photoUrl: string;
  careerOrGrade: string;
  equippedAnimal: string;
  equippedAccessory: string;
}

interface SettingsState {
  isAuthenticated: boolean;
  hasSeenOnboardingTutorial: boolean;
  activeView: AppView;
  selectedSubjectId: string | null;
  studentLevel: StudentLevel;
  isDarkMode: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  reminderTime: string;
  showPresentationDock: boolean;

  // Modales interactivos
  isTutorialOpen: boolean;
  isBulkImportOpen: boolean;
  isMotivationOpen: boolean;
  isGraduationOpen: boolean;
  isAuthModalOpen: boolean;

  // Perfil del usuario
  userProfile: UserProfile;

  // Acciones
  setIsAuthenticated: (auth: boolean) => void;
  setHasSeenOnboardingTutorial: (seen: boolean) => void;
  setActiveView: (view: AppView, subjectId?: string) => void;
  setStudentLevel: (level: StudentLevel) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  logoutUser: () => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  togglePresentationDock: () => void;
  setIsTutorialOpen: (open: boolean) => void;
  setIsBulkImportOpen: (open: boolean) => void;
  setIsMotivationOpen: (open: boolean) => void;
  setIsGraduationOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
}

const EMPTY_PROFILE: UserProfile = {
  id: '',
  email: '',
  name: '',
  studentLevel: 'school',
  photoUrl: '',
  careerOrGrade: '',
  equippedAnimal: 'owl',
  equippedAccessory: 'none',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      hasSeenOnboardingTutorial: false,
      activeView: 'dashboard',
      selectedSubjectId: null,
      studentLevel: 'school',
      isDarkMode: true,
      soundEnabled: false,
      notificationsEnabled: false,
      reminderTime: '19:00',
      showPresentationDock: false,

      isTutorialOpen: false,
      isBulkImportOpen: false,
      isMotivationOpen: false,
      isGraduationOpen: false,
      isAuthModalOpen: false,

      userProfile: EMPTY_PROFILE,

      setIsAuthenticated: (auth: boolean) => set({ isAuthenticated: auth }),
      setHasSeenOnboardingTutorial: (seen: boolean) => set({ hasSeenOnboardingTutorial: seen }),

      setActiveView: (view: AppView, subjectId?: string) => {
        set({
          activeView: view,
          selectedSubjectId: subjectId !== undefined ? subjectId : null,
        });
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },

      setStudentLevel: (level: StudentLevel) => set({ studentLevel: level }),

      setUserProfile: (profile: Partial<UserProfile>) =>
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

      logoutUser: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('misemaforo_token');
        }
        set({
          isAuthenticated: false,
          activeView: 'dashboard',
          selectedSubjectId: null,
          userProfile: EMPTY_PROFILE,
        });
      },

      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          if (typeof document !== 'undefined') {
            if (newMode) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        });
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      setNotificationsEnabled: (enabled: boolean) =>
        set({ notificationsEnabled: enabled }),

      setReminderTime: (time: string) => set({ reminderTime: time }),

      togglePresentationDock: () =>
        set((state) => ({ showPresentationDock: !state.showPresentationDock })),

      setIsTutorialOpen: (open: boolean) => set({ isTutorialOpen: open }),
      setIsBulkImportOpen: (open: boolean) => set({ isBulkImportOpen: open }),
      setIsMotivationOpen: (open: boolean) => set({ isMotivationOpen: open }),
      setIsGraduationOpen: (open: boolean) => set({ isGraduationOpen: open }),
      setIsAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open }),
    }),
    {
      name: 'semaforo_settings_v2',
    }
  )
);
