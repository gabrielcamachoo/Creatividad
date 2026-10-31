import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, MasteryLevel, Topic, ScheduleItem, Friend } from '@/types';
import { DEMO_SUBJECTS } from '@/data/demoData';
import { SubjectTemplate, CareerOption } from '@/config/curriculum.config';

function generateUniqueId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    subjectName: 'Cálculo Diferencial',
    subjectEmoji: '📐',
    dayOfWeek: 'Lunes',
    startTime: '08:00',
    endTime: '10:00',
    room: 'Edificio B - Salón 302',
  },
  {
    id: 'sch-2',
    subjectName: 'Física Mecánica',
    subjectEmoji: '⚡',
    dayOfWeek: 'Miércoles',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Laboratorio de Ciencias 1',
  },
  {
    id: 'sch-3',
    subjectName: 'Química Orgánica',
    subjectEmoji: '🔬',
    dayOfWeek: 'Jueves',
    startTime: '14:00',
    endTime: '16:00',
    room: 'Aula Virtual Teams',
  },
];

const DEFAULT_FRIENDS: Friend[] = [
  {
    id: 'fr-1',
    name: 'Santiago Echeverry',
    email: 'santiago@misemaforo.edu.co',
    streakDays: 8,
    level: 3,
    xp: 680,
    equippedAnimal: 'owl',
    cheeredToday: false,
  },
  {
    id: 'fr-2',
    name: 'Gabriel Camacho',
    email: 'gabriel@misemaforo.edu.co',
    streakDays: 6,
    level: 3,
    xp: 590,
    equippedAnimal: 'fox',
    cheeredToday: false,
  },
  {
    id: 'fr-3',
    name: 'Alejandro Jimenez',
    email: 'alejandro@misemaforo.edu.co',
    streakDays: 12,
    level: 4,
    xp: 1120,
    equippedAnimal: 'dragon',
    cheeredToday: false,
  },
  {
    id: 'fr-4',
    name: 'Sebastian Galvis',
    email: 'sebastian@misemaforo.edu.co',
    streakDays: 7,
    level: 3,
    xp: 620,
    equippedAnimal: 'dog',
    cheeredToday: false,
  },
];

interface StudyState {
  subjects: Subject[];
  schedule: ScheduleItem[];
  friends: Friend[];

  // Materias
  addSubject: (
    name: string,
    code: string,
    colorTheme?: string,
    emoji?: string,
    summary?: string,
    examDate?: string
  ) => string;
  updateSubject: (
    subjectId: string,
    updates: Partial<Omit<Subject, 'id' | 'topics'>>
  ) => void;
  deleteSubject: (subjectId: string) => void;

  // Temas
  addTopic: (
    subjectId: string,
    name: string,
    classDate?: string,
    status?: MasteryLevel,
    lastReviewedDate?: string,
    summary?: string,
    summaryPhoto?: string
  ) => Topic;
  updateTopic: (
    subjectId: string,
    topicId: string,
    updates: Partial<Omit<Topic, 'id' | 'subjectId'>>
  ) => void;
  updateTopicStatus: (
    subjectId: string,
    topicId: string,
    status: MasteryLevel
  ) => { oldStatus: MasteryLevel; newStatus: MasteryLevel } | null;
  updateTopicSummary: (
    subjectId: string,
    topicId: string,
    summary: string,
    summaryPhoto?: string
  ) => void;
  updateTopicDates: (
    subjectId: string,
    topicId: string,
    classDate?: string,
    lastReviewedDate?: string
  ) => void;
  reviewTopicToday: (subjectId: string, topicId: string, currentDateStr: string) => Topic | null;
  deleteTopic: (subjectId: string, topicId: string) => void;
  setSubjectExamDate: (subjectId: string, examDateStr?: string) => void;

  // Horario
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => ScheduleItem;
  deleteScheduleItem: (id: string) => void;
  setSchedule: (schedule: ScheduleItem[]) => void;

  // Amigos
  addFriend: (email: string, name?: string) => Friend;
  cheerFriend: (id: string) => void;
  setFriends: (friends: Friend[]) => void;

