'use client'

import { useState, useEffect, useRef } from 'react'

interface FilterPanelProps {
  activeView: string
  onFiltersChange: (filters: EventFilters) => void
  currentFilters?: EventFilters
}

export interface EventFilters {
  types: string[]
  sources: string[]
  eventTypes: string[]
  towns: string[]
  radius: number
}

const FILTER_OPTIONS = {
  types: [
    { id: 'weekend', label: 'Este finde', emoji: '🎉' },
    { id: 'kids', label: 'Con niños', emoji: '👨‍👩‍👧‍👦' },
    { id: 'free', label: 'Gratis', emoji: '💰' },
    { id: 'festive', label: 'Fiestas patronales', emoji: '🎊' },
  ],
  sources: [
    { id: 'ayuntamiento', label: 'Ayuntamiento' },
    { id: 'iglesia', label: 'Iglesia' },
    { id: 'asociacion', label: 'Asociación' },
    { id: 'privado', label: 'Privado' },
    { id: 'comercio', label: 'Comercio' },
  ],
  eventTypes: [
    { id: 'musica', label: 'Música' },
    { id: 'teatro', label: 'Teatro' },
    { id: 'deportes', label: 'Deportes' },
    { id: 'gastronomia', label: 'Gastronomía' },
    { id: 'infantil', label: 'Infantil' },
    { id: 'religioso', label: 'Religioso' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'toros', label: 'Toros' },
  ],
  towns: [
    { id: 'casar', label: 'El Casar' },
    { id: 'guadalajara', label: 'Guadalajara' },
    { id: 'azuqueca', label: 'Azuqueca' },
    { id: 'alovera', label: 'Alovera' },
    { id: 'taracena', label: 'Taracena' },
  ],
}

export function FilterPanel({ activeView, onFiltersChange, currentFilters }: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [types, setTypes] = useState<string[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [towns, setTowns] = useState<string[]>([])
  const [radius, setRadius] = useState(15)

  useEffect(() => {
    if (currentFilters) {
      setTypes(currentFilters.types || [])
      setSources(currentFilters.sources || [])
      setEventTypes(currentFilters.eventTypes || [])
      setTowns(currentFilters.towns || [])
      setRadius(currentFilters.radius || 15)
    }
  }, [currentFilters])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickOnButton = buttonRef.current?.contains(target)
      const isClickOnPanel = panelRef.current?.contains(target)

      if (!isClickOnButton && !isClickOnPanel) {
        setIsOpen(false)
      }
    }

    if (isOpen && activeView === 'events') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, activeView])

  const handleTypeToggle = (id: string) => {
    const newTypes = types.includes(id)
      ? types.filter(t => t !== id)
      : [...types, id]
    setTypes(newTypes)
    onFiltersChange({ types: newTypes, sources, eventTypes, towns, radius })
  }

  const handleSourceToggle = (id: string) => {
    const newSources = sources.includes(id)
      ? sources.filter(s => s !== id)
      : [...sources, id]
    setSources(newSources)
    onFiltersChange({ types, sources: newSources, eventTypes, towns, radius })
  }

  const handleEventTypeToggle = (id: string) => {
    const newEventTypes = eventTypes.includes(id)
      ? eventTypes.filter(e => e !== id)
      : [...eventTypes, id]
    setEventTypes(newEventTypes)
    onFiltersChange({ types, sources, eventTypes: newEventTypes, towns, radius })
  }

  const handleTownToggle = (id: string) => {
    const newTowns = towns.includes(id)
      ? towns.filter(t => t !== id)
      : [...towns, id]
    setTowns(newTowns)
    onFiltersChange({ types, sources, eventTypes, towns: newTowns, radius })
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius)
    onFiltersChange({ types, sources, eventTypes, towns, radius: newRadius })
  }

  const handleClearFilters = () => {
    setTypes([])
    setSources([])
    setEventTypes([])
    setTowns([])
    setRadius(15)
    onFiltersChange({ types: [], sources: [], eventTypes: [], towns: [], radius: 15 })
  }

  if (activeView !== 'events') {
    return null
  }

  return (
    <>
      {/* Botón flotante para abrir filtros */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-24 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
          title="Abrir filtros"
        >
          🔍
        </button>
      )}

      {/* Panel de filtros flotante */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed right-4 top-20 bottom-24 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 w-72 max-h-[calc(100vh-150px)] overflow-y-auto z-40 flex flex-col">
          {/* Header con botón X */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Contenido de filtros */}
          <div className="flex-1 overflow-y-auto">
      <div className="space-y-6">
        {/* Tipos rápidos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Filtros rápidos</h3>
          <div className="space-y-2">
            {FILTER_OPTIONS.types.map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={types.includes(type.id)}
                  onChange={() => handleTypeToggle(type.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{type.emoji} {type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuentes */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Fuente</h3>
          <div className="space-y-2">
            {FILTER_OPTIONS.sources.map((source) => (
              <label key={source.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sources.includes(source.id)}
                  onChange={() => handleSourceToggle(source.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{source.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tipo de evento */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Tipo de evento</h3>
          <div className="space-y-2">
            {FILTER_OPTIONS.eventTypes.map((eventType) => (
              <label key={eventType.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventTypes.includes(eventType.id)}
                  onChange={() => handleEventTypeToggle(eventType.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{eventType.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pueblos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Pueblos</h3>
          <div className="space-y-2">
            {FILTER_OPTIONS.towns.map((town) => (
              <label key={town.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={towns.includes(town.id)}
                  onChange={() => handleTownToggle(town.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{town.label}</span>
              </label>
            ))}
          </div>
        </div>


        {/* Limpiar filtros */}
        {(types.length > 0 || sources.length > 0 || eventTypes.length > 0 || towns.length > 0 || radius !== 15) && (
          <button
            onClick={handleClearFilters}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
          >
            Limpiar filtros
          </button>
        )}
          </div>
        </div>
      )}
    </>
  )
}
