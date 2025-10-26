import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  group_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  note_groups?: NoteGroup;
}

export interface NoteGroup {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  is_important?: boolean;
  group_id: string;
}

export interface NoteGroupFormData {
  name: string;
  color: string;
}

interface NotesStore {
  // State
  notes: Note[];
  noteGroups: NoteGroup[];
  loading: boolean;
  error: string | null;
  selectedGroup: string;
  showImportantOnly: boolean;

  // Actions
  setSelectedGroup: (groupId: string) => void;
  setShowImportantOnly: (show: boolean) => void;
  fetchNoteGroups: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  addNoteGroup: (data: NoteGroupFormData) => Promise<void>;
  updateNoteGroup: (id: string, data: NoteGroupFormData) => Promise<void>;
  deleteNoteGroup: (id: string) => Promise<void>;
  addNote: (data: NoteFormData) => Promise<void>;
  updateNote: (id: string, data: NoteFormData) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleNoteImportance: (id: string) => Promise<void>;
  getGroupStats: () => { totalGroups: number; totalNotes: number; importantNotes: number };
  getNotesByGroup: (groupId: string) => Note[];
  getImportantNotes: () => Note[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Initial state
  notes: [],
  noteGroups: [],
  loading: false,
  error: null,
  selectedGroup: '',
  showImportantOnly: false,

  // Actions
  setSelectedGroup: (groupId: string) => {
    set({ selectedGroup: groupId });
  },

  setShowImportantOnly: (show: boolean) => {
    set({ showImportantOnly: show });
  },

  fetchNoteGroups: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('note_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ noteGroups: data || [] });
    } catch (error) {
      console.error('Error fetching note groups:', error);
      
      let errorMessage = 'Erro ao carregar grupos de notas';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver seus grupos de notas';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          note_groups (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ notes: data || [] });
    } catch (error) {
      console.error('Error fetching notes:', error);
      
      let errorMessage = 'Erro ao carregar notas';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver suas notas';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  addNoteGroup: async (data: NoteGroupFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: newGroup, error } = await supabase
        .from('note_groups')
        .insert([{
          ...data,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        noteGroups: [newGroup, ...state.noteGroups]
      }));
    } catch (error) {
      console.error('Error adding note group:', error);
      set({ error: 'Erro ao criar grupo de notas' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateNoteGroup: async (id: string, data: NoteGroupFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: updatedGroup, error } = await supabase
        .from('note_groups')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        noteGroups: state.noteGroups.map(group =>
          group.id === id ? updatedGroup : group
        )
      }));
    } catch (error) {
      console.error('Error updating note group:', error);
      set({ error: 'Erro ao atualizar grupo de notas' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteNoteGroup: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('note_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        noteGroups: state.noteGroups.filter(group => group.id !== id),
        notes: state.notes.filter(note => note.group_id !== id)
      }));
    } catch (error) {
      console.error('Error deleting note group:', error);
      set({ error: 'Erro ao excluir grupo de notas' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addNote: async (data: NoteFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: newNote, error } = await supabase
        .from('notes')
        .insert([{
          ...data,
          user_id: user.id
        }])
        .select(`
          *,
          note_groups (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        notes: [newNote, ...state.notes]
      }));
    } catch (error) {
      console.error('Error adding note:', error);
      set({ error: 'Erro ao adicionar nota' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateNote: async (id: string, data: NoteFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: updatedNote, error } = await supabase
        .from('notes')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          note_groups (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        notes: state.notes.map(note =>
          note.id === id ? updatedNote : note
        )
      }));
    } catch (error) {
      console.error('Error updating note:', error);
      set({ error: 'Erro ao atualizar nota' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteNote: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        notes: state.notes.filter(note => note.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
      set({ error: 'Erro ao excluir nota' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleNoteImportance: async (id: string) => {
    try {
      const { notes } = get();
      const note = notes.find(n => n.id === id);
      if (!note) return;

      const { data: updatedNote, error } = await supabase
        .from('notes')
        .update({ is_important: !note.is_important })
        .eq('id', id)
        .select(`
          *,
          note_groups (
            id,
            name
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        notes: state.notes.map(note =>
          note.id === id ? updatedNote : note
        )
      }));
    } catch (error) {
      console.error('Error toggling note importance:', error);
      set({ error: 'Erro ao alterar importância da nota' });
      throw error;
    }
  },

  getGroupStats: () => {
    const { noteGroups, notes } = get();
    
    const importantNotes = notes.filter(note => note.is_important).length;

    return {
      totalGroups: noteGroups.length,
      totalNotes: notes.length,
      importantNotes
    };
  },

  getNotesByGroup: (groupId: string) => {
    const { notes } = get();
    return notes.filter(note => note.group_id === groupId);
  },

  getImportantNotes: () => {
    const { notes } = get();
    return notes.filter(note => note.is_important);
  }
}));