'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface User {
  id: string
  email: string
  user_metadata?: { name?: string }
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      setUsers(authUsers?.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      await supabase.auth.admin.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      alert('Usuario eliminado')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario')
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-8">Cargando usuarios...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Usuarios</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Nombre</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Fecha de Registro</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    {user.user_metadata?.name || '-'}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Total de Usuarios</h3>
        <p className="text-3xl font-bold text-blue-600">{filteredUsers.length}</p>
      </div>
    </div>
  )
}
