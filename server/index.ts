import express, { Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDatabase, dbRun, dbGet, dbAll } from './sqlite';
import {
  authenticateToken,
  generateToken,
  ensureDemoUser,
  AuthenticatedRequest,
} from './auth';
import { calculateBatteryBlocks, calculatePrioritizedTopics } from '../src/lib/studyEngine';
import { Subject, Topic, MasteryLevel, ScheduleItem, Friend } from '../src/types/study.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Permitir peticiones con JSON y payloads de imágenes base64 de hasta 15MB
app.use(
  cors({
    origin: FRONTEND_URL === '*' ? true : FRONTEND_URL.split(',').map((u) => u.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Inicializar SQLite y usuario demo
initDatabase().then(() => {
  ensureDemoUser().catch(console.error);
});

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MiSemaforo Backend API (SQLite + Auth)',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. AUTENTICACIÓN
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, studentLevel, careerOrGrade, photoUrl, equippedAnimal } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existing = await dbGet(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este correo electrónico' });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const level = studentLevel === 'school' ? 'school' : 'university';
    const animal = equippedAnimal || 'owl';

    await dbRun(
      `INSERT INTO users (id, email, password_hash, name, student_level, photo_url, career_or_grade, equipped_animal, equipped_accessory, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        email.toLowerCase().trim(),
        passwordHash,
        name.trim(),
        level,
        photoUrl || '',
        careerOrGrade || (level === 'school' ? 'Bachillerato' : 'Universidad'),
        animal,
        'none',
        now,
      ]
    );

    await dbRun(
      `INSERT INTO gamification (user_id, xp, volts, streak_days, shields_count, last_active_date, is_streak_paused, unlocked_animals, unlocked_accessories)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 0, 0, 1, 1, now.split('T')[0], 0, JSON.stringify([animal]), '[]']
    );

    const userObj = {
      id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      student_level: level,
      photo_url: photoUrl || '',
      career_or_grade: careerOrGrade || '',
      equipped_animal: animal,
      equipped_accessory: 'none',
    };
    const token = generateToken(userObj);

    res.status(201).json({ token, user: userObj });
  } catch (err: any) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Ingresa correo y contraseña' });
    }

    const user = await dbGet<any>(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userObj = {
      id: user.id,
      email: user.email,
      name: user.name,
      student_level: user.student_level,
      photo_url: user.photo_url || '',
      career_or_grade: user.career_or_grade || '',
      equipped_animal: user.equipped_animal || 'owl',
      equipped_accessory: user.equipped_accessory || 'none',
    };
    const token = generateToken(userObj);

    res.json({ token, user: userObj });
  } catch (err: any) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await dbGet<any>(
      `SELECT id, email, name, student_level, photo_url, career_or_grade, equipped_animal, equipped_accessory, created_at FROM users WHERE id = ?`,
      [req.user!.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, photoUrl, careerOrGrade, equippedAnimal, equippedAccessory, studentLevel } = req.body;
    const userId = req.user!.id;

    const current = await dbGet<any>(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!current) return res.status(404).json({ error: 'Usuario no encontrado' });

    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedPhoto = photoUrl !== undefined ? photoUrl : current.photo_url;
    const updatedCareer = careerOrGrade !== undefined ? careerOrGrade.trim() : current.career_or_grade;
    const updatedAnimal = equippedAnimal !== undefined ? equippedAnimal : current.equipped_animal;
    const updatedAccessory = equippedAccessory !== undefined ? equippedAccessory : current.equipped_accessory;
    const updatedLevel = studentLevel !== undefined ? studentLevel : current.student_level;

    await dbRun(
      `UPDATE users SET name = ?, photo_url = ?, career_or_grade = ?, equipped_animal = ?, equipped_accessory = ?, student_level = ? WHERE id = ?`,
      [updatedName, updatedPhoto, updatedCareer, updatedAnimal, updatedAccessory, updatedLevel, userId]
    );

    const updatedUser = {
      id: userId,
      email: current.email,
      name: updatedName,
      student_level: updatedLevel,
      photo_url: updatedPhoto,
      career_or_grade: updatedCareer,
      equipped_animal: updatedAnimal,
      equipped_accessory: updatedAccessory,
    };

    const token = generateToken(updatedUser);
    res.json({ token, user: updatedUser });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

app.put('/api/auth/level', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentLevel } = req.body;
    const level = studentLevel === 'school' ? 'school' : 'university';
    await dbRun(`UPDATE users SET student_level = ? WHERE id = ?`, [level, req.user!.id]);
    res.json({ success: true, student_level: level });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar nivel' });
  }
});

