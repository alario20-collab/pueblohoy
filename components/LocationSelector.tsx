'use client'

import { useState, useEffect } from 'react'

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void
  onSaveFilter?: (location: LocationData) => void
}

export interface LocationData {
  type: 'current' | 'town'
  name: string
  coordinates?: { lat: number; lng: number }
  radius: number
  useRadius: boolean
}

export function LocationSelector({ onLocationChange, onSaveFilter }: LocationSelectorProps) {
  const [location, setLocation] = useState<LocationData>({
    type: 'current',
    name: 'Mi ubicación',
    radius: 50,
    useRadius: false,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ name: string; type: string }>>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (searchInput.trim().length > 2) {
      searchTowns(searchInput)
    } else {
      setSuggestions([])
    }
  }, [searchInput])

  const searchTowns = async (query: string) => {
    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Spain&format=json&limit=10&addresstype=village,town,city`
      )
      const data = await response.json()
      setSuggestions(
        data.map((item: any) => ({
          name: item.name,
          type: 'town',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }))
      )
    } catch (error) {
      console.error('Error searching towns:', error)
      setSuggestions([])
    } finally {
      setSearching(false)
    }
  }

  const handleSelectLocation = (name: string, type: 'current' | 'town', coords?: { lat: number; lng: number }) => {
    const newLocation: LocationData = {
      type,
      name: type === 'current' ? 'Mi ubicación' : name,
      radius: location.radius,
      useRadius: location.useRadius,
      coordinates: coords,
    }
    setLocation(newLocation)
    onLocationChange(newLocation)
    setIsOpen(false)
    setSearchInput('')
  }

  const handleRadiusToggle = (enabled: boolean) => {
    const updatedLocation = { ...location, useRadius: enabled }
    setLocation(updatedLocation)
    onLocationChange(updatedLocation)
  }

  const handleRadiusChange = (newRadius: number) => {
    const updatedLocation = { ...location, radius: newRadius }
    setLocation(updatedLocation)
    onLocationChange(updatedLocation)
  }

  const displayText = location.useRadius ? `${location.name} +${location.radius}km` : location.name

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded"
      >
        <span className="text-xl">📍</span>
        <div className="text-left">
          <h2 className="font-semibold text-sm">{displayText}</h2>
          <span className="text-xs text-gray-500">▼</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Buscar pueblo en España..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            {searching && <p className="text-xs text-gray-500 mt-2">Buscando...</p>}
          </div>

          <div className="max-h-64 overflow-y-auto">
            <button
              onClick={() => handleSelectLocation('Mi ubicación', 'current')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b ${
                location.type === 'current' && location.name === 'Mi ubicación' ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              📍 Mi ubicación
            </button>

            {searchInput.trim().length > 2 && suggestions.length === 0 && !searching && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No se encontraron resultados
              </div>
            )}

            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.name}-${suggestion.lat}`}
                onClick={() =>
                  handleSelectLocation(suggestion.name, 'town', {
                    lat: suggestion.lat,
                    lng: suggestion.lng,
                  })
                }
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b ${
                  location.name === suggestion.name ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                🏘️ {suggestion.name}
              </button>
            ))}
          </div>

          <div className="border-t p-4 space-y-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={location.useRadius}
                  onChange={(e) => handleRadiusToggle(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-semibold">Filtrar por radio</span>
              </label>

              {location.useRadius && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Radio: {location.radius}km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={location.radius}
                    onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5km</span>
                    <span>100km</span>
                  </div>
                </div>
              )}
            </div>

            {onSaveFilter && (
              <button
                onClick={() => {
                  onSaveFilter(location)
                  setIsOpen(false)
                }}
                className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-yellow-600"
              >
                ⭐ Guardar como favorito
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
