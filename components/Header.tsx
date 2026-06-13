'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from './AuthModal'

export function Header() {
  const { user, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <h1 className="font-semibold text-sm">Pueblos que sigues</h1>
              <span className="text-xs text-gray-500">▼</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{user.avatar_url}</span>
                  <div className="text-sm">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-800"
              >
                Regístrate
              </button>
            )}
            <button className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
              🔔
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
