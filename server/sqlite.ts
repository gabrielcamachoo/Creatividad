import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';

// Cargar variables de entorno locales si existen (.env.local o .env)
const envLocal = path.resolve(process.cwd(), '.env.local');
const envRoot = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envRoot)) {
  dotenv.config({ path: envRoot });
}

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
const isNeon = Boolean(DATABASE_URL);

let neonSql: ReturnType<typeof neon> | null = null;
if (isNeon) {
  neonSql = neon(DATABASE_URL!);
  console.log('✓ Base de datos Neon Postgres conectada.');
}

// Fallback SQLite local para cuando no haya conexión Neon configurada
const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DB_DIR, 'misemaforo.db');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: SqlJsDatabase | null = null;
let dbInitPromise: Promise<SqlJsDatabase> | null = null;

async function getSqliteDb(): Promise<SqlJsDatabase> {
  if (dbInstance) return dbInstance;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      const SQL = await initSqlJs();
      if (fs.existsSync(DB_FILE)) {
        const fileBuffer = fs.readFileSync(DB_FILE);
        dbInstance = new SQL.Database(fileBuffer);
      } else {
        dbInstance = new SQL.Database();
      }
      return dbInstance;
    })();
  }
  return dbInitPromise;
}

function saveDatabaseToDisk(database: SqlJsDatabase): void {
  try {
    const data = database.export();
    fs.writeFileSync(DB_FILE, Buffer.from(data));
  } catch (err) {
    console.warn('Aviso al persistir SQLite local:', err);
  }
}

function sanitizeParams(params: any[] = []): any[] {
  return params.map((p) => (p === undefined ? null : p));
}

/**
 * Convierte consultas con sintaxis de placeholders (?) a formato Postgres ($1, $2, ...)
 */
function convertToPostgresSql(sql: string): string {
  let paramIdx = 1;
  return sql.replace(/\?/g, () => `$${paramIdx++}`);
}

export const db = {};

export async function dbRun(
  sql: string,
  params: any[] = []
): Promise<{ lastID?: number; changes?: number }> {
  const clean = sanitizeParams(params);

  if (isNeon && neonSql) {
    const pgSql = convertToPostgresSql(sql);
    const result = await neonSql.query(pgSql, clean);
    return { lastID: 0, changes: Array.isArray(result) ? result.length : 1 };
  }

  const database = await getSqliteDb();
  database.run(sql, clean);
  const changes = database.getRowsModified();
  saveDatabaseToDisk(database);
  return { lastID: 0, changes };
}

export async function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const clean = sanitizeParams(params);

  if (isNeon && neonSql) {
    const pgSql = convertToPostgresSql(sql);
    const rows = (await neonSql.query(pgSql, clean)) as T[];
    return rows && rows.length > 0 ? rows[0] : undefined;
  }

  const database = await getSqliteDb();
  const stmt = database.prepare(sql);
  try {
    if (clean.length > 0) stmt.bind(clean);
    if (stmt.step()) {
      return stmt.getAsObject() as unknown as T;
    }
    return undefined;
  } finally {
    stmt.free();
  }
}

export async function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const clean = sanitizeParams(params);

  if (isNeon && neonSql) {
    const pgSql = convertToPostgresSql(sql);
    const rows = (await neonSql.query(pgSql, clean)) as T[];
    return rows || [];
  }

  const database = await getSqliteDb();
  const stmt = database.prepare(sql);
  try {
    if (clean.length > 0) stmt.bind(clean);
    const rows: T[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject() as unknown as T);
    }
    return rows;
  } finally {
    stmt.free();
  }
}

async function ensureColumn(table: string, column: string, typeAndDefault: string) {
  try {
    if (isNeon && neonSql) {
      await neonSql.query(
        `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${typeAndDefault};`
      );
      return;
    }

    const columns = await dbAll<{ name: string }>(`PRAGMA table_info(${table})`);
    const exists = columns.some((c) => c.name.toLowerCase() === column.toLowerCase());
    if (!exists) {
      await dbRun(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeAndDefault}`);
    }
  } catch (err) {
    console.warn(`Aviso al verificar columna ${column} en ${table}:`, err);
  }
}

export async function initDatabase(): Promise<void> {
  if (isNeon && neonSql) {
    // 1. Tabla users
    await neonSql.query(`
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

    // 2. Tabla subjects
    await neonSql.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        color_theme TEXT DEFAULT 'blue',
        emoji TEXT DEFAULT '📚',
        summary TEXT DEFAULT '',
        summary_photo TEXT DEFAULT '',
        exam_date TEXT,
        created_at TEXT NOT NULL
      );
    `);
    await ensureColumn('subjects', 'emoji', "TEXT DEFAULT '📚'");
    await ensureColumn('subjects', 'summary', "TEXT DEFAULT ''");
    await ensureColumn('subjects', 'summary_photo', "TEXT DEFAULT ''");

    // 3. Tabla topics
    await neonSql.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        class_date TEXT NOT NULL,
        last_reviewed_date TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('green', 'yellow', 'red')),
        times_reviewed INTEGER DEFAULT 0,
        summary TEXT DEFAULT '',
        summary_photo TEXT DEFAULT '',
        created_at TEXT NOT NULL
      );
    `);
    await ensureColumn('topics', 'summary', "TEXT DEFAULT ''");
    await ensureColumn('topics', 'summary_photo', "TEXT DEFAULT ''");

    // 4. Tabla gamification
    await neonSql.query(`
      CREATE TABLE IF NOT EXISTS gamification (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        xp INTEGER DEFAULT 0,
        volts INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 1,
        shields_count INTEGER DEFAULT 1,
        last_active_date TEXT NOT NULL,
        is_streak_paused INTEGER DEFAULT 0,
        unlocked_animals TEXT DEFAULT '["owl"]',
        unlocked_accessories TEXT DEFAULT '[]'
      );
    `);
    await ensureColumn('gamification', 'unlocked_animals', "TEXT DEFAULT '[\"owl\"]'");
    await ensureColumn('gamification', 'unlocked_accessories', "TEXT DEFAULT '[]'");

    // 5. Tabla schedule
    await neonSql.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject_id TEXT,
        subject_name TEXT NOT NULL,
        subject_emoji TEXT DEFAULT '📚',
        day_of_week TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        room TEXT DEFAULT '',
        created_at TEXT NOT NULL
      );
    `);

    // 6. Tabla friends
    await neonSql.query(`
      CREATE TABLE IF NOT EXISTS friends (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_email TEXT NOT NULL,
        friend_name TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    console.log('✓ Tablas y columnas de MiSemaforo en Neon Postgres inicializadas correctamente.');
    return;
  }

  // Fallback SQLite local
  await dbRun(`PRAGMA foreign_keys = ON;`);
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

  console.log('✓ Tablas y columnas de MiSemaforo (SQLite fallback) inicializadas.');
}
