import React from 'react'
import { ChevronLeft, ChevronRight, FileText, Shield, Menu, X, Folder } from 'lucide-react'
import { useVaultStore } from '../../store/vaultStore'

interface VaultSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  selectedSegment: string
  onSelectSegment: (segment: string) => void
  isMobileOpen: boolean
  onMobileToggle: () => void
}

export const VaultSidebar: React.FC<VaultSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  selectedSegment,
  onSelectSegment,
  isMobileOpen,
  onMobileToggle,
}) => {
  const { items } = useVaultStore()
  const categories = Array.from(new Set((items || []).map(i => i.category).filter(Boolean))) as string[]

  const sidebarClasses = `fixed lg:relative top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-16' : 'w-72'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
  const overlayClasses = `fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isMobileOpen ? 'block' : 'hidden'}`

  const itemBase = 'w-full flex items-center px-4 py-3 text-left transition-colors'
  const itemActive = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
  const itemInactive = 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'

  return (
    <>
      <div className={overlayClasses} onClick={onMobileToggle} />

      <div className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))] border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cofre</h2>
          )}
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors min-w-[44px] min-h-[44px]"
          >
            <X size={22} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <button
            onClick={() => onSelectSegment('all')}
            className={`${itemBase} ${selectedSegment === 'all' ? itemActive : itemInactive}`}
          >
            <Shield size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Todos os itens</span>}
          </button>

          <button
            onClick={() => onSelectSegment('document')}
            className={`${itemBase} ${selectedSegment === 'document' ? itemActive : itemInactive}`}
          >
            <FileText size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Documentos</span>}
          </button>

          <button
            onClick={() => onSelectSegment('text')}
            className={`${itemBase} ${selectedSegment === 'text' ? itemActive : itemInactive}`}
          >
            <FileText size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Textos</span>}
          </button>

          {!isCollapsed && <div className="mx-4 my-4 border-t border-gray-200 dark:border-gray-700" />}

          {!isCollapsed && (
            <div className="px-4 mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Categorias</h3>
            </div>
          )}

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectSegment(category)}
              className={`${itemBase} ${selectedSegment === category ? itemActive : itemInactive}`}
              title={category}
            >
              <Folder size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium truncate">{category}</span>}
            </button>
          ))}

          {categories.length === 0 && !isCollapsed && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <Folder size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma categoria</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default VaultSidebar
