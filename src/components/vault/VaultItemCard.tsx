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

  const getFileExt = (name?: string) => {
    if (!name) return ''
    const parts = name.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
  }

  const getTypeLabel = (fileType?: string, fileName?: string) => {
    const ext = getFileExt(fileName)
    if (ext) return ext
    if (!fileType) return 'ARQ'
    if (fileType === 'application/pdf') return 'PDF'
    if (fileType.startsWith('image/')) {
      const sub = fileType.split('/')[1]?.toUpperCase() || ''
      return sub === 'JPEG' ? 'JPG' : sub
    }
    const sub = fileType.split('/')[1]?.toUpperCase()
    return sub || 'ARQ'
  }

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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-2 hover:shadow-md transition-shadow arca-card-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-end gap-2 mb-3">
          <button
            onClick={handleViewContent}
            className="p-2 h-10 min-h-[40px] text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title={item.type === 'text' ? 'Ver conteúdo' : 'Abrir arquivo'}
          >
            <Eye className="w-4 h-4" />
          </button>
          {item.type === 'document' && item.file_url && (
            <button
              onClick={handleDownload}
              className="p-2 h-10 min-h-[40px] text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Baixar arquivo"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowEditForm(true)}
            className="p-2 h-10 min-h-[40px] text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id, item.title)}
            className="p-2 h-10 min-h-[40px] text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-md">
            {item.type === 'document' ? getFileIcon(item.file_type) : <FileText className="w-4 h-4 text-green-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-gray-900 dark:text-white text-sm leading-5 pr-2 truncate whitespace-nowrap"
              title={item.title}
            >
              {item.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
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

        {/* File Info for Documents */}
        {item.type === 'document' && (
          <div className="mb-2">
            <div className="w-full overflow-hidden">
              <div className="flex items-center justify-between px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600">
                    {item.file_type ? getFileIcon(item.file_type) : <FileText className="w-3.5 h-3.5" />}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                    {getTypeLabel(item.file_type, item.file_name)}
                  </span>
                  {item.file_size && (
                    <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                      {formatFileSize(item.file_size)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Preview for Text Items */}
        {item.type === 'text' && showContent && item.content && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {item.content}
            </pre>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mb-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
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
