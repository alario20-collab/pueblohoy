-- Asegurar que la tabla users está configurada para autenticación

-- 1. Verificar que users tiene id como uuid primary key
-- (La tabla ya debería existir de anteriores scripts)

-- 2. Habilitar RLS si no está habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para autenticación
-- Cualquiera puede ver usuarios
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
CREATE POLICY "Users are viewable by everyone" ON users
FOR SELECT USING (true);

-- Solo el usuario puede ver su propio email
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data" ON users
FOR SELECT USING (auth.uid() = id);

-- Solo el usuario puede actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Solo el usuario autenticado puede insertarse
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Tabla posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
CREATE POLICY "Posts are viewable by everyone" ON posts
FOR SELECT USING (true);

-- Solo el autor puede actualizar sus posts
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
CREATE POLICY "Users can update their own posts" ON posts
FOR UPDATE USING (auth.uid() = user_id);

-- Solo el autor puede eliminar sus posts
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
CREATE POLICY "Users can delete their own posts" ON posts
FOR DELETE USING (auth.uid() = user_id);

-- Solo usuarios autenticados pueden crear posts
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
CREATE POLICY "Authenticated users can create posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = user_id);
