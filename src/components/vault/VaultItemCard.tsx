import React, { useState } from 'react';
import { Eye, Download, Trash2, Edit, FileText, Image, File, Calendar, Tag } from 'lucide-react';
import { VaultItem } from '../../types';
import { VaultItemForm } from './VaultItemForm';

interface VaultItemCardProps {
  item: VaultItem;
  onDelete: (id: string, title: string) => void;
}

export const VaultItemCard: React.FC<VaultItemCardProps> = ({ item, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-5 h-5" />;
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType === 'application/pdf') return <File className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (item.file_url) {
      const link = document.createElement('a');
      link.href = item.file_url;
      link.download = item.file_name || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleViewContent = () => {
    if (item.type === 'text') {
      setShowContent(!showContent);
    } else if (item.file_url) {
      window.open(item.file_url, '_blank');
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow arca-card-elevated">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex-shrink-0">
              {item.type === 'document' ? getFileIcon(item.file_type) : <FileText className="w-5 h-5 text-green-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 dark:text-white text-lg leading-6 pr-2"
                title={item.title}
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                <span className="capitalize">{item.type === 'document' ? 'Documento' : 'Texto'}</span>
                {item.category && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={handleViewContent}
              className="p-2 sm:p-3 sm:h-12 min-h-[44px] text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title={item.type === 'text' ? 'Ver conteúdo' : 'Abrir arquivo'}
            >
              <Eye className="w-5 h-5" />
            </button>
            
            {item.type === 'document' && item.file_url && (
              <button
                onClick={handleDownload}
                className="p-2 sm:p-3 sm:h-12 min-h-[44px] text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Baixar arquivo"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => setShowEditForm(true)}
              className="p-2 sm:p-3 sm:h-12 min-h-[44px] text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => onDelete(item.id, item.title)}
              className="p-2 sm:p-3 sm:h-12 min-h-[44px] text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Info for Documents */}
        {item.type === 'document' && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {item.file_name}
              </span>
              {item.file_size && (
                <span className="text-gray-500 dark:text-gray-500">
                  {formatFileSize(item.file_size)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content Preview for Text Items */}
        {item.type === 'text' && showContent && item.content && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {item.content}
            </pre>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {item.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Criado em {formatDate(item.created_at)}</span>
          </div>
          {item.updated_at !== item.created_at && (
            <span>Atualizado em {formatDate(item.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <VaultItemForm
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            setShowEditForm(false);
            // The parent component will handle refreshing the data
          }}
          initialData={{
            title: item.title,
            type: item.type,
            content: item.content,
            category: item.category,
            notes: item.notes,
          }}
          isEditing={true}
          itemId={item.id}
        />
      )}
    </>
  );
};
