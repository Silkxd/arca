import React, { useState, useEffect, useMemo } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { VaultItemForm } from '../components/vault/VaultItemForm';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { VaultItem } from '../types';
import { VaultSidebar } from '../components/vault/VaultSidebar';
import { VaultGrid } from '../components/vault/VaultGrid';
import { SearchBar } from '../components/ui/SearchBar';

export const Vault: React.FC = () => {
  const { 
    items, 
    loading, 
    error, 
    fetchItems, 
    deleteItem 
  } = useVaultStore();
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: '',
    itemTitle: ''
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSegment =
        selectedSegment === 'all' ||
        (selectedSegment === 'document' && item.type === 'document') ||
        (selectedSegment === 'text' && item.type === 'text') ||
        item.category === selectedSegment;
      return matchesSearch && matchesSegment;
    });
  }, [items, searchTerm, selectedSegment]);

  const selectedSegmentName = useMemo(() => {
    if (selectedSegment === 'all') return 'Todos os itens';
    if (selectedSegment === 'document') return 'Documentos';
    if (selectedSegment === 'text') return 'Textos';
    return selectedSegment;
  }, [selectedSegment]);

  const handleDeleteItem = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemTitle: title
    });
  };

  const confirmDeleteItem = async () => {
    await deleteItem(deleteModal.itemId);
    setDeleteModal({
      isOpen: false,
      itemId: '',
      itemTitle: ''
    });
  };

  

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <VaultSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        selectedSegment={selectedSegment}
        onSelectSegment={setSelectedSegment}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
            showMobileMenu={isMobileSidebarOpen}
            placeholder="Buscar itens..."
            className="max-w-2xl"
            onAddNote={() => setShowForm(true)}
            actionLabel="Adicionar Item"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <VaultGrid
            items={filteredItems}
            onDeleteItem={handleDeleteItem}
            isLoading={loading}
            searchTerm={searchTerm}
            selectedSegmentName={selectedSegmentName}
          />
        </div>
      </div>

      {showForm && (
        <VaultItemForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            fetchItems()
          }}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: '', itemTitle: '' })}
        onConfirm={confirmDeleteItem}
        title="Excluir Item do Cofre"
        message={`Tem certeza que deseja excluir "${deleteModal.itemTitle}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};
