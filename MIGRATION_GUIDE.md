# 🌐 Plan de Migración de MiSemaforo a Base de Datos Gratuita y Online

Este documento detalla el plan paso a paso y la arquitectura para migrar la base de datos local SQLite (`misemaforo.db`) a un servicio gratuito en la nube (Online Cloud Database) sin costos de hosting.

---

## 🚀 Opción Recomendada 1: Turso (LibSQL / SQLite Serverless)
> **¿Por qué Turso?** Es SQLite en la nube. **No requiere cambiar el código SQL** de `server/sqlite.ts`, ofrece 9 GB de almacenamiento gratuito y latencia ultrabaja.

### Paso 1: Crear base de datos en Turso
1. Entra a [turso.tech](https://turso.tech) y crea una cuenta gratuita con GitHub.
2. Crea una base de datos llamada `misemaforo-prod`.
3. Obtén la **URL de conexión** (ej: `libsql://misemaforo-prod-usuario.turso.io`) y el **Auth Token**.

### Paso 2: Instalar el cliente en el backend
```bash
npm install @libsql/client
```

### Paso 3: Configurar variables de entorno (`.env`)
```env
TURSO_DATABASE_URL=libsql://misemaforo-prod-usuario.turso.io
TURSO_AUTH_TOKEN=tu_token_aqui
JWT_SECRET=tu_clave_secreta_de_produccion
PORT=3001
```

### Paso 4: Adaptador en `server/sqlite.ts`
```typescript
import { createClient } from '@libsql/client';

export const tursoDb = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Todas las consultas SELECT / INSERT / UPDATE funcionan idénticamente
```

---

## 🐘 Opción Recomendada 2: Supabase (PostgreSQL Gratuito)
> **¿Por qué Supabase?** Ofrece 500 MB de PostgreSQL gratuito, autenticación nativa, panel web visual y backups automáticos.

### Paso 1: Crear proyecto en Supabase
1. Entra a [supabase.com](https://supabase.com) y crea un nuevo proyecto `misemaforo`.
2. En el **SQL Editor**, ejecuta el script de migración:

```sql
-- 1. Tabla de Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  student_level TEXT DEFAULT 'university',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Materias
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  color_theme TEXT DEFAULT 'blue',
  exam_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Temas Clasificados por Semáforo
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_date DATE NOT NULL,
  last_reviewed_date DATE NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('green', 'yellow', 'red')),
  times_reviewed INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Gamificación
CREATE TABLE gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp INT DEFAULT 0,
  volts INT DEFAULT 0,
  streak_days INT DEFAULT 1,
  shields_count INT DEFAULT 1,
  last_active_date DATE NOT NULL,
  is_streak_paused BOOLEAN DEFAULT FALSE
);
```

### Paso 2: Instalar cliente Postgres
```bash
npm install pg @types/pg
```

---

## ☁️ Despliegue Gratuito del Backend (Hosting 24/7)

Puedes desplegar la API REST de Node.js gratis en:
1. **Render.com (Web Service Gratuito):**
   - Conecta el repositorio de GitHub.
   - Build Command: `npm install && npm run build`
   - Start Command: `npx tsx server/index.ts`
   - Agrega las variables de entorno en la pestaña Environment.
2. **Railway.app / Fly.io:**
   - Detección automática de Node.js y despliegue en 1 minuto.

---

## 🔐 Seguridad y Migración de Datos Existentes
Para exportar tus materias y temas locales de `server/data/misemaforo.db` al servidor en la nube:
```bash
# Exportar base de datos SQLite local a archivo SQL
sqlite3 server/data/misemaforo.db .dump > backup_local.sql
```
