-- Habilitar RLS en tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla USERS
-- Cualquiera puede ver usuarios (público)
CREATE POLICY "Users are viewable by everyone" ON users
FOR SELECT USING (true);

-- Solo el usuario puede actualizar su propio perfil
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Políticas para tabla POSTS
-- Cualquiera puede ver posts (público)
CREATE POLICY "Posts are viewable by everyone" ON posts
FOR SELECT USING (true);

-- Solo el autor puede actualizar su post
CREATE POLICY "Users can update their own posts" ON posts
FOR UPDATE USING (auth.uid() = user_id);

-- Solo el autor puede eliminar su post
CREATE POLICY "Users can delete their own posts" ON posts
FOR DELETE USING (auth.uid() = user_id);

-- Cualquiera autenticado puede crear posts
CREATE POLICY "Authenticated users can create posts" ON posts
FOR INSERT WITH CHECK (auth.uid() = user_id);
