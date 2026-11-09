import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Subject,
  MasteryLevel,
  Topic,
  ScheduleItem,
  Friend,
  SubjectAcademicStatus,
  GradeCut,
} from '@/types';
import { DEMO_SUBJECTS } from '@/data/demoData';
import { SubjectTemplate, CareerOption } from '@/config/curriculum.config';

function generateUniqueId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

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
    examDate?: string,
    customId?: string,
    meta?: {
      academicStatus?: SubjectAcademicStatus;
      semester?: number;
      credits?: number;
      finalGrade?: number;
      attemptCount?: number;
      statusNote?: string;
    }
  ) => string;
  updateSubject: (
    subjectId: string,
    updates: Partial<Omit<Subject, 'id' | 'topics'>>
  ) => void;
  setSubjectAcademicStatus: (
    subjectId: string,
    academicStatus: SubjectAcademicStatus,
    options?: {
      finalGrade?: number;
      statusNote?: string;
      markAllTopicsGreen?: boolean;
    }
  ) => void;
  retakeSubject: (
    subjectId: string,
    mode?: 'keep_green' | 'reset_all_red',
    statusNote?: string
  ) => void;
  replaceSubjectWithTemplate: (
    oldSubjectId: string,
    newTemplate: SubjectTemplate,
    academicStatus?: SubjectAcademicStatus
  ) => string;
  deleteSubject: (subjectId: string) => void;
  updateGradeCuts: (
    subjectId: string,
    gradeCuts: GradeCut[],
    targetGrade?: number
  ) => void;

  // Temas
  addTopic: (
    subjectId: string,
    name: string,
    classDate?: string,
    status?: MasteryLevel,
    lastReviewedDate?: string,
    summary?: string,
    summaryPhoto?: string,
    customId?: string
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
  addScheduleItem: (item: Omit<ScheduleItem, 'id'> & { id?: string }) => ScheduleItem;
  deleteScheduleItem: (id: string) => void;
  setSchedule: (schedule: ScheduleItem[]) => void;

  // Amigos
  addFriend: (email: string, name?: string, customFriend?: Partial<Friend>) => Friend;
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
      subjects: [],
      schedule: [],
      friends: [],

      addSubject: (
        name: string,
        code: string,
        colorTheme: string = 'blue',
        emoji: string = '📚',
        summary: string = '',
        examDate?: string,
        customId?: string,
        meta?: {
          academicStatus?: SubjectAcademicStatus;
          semester?: number;
          credits?: number;
          finalGrade?: number;
          attemptCount?: number;
          statusNote?: string;
        }
      ) => {
        const id = customId || generateUniqueId('sub');
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
          academicStatus: meta?.academicStatus || 'enrolled',
          semester: meta?.semester,
          credits: meta?.credits ?? 3,
          finalGrade: meta?.finalGrade,
          attemptCount: meta?.attemptCount ?? 1,
          statusNote: meta?.statusNote,
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

      setSubjectAcademicStatus: (
        subjectId: string,
        academicStatus: SubjectAcademicStatus,
        options?: {
          finalGrade?: number;
          statusNote?: string;
          markAllTopicsGreen?: boolean;
        }
      ) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            const shouldMarkGreen =
              academicStatus === 'passed' && options?.markAllTopicsGreen !== false;
            return {
              ...sub,
              academicStatus,
              finalGrade:
                options?.finalGrade !== undefined ? options.finalGrade : sub.finalGrade,
              statusNote:
                options?.statusNote !== undefined ? options.statusNote : sub.statusNote,
              topics: shouldMarkGreen
                ? sub.topics.map((t) => ({
                    ...t,
                    status: 'green' as MasteryLevel,
                    lastReviewedDate: today,
                    timesReviewed: Math.max(1, t.timesReviewed),
                  }))
                : sub.topics,
            };
          }),
        }));
      },

      retakeSubject: (
        subjectId: string,
        mode: 'keep_green' | 'reset_all_red' = 'keep_green',
        statusNote?: string
      ) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.id !== subjectId) return sub;
            const nextAttempt = (sub.attemptCount || 1) + 1;
            return {
              ...sub,
              academicStatus: 'enrolled',
              attemptCount: nextAttempt,
              finalGrade: undefined,
              statusNote:
                statusNote ||
                `Cursando por ${nextAttempt}ª vez (re-inscrita el ${today})`,
              topics: sub.topics.map((t) => ({
                ...t,
                status:
                  mode === 'reset_all_red'
                    ? 'red'
                    : t.status === 'green'
                    ? 'green'
                    : 'red',
                lastReviewedDate: today,
              })),
            };
          }),
        }));
      },

      replaceSubjectWithTemplate: (
        oldSubjectId: string,
        newTemplate: SubjectTemplate,
        academicStatus: SubjectAcademicStatus = 'enrolled'
      ) => {
        const newSubId = generateUniqueId('sub');
        const today = new Date().toISOString().split('T')[0];
        const isPassed = academicStatus === 'passed';

        const replacementSubject: Subject = {
          id: newSubId,
          name: newTemplate.name,
          code: newTemplate.code,
          colorTheme: newTemplate.colorTheme,
          emoji: newTemplate.emoji,
          summary: newTemplate.summary || '',
          summaryPhoto: '',
          icon: 'BookOpen',
          academicStatus,
          semester: newTemplate.semester,
          credits: newTemplate.credits ?? 3,
          attemptCount: 1,
          finalGrade: isPassed ? 4.0 : undefined,
          topics: newTemplate.topics.map((t) => ({
            id: generateUniqueId('top'),
            subjectId: newSubId,
            name: t.name,
            classDate: today,
            lastReviewedDate: today,
            status: isPassed ? 'green' : 'red',
            timesReviewed: isPassed ? 2 : 0,
            summary: t.summary || '',
            summaryPhoto: '',
          })),
        };

        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === oldSubjectId ? replacementSubject : s
          ),
        }));

        return newSubId;
      },

      deleteSubject: (subjectId: string) => {
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== subjectId),
        }));
      },

      updateGradeCuts: (
        subjectId: string,
        gradeCuts: GradeCut[],
        targetGrade?: number
      ) => {
        set((state) => ({
          subjects: state.subjects.map((s) => {
            if (s.id !== subjectId) return s;
            // Calcular nota final ponderada si todos los cortes están llenos o estimar
            const totalWeight = gradeCuts.reduce((acc, c) => acc + c.percentage, 0);
            const weightedSum = gradeCuts.reduce(
              (acc, c) => acc + (c.grade !== undefined ? c.grade * (c.percentage / 100) : 0),
              0
            );
            const isFullyGraded = gradeCuts.every((c) => c.grade !== undefined);

            return {
              ...s,
              gradeCuts,
              targetGrade: targetGrade ?? s.targetGrade ?? 3.0,
              finalGrade: isFullyGraded
                ? Number((totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : weightedSum).toFixed(2))
                : s.finalGrade,
            };
          }),
        }));
      },

      addTopic: (
        subjectId: string,
        name: string,
        classDate?: string,
        status: MasteryLevel = 'yellow',
        lastReviewedDate?: string,
        summary: string = '',
        summaryPhoto: string = '',
        customId?: string
      ) => {
        const topicId = customId || generateUniqueId('top');
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
      addScheduleItem: (item: Omit<ScheduleItem, 'id'> & { id?: string }) => {
        const id = item.id || generateUniqueId('sch');
        const newItem: ScheduleItem = { ...item, id };
        set((state) => ({ schedule: [...state.schedule, newItem] }));
        return newItem;
      },

      deleteScheduleItem: (id: string) => {
        set((state) => ({ schedule: state.schedule.filter((i) => i.id !== id) }));
      },

      setSchedule: (schedule: ScheduleItem[]) => set({ schedule }),

      // Amigos
      addFriend: (email: string, name?: string, customFriend?: Partial<Friend>) => {
        const id = customFriend?.id || generateUniqueId('fr');
        const newFriend: Friend = {
          id,
          name: customFriend?.name || name || email.split('@')[0],
          email: email.toLowerCase().trim(),
          streakDays: customFriend?.streakDays ?? 1,
          level: customFriend?.level ?? 1,
          xp: customFriend?.xp ?? 0,
          equippedAnimal: customFriend?.equippedAnimal || 'owl',
          cheeredToday: false,
        };
        set((state) => ({
          friends: [
            newFriend,
            ...state.friends.filter((f) => f.email.toLowerCase() !== newFriend.email),
          ],
        }));
        return newFriend;
      },

      cheerFriend: (id: string) => {
        set((state) => ({
          friends: state.friends.map((f) => (f.id === id ? { ...f, cheeredToday: true } : f)),
        }));
      },

      setFriends: (friends: Friend[]) => set({ friends }),

      // Carga masiva de plantilla (opcional si el usuario lo pide)
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
      resetAllSubjects: () => set({ subjects: [], schedule: [], friends: [] }),
    }),
    {
      name: 'misemaforo_study_v2',
    }
  )
);
