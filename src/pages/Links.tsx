import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Link as LinkIcon, Folder, AlertCircle } from 'lucide-react';
import { useLinkStore } from '../store/linkStore';
import { LinkGroupCard } from '../components/links/LinkGroupCard';
import { LinkGroupForm } from '../components/links/LinkGroupForm';
import { LinkForm } from '../components/links/LinkForm';
import { Empty } from '../components/Empty';
import { Link, LinkGroup, LinkFormData, LinkGroupFormData } from '../types';
import { LoadingSpinner, LoadingCard } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorBoundary';

export const Links: React.FC = () => {
  const {
    links,
    linkGroups,
    loading,
    error,
    selectedGroup,
    setSelectedGroup,
    fetchLinkGroups,
    fetchLinks,
    addLinkGroup,
    updateLinkGroup,
    deleteLinkGroup,
    addLink,
    updateLink,
    deleteLink,
    getGroupStats,
    getLinksByGroup
  } = useLinkStore();

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LinkGroup | undefined>();
  const [editingLink, setEditingLink] = useState<Link | undefined>();
  const [selectedGroupForLink, setSelectedGroupForLink] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLinkGroups();
    fetchLinks();
  }, [fetchLinkGroups, fetchLinks]);

  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setShowGroupForm(true);
  };

  const handleEditGroup = (group: LinkGroup) => {
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo? Todos os links do grupo também serão excluídos.')) {
      await deleteLinkGroup(id);
    }
  };

  const handleAddLink = (groupId?: string) => {
    setEditingLink(undefined);
    setSelectedGroupForLink(groupId || '');
    setShowLinkForm(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setSelectedGroupForLink('');
    setShowLinkForm(true);
  };

  const handleDeleteLink = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este link?')) {
      await deleteLink(id);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSubmitGroupForm = async (data: LinkGroupFormData) => {
    try {
      if (editingGroup) {
        await updateLinkGroup(editingGroup.id, data);
      } else {
        await addLinkGroup(data);
      }
      setShowGroupForm(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const handleSubmitLinkForm = async (data: LinkFormData) => {
    try {
      const linkData = selectedGroupForLink 
        ? { ...data, group_id: selectedGroupForLink }
        : data;

      if (editingLink) {
        await updateLink(editingLink.id, linkData);
      } else {
        await addLink(linkData);
      }
      setShowLinkForm(false);
      setEditingLink(undefined);
      setSelectedGroupForLink('');
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  // Filter groups and links based on search
  const filteredGroups = Array.isArray(linkGroups) ? linkGroups.filter(group => {
    if (!searchTerm) return true;
    
    const groupMatches = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const groupLinks = getLinksByGroup(group.id);
    const linkMatches = groupLinks.some(link =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return groupMatches || linkMatches;
  }) : [];

  // Get links for a specific group with search filtering
  const getFilteredLinksByGroup = (groupId: string) => {
    const groupLinks = getLinksByGroup(groupId);
    if (!searchTerm) return groupLinks;
    
    return Array.isArray(groupLinks) ? groupLinks.filter(link =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) : [];
  };

  // Get filtered links for each group
  const getFilteredLinksForGroup = (groupId: string) => {
    const groupLinks = getLinksByGroup(groupId);
    if (!searchTerm) return groupLinks;
    
    return groupLinks.filter(link =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Get statistics
  const stats = getGroupStats();

  return (
    <div className="px-4 py-6 max-w-[95%] mx-auto xl:px-6 scroll-smooth touch-manipulation">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciamento de Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize seus links favoritos em grupos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddGroup}
            className="flex items-center gap-2 px-4 py-2 sm:py-3 sm:h-12 min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Folder className="w-5 h-5" />
            Novo Grupo
          </button>
          <button
            onClick={() => handleAddLink()}
            className="flex items-center gap-2 px-4 py-2 sm:py-3 sm:h-12 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Link
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Grupos
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalGroups}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <LinkIcon className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Links
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalLinks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Grupos Ativos
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.groupsWithLinks}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar grupos ou links..."
            className="w-full pl-12 pr-4 py-3 sm:h-12 min-h-[44px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      <ErrorMessage 
        error={error} 
        onRetry={() => {
          fetchLinkGroups();
          fetchLinks();
        }} 
        className="mb-6" 
      />

      {/* Loading State */}
      {loading && linkGroups.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && linkGroups.length === 0 && (
        <Empty
          icon={Folder}
          title="Nenhum grupo criado"
          description="Comece criando seu primeiro grupo de links"
          action={{
            label: 'Criar Grupo',
            onClick: handleAddGroup
          }}
        />
      )}

      {/* No Search Results */}
      {!loading && linkGroups.length > 0 && filteredGroups.length === 0 && searchTerm && (
        <Empty
          icon={Search}
          title="Nenhum resultado encontrado"
          description={`Nenhum grupo ou link encontrado para "${searchTerm}"`}
        />
      )}

      {/* Groups Grid */}
      {filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <LinkGroupCard
              key={group.id}
              group={group}
              links={getFilteredLinksForGroup(group.id)}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              onAddLink={handleAddLink}
              onEditLink={handleEditLink}
              onDeleteLink={handleDeleteLink}
              onOpenLink={handleOpenLink}
            />
          ))}
        </div>
      )}

      {/* Group Form Modal */}
      {showGroupForm && (
        <LinkGroupForm
          group={editingGroup}
          onSubmit={handleSubmitGroupForm}
          onClose={() => {
            setShowGroupForm(false);
            setEditingGroup(undefined);
          }}
          loading={loading}
        />
      )}

      {/* Link Form Modal */}
      {showLinkForm && (
        <LinkForm
          link={editingLink}
          groups={linkGroups}
          onSubmit={handleSubmitLinkForm}
          onClose={() => {
            setShowLinkForm(false);
            setEditingLink(undefined);
            setSelectedGroupForLink('');
          }}
          loading={loading}
        />
      )}
    </div>
  );
};