import fs from 'fs';
import path from 'path';
import { Subject, Topic } from '../src/types/study.types';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  studentProfile: {
    level: 'school' | 'university';
    gradeOrCareer: string;
    name: string;
  };
  subjects: Subject[];
  gamification: {
    xp: number;
    volts: number;
    streakDays: number;
    shieldsCount: number;
    lastActiveDate: string;
    isStreakPaused: boolean;
  };
  studyReportsGeneratedCount: number;
}

const DEFAULT_DB: DatabaseSchema = {
  studentProfile: {
    level: 'university',
    gradeOrCareer: 'Ingeniería / Pregrado',
    name: 'Estudiante',
  },
  subjects: [],
  gamification: {
    xp: 280,
    volts: 45,
    streakDays: 5,
    shieldsCount: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    isStreakPaused: false,
  },
  studyReportsGeneratedCount: 0,
};

// Asegurar directorio y archivo
export function initDB(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  }
}

export function readDB(): DatabaseSchema {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Error al leer db.json, reinicializando...', err);
    return DEFAULT_DB;
  }
}

export function writeDB(data: DatabaseSchema): void {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
