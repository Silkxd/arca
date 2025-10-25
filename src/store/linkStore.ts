import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Link, LinkGroup, LinkFormData, LinkGroupFormData } from '../types';

interface LinkStore {
  // State
  links: Link[];
  linkGroups: LinkGroup[];
  loading: boolean;
  error: string | null;
  selectedGroup: string;

  // Actions
  setSelectedGroup: (groupId: string) => void;
  fetchLinkGroups: () => Promise<void>;
  fetchLinks: () => Promise<void>;
  addLinkGroup: (data: LinkGroupFormData) => Promise<void>;
  updateLinkGroup: (id: string, data: LinkGroupFormData) => Promise<void>;
  deleteLinkGroup: (id: string) => Promise<void>;
  addLink: (data: LinkFormData) => Promise<void>;
  updateLink: (id: string, data: LinkFormData) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  getGroupStats: () => { totalGroups: number; totalLinks: number; groupsWithLinks: number };
  getLinksByGroup: (groupId: string) => Link[];
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  // Initial state
  links: [],
  linkGroups: [],
  loading: false,
  error: null,
  selectedGroup: '',

  // Actions
  setSelectedGroup: (groupId: string) => {
    set({ selectedGroup: groupId });
  },

  fetchLinkGroups: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('link_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ linkGroups: data || [] });
    } catch (error) {
      console.error('Error fetching link groups:', error);
      
      let errorMessage = 'Erro ao carregar grupos de links';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver seus grupos de links';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  fetchLinks: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('links')
        .select(`
          *,
          link_groups (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ links: data || [] });
    } catch (error) {
      console.error('Error fetching links:', error);
      
      let errorMessage = 'Erro ao carregar links';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver seus links';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  addLinkGroup: async (data: LinkGroupFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: newGroup, error } = await supabase
        .from('link_groups')
        .insert([{
          ...data,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        linkGroups: [newGroup, ...state.linkGroups]
      }));
    } catch (error) {
      console.error('Error adding link group:', error);
      set({ error: 'Erro ao criar grupo de links' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateLinkGroup: async (id: string, data: LinkGroupFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: updatedGroup, error } = await supabase
        .from('link_groups')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        linkGroups: state.linkGroups.map(group =>
          group.id === id ? updatedGroup : group
        )
      }));
    } catch (error) {
      console.error('Error updating link group:', error);
      set({ error: 'Erro ao atualizar grupo de links' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteLinkGroup: async (id: string) => {
    try {
      set({ loading: true, error: null });

      // First delete all links in the group
      const { error: linksError } = await supabase
        .from('links')
        .delete()
        .eq('group_id', id);

      if (linksError) throw linksError;

      // Then delete the group
      const { error } = await supabase
        .from('link_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        linkGroups: state.linkGroups.filter(group => group.id !== id),
        links: state.links.filter(link => link.group_id !== id),
        selectedGroup: state.selectedGroup === id ? '' : state.selectedGroup
      }));
    } catch (error) {
      console.error('Error deleting link group:', error);
      set({ error: 'Erro ao excluir grupo de links' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addLink: async (data: LinkFormData) => {
    try {
      set({ loading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Validate URL format
      let url = data.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const { data: newLink, error } = await supabase
        .from('links')
        .insert([{
          ...data,
          url,
          user_id: user.id
        }])
        .select(`
          *,
          link_groups (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        links: [newLink, ...state.links]
      }));
    } catch (error) {
      console.error('Error adding link:', error);
      set({ error: 'Erro ao adicionar link' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateLink: async (id: string, data: LinkFormData) => {
    try {
      set({ loading: true, error: null });

      // Validate URL format
      let url = data.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const { data: updatedLink, error } = await supabase
        .from('links')
        .update({ ...data, url })
        .eq('id', id)
        .select(`
          *,
          link_groups (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      set(state => ({
        links: state.links.map(link =>
          link.id === id ? updatedLink : link
        )
      }));
    } catch (error) {
      console.error('Error updating link:', error);
      set({ error: 'Erro ao atualizar link' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteLink: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        links: state.links.filter(link => link.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting link:', error);
      set({ error: 'Erro ao excluir link' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  getGroupStats: () => {
    const { linkGroups, links } = get();
    
    const groupsWithLinks = linkGroups.filter(group =>
      links.some(link => link.group_id === group.id)
    ).length;

    return {
      totalGroups: linkGroups.length,
      totalLinks: links.length,
      groupsWithLinks
    };
  },

  getLinksByGroup: (groupId: string) => {
    const { links } = get();
    return links.filter(link => link.group_id === groupId);
  }
}));