import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, ExternalLink, Plus, Folder, Edit2 } from 'lucide-react';
import { LinkGroup, Link } from '../../store/linkStore';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface LinkGroupCardProps {
  group: LinkGroup;
  links: Link[];
  onEditGroup: (group: LinkGroup) => void;
  onDeleteGroup: (id: string) => void;
  onAddLink: (groupId: string) => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (id: string) => void;
  onOpenLink: (url: string) => void;
}

export const LinkGroupCard: React.FC<LinkGroupCardProps> = ({
  group,
  links,
  onEditGroup,
  onDeleteGroup,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onOpenLink
}) => {
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);
  const [deleteLinkModal, setDeleteLinkModal] = useState<{
    isOpen: boolean;
    linkId: string;
    linkTitle: string;
  }>({
    isOpen: false,
    linkId: '',
    linkTitle: ''
  });
  const [showGroupMenu, setShowGroupMenu] = React.useState(false);
  const [showLinkMenus, setShowLinkMenus] = React.useState<Record<string, boolean>>({});

  const toggleGroupMenu = () => setShowGroupMenu(!showGroupMenu);
  
  const toggleLinkMenu = (linkId: string) => {
    setShowLinkMenus(prev => ({
      ...prev,
      [linkId]: !prev[linkId]
    }));
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', border: 'border-blue-200 dark:border-blue-800', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', border: 'border-green-200 dark:border-green-800', hover: 'hover:bg-green-100 dark:hover:bg-green-900/30' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', border: 'border-purple-200 dark:border-purple-800', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30' },
      pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600', border: 'border-pink-200 dark:border-pink-800', hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30' },
      yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600', border: 'border-yellow-200 dark:border-yellow-800', hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600', border: 'border-red-200 dark:border-red-800', hover: 'hover:bg-red-100 dark:hover:bg-red-900/30' },
      indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600', border: 'border-indigo-200 dark:border-indigo-800', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30' },
      gray: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600', border: 'border-gray-200 dark:border-gray-800', hover: 'hover:bg-gray-100 dark:hover:bg-gray-900/30' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colorClasses = getColorClasses(group.color);

  return (
    <div className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl p-6 transition-all duration-200 ${colorClasses.hover}`}>
      {/* Group Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorClasses.bg} rounded-xl`}>
            <Folder className={`w-5 h-5 ${colorClasses.text}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {group.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleGroupMenu}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {showGroupMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-10 min-w-[150px]">
              <button
                onClick={() => {
                  onEditGroup(group);
                  setShowGroupMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit className="w-4 h-4" />
                Editar Grupo
              </button>
              <button
                onClick={() => {
                  setDeleteGroupModal(true);
                  setShowGroupMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Grupo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-8">
            <div className={`inline-flex p-3 ${colorClasses.bg} rounded-xl mb-3`}>
              <ExternalLink className={`w-6 h-6 ${colorClasses.text}`} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nenhum link neste grupo
            </p>
            <button
              onClick={() => onAddLink(group.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 ${colorClasses.text} bg-white dark:bg-gray-800 border ${colorClasses.border} rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
            >
              <Plus className="w-4 h-4" />
              Adicionar Link
            </button>
          </div>
        ) : (
          <>
            {links.map(link => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors group"
              >
                <button
                  onClick={() => onOpenLink(link.url)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {link.title}
                    </p>
                    {link.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {link.description}
                      </p>
                    )}
                  </div>
                </button>

                <div className="relative">
                  <button
                    onClick={() => toggleLinkMenu(link.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showLinkMenus[link.id] && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          onEditLink(link);
                          setShowLinkMenus(prev => ({ ...prev, [link.id]: false }));
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteLinkModal({
                            isOpen: true,
                            linkId: link.id,
                            linkTitle: link.title
                          });
                          setShowLinkMenus({});
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add Link Button */}
            <button
              onClick={() => onAddLink(group.id)}
              className={`w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed ${colorClasses.border} ${colorClasses.text} rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors`}
            >
              <Plus className="w-4 h-4" />
              Adicionar Link
            </button>
          </>
        )}
      </div>

      {/* Group Stats */}
      <div className="mt-4 pt-4 border-t border-white/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
          <span className={`${colorClasses.text} font-medium`}>
            {group.color.charAt(0).toUpperCase() + group.color.slice(1)}
          </span>
        </div>
      </div>

      {/* Delete Group Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteGroupModal}
        onClose={() => setDeleteGroupModal(false)}
        onConfirm={() => {
          onDeleteGroup(group.id);
          setDeleteGroupModal(false);
        }}
        title="Excluir Grupo"
        message={`Tem certeza que deseja excluir o grupo "${group.name}"? Todos os links dentro deste grupo também serão excluídos. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Delete Link Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteLinkModal.isOpen}
        onClose={() => setDeleteLinkModal({ isOpen: false, linkId: '', linkTitle: '' })}
        onConfirm={() => {
          onDeleteLink(deleteLinkModal.linkId);
          setDeleteLinkModal({ isOpen: false, linkId: '', linkTitle: '' });
        }}
        title="Excluir Link"
        message={`Tem certeza que deseja excluir o link "${deleteLinkModal.linkTitle}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};