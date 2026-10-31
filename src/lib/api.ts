import { Subject, Topic, MasteryLevel, ScheduleItem, Friend } from '@/types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('misemaforo_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface StudyReportResponse {
  generatedAt: string;
  studentProfile: {
    level: 'school' | 'university';
    gradeOrCareer: string;
    name: string;
  };
  summary: {
    totalTopics: number;
    greenCount: number;
    yellowCount: number;
    redCount: number;
    masteryPercentage: number;
    pendingActionCount: number;
    estimatedHoursToMasterAll: number;
  };
  diagnosticMessage: string;
  actionPlan: Array<{
    order: number;
    topicName: string;
    subjectName: string;
    subjectCode: string;
    subjectEmoji?: string;
    status: MasteryLevel;
    batteryBlocks: number;
    daysSinceReview: number;
    summary?: string;
    priorityLevel: string;
    estimatedMinutes: number;
    suggestedMethod: string;
    studyTips?: string[];
  }>;
}

export const api = {
  // Estado del backend
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  register: async (payload: {
    email: string;
    password: string;
    name: string;
    studentLevel: 'school' | 'university';
    careerOrGrade?: string;
    photoUrl?: string;
    equippedAnimal?: string;
  }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al registrar usuario');
    }
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Credenciales inválidas');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al obtener usuario actual');
    return res.json();
  },

  updateProfile: async (data: {
    name?: string;
    photoUrl?: string;
    careerOrGrade?: string;
    equippedAnimal?: string;
    equippedAccessory?: string;
    studentLevel?: 'school' | 'university';
  }) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar perfil');
    return res.json();
  },

  updateLevel: async (studentLevel: 'school' | 'university') => {
    const res = await fetch(`${API_BASE}/auth/level`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ studentLevel }),
    });
    if (!res.ok) throw new Error('Error al actualizar nivel');
    return res.json();
  },

  // Materias
  getSubjects: async (): Promise<Subject[]> => {
    const res = await fetch(`${API_BASE}/subjects`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al obtener materias');
    return res.json();
  },

  createSubject: async (payload: {
    id?: string;
    name: string;
    code: string;
    colorTheme?: string;
    emoji?: string;
    summary?: string;
    examDate?: string;
  }): Promise<Subject> => {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al crear materia');
    return res.json();
  },

  bulkImport: async (payload: {
    id?: string;
    subjectName: string;
    code?: string;
    colorTheme?: string;
    emoji?: string;
    examDate?: string;
    masteredTopics: Array<string | { id: string; name: string }>;
    partialTopics: Array<string | { id: string; name: string }>;
    unknownTopics: Array<string | { id: string; name: string }>;
  }) => {
    const res = await fetch(`${API_BASE}/subjects/bulk-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { success: true };
    }
    return res.json();
  },

  updateSubject: async (
    id: string,
    payload: {
      name?: string;
      code?: string;
      colorTheme?: string;
      emoji?: string;
      summary?: string;
      summaryPhoto?: string;
      examDate?: string;
    }
  ) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al actualizar materia');
    return res.json();
  },

  deleteSubject: async (id: string) => {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al eliminar materia');
    return res.json();
  },

  // Temas individuales
  addTopic: async (
    subjectId: string,
    payload: {
      id?: string;
      name: string;
      classDate?: string;
      status?: MasteryLevel;
      summary?: string;
      summaryPhoto?: string;
    }
  ): Promise<Topic> => {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al añadir tema');
    return res.json();
  },

  updateTopic: async (
    id: string,
    data: {
      status?: MasteryLevel;
      name?: string;
      lastReviewedDate?: string;
      classDate?: string;
      summary?: string;
      summaryPhoto?: string;
    }
  ) => {
    const res = await fetch(`${API_BASE}/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar tema');
    return res.json();
  },

  reviewTopic: async (id: string, reviewDate?: string) => {
    const res = await fetch(`${API_BASE}/topics/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reviewDate }),
    });
    if (!res.ok) throw new Error('Error al registrar repaso');
    return res.json();
  },

  deleteTopic: async (id: string) => {
    const res = await fetch(`${API_BASE}/topics/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al eliminar tema');
    return res.json();
  },

  // Horario de Clases
  getSchedule: async (): Promise<ScheduleItem[]> => {
    const res = await fetch(`${API_BASE}/schedule`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al consultar horario');
    return res.json();
  },

  addScheduleItem: async (payload: {
    id?: string;
    subjectId?: string;
    subjectName: string;
    subjectEmoji?: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room?: string;
  }): Promise<ScheduleItem> => {
    const res = await fetch(`${API_BASE}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Error al agregar clase al horario');
    return res.json();
  },

  deleteScheduleItem: async (id: string) => {
    const res = await fetch(`${API_BASE}/schedule/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al eliminar clase del horario');
    return res.json();
  },

  // Amigos
  getFriends: async (): Promise<Friend[]> => {
    const res = await fetch(`${API_BASE}/friends`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al consultar amigos');
    return res.json();
  },

  addFriend: async (email: string): Promise<Friend> => {
    const res = await fetch(`${API_BASE}/friends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al agregar amigo');
    }
    return res.json();
  },

  cheerFriend: async (id: string) => {
    const res = await fetch(`${API_BASE}/friends/${id}/cheer`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al animar amigo');
    return res.json();
  },

  // Generador de Reporte Inteligente por Priorización
  getStudyReport: async (subjectId?: string, simulatedDate?: string): Promise<StudyReportResponse> => {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', subjectId);
    if (simulatedDate) params.append('simulatedDate', simulatedDate);

    const url = `${API_BASE}/report/priority?${params.toString()}`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al generar reporte de estudio');
    return res.json();
  },

  // Seed
  seedData: async (type: 'school' | 'university') => {
    const res = await fetch(`${API_BASE}/seed/${type}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Error al sembrar datos');
    return res.json();
  },
};
