'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Categories } from '@/components/Categories'
import { PostCard } from '@/components/PostCard'
import { CreatePostModal } from '@/components/CreatePostModal'
import { FilterPanel, type EventFilters } from '@/components/FilterPanel'
import { LocationSelector, type LocationData } from '@/components/LocationSelector'
import { useAuth } from '@/lib/auth-context'
import { supabase, type Post } from '@/lib/supabase'

const DEMO_POSTS: Post[] = [
  {
    id: '1',
    user_id: 'user2',
    title: 'Concierto de música folk - 15 de junio',
    description: 'La Cabra de Oro presenta su nuevo álbum. Entrada: 12€. Entrada gratuita para menores. Sábado 21:00 en la Plaza Mayor.',
    category: 'events',
    location: 'El Casar',
    image_url: null,
    created_at: '1 semana',
    user_name: 'Asociación Cultural',
    user_avatar: '🎭',
  },
  {
    id: '2',
    user_id: 'user4',
    title: 'Feria de artesanía - Este finde',
    description: 'Más de 30 artesanos vendiendo cerámica, textiles, joyería hecha a mano. Sábado y domingo de 10 a 20h en el Parque Central.',
    category: 'events',
    location: 'El Casar',
    image_url: null,
    created_at: 'hace 3 días',
    user_name: 'Ayuntamiento El Casar',
    user_avatar: '🏛️',
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'Yoga para niños - Sábados',
    description: 'Clase familiar para introducir a los niños en yoga y relajación. 16:30h en el Centro Cívico. Primera clase gratis!',
    category: 'events',
    location: 'El Casar',
    image_url: null,
    created_at: '5 días',
    user_name: 'Eva Mas',
    user_avatar: '🧘‍♀️',
  },
  {
    id: '4',
    user_id: 'user1',
    title: 'Bar La Taberna - Menú del día',
    description: 'Primer plato, segundo plato y bebida: 9€. Especialidad: carnes a la parrilla. De 13 a 16h.',
    category: 'commerces',
    location: 'El Casar',
    image_url: null,
    created_at: 'hoy',
    user_name: 'Bar La Taberna',
    user_avatar: '🍽️',
  },
  {
    id: '5',
    user_id: 'user5',
    title: 'Tienda local - Descuento ropa verano',
    description: '20% descuento en toda la colección de verano. Válido hasta el domingo. ¡Ropa cómoda y fresca para la estación!',
    category: 'commerces',
    location: 'El Casar',
    image_url: null,
    created_at: '2 días',
    user_name: 'Tienda del Centro',
    user_avatar: '👕',
  },
]

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS)
  const [activeView, setActiveView] = useState('events')
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [location, setLocation] = useState<LocationData>({
    type: 'current',
    name: 'Mi ubicación',
    radius: 50,
    useRadius: false,
  })
  const [pendingLocationToSave, setPendingLocationToSave] = useState<LocationData | null>(null)
  const [filters, setFilters] = useState<EventFilters>({
    types: [],
    sources: [],
    eventTypes: [],
    towns: [],
    radius: 15,
  })

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (postsError) throw postsError

      if (!postsData || postsData.length === 0) {
        setPosts(DEMO_POSTS)
        setLoading(false)
        return
      }

      const userIds = postsData.map(p => p.user_id)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .in('id', userIds)

      if (usersError) throw usersError

      const userMap = new Map()
      usersData?.forEach((u: any) => {
        userMap.set(u.id, u)
      })

      const formattedPosts = postsData.map((post: any) => {
        const user = userMap.get(post.user_id)
        return {
          ...post,
          user_name: user?.name || 'Usuario desconocido',
          user_avatar: user?.avatar_url || '👤',
        }
      })

      console.log('✅ Posts cargados:', formattedPosts.length)
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error loading posts:', error)
      setPosts(DEMO_POSTS)
    } finally {
      setLoading(false)
    }
  }

  function filterPostsByView(posts: Post[]): Post[] {
    const events = posts.filter(p => p.category === 'events')
    const commerces = posts.filter(p => p.category === 'commerces')

    switch (activeView) {
      case 'events':
        return events
      case 'commerces':
        return commerces
      default:
        return []
    }
  }

  const viewLabels: Record<string, string> = {
    events: 'Eventos',
    commerces: 'Comercios',
  }

  const filteredPosts = filterPostsByView(posts)

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation)
  }

  const handleLoadSavedFilter = (newLocation: LocationData, newFilters: EventFilters) => {
    setLocation(newLocation)
    setFilters(newFilters)
  }

  const handleSaveFilter = (currentLocation: LocationData) => {
    setPendingLocationToSave(currentLocation)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLocationChange={handleLocationChange}
        onLoadSavedFilter={handleLoadSavedFilter}
        onSaveFilter={handleSaveFilter}
        currentFilters={filters}
        currentLocation={location}
        pendingLocationToSave={pendingLocationToSave}
      />
      <Categories activeView={activeView} onViewChange={setActiveView} />

      <div className="flex">
        <main className="flex-1 max-w-2xl mx-auto p-4 pb-24">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {viewLabels[activeView]}
        </h2>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            Cargando...
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay eventos en este momento. ¡Vuelve pronto!
          </div>
        )}

        <div className="space-y-4">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        </main>

        <FilterPanel activeView={activeView} onFiltersChange={setFilters} />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center px-4 py-3">
        <button className="text-2xl hover:text-blue-700 transition">🏠</button>
        <button className="text-2xl hover:text-blue-700 transition">❤️</button>
        <button
          onClick={() => user && setShowCreateModal(true)}
          disabled={!user}
          className="text-3xl hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={user ? 'Crear evento/comercio' : 'Inicia sesión para crear'}
        >
          ➕
        </button>
        <button className="text-2xl hover:text-blue-700 transition">💬</button>
        <button className="text-2xl hover:text-blue-700 transition">👤</button>
      </nav>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={loadPosts}
      />
    </div>
  )
}
