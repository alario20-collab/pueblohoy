import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkPosts() {
  console.log('📋 Verificando posts en Supabase...\n')

  try {
    // Verificar usuarios
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    console.log('👥 Usuarios:', users?.length || 0)
    users?.forEach((u: any) => {
      console.log(`   - ${u.name} (${u.email})`)
    })

    // Verificar posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')

    console.log('\n📝 Posts:', posts?.length || 0)
    posts?.forEach((p: any) => {
      console.log(`   - ${p.title} (${p.category})`)
    })

    if (posts && posts.length > 0) {
      console.log('\n✅ Los datos están en Supabase correctamente')
    } else {
      console.log('\n❌ No hay posts en Supabase')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

checkPosts()
