'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) return <div className="p-8">Cargando...</div>

  if (pathname === '/admin/login') return children

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">PuebloHoy Admin</h1>
          <p className="text-gray-400 text-sm mt-2">Panel de administración</p>
        </div>

        <nav className="space-y-4">
          <Link href="/admin" className={`block px-4 py-2 rounded ${pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            📊 Dashboard
          </Link>
          <Link href="/admin/posts" className={`block px-4 py-2 rounded ${pathname === '/admin/posts' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            📝 Posts/Eventos
          </Link>
          <Link href="/admin/users" className={`block px-4 py-2 rounded ${pathname === '/admin/users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            👥 Usuarios
          </Link>
          <Link href="/admin/export" className={`block px-4 py-2 rounded ${pathname === '/admin/export' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            📥 Exportar Datos
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
