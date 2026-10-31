import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DB_DIR, 'misemaforo.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err);
  } else {
    console.log(`✓ Base de datos SQLite conectada en: ${DB_FILE}`);
  }
});

// Promisified query helpers
export function dbRun(sql: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
}

export function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

// Función auxiliar para agregar columnas si no existen
async function ensureColumn(table: string, column: string, typeAndDefault: string) {
  try {
    const columns = await dbAll<{ name: string }>(`PRAGMA table_info(${table})`);
    const exists = columns.some((c) => c.name.toLowerCase() === column.toLowerCase());
    if (!exists) {
      await dbRun(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeAndDefault}`);
    }
  } catch (err) {
    console.warn(`Aviso al verificar columna ${column} en ${table}:`, err);
  }
}

// Inicialización del Schema
export async function initDatabase(): Promise<void> {
  await dbRun(`PRAGMA foreign_keys = ON;`);

  // 1. Tabla de Usuarios
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      student_level TEXT DEFAULT 'university',
      photo_url TEXT DEFAULT '',
      career_or_grade TEXT DEFAULT '',
      equipped_animal TEXT DEFAULT 'owl',
      equipped_accessory TEXT DEFAULT 'none',
      created_at TEXT NOT NULL
    );
  `);
  await ensureColumn('users', 'photo_url', "TEXT DEFAULT ''");
  await ensureColumn('users', 'career_or_grade', "TEXT DEFAULT ''");
  await ensureColumn('users', 'equipped_animal', "TEXT DEFAULT 'owl'");
  await ensureColumn('users', 'equipped_accessory', "TEXT DEFAULT 'none'");

  // 2. Tabla de Materias
  await dbRun(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      color_theme TEXT DEFAULT 'blue',
      emoji TEXT DEFAULT '📚',
      summary TEXT DEFAULT '',
      summary_photo TEXT DEFAULT '',
      exam_date TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await ensureColumn('subjects', 'emoji', "TEXT DEFAULT '📚'");
  await ensureColumn('subjects', 'summary', "TEXT DEFAULT ''");
  await ensureColumn('subjects', 'summary_photo', "TEXT DEFAULT ''");

  // 3. Tabla de Temas
  await dbRun(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      class_date TEXT NOT NULL,
      last_reviewed_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('green', 'yellow', 'red')),
      times_reviewed INTEGER DEFAULT 0,
      summary TEXT DEFAULT '',
      summary_photo TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await ensureColumn('topics', 'summary', "TEXT DEFAULT ''");
  await ensureColumn('topics', 'summary_photo', "TEXT DEFAULT ''");

  // 4. Tabla de Gamificación
  await dbRun(`
    CREATE TABLE IF NOT EXISTS gamification (
      user_id TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      volts INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 1,
      shields_count INTEGER DEFAULT 1,
      last_active_date TEXT NOT NULL,
      is_streak_paused INTEGER DEFAULT 0,
      unlocked_animals TEXT DEFAULT '["owl"]',
      unlocked_accessories TEXT DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await ensureColumn('gamification', 'unlocked_animals', "TEXT DEFAULT '[\"owl\"]'");
  await ensureColumn('gamification', 'unlocked_accessories', "TEXT DEFAULT '[]'");

  // 5. Tabla de Horario de Clases (Schedule)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subject_id TEXT,
      subject_name TEXT NOT NULL,
      subject_emoji TEXT DEFAULT '📚',
      day_of_week TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      room TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 6. Tabla de Amigos / Compañeros de Estudio (Friends)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      friend_email TEXT NOT NULL,
      friend_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('✓ Tablas y columnas de MiSemaforo (users, subjects, topics, gamification, schedule, friends) inicializadas.');
}
