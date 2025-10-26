import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, DollarSign, Link2, FileText, Shield, Target, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Início',
    icon: Home,
    path: '/dashboard'
  },

  {
    id: 'finance',
    label: 'Finanças',
    icon: DollarSign,
    path: '/finance'
  },
  {
    id: 'links',
    label: 'Links',
    icon: Link2,
    path: '/links'
  },
  {
      id: 'notes',
      label: 'Notas',
      icon: FileText,
      path: '/notes'
    },
    {
      id: 'vault',
      label: 'Cofre',
      icon: Shield,
      path: '/vault'
    },
    {
      id: 'foco',
      label: 'Foco',
      icon: Target,
      path: '/foco'
    },
  {
    id: 'settings',
    label: 'Config',
    icon: Settings,
    path: '/settings'
  }
]

export const BottomNavigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isFocoPage = location.pathname === '/foco'

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  // Ocultar a barra de navegação na tela de início/dashboard
  if (location.pathname === '/dashboard') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className={cn(
        "flex items-center justify-around px-2",
        isFocoPage ? "py-1 min-h-[30px]" : "py-2"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                'flex items-center justify-center transition-all duration-200',
                isFocoPage 
                  ? 'p-1.5 rounded-lg' 
                  : 'flex-col p-2 rounded-xl min-w-[60px]',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className={cn(
                isFocoPage ? "w-4 h-4" : "w-5 h-5 mb-1"
              )} />
              {!isFocoPage && (
                <span className="text-xs font-medium">{item.label}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}