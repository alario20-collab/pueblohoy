import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function disableEmailConfirmation() {
  console.log('🔧 Desactivando confirmación de email...\n')

  try {
    // Obtener todos los usuarios
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('Error obteniendo usuarios:', usersError)
      return
    }

    console.log(`📋 Encontrados ${users?.users.length || 0} usuarios\n`)

    // Marcar todos los usuarios como email confirmado
    if (users?.users) {
      for (const user of users.users) {
        const { error } = await supabase.auth.admin.updateUserById(user.id, {
          email_confirm: true,
        })

        if (error) {
          console.error(`❌ Error confirmando email para ${user.email}:`, error.message)
        } else {
          console.log(`✅ Email confirmado para: ${user.email}`)
        }
      }
    }

    console.log('\n✅ Todos los usuarios marcados como confirmados')
    console.log('\n💡 Nota: Los nuevos usuarios que se registren también necesitarán estar confirmados.')
    console.log('   Para desactivar confirmación requerida, ve a:')
    console.log('   Supabase → Authentication → Providers → Email → "Require email confirmation"')

  } catch (error) {
    console.error('Error:', error)
  }
}

disableEmailConfirmation()
