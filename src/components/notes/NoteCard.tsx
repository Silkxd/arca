import React from 'react';
import { Star, Calendar, Folder, Trash2 } from 'lucide-react';
import { Note, NoteGroup } from '../../store/notesStore';

interface NoteCardProps {
  note: Note;
  group?: NoteGroup;
  onClick: () => void;
  onToggleImportant?: (noteId: string) => void;
  onDelete?: (noteId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  group,
  onClick,
  onToggleImportant,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleImportant) {
      onToggleImportant(note.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className="
        group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        hover:border-emerald-200 dark:hover:border-emerald-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 
        cursor-pointer p-4 h-32 flex flex-col justify-between
        hover:scale-[1.02] active:scale-[0.98]
      "
    >
      {/* Header com título e ações */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="
          text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 
          group-hover:text-emerald-900 dark:group-hover:text-emerald-300 transition-colors flex-1 mr-2
        ">
          {note.title || 'Nota sem título'}
        </h3>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          {onToggleImportant && (
            <button
              onClick={handleStarClick}
              className={`
                p-1 rounded-full transition-all duration-200
                ${note.is_important 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                }
              `}
            >
              <Star 
                size={16} 
                className={note.is_important ? 'fill-current' : ''} 
              />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="
                p-1 rounded-full transition-all duration-200
                text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 
                hover:bg-red-50 dark:hover:bg-red-900/30
                opacity-0 group-hover:opacity-100
              "
              title="Excluir nota"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Footer com informações */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          {/* Data de criação */}
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(note.created_at)}</span>
          </div>
          
          {/* Grupo */}
          {group && (
            <div className="flex items-center space-x-1">
              <Folder size={12} />
              <span className="truncate max-w-20">{group.name}</span>
            </div>
          )}
        </div>

        {/* Indicador de conteúdo */}
        {note.content && note.content.trim().length > 0 && (
          <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full opacity-60" />
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="
        absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-50 dark:from-emerald-900/20 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
      " />

      {/* Indicador de nota importante */}
      {note.is_important && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full" />
      )}
    </div>
  );
};