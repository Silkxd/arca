import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, DollarSign, Link2, FileText, Shield, Target, Settings } from 'lucide-react';
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

export const CompactNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'flex items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px]',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-6 h-6" />
            </button>
          )
        })}
      </div>
    </div>
  )
}