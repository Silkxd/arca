import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, FileText, Folder, AlertCircle, Star } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import { NoteSidebar } from '../components/notes/NoteSidebar';
import { SearchBar } from '../components/ui/SearchBar';
import { NoteGrid } from '../components/notes/NoteGrid';
import { NoteGroupForm } from '../components/notes/NoteGroupForm';
import { NoteForm } from '../components/notes/NoteForm';
import { NoteViewModal } from '../components/notes/NoteViewModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { DeleteGroupModal } from '../components/ui/DeleteGroupModal';
import { Note, NoteGroup, NoteFormData, NoteGroupFormData } from '../store/notesStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorBoundary';

export const Notes: React.FC = () => {
  const {
    notes,
    noteGroups,
    loading,
    error,
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
  } = useNotesStore();

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modal states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<NoteGroup | undefined>();
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [selectedGroupForNote, setSelectedGroupForNote] = useState('');
  const [viewingNote, setViewingNote] = useState<Note | undefined>();
  const [deleteNoteModal, setDeleteNoteModal] = useState({ isOpen: false, noteId: '', noteTitle: '' });
  const [deleteGroupModal, setDeleteGroupModal] = useState({ isOpen: false, groupId: '', groupName: '' });
  const [deleteGroupSpecialModal, setDeleteGroupSpecialModal] = useState({ isOpen: false, groupId: '', groupName: '' });

  // Fetch data on mount
  useEffect(() => {
    fetchNoteGroups();
    fetchNotes();
  }, [fetchNoteGroups, fetchNotes]);

  // Filtered notes based on search and selected group
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by group
    if (selectedGroupId === 'important') {
      filtered = filtered.filter(note => note.is_important);
    } else if (selectedGroupId && selectedGroupId !== null) {
      filtered = filtered.filter(note => note.group_id === selectedGroupId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [notes, selectedGroupId, searchTerm]);

  // Get selected group name for display
  const selectedGroupName = useMemo(() => {
    if (selectedGroupId === 'important') return 'Notas Importantes';
    if (selectedGroupId === null) return 'Todas as notas';
    const group = noteGroups.find(g => g.id === selectedGroupId);
    return group?.name || 'Grupo não encontrado';
  }, [selectedGroupId, noteGroups]);

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

  const handleDeleteGroupFromForm = (groupId: string) => {
    const group = noteGroups.find(g => g.id === groupId);
    if (group) {
      setDeleteGroupSpecialModal({ isOpen: true, groupId, groupName: group.name });
    }
  };

  const confirmDeleteGroupSpecial = async () => {
    try {
      await deleteNoteGroup(deleteGroupSpecialModal.groupId);
      setDeleteGroupSpecialModal({ isOpen: false, groupId: '', groupName: '' });
      setShowGroupForm(false);
      setEditingGroup(undefined);
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <NoteSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onEditGroup={handleEditGroup}
        onAddGroup={handleAddGroup}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
            showMobileMenu={isMobileSidebarOpen}
            placeholder="Buscar notas..."
            className="max-w-2xl"
            onAddNote={() => setShowNoteForm(true)}
            actionLabel="Nova Nota"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Error Message */}
          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={() => {
                fetchNoteGroups();
                fetchNotes();
              }} 
              className="mb-6" 
            />
          )}

          {/* Loading State */}
          {loading && notes.length === 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <NoteGrid
              notes={filteredNotes}
              noteGroups={noteGroups}
              onNoteClick={handleViewNote}
              onToggleImportant={handleToggleImportance}
              onDeleteNote={handleDeleteNote}
              isLoading={loading}
              searchTerm={searchTerm}
              selectedGroupName={selectedGroupName}
            />
          )}
        </div>
      </div>

      {/* Group Form Modal */}
      {showGroupForm && (
        <NoteGroupForm
          group={editingGroup}
          onSubmit={handleSubmitGroupForm}
          onClose={() => {
            setShowGroupForm(false);
            setEditingGroup(undefined);
          }}
          onDelete={handleDeleteGroupFromForm}
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

      {/* Delete Group Special Modal */}
      <DeleteGroupModal
        isOpen={deleteGroupSpecialModal.isOpen}
        onClose={() => setDeleteGroupSpecialModal({ isOpen: false, groupId: '', groupName: '' })}
        onConfirm={confirmDeleteGroupSpecial}
        groupName={deleteGroupSpecialModal.groupName}
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
