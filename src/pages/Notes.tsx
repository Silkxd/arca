import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, Folder, AlertCircle, Star } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import { NoteGroupCard } from '../components/notes/NoteGroupCard';
import { NoteGroupForm } from '../components/notes/NoteGroupForm';
import { NoteForm } from '../components/notes/NoteForm';
import { NoteViewModal } from '../components/notes/NoteViewModal';
import { Empty } from '../components/Empty';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { Note, NoteGroup, NoteFormData, NoteGroupFormData } from '../store/notesStore';
import { LoadingSpinner, LoadingCard } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorBoundary';

export const Notes: React.FC = () => {
  const {
    notes,
    noteGroups,
    loading,
    error,
    selectedGroup,
    showImportantOnly,
    setSelectedGroup,
    setShowImportantOnly,
    fetchNoteGroups,
    fetchNotes,
    addNoteGroup,
    updateNoteGroup,
    deleteNoteGroup,
    addNote,
    updateNote,
    deleteNote,
    toggleNoteImportance,
    getGroupStats,
    getNotesByGroup,
    getImportantNotes
  } = useNotesStore();

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<NoteGroup | undefined>();
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [selectedGroupForNote, setSelectedGroupForNote] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteNoteModal, setDeleteNoteModal] = useState({ isOpen: false, noteId: '', noteTitle: '' });
  const [deleteGroupModal, setDeleteGroupModal] = useState({ isOpen: false, groupId: '', groupName: '' });
  const [viewingNote, setViewingNote] = useState<Note | undefined>();

  useEffect(() => {
    fetchNoteGroups();
    fetchNotes();
  }, [fetchNoteGroups, fetchNotes]);

  const handleAddGroup = () => {
    setEditingGroup(undefined);
    setShowGroupForm(true);
  };

  const handleEditGroup = (group: NoteGroup) => {
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    const group = noteGroups.find(g => g.id === groupId);
    if (group) {
      setDeleteGroupModal({ isOpen: true, groupId, groupName: group.name });
    }
  };

  const handleAddNote = (groupId?: string) => {
    setEditingNote(undefined);
    setSelectedGroupForNote(groupId || '');
    setShowNoteForm(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setSelectedGroupForNote('');
    setShowNoteForm(true);
  };

  const handleDeleteNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setDeleteNoteModal({ isOpen: true, noteId, noteTitle: note.title });
    }
  };

  const confirmDeleteNote = async () => {
    try {
      await deleteNote(deleteNoteModal.noteId);
      setDeleteNoteModal({ isOpen: false, noteId: '', noteTitle: '' });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const confirmDeleteGroup = async () => {
    try {
      await deleteNoteGroup(deleteGroupModal.groupId);
      setDeleteGroupModal({ isOpen: false, groupId: '', groupName: '' });
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleToggleImportance = async (noteId: string) => {
    try {
      await toggleNoteImportance(noteId);
    } catch (error) {
      console.error('Error toggling note importance:', error);
    }
  };

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };

  const handleSubmitGroupForm = async (data: NoteGroupFormData) => {
    try {
      if (editingGroup) {
        await updateNoteGroup(editingGroup.id, data);
      } else {
        await addNoteGroup(data);
      }
      setShowGroupForm(false);
      setEditingGroup(undefined);
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };

  const handleSubmitNoteForm = async (data: NoteFormData) => {
    try {
      const noteData = selectedGroupForNote 
        ? { ...data, group_id: selectedGroupForNote }
        : data;

      if (editingNote) {
        await updateNote(editingNote.id, noteData);
      } else {
        await addNote(noteData);
      }
      setShowNoteForm(false);
      setEditingNote(undefined);
      setSelectedGroupForNote('');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Filter groups and notes based on search and importance filter
  const filteredGroups = Array.isArray(noteGroups) ? noteGroups.filter(group => {
    if (!searchTerm && !showImportantOnly) return true;
    
    const groupMatches = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const groupNotes = getNotesByGroup(group.id);
    const filteredGroupNotes = showImportantOnly 
      ? (Array.isArray(groupNotes) ? groupNotes.filter(note => note.is_important) : [])
      : groupNotes;
    
    const noteMatches = Array.isArray(filteredGroupNotes) ? filteredGroupNotes.some(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) : false;
    
    return groupMatches || noteMatches;
  }) : [];

  // Get filtered notes for each group
  const getFilteredNotesForGroup = (groupId: string) => {
    let groupNotes = getNotesByGroup(groupId);
    
    if (showImportantOnly) {
      groupNotes = Array.isArray(groupNotes) ? groupNotes.filter(note => note.is_important) : [];
    }
    
    if (searchTerm) {
      return Array.isArray(groupNotes) ? groupNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) : [];
    }
    
    return groupNotes;
  };

  // Get statistics
  const stats = getGroupStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciamento de Notas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize suas notas em grupos e marque as importantes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddGroup}
            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Folder className="w-5 h-5" />
            Novo Grupo
          </button>
          <button
            onClick={() => handleAddNote()}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Nota
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Notas
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalNotes}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Notas Importantes
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.importantNotes}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar grupos ou notas..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowImportantOnly(!showImportantOnly)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
            showImportantOnly
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Star className={`w-5 h-5 ${showImportantOnly ? 'fill-current' : ''}`} />
          {showImportantOnly ? 'Mostrar Todas' : 'Apenas Importantes'}
        </button>
      </div>

      {/* Error Message */}
      <ErrorMessage 
        error={error} 
        onRetry={() => {
          fetchNoteGroups();
          fetchNotes();
        }} 
        className="mb-6" 
      />

      {/* Loading State */}
      {loading && noteGroups.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && noteGroups.length === 0 && (
        <Empty
          icon={Folder}
          title="Nenhum grupo criado"
          description="Comece criando seu primeiro grupo de notas"
          action={{
            label: 'Criar Grupo',
            onClick: handleAddGroup
          }}
        />
      )}

      {/* No Search Results */}
      {!loading && noteGroups.length > 0 && filteredGroups.length === 0 && (searchTerm || showImportantOnly) && (
        <Empty
          icon={Search}
          title="Nenhum resultado encontrado"
          description={
            showImportantOnly 
              ? "Nenhuma nota importante encontrada"
              : `Nenhum grupo ou nota encontrado para "${searchTerm}"`
          }
        />
      )}

      {/* Groups Grid */}
      {filteredGroups.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <NoteGroupCard
              key={group.id}
              group={group}
              notes={getFilteredNotesForGroup(group.id)}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onToggleImportance={handleToggleImportance}
              onViewNote={handleViewNote}
            />
          ))}
        </div>
      )}

      {/* Group Form Modal */}
      {showGroupForm && (
        <NoteGroupForm
          group={editingGroup}
          onSubmit={handleSubmitGroupForm}
          onClose={() => {
            setShowGroupForm(false);
            setEditingGroup(undefined);
          }}
          loading={loading}
        />
      )}

      {/* Note Form Modal */}
      {showNoteForm && (
        <NoteForm
          note={editingNote}
          groups={noteGroups}
          onSubmit={handleSubmitNoteForm}
          onClose={() => {
            setShowNoteForm(false);
            setEditingNote(undefined);
            setSelectedGroupForNote('');
          }}
          loading={loading}
        />
      )}

      {/* Delete Note Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteNoteModal.isOpen}
        onClose={() => setDeleteNoteModal({ isOpen: false, noteId: '', noteTitle: '' })}
        onConfirm={confirmDeleteNote}
        title="Excluir Nota"
        message={`Tem certeza que deseja excluir a nota "${deleteNoteModal.noteTitle}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Delete Group Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteGroupModal.isOpen}
        onClose={() => setDeleteGroupModal({ isOpen: false, groupId: '', groupName: '' })}
        onConfirm={confirmDeleteGroup}
        title="Excluir Grupo"
        message={`Tem certeza que deseja excluir o grupo "${deleteGroupModal.groupName}"? Todas as notas do grupo também serão excluídas. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Note View Modal */}
      {viewingNote && (
        <NoteViewModal
          note={viewingNote}
          onClose={() => setViewingNote(undefined)}
          onEdit={(note) => {
            setViewingNote(undefined);
            handleEditNote(note);
          }}
        />
      )}
    </div>
  );
};

export default Notes;