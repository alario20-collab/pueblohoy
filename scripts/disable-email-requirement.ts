import { Client } from 'pg'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
}

// Extract project ref from URL (e.g., "dugbooydjbdmqkuzmuyp" from "https://dugbooydjbdmqkuzmuyp.supabase.co")
const projectRef = new URL(supabaseUrl).hostname.split('.')[0]

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: supabaseServiceKey,
})

async function disableEmailRequirement() {
  console.log('🔧 Intentando desactivar requerimiento de email confirmation...\n')

  try {
    await client.connect()
    console.log('✅ Conectado a PostgreSQL')

    // Consultar la configuración actual
    const result = await client.query(`
      SELECT * FROM auth.config
      WHERE key = 'mailer_autoconfirm_enabled'
    `)

    console.log('Current config:', result.rows)

    // Intentar actualizar la configuración
    const updateResult = await client.query(`
      UPDATE auth.config
      SET value = 'true'
      WHERE key = 'mailer_autoconfirm_enabled'
    `)

    console.log('✅ Configuración actualizada')

    await client.end()
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Probablemente necesitas la contraseña de postgres de Supabase')
    console.log('   Ve a: Supabase → Settings → Database → Reveal password')
  }
}

disableEmailRequirement()
