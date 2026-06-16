'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminExportPage() {
  const [loading, setLoading] = useState(false)

  const exportToCSV = async (table: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from(table).select('*')

      if (error) throw error

      const csv = convertToCSV(data || [])
      downloadCSV(csv, `${table}-${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Error al exportar datos')
    } finally {
      setLoading(false)
    }
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0])
    const rows = data.map(row =>
      headers.map(header => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`
        return value
      }).join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Exportar Datos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Posts/Eventos</h2>
          <p className="text-gray-600 text-sm mb-4">
            Exporta todos los posts y eventos a un archivo CSV
          </p>
          <button
            onClick={() => exportToCSV('posts')}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Exportando...' : '⬇️ Descargar Posts'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Usuarios</h2>
          <p className="text-gray-600 text-sm mb-4">
            Exporta todos los usuarios registrados a un archivo CSV
          </p>
          <button
            onClick={() => exportToCSV('users')}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Exportando...' : '⬇️ Descargar Usuarios'}
          </button>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">ℹ️ Información</h3>
        <ul className="text-yellow-800 text-sm space-y-2">
          <li>• Los datos se exportan en formato CSV</li>
          <li>• Puedes abrirlos con Excel o Google Sheets</li>
          <li>• Incluye todos los campos disponibles</li>
          <li>• Se descarga automáticamente en tu computadora</li>
        </ul>
      </div>
    </div>
  )
}
