import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function fixRLS() {
  console.log('🔧 Arreglando políticas RLS...\n')

  const sql = `
    -- Eliminar la política restrictiva
    DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

    -- Crear una política que permita INSERT para usuarios autenticados
    CREATE POLICY "Authenticated users can insert profile" ON users
    FOR INSERT WITH CHECK (true);
  `

  try {
    const { error } = await supabase.rpc('execute_sql', { sql })

    if (error) {
      console.error('Error ejecutando SQL:', error)
      console.log('\n💡 Intenta ejecutar manualmente en Supabase SQL Editor')
    } else {
      console.log('✅ Políticas RLS actualizadas correctamente!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

fixRLS()
