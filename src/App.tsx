import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useSettingsStore, initializeTheme } from './store/settingsStore'
import { Layout } from './components/layout/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Finance } from './pages/Finance'
import { Links } from './pages/Links'
import { Notes } from './pages/Notes'
import { Foco } from './pages/Foco'
import { Vault } from './pages/Vault'
import { Settings } from './pages/Settings'

import { FocoProvider } from './contexts/FocoContext'
import { OfflineBanner } from './components/ui/NetworkStatus';

function App() {
  const { user, loading, initialize } = useAuthStore()
  const { theme } = useSettingsStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    // Initialize theme on app start
    initializeTheme()
  }, [])

  useEffect(() => {
    // Apply theme when it changes
    const { setTheme } = useSettingsStore.getState()
    setTheme(theme)
  }, [theme])



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <FocoProvider>
      <Router>
        <OfflineBanner />
        <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/finance" 
          element={user ? <Layout><Finance /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/links" 
          element={user ? <Layout><Links /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/notes" 
          element={user ? <Layout><Notes /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/foco" 
          element={user ? <Layout><Foco /></Layout> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/vault" 
          element={user ? <Layout><Vault /></Layout> : <Navigate to="/login" replace />} 
        />

        <Route 
          path="/settings" 
          element={user ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />} 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        </Routes>
      </Router>
    </FocoProvider>
  )
}

export default App
