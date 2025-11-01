import React from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { Note, NoteGroup } from '../../store/notesStore';
import { NoteCard } from './NoteCard';

interface NoteGridProps {
  notes: Note[];
  noteGroups: NoteGroup[];
  onNoteClick: (note: Note) => void;
  onToggleImportant?: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
  selectedGroupName?: string;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
  notes,
  noteGroups,
  onNoteClick,
  onToggleImportant,
  onDeleteNote,
  isLoading = false,
  searchTerm = '',
  selectedGroupName,
}) => {
  // Função para encontrar o grupo de uma nota
  const findNoteGroup = (groupId: string | null) => {
    if (!groupId) return undefined;
    return noteGroups.find(group => group.id === groupId);
  };

  // Estados de loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-700 rounded-xl h-32 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Estado vazio - nenhuma nota
  if (notes.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
          <FileText size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {selectedGroupName ? `Nenhuma nota em "${selectedGroupName}"` : 'Nenhuma nota criada'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          {selectedGroupName 
            ? 'Este grupo ainda não possui notas. Crie sua primeira nota para começar.'
            : 'Comece criando sua primeira nota para organizar suas ideias e pensamentos.'
          }
        </p>
        

      </div>
    );
  }

  // Estado vazio - busca sem resultados
  if (notes.length === 0 && searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
          <Search size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Nenhum resultado encontrado
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          Não encontramos notas que correspondam a "{searchTerm}". 
          Tente usar termos diferentes ou criar uma nova nota.
        </p>
        

      </div>
    );
  }

  // Grid com notas
  return (
    <div className="space-y-6">
      {/* Header com informações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedGroupName || 'Todas as notas'}
          </h2>
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>
        

      </div>

      {/* Grid de notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            group={findNoteGroup(note.group_id)}
            onClick={() => onNoteClick(note)}
            onToggleImportant={onToggleImportant}
            onDelete={onDeleteNote}
          />
        ))}
      </div>

      {/* Informações adicionais no rodapé */}
      {notes.length > 0 && (
        <div className="flex items-center justify-center pt-8 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {searchTerm 
              ? `${notes.length} resultado${notes.length !== 1 ? 's' : ''} para "${searchTerm}"`
              : `Exibindo ${notes.length} nota${notes.length !== 1 ? 's' : ''}`
            }
          </span>
        </div>
      )}
    </div>
  );
};