import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupRLS() {
  console.log('🔒 Configurando Row Level Security (RLS)...\n')

  const sqlStatements = [
    'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE posts ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);`,
    `CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);`,
    `CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);`,
    `CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);`,
  ]

  try {
    for (const sql of sqlStatements) {
      const { error } = await supabase.rpc('execute_sql', { sql })

      if (error) {
        // Algunos errores son normales (si ya existen)
        if (error.message.includes('already exists')) {
          console.log('⚠️ Política ya existe (ignorado)')
        } else {
          console.log(`⚠️ ${error.message}`)
        }
      } else {
        console.log('✅ RLS configurado')
      }
    }

    console.log('\n✅ Seguridad (RLS) configurada!')
  } catch (error) {
    console.error('Error:', error)
    console.log('\n💡 Tip: Las políticas RLS pueden crearse manualmente en Supabase UI si es necesario')
  }
}

setupRLS()
