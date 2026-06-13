'use client'

interface ViewProps {
  activeView: string
  onViewChange: (view: string) => void
}

const views = [
  { id: 'today', label: 'Hoy', emoji: '📅' },
  { id: 'weekend', label: 'Este finde', emoji: '🎉' },
  { id: 'kids', label: 'Con niños', emoji: '👨‍👩‍👧‍👦' },
  { id: 'commerces', label: 'Comercios', emoji: '🏪' },
]

export function Categories({ activeView, onViewChange }: ViewProps) {
  return (
    <div className="bg-white sticky top-14 z-40 border-b border-gray-200">
      <div className="flex justify-around items-center px-4 py-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex-1 py-3 px-2 text-sm font-medium transition flex flex-col items-center gap-1 ${
              activeView === view.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-xl">{view.emoji}</span>
            <span className="hidden sm:inline text-xs">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
