import React from 'react'
import { FileText, Search } from 'lucide-react'
import { VaultItem } from '../../types'
import { VaultItemCard } from './VaultItemCard'

interface VaultGridProps {
  items: VaultItem[]
  onDeleteItem: (id: string, title: string) => void
  isLoading?: boolean
  searchTerm?: string
  selectedSegmentName?: string
}

export const VaultGrid: React.FC<VaultGridProps> = ({
  items,
  onDeleteItem,
  isLoading = false,
  searchTerm = '',
  selectedSegmentName,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-28 animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <FileText size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {selectedSegmentName ? `Nenhum item em "${selectedSegmentName}"` : 'Nenhum item no cofre'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          {selectedSegmentName
            ? 'Este segmento ainda não possui itens. Adicione seu primeiro item para começar.'
            : 'Adicione seu primeiro documento ou texto ao cofre.'}
        </p>
      </div>
    )
  }

  if (items.length === 0 && searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <Search size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Nenhum resultado encontrado</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Não encontramos itens que correspondam a "{searchTerm}".
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {selectedSegmentName || 'Todos os itens'}
          </h2>
          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-medium">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {items.map((item) => (
          <VaultItemCard key={item.id} item={item} onDelete={onDeleteItem} />
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex items-center justify-center pt-8 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {searchTerm
              ? `${items.length} resultado${items.length !== 1 ? 's' : ''} para "${searchTerm}"`
              : `Exibindo ${items.length} item${items.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}
    </div>
  )
}

export default VaultGrid