  // Plantillas curriculares y transición
  loadCurriculumTemplate: (templates: SubjectTemplate[]) => void;
  upgradeToUniversity: (career: CareerOption) => void;

  // Carga y reseteo
  loadDemoSubjects: () => void;
  setSubjectsList: (subjects: Subject[]) => void;
  resetAllSubjects: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      subjects: DEMO_SUBJECTS,
      schedule: DEFAULT_SCHEDULE,
      friends: DEFAULT_FRIENDS,

      addSubject: (
        name: string,
        code: string,
        colorTheme: string = 'blue',
        emoji: string = '📚',
        summary: string = '',
        examDate?: string
      ) => {
        const id = generateUniqueId('sub');
        const newSubject: Subject = {
          id,
          name: name.trim(),
          code: (code || name.trim().substring(0, 3)).toUpperCase(),
          colorTheme,
          emoji,
          summary,
          summaryPhoto: '',
          icon: 'BookOpen',
          topics: [],
          examDate,
        };
        set((state) => ({ subjects: [...state.subjects, newSubject] }));
        return id;
      },

      updateSubject: (subjectId: string, updates: Partial<Omit<Subject, 'id' | 'topics'>>) => {
        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === subjectId ? { ...sub, ...updates } : sub
          ),
        }));
      },

      deleteSubject: (subjectId: string) => {
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== subjectId),
        }));
      },

      addTopic: (
        subjectId: string,
        name: string,
        classDate?: string,
        status: MasteryLevel = 'yellow',
        lastReviewedDate?: string,
        summary: string = '',
        summaryPhoto: string = ''
      ) => {
        const topicId = generateUniqueId('top');
        const cDate = classDate || new Date().toISOString().split('T')[0];
        const rDate = lastReviewedDate || cDate;

        const newTopic: Topic = {
          id: topicId,
          subjectId,
          name: name.trim(),
          classDate: cDate,
          lastReviewedDate: rDate,
          status,
          timesReviewed: status === 'green' ? 1 : 0,
          summary,
          summaryPhoto,
        };

        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === subjectId ? { ...sub, topics: [...sub.topics, newTopic] } : sub
          ),
        }));

        return newTopic;
      },

      updateTopic: (
        subjectId: string,
        topicId: string,
        updates: Partial<Omit<Topic, 'id' | 'subjectId'>>
      ) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
            };
          }),
        }));
      },

      updateTopicStatus: (subjectId: string, topicId: string, status: MasteryLevel) => {
        let oldStatus: MasteryLevel = 'yellow';
        let found = false;

        const currentSubjects = get().subjects;
        for (const s of currentSubjects) {
          if (s.id === subjectId) {
            const t = s.topics.find((item) => item.id === topicId);
            if (t) {
              oldStatus = t.status;
              found = true;
              break;
            }
          }
        }

        if (!found) return null;

        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === subjectId
              ? {
                  ...sub,
                  topics: sub.topics.map((t) => (t.id === topicId ? { ...t, status } : t)),
                }
              : sub
          ),
        }));

        return { oldStatus, newStatus: status };
      },

      updateTopicSummary: (
        subjectId: string,
        topicId: string,
        summary: string,
        summaryPhoto?: string
      ) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) =>
                t.id === topicId
                  ? {
                      ...t,
                      summary,
                      summaryPhoto: summaryPhoto !== undefined ? summaryPhoto : t.summaryPhoto,
                    }
                  : t
              ),
            };
          }),
        }));
      },

      updateTopicDates: (
        subjectId: string,
        topicId: string,
        classDate?: string,
        lastReviewedDate?: string
      ) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) => {
                if (t.id !== topicId) return t;
                return {
                  ...t,
                  classDate: classDate || t.classDate,
                  lastReviewedDate: lastReviewedDate || t.lastReviewedDate,
                };
              }),
            };
          }),
        }));
      },

      reviewTopicToday: (subjectId: string, topicId: string, currentDateStr: string) => {
        let reviewedTopic: Topic | null = null;

        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            return {
              ...sub,
              topics: sub.topics.map((t) => {
                if (t.id !== topicId) return t;
                reviewedTopic = {
                  ...t,
                  lastReviewedDate: currentDateStr,
                  timesReviewed: t.timesReviewed + 1,
                };
                return reviewedTopic;
              }),
            };
          }),
        }));

        return reviewedTopic;
      },

      deleteTopic: (subjectId: string, topicId: string) => {
        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === subjectId
              ? { ...sub, topics: sub.topics.filter((t) => t.id !== topicId) }
              : sub
          ),
        }));
      },

      setSubjectExamDate: (subjectId: string, examDateStr?: string) => {
        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === subjectId ? { ...sub, examDate: examDateStr } : sub
          ),
        }));
      },

      // Horario
      addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => {
        const id = generateUniqueId('sch');
        const newItem: ScheduleItem = { id, ...item };
        set((state) => ({ schedule: [...state.schedule, newItem] }));
        return newItem;
      },

      deleteScheduleItem: (id: string) => {
        set((state) => ({ schedule: state.schedule.filter((i) => i.id !== id) }));
      },

      setSchedule: (schedule: ScheduleItem[]) => set({ schedule }),

      // Amigos
      addFriend: (email: string, name?: string) => {
        const id = generateUniqueId('fr');
        const newFriend: Friend = {
          id,
          name: name || email.split('@')[0],
          email: email.toLowerCase().trim(),
          streakDays: 1,
          level: 1,
          xp: 100,
          equippedAnimal: 'owl',
          cheeredToday: false,
        };
        set((state) => ({ friends: [newFriend, ...state.friends] }));
        return newFriend;
      },

      cheerFriend: (id: string) => {
        set((state) => ({
          friends: state.friends.map((f) => (f.id === id ? { ...f, cheeredToday: true } : f)),
        }));
      },

      setFriends: (friends: Friend[]) => set({ friends }),

      // Carga masiva de plantilla (Colegio o Carrera de Universidad)
      loadCurriculumTemplate: (templates: SubjectTemplate[]) => {
        const newSubjects: Subject[] = templates.map((tmpl) => {
          const subId = generateUniqueId('sub');
          const today = new Date().toISOString().split('T')[0];
          return {
            id: subId,
            name: tmpl.name,
            code: tmpl.code,
            colorTheme: tmpl.colorTheme,
            emoji: tmpl.emoji,
            summary: tmpl.summary || '',
            summaryPhoto: '',
            icon: 'BookOpen',
            topics: tmpl.topics.map((t) => ({
              id: generateUniqueId('top'),
              subjectId: subId,
              name: t.name,
              classDate: today,
              lastReviewedDate: today,
              status: t.status,
              timesReviewed: t.status === 'green' ? 2 : 0,
              summary: t.summary || '',
              summaryPhoto: '',
            })),
          };
        });

        set({ subjects: newSubjects });
      },

      upgradeToUniversity: (career: CareerOption) => {
        const newSubjects: Subject[] = career.subjects.map((tmpl) => {
          const subId = generateUniqueId('sub');
          const today = new Date().toISOString().split('T')[0];
          return {
            id: subId,
            name: tmpl.name,
            code: tmpl.code,
            colorTheme: tmpl.colorTheme,
            emoji: tmpl.emoji,
            summary: tmpl.summary || '',
            summaryPhoto: '',
            icon: 'BookOpen',
            topics: tmpl.topics.map((t) => ({
              id: generateUniqueId('top'),
              subjectId: subId,
              name: t.name,
              classDate: today,
              lastReviewedDate: today,
              status: t.status,
              timesReviewed: t.status === 'green' ? 2 : 0,
              summary: t.summary || '',
              summaryPhoto: '',
            })),
          };
        });

        set({ subjects: newSubjects });
      },

      loadDemoSubjects: () => set({ subjects: DEMO_SUBJECTS }),
      setSubjectsList: (subjects: Subject[]) => set({ subjects }),
      resetAllSubjects: () => set({ subjects: [] }),
    }),
    {
      name: 'misemaforo_study_storage',
    }
  )
);
