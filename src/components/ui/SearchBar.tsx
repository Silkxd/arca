import React, { useState, useEffect } from 'react'
import { Search, X, Menu, Plus } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onMobileMenuToggle?: () => void
  showMobileMenu?: boolean
  placeholder?: string
  className?: string
  onAddNote?: () => void
  actionLabel?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onMobileMenuToggle,
  showMobileMenu = false,
  placeholder = 'Buscar...',
  className = '',
  onAddNote,
  actionLabel = 'Nova Nota',
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearchTerm, onSearchChange])

  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const handleClear = () => {
    setLocalSearchTerm('')
    onSearchChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3 flex-1">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={22} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}

          <div className="relative flex-1">
            <div
              className={`relative flex items-center bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 ${
                isFocused
                  ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-900/30 shadow-md dark:shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Search
                  size={20}
                  className={`transition-colors ${
                    isFocused ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </div>

              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 sm:py-3.5 bg-transparent border-none outline-none min-h-[44px] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
              />

              {localSearchTerm && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {onAddNote && (
          <div className="flex-shrink-0">
            <button
              onClick={onAddNote}
              className="flex items-center justify-center gap-2 px-4 py-2 h-11 min-h-[44px] bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
              title={actionLabel}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">{actionLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
