import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function addMissingUser() {
  console.log('🔍 Buscando usuarios de auth sin perfil...\n')

  try {
    // Obtener todos los usuarios de auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error obteniendo usuarios de auth:', authError)
      return
    }

    // Obtener usuarios de la tabla users
    const { data: tableUsers, error: tableError } = await supabase
      .from('users')
      .select('id')

    if (tableError) {
      console.error('Error obteniendo usuarios de tabla:', tableError)
      return
    }

    const tableUserIds = new Set(tableUsers?.map(u => u.id) || [])

    // Encontrar usuarios de auth que no están en la tabla
    const missingUsers = authUsers?.users.filter(u => !tableUserIds.has(u.id)) || []

    console.log(`📋 Usuarios de auth: ${authUsers?.users.length || 0}`)
    console.log(`📋 Usuarios en tabla: ${tableUsers?.length || 0}`)
    console.log(`❌ Usuarios faltantes: ${missingUsers.length}\n`)

    if (missingUsers.length === 0) {
      console.log('✅ Todos los usuarios de auth tienen perfil')
      return
    }

    // Agregar usuarios faltantes a la tabla
    for (const authUser of missingUsers) {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email: authUser.email || 'unknown@example.com',
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
            avatar_url: '👤',
          },
        ])

      if (error) {
        console.error(`❌ Error insertando ${authUser.email}:`, error.message)
      } else {
        console.log(`✅ Insertado: ${authUser.email} (${authUser.id})`)
      }
    }

    console.log('\n✅ Usuarios completados')
  } catch (error) {
    console.error('Error:', error)
  }
}

addMissingUser()
