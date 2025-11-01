import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { PJProject, PJProjectFormData, PJProjectAnalytics } from '../types';

interface ProjectsStore {
  projects: PJProject[];
  analytics: PJProjectAnalytics | null;
  loading: boolean;
  error: string | null;
  selectedStatus: string;
  selectedContractor: string;
  searchTerm: string;
  
  // Actions
  setSelectedStatus: (status: string) => void;
  setSelectedContractor: (contractor: string) => void;
  setSearchTerm: (term: string) => void;
  fetchProjects: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  addProject: (data: PJProjectFormData) => Promise<void>;
  updateProject: (id: string, data: PJProjectFormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getFilteredProjects: () => PJProject[];
  getStatusOptions: () => string[];
  getContractorOptions: () => string[];
  clearProjects: () => void;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  analytics: null,
  loading: false,
  error: null,
  selectedStatus: '',
  selectedContractor: '',
  searchTerm: '',

  setSelectedStatus: (status) => set({ selectedStatus: status }),
  
  setSelectedContractor: (contractor) => set({ selectedContractor: contractor }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchProjects: async () => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('pj_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ projects: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      let errorMessage = 'Erro ao carregar projetos';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver seus projetos';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido - tente novamente';
        }
      }
      
      set({ 
        error: errorMessage,
        loading: false 
      });
    }
  },

  fetchAnalytics: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .rpc('get_pj_projects_analytics', { p_user_id: user.id });

      if (error) throw error;

      set({ analytics: data || null });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      let errorMessage = 'Erro ao carregar análises';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Erro de conexão - verifique sua internet';
        } else if (error.message.includes('Usuário não autenticado')) {
          errorMessage = 'Faça login para ver as análises';
        }
      }
      
      set({ error: errorMessage });
    }
  },

  addProject: async (data) => {
    set({ loading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: newProject, error } = await supabase
        .from('pj_projects')
        .insert({
          user_id: user.id,
          cidade: data.cidade,
          projeto: data.projeto,
          contratante: data.contratante,
          lotes: data.lotes,
          shape: data.shape,
          valor: data.valor,
          status: data.status,
          pago: data.pago,
          obs: data.obs,
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: [newProject, ...state.projects],
        loading: false
      }));

      // Refresh analytics after adding
      get().fetchAnalytics();
    } catch (error) {
      console.error('Error adding project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar projeto',
        loading: false 
      });
    }
  },

  updateProject: async (id, data) => {
    set({ loading: true, error: null });
    
    try {
      const { data: updatedProject, error } = await supabase
        .from('pj_projects')
        .update({
          cidade: data.cidade,
          projeto: data.projeto,
          contratante: data.contratante,
          lotes: data.lotes,
          shape: data.shape,
          valor: data.valor,
          status: data.status,
          pago: data.pago,
          obs: data.obs,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        projects: state.projects.map(p => p.id === id ? updatedProject : p),
        loading: false
      }));

      // Refresh analytics after updating
      get().fetchAnalytics();
    } catch (error) {
      console.error('Error updating project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar projeto',
        loading: false 
      });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('pj_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        loading: false
      }));

      // Refresh analytics after deleting
      get().fetchAnalytics();
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao excluir projeto',
        loading: false 
      });
    }
  },

  getFilteredProjects: () => {
    const { projects, selectedStatus, selectedContractor, searchTerm } = get();
    
    return projects.filter(project => {
      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      const matchesContractor = !selectedContractor || project.contratante === selectedContractor;
      const matchesSearch = !searchTerm || 
        project.projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.contratante.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesContractor && matchesSearch;
    });
  },

  getStatusOptions: () => {
    const { projects } = get();
    const statuses = [...new Set(projects.map(p => p.status))];
    return statuses.sort();
  },

  getContractorOptions: () => {
    const { projects } = get();
    const contractors = [...new Set(projects.map(p => p.contratante))];
    return contractors.sort();
  },

  clearProjects: () => set({ 
    projects: [], 
    analytics: null,
    selectedStatus: '',
    selectedContractor: '',
    searchTerm: '',
    error: null 
  }),
}));