// 3. MATERIAS (CRUD filtrado por user_id)
app.get('/api/subjects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const rawSubjects = await dbAll<any>(`SELECT * FROM subjects WHERE user_id = ? ORDER BY created_at ASC`, [userId]);
    const rawTopics = await dbAll<any>(`SELECT * FROM topics WHERE user_id = ? ORDER BY created_at ASC`, [userId]);

    const subjects: Subject[] = rawSubjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      colorTheme: s.color_theme,
      emoji: s.emoji || '📚',
      summary: s.summary || '',
      summaryPhoto: s.summary_photo || '',
      examDate: s.exam_date || undefined,
      icon: 'BookOpen',
      topics: rawTopics
        .filter((t) => t.subject_id === s.id)
        .map((t) => ({
          id: t.id,
          subjectId: t.subject_id,
          name: t.name,
          classDate: t.class_date,
          lastReviewedDate: t.last_reviewed_date,
          status: t.status as MasteryLevel,
          timesReviewed: t.times_reviewed,
          summary: t.summary || '',
          summaryPhoto: t.summary_photo || '',
        })),
    }));

    res.json(subjects);
  } catch (err) {
    console.error('Error al listar materias:', err);
    res.status(500).json({ error: 'Error al consultar materias' });
  }
});

app.post('/api/subjects', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id, name, code, colorTheme, emoji, summary, examDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre de la materia es obligatorio' });
    }

    const subjectId = id || crypto.randomUUID();
    const finalCode = (code || name.trim().substring(0, 3)).toUpperCase();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO subjects (id, user_id, name, code, color_theme, emoji, summary, summary_photo, exam_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, userId, name.trim(), finalCode, colorTheme || 'blue', emoji || '📚', summary || '', '', examDate || null, now]
    );

    const created: Subject = {
      id: subjectId,
      name: name.trim(),
      code: finalCode,
      colorTheme: colorTheme || 'blue',
      emoji: emoji || '📚',
      summary: summary || '',
      summaryPhoto: '',
      icon: 'BookOpen',
      topics: [],
      examDate,
    };

    res.status(201).json(created);
  } catch (err) {
    console.error('Error al crear materia:', err);
    res.status(500).json({ error: 'Error interno al crear materia' });
  }
});

app.post('/api/subjects/bulk-import', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id, subjectName, code, colorTheme, emoji, examDate, masteredTopics = [], partialTopics = [], unknownTopics = [] } = req.body;

    if (!subjectName || !subjectName.trim()) {
      return res.status(400).json({ error: 'El nombre de la materia es obligatorio' });
    }

    const subjectId = id || crypto.randomUUID();
    const finalCode = (code || subjectName.trim().substring(0, 3)).toUpperCase();
    const now = new Date().toISOString();
    const dateStr = now.split('T')[0];

    await dbRun(
      `INSERT INTO subjects (id, user_id, name, code, color_theme, emoji, summary, summary_photo, exam_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, userId, subjectName.trim(), finalCode, colorTheme || 'emerald', emoji || '📚', '', '', examDate || null, now]
    );

    const insertTopicGroup = async (items: Array<string | { id?: string; name: string }>, status: MasteryLevel) => {
      for (const item of items) {
        const tName = typeof item === 'string' ? item.trim() : item.name?.trim();
        const tId = (typeof item === 'object' && item.id) ? item.id : crypto.randomUUID();
        if (!tName) continue;
        await dbRun(
          `INSERT INTO topics (id, subject_id, user_id, name, class_date, last_reviewed_date, status, times_reviewed, summary, summary_photo, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [tId, subjectId, userId, tName, dateStr, dateStr, status, status === 'green' ? 1 : 0, '', '', now]
        );
      }
    };

    await insertTopicGroup(masteredTopics, 'green');
    await insertTopicGroup(partialTopics, 'yellow');
    await insertTopicGroup(unknownTopics, 'red');

    res.status(201).json({ success: true, subjectId });
  } catch (err) {
    console.error('Error en bulk-import:', err);
    res.status(500).json({ error: 'Error al importar materia con temas' });
  }
});

