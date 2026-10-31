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
  setActiveView: (view: AppView, subjectId?: string) => void;
  setStudentLevel: (level: StudentLevel) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      activeView: 'home',
      selectedSubjectId: null,
      studentLevel: 'school',
      isDarkMode: true,
      soundEnabled: false,
      notificationsEnabled: false,
      reminderTime: '19:00',
      showPresentationDock: true,

      isTutorialOpen: false,
      isBulkImportOpen: false,
      isMotivationOpen: false,
      isGraduationOpen: false,
      isAuthModalOpen: false,

      userProfile: {
        id: 'usr-demo',
        email: 'estudiante@misemaforo.edu.co',
        name: 'Estudiante Demo',
        studentLevel: 'school',
        photoUrl: '',
        careerOrGrade: 'Bachillerato (11° Grado)',
        equippedAnimal: 'owl',
        equippedAccessory: 'none',
      },

      setActiveView: (view: AppView, subjectId?: string) => {
        set({
          activeView: view,
          selectedSubjectId: subjectId !== undefined ? subjectId : null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      setStudentLevel: (level: StudentLevel) => set({ studentLevel: level }),

      setUserProfile: (profile: Partial<UserProfile>) =>
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

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
      name: 'semaforo_settings_storage',
    }
  )
);
