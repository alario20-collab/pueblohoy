import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupDatabase() {
  console.log('🚀 Configurando base de datos...\n')

  try {
    // 1. Crear usuario de demo
    console.log('1️⃣ Creando usuarios de demo...')
    const users = [
      { email: 'carmen@pueblohoy.com', name: 'M. Carmen', avatar_url: '👩' },
      { email: 'eva@pueblohoy.com', name: 'Eva Mas', avatar_url: '👱‍♀️' },
      { email: 'juan@pueblohoy.com', name: 'Juan García', avatar_url: '👨' },
      { email: 'cultura@pueblohoy.com', name: 'Asociación Cultural', avatar_url: '🎭' },
      { email: 'mercado@pueblohoy.com', name: 'Mercado Local', avatar_url: '🛍️' },
    ]

    const createdUsers = []
    for (const user of users) {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()

      if (error) {
        console.log(`⚠️ Usuario ${user.name} ya existe`)
      } else {
        createdUsers.push(data?.[0])
        console.log(`✅ Usuario creado: ${user.name}`)
      }
    }

    // 2. Crear posts de demo
    console.log('\n2️⃣ Creando posts de demo...')

    const posts = [
      {
        user_id: createdUsers[0]?.id,
        title: 'Busco vivienda para la primera quincena de agosto',
        description: 'Busco casa para alquilar la última semana de julio y las dos primeras de agosto',
        category: 'housing',
        location: 'El Casar',
      },
      {
        user_id: createdUsers[1]?.id,
        title: 'El yoga bailado',
        description: 'Primera clase gratis con Eva Mas. Clases de yoga combinadas con danza y movimiento',
        category: 'announcements',
        location: 'Guadalajara',
      },
      {
        user_id: createdUsers[2]?.id,
        title: 'Se busca ayudante de albañil',
        description: 'Buscamos persona con experiencia en construcción. Incorporación inmediata.',
        category: 'jobs',
        location: 'El Casar',
      },
      {
        user_id: createdUsers[3]?.id,
        title: 'Concierto de música folk - 15 de junio',
        description: 'La Cabra de Oro presenta su nuevo álbum. Entrada: 12€. Entrada gratuita para menores.',
        category: 'events',
        location: 'Guadalajara',
      },
      {
        user_id: createdUsers[4]?.id,
        title: 'Mercadillo de artesanía - 14 de junio',
        description: 'Artesanos locales vendiendo cerámica, textiles, joyería y más. De 10 a 14h en la plaza.',
        category: 'market',
        location: 'El Casar',
      },
    ]

    for (const post of posts) {
      if (post.user_id) {
        const { error } = await supabase
          .from('posts')
          .insert([post])

        if (error) {
          console.log(`⚠️ Error creando post: ${error.message}`)
        } else {
          console.log(`✅ Post creado: ${post.title}`)
        }
      }
    }

    console.log('\n✅ Base de datos configurada correctamente!')
    console.log('\n📋 Resumen:')
    console.log(`   - ${createdUsers.length} usuarios creados`)
    console.log(`   - ${posts.length} posts de demo creados`)
    console.log('\n🔒 IMPORTANTE: Rota la service_role key en Supabase')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

setupDatabase()