app.put('/api/subjects/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, code, colorTheme, emoji, summary, summaryPhoto, examDate } = req.body;

    const existing = await dbGet<any>(`SELECT * FROM subjects WHERE id = ? AND user_id = ?`, [id, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    const uName = name !== undefined ? name.trim() : existing.name;
    const uCode = code !== undefined ? code.trim().toUpperCase() : existing.code;
    const uColor = colorTheme !== undefined ? colorTheme : existing.color_theme;
    const uEmoji = emoji !== undefined ? emoji : existing.emoji;
    const uSummary = summary !== undefined ? summary : existing.summary;
    const uPhoto = summaryPhoto !== undefined ? summaryPhoto : existing.summary_photo;
    const uExam = examDate !== undefined ? examDate : existing.exam_date;

    await dbRun(
      `UPDATE subjects SET name = ?, code = ?, color_theme = ?, emoji = ?, summary = ?, summary_photo = ?, exam_date = ? WHERE id = ? AND user_id = ?`,
      [uName, uCode, uColor, uEmoji, uSummary, uPhoto, uExam, id, userId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
});

app.delete('/api/subjects/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await dbRun(`DELETE FROM subjects WHERE id = ? AND user_id = ?`, [id, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
});

// 4. TEMAS
app.post('/api/subjects/:subjectId/topics', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { subjectId } = req.params;
    const { id, name, classDate, status, summary, summaryPhoto } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del tema es obligatorio' });
    }

    const subject = await dbGet(`SELECT id FROM subjects WHERE id = ? AND user_id = ?`, [subjectId, userId]);
    if (!subject) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }

    const topicId = id || crypto.randomUUID();
    const now = new Date().toISOString();
    const dateStr = classDate || now.split('T')[0];
    const initialStatus: MasteryLevel = ['green', 'yellow', 'red'].includes(status) ? status : 'yellow';

    await dbRun(
      `INSERT INTO topics (id, subject_id, user_id, name, class_date, last_reviewed_date, status, times_reviewed, summary, summary_photo, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        topicId,
        subjectId,
        userId,
        name.trim(),
        dateStr,
        dateStr,
        initialStatus,
        initialStatus === 'green' ? 1 : 0,
        summary || '',
        summaryPhoto || '',
        now,
      ]
    );

    const createdTopic: Topic = {
      id: topicId,
      subjectId,
      name: name.trim(),
      classDate: dateStr,
      lastReviewedDate: dateStr,
      status: initialStatus,
      timesReviewed: initialStatus === 'green' ? 1 : 0,
      summary: summary || '',
      summaryPhoto: summaryPhoto || '',
    };

    res.status(201).json(createdTopic);
  } catch (err) {
    console.error('Error al agregar tema:', err);
    res.status(500).json({ error: 'Error al agregar tema' });
  }
});

app.put('/api/topics/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, status, classDate, lastReviewedDate, summary, summaryPhoto } = req.body;

    const topic = await dbGet<any>(`SELECT * FROM topics WHERE id = ? AND user_id = ?`, [id, userId]);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    const uName = name !== undefined ? name.trim() : topic.name;
    const uStatus = status !== undefined && ['green', 'yellow', 'red'].includes(status) ? status : topic.status;
    const uClassDate = classDate !== undefined ? classDate : topic.class_date;
    const uReviewDate = lastReviewedDate !== undefined ? lastReviewedDate : topic.last_reviewed_date;
    const uSummary = summary !== undefined ? summary : topic.summary;
    const uPhoto = summaryPhoto !== undefined ? summaryPhoto : topic.summary_photo;

    await dbRun(
      `UPDATE topics SET name = ?, status = ?, class_date = ?, last_reviewed_date = ?, summary = ?, summary_photo = ? WHERE id = ? AND user_id = ?`,
      [uName, uStatus, uClassDate, uReviewDate, uSummary, uPhoto, id, userId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar tema' });
  }
});

app.post('/api/topics/:id/review', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { reviewDate } = req.body;
    const todayStr = reviewDate || new Date().toISOString().split('T')[0];

    const topic = await dbGet<any>(`SELECT * FROM topics WHERE id = ? AND user_id = ?`, [id, userId]);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    await dbRun(
      `UPDATE topics SET last_reviewed_date = ?, times_reviewed = times_reviewed + 1 WHERE id = ? AND user_id = ?`,
      [todayStr, id, userId]
    );

    res.json({ success: true, lastReviewedDate: todayStr, timesReviewed: topic.times_reviewed + 1 });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar repaso' });
  }
});

app.delete('/api/topics/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await dbRun(`DELETE FROM topics WHERE id = ? AND user_id = ?`, [id, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar tema' });
  }
});

// 5. HORARIO DE CLASES (Schedule)
app.get('/api/schedule', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const items = await dbAll<any>(`SELECT * FROM schedule WHERE user_id = ? ORDER BY day_of_week ASC, start_time ASC`, [userId]);
    const mapped: ScheduleItem[] = items.map((i) => ({
      id: i.id,
      subjectId: i.subject_id,
      subjectName: i.subject_name,
      subjectEmoji: i.subject_emoji,
      dayOfWeek: i.day_of_week,
      startTime: i.start_time,
      endTime: i.end_time,
      room: i.room,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar horario' });
  }
});

app.post('/api/schedule', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id: clientId, subjectId, subjectName, subjectEmoji, dayOfWeek, startTime, endTime, room } = req.body;

    if (!subjectName || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ error: 'Todos los campos de la clase son obligatorios' });
    }

    const id = clientId || crypto.randomUUID();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO schedule (id, user_id, subject_id, subject_name, subject_emoji, day_of_week, start_time, end_time, room, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, subjectId || null, subjectName, subjectEmoji || '📚', dayOfWeek, startTime, endTime, room || '', now]
    );

    const created: ScheduleItem = {
      id,
      subjectId,
      subjectName,
      subjectEmoji: subjectEmoji || '📚',
      dayOfWeek,
      startTime,
      endTime,
      room,
    };

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar clase al horario' });
  }
});

app.delete('/api/schedule/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    await dbRun(`DELETE FROM schedule WHERE id = ? AND user_id = ?`, [id, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar clase del horario' });
  }
});

// 6. AMIGOS / COMPAÑEROS DE ESTUDIO (Friends)
app.get('/api/friends', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Obtener lista de amigos del usuario
    const rows = await dbAll<any>(`SELECT * FROM friends WHERE user_id = ? ORDER BY created_at DESC`, [userId]);

    // Enriquecer con datos del usuario amigo si existe en la BD
    const friends: Friend[] = [];
    for (const r of rows) {
      const friendUser = await dbGet<any>(
        `SELECT u.id, u.name, u.email, u.photo_url, u.equipped_animal, g.streak_days, g.xp
         FROM users u
         LEFT JOIN gamification g ON g.user_id = u.id
         WHERE u.email = ?`,
        [r.friend_email.toLowerCase()]
      );

      if (friendUser) {
        friends.push({
          id: r.id,
          name: friendUser.name,
          email: friendUser.email,
          photoUrl: friendUser.photo_url || '',
          equippedAnimal: friendUser.equipped_animal || 'owl',
          streakDays: friendUser.streak_days || 1,
          xp: friendUser.xp || 100,
          level: Math.floor((friendUser.xp || 100) / 250) + 1,
        });
      } else {
        friends.push({
          id: r.id,
          name: r.friend_name,
          email: r.friend_email,
          photoUrl: '',
          equippedAnimal: 'owl',
          streakDays: 3,
          xp: 220,
          level: 2,
        });
      }
    }

    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar amigos' });
  }
});

app.post('/api/friends', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Ingresa el correo del amigo' });
    }

    const targetEmail = email.toLowerCase().trim();

    // No agregarse a uno mismo
    const me = await dbGet<any>(`SELECT email FROM users WHERE id = ?`, [userId]);
    if (me && me.email === targetEmail) {
      return res.status(400).json({ error: 'No puedes agregarte a ti mismo como amigo.' });
    }

    // Verificar si ya está agregado
    const existing = await dbGet<any>(`SELECT id FROM friends WHERE user_id = ? AND friend_email = ?`, [
      userId,
      targetEmail,
    ]);
    if (existing) {
      return res.status(409).json({ error: 'Ya tienes a este compañero en tu lista de amigos.' });
    }

    // Buscar si el usuario existe en el sistema
    const friendUser = await dbGet<any>(`SELECT name FROM users WHERE email = ?`, [targetEmail]);
    const friendName = friendUser ? friendUser.name : targetEmail.split('@')[0];

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO friends (id, user_id, friend_email, friend_name, created_at) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, targetEmail, friendName, now]
    );

    res.status(201).json({
      id,
      name: friendName,
      email: targetEmail,
      streakDays: 1,
      level: 1,
      xp: 100,
      equippedAnimal: 'owl',
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar amigo' });
  }
});

app.post('/api/friends/:id/cheer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    // Otorgar al usuario +5 Voltios por animar a su compañero
    await dbRun(`UPDATE gamification SET volts = volts + 5 WHERE user_id = ?`, [req.user!.id]);
    res.json({ success: true, message: '¡Le enviaste energía a tu compañero! (+5 Voltios)' });
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar saludo' });
  }
});

// 7. REPORTE INTELIGENTE DE PRIORIZACIÓN
app.get('/api/report/priority', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { subjectId, simulatedDate } = req.query;

    const todayStr = (simulatedDate as string) || new Date().toISOString().split('T')[0];

    let subjectsQuery = `SELECT * FROM subjects WHERE user_id = ?`;
    const queryParams: any[] = [userId];

    if (subjectId && subjectId !== 'all') {
      subjectsQuery += ` AND id = ?`;
      queryParams.push(subjectId);
    }

    const rawSubjects = await dbAll<any>(subjectsQuery, queryParams);
    const rawTopics = await dbAll<any>(`SELECT * FROM topics WHERE user_id = ?`, [userId]);
    const userProfile = await dbGet<any>(`SELECT name, student_level, career_or_grade FROM users WHERE id = ?`, [userId]);

    const subjects: Subject[] = rawSubjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      colorTheme: s.color_theme,
      emoji: s.emoji || '📚',
      summary: s.summary || '',
      summaryPhoto: s.summary_photo || '',
      examDate: s.exam_date || undefined,
      icon: 'BookOpen',
      topics: rawTopics
        .filter((t) => t.subject_id === s.id)
        .map((t) => ({
          id: t.id,
          subjectId: t.subject_id,
          name: t.name,
          classDate: t.class_date,
          lastReviewedDate: t.last_reviewed_date,
          status: t.status as MasteryLevel,
          timesReviewed: t.times_reviewed,
          summary: t.summary || '',
          summaryPhoto: t.summary_photo || '',
        })),
    }));

    const prioritized = calculatePrioritizedTopics(subjects, todayStr);
    const nonMastered = prioritized.filter((p) => p.topic.status !== 'green');

    let total = 0;
    const greenTopics: any[] = [];
    const yellowTopics: any[] = [];
    const redTopics: any[] = [];

    subjects.forEach((s) => {
      s.topics.forEach((t) => {
        total++;
        if (t.status === 'green') greenTopics.push(t);
        else if (t.status === 'yellow') yellowTopics.push(t);
        else if (t.status === 'red') redTopics.push(t);
      });
    });

    const masteryPercentage = total > 0 ? Math.round((greenTopics.length / total) * 100) : 0;
    const pendingTopics = [...redTopics, ...yellowTopics];
    const estimatedHours = Math.round((redTopics.length * 45 + yellowTopics.length * 25) / 60 * 10) / 10;

    const actionPlan = nonMastered.map((p, index) => {
      const isRed = p.topic.status === 'red';
      const priorityLevel = isRed ? '🔴 Prioridad Crítica (Vacío)' : '🟡 Prioridad Media (Práctica)';
      const suggestedMethod = isRed
        ? 'Técnica Feynman: Explícalo en palabras simples como a un niño de 10 años. Si dudas, anota el punto exacto.'
        : 'Active Recall: Resuelve problemas sin mirar el cuaderno. Si aciertas, súbelo a verde.';

      return {
        order: index + 1,
        topicName: p.topic.name,
        subjectName: p.subjectName,
        subjectCode: p.subjectCode,
        subjectEmoji: p.subjectColor || '📚',
        status: p.topic.status,
        batteryBlocks: p.batteryBlocks,
        daysSinceReview: p.daysSinceReview,
        summary: p.topic.summary || '',
        priorityLevel,
        estimatedMinutes: isRed ? 45 : 25,
        suggestedMethod,
      };
    });

    res.json({
      generatedAt: new Date().toISOString(),
      studentProfile: {
        level: userProfile?.student_level || 'university',
        gradeOrCareer: userProfile?.career_or_grade || (userProfile?.student_level === 'school' ? 'Colegio' : 'Universidad'),
        name: userProfile?.name || 'Estudiante',
      },
      summary: {
        totalTopics: total,
        greenCount: greenTopics.length,
        yellowCount: yellowTopics.length,
        redCount: redTopics.length,
        masteryPercentage,
        pendingActionCount: pendingTopics.length,
        estimatedHoursToMasterAll: estimatedHours,
      },
      actionPlan,
    });
  } catch (err) {
    console.error('Error al generar reporte:', err);
    res.status(500).json({ error: 'Error al generar reporte de estudio' });
  }
});

// Servir el frontend compilado (dist/) cuando existe (producción / Render)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor MiSemaforo Backend (SQLite + Auth + Schedule + Friends) escuchando en http://0.0.0.0:${PORT}`);
});
