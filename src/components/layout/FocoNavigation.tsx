import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, DollarSign, Link2, FileText, Shield, Target, Settings, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    icon: Home,
    path: '/dashboard'
  },

  {
    id: 'finance',
    icon: DollarSign,
    path: '/finance'
  },
  {
    id: 'links',
    icon: Link2,
    path: '/links'
  },
  {
      id: 'notes',
      icon: FileText,
      path: '/notes'
    },
    {
      id: 'vault',
      icon: Shield,
      path: '/vault'
    },
    {
      id: 'foco',
      icon: Target,
      path: '/foco'
    },
  {
    id: 'settings',
    icon: Settings,
    path: '/settings'
  }
]

export const FocoNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMinimized, setIsMinimized] = useState(false)

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMinimized}
          className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 animate-pulse"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 transform translate-y-0">
      <div className="flex items-center justify-between px-2 py-2">
        {/* Navigation Items */}
        <div className="flex items-center justify-around flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'flex items-center justify-center p-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
        
        {/* Minimize Button */}
        <button
          onClick={toggleMinimized}
          className="ml-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}