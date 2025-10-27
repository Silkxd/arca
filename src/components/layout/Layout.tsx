import React from 'react'
import { useLocation } from 'react-router-dom'
import { CompactNavigation } from './CompactNavigation'
import { FocoNavigation } from './FocoNavigation'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isFocoPage = location.pathname === '/foco'
  
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        {children}
      </main>
      {isFocoPage ? <FocoNavigation /> : <CompactNavigation />}
    </div>
  )
}