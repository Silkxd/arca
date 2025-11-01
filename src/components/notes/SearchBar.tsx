import React, { useState, useEffect } from 'react';
import { Search, X, Menu, Plus } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onMobileMenuToggle?: () => void;
  showMobileMenu?: boolean;
  placeholder?: string;
  className?: string;
  onAddNote?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onMobileMenuToggle,
  showMobileMenu = false,
  placeholder = "Buscar notas...",
  className = "",
  onAddNote,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  // Sincronizar com prop externa
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearchChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between space-x-3">
        {/* Left side: Mobile Menu + Search */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Mobile Menu Button */}
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="
                lg:hidden flex items-center justify-center w-10 h-10 
                rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              "
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {/* Search Input Container */}
          <div className="relative flex-1">
            <div className={`
              relative flex items-center bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200
              ${isFocused 
                ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-900/30 shadow-md dark:shadow-lg' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}>
              {/* Search Icon */}
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Search 
                  size={20} 
                  className={`transition-colors ${
                    isFocused ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                  }`} 
                />
              </div>

              {/* Input Field */}
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="
                  w-full pl-12 pr-12 py-3 bg-transparent border-none outline-none
                  text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm 
                  focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-200
                "
              />

              {/* Clear Button */}
              {localSearchTerm && (
                <button
                  onClick={handleClear}
                  className="
                    absolute right-4 flex items-center justify-center w-6 h-6
                    rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                  "
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Suggestions/Results Count */}
            {localSearchTerm && isFocused && (
              <div className="
                absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
                rounded-lg shadow-lg dark:shadow-xl z-10 p-3
              ">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Buscando por: <span className="font-medium text-gray-900 dark:text-gray-100">"{localSearchTerm}"</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Add Note Button */}
        {onAddNote && (
          <div className="flex-shrink-0">
            <button
              onClick={onAddNote}
              className="
                flex items-center justify-center gap-2 px-4 py-2 h-10
                bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-700
                text-white rounded-lg transition-colors font-medium text-sm
              "
              title="Adicionar nova nota"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Nota</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Stats */}
      {localSearchTerm && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Pressione ESC para limpar a busca</span>
        </div>
      )}
    </div>
  );
};