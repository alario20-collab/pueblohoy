'use client'

import { useState, useEffect, useRef } from 'react'
import { EventFilters } from './FilterPanel'
import { LocationData } from './LocationSelector'

export interface SavedFilter {
  id: string
  name: string
  filters: EventFilters
  location: LocationData
  createdAt: string
}

interface SavedFiltersProps {
  onLoadFilter: (location: LocationData, filters: EventFilters) => void
  currentFilters: EventFilters
  currentLocation: LocationData
  pendingLocationToSave?: LocationData | null
}

export function SavedFilters({ onLoadFilter, currentFilters, currentLocation, pendingLocationToSave }: SavedFiltersProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('savedFilters')
    if (stored) {
      try {
        setSavedFilters(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading saved filters:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (pendingLocationToSave) {
      setIsCreating(true)
      setIsOpen(true)
      setFilterName('')
    }
  }, [pendingLocationToSave])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const saveFilters = () => {
    if (!filterName.trim()) return

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: currentFilters,
      location: pendingLocationToSave || currentLocation,
      createdAt: new Date().toISOString(),
    }

    const updated = [...savedFilters, newFilter]
    setSavedFilters(updated)
    localStorage.setItem('savedFilters', JSON.stringify(updated))
    setFilterName('')
    setIsCreating(false)
  }

  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter(f => f.id !== id)
    setSavedFilters(updated)
    localStorage.setItem('savedFilters', JSON.stringify(updated))
  }

  const updateFilterName = (id: string, newName: string) => {
    const updated = savedFilters.map(f =>
      f.id === id ? { ...f, name: newName } : f
    )
    setSavedFilters(updated)
    localStorage.setItem('savedFilters', JSON.stringify(updated))
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded text-sm text-gray-600"
        title="Tus filtros guardados"
      >
        <span>⭐ Mis filtros ({savedFilters.length})</span>
      </button>

      {isOpen && (
        <div className="fixed left-4 top-20 bottom-24 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 w-72 max-h-[calc(100vh-150px)] overflow-y-auto z-40 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="font-semibold text-gray-900">Mis filtros</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Botón guardar filtro actual */}
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 mb-4"
            >
              + Guardar filtro actual
            </button>
          )}

          {/* Crear nuevo filtro */}
          {isCreating && (
            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Nombre del filtro..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveFilters}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setFilterName('')
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de filtros guardados */}
          {savedFilters.length > 0 ? (
            <div className="space-y-2">
              {savedFilters.map((filter) => (
                <div key={filter.id} className="p-3 bg-gray-50 rounded-lg">
                  {editingId === filter.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => updateFilterName(filter.id, editingName)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => {
                          onLoadFilter(filter.location, filter.filters)
                          setIsOpen(false)
                        }}
                        className="flex-1 text-left font-medium text-sm text-blue-600 hover:text-blue-700"
                      >
                        {filter.name}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(filter.id)
                          setEditingName(filter.name)
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mb-2">
                    📍 {filter.location.name}
                    {filter.location.useRadius && ` +${filter.location.radius}km`}
                  </p>
                  <button
                    onClick={() => deleteFilter(filter.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !isCreating && (
              <div className="text-center text-gray-500 text-sm">
                No hay filtros guardados aún
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
