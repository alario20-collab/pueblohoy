import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkUsers() {
  console.log('👥 Verificando usuarios en la tabla users...\n')

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log(`Total de usuarios: ${users?.length || 0}\n`)
    users?.forEach((u: any) => {
      console.log(`ID: ${u.id}`)
      console.log(`Email: ${u.email}`)
      console.log(`Nombre: ${u.name}`)
      console.log('---')
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUsers()
