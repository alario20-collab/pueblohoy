'use client'

import { useState, useEffect } from 'react'

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void
}

export interface LocationData {
  type: 'current' | 'town'
  name: string
  coordinates?: { lat: number; lng: number }
  radius: number
}

export function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [location, setLocation] = useState<LocationData>({
    type: 'current',
    name: 'Mi ubicación',
    radius: 50,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ name: string; type: string }>>([])

  const TOWNS = [
    'El Casar',
    'Guadalajara',
    'Azuqueca',
    'Alovera',
    'Taracena',
    'Yunquera de Henares',
    'Horche',
    'Torrejón del Rey',
    'Chiloeches',
    'Arganda del Rey',
  ]

  useEffect(() => {
    if (searchInput.trim()) {
      const filtered = TOWNS.filter(town =>
        town.toLowerCase().includes(searchInput.toLowerCase())
      )
      setSuggestions(filtered.map(name => ({ name, type: 'town' })))
    } else {
      setSuggestions([
        { name: 'Mi ubicación', type: 'current' },
        ...TOWNS.map(name => ({ name, type: 'town' }))
      ])
    }
  }, [searchInput])

  const handleSelectLocation = (name: string, type: 'current' | 'town') => {
    const newLocation: LocationData = {
      type,
      name: type === 'current' ? 'Mi ubicación' : name,
      radius: location.radius,
    }
    setLocation(newLocation)
    onLocationChange(newLocation)
    setIsOpen(false)
    setSearchInput('')
  }

  const handleRadiusChange = (newRadius: number) => {
    const updatedLocation = { ...location, radius: newRadius }
    setLocation(updatedLocation)
    onLocationChange(updatedLocation)
  }

  const displayText = `${location.name} +${location.radius}km`

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
              placeholder="Buscar pueblo..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.name}
                onClick={() => handleSelectLocation(suggestion.name, suggestion.type as any)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                  location.name === suggestion.name ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {suggestion.type === 'current' ? '📍' : '🏘️'} {suggestion.name}
              </button>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Radio: {location.radius}km</label>
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
        </div>
      )}
    </div>
  )
}
