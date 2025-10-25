import React from 'react';
import { X, Edit2, Star, FileText } from 'lucide-react';
import { Note } from '../../store/notesStore';

interface NoteViewModalProps {
  note: Note;
  onClose: () => void;
  onEdit: (note: Note) => void;
}

export const NoteViewModal: React.FC<NoteViewModalProps> = ({
  note,
  onClose,
  onEdit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {note.title}
                </h2>
                {note.is_important && (
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {note.note_groups?.name && `Grupo: ${note.note_groups.name} • `}
                Criado em {new Date(note.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(note)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div 
              dangerouslySetInnerHTML={{ __html: note.content }}
              className="min-h-[200px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};