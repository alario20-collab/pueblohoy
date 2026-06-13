'use client'

import { Post } from '@/lib/supabase'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header con usuario */}
      <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg flex-shrink-0">
            {post.user_avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900">{post.user_name}</p>
            <p className="text-xs text-gray-500">{post.created_at}</p>
          </div>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 whitespace-nowrap">
          {post.location}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {post.description}
        </p>
      </div>

      {/* Imagen */}
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl">
          {getCategoryEmoji(post.category)}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 p-4">
        <button className="flex-1 bg-green-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors">
          Contactar
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
          Más info
        </button>
      </div>
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    announcements: '📣',
    events: '📅',
    market: '🛍️',
    jobs: '💼',
    housing: '🏠',
    transport: '🚗',
  }
  return emojis[category] || '📌'
}
