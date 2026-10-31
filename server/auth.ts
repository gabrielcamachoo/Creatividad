import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from './sqlite';
import crypto from 'crypto';

export const JWT_SECRET = process.env.JWT_SECRET || 'misemaforo_super_secret_jwt_key_2026';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  student_level: 'school' | 'university';
  photo_url?: string;
  career_or_grade?: string;
  equipped_animal?: string;
  equipped_accessory?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      student_level: user.student_level,
      photo_url: user.photo_url || '',
      career_or_grade: user.career_or_grade || '',
      equipped_animal: user.equipped_animal || 'owl',
      equipped_accessory: user.equipped_accessory || 'none',
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Middleware para verificar JWT
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Si no trae token, asignamos usuario demo por defecto para que la app siempre funcione de forma transparente
    const demoUser = await dbGet<AuthUser>(
      `SELECT id, email, name, student_level, photo_url, career_or_grade, equipped_animal, equipped_accessory FROM users WHERE email = ?`,
      ['estudiante@misemaforo.edu.co']
    );
    if (demoUser) {
      req.user = demoUser;
      next();
      return;
    }
    res.status(401).json({ error: 'Token de autenticación requerido' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido o expirado' });
      return;
    }
    req.user = decoded as AuthUser;
    next();
  });
}

// Asegurar usuario demo
export async function ensureDemoUser(): Promise<AuthUser> {
  const existing = await dbGet<AuthUser>(
    `SELECT id, email, name, student_level, photo_url, career_or_grade, equipped_animal, equipped_accessory FROM users WHERE email = ?`,
    ['estudiante@misemaforo.edu.co']
  );

  if (existing) {
    return existing;
  }

  const userId = `usr-demo-${Date.now()}`;
  const passwordHash = await bcrypt.hash('estudiante123', 10);
  const now = new Date().toISOString();

  await dbRun(
    `INSERT INTO users (id, email, password_hash, name, student_level, photo_url, career_or_grade, equipped_animal, equipped_accessory, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      'estudiante@misemaforo.edu.co',
      passwordHash,
      'Estudiante Demo',
      'university',
      '',
      'Ingeniería & Ciencias',
      'owl',
      'grad_cap',
      now,
    ]
  );

  await dbRun(
    `INSERT INTO gamification (user_id, xp, volts, streak_days, shields_count, last_active_date, is_streak_paused, unlocked_animals, unlocked_accessories)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, 280, 45, 5, 1, now.split('T')[0], 0, '["owl", "fox"]', '["grad_cap"]']
  );

  return {
    id: userId,
    email: 'estudiante@misemaforo.edu.co',
    name: 'Estudiante Demo',
    student_level: 'university',
    career_or_grade: 'Ingeniería & Ciencias',
    equipped_animal: 'owl',
    equipped_accessory: 'grad_cap',
  };
}
