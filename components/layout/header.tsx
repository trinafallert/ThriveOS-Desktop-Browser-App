'use client'

import { useState } from 'react'
import { Bell, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ProfilePanel } from '@/components/layout/profile-panel'
import { useAuth } from '@/lib/auth-context'
import { useUser } from '@/lib/user-context'
import { getGreeting } from '@/lib/utils'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const greeting = getGreeting()
  const { user: authUser } = useAuth()
  const { user: localUser } = useUser()
  const [panelOpen, setPanelOpen] = useState(false)

  const displayName = authUser?.user_metadata?.name || localUser.name || ''
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {title || `${greeting}${displayName ? `, ${displayName.split(' ')[0]}` : ''} 👋`}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors w-52">
            <Search className="w-4 h-4" />
            <span>Search anything...</span>
            <kbd className="ml-auto text-[10px] bg-white border border-gray-200 rounded px-1 py-0.5">⌘K</kbd>
          </button>

          {/* AI Button */}
          <Button variant="soft" size="sm" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI
          </Button>

          {/* Notifications */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-thrive-pink rounded-full" />
          </button>

          {/* Avatar — opens profile panel */}
          <button onClick={() => setPanelOpen(true)} className="focus:outline-none">
            <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-violet-400 hover:ring-offset-1 transition-all">
              <AvatarFallback className="text-xs bg-gradient-to-br from-violet-500 to-purple-700 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      <ProfilePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}
