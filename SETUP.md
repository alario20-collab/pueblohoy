# PuebloHoy - Setup Guide

## 1. Crear Tablas en Supabase

Ve a [Supabase Dashboard](https://app.supabase.com) → Tu proyecto → SQL Editor

Copia y pega esto para crear las tablas:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX posts_category_idx ON posts(category);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX posts_user_id_idx ON posts(user_id);
```

## 2. Ejecutar la app

```bash
cd pueblohoy
npm run dev
```

Abre http://localhost:3000

## 3. Próximos pasos

- [ ] Autenticación (Supabase Auth)
- [ ] Crear posts (formulario)
- [ ] Subir imágenes
- [ ] IA para moderar posts
- [ ] Newsletter automática
- [ ] Notificaciones

## Variables de ambiente

Están en `.env.local` (ya configuradas):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy a Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

Ve a [Vercel](https://vercel.com) y conecta el repositorio.
