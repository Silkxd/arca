import React, { useState } from 'react';
import { Edit2, Trash2, Plus, FileText, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Note, NoteGroup } from '../../store/notesStore';

interface NoteGroupCardProps {
  group: NoteGroup;
  notes: Note[];
  onEditGroup: (group: NoteGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddNote: (groupId: string) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleImportance: (noteId: string) => void;
  onViewNote: (note: Note) => void;
}

export const NoteGroupCard: React.FC<NoteGroupCardProps> = ({
  group,
  notes,
  onEditGroup,
  onDeleteGroup,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onToggleImportance,
  onViewNote
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const importantNotesCount = notes.filter(note => note.is_important).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Group Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {group.name}
                </h3>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{notes.length} notas</span>
                {importantNotesCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {importantNotesCount} importantes
                  </span>
                )}
              </div>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditGroup(group)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteGroup(group.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <button
          onClick={() => onAddNote(group.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Nota
        </button>
      </div>

      {/* Notes List */}
      {isExpanded && (
        <div className="p-6 transition-all duration-300 ease-in-out">
          {notes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma nota neste grupo
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => onViewNote(note)}
                >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {note.title}
                    </h4>
                    {note.is_important && (
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleImportance(note.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.is_important
                          ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                      }`}
                      title={note.is_important ? 'Remover importância' : 'Marcar como importante'}
                    >
                      <Star className={`w-4 h-4 ${note.is_important ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNote(note);
                      }}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  <div 
                    dangerouslySetInnerHTML={{ __html: note.content }} 
                    className="prose prose-sm max-w-none dark:prose-invert"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(note.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
